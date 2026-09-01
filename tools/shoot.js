/**
 * shoot.js — screenshots every live project build for the portfolio previews.
 *
 * Run by .github/workflows/shots.yml, never by hand: this machine's network
 * blocks github.io, so the only place these URLs are reachable is a runner.
 *
 * Every shot is taken at exactly 1280x800. The page renders them in a 16/10
 * box, so a fixed viewport is what keeps a preview from ever being stretched
 * or letterboxed - the image already has the shape the box expects.
 *
 *   node tools/shoot.js            # all targets
 *   node tools/shoot.js helpdesk   # just one, while iterating
 */

const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "..", "shots");
const BASE = "https://ruti-maman.github.io";
const VIEWPORT = { width: 1280, height: 800 };

/**
 * `settle` runs after load and before the shutter. It is where an app that
 * opens on a login screen gets walked past it - a preview of a login form
 * tells a visitor nothing about the project behind it.
 */
const TARGETS = [
  {
    id: "memory",
    url: `${BASE}/memory-game/`,
    // The entry form is not the project; the board is.
    settle: async (page) => signIn(page, "רות", "1234"),
  },
  { id: "taskman",  url: `${BASE}/Task-manager/` },
  { id: "country",  url: `${BASE}/ProjectFluter/`, wait: 7000, settle: searchCountry },
  { id: "sqlsales", url: `${BASE}/sql-final-project/` },
  { id: "jones",    url: `${BASE}/Project-Jones-Automation-Exercise/`, settle: seekVideo },

  {
    id: "helpdesk",
    url: `${BASE}/project/`,
    settle: async (page) => signIn(page, "admin@demo.com", "demo1234"),
  },
  {
    id: "todofull",
    url: `${BASE}/practicode-3-todolists/`,
    settle: async (page) => signIn(page, "demo", "demo"),
  },
];

/**
 * Headless Chromium will not autoplay, so the <video> element sits on a blank
 * first frame and the preview looks like a broken player. Seeking a few
 * seconds in forces a real frame to decode and paint.
 */
async function seekVideo(page) {
  const video = page.locator("video");
  if (!(await video.count())) return;

  await video.evaluate(
    (el) =>
      new Promise((resolve) => {
        const go = () => {
          el.pause();
          // far enough in that the browser window is open and the form visible
          el.currentTime = Math.min(6, (el.duration || 12) * 0.45);
          el.addEventListener("seeked", resolve, { once: true });
          setTimeout(resolve, 4000);
        };
        if (el.readyState >= 1) go();
        else el.addEventListener("loadedmetadata", go, { once: true });
        setTimeout(resolve, 8000);
      })
  );
  await page.waitForTimeout(900);
}

/**
 * Flutter web paints into a canvas, so there is no <input> to fill — the only
 * handle is the pixel where the search box is drawn. Brittle by nature, which
 * is why the caller treats a failure here as "shoot it empty" rather than an
 * error: an empty search screen is a dull preview, not a broken one.
 */
async function searchCountry(page) {
  await page.mouse.click(640, 75);      // the search field, top of a 1280x800 view
  await page.waitForTimeout(400);
  await page.keyboard.type("Israel", { delay: 90 });
  await page.keyboard.press("Enter");
  await page.waitForTimeout(3500);      // the Rest Countries round trip
}

/**
 * Both login screens are a couple of text inputs and a submit button, and both
 * demos accept anything, so filling the first two fields and submitting is
 * enough. Deliberately forgiving: a screenshot of the login page is a worse
 * outcome than a slightly plain one, but a crashed run is the worst of the
 * three.
 */
async function signIn(page, user, pass) {
  const inputs = page.locator(
    'input:visible:not([type="checkbox"]):not([type="radio"]):not([type="submit"])'
  );
  const count = await inputs.count();
  if (count < 2) return;

  await inputs.nth(0).fill(user);
  await inputs.nth(1).fill(pass);

  const submit = page
    .locator('button[type="submit"]:visible, input[type="submit"]:visible')
    .first()
    .or(page.locator("button:visible").first());

  await submit.click({ timeout: 5000 });
  await page.waitForTimeout(2500);
}

async function shoot(browser, target) {
  const page = await browser.newPage({
    viewport: VIEWPORT,
    deviceScaleFactor: 2, // retina-sharp on the card, still a small file
  });

  const file = path.join(OUT, `${target.id}.png`);
  try {
    const resp = await page.goto(target.url, {
      waitUntil: "networkidle",
      timeout: 45000,
    });
    if (!resp || !resp.ok()) {
      throw new Error(`HTTP ${resp ? resp.status() : "no response"}`);
    }

    await page.waitForTimeout(target.wait || 2500);

    if (target.settle) {
      try {
        await target.settle(page);
      } catch (e) {
        console.log(`   (settle skipped: ${e.message.split("\n")[0]})`);
      }
    }

    // Stop anything mid-animation so repeat runs do not produce a new image
    // every time and churn the repo with meaningless commits.
    await page.addStyleTag({
      content: `*,*::before,*::after{animation:none!important;
                transition:none!important;caret-color:transparent!important}`,
    });
    await page.waitForTimeout(400);

    await page.screenshot({ path: file, animations: "disabled" });
    console.log(`OK   ${target.id}  <- ${target.url}`);
    return true;
  } catch (e) {
    console.log(`FAIL ${target.id}  ${e.message.split("\n")[0]}`);
    return false;
  } finally {
    await page.close();
  }
}

(async () => {
  const only = process.argv.slice(2);
  const list = only.length ? TARGETS.filter((t) => only.includes(t.id)) : TARGETS;
  if (!list.length) {
    console.error(`no target matched ${only.join(", ")}`);
    process.exit(1);
  }

  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();

  let ok = 0;
  for (const t of list) {
    if (await shoot(browser, t)) ok++;
  }
  await browser.close();

  console.log(`\n${ok}/${list.length} screenshots captured`);

  // A partial run still publishes: the page falls back to its hand-drawn
  // mockup for any shot that is missing, so some is better than none.
  process.exit(ok === 0 ? 1 : 0);
})();
