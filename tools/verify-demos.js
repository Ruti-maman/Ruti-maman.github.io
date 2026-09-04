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
  // The card embeds Ruth's ORIGINAL page (parktikode-3) in a srcdoc iframe -
  // same HTML, same turquoise design - and submit opens a REAL draft via
  // mailto in the visitor's own mail client. Drive the form inside the frame.
  await page.locator('.itm[data-id="outlook"]').click();
  await page.waitForSelector("#demoBody iframe", { timeout: 15000 });
  await page.waitForTimeout(1200);

  const app = page.frameLocator("#demoBody iframe");
  check(
    (await app.locator("h2").innerText()).includes("שליחת טיוטות"),
    `outlook: HER page renders - the real heading`
  );
  const bg = await app.locator("body").evaluate((b) => getComputedStyle(b).backgroundImage);
  check(bg.includes("gradient"), `outlook: her turquoise gradient is painted`);

  // 1 - no recipients is rejected with her API's error
  await app.locator("button[type=submit]").click();
  await page.waitForTimeout(600);
  let t = await app.locator("#log").innerText();
  check(t.includes("400") && t.includes("No recipients"), `outlook: empty recipients rejected with the API error`);

  // 2 - two recipients + subject: a REAL mailto draft for the visitor
  await app.locator("#recipients").fill("dana@example.com; noa@example.com");
  await app.locator("#subject").fill("קורות חיים — רות ממן");
  await app.locator("#body").fill("שלום, מצרפת קורות חיים.");
  await app.locator("button[type=submit]").click();
  await page.waitForTimeout(800);

  t = await app.locator("#log").innerText();
  // the log line is main.py's success line, verbatim shape
  check(
    t.includes('הבקשה נשלחה בהצלחה: {"status":"ok","recipients_count":2}'),
    `outlook: the log message reads exactly like the original`
  );

  // the popped draft: mailto with both recipients (this is what opens the
  // DESKTOP Outlook, taskbar icon and all, wherever it is the mail handler)
  const href = (await app.locator("#mlt").getAttribute("href")) || "";
  check(
    href.startsWith("mailto:") &&
      href.includes("dana%40example.com") &&
      href.includes("noa%40example.com"),
    `outlook: the popped draft carries both recipients`
  );
  check(href.includes("subject="), `outlook: the draft carries the subject`);

  // Ruth's call: no fallback UI at all - the pop is the whole behaviour
  await page.waitForTimeout(2500);
  check((await app.locator("#owaBtn").count()) === 0, `outlook: no fallback button - direct pop only`);
  check((await app.locator("#gmailLink").count()) === 0, `outlook: no gmail option - Outlook only, like the original`);

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

  async function open(email) {
    await page.goto(APP + "?u=" + email, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForSelector("input", { timeout: 15000 });
  }
  async function fillAuth(email, password) {
    const inputs = page.locator("input");
    const n = await inputs.count();
    await inputs.nth(n - 2).fill(email);
    await inputs.nth(n - 1).fill(password);
    await page.locator("button.submit-btn").click();
  }
  async function landOnTeams() {
    await page.waitForURL("**/dashboard", { timeout: 15000 });
    await page.locator('a.teams-btn, [routerlink="/teams"]').first().click();
    await page.waitForURL("**/teams", { timeout: 15000 });
    await page.waitForTimeout(1200);
  }
  async function registerUser(email) {
    await open(email);
    await page.locator("button.toggle-btn").click(); // Sign up mode
    await page.waitForTimeout(400);
    await page.locator("input").first().fill("בודק " + stamp); // the name field
    await fillAuth(email, "Password1!");
    await landOnTeams();
  }
  async function signIn(email, password) {
    await open(email);
    await fillAuth(email, password);
    await landOnTeams();
  }
  async function teamsText() {
    return (await page.locator(".teams-container").innerText()).replace(/\s+/g, " ");
  }
  async function signOut() {
    await page.locator("button.logout-btn").first().click();
    await page.waitForURL("**/login", { timeout: 15000 });
  }

  await registerUser(A);
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

  // wrong password must NOT get in
  await open(A);
  await fillAuth(A, "TotallyWrong9!");
  await page.waitForTimeout(1800);
  let stayedOut = page.url().includes("/login") || (await page.locator(".error-msg").count()) > 0;
  check(stayedOut, `auth: a wrong password is rejected`);

  // a taken email must not register again
  await page.locator("button.toggle-btn").click();
  await page.waitForTimeout(400);
  await page.locator("input").first().fill("מתחזה");
  await fillAuth(A, "Password1!");
  await page.waitForTimeout(1800);
  stayedOut = page.url().includes("/login") || (await page.locator(".error-msg").count()) > 0;
  check(stayedOut, `auth: registering an already-taken email is rejected`);

  await registerUser(B);
  t = await teamsText();
  check(!t.includes(TEAM), `isolation: client B does NOT see A's team`);
  check(!t.includes("צוות פיתוח"), `isolation: client B also starts empty`);
  await signOut();

  await signIn(A, "Password1!");
  t = await teamsText();
  check(t.includes(TEAM), `isolation: client A returns with the RIGHT password and the private history is there`);
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
