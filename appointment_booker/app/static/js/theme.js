document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;
  const toggle = document.getElementById("themeToggle");

  // korábban beállított theme betöltése
  const savedTheme = localStorage.getItem("theme") || "light";
  body.setAttribute("data-theme", savedTheme);

  toggle.innerHTML = savedTheme === "dark" ? "🌙" : "☀️";

  toggle.addEventListener("click", () => {
    const current = body.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    body.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    toggle.innerHTML = next === "dark" ? "🌙" : "☀️";
  });
});
