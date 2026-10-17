import {
  normalizeUsername,
  validateUsername,
  checkUsername,
  parseUsernames,
  checkUsernames,
  MAX_LIST_SIZE,
} from "./checker.js";

const $ = (selector) => document.querySelector(selector);
const input = $("#username");
const form = $("#check-form");
const result = $("#result");
const states = {
  available: {
    label: "Available",
    title: "This name is free right now.",
    description:
      "Sign in to Twitch and check the name under Settings → Profile. This check doesn't reserve it.",
    profile: "Not found",
    availability: "Confirmed by Twitch",
    action: "Use on Twitch ↗",
    url: "https://www.twitch.tv/settings/profile",
  },
  taken: {
    label: "Unavailable",
    title: "Someone's already using this name.",
    description: "Take a look at the profile, or try a different username.",
    profile: "Found",
    availability: "In use",
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
    label: "Available",
    title: "No public profile found.",
    description:
      "Sign in to Twitch and check this name under Settings → Profile.",
    caveat:
      "Not confirmed by Twitch. Some names still can't be used because they're reserved or held after a rename, suspension or deactivation. Twitch doesn't offer a precise public availability check, so confirm the name there.",
    profile: "Not found",
    availability: "Not confirmed by Twitch",
    action: "Check in Twitch settings ↗",
    url: "https://www.twitch.tv/settings/profile",
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
// Remove searches saved by earlier versions without reading their contents.
try {
  localStorage.removeItem("tuc:history:v1");
} catch {
  /* Storage may be unavailable. The checker does not need it. */
}

function element(tag, className, content) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content !== undefined) node.textContent = content;
  return node;
}

function renderResult(item) {
  const content = states[item.state];
  result.hidden = false;
  result.dataset.state = item.state;
  const heading = element("div", "result-heading");
  heading.textContent = content.label;
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
  setListBusy(true);
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
    setListBusy(false);
    input.readOnly = false;
    $("#submit-button").disabled = false;
    $("#submit-label").textContent = "Check username";
    $("#clear-input").hidden = !input.value;
    result.setAttribute("aria-busy", "false");
  }
  renderResult(item);
});

const listInput = $("#usernames");
let listController;
let listItems = [];
const listRows = new Map();
let listFilter = "all";
let listPage = 1;
const PAGE_SIZE = 20;

function resultGroup(item) {
  if (item.state === "available" || item.state === "unknown")
    return "available";
  if (item.state === "taken" || item.state === "unavailable")
    return "unavailable";
  return "failed";
}

function renderListPage() {
  const counts = {
    all: listItems.length,
    available: 0,
    unavailable: 0,
    failed: 0,
  };
  for (const item of listItems) counts[resultGroup(item)]++;
  for (const button of document.querySelectorAll("[data-filter]")) {
    button.querySelector("span").textContent = counts[button.dataset.filter];
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.filter === listFilter),
    );
  }
  const filtered = listItems.filter(
    (item) => listFilter === "all" || resultGroup(item) === listFilter,
  );
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  listPage = Math.min(listPage, pages);
  const start = (listPage - 1) * PAGE_SIZE;
  const container = $(".list-results");
  const scroll = container.scrollTop;
  const rows = filtered.slice(start, start + PAGE_SIZE).map((item) => {
    if (!listRows.has(item.username))
      listRows.set(item.username, createListRow(item));
    return listRows.get(item.username);
  });
  const list = $("#list-results");
  for (const row of [...list.children]) if (!rows.includes(row)) row.remove();
  rows.forEach((row, index) => {
    if (list.children[index] !== row)
      list.insertBefore(row, list.children[index] || null);
  });
  container.scrollTop = scroll;
  $("#list-empty").hidden = filtered.length > 0;
  $("#list-empty").textContent =
    listFilter === "all" ? "No results yet." : "No matching results yet.";
  $("#list-range").textContent = filtered.length
    ? `${start + 1}–${Math.min(start + PAGE_SIZE, filtered.length)} of ${filtered.length}`
    : "0 results";
  $("#list-page").textContent = `${listPage} / ${pages}`;
  $("#list-prev").disabled = listPage === 1;
  $("#list-next").disabled = listPage === pages;
  $("#list-copy").disabled = counts.available === 0;
}

