const cart = [];

const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutItems = document.getElementById('checkoutItems');
const checkoutItemCount = document.getElementById('checkoutItemCount');
const checkoutSubtotal = document.getElementById('checkoutSubtotal');
const checkoutTotal = document.getElementById('checkoutTotal');
const selectedPaymentText = document.getElementById('selectedPaymentText');
const paymentMethod = document.getElementById('paymentMethod');
const orderMessage = document.getElementById('orderMessage');

const overlay = document.getElementById('overlay');
const cartDrawer = document.getElementById('cartDrawer');
const checkoutModal = document.getElementById('checkoutModal');

function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
}

function getCartCount() {
  return cart.reduce((total, item) => total + item.qty, 0);
}

function getCartTotal() {
  return cart.reduce((total, item) => total + (item.price * item.qty), 0);
}

function updateCartUI() {
  cartCount.textContent = getCartCount();
  cartTotal.textContent = formatRupiah(getCartTotal());

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center text-sm text-zinc-500">
        Keranjang masih kosong.
      </div>
    `;
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div class="rounded-3xl border border-zinc-200 bg-zinc-50 p-4">
        <div class="flex gap-4">
          <img src="${item.image}" alt="${item.name}" class="h-20 w-20 rounded-2xl object-cover">
          <div class="flex-1">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h4 class="text-sm font-semibold text-zinc-900">${item.name}</h4>
                <p class="mt-1 text-sm text-green-900">${formatRupiah(item.price)}</p>
              </div>
              <button
                onclick="removeFromCart('${item.id}')"
                class="text-sm text-red-500 transition hover:text-red-600"
              >
                Hapus
              </button>
            </div>

            <div class="mt-4 flex items-center justify-between">
              <div class="inline-flex items-center rounded-full border border-zinc-300 bg-white">
                <button onclick="changeQty('${item.id}', -1)" class="px-4 py-2 text-sm text-zinc-700">-</button>
                <span class="px-2 text-sm font-medium text-zinc-900">${item.qty}</span>
                <button onclick="changeQty('${item.id}', 1)" class="px-4 py-2 text-sm text-zinc-700">+</button>
              </div>
              <p class="text-sm font-semibold text-zinc-900">${formatRupiah(item.price * item.qty)}</p>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  renderCheckoutItems();
}

function renderCheckoutItems() {
  const total = getCartTotal();
  const count = getCartCount();

  checkoutItemCount.textContent = count;
  checkoutSubtotal.textContent = formatRupiah(total);
  checkoutTotal.textContent = formatRupiah(total);
  selectedPaymentText.textContent = paymentMethod.value || '-';

  if (cart.length === 0) {
    checkoutItems.innerHTML = `
      <div class="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center text-sm text-zinc-500">
        Belum ada produk untuk checkout.
      </div>
    `;
  } else {
    checkoutItems.innerHTML = cart.map(item => `
      <div class="rounded-[28px] border border-zinc-300 bg-white p-4">
        <div class="flex gap-4">
          <img src="${item.image}" alt="${item.name}" class="h-24 w-24 rounded-2xl object-cover">
          <div class="flex-1">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h4 class="text-base font-semibold text-zinc-900">${item.name}</h4>
                <p class="mt-1 text-sm text-zinc-500">Qty: ${item.qty}</p>
              </div>
              <p class="text-sm font-semibold text-green-900">${formatRupiah(item.price * item.qty)}</p>
            </div>
            <p class="mt-3 text-sm text-zinc-500">Harga satuan: ${formatRupiah(item.price)}</p>
          </div>
        </div>
      </div>
    `).join('');
  }
}

function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartUI();
  openCart();
}

function changeQty(id, amount) {
  const item = cart.find(product => product.id === id);
  if (!item) return;

  item.qty += amount;

  if (item.qty <= 0) {
    const index = cart.findIndex(product => product.id === id);
    cart.splice(index, 1);
  }

  updateCartUI();
}

function removeFromCart(id) {
  const index = cart.findIndex(item => item.id === id);
  if (index !== -1) {
    cart.splice(index, 1);
  }
  updateCartUI();
}

function clearCart() {
  cart.length = 0;
  updateCartUI();
}

function openCart() {
  overlay.classList.remove('hidden');
  cartDrawer.classList.remove('translate-x-full');
}

function closeCart() {
  cartDrawer.classList.add('translate-x-full');
  if (checkoutModal.classList.contains('hidden')) {
    overlay.classList.add('hidden');
  }
}

function openCheckout() {
  if (cart.length === 0) {
    alert('Keranjang masih kosong.');
    return;
  }
  checkoutModal.classList.remove('hidden');
  checkoutModal.classList.add('flex');
  overlay.classList.remove('hidden');
  renderCheckoutItems();
}

function closeCheckout() {
  checkoutModal.classList.add('hidden');
  checkoutModal.classList.remove('flex');
  if (cartDrawer.classList.contains('translate-x-full')) {
    overlay.classList.add('hidden');
  }
}

document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
    addToCart({
      id: button.dataset.id,
      name: button.dataset.name,
      price: Number(button.dataset.price),
      image: button.dataset.image
    });
  });
});

document.getElementById('openCartBtn').addEventListener('click', openCart);
document.getElementById('heroOpenCartBtn').addEventListener('click', openCart);
document.getElementById('ctaOpenCartBtn').addEventListener('click', openCart);
document.getElementById('closeCartBtn').addEventListener('click', closeCart);
document.getElementById('checkoutBtn').addEventListener('click', openCheckout);
document.getElementById('closeCheckoutBtn').addEventListener('click', closeCheckout);
document.getElementById('clearCartBtn').addEventListener('click', clearCart);

overlay.addEventListener('click', () => {
  closeCart();
  closeCheckout();
});

paymentMethod.addEventListener('change', () => {
  selectedPaymentText.textContent = paymentMethod.value || '-';
});

document.getElementById('placeOrderBtn').addEventListener('click', () => {
  const name = document.getElementById('customerName').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  const payment = paymentMethod.value;

  if (cart.length === 0) {
    alert('Keranjang masih kosong.');
    return;
  }

  if (!name || !phone || !payment) {
    alert('Lengkapi nama, nomor WhatsApp, dan metode pembayaran terlebih dahulu.');
    return;
  }

  orderMessage.classList.remove('hidden');
  orderMessage.innerHTML = `
    Pesanan berhasil dibuat atas nama <span class="font-semibold">${name}</span> dengan metode pembayaran
    <span class="font-semibold">${payment}</span>. Total pembayaran: <span class="font-semibold">${formatRupiah(getCartTotal())}</span>.
  `;
});

updateCartUI();

window.changeQty = changeQty;
window.removeFromCart = removeFromCart;     