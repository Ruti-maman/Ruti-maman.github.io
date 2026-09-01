/**
 * verify-site.js — proves the live-preview feature actually works, from
 * outside the filtered office network.
 *
 * It drives the published portfolio the way a visitor would: pick a project,
 * look at the preview, open it, wait for the real app to load inside the
 * sheet. Every step is photographed into verify/, which gets committed, so
 * the result can be looked at from a machine that cannot reach github.io.
 *
 * This is a test, not a feature. It exists to answer one question: does the
 * hover show a real screenshot, and does the click actually run the app.
 */

const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const SITE = "https://ruti-maman.github.io/";
const OUT = path.join(__dirname, "..", "verify");
const CASES = ["helpdesk", "memory", "sqlsales"];

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

  const failed = [];
  page.on("pageerror", (e) => failed.push(String(e)));

  await page.goto(SITE, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(OUT, "00-landing.png") });
  check(failed.length === 0, `no JS errors on load (${failed.join(" | ") || "clean"})`);

  for (const id of CASES) {
    const item = page.locator(`.itm[data-id="${id}"]`);
    if (!(await item.count())) {
      check(false, `${id}: project tile exists`);
      continue;
    }

    // hover -> the sticky preview should swap to this project's screenshot
    await item.scrollIntoViewIfNeeded();
    await item.hover();
    await page.waitForTimeout(1400);

    const shot = page.locator("#peekShot img");
    const hasShot = (await shot.count()) > 0;
    check(hasShot, `${id}: preview renders a real screenshot`);

    if (hasShot) {
      // naturalWidth is 0 when the file 404s and the browser drew nothing
      const w = await shot.evaluate((el) => el.naturalWidth);
      check(w > 0, `${id}: the screenshot file actually loaded (naturalWidth=${w})`);

      const box = await page.locator(".peek-stage").boundingBox();
      if (box) {
        const ratio = box.width / box.height;
        // 16/10 = 1.6; anything outside this band means the box is distorting
        check(
          Math.abs(ratio - 1.6) < 0.06,
          `${id}: preview holds 16/10 (measured ${ratio.toFixed(3)})`
        );
      }
    }

    await page.screenshot({ path: path.join(OUT, `10-${id}-hover.png`) });

    // click -> the sheet opens and the deployed app runs inside it
    await item.click();
    await page.waitForTimeout(1200);

    const frame = page.locator("#liveFrame");
    const hasFrame = (await frame.count()) > 0;
    check(hasFrame, `${id}: opening the project mounts a live iframe`);

    if (hasFrame) {
      const src = await frame.getAttribute("src");
      check(
        !!src && src.startsWith("https://ruti-maman.github.io/"),
        `${id}: iframe points at the published build (${src})`
      );

      // the loading veil only lifts on the iframe's own load event
      try {
        await page.waitForSelector("#liveLoad.gone", { timeout: 30000 });
        check(true, `${id}: the app finished loading inside the page`);
      } catch {
        check(false, `${id}: the app never fired load inside the page`);
      }
      await page.waitForTimeout(2500);
    }

    await page.screenshot({ path: path.join(OUT, `20-${id}-open.png`) });

    await page.keyboard.press("Escape");
    await page.waitForTimeout(900);
  }

  await browser.close();

  console.log(`\n${problems.length ? `${problems.length} PROBLEM(S)` : "all checks passed"}`);
  problems.forEach((p) => console.log(`  - ${p}`));

  // Always exit 0: the screenshots are the point, and they must get committed
  // even when a check fails, or there is nothing to look at while debugging.
  process.exit(0);
})();
