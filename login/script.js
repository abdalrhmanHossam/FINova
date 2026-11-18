const form = document.getElementById("loginForm");
const messageBox = document.getElementById("errorMessage");

const USERS_KEY = "finovaUsers";
const CURRENT_USER_KEY = "finovaCurrentUser";

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

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.querySelector("[name='email']").value.trim().toLowerCase();
        const password = document.querySelector("[name='password']").value;

        if (email === "" || password === "") {
            showMessage("❌ Please fill all fields");
            return;
        }

        const users = loadUsers();
        const user = users.find(item => (item.email || "").toLowerCase() === email && item.password === password);

        if (!user) {
            showMessage("❌ Invalid email address or password");
            return;
        }

        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({
            name: user.name,
            email: user.email,
            loggedInAt: new Date().toISOString()
        }));

        localStorage.setItem("userSettings", JSON.stringify({
            name: user.name,
            email: user.email,
            phone: "+1 (555) 123-4567",
            currency: "USD",
            language: "en",
            notifications: "all"
        }));

        window.location.href = "../dashboard/index.html";
    });
}

const params = new URLSearchParams(window.location.search);

if (params.get("error") === "auth") {
    showMessage("❌ Please login first");
}

if (params.get("signup") === "success") {
    showMessage("✅ Account created successfully. Please login.", "success");
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

