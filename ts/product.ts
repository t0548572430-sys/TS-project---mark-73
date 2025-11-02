import { Product, CartItem, products, categoryNames } from './data.js';

// Update cart badge - shows item count on cart icon
function updateCartBadge(): void {
    const cartBtn = document.querySelector<HTMLElement>('.icon-btn[aria-label="סל קניות"]');
    if (!cartBtn) {
        console.error('Cart button not found');
        return;
    }
    
    const cart: CartItem[] = JSON.parse(localStorage.getItem('lalineCart') || '[]');
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

function loadProduct(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id') || '0');
    const product = products.find(p => p.id === productId);

    if (!product) {
        alert('מוצר לא נמצא');
        window.location.href = '../index.html';
        return;
    }

    document.getElementById('productName')!.textContent = product.name;
    document.getElementById('productBreadcrumb')!.textContent = product.name;
    document.getElementById('productPrice')!.textContent = `₪${product.price.toFixed(2)}`;
    document.getElementById('productCategory')!.textContent = categoryNames[product.category] || product.category;
    
    const imgEl = document.getElementById('productImage') as HTMLImageElement;
    imgEl.src = `../${product.image}`;
    imgEl.alt = product.name;

    if (product.oldPrice) {
        const oldPriceEl = document.getElementById('productOldPrice')!;
        oldPriceEl.textContent = `₪${product.oldPrice.toFixed(2)}`;
        oldPriceEl.style.display = 'inline';
    }

    if (product.badge) {
        const badgeEl = document.getElementById('productBadgeDetail')!;
        badgeEl.textContent = product.badge;
        badgeEl.style.display = 'block';
    }
}

function addToCart(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id') || '0');
    const product = products.find(p => p.id === productId);
    const quantity = parseInt((document.getElementById('productQuantity') as HTMLInputElement).value);

    if (!product) return;

    let cart: CartItem[] = JSON.parse(localStorage.getItem('lalineCart') || '[]');
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ ...product, quantity });
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
    loadProduct();
    updateCartBadge();

    document.getElementById('addToCartBtn')?.addEventListener('click', addToCart);
    
    const qtyInput = document.getElementById('productQuantity') as HTMLInputElement;
    document.getElementById('increaseQty')?.addEventListener('click', () => {
        qtyInput.value = String(Math.min(99, parseInt(qtyInput.value) + 1));
    });
    
    document.getElementById('decreaseQty')?.addEventListener('click', () => {
        qtyInput.value = String(Math.max(1, parseInt(qtyInput.value) - 1));
    });
});

export {};