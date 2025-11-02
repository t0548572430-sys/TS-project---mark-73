// Check if user is admin
function checkAdminAuth() {
    const userStr = localStorage.getItem('currentUser');
    const currentUser = userStr ? JSON.parse(userStr) : null;
    if (!currentUser || !currentUser.isAdmin) {
        alert('אין לך הרשאות גישה לדף זה');
        window.location.href = 'account.html';
        return false;
    }
    return true;
}

// Import products from data.js
import { products as defaultProducts } from './data.js';

// Load products from localStorage or use all products from data.js
let products = JSON.parse(localStorage.getItem('lalineProducts') || JSON.stringify(defaultProducts));

// Save products to localStorage
function saveProducts() {
    localStorage.setItem('lalineProducts', JSON.stringify(products));
    // Also update the main products list
    window.dispatchEvent(new Event('productsUpdated'));
}

// Load users from localStorage
let users = JSON.parse(localStorage.getItem('lalineUsers') || JSON.stringify([
    { id: 1, email: 'admin@laline.com', name: 'Admin User', role: 'admin', registered: '2024-01-01' },
    { id: 2, email: 'user@test.com', name: 'Test User', role: 'user', registered: '2024-01-15' }
]));

function saveUsers() {
    localStorage.setItem('lalineUsers', JSON.stringify(users));
}
// Switch tabs
function switchAdminTab(tabName) {
    const tabs = document.querySelectorAll('.admin-tab-btn');
    const contents = document.querySelectorAll('.admin-tab-content');
    tabs.forEach(tab => {
        if (tab.dataset.tab === tabName) {
            tab.classList.add('active');
        }
        else {
            tab.classList.remove('active');
        }
    });
    contents.forEach(content => {
        if (content.id === tabName + 'Tab') {
            content.classList.add('active');
        }
        else {
            content.classList.remove('active');
        }
    });
}

