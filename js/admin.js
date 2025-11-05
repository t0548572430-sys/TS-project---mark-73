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
// Load products from localStorage or use defaults
let products = JSON.parse(localStorage.getItem('lalineProducts') || JSON.stringify([
    {
        id: 1,
        name: "חלוק רחצה מגבת דגם רוז",
        price: 299.90,
        oldPrice: null,
        image: "images/image (26).png",
        badge: "קנה 400₪ שלם 200₪",
        category: "body-care"
    },
    {
        id: 2,
        name: "נעלי בית קוקוני 39-40",
        price: 109.90,
        oldPrice: null,
        image: "images/image (27).png",
        badge: "קנה 400₪ שלם 200₪",
        category: "accessories"
    },
    {
        id: 3,
        name: "שמיכת פליז הדף",
        price: 179.90,
        oldPrice: null,
        image: "images/image (30).png",
        badge: "NEW",
        category: "home"
    },
    {
        id: 4,
        name: "חמאת שיאה גוף בשר 250 גרם",
        price: 139.90,
        oldPrice: 165.90,
        image: "images/image (29).png",
        badge: "קנה 400₪ שלם 200₪",
        category: "body-care"
    }
]));
// Save products to localStorage
function saveProducts() {
    localStorage.setItem('lalineProducts', JSON.stringify(products));
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
    if (!container)
        return;
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
                        <td>₪${product.price.toFixed(2)}</td>
                        <td>${product.category}</td>
                        <td><span class="badge-preview ${product.badge ? 'active' : ''}">${product.badge || '-'}</span></td>
                        <td>
                            <button class="admin-action-btn discount" onclick="updateDiscount(${product.id})">🏷️ הוסף מבצע</button>
                            <button class="admin-action-btn" onclick="editProduct(${product.id})">ערוך</button>
                            <button class="admin-action-btn delete" onclick="deleteProduct(${product.id})">מחק</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    container.innerHTML = html;
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
    if (!container)
        return;
    const users = [
        { email: 'admin@laline.com', name: 'Admin User', role: 'מנהל', registered: '2024-01-01' },
        { email: 'user@test.com', name: 'Test User', role: 'משתמש', registered: '2024-01-15' }
    ];
    const html = `
        <table class="admin-table">
            <thead>
                <tr>
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
                        <td>${user.email}</td>
                        <td>${user.name}</td>
                        <td>${user.role}</td>
                        <td>${new Date(user.registered).toLocaleDateString('he-IL')}</td>
                        <td>
                            <button class="admin-action-btn">ערוך</button>
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
    alert(`עריכת מוצר #${id} - בקרוב!`);
}
function deleteProduct(id) {
    if (confirm('האם אתה בטוח שברצונך למחוק מוצר זה?')) {
        alert(`מוצר #${id} נמחק - בקרוב!`);
    }
}
function viewOrder(index) {
    const orders = JSON.parse(localStorage.getItem('lalineOrders') || '[]');
    const order = orders[index];
    if (!order)
        return;
    const items = order.items.map(item => `${item.name} x${item.quantity} - ₪${(item.price * item.quantity).toFixed(2)}`).join('\n');
    alert(`הזמנה מ-${new Date(order.date).toLocaleDateString('he-IL')}\n\nלקוח: ${order.customer.firstName} ${order.customer.lastName}\nאימייל: ${order.customer.email}\nכתובת: ${order.customer.address}, ${order.customer.city}\n\nפריטים:\n${items}\n\nסה"כ: ₪${order.total.toFixed(2)}`);
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
            if (addProductForm)
                addProductForm.reset();
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
            const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
            const oldPriceValue = formData.get('productOldPrice');
            const badgeValue = formData.get('productBadge');
            const newProduct = {
                id: newId,
                name: formData.get('productName'),
                price: parseFloat(formData.get('productPrice')),
                oldPrice: oldPriceValue ? parseFloat(oldPriceValue) : null,
                image: formData.get('productImage'),
                badge: badgeValue || undefined,
                category: formData.get('productCategory')
            };
            products.push(newProduct);
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
window.viewOrder = viewOrder;
export {};
