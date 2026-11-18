const form = document.getElementById("signupForm");
const messageBox = document.getElementById("errorMessage");

const USERS_KEY = "finovaUsers";

function showMessage(message, type = "error") {
    if (!messageBox) return;
    messageBox.style.color = type === "success" ? "#39e58c" : "#ff5f6d";
    messageBox.innerText = message;
}

function loadUsers() {
    try {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
        return Array.isArray(users) ? users : [];
    } catch (error) {
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.querySelector("[name='name']").value.trim();
        const email = document.querySelector("[name='email']").value.trim().toLowerCase();
        const password = document.querySelector("[name='password']").value;
        const confirmPassword = document.querySelector("[name='confirm_password']").value;

        if (name === "" || email === "" || password === "" || confirmPassword === "") {
            showMessage("❌ Please fill all fields");
            return;
        }

        if (!isValidEmail(email)) {
            showMessage("❌ Please enter a valid email");
            return;
        }

        if (password.length < 6) {
            showMessage("❌ Password must be at least 6 characters");
            return;
        }

        if (password !== confirmPassword) {
            showMessage("❌ Passwords do not match");
            return;
        }

        const users = loadUsers();
        const exists = users.some(user => (user.email || "").toLowerCase() === email);

        if (exists) {
            showMessage("❌ This email already has an account");
            return;
        }

        users.push({
            name: name,
            email: email,
            password: password,
            createdAt: new Date().toISOString()
        });

        saveUsers(users);

        // Do not login automatically after signup. Go to login page instead.
        window.location.href = "../login/index.html?signup=success";
    });
}

function setupPasswordToggles() {
    document.querySelectorAll(".toggle-password").forEach(function (button) {
        button.addEventListener("click", function () {
            const targetId = button.getAttribute("data-target");
            const input = document.getElementById(targetId);

            if (!input) return;

            const shouldShow = input.type === "password";
            input.type = shouldShow ? "text" : "password";
            button.classList.toggle("is-visible", shouldShow);
            button.setAttribute("aria-label", shouldShow ? "Hide password" : "Show password");
        });
    });
}

setupPasswordToggles();

