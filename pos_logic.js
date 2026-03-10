
// ─── POS / Cart System ───
let cart = [];

function toggleCart() {
  const modal = document.getElementById('cartModal');
  if (modal.classList.contains('active')) {
    closeModal('cartModal');
  } else {
    renderCart();
    openModal('cartModal');
  }
}

function addToCart(id) {
  const item = inventory.find(i => i.id === id);
  if (!item) return;
  
  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.cartQty++;
  } else {
    cart.push({ ...item, cartQty: 1 });
  }
  
  updateCartBadge();
  toast(`${item.name} ကို Cart ထဲ ထည့်လိုက်ပါပြီ 🛒`, 'success');
}

function updateCartQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  
  item.cartQty += delta;
  if (item.cartQty <= 0) {
    cart = cart.filter(c => c.id !== id);
  }
  
  renderCart();
  updateCartBadge();
}

function updateCartBadge() {
  const badge = document.getElementById('posBadge');
  const count = cart.reduce((s, i) => s + i.cartQty, 0);
  
  if (count > 0 && isAdmin) {
    badge.style.display = 'flex';
    document.getElementById('cartCount').textContent = count;
  } else {
    badge.style.display = 'none';
  }
}

function renderCart() {
  const container = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  
  if (cart.length === 0) {
    container.innerHTML = '<p class="no-data">Cart ထဲမှာ ဘာမှမရှိသေးပါ</p>';
    totalEl.textContent = '0 MMK';
    return;
  }
  
  let total = 0;
  container.innerHTML = cart.map(item => {
    const subtotal = item.price * item.cartQty;
    total += subtotal;
    return `
      <div class="cart-item-row">
        <div class="cart-item-info">
          <div class="cart-item-name">${esc(item.name)}</div>
          <div class="cart-item-price">${item.price.toLocaleString()} MMK</div>
        </div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="updateCartQty(${item.id}, -1)">-</button>
          <span>${item.cartQty}</span>
          <button class="qty-btn" onclick="updateCartQty(${item.id}, 1)">+</button>
        </div>
        <div style="font-weight:700; min-width:80px; text-align:right">${subtotal.toLocaleString()}</div>
      </div>
    `;
  }).join('');
  
  totalEl.textContent = total.toLocaleString() + ' MMK';
}

function openCheckout() {
  if (cart.length === 0) return;
  closeModal('cartModal');
  
  // Pre-fill customer info if any
  document.getElementById('cName').value = '';
  document.getElementById('cPhone').value = '';
  document.getElementById('cAddress').value = '';
  document.getElementById('cDelivery').value = 0;
  
  renderCheckoutSummary();
  openModal('checkoutModal');
}

function renderCheckoutSummary() {
  const container = document.getElementById('checkoutSummary');
  const subtotal = cart.reduce((s, i) => s + (i.price * i.cartQty), 0);
  const delivery = Number(document.getElementById('cDelivery').value) || 0;
  
  container.innerHTML = `
    <div class="summary-line"><span>Subtotal:</span> <span>${subtotal.toLocaleString()} MMK</span></div>
    <div class="summary-line"><span>Delivery:</span> <span>${delivery.toLocaleString()} MMK</span></div>
    <div class="summary-line summary-total"><span>Total:</span> <span>${(subtotal + delivery).toLocaleString()} MMK</span></div>
  `;
}

