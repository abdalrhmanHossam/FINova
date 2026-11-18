/* ==========================================
   FiNova Bank Dashboard - JavaScript
   ========================================== */

const CURRENT_USER_KEY = "finovaCurrentUser";
const USERS_KEY = "finovaUsers";

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || "null");
    } catch (error) {
        return null;
    }
}

function setCurrentUser(user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

function getInitials(nameOrEmail) {
    const text = (nameOrEmail || "FiNova User").trim();
    const parts = text.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return text.slice(0, 2).toUpperCase();
}

function applyLoggedInUser() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const savedSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    const displayName = savedSettings.name || currentUser.name || currentUser.email || 'FiNova User';
    const displayEmail = savedSettings.email || currentUser.email || '';

    const userNameEl = document.getElementById('userName') || document.querySelector('.user-name');
    if (userNameEl) {
        userNameEl.textContent = displayName;
    }

    const avatar = document.querySelector('.user-avatar');
    if (avatar) {
        avatar.textContent = getInitials(displayName);
    }

    const settingName = document.getElementById('settingName');
    const settingEmail = document.getElementById('settingEmail');
    if (settingName && !settingName.value) settingName.value = displayName;
    if (settingEmail && !settingEmail.value) settingEmail.value = displayEmail;
}

(function requireLogin() {
    if (!getCurrentUser()) {
        window.location.replace('../login/index.html?error=auth');
    }
})();


// ==========================================
// MOBILE SIDEBAR TOGGLE
// ==========================================
function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('show');

    // Close sidebar when clicking outside
    if (sidebar.classList.contains('show')) {
        document.addEventListener('click', closeSidebarOutside);
    }
}

function closeSidebarOutside(event) {
    const sidebar = document.getElementById('sidebar');
    const mobileBtn = document.getElementById('mobileMenuBtn');

    if (!sidebar.contains(event.target) && !mobileBtn.contains(event.target)) {
        sidebar.classList.remove('show');
        document.removeEventListener('click', closeSidebarOutside);
    }
}

// ==========================================
// SECTION NAVIGATION
// ==========================================
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Update nav items - find by onclick attribute or href
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        const onclick = item.getAttribute('onclick');
        if (onclick && onclick.includes("'" + sectionId + "'")) {
            item.classList.add('active');
        }
    });

    // Close sidebar on mobile after selection
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('show');
    }

    // Save current section
    localStorage.setItem('currentSection', sectionId);

    // Update header title
    updateHeaderTitle(sectionId);
}

function updateHeaderTitle(sectionId) {
    const titleMap = {
        'dashboard': 'Dashboard',
        'transactions': 'Transactions',
        'simulator': 'Loan Simulator',
        'reports': 'Reports',
        'settings': 'Settings'
    };

    const headerTitle = document.querySelector('.header-title h1');
    if (headerTitle && titleMap[sectionId]) {
        headerTitle.textContent = titleMap[sectionId];
    }
}

// Restore section on load
document.addEventListener('DOMContentLoaded', function() {
    applyLoggedInUser();
    const savedSection = localStorage.getItem('currentSection') || 'dashboard';
    showSection(savedSection);
});

// ==========================================
// NOTIFICATIONS - FIXED DROPDOWN
// ==========================================
function toggleNotifications() {
    const dropdown = document.getElementById('notificationsDropdown');
    const isShowing = dropdown.classList.contains('show');

    // Close all other dropdowns first
    closeAllDropdowns();

    if (!isShowing) {
        dropdown.classList.add('show');
        // Add click outside listener with small delay to prevent immediate close
        setTimeout(() => {
            document.addEventListener('click', closeNotificationsOutside);
        }, 10);
    }
}

function closeNotificationsOutside(event) {
    const dropdown = document.getElementById('notificationsDropdown');
    const btn = document.getElementById('notificationBtn');

    // FIXED: Check if click is outside both dropdown and button
    if (!dropdown.contains(event.target) && !btn.contains(event.target)) {
        dropdown.classList.remove('show');
        document.removeEventListener('click', closeNotificationsOutside);
    }
}

function closeAllDropdowns() {
    const dropdown = document.getElementById('notificationsDropdown');
    dropdown.classList.remove('show');
    document.removeEventListener('click', closeNotificationsOutside);
}

function markAsRead(element) {
    element.classList.remove('unread');
    updateNotificationBadge();
    showToast('Notification marked as read');
}

function clearAllNotifications() {
    const list = document.getElementById('notificationsList');
    // FIXED: Use template literal (backticks) for multiline HTML string
    list.innerHTML = `<div class="notification-empty">
        <i class="fas fa-bell-slash"></i>
        <p>No new notifications</p>
    </div>`;
    updateNotificationBadge();
    showToast('All notifications cleared');
}

function updateNotificationBadge() {
    const unreadCount = document.querySelectorAll('.notification-item.unread').length;
    const badge = document.getElementById('notifBadge');

    if (unreadCount > 0) {
        badge.textContent = unreadCount;
        badge.style.display = 'block';
    } else {
        badge.style.display = 'none';
    }
}

