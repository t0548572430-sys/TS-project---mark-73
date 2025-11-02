import { products, categoryNames } from './data.js';
// Update cart badge - shows item count on cart icon
function updateCartBadge() {
    const cartBtn = document.querySelector('.icon-btn[aria-label="סל קניות"]');
    if (!cartBtn) {
        console.error('Cart button not found');
        return;
    }
    const cart = JSON.parse(localStorage.getItem('lalineCart') || '[]');
    const itemCount = cart.reduce((count, item) => count + item.quantity, 0);
    // Remove existing badge
    const existingBadge = cartBtn.querySelector('.cart-badge');
    if (existingBadge) {
        existingBadge.remove();
    }
    // Add badge if items exist
    if (itemCount > 0) {
        const badge = document.createElement('span');
        badge.className = 'cart-badge';
        badge.textContent = itemCount.toString();
        cartBtn.style.position = 'relative';
        cartBtn.appendChild(badge);
    }
}
function loadProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id') || '0');
    const product = products.find(p => p.id === productId);
    if (!product) {
        alert('מוצר לא נמצא');
        window.location.href = '../index.html';
        return;
    }
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productBreadcrumb').textContent = product.name;
    document.getElementById('productPrice').textContent = `₪${product.price.toFixed(2)}`;
    document.getElementById('productCategory').textContent = categoryNames[product.category] || product.category;
    const imgEl = document.getElementById('productImage');
    imgEl.src = `../${product.image}`;
    imgEl.alt = product.name;
    if (product.oldPrice) {
        const oldPriceEl = document.getElementById('productOldPrice');
        oldPriceEl.textContent = `₪${product.oldPrice.toFixed(2)}`;
        oldPriceEl.style.display = 'inline';
    }
    if (product.badge) {
        const badgeEl = document.getElementById('productBadgeDetail');
        badgeEl.textContent = product.badge;
        badgeEl.style.display = 'block';
    }
}
function addToCart() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id') || '0');
    const product = products.find(p => p.id === productId);
    const quantity = parseInt(document.getElementById('productQuantity').value);
    if (!product)
        return;
    let cart = JSON.parse(localStorage.getItem('lalineCart') || '[]');
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    }
    else {
        cart.push(Object.assign(Object.assign({}, product), { quantity }));
    }
    // Save to localStorage and update badge immediately
    localStorage.setItem('lalineCart', JSON.stringify(cart));
    updateCartBadge();
    // Show success message
    alert(`${product.name} נוסף לסל!`);
    // Redirect to cart page
    window.location.href = 'cart.html';
}
document.addEventListener('DOMContentLoaded', () => {
    var _a, _b, _c;
    loadProduct();
    updateCartBadge();
    (_a = document.getElementById('addToCartBtn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', addToCart);
    const qtyInput = document.getElementById('productQuantity');
    (_b = document.getElementById('increaseQty')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
        qtyInput.value = String(Math.min(99, parseInt(qtyInput.value) + 1));
    });
    (_c = document.getElementById('decreaseQty')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => {
        qtyInput.value = String(Math.max(1, parseInt(qtyInput.value) - 1));
    });
});
