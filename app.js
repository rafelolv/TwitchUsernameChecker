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
    label: "Disponível",
    title: "Esse @ pode ser seu.",
    description:
      "A Twitch confirmou que o nome está disponível agora. Confirme no cadastro ou na alteração de nome antes de decidir.",
    action: "Confirmar na Twitch ↗",
    url: "https://www.twitch.tv/settings/profile",
  },
  taken: {
    label: "Em uso",
    title: "Esse nome já tem dono.",
    description:
      "Encontramos uma conta com esse nickname na Twitch. Você pode abrir o perfil ou testar outra ideia.",
    action: "Ver perfil na Twitch ↗",
  },
  unavailable: {
    label: "Indisponível",
    title: "Sem perfil, mas sem liberação.",
    description:
      "Não encontramos um perfil, mas a Twitch respondeu que o nome não está disponível. Ela não informa o motivo nem quando será liberado.",
    action: "Conferir na Twitch ↗",
    url: "https://www.twitch.tv/settings/profile",
  },
  unknown: {
    label: "Não confirmado",
    title: "Sem perfil. E o nome?",
    description:
      "Nenhum perfil foi encontrado, mas a Twitch não permitiu confirmar se o nome está livre ou indisponível. Confira na edição do nome de usuário ou no cadastro da Twitch.",
    action: "Confirmar na Twitch ↗",
    url: "https://www.twitch.tv/settings/profile",
  },
  error: {
    label: "Consulta não concluída",
    title: "Não deu para consultar agora.",
    description:
      "A Twitch não respondeu como esperado. Confira sua conexão e tente novamente. Não foi possível determinar o status desse nome.",
    action: "Abrir Twitch ↗",
    url: "https://www.twitch.tv/",
  },
  "rate-limited": {
    label: "Muitas consultas",
    title: "Uma pausa e a gente tenta de novo.",
    description:
      "A Twitch limitou as consultas por enquanto. Aguarde um minuto antes de tentar novamente.",
    action: "Abrir Twitch ↗",
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
      button.title = `${states[item.state].label} na última consulta. Clique para consultar novamente.`;
      button.setAttribute(
        "aria-label",
        `Consultar ${item.username} novamente. Último resultado: ${states[item.state].label}`,
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
  const copy = element("button", "", "Copiar nickname");
  copy.type = "button";
  copy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(item.username);
      copy.textContent = "Copiado ✓";
    } catch {
      input.focus();
      input.select();
      copy.textContent = "Selecione e copie o nome acima";
    }
  });
  actions.append(link, copy);
  const time = element(
    "time",
    "result-time",
    `Consultado às ${new Date(item.checkedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} · o resultado pode mudar`,
  );
  time.dateTime = new Date(item.checkedAt).toISOString();
  result.replaceChildren(heading, title, description, actions, time);
}

function syncInput() {
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
  $("#submit-label").textContent = "Consultando…";
  result.hidden = false;
  result.dataset.state = "loading";
  result.setAttribute("aria-busy", "true");
  const loading = element("div", "result-heading");
  loading.append(
    element("span", "spinner"),
    document.createTextNode("Consultando a Twitch…"),
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
    $("#submit-label").textContent = "Verificar nome";
    $("#clear-input").hidden = !input.value;
    result.setAttribute("aria-busy", "false");
  }
  renderResult(item);
  if (item.state !== "error" && item.state !== "rate-limited")
    saveHistory(item);
});

renderHistory();
