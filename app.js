import {
  normalizeUsername,
  validateUsername,
  checkUsername,
} from "./checker.js";

const $ = (selector) => document.querySelector(selector);
const input = $("#username");
const form = $("#check-form");
const result = $("#result");
const storageKey = "tuc:history:v1";
const states = {
  available: {
    label: "Available",
    title: "This name is free right now.",
    description:
      "Try it in Twitch's sign-up form or your profile settings. This check doesn't reserve the name.",
    profile: "Not found",
    availability: "Available",
    action: "Use on Twitch ↗",
    url: "https://www.twitch.tv/settings/profile",
  },
  taken: {
    label: "Taken",
    title: "Someone's already using this name.",
    description: "Take a look at the profile, or try a different username.",
    profile: "Found",
    availability: "Taken",
    action: "View Twitch profile ↗",
  },
  unavailable: {
    label: "Unavailable",
    title: "Twitch hasn't made this name available.",
    description:
      "We couldn't find a profile, but Twitch says you can't use this name. Twitch doesn't say why or when that might change.",
    profile: "Not found",
    availability: "Unavailable",
    action: "Check on Twitch ↗",
    url: "https://www.twitch.tv/settings/profile",
  },
  unknown: {
    label: "Possibly available",
    title: "Confirm it on Twitch.",
    description:
      "We couldn't find a public profile with this name, but Twitch hasn't confirmed whether you can claim it.",
    caveat:
      "Availability isn't confirmed. The name could still be reserved or held after a rename, suspension or deactivation.",
    profile: "Not found",
    availability: "Not verified",
    action: "Confirm on Twitch ↗",
    url: "https://www.twitch.tv/signup",
  },
  error: {
    label: "Lookup failed",
    title: "Couldn't finish the check.",
    description:
      "Something went wrong while checking Twitch. Give it another try.",
    action: "Open Twitch ↗",
    url: "https://www.twitch.tv/",
  },
  "rate-limited": {
    label: "Too many requests",
    title: "Try again in a bit.",
    description:
      "Twitch is limiting requests right now. Wait a little, then check again.",
    action: "Open Twitch ↗",
    url: "https://www.twitch.tv/",
  },
};

let busy = false;
let history = [];
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
  if (Array.isArray(saved))
    history = saved
      .filter(
        (item) =>
          item &&
          typeof item.username === "string" &&
          !validateUsername(item.username) &&
          Object.hasOwn(states, item.state) &&
          Number.isFinite(item.checkedAt),
      )
      .slice(0, 6);
} catch {
  /* Storage is optional, including in private browsing. */
}

function element(tag, className, content) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content !== undefined) node.textContent = content;
  return node;
}

function renderHistory() {
  $("#history-section").hidden = history.length === 0;
  $("#history-list").replaceChildren(
    ...history.map((item) => {
      const li = element("li");
      const button = element("button");
      button.type = "button";
      button.title = `Last result: ${states[item.state].label}. Check again.`;
      button.setAttribute(
        "aria-label",
        `Check ${item.username} again. Previous result: ${states[item.state].label}`,
      );
      const dot = element("i", `dot ${item.state}`);
      dot.setAttribute("aria-hidden", "true");
      button.append(dot, document.createTextNode(`@${item.username}`));
      button.addEventListener("click", () => {
        if (busy) return;
        input.value = item.username;
        syncInput();
        form.requestSubmit();
      });
      li.append(button);
      return li;
    }),
  );
}

function saveHistory(item) {
  history = [
    item,
    ...history.filter((previous) => previous.username !== item.username),
  ].slice(0, 6);
  try {
    localStorage.setItem(storageKey, JSON.stringify(history));
  } catch {
    /* Keep in-memory history. */
  }
  renderHistory();
}

function renderResult(item) {
  const content = states[item.state];
  result.hidden = false;
  result.dataset.state = item.state;
  const heading = element("div", "result-heading");
  const dot = element("i", `dot ${item.state}`);
  dot.setAttribute("aria-hidden", "true");
  heading.append(dot, document.createTextNode(content.label));
  const title = element("h3", "", `@${item.username}`);
  const description = element("p");
  description.append(
    element("strong", "", `${content.title} `),
    document.createTextNode(content.description),
  );
  const actions = element("div", "result-actions");
  const link = element("a", "", content.action);
  link.href =
    content.url || `https://www.twitch.tv/${encodeURIComponent(item.username)}`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  const copy = element("button", "", "Copy username");
  copy.type = "button";
  copy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(item.username);
      copy.textContent = "Copied ✓";
    } catch {
      input.focus();
      input.select();
      copy.textContent = "Select and copy the name above";
    }
  });
  actions.append(link, copy);
  const time = element(
    "time",
    "result-time",
    `Checked at ${new Date(item.checkedAt).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })} · results can change`,
  );
  time.dateTime = new Date(item.checkedAt).toISOString();
  const facts = element("dl", "result-facts");
  if (content.profile) {
    for (const [label, value] of [
      ["Profile", content.profile],
      ["Availability", content.availability],
    ]) {
      const row = element("div");
      row.append(element("dt", "", label), element("dd", "", value));
      facts.append(row);
    }
  }
  const caveat = element("p", "result-caveat", content.caveat);
  caveat.hidden = !content.caveat;
  result.replaceChildren(
    heading,
    title,
    facts,
    description,
    caveat,
    actions,
    time,
  );
}

function syncInput() {
  $("#character-count").textContent = `${input.value.length} / 25`;
  $("#clear-input").hidden = !input.value || busy;
  input.removeAttribute("aria-invalid");
  $("#input-error").hidden = true;
  // A previous result should never appear to describe a newly typed name.
  if (!busy) result.hidden = true;
}

input.addEventListener("input", syncInput);
$("#clear-input").addEventListener("click", () => {
  input.value = "";
  syncInput();
  input.focus();
});
$("#clear-history").addEventListener("click", () => {
  history = [];
  try {
    localStorage.removeItem(storageKey);
  } catch {
    /* Optional persistence. */
  }
  renderHistory();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (busy) return;
  const username = normalizeUsername(input.value);
  const validation = validateUsername(username);
  if (validation) {
    result.hidden = true;
    $("#input-error").textContent = validation;
    $("#input-error").hidden = false;
    input.setAttribute("aria-invalid", "true");
    input.focus();
    return;
  }
  input.value = username;
  syncInput();
  busy = true;
  input.readOnly = true;
  $("#clear-input").hidden = true;
  $("#submit-button").disabled = true;
  $("#submit-label").textContent = "Checking…";
  result.hidden = false;
  result.dataset.state = "loading";
  result.setAttribute("aria-busy", "true");
  const loading = element("div", "result-heading");
  loading.append(
    element("span", "spinner"),
    document.createTextNode("Checking Twitch…"),
  );
  result.replaceChildren(loading);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  let item;
  try {
    item = await checkUsername(username, { signal: controller.signal });
  } catch {
    item = { username, state: "error", checkedAt: Date.now() };
  } finally {
    clearTimeout(timeout);
    busy = false;
    input.readOnly = false;
    $("#submit-button").disabled = false;
    $("#submit-label").textContent = "Check username";
    $("#clear-input").hidden = !input.value;
    result.setAttribute("aria-busy", "false");
  }
  renderResult(item);
  if (item.state !== "error" && item.state !== "rate-limited")
    saveHistory(item);
});

renderHistory();
