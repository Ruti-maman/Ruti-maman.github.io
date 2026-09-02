/**
 * verify-site.js — proves the live-preview feature works, from outside the
 * filtered office network.
 *
 * It drives the published portfolio the way a visitor would: hover a project,
 * look at the preview, open it, wait for the real app to load, and then check
 * the app actually PAINTED something rather than loading to a blank frame.
 * Every step is photographed into verify/, which gets committed, so the result
 * can be inspected from a machine that cannot reach github.io at all.
 *
 * This is a test, not a feature. Two questions only: does the hover show a
 * real screenshot, and does the click actually run the app.
 */

const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const SITE = "https://ruti-maman.github.io/";
const OUT = path.join(__dirname, "..", "verify");

// Every project that claims a live build. `expect` is a string that must show
// up in the running app's own DOM — the difference between "the iframe loaded"
// and "the app works".
const CASES = [
  { id: "helpdesk", expect: "התחברות" },
  { id: "taskman",  expect: "Tasks" },
  { id: "memory",   expect: "ברוכים" },
];

const problems = [];
function check(ok, what) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${what}`);
  if (!ok) problems.push(what);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  const jsErrors = [];
  page.on("pageerror", (e) => jsErrors.push(String(e)));

  // Pages serves index.html with max-age=600, so a verify run inside ten
  // minutes of a deploy can drive the PREVIOUS bundle and fail on bugs that
  // are already fixed. The query string busts that cache; record which build
  // actually answered so a stale run is visible instead of mystifying.
  await page.goto(SITE + "?verify=" + Date.now(), {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  await page.waitForTimeout(2500);
  {
    const marker = await page.evaluate(() =>
      document.documentElement.outerHTML.includes("data-src")
    );
    console.log(`INFO  bundle served: ${marker ? "current (data-src present)" : "STALE"}`);
  }
  await page.screenshot({ path: path.join(OUT, "00-landing.png") });
  check(jsErrors.length === 0, `no JS errors on load (${jsErrors.join(" | ") || "clean"})`);

  // The heading should no longer overclaim a project count.
  const heading = await page.locator("#projects h2").first().innerText();
  check(!/עשרים|Twenty/.test(heading), `projects heading is honest ("${heading.trim()}")`);

  const tiles = await page.locator(".itm").count();
  check(tiles > 0, `project list rendered (${tiles} tiles)`);

  for (const c of CASES) {
    // Isolate each project: one timeout used to kill the run silently and the
    // remaining projects were never checked at all.
    try {
      await runCase(page, c);
    } catch (e) {
      check(false, `${c.id}: check crashed (${String(e).split("\n")[0]})`);
    }
    if (!(await closeSheet(page))) {
      check(false, `${c.id}: the sheet would not close, blocking everything after it`);
      break;
    }
  }

  await browser.close();

  console.log(`\n${problems.length ? `${problems.length} PROBLEM(S)` : "ALL CHECKS PASSED"}`);
  problems.forEach((p) => console.log(`  - ${p}`));

  // Non-zero on failure so the workflow cannot report a green run over a red
  // result — but the screenshots are committed either way.
  process.exit(problems.length ? 1 : 0);
})();

/**
 * Escape is not enough. The page listens for it on `document`, but once the
 * iframe has focus the key never reaches the parent — the sheet stays open and
 * silently blocks every project after it. Click the close button instead, and
 * do not continue until the scrim is actually gone.
 */
async function closeSheet(page) {
  for (const attempt of ["button", "escape", "scrim"]) {
    try {
      if (attempt === "button") await page.locator("#xBtn").click({ timeout: 5000 });
      if (attempt === "escape") {
        await page.locator("body").click({ position: { x: 5, y: 5 }, timeout: 3000 });
        await page.keyboard.press("Escape");
      }
      if (attempt === "scrim") {
        await page.evaluate(() => {
          document.getElementById("scrim")?.classList.remove("open");
          document.body.classList.remove("locked");
          const s = document.getElementById("sheet");
          if (s) s.innerHTML = "";
        });
      }
      await page.waitForFunction(
        () => !document.getElementById("scrim")?.classList.contains("open"),
        { timeout: 4000 }
      );
      await page.waitForTimeout(600);
      return true;
    } catch {
      /* try the next way in */
    }
  }
  return false;
}

async function runCase(page, { id, expect }) {
  {
    const item = page.locator(`.itm[data-id="${id}"]`);
    if (!(await item.count())) {
      check(false, `${id}: project tile exists`);
      return;
    }

    // ---- hover: the sticky preview swaps to this project's screenshot ----
    await item.scrollIntoViewIfNeeded();
    await item.hover();
    await page.waitForTimeout(1400);

    // The panel is sticky and swaps on hover; a single sample can catch it
    // mid-swap, so give it a second look before calling it a failure.
    const shot = page.locator("#peekShot img");
    let hasShot = (await shot.count()) > 0;
    if (!hasShot) {
      await item.hover();
      await page.waitForTimeout(2000);
      hasShot = (await shot.count()) > 0;
    }
    check(hasShot, `${id}: preview renders a real screenshot`);

    if (hasShot) {
      // naturalWidth is 0 when the file 404s and the browser drew nothing
      const w = await shot.evaluate((el) => el.naturalWidth);
      check(w > 0, `${id}: the screenshot file loaded (naturalWidth=${w})`);

      const box = await page.locator(".peek-stage").boundingBox();
      if (box) {
        const ratio = box.width / box.height;
        check(
          Math.abs(ratio - 1.6) < 0.06,
          `${id}: preview holds 16/10 (measured ${ratio.toFixed(3)})`
        );
      }
    }

    await page.screenshot({ path: path.join(OUT, `10-${id}-hover.png`) });

    // ---- click: the deployed build runs inside the sheet ----
    await item.click();
    await page.waitForTimeout(1200);

    const frame = page.locator("#liveFrame");
    if (!(await frame.count())) {
      check(false, `${id}: opening the project mounts a live iframe`);
      return;
    }

    // src is set only once the load listener is attached, so read data-src too
    const src =
      (await frame.getAttribute("src")) || (await frame.getAttribute("data-src"));
    check(
      !!src && src.startsWith("https://ruti-maman.github.io/"),
      `${id}: iframe points at the published build (${src})`
    );

    let loaded = true;
    try {
      await page.waitForSelector("#liveLoad.gone", { timeout: 45000 });
    } catch {
      loaded = false;
    }
    check(loaded, `${id}: the loading veil lifted`);

    // Check what the app painted whether or not the veil lifted — a veil stuck
    // over a working app and an app that never rendered are different bugs,
    // and collapsing them into one result hides whichever came second.
    {
      // The real test. A cross-origin iframe that loads but paints nothing
      // still counts as "loaded", and that is exactly the failure a visitor
      // would see as an empty white box.
      const inner = page.frameLocator("#liveFrame").locator("body");
      let text = "";
      try {
        await page.waitForTimeout(4000);
        text = (await inner.innerText({ timeout: 10000 })) || "";
      } catch (e) {
        text = "";
      }

      // Flutter paints to canvas, so its body text is empty by design.
      if (id === "country") {
        const canvas = await page
          .frameLocator("#liveFrame")
          .locator("canvas, flt-glass-pane, flutter-view")
          .count();
        check(canvas > 0, `${id}: the app rendered (Flutter canvas present)`);
      } else {
        check(
          text.trim().length > 20,
          `${id}: the app rendered content (${text.trim().length} chars)`
        );
        if (expect) {
          check(text.includes(expect), `${id}: shows its own UI (found "${expect}")`);
        }
      }
    }

    await page.screenshot({ path: path.join(OUT, `20-${id}-open.png`) });
  }
}