// Render products table
function renderProductsTable() {
    const container = document.getElementById('productsTable');
    if (!container) return;
    
    const html = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>מזהה</th>
                    <th>שם</th>
                    <th>מחיר</th>
                    <th>קטגוריה</th>
                    <th>תג</th>
                    <th>פעולות</th>
                </tr>
            </thead>
            <tbody>
                ${products.map(product => `
                    <tr>
                        <td>${product.id}</td>
                        <td>${product.name}</td>
                        <td>₪${product.price.toFixed(2)}${product.oldPrice ? ` <span style="text-decoration: line-through; color: #999;">₪${product.oldPrice.toFixed(2)}</span>` : ''}</td>
                        <td>${getCategoryName(product.category)}</td>
                        <td><span class="badge-preview ${product.badge ? 'active' : ''}">${product.badge || '-'}</span></td>
                        <td>
                            <button class="admin-action-btn discount" onclick="updateDiscount(${product.id})">🏷️ מבצע</button>
                            <button class="admin-action-btn" onclick="editProduct(${product.id})">✏️ ערוך</button>
                            <button class="admin-action-btn delete" onclick="deleteProduct(${product.id})">🗑️ מחק</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    container.innerHTML = html;
}

function getCategoryName(category) {
    const names = {
        'body-care': 'טיפוח גוף',
        'face-care': 'טיפוח פנים',
        'fragrances': 'ניחוחות',
        'home': 'בית',
        'accessories': 'אביזרים'
    };
    return names[category] || category;
}

// Render orders table
function renderOrdersTable() {
    const container = document.getElementById('ordersTable');
    if (!container)
        return;
    const orders = JSON.parse(localStorage.getItem('lalineOrders') || '[]');
    if (orders.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 40px;">אין הזמנות עדיין</p>';
        return;
    }
    const html = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>תאריך</th>
                    <th>לקוח</th>
                    <th>אימייל</th>
                    <th>סה"כ</th>
                    <th>פריטים</th>
                    <th>פעולות</th>
                </tr>
            </thead>
            <tbody>
                ${orders.map((order, index) => `
                    <tr>
                        <td>${new Date(order.date).toLocaleDateString('he-IL')}</td>
                        <td>${order.customer.firstName} ${order.customer.lastName}</td>
                        <td>${order.customer.email}</td>
                        <td>₪${order.total.toFixed(2)}</td>
                        <td>${order.items.length}</td>
                        <td>
                            <button class="admin-action-btn" onclick="viewOrder(${index})">צפה</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    container.innerHTML = html;
}

// Render users table
function renderUsersTable() {
    const container = document.getElementById('usersTable');
    if (!container) return;
    
    const html = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>מזהה</th>
                    <th>אימייל</th>
                    <th>שם</th>
                    <th>תפקיד</th>
                    <th>תאריך הרשמה</th>
                    <th>פעולות</th>
                </tr>
            </thead>
            <tbody>
                ${users.map(user => `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.email}</td>
                        <td>${user.name}</td>
                        <td>${user.role === 'admin' ? 'מנהל' : 'משתמש'}</td>
                        <td>${new Date(user.registered).toLocaleDateString('he-IL')}</td>
                        <td>
                            <button class="admin-action-btn" onclick="editUser(${user.id})">✏️ ערוך</button>
                            ${user.role !== 'admin' ? `<button class="admin-action-btn delete" onclick="deleteUser(${user.id})">🗑️ מחק</button>` : ''}
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    container.innerHTML = html;
}

// Render statistics
function renderStats() {
    const orders = JSON.parse(localStorage.getItem('lalineOrders') || '[]');
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrdersEl = document.getElementById('totalOrders');
    const totalRevenueEl = document.getElementById('totalRevenue');
    const totalUsersEl = document.getElementById('totalUsers');
    const totalProductsEl = document.getElementById('totalProducts');
    if (totalOrdersEl)
        totalOrdersEl.textContent = orders.length.toString();
    if (totalRevenueEl)
        totalRevenueEl.textContent = `₪${totalRevenue.toFixed(2)}`;
    if (totalUsersEl)
        totalUsersEl.textContent = '2';
    if (totalProductsEl)
        totalProductsEl.textContent = products.length.toString();
}
// Product actions
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    // Fill modal with product data
    document.getElementById('modalTitle').textContent = 'ערוך מוצר';
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productOldPrice').value = product.oldPrice || '';
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productImage').value = product.image;
    document.getElementById('productBadge').value = product.badge || '';
    
    // Change form submit button
    const submitBtn = document.querySelector('#addProductForm .btn-primary');
    submitBtn.textContent = 'עדכן מוצר';
    
    // Store editing product ID
    document.getElementById('addProductForm').dataset.editingId = id;
    
    // Open modal
    document.getElementById('addProductModal').classList.add('active');
}

function deleteProduct(id) {
    if (confirm('האם אתה בטוח שברצונך למחוק מוצר זה?')) {
        products = products.filter(p => p.id !== id);
        saveProducts();
        renderProductsTable();
        renderStats();
        showNotification('המוצר נמחק בהצלחה', 'success');
    }
}

function updateDiscount(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    const modal = createPromotionModal(product);
    document.body.appendChild(modal);
}

function createPromotionModal(product) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>עדכון מבצע - ${product.name}</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <form class="modal-form" onsubmit="savePromotion(event, ${product.id})">
                <div class="form-group">
                    <label>מחיר נוכחי: ₪${product.price.toFixed(2)}</label>
                </div>
                <div class="form-group">
                    <label for="newPrice">מחיר מבצע (₪) *</label>
                    <input type="number" id="newPrice" step="0.01" min="0" max="${product.price}" required>
                </div>
                <div class="form-group">
                    <label for="promotionBadge">תג מבצע</label>
                    <input type="text" id="promotionBadge" value="${product.badge || 'מבצע'}" placeholder="מבצע, הנחה 20%, וכו'">
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">ביטול</button>
                    <button type="submit" class="btn-primary">שמור מבצע</button>
                </div>
            </form>
        </div>
    `;
    return modal;
}

function savePromotion(event, productId) {
    event.preventDefault();
    const form = event.target;
    const newPrice = parseFloat(form.querySelector('#newPrice').value);
    const badge = form.querySelector('#promotionBadge').value;
    
    const product = products.find(p => p.id === productId);
    if (product) {
        if (!product.oldPrice) {
            product.oldPrice = product.price;
        }
        product.price = newPrice;
        product.badge = badge;
        saveProducts();
        renderProductsTable();
        form.closest('.modal').remove();
        showNotification('המבצע עודכן בהצלחה', 'success');
    }
}

function viewOrder(index) {
    const orders = JSON.parse(localStorage.getItem('lalineOrders') || '[]');
    const order = orders[index];
    if (!order) return;
    
    const modal = createOrderModal(order);
    document.body.appendChild(modal);
}

function createOrderModal(order) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 700px;">
            <div class="modal-header">
                <h2>פרטי הזמנה</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-form" style="padding: 24px;">
                <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                    <h3 style="margin-bottom: 12px; color: var(--color-primary);">פרטי לקוח</h3>
                    <p><strong>שם:</strong> ${order.customer.firstName} ${order.customer.lastName}</p>
                    <p><strong>אימייל:</strong> ${order.customer.email}</p>
                    <p><strong>טלפון:</strong> ${order.customer.phone}</p>
                    <p><strong>כתובת:</strong> ${order.customer.address}, ${order.customer.city} ${order.customer.zipCode}</p>
                    <p><strong>תאריך הזמנה:</strong> ${new Date(order.date).toLocaleDateString('he-IL')} ${new Date(order.date).toLocaleTimeString('he-IL')}</p>
                </div>
                
                <h3 style="margin-bottom: 12px; color: var(--color-primary);">פריטים בהזמנה</h3>
                <table class="admin-table" style="margin-bottom: 20px;">
                    <thead>
                        <tr>
                            <th>מוצר</th>
                            <th>כמות</th>
                            <th>מחיר יחידה</th>
                            <th>סה"כ</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.quantity}</td>
                                <td>₪${item.price.toFixed(2)}</td>
                                <td>₪${(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div style="background: linear-gradient(135deg, #c9a882 0%, #b89968 100%); color: white; padding: 16px; border-radius: 12px; text-align: center;">
                    <h3 style="margin: 0; font-size: 24px;">סה"כ לתשלום: ₪${order.total.toFixed(2)}</h3>
                </div>
                
                <div class="modal-actions" style="margin-top: 20px;">
                    <button type="button" class="btn-primary" onclick="this.closest('.modal').remove()">סגור</button>
                </div>
            </div>
        </div>
    `;
    return modal;
}

function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const modal = createUserEditModal(user);
    document.body.appendChild(modal);
}

function createUserEditModal(user) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>ערוך משתמש</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <form class="modal-form" onsubmit="saveUser(event, ${user.id})">
                <div class="form-group">
                    <label for="userName">שם מלא *</label>
                    <input type="text" id="userName" value="${user.name}" required>
                </div>
                <div class="form-group">
                    <label for="userEmail">אימייל *</label>
                    <input type="email" id="userEmail" value="${user.email}" required>
                </div>
                <div class="form-group">
                    <label for="userRole">תפקיד *</label>
                    <select id="userRole" required>
                        <option value="user" ${user.role === 'user' ? 'selected' : ''}>משתמש</option>
                        <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>מנהל</option>
                    </select>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">ביטול</button>
                    <button type="submit" class="btn-primary">שמור שינויים</button>
                </div>
            </form>
        </div>
    `;
    return modal;
}

function saveUser(event, userId) {
    event.preventDefault();
    const form = event.target;
    const user = users.find(u => u.id === userId);
    
    if (user) {
        user.name = form.querySelector('#userName').value;
        user.email = form.querySelector('#userEmail').value;
        user.role = form.querySelector('#userRole').value;
        saveUsers();
        renderUsersTable();
        form.closest('.modal').remove();
        showNotification('המשתמש עודכן בהצלחה', 'success');
    }
}

function deleteUser(userId) {
    if (confirm('האם אתה בטוח שברצונך למחוק משתמש זה?')) {
        users = users.filter(u => u.id !== userId);
        saveUsers();
        renderUsersTable();
        showNotification('המשתמש נמחק בהצלחה', 'success');
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'cart-notification show';
    notification.style.background = type === 'success' ? '#27ae60' : '#e74c3c';
    notification.innerHTML = `
        <div class="notification-content">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"/>
            </svg>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (!checkAdminAuth())
        return;
    // Tab switching
    document.querySelectorAll('.admin-tab-btn').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            if (tabName)
                switchAdminTab(tabName);
        });
    });
    // Modal handling
    const modal = document.getElementById('addProductModal');
    const addProductBtn = document.getElementById('addProductBtn');
    const closeModalBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const addProductForm = document.getElementById('addProductForm');
    // Open modal
    if (addProductBtn && modal) {
        addProductBtn.addEventListener('click', () => {
            modal.classList.add('active');
        });
    }
    // Close modal
    const closeModal = () => {
        if (modal) {
            modal.classList.remove('active');
            if (addProductForm) {
                addProductForm.reset();
                delete addProductForm.dataset.editingId;
                document.getElementById('modalTitle').textContent = 'הוסף מוצר חדש';
                document.querySelector('#addProductForm .btn-primary').textContent = 'הוסף מוצר';
            }
        }
    };
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }
    // Close on outside click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    // Handle form submission
    if (addProductForm) {
        addProductForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(addProductForm);
            const editingId = addProductForm.dataset.editingId;
            
            if (editingId) {
                // Update existing product
                const product = products.find(p => p.id === parseInt(editingId));
                if (product) {
                    product.name = formData.get('productName');
                    product.price = parseFloat(formData.get('productPrice'));
                    product.oldPrice = formData.get('productOldPrice') ? parseFloat(formData.get('productOldPrice')) : null;
                    product.category = formData.get('productCategory');
                    product.image = formData.get('productImage');
                    product.badge = formData.get('productBadge') || undefined;
                    showNotification('המוצר עודכן בהצלחה', 'success');
                }
                delete addProductForm.dataset.editingId;
            } else {
                // Add new product
                const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
                const newProduct = {
                    id: newId,
                    name: formData.get('productName'),
                    price: parseFloat(formData.get('productPrice')),
                    oldPrice: formData.get('productOldPrice') ? parseFloat(formData.get('productOldPrice')) : null,
                    image: formData.get('productImage'),
                    badge: formData.get('productBadge') || undefined,
                    category: formData.get('productCategory')
                };
                products.push(newProduct);
                showNotification('המוצר נוסף בהצלחה', 'success');
            }
            
            saveProducts();
            renderProductsTable();
            renderStats();
            closeModal();
        });
    }
    // Initial render
    renderProductsTable();
    renderOrdersTable();
    renderUsersTable();
    renderStats();
});
// Make functions globally accessible
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.updateDiscount = updateDiscount;
window.viewOrder = viewOrder;
window.editUser = editUser;
window.deleteUser = deleteUser;
window.savePromotion = savePromotion;
window.saveUser = saveUser;
export {};