function generateVoucherFromPOS() {
  const customer = document.getElementById('cName').value || 'Customer Name';
  const phone = document.getElementById('cPhone').value || '-';
  const address = document.getElementById('cAddress').value || '-';
  const delivery = Number(document.getElementById('cDelivery').value) || 0;
  
  const subtotal = cart.reduce((s, i) => s + (i.price * i.cartQty), 0);
  const total = subtotal + delivery;
  
  let tableBody = cart.map(item => `
    <tr>
      <td style="padding:10px; border-bottom:1px solid #f1f5f9">${esc(item.name)}</td>
      <td style="padding:10px; border-bottom:1px solid #f1f5f9; text-align:center">${esc(item.color || '-')}</td>
      <td style="padding:10px; border-bottom:1px solid #f1f5f9; text-align:center">${item.cartQty}</td>
      <td style="padding:10px; border-bottom:1px solid #f1f5f9; text-align:right">${item.price.toLocaleString()} Ks</td>
      <td style="padding:10px; border-bottom:1px solid #f1f5f9; text-align:right; font-weight:700">${(item.price * item.cartQty).toLocaleString()} Ks</td>
    </tr>
  `).join('');

  if (delivery > 0) {
    tableBody += `
      <tr>
        <td colspan="4" style="padding:10px; text-align:right; font-weight:600">Delivery Fee:</td>
        <td style="padding:10px; text-align:right; font-weight:700">${delivery.toLocaleString()} Ks</td>
      </tr>
    `;
  }
  
  const voucherHtml = `
    <div id="voucherToPrint" style="background:#fff; padding:40px; color:#334155; font-family:sans-serif; max-width:800px; margin:0 auto;">
      <div style="text-align:center; margin-bottom:30px">
        <h1 style="font-size:2rem; margin:0; color:#1e293b">ငါ့ဆိုင် (Ngr Sine)</h1>
        <p style="text-transform:uppercase; letter-spacing:2px; font-size:0.7rem; color:#94a3b8; margin-top:5px">Skincare & Tech Products</p>
      </div>
      
      <div style="display:flex; justify-content:space-between; margin-bottom:30px; font-size:0.8rem">
        <div>
          <p style="color:#94a3b8; text-transform:uppercase; font-weight:700; margin-bottom:5px">Bill To:</p>
          <p style="font-weight:700; color:#1e293b; margin:0">${esc(customer)}</p>
          <p style="margin:2px 0">${esc(address)}</p>
          <p style="margin:0">${esc(phone)}</p>
        </div>
        <div style="text-align:right">
          <p style="color:#94a3b8; text-transform:uppercase; font-weight:700; margin-bottom:5px">Bill From:</p>
          <p style="font-weight:700; color:#1e293b; margin:0">ငါ့ဆိုင် (Ngr Sine)</p>
          <p style="margin:2px 0">Yangon, Myanmar</p>
          <p style="margin:0">09-777333368</p>
        </div>
      </div>
      
      <table style="width:100%; border-collapse:collapse; margin-bottom:30px; font-size:0.8rem">
        <thead>
          <tr style="text-transform:uppercase; color:#94a3b8; font-weight:700; border-bottom:2px solid #f1f5f9">
            <th style="padding:10px; text-align:left">Item</th>
            <th style="padding:10px; text-align:center">Color/Size</th>
            <th style="padding:10px; text-align:center">Qty</th>
            <th style="padding:10px; text-align:right">Price</th>
            <th style="padding:10px; text-align:right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${tableBody}
        </tbody>
      </table>
      
      <div style="text-align:right; margin-bottom:50px">
        <p style="color:#94a3b8; text-transform:uppercase; font-weight:700; margin-bottom:5px">Grand Total:</p>
        <p style="font-size:1.5rem; font-weight:800; color:#1e293b; margin:0">${total.toLocaleString()} Ks</p>
      </div>
      
      <div style="text-align:center; border-top:1px solid #f1f5f9; pt:30px">
        <p style="font-style:italic; font-weight:700; color:#1e293b; font-size:1.2rem">Thank You For Shopping With Us.</p>
      </div>
    </div>
  `;
  
  document.getElementById('voucherResult').innerHTML = voucherHtml;
  closeModal('checkoutModal');
  openModal('voucherModal');
  
  // Stock update
  updateStockAfterSale();
}

async function updateStockAfterSale() {
  toast('Stock များ ခဏချင်း update လုပ်နေပါသည်... 📦', 'info');
  
  for (const item of cart) {
    const original = inventory.find(i => i.id === item.id);
    if (original) {
      original.qty = Math.max(0, (original.qty || 0) - item.cartQty);
      if (original.qty === 0) original.type = 'Sold Out';
      
      // Sync each
      if (isSheetsConfigured && isOnline) {
        await updateOnSheet(original);
      }
    }
  }
  
  saveLocal(inventory);
  cart = [];
  updateCartBadge();
  refresh();
  toast('Stock စာရင်း update လုပ်ပြီးပါပြီ ✅', 'success');
}

function printVoucher() {
  const content = document.getElementById('voucherResult').innerHTML;
  const win = window.open('', '', 'height=700,width=900');
  win.document.write('<html><head><title>Voucher - NgrSine</title>');
  win.document.write('<style>body{margin:0;padding:20px;font-family:sans-serif;}</style>');
  win.document.write('</head><body>');
  win.document.write(content);
  win.document.write('</body></html>');
  win.document.close();
  setTimeout(() => {
    win.print();
    win.close();
  }, 500);
}
