import { products } from './data.js';
// Shopping Cart State
let cart = [];
// Filter State
let currentCategory = 'all';
let currentSearchQuery = '';
let currentSort = 'default';
let filteredProducts = [];
// Cart Management
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product)
        return;
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    }
    else {
        cart.push(Object.assign(Object.assign({}, product), { quantity: 1 }));
    }
    updateCartUI();
    showCartNotification(product.name);
}
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}
function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(0, quantity);
        if (item.quantity === 0) {
            removeFromCart(productId);
        }
        else {
            updateCartUI();
        }
    }
}
function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}
function getCartItemCount() {
    return cart.reduce((count, item) => count + item.quantity, 0);
}
function updateCartUI() {
    const cartBtn = document.querySelector('.icon-btn[aria-label="סל קניות"]');
    if (!cartBtn)
        return;
    const itemCount = getCartItemCount();
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
    localStorage.setItem('lalineCart', JSON.stringify(cart));
}
function showCartNotification(productName) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17L4 12"/>
            </svg>
            <span>המוצר "${productName}" נוסף לסל</span>
        </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
function loadCart() {
    const savedCart = localStorage.getItem('lalineCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}
function showCart() {
    window.location.href = 'pages/cart.html';
}
// Filter and search products
function filterProducts() {
    let results = [...products];
    // Filter by category
    if (currentCategory !== 'all') {
        results = results.filter(p => p.category === currentCategory);
    }
    // Filter by search query
    if (currentSearchQuery) {
        results = results.filter(p => p.name.toLowerCase().includes(currentSearchQuery.toLowerCase()));
    }
    // Sort products
    switch (currentSort) {
        case 'price-low':
            results.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            results.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            results.sort((a, b) => a.name.localeCompare(b.name, 'he'));
            break;
    }
    filteredProducts = results;
    renderProducts();
    updateResultsInfo();
}
// Update results info
function updateResultsInfo() {
    const resultsCount = document.getElementById('resultsCount');
    const noResults = document.getElementById('noResults');
    const productGrid = document.getElementById('bestSellers');
    if (!resultsCount || !noResults || !productGrid)
        return;
    if (filteredProducts.length === 0) {
        noResults.style.display = 'block';
        productGrid.style.display = 'none';
        resultsCount.textContent = 'לא נמצאו מוצרים';
    }
    else {
        noResults.style.display = 'none';
        productGrid.style.display = 'grid';
        resultsCount.textContent = `מציג ${filteredProducts.length} מוצרים`;
    }
}
// Render products
function renderProducts() {
    const container = document.getElementById('bestSellers');
    if (!container)
        return;
    container.innerHTML = filteredProducts.map(product => {
        // Determine badge class based on badge text
        let badgeClass = '';
        if (product.badge) {
            const badge = product.badge.toLowerCase();
            if (badge.includes('new') || badge.includes('חדש'))
                badgeClass = 'new';
            else if (badge.includes('מבצע') || badge.includes('sale'))
                badgeClass = 'sale';
            else if (badge.includes('פופולר') || badge.includes('popular'))
                badgeClass = 'popular';
            else if (badge.includes('מומלץ') || badge.includes('hot'))
                badgeClass = 'hot';
            else if (badge.includes('מוגבל') || badge.includes('limited'))
                badgeClass = 'limited';
            else if (badge.includes('%') || badge.includes('₪'))
                badgeClass = 'discount';
        }
        return `
        <div class="product-card" data-product-id="${product.id}">
            ${product.badge ? `<div class="product-badge ${badgeClass}">${product.badge}</div>` : ''}
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">₪ ${product.price.toFixed(2)}</div>
                ${product.oldPrice ? `<div class="product-price-old">₪ ${product.oldPrice.toFixed(2)}</div>` : ''}
                <div class="quantity-selector">
                    <button class="qty-btn minus" data-product-id="${product.id}">−</button>
                    <input type="number" class="qty-input" id="qty-${product.id}" value="1" min="1" max="99">
                    <button class="qty-btn plus" data-product-id="${product.id}">+</button>
                </div>
                <button class="add-to-cart-btn" data-product-id="${product.id}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 2L7 6H3L6 20H18L21 6H17L15 2H9Z"/>
                    </svg>
                    הוסף לסל
                </button>
            </div>
        </div>
    `;
    }).join('');
    // Product card click listeners - navigate to product page
    container.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't navigate if clicking on buttons or inputs
            const target = e.target;
            if (target.closest('.add-to-cart-btn') || target.closest('.quantity-selector')) {
                return;
            }
            const productId = card.dataset.productId;
            if (productId) {
                window.location.href = `pages/product.html?id=${productId}`;
            }
        });
        card.style.cursor = 'pointer';
    });
    // Add to cart button listeners
    container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.dataset.productId || '0');
            const qtyInput = document.getElementById(`qty-${productId}`);
            const quantity = qtyInput ? parseInt(qtyInput.value) : 1;
            // Add the specified quantity to cart
            const product = products.find(p => p.id === productId);
            if (!product)
                return;
            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity += quantity;
            }
            else {
                cart.push(Object.assign(Object.assign({}, product), { quantity }));
            }
            updateCartUI();
            showCartNotification(product.name);
            // Reset quantity to 1
            if (qtyInput)
                qtyInput.value = '1';
        });
    });
    // Quantity plus button listeners
    container.querySelectorAll('.qty-btn.plus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.dataset.productId || '0');
            const qtyInput = document.getElementById(`qty-${productId}`);
            if (qtyInput) {
                const currentValue = parseInt(qtyInput.value) || 1;
                const maxValue = parseInt(qtyInput.max) || 99;
                qtyInput.value = Math.min(currentValue + 1, maxValue).toString();
            }
        });
    });
    // Quantity minus button listeners
    container.querySelectorAll('.qty-btn.minus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.dataset.productId || '0');
            const qtyInput = document.getElementById(`qty-${productId}`);
            if (qtyInput) {
                const currentValue = parseInt(qtyInput.value) || 1;
                const minValue = parseInt(qtyInput.min) || 1;
                qtyInput.value = Math.max(currentValue - 1, minValue).toString();
            }
        });
    });
}
// Add smooth scroll behavior
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href') || '');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}
// Initialize navigation links
function initNavigation() {
    const cartBtn = document.querySelector('.icon-btn[aria-label="סל קניות"]');
    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showCart();
        });
    }
    // Search button - scroll to search input and focus it
    const searchBtn = document.querySelector('.icon-btn[aria-label="חיפוש"]');
    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                // Scroll to the search section
                searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Focus the input after a short delay to allow for scrolling
                setTimeout(() => {
                    searchInput.focus();
                }, 500);
            }
        });
    }
    const shopBtn = document.querySelector('.cta-button');
    if (shopBtn) {
        shopBtn.addEventListener('click', () => {
            const bestSellers = document.getElementById('bestSellers');
            if (bestSellers) {
                bestSellers.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    document.querySelectorAll('.category-card').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            var _a;
            const title = (_a = card.querySelector('.category-title')) === null || _a === void 0 ? void 0 : _a.textContent;
            alert(`עובר לקטגוריה: ${title}\nדף קטגוריה - בקרוב!`);
        });
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href') === '#') {
                e.preventDefault();
                const category = link.textContent;
                alert(`עובר ל: ${category}\nדף - בקרוב!`);
            }
        });
    });
}
// Initialize search and filter
function initSearchAndFilter() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearchQuery = e.target.value;
            filterProducts();
        });
    }
    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            // Update category
            currentCategory = btn.dataset.category || 'all';
            filterProducts();
        });
    });
    // Sort select
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            filterProducts();
        });
    }
    // Update search button in header
    const searchBtn = document.querySelector('.icon-btn[aria-label="חיפוש"]');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
                searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }
}
// Scroll to Top functionality
function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTop');
    if (!scrollBtn)
        return;
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('show');
        }
        else {
            scrollBtn.classList.remove('show');
        }
    });
    // Scroll to top when clicked
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Initialize products array
    filteredProducts = [...products];
    loadCart();
    renderProducts();
    initSmoothScroll();
    initNavigation();
    initSearchAndFilter();
    initScrollToTop();
    updateResultsInfo();
});
