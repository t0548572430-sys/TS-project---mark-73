// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem('lalineCart') || '[]');
// Get cart from shared storage
function loadCart() {
    const savedCart = localStorage.getItem('lalineCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    renderCart();
    updateCartBadge();
}
// Update cart badge
function updateCartBadge() {
    const cartBtn = document.querySelector('.icon-btn[aria-label="סל קניות"]');
    if (!cartBtn)
        return;
    const itemCount = cart.reduce((count, item) => count + item.quantity, 0);
    const existingBadge = cartBtn.querySelector('.cart-badge');
    if (existingBadge) {
        existingBadge.remove();
    }
    if (itemCount > 0) {
        const badge = document.createElement('span');
        badge.className = 'cart-badge';
        badge.textContent = itemCount.toString();
        cartBtn.style.position = 'relative';
        cartBtn.appendChild(badge);
    }
}
// Render cart items
function renderCart() {
    const container = document.getElementById('cartItemsContainer');
    const emptyCart = document.getElementById('emptyCart');
    const cartContent = document.querySelector('.cart-content');
    if (!container)
        return;
    if (cart.length === 0) {
        if (cartContent)
            cartContent.style.display = 'none';
        if (emptyCart)
            emptyCart.style.display = 'block';
        return;
    }
    if (cartContent)
        cartContent.style.display = 'grid';
    if (emptyCart)
        emptyCart.style.display = 'none';
    container.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="../${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h3 class="cart-item-name">${item.name}</h3>
                <div class="cart-item-price">₪${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <div class="cart-item-price">₪${(item.price * item.quantity).toFixed(2)}</div>
                <button class="remove-item-btn" onclick="removeItem(${item.id})">הסר</button>
            </div>
        </div>
    `).join('');
    updateSummary();
}
// Update quantity
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeItem(productId);
        return;
    }
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        renderCart();
    }
}
// Remove item
function removeItem(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
}
// Clear cart
function clearCart() {
    if (confirm('האם אתה בטוח שברצונך לרוקן את הסל?')) {
        cart = [];
        saveCart();
        renderCart();
    }
}
// Save cart to localStorage
function saveCart() {
    localStorage.setItem('lalineCart', JSON.stringify(cart));
    updateCartBadge();
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
// Update summary
function updateSummary() {
    var _a;
    const { subtotal, discount, total } = calculateDiscount();
    const shipping = subtotal > 200 ? 0 : 20; // Free shipping over ₪200
    const finalTotal = total + shipping;
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const totalEl = document.getElementById('total');
    if (subtotalEl)
        subtotalEl.textContent = `₪${subtotal.toFixed(2)}`;
    if (shippingEl)
        shippingEl.textContent = shipping === 0 ? 'חינם' : `₪${shipping.toFixed(2)}`;
    // Show discount if applicable
    const summaryContainer = document.querySelector('.cart-summary');
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
// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    const clearBtn = document.getElementById('clearCartBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearCart);
    }
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn && cart.length === 0) {
        checkoutBtn.style.opacity = '0.5';
        checkoutBtn.style.pointerEvents = 'none';
    }
});
// Make functions globally accessible
window.updateQuantity = updateQuantity;
window.removeItem = removeItem;
export {};
