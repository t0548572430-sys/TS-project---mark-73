// Interfaces
interface UserData {
    password: string;
    firstName: string;
    lastName: string;
    isAdmin: boolean;
}

interface CurrentUser {
    email: string;
    firstName: string;
    lastName: string;
    isAdmin: boolean;
}

interface UsersDatabase {
    [email: string]: UserData;
}

// Mock users database (in real app, this would be server-side)
const USERS_DB: UsersDatabase = {
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
function checkAuth(): void {
    const userStr = localStorage.getItem('currentUser');
    const currentUser: CurrentUser | null = userStr ? JSON.parse(userStr) : null;
    
    if (currentUser) {
        showDashboard(currentUser);
    } else {
        showAuthForms();
    }
}

// Show auth forms
function showAuthForms(): void {
    const authForms = document.getElementById('authForms');
    const userDashboard = document.getElementById('userDashboard');
    
    if (authForms) authForms.style.display = 'block';
    if (userDashboard) userDashboard.style.display = 'none';
}

// Show dashboard
function showDashboard(user: CurrentUser): void {
    const authForms = document.getElementById('authForms');
    const userDashboard = document.getElementById('userDashboard');
    const userName = document.getElementById('userName');
    const adminCard = document.getElementById('adminCard');
    
    if (authForms) authForms.style.display = 'none';
    if (userDashboard) userDashboard.style.display = 'block';
    if (userName) userName.textContent = user.firstName;
    
    // Show admin card if user is admin
    if (user.isAdmin && adminCard) {
        adminCard.style.display = 'block';
    }
}

// Handle login
function handleLogin(e: Event): void {
    e.preventDefault();
    
    const emailInput = document.getElementById('loginEmail') as HTMLInputElement;
    const passwordInput = document.getElementById('loginPassword') as HTMLInputElement;
    
    if (!emailInput || !passwordInput) return;
    
    const email = emailInput.value;
    const password = passwordInput.value;
    
    const user = USERS_DB[email];
    
    if (user && user.password === password) {
        const userData: CurrentUser = {
            email: email,
            firstName: user.firstName,
            lastName: user.lastName,
            isAdmin: user.isAdmin
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userData));
        showDashboard(userData);
    } else {
        alert('אימייל או סיסמה שגויים');
    }
}

// Handle registration
function handleRegister(e: Event): void {
    e.preventDefault();
    
    const firstNameInput = document.getElementById('regFirstName') as HTMLInputElement;
    const lastNameInput = document.getElementById('regLastName') as HTMLInputElement;
    const emailInput = document.getElementById('regEmail') as HTMLInputElement;
    const passwordInput = document.getElementById('regPassword') as HTMLInputElement;
    const confirmPasswordInput = document.getElementById('regConfirmPassword') as HTMLInputElement;
    
    if (!firstNameInput || !lastNameInput || !emailInput || !passwordInput || !confirmPasswordInput) return;
    
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
    
    const userData: CurrentUser = {
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
function handleLogout(): void {
    localStorage.removeItem('currentUser');
    showAuthForms();
}

// Switch between login and register tabs
function switchTab(tabName: string): void {
    const tabs = document.querySelectorAll<HTMLElement>('.auth-tab');
    const forms = document.querySelectorAll<HTMLElement>('.auth-form');
    
    tabs.forEach(tab => {
        if (tab.dataset.tab === tabName) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    forms.forEach(form => {
        if (form.id === tabName + 'Form') {
            form.classList.add('active');
        } else {
            form.classList.remove('active');
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', (): void => {
    checkAuth();
    
    // Tab switching
    document.querySelectorAll<HTMLElement>('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            if (tabName) switchTab(tabName);
        });
    });
    
    // Login form
    const loginForm = document.getElementById('loginForm') as HTMLFormElement;
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register form
    const registerForm = document.getElementById('registerForm') as HTMLFormElement;
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn') as HTMLButtonElement;
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});

// Export to make this file a module and avoid global scope conflicts
export {};