// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem('lalineCart') || '[]');
// Load cart and display summary
function loadCheckoutSummary() {
    const savedCart = localStorage.getItem('lalineCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    if (cart.length === 0) {
        alert('הסל שלך ריק');
        window.location.href = '../index.html';
        return;
    }
    renderCheckoutItems();
    updateCheckoutSummary();
}
// Render checkout items
function renderCheckoutItems() {
    const container = document.getElementById('checkoutItems');
    if (!container)
        return;
    container.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <span>${item.name} x${item.quantity}</span>
            <span>₪${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
}
// Calculate discount for "buy 400 pay 200" promotion
function calculateDiscount() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discount = 0;
    // For every 400₪ spent, you pay only 200₪ (50% off total)
    if (subtotal >= 400) {
        // Calculate how many times we hit 400₪
        const discountMultiplier = Math.floor(subtotal / 400);
        // For each 400₪, give 200₪ discount
        discount = discountMultiplier * 200;
    }
    const total = subtotal - discount;
    return { subtotal, discount, total };
}
// Update checkout summary
function updateCheckoutSummary() {
    var _a;
    const { subtotal, discount, total } = calculateDiscount();
    const shipping = 0; // Free shipping
    const finalTotal = total + shipping;
    const subtotalEl = document.getElementById('checkoutSubtotal');
    const shippingEl = document.getElementById('checkoutShipping');
    const totalEl = document.getElementById('checkoutTotal');
    if (subtotalEl)
        subtotalEl.textContent = `₪${subtotal.toFixed(2)}`;
    if (shippingEl)
        shippingEl.textContent = shipping === 0 ? 'חינם' : `₪${shipping.toFixed(2)}`;
    // Show discount if applicable
    const summaryContainer = document.querySelector('.checkout-summary');
    if (summaryContainer && discount > 0) {
        // Remove existing discount row if any
        const existingDiscount = summaryContainer.querySelector('.discount-row');
        if (existingDiscount)
            existingDiscount.remove();
        // Add discount row before total
        const totalRow = summaryContainer.querySelector('.summary-total');
        if (totalRow) {
            const discountRow = document.createElement('div');
            discountRow.className = 'summary-item discount-row';
            discountRow.innerHTML = `
                <span>הנחה (קנה 400₪ שלם 200₪):</span>
                <span style="color: #e74c3c; font-weight: 600;">-₪${discount.toFixed(2)}</span>
            `;
            (_a = totalRow.parentElement) === null || _a === void 0 ? void 0 : _a.insertBefore(discountRow, totalRow);
        }
    }
    if (totalEl)
        totalEl.textContent = `₪${finalTotal.toFixed(2)}`;
}
// Show success modal
function showSuccessModal(orderData, errorMessage) {
    const modal = document.createElement('div');
    modal.className = 'success-modal-overlay';
    modal.innerHTML = `
        <div class="success-modal">
            <div class="success-icon">
                <svg viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="currentColor"/>
                </svg>
            </div>
            ${errorMessage ? `<h2>${errorMessage}</h2>` : `
            <h2>ההזמנה בוצעה בהצלחה!</h2>
            <p>שלום ${orderData.customer.firstName}, ההזמנה שלך התקבלה ותשלח בקרוב</p>
            
            <div class="order-details">
                <div class="order-details-row">
                    <span>שם:</span>
                    <strong>${orderData.customer.firstName} ${orderData.customer.lastName}</strong>
                </div>
                <div class="order-details-row">
                    <span>אימייל:</span>
                    <strong>${orderData.customer.email}</strong>
                </div>
                <div class="order-details-row">
                    <span>כתובת:</span>
                    <strong>${orderData.customer.address}, ${orderData.customer.city}</strong>
                </div>
                <div class="order-details-row">
                    <span>מספר פריטים:</span>
                    <strong>${orderData.items.reduce((sum, item) => sum + item.quantity, 0)}</strong>
                </div>
                <div class="order-details-row order-total">
                    <span>סה"כ לתשלום:</span>
                    <strong>₪${orderData.total.toFixed(2)}</strong>
                </div>
            </div>
            `}
            
            <div class="success-modal-actions">
                <button class="modal-btn modal-btn-primary" onclick="window.location.href='../index.html'">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    </svg>
                    חזרה לדף הבית
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    // Show modal with animation
    setTimeout(() => modal.classList.add('show'), 10);
    // Auto redirect after 8 seconds
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 8000);
}
// Handle form submission
function handleCheckoutSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const { total } = calculateDiscount();
    const orderData = {
        customer: {
            email: formData.get('email'),
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            address: formData.get('address'),
            city: formData.get('city'),
            zipCode: formData.get('zipCode'),
            phone: formData.get('phone')
        },
        items: cart,
        total: total,
        date: new Date().toISOString()
    };
    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('lalineOrders') || '[]');
    orders.push(orderData);
    localStorage.setItem('lalineOrders', JSON.stringify(orders));
    // Clear cart
    localStorage.removeItem('lalineCart');
    // Show success modal
    showSuccessModal(orderData);
}
// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadCheckoutSummary();
    const form = document.getElementById('checkoutForm');
    if (form) {
        form.addEventListener('submit', handleCheckoutSubmit);
    }
});
export {};
