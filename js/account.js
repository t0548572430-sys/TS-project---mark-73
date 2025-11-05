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
}
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
