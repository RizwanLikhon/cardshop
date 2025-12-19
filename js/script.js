document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("productsBtn");
  const menu = document.getElementById("productsMenu");

  if (!btn || !menu) return;

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("show");
  });

  document.addEventListener("click", () => {
    menu.classList.remove("show");
  });
});