for (const button of document.querySelectorAll("[data-filter]")) {
  button.addEventListener("click", () => {
    listFilter = button.dataset.filter;
    listPage = 1;
    renderListPage();
    $(".list-results").scrollTop = 0;
  });
}
for (const [selector, direction] of [
  ["#list-prev", -1],
  ["#list-next", 1],
]) {
  $(selector).addEventListener("click", () => {
    listPage += direction;
    renderListPage();
    $(".list-results").scrollTop = 0;
  });
}
$("#list-copy").addEventListener("click", async () => {
  const names = listItems
    .filter((item) => resultGroup(item) === "available")
    .map((item) => item.username);
  try {
    await navigator.clipboard.writeText(names.join("\n"));
    $("#list-copy-status").textContent =
      `Copied ${names.length} names. Check unconfirmed names on Twitch.`;
  } catch {
    $("#list-copy-status").textContent =
      "Couldn't copy. Check your browser's clipboard permissions.";
  }
});

function resetListResults() {
  listItems = [];
  listRows.clear();
  listFilter = "all";
  listPage = 1;
  $("#list-copy-status").textContent = "";
  renderListPage();
  $(".list-results").scrollTop = 0;
}

function setListBusy(value) {
  listInput.readOnly = value;
  $("#list-submit").disabled = value;
  $("#list-clear").disabled = value;
}

function syncList() {
  const count = listInput.value.split(/[\s,]+/).filter(Boolean).length;
  $("#list-count").textContent = `${count} / ${MAX_LIST_SIZE} names`;
  listInput.removeAttribute("aria-invalid");
  $("#list-error").hidden = true;
  if (!busy) $("#list-output").hidden = true;
}
listInput.addEventListener("input", syncList);
$("#list-clear").addEventListener("click", () => {
  listInput.value = "";
  resetListResults();
  syncList();
  listInput.focus();
});
$("#list-stop").addEventListener("click", () => listController?.abort());

function createListRow(item) {
  const content = states[item.state];
  const row = element("li", "list-result");
  row.dataset.state = item.state;
  const name = element("a", "list-name", `@${item.username}`);
  name.href =
    content.url || `https://www.twitch.tv/${encodeURIComponent(item.username)}`;
  name.target = "_blank";
  name.rel = "noopener noreferrer";
  name.setAttribute(
    "aria-label",
    `@${item.username}: ${content.action.replace(" ↗", "")}`,
  );
  const status = element("div", "list-status");
  status.append(element("strong", "", content.label));
  if (content.availability)
    status.append(element("span", "", content.availability));
  row.append(name, status);
  return row;
}

$("#list-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (busy) return;
  let names;
  try {
    names = parseUsernames(listInput.value);
  } catch (error) {
    $("#list-output").hidden = true;
    $("#list-error").textContent = error.message;
    $("#list-error").hidden = false;
    listInput.setAttribute("aria-invalid", "true");
    listInput.focus();
    return;
  }
  busy = true;
  setListBusy(true);
  input.readOnly = true;
  $("#submit-button").disabled = true;
  $("#clear-input").hidden = true;
  $("#list-stop").hidden = false;
  $("#list-error").hidden = true;
  listInput.removeAttribute("aria-invalid");
  resetListResults();
  $("#list-output").hidden = false;
  const progress = $("#list-progress");
  progress.textContent = `Checking 0 of ${names.length}… You can stop at any time.`;
  listController = new AbortController();
  try {
    const summary = await checkUsernames(listInput.value, {
      signal: listController.signal,
      onResult(item, completed, total) {
        listItems.push(item);
        $("#list-copy-status").textContent = "";
        renderListPage();
        progress.textContent = `Checked ${completed} of ${total}…`;
      },
    });
    const messages = {
      complete: "Done.",
      cancelled: "Stopped. Remaining names weren't checked.",
      error:
        "Stopped because a lookup failed. Remaining names weren't checked.",
      "rate-limited":
        "Twitch is limiting requests. Stopped; remaining names weren't checked. Try again later.",
    };
    progress.textContent = `${messages[summary.reason]} Checked ${summary.completed} of ${summary.total}.`;
  } finally {
    busy = false;
    listController = undefined;
    setListBusy(false);
    input.readOnly = false;
    $("#submit-button").disabled = false;
    $("#clear-input").hidden = !input.value;
    $("#list-stop").hidden = true;
  }
});
