document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCart();

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
});

/* ================= CART STORAGE ================= */
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/* ================= ADD TO CART ================= */
function addToCart(product) {
  const cart = getCart();
  const item = cart.find(i => i.id === product.id);

  if (item) {
    item.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image, // ROOT SAFE PATH
      qty: 1
    });
  }

  saveCart(cart);
  updateCartCount();
}

/* ================= CART COUNT ================= */
function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  const el = document.getElementById("cart-count");
  if (el) el.textContent = count;
}

/* ================= CART PAGE RENDER ================= */
function renderCart() {
  const container = document.getElementById("cart-items");
  if (!container) return;

  const cart = getCart();
  let total = 0;
  container.innerHTML = "";

  cart.forEach(item => {
    const rowTotal = item.price * item.qty;
    total += rowTotal;

    container.innerHTML += `
      <div class="cart-row">
        <div class="cart-product">
          <img src="${item.image}" alt="${item.name}">
          <div>
            <strong>${item.name}</strong>
            <small>SKU: ${item.id}</small>
            <div class="remove" onclick="removeItem('${item.id}')">✕ Remove</div>
          </div>
        </div>

        <span>In Stock</span>

        <input
          type="number"
          min="1"
          value="${item.qty}"
          onchange="updateQty('${item.id}', this.value)"
        >

        <span>$${item.price.toFixed(2)}</span>
        <span>$${rowTotal.toFixed(2)}</span>
      </div>
    `;
  });

  const subtotal = document.getElementById("cart-total");
  const final = document.getElementById("cart-final");

  if (subtotal) subtotal.textContent = `$${total.toFixed(2)}`;
  if (final) final.textContent = `$${total.toFixed(2)}`;
}

/* ================= UPDATE QTY ================= */
function updateQty(id, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty = parseInt(qty);
  if (item.qty <= 0) {
    removeItem(id);
    return;
  }

  saveCart(cart);
  updateCartCount();
  renderCart();
}

/* ================= REMOVE ITEM ================= */
function removeItem(id) {
  let cart = getCart();
  cart = cart.filter(i => i.id !== id);
  saveCart(cart);
  updateCartCount();
  renderCart();
}
