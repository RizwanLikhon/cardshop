document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("productsBtn");
  const menu = document.getElementById("productsMenu");

  if (btn && menu) {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      menu.classList.toggle("show");
    });

    document.addEventListener("click", () => {
      menu.classList.remove("show");
    });
  }

  renderCart();
  updateCartCount();
});

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(product) {
  const cart = getCart();
  const item = cart.find(i => i.id === product.id);

  if (item) {
    item.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  updateCartCount();
}

function renderCart() {
  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  const finalEl = document.getElementById("cart-final");

  if (!container || !totalEl || !finalEl) return;

  const cart = getCart();
  container.innerHTML = "";

  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;

    const row = document.createElement("div");
    row.className = "cart-row";

    row.innerHTML = `
      <div class="cart-product">
        <img src="${item.image}">
        <div>
          <strong>${item.name}</strong>
          <small>SKU: ${item.id}</small>
          <div class="remove" onclick="removeFromCart('${item.id}')">✕ Remove</div>
        </div>
      </div>
      <div>In Stock</div>
      <div class="qty-controls">
        <button onclick="updateQuantity('${item.id}', -1)">−</button>
        <span>${item.quantity}</span>
        <button onclick="updateQuantity('${item.id}', 1)">+</button>
      </div>
      <div>$${item.price.toFixed(2)}</div>
      <div>$${(item.price * item.quantity).toFixed(2)}</div>
    `;

    container.appendChild(row);
  });

  totalEl.textContent = `$${total.toFixed(2)}`;
  finalEl.textContent = `$${total.toFixed(2)}`;
}

function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== id);
  saveCart(cart);
  renderCart();
  updateCartCount();
}

function updateQuantity(id, change) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    removeFromCart(id);
    return;
  }

  saveCart(cart);
  renderCart();
  updateCartCount();
}

function updateCartCount() {
  const el = document.getElementById("cart-count");
  if (!el) return;

  const cart = getCart();
  const count = cart.reduce((sum, i) => sum + i.quantity, 0);
  el.textContent = count;
}
