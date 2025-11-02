// Mock users database (in real app, this would be server-side)
const USERS_DB = {
    'admin@laline.com': {
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        isAdmin: true
    },
    'user@test.com': {
        password: 'user123',
        firstName: 'Test',
        lastName: 'User',
        isAdmin: false
    }
};
// Check if user is logged in
function checkAuth() {
    const userStr = localStorage.getItem('currentUser');
    const currentUser = userStr ? JSON.parse(userStr) : null;
    if (currentUser) {
        showDashboard(currentUser);
    }
    else {
        showAuthForms();
    }
}
// Show auth forms
function showAuthForms() {
    const authForms = document.getElementById('authForms');
    const userDashboard = document.getElementById('userDashboard');
    if (authForms)
        authForms.style.display = 'block';
    if (userDashboard)
        userDashboard.style.display = 'none';
}
// Show dashboard
function showDashboard(user) {
    const authForms = document.getElementById('authForms');
    const userDashboard = document.getElementById('userDashboard');
    const userName = document.getElementById('userName');
    const adminCard = document.getElementById('adminCard');
    if (authForms)
        authForms.style.display = 'none';
    if (userDashboard)
        userDashboard.style.display = 'block';
    if (userName)
        userName.textContent = user.firstName;
    // Show admin card if user is admin
    if (user.isAdmin && adminCard) {
        adminCard.style.display = 'block';
    }
    
    // Add event listeners to dashboard buttons
    setupDashboardButtons();
}

function setupDashboardButtons() {
    const buttons = document.querySelectorAll('.dashboard-btn');
    buttons.forEach((btn, index) => {
        const text = btn.textContent.trim();
        if (text === 'צפה בהזמנות') {
            btn.onclick = showMyOrders;
        } else if (text === 'ערוך פרטים') {
            btn.onclick = showPersonalDetails;
        } else if (text === 'נהל כתובות') {
            btn.onclick = showAddressManagement;
        }
    });
}

function showMyOrders() {
    const orders = JSON.parse(localStorage.getItem('lalineOrders') || '[]');
    const userEmail = JSON.parse(localStorage.getItem('currentUser')).email;
    const userOrders = orders.filter(order => order.customer.email === userEmail);
    
    if (userOrders.length === 0) {
        alert('אין לך הזמנות עדיין');
        return;
    }
    
    const modal = createOrdersModal(userOrders);
    document.body.appendChild(modal);
}

function createOrdersModal(orders) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 900px;">
            <div class="modal-header">
                <h2>ההזמנות שלי</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-form" style="padding: 24px;">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>תאריך</th>
                            <th>מספר פריטים</th>
                            <th>סה"כ</th>
                            <th>פעולות</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orders.map((order, index) => `
                            <tr>
                                <td>${new Date(order.date).toLocaleDateString('he-IL')}</td>
                                <td>${order.items.length}</td>
                                <td>₪${order.total.toFixed(2)}</td>
                                <td>
                                    <button class="admin-action-btn" onclick="viewOrderDetails(${index}, '${order.customer.email}')">צפה בפרטים</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    return modal;
}

function showPersonalDetails() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const modal = createPersonalDetailsModal(user);
    document.body.appendChild(modal);
}

function createPersonalDetailsModal(user) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>פרטים אישיים</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <form class="modal-form" onsubmit="savePersonalDetails(event)">
                <div class="form-row">
                    <div class="form-group">
                        <label for="editFirstName">שם פרטי *</label>
                        <input type="text" id="editFirstName" value="${user.firstName}" required>
                    </div>
                    <div class="form-group">
                        <label for="editLastName">שם משפחה *</label>
                        <input type="text" id="editLastName" value="${user.lastName}" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="editEmail">אימייל *</label>
                    <input type="email" id="editEmail" value="${user.email}" required disabled>
                    <small style="color: #999;">לא ניתן לשנות את כתובת האימייל</small>
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

function showAddressManagement() {
    const addresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');
    const modal = createAddressModal(addresses);
    document.body.appendChild(modal);
}

function createAddressModal(addresses) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 700px;">
            <div class="modal-header">
                <h2>ניהול כתובות משלוח</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-form" style="padding: 24px;">
                ${addresses.length === 0 ? '<p style="text-align: center; padding: 20px; color: #999;">אין כתובות שמורות</p>' : `
                    <div style="display: grid; gap: 16px;">
                        ${addresses.map((addr, index) => `
                            <div style="background: #f8f9fa; padding: 16px; border-radius: 12px; border: 2px solid #e2e8f0;">
                                <h4 style="margin-bottom: 8px;">${addr.name}</h4>
                                <p style="margin: 4px 0;">${addr.address}</p>
                                <p style="margin: 4px 0;">${addr.city}, ${addr.zipCode}</p>
                                <p style="margin: 4px 0;">טלפון: ${addr.phone}</p>
                                <button class="admin-action-btn delete" onclick="deleteAddress(${index})" style="margin-top: 8px;">🗑️ מחק</button>
                            </div>
                        `).join('')}
                    </div>
                `}
                <button class="btn-primary" onclick="addNewAddress()" style="margin-top: 20px; width: 100%;">➕ הוסף כתובת חדשה</button>
            </div>
        </div>
    `;
    return modal;
}

