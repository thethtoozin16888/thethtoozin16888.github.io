function addItem() {
    const container = document.getElementById('itemsContainer');
    const row = document.createElement('div');
    row.className = 'item-row flex flex-wrap md:flex-nowrap gap-4 items-end pb-4 border-b border-slate-50';
    row.innerHTML = `
        <div class="flex-1 min-w-[150px]">
            <input type="text" class="item-name w-full bg-transparent border-none py-1 text-sm focus:outline-none" placeholder="Item Description">
        </div>
        <div class="w-24">
            <input type="text" class="item-color w-full bg-transparent border-none py-1 text-sm focus:outline-none" placeholder="Color/Size">
        </div>
        <div class="w-16">
            <input type="number" class="item-qty w-full text-center bg-slate-50 rounded py-1 text-xs" placeholder="Qty" value="1">
        </div>
        <div class="w-24">
            <input type="number" class="item-price w-full text-right bg-transparent border-none py-1 text-sm focus:outline-none font-mono" placeholder="Rate">
        </div>
        <button class="text-slate-300 hover:text-rose-500 p-1 transition-colors" onclick="removeItem(this)">✕</button>
    `;
    container.appendChild(row);
}

function removeItem(btn) {
    if (document.getElementsByClassName('item-row').length > 1) {
        btn.parentElement.remove();
    }
}

function generateVoucher() {
    const customer = document.getElementById('customerName').value;
    const phone = document.getElementById('customerPhone').value;
    const address = document.getElementById('customerAddress').value;
    
    const itemNames = document.getElementsByClassName('item-name');
    const itemColors = document.getElementsByClassName('item-color');
    const qtys = document.getElementsByClassName('item-qty');
    const prices = document.getElementsByClassName('item-price');
    
    let total = 0;
    let tableBody = '';
    
    for (let i = 0; i < itemNames.length; i++) {
        const name = itemNames[i].value;
        const color = itemColors[i].value || '-';
        const qty = parseFloat(qtys[i].value) || 0;
        const price = parseFloat(prices[i].value) || 0;
        const subtotal = qty * price;
        
        if (name) {
            tableBody += `
                <tr class="font-sans">
                    <td class="py-5 px-4">${name}</td>
                    <td class="py-5 px-4 text-center">${color}</td>
                    <td class="py-5 px-4 text-center">${qty}</td>
                    <td class="py-5 px-4 text-right">${price.toLocaleString()} Ks</td>
                    <td class="py-5 px-4 text-right font-semibold text-slate-800">${subtotal.toLocaleString()} Ks</td>
                </tr>
            `;
            total += subtotal;
        }
    }
    
    // Set Header Values
    document.getElementById('vCustomer').innerText = customer || 'Name Surname';
    document.getElementById('vPhone').innerText = phone || '+00 123 456 789';
    document.getElementById('vAddress').innerText = address || '123, Street, City, 1234';
    
    // Set Body & Total
    document.getElementById('vBody').innerHTML = tableBody;
    document.getElementById('vTotal').innerText = total.toLocaleString();
    
    // Show Output
    const output = document.getElementById('voucherOutput');
    output.classList.remove('hidden');
    
    // Scroll to preview
    output.scrollIntoView({ behavior: 'smooth' });
}
