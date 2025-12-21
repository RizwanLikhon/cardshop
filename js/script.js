document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  syncAllQuantities();

  const btn = document.getElementById("productsBtn");
  const menu = document.getElementById("productsMenu");

  if (btn && menu) {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.classList.toggle("show");
    });

    document.addEventListener("click", () => {
      menu.classList.remove("show");
    });
  }
});

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(i => i.id === product.id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart(cart);
  updateCartCount();
  syncQuantity(product.id);
}

function changeQty(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);

  if (!item && delta > 0) {
    return;
  }

  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      const index = cart.findIndex(i => i.id === id);
      cart.splice(index, 1);
    }
  }

  saveCart(cart);
  updateCartCount();
  syncQuantity(id);
}

function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((sum, i) => sum + i.qty, 0);
  const el = document.getElementById("cart-count");
  if (el) el.textContent = total;
}

function syncQuantity(id) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  const qtyEl = document.getElementById(`qty-${id}`);
  if (qtyEl) qtyEl.textContent = item ? item.qty : 0;
}

function syncAllQuantities() {
  document.querySelectorAll("[id^='qty-']").forEach(el => {
    const id = el.id.replace("qty-", "");
    syncQuantity(id);
  });
}
