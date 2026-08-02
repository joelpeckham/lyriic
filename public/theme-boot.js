(function () {
  document.documentElement.classList.add("js");
  try {
    var path = location.pathname;
    if (
      (path === "/" || path === "") &&
      localStorage.getItem("lyriic.projects.v1") != null
    ) {
      location.replace("/write");
      return;
    }
  } catch {
    /* ignore storage / navigation failures */
  }
  try {
    var raw = localStorage.getItem("lyriic.prefs.v1");
    var prefs = raw ? JSON.parse(raw) : {};
    var theme =
      prefs.theme === "light" || prefs.theme === "dark" ? prefs.theme : "system";
    var dark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (dark) document.documentElement.classList.add("dark");
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    if (prefs.contrast === "more") {
      document.documentElement.dataset.contrast = "more";
    }
  } catch {
    /* ignore corrupt prefs */
  }
})();

