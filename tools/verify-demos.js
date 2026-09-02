/**
 * verify-demos.js — drives the two hand-built interactive demos the way a
 * visitor would, and checks they DO what their project descriptions promise.
 *
 * verify-site.js proves the live builds load; this file proves behaviour:
 * the Text-to-CLI agent must translate a request into a command and BLOCK a
 * destructive one, and the Outlook gateway must create, reject and delete a
 * meeting. A demo that renders but does nothing would pass every load check
 * and still be broken — this is the test for that.
 */

const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const SITE = "https://ruti-maman.github.io/";
const OUT = path.join(__dirname, "..", "verify");

const problems = [];
function check(ok, what) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${what}`);
  if (!ok) problems.push(what);
}

/** open a project's sheet and wait for its demo to mount */
async function openDemo(page, id) {
  await page.locator(`.itm[data-id="${id}"]`).click();
  // the sheet mounts its demo 420ms after opening
  await page.waitForSelector("#demoBody .dinp", { timeout: 10000 });
  await page.waitForTimeout(400);
}

/** same close-or-die logic as verify-site.js */
async function closeSheet(page) {
  for (const attempt of ["button", "scrim"]) {
    try {
      if (attempt === "button") await page.locator("#xBtn").click({ timeout: 5000 });
      else
        await page.evaluate(() => {
          document.getElementById("scrim")?.classList.remove("open");
          document.body.classList.remove("locked");
          const s = document.getElementById("sheet");
          if (s) s.innerHTML = "";
        });
      await page.waitForFunction(
        () => !document.getElementById("scrim")?.classList.contains("open"),
        { timeout: 4000 }
      );
      await page.waitForTimeout(500);
      return true;
    } catch {}
  }
  return false;
}

async function textcli(page) {
  await openDemo(page, "textcli");
  const log = page.locator("#demoBody .dlog");

  // 1 — a legitimate request becomes the right command and passes the allowlist
  await page.locator('#demoBody .dsug button:has-text("גדולים מ-1GB")').click();
  await page.waitForTimeout(2200); // the staged log lines take ~1.4s
  let t = await log.innerText();
  check(t.includes("find / -type f -size +1G"), `textcli: request became the right command`);
  check(t.includes("validated"), `textcli: command was checked against the allowlist`);
  check(t.includes("exit 0"), `textcli: sandboxed run finished`);

  // 2 — the destructive request is refused, never validated
  await page.locator('#demoBody .dsug button:has-text("מחק את כל הדיסק")').click();
  await page.waitForTimeout(1800);
  t = await log.innerText();
  check(t.includes("blocked") || t.includes("✗"), `textcli: destructive request was BLOCKED`);
  check(!t.includes("validated"), `textcli: destructive request was not validated`);
  check(!t.includes("exit 0"), `textcli: destructive request never ran`);

  // 3 — nonsense degrades safely instead of guessing
  await page.locator("#demoBody #q").fill("שלום מה נשמע");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(900);
  t = await log.innerText();
  check(
    t.includes("unknown"),
    `textcli: an unmatched request says so instead of inventing a command`
  );

  await page.screenshot({ path: path.join(OUT, "30-textcli.png") });
}

async function outlook(page) {
  await openDemo(page, "outlook");
  const log = page.locator("#demoBody .dlog");
  const boxSel = "#demoBody";

  // 1 — an empty subject is rejected like the real service would
  await page.locator(`${boxSel} #go`).click();
  await page.waitForTimeout(400);
  let t = await log.innerText();
  check(t.includes("400"), `outlook: empty subject rejected with 400`);

  // 2 — a real meeting flows through the chain and lands in the calendar
  await page.locator(`${boxSel} #sub`).fill("פגישת צוות שבועית");
  await page.locator(`${boxSel} #hr`).selectOption("13:00");
  await page.locator(`${boxSel} #go`).click();
  await page.waitForTimeout(1600); // the React→:8765→Win32→Outlook animation
  t = await log.innerText();
  check(t.includes("POST"), `outlook: the client actually POSTs`);
  check(t.includes("win32com"), `outlook: the Win32 hop is shown`);
  check(t.includes("201"), `outlook: creation returns 201`);

  const card = page.locator(`${boxSel} .dcard`);
  check((await card.count()) === 1, `outlook: the meeting appears in the calendar`);
  const cardText = await card.innerText();
  check(cardText.includes("פגישת צוות שבועית"), `outlook: calendar shows the subject`);
  check(cardText.includes("13:00"), `outlook: calendar shows the chosen hour`);

  await page.screenshot({ path: path.join(OUT, "31-outlook-created.png") });

  // 3 — deleting removes it and logs the DELETE
  await page.locator(`${boxSel} .dcard button[data-del]`).click();
  await page.waitForTimeout(400);
  t = await log.innerText();
  check(t.includes("DELETE /appointment"), `outlook: delete hits the endpoint`);
  check(
    (await page.locator(`${boxSel} .dcard`).count()) === 0,
    `outlook: the calendar is empty again`
  );

  await page.screenshot({ path: path.join(OUT, "32-outlook-deleted.png") });
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.5,
  });

  await page.goto(SITE + "?demos=" + Date.now(), {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  await page.waitForTimeout(2000);

  for (const [name, fn] of [
    ["textcli", textcli],
    ["outlook", outlook],
  ]) {
    try {
      await fn(page);
    } catch (e) {
      check(false, `${name}: crashed (${String(e).split("\n")[0]})`);
    }
    if (!(await closeSheet(page))) {
      check(false, `${name}: sheet would not close`);
      break;
    }
  }

  await browser.close();
  console.log(`\n${problems.length ? `${problems.length} PROBLEM(S)` : "ALL DEMO CHECKS PASSED"}`);
  problems.forEach((p) => console.log(`  - ${p}`));
  process.exit(problems.length ? 1 : 0);
})();