// ==========================================
// LOAN SIMULATOR
// ==========================================
function calculateLoan() {
    const amount = parseFloat(document.getElementById('loanAmount').value);
    const rate = parseFloat(document.getElementById('interestRate').value);
    const term = parseInt(document.getElementById('loanTerm').value);

    if (!amount || !rate || !term) {
        showToast('Please fill in all fields', 'error');
        return;
    }

    // Calculate monthly payment using standard amortization formula
    const monthlyRate = rate / 100 / 12;
    const monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) / 
                          (Math.pow(1 + monthlyRate, term) - 1);
    const totalPayment = monthlyPayment * term;
    const totalInterest = totalPayment - amount;
    const annualCost = monthlyPayment * 12;

    // Display results with animation
    document.getElementById('monthlyPayment').textContent = '$' + monthlyPayment.toFixed(2);
    document.getElementById('totalInterest').textContent = '$' + totalInterest.toFixed(2);
    document.getElementById('totalPayment').textContent = '$' + totalPayment.toFixed(2);
    document.getElementById('annualCost').textContent = '$' + annualCost.toFixed(2);

    const results = document.getElementById('simulatorResults');
    results.classList.add('show');

    showToast('Loan calculation completed');
}

// ==========================================
// REPORT DOWNLOAD
// ==========================================
function downloadReport(type, filename) {
    showToast('Generating ' + type + ' report...', 'info');

    setTimeout(() => {
        const content = `FiNova Bank - ${type.toUpperCase()} REPORT
Generated: ${new Date().toLocaleString()}
User: John Doe
Account: ****4521

This is a simulated report download for demonstration purposes.
In a production environment, this would be a real PDF file.`;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        showToast(filename + ' downloaded successfully');
    }, 1500);
}

// ==========================================
// SETTINGS
// ==========================================
function saveSettings(event) {
    event.preventDefault();

    const settings = {
        name: document.getElementById('settingName').value,
        email: document.getElementById('settingEmail').value,
        phone: document.getElementById('settingPhone').value,
        currency: document.getElementById('settingCurrency').value,
        language: document.getElementById('settingLanguage').value,
        notifications: document.getElementById('settingNotifications').value
    };

    // Save to localStorage
    localStorage.setItem('userSettings', JSON.stringify(settings));

    const currentUser = getCurrentUser();
    if (currentUser) {
        const oldEmail = currentUser.email;
        currentUser.name = settings.name;
        currentUser.email = settings.email;
        setCurrentUser(currentUser);

        try {
            const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
            const userIndex = users.findIndex(user => (user.email || '').toLowerCase() === (oldEmail || '').toLowerCase());
            if (userIndex !== -1) {
                users[userIndex].name = settings.name;
                users[userIndex].email = settings.email;
                localStorage.setItem(USERS_KEY, JSON.stringify(users));
            }
        } catch (error) {
            // Ignore localStorage update errors in demo mode.
        }
    }

    // Update UI
    const userNameEl = document.getElementById('userName') || document.querySelector('.user-name');
    if (userNameEl) {
        userNameEl.textContent = settings.name;
    }
    const avatar = document.querySelector('.user-avatar');
    if (avatar) {
        avatar.textContent = getInitials(settings.name);
    }

    showToast('Settings saved successfully');
}

// Load settings on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        document.getElementById('settingName').value = settings.name || 'John Doe';
        document.getElementById('settingEmail').value = settings.email || 'john.doe@example.com';
        document.getElementById('settingPhone').value = settings.phone || '+1 (555) 123-4567';
        document.getElementById('settingCurrency').value = settings.currency || 'USD';
        document.getElementById('settingLanguage').value = settings.language || 'en';
        document.getElementById('settingNotifications').value = settings.notifications || 'all';

        // Update header
        const userNameEl = document.getElementById('userName') || document.querySelector('.user-name');
        if (userNameEl) {
            userNameEl.textContent = settings.name;
        }
        const avatar = document.querySelector('.user-avatar');
        if (avatar) {
            avatar.textContent = getInitials(settings.name);
        }
    }
});

// ==========================================
// LOGOUT
// ==========================================
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear session data
        localStorage.removeItem('currentSection');
        localStorage.removeItem('userSettings');
        localStorage.removeItem(CURRENT_USER_KEY);

        // Redirect to login
        window.location.href = '../login/index.html';
    }
}

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = toast.querySelector('.toast-icon');

    toastMessage.textContent = message;

    // Set icon and colors based on type
    if (type === 'error') {
        toastIcon.innerHTML = '<i class="fas fa-times"></i>';
        toastIcon.style.background = 'rgba(255, 71, 87, 0.15)';
        toastIcon.style.color = '#ff4757';
        toast.style.borderColor = '#ff4757';
    } else if (type === 'info') {
        toastIcon.innerHTML = '<i class="fas fa-info"></i>';
        toastIcon.style.background = 'rgba(30, 144, 255, 0.15)';
        toastIcon.style.color = '#1e90ff';
        toast.style.borderColor = '#1e90ff';
    } else {
        toastIcon.innerHTML = '<i class="fas fa-check"></i>';
        toastIcon.style.background = 'rgba(0, 212, 170, 0.15)';
        toastIcon.style.color = '#00d4aa';
        toast.style.borderColor = '#00d4aa';
    }

    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ==========================================
// KEYBOARD SHORTCUTS
// ==========================================
document.addEventListener('keydown', function(e) {
    // ESC to close notifications and sidebar
    if (e.key === 'Escape') {
        document.getElementById('notificationsDropdown').classList.remove('show');
        document.getElementById('sidebar').classList.remove('show');
    }
});

// ==========================================
// NOTIFICATION EMPTY STATE STYLING
// ==========================================
const notificationEmptyStyle = document.createElement('style');
notificationEmptyStyle.textContent = `
    .notification-empty {
        text-align: center;
        padding: 40px 20px;
        color: var(--text-secondary);
    }
    .notification-empty i {
        font-size: 32px;
        margin-bottom: 12px;
        display: block;
        color: var(--text-muted);
    }
    .notification-empty p {
        font-size: 14px;
    }
`;
document.head.appendChild(notificationEmptyStyle);