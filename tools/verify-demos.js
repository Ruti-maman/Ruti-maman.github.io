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

  // 3 — the everyday asks Ruth expects it to know (she caught "create a
  // folder" answering unknown — that class of request must keep working)
  const KNOWN = [
    ["צור תיקיה חדשה", "mkdir -p"],
    ["צרי לי קובץ חדש בשם משהו", "touch"],
    ["העתק את הדוח לגיבוי", "cp "],
    ["עצור את התהליך שתקוע", "kill -TERM"], // "עצור" must NOT match "צור"
    ["תורידי לי את הקובץ מהאתר", "curl -LO"],
  ];
  for (const [ask, cmd] of KNOWN) {
    await page.locator("#demoBody #q").fill(ask);
    await page.keyboard.press("Enter");
    await page.waitForTimeout(2200);
    t = await log.innerText();
    check(t.includes(cmd), `textcli: "${ask}" → ${cmd.trim()}`);
    check(!t.includes("unknown"), `textcli: "${ask}" is not unknown`);
  }

  // 4 — nonsense degrades safely instead of guessing
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
  // The demo now mirrors Ruth's real parktikode-3 app: recipients + subject +
  // body + attachment → one Outlook mail draft per recipient. In CI there is
  // no local app on :5000, so this always exercises the replica path.
  await openDemo(page, "outlook");
  const log = page.locator("#demoBody .dlog");
  const boxSel = "#demoBody";

  // 1 — no recipients is rejected exactly like her Flask endpoint rejects it
  await page.locator(`${boxSel} #go`).click();
  await page.waitForTimeout(700);
  let t = await log.innerText();
  check(t.includes("400"), `outlook: empty recipients rejected with 400`);
  check(t.includes("No recipients"), `outlook: the error is her API's actual error`);

  // 2 — two recipients, subject, attachment → a draft per recipient
  await page.locator(`${boxSel} #rcp`).fill("dana@example.com; noa@example.com");
  await page.locator(`${boxSel} #sub`).fill("קורות חיים — רות ממן");
  await page.locator(`${boxSel} #att`).click();
  await page.locator(`${boxSel} #go`).click();
  await page.waitForTimeout(1800);
  t = await log.innerText();
  check(t.includes("POST"), `outlook: the form actually POSTs to /drafts`);
  check(t.includes("win32com"), `outlook: the win32com hop is shown`);
  check(t.includes("Attachments.Add"), `outlook: the attachment is attached`);
  check(t.includes("dana@example.com"), `outlook: a draft opened for the first recipient`);
  check(t.includes("noa@example.com"), `outlook: a draft opened for the second recipient`);
  check(t.includes('"recipients_count": 2'), `outlook: her API's response shape, count 2`);

  await page.screenshot({ path: path.join(OUT, "31-outlook-drafts.png") });
}

/**
 * The complaint this guards against, verbatim: "it shows every client the
 * same tasks - it doesn't really create a fresh one for a new client and
 * doesn't remember a returning client's private history."
 *
 * So: sign in as A (fresh+empty), create a team, sign out; sign in as B
 * (fresh+empty, must NOT see A's team); sign back in as A (the team must
 * still be there). Runs inside the live Task-manager build on Pages.
 */
async function taskmanIsolation(page) {
  const APP = "https://ruti-maman.github.io/Task-manager/";
  const stamp = Date.now().toString().slice(-6);
  const A = `check-a-${stamp}@verify.dev`;
  const B = `check-b-${stamp}@verify.dev`;
  const TEAM = `בידוד ${stamp}`;

  async function signIn(email) {
    await page.goto(APP + "?u=" + email, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForSelector("input", { timeout: 15000 });
    const inputs = page.locator("input");
    await inputs.nth((await inputs.count()) - 2).fill(email);
    await inputs.nth((await inputs.count()) - 1).fill("Password1!");
    await page.locator("button.submit-btn").click();
    await page.waitForURL("**/dashboard", { timeout: 15000 });
    await page.locator('a.teams-btn, [routerlink="/teams"]').first().click();
    await page.waitForURL("**/teams", { timeout: 15000 });
    await page.waitForTimeout(1200);
  }
  async function teamsText() {
    return (await page.locator(".teams-container").innerText()).replace(/\s+/g, " ");
  }
  async function signOut() {
    await page.locator("button.logout-btn").first().click();
    await page.waitForURL("**/login", { timeout: 15000 });
  }

  await signIn(A);
  let t = await teamsText();
  check(!t.includes("צוות פיתוח"), `isolation: a NEW client starts without the sample board`);

  await page.locator("button.create-btn").click();
  await page.waitForSelector("mat-dialog-container input", { timeout: 10000 });
  await page.locator("mat-dialog-container input").first().fill(TEAM);
  await page
    .locator("mat-dialog-container button", { hasNotText: /cancel/i })
    .last()
    .click();
  await page.waitForTimeout(1500);
  t = await teamsText();
  check(t.includes(TEAM), `isolation: client A created "${TEAM}"`);
  await signOut();

  await signIn(B);
  t = await teamsText();
  check(!t.includes(TEAM), `isolation: client B does NOT see A's team`);
  check(!t.includes("צוות פיתוח"), `isolation: client B also starts empty`);
  await signOut();

  await signIn(A);
  t = await teamsText();
  check(t.includes(TEAM), `isolation: client A returns and the private history is still there`);
  await page.screenshot({ path: path.join(OUT, "33-taskman-isolation.png") });
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

  // The isolation test navigates away from the portfolio, so it runs first
  // on its own page-load, before the sheet-driven demo cases.
  try {
    await taskmanIsolation(page);
  } catch (e) {
    check(false, `isolation: crashed (${String(e).split("\n")[0]})`);
  }
  await page.goto(SITE + "?demos2=" + Date.now(), { waitUntil: "networkidle", timeout: 60000 });
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
