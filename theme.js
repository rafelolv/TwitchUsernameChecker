(() => {
  const storageKey = "tuc:theme";
  const root = document.documentElement;
  const system = window.matchMedia("(prefers-color-scheme: dark)");
  let preference = null;

  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === "light" || saved === "dark") preference = saved;
  } catch {
    // Theme switching also works when storage is unavailable.
  }

  function applyTheme() {
    const theme = preference || (system.matches ? "dark" : "light");
    root.dataset.theme = theme;
    const chrome = document.getElementById("browser-theme-color");
    if (chrome) chrome.content = theme === "dark" ? "#141118" : "#f7f6f2";
    const button = document.getElementById("theme-toggle");
    if (!button) return;
    const label = `Switch to ${theme === "dark" ? "light" : "dark"} mode`;
    button.setAttribute("aria-label", label);
    button.title = label;
    document
      .getElementById("theme-sun")
      .toggleAttribute("hidden", theme !== "dark");
    document
      .getElementById("theme-moon")
      .toggleAttribute("hidden", theme !== "light");
  }

  applyTheme();
  system.addEventListener("change", () => {
    if (!preference) applyTheme();
  });

  function bindToggle() {
    const button = document.getElementById("theme-toggle");
    if (!button) return;
    button.hidden = false;
    button.addEventListener("click", () => {
      preference = root.dataset.theme === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(storageKey, preference);
      } catch {
        // Keep the selection for this page even if it cannot be saved.
      }
      applyTheme();
    });
    applyTheme();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindToggle, { once: true });
  } else {
    bindToggle();
  }
})();