function savePersonalDetails(event) {
    event.preventDefault();
    const form = event.target;
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    user.firstName = form.querySelector('#editFirstName').value;
    user.lastName = form.querySelector('#editLastName').value;
    
    localStorage.setItem('currentUser', JSON.stringify(user));
    document.getElementById('userName').textContent = user.firstName;
    
    form.closest('.modal').remove();
    showNotification('הפרטים עודכנו בהצלחה');
}

function viewOrderDetails(index, email) {
    const orders = JSON.parse(localStorage.getItem('lalineOrders') || '[]');
    const userOrders = orders.filter(order => order.customer.email === email);
    const order = userOrders[index];
    
    if (!order) return;
    
    // Remove current modal
    document.querySelector('.modal').remove();
    
    // Create order details modal
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
                    <p><strong>תאריך הזמנה:</strong> ${new Date(order.date).toLocaleDateString('he-IL')} ${new Date(order.date).toLocaleTimeString('he-IL')}</p>
                    <p><strong>כתובת משלוח:</strong> ${order.customer.address}, ${order.customer.city} ${order.customer.zipCode}</p>
                </div>
                
                <h3 style="margin-bottom: 12px;">פריטים בהזמנה</h3>
                <table class="admin-table" style="margin-bottom: 20px;">
                    <thead>
                        <tr>
                            <th>מוצר</th>
                            <th>כמות</th>
                            <th>מחיר</th>
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
                    <h3 style="margin: 0;">סה"כ: ₪${order.total.toFixed(2)}</h3>
                </div>
                
                <button class="btn-primary" onclick="this.closest('.modal').remove(); showMyOrders();" style="margin-top: 20px; width: 100%;">חזור להזמנות</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function addNewAddress() {
    // Remove current modal
    document.querySelector('.modal').remove();
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>הוסף כתובת חדשה</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <form class="modal-form" onsubmit="saveNewAddress(event)">
                <div class="form-group">
                    <label for="addressName">שם הכתובת (לדוגמה: בית, עבודה) *</label>
                    <input type="text" id="addressName" required>
                </div>
                <div class="form-group">
                    <label for="addressStreet">רחוב ומספר בית *</label>
                    <input type="text" id="addressStreet" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="addressCity">עיר *</label>
                        <input type="text" id="addressCity" required>
                    </div>
                    <div class="form-group">
                        <label for="addressZip">מיקוד *</label>
                        <input type="text" id="addressZip" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="addressPhone">טלפון *</label>
                    <input type="tel" id="addressPhone" required>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove(); showAddressManagement();">ביטול</button>
                    <button type="submit" class="btn-primary">שמור כתובת</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
}

function saveNewAddress(event) {
    event.preventDefault();
    const form = event.target;
    
    const addresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');
    const newAddress = {
        name: form.querySelector('#addressName').value,
        address: form.querySelector('#addressStreet').value,
        city: form.querySelector('#addressCity').value,
        zipCode: form.querySelector('#addressZip').value,
        phone: form.querySelector('#addressPhone').value
    };
    
    addresses.push(newAddress);
    localStorage.setItem('userAddresses', JSON.stringify(addresses));
    
    form.closest('.modal').remove();
    showNotification('הכתובת נוספה בהצלחה');
    showAddressManagement();
}

function deleteAddress(index) {
    if (confirm('האם אתה בטוח שברצונך למחוק כתובת זו?')) {
        const addresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');
        addresses.splice(index, 1);
        localStorage.setItem('userAddresses', JSON.stringify(addresses));
        
        document.querySelector('.modal').remove();
        showNotification('הכתובת נמחקה בהצלחה');
        showAddressManagement();
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification show';
    notification.style.background = '#27ae60';
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

// Make functions globally accessible
window.showMyOrders = showMyOrders;
window.showPersonalDetails = showPersonalDetails;
window.showAddressManagement = showAddressManagement;
window.viewOrderDetails = viewOrderDetails;
window.savePersonalDetails = savePersonalDetails;
window.addNewAddress = addNewAddress;
window.saveNewAddress = saveNewAddress;
window.deleteAddress = deleteAddress;
// Handle login
function handleLogin(e) {
    e.preventDefault();
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    if (!emailInput || !passwordInput)
        return;
    const email = emailInput.value;
    const password = passwordInput.value;
    const user = USERS_DB[email];
    if (user && user.password === password) {
        const userData = {
            email: email,
            firstName: user.firstName,
            lastName: user.lastName,
            isAdmin: user.isAdmin
        };
        localStorage.setItem('currentUser', JSON.stringify(userData));
        showDashboard(userData);
    }
    else {
        alert('אימייל או סיסמה שגויים');
    }
}
// Handle registration
function handleRegister(e) {
    e.preventDefault();
    const firstNameInput = document.getElementById('regFirstName');
    const lastNameInput = document.getElementById('regLastName');
    const emailInput = document.getElementById('regEmail');
    const passwordInput = document.getElementById('regPassword');
    const confirmPasswordInput = document.getElementById('regConfirmPassword');
    if (!firstNameInput || !lastNameInput || !emailInput || !passwordInput || !confirmPasswordInput)
        return;
    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    if (password !== confirmPassword) {
        alert('הסיסמאות אינן תואמות');
        return;
    }
    if (USERS_DB[email]) {
        alert('משתמש עם אימייל זה כבר קיים');
        return;
    }
    // In real app, this would be saved to server
    USERS_DB[email] = {
        password: password,
        firstName: firstName,
        lastName: lastName,
        isAdmin: false
    };
    const userData = {
        email: email,
        firstName: firstName,
        lastName: lastName,
        isAdmin: false
    };
    localStorage.setItem('currentUser', JSON.stringify(userData));
    alert('ההרשמה בוצעה בהצלחה!');
    showDashboard(userData);
}
// Handle logout
function handleLogout() {
    localStorage.removeItem('currentUser');
    showAuthForms();
}
// Switch between login and register tabs
function switchTab(tabName) {
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');
    tabs.forEach(tab => {
        if (tab.dataset.tab === tabName) {
            tab.classList.add('active');
        }
        else {
            tab.classList.remove('active');
        }
    });
    forms.forEach(form => {
        if (form.id === tabName + 'Form') {
            form.classList.add('active');
        }
        else {
            form.classList.remove('active');
        }
    });
}
// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    // Tab switching
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            if (tabName)
                switchTab(tabName);
        });
    });
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});
export {};
