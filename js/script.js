document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  syncAllQuantities();

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

/* ================= PRODUCT PAGE ================= */
function addToCart(product) {
  const cart = getCart();
  const item = cart.find(i => i.id === product.id);

  if (item) {
    item.qty++;
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

  if (!item && delta > 0) return;

  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      cart.splice(cart.indexOf(item), 1);
    }
  }

  saveCart(cart);
  updateCartCount();
  syncQuantity(id);
}

function syncQuantity(id) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  const el = document.getElementById(`qty-${id}`);
  if (el) el.textContent = item ? item.qty : 0;
}

function syncAllQuantities() {
  document.querySelectorAll("[id^='qty-']").forEach(el => {
    const id = el.id.replace("qty-", "");
    syncQuantity(id);
  });
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  const el = document.getElementById("cart-count");
  if (el) el.textContent = count;
}

/* ================= CART PAGE ================= */
function renderCart() {
  const cart = getCart();
  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  const finalEl = document.getElementById("cart-final");
  const shipMsg = document.getElementById("free-ship-msg");

  if (!container) return;

  container.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;

    container.innerHTML += `
      <div class="cart-row">
        <div class="cart-product">
          <img src="${item.image}">
          <div>
            <strong>${item.name}</strong>
            <small>SKU: ${item.id}</small>
            <div class="remove" onclick="removeItem('${item.id}')">✕ Remove</div>
          </div>
        </div>

        <span>In Stock</span>

        <input class="qty-input" type="number" min="1"
          value="${item.qty}"
          onchange="updateQty('${item.id}', this.value)">

        <span>$${item.price.toFixed(2)}</span>
        <span>$${itemTotal.toFixed(2)}</span>
      </div>
    `;
  });

  totalEl.textContent = `$${total.toFixed(2)}`;
  finalEl.textContent = `$${total.toFixed(2)}`;

  if (shipMsg) {
    if (total > 0 && total < 20) {
      shipMsg.textContent = `To qualify for Free Shipping, add $${(20 - total).toFixed(2)} more to your cart.`;
    } else if (total >= 20) {
      shipMsg.textContent = `Your order qualifies for Free Shipping!`;
    } else {
      shipMsg.textContent = "";
    }
  }
}

function updateQty(id, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty = parseInt(qty);
  if (item.qty <= 0) {
    cart.splice(cart.indexOf(item), 1);
  }

  saveCart(cart);
  updateCartCount();
  renderCart();
}

function removeItem(id) {
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
  updateCartCount();
  renderCart();
}
