document.addEventListener("DOMContentLoaded", function () {
  const productsBtn = document.getElementById("productsBtn");
  const productsMenu = document.getElementById("productsMenu");

  if (!productsBtn || !productsMenu) return;

  // Toggle dropdown on click
  productsBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    productsMenu.classList.toggle("show");
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", function () {
    productsMenu.classList.remove("show");
  });
});
