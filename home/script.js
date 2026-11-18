AOS.init({
    duration: 1000
});

const savedTheme = localStorage.getItem("finovaTheme");
if (savedTheme === "light") {
    document.body.classList.add("light-mode");
}
updateThemeButton();

function toggleTheme() {
    document.body.classList.toggle("light-mode");
    localStorage.setItem("finovaTheme", document.body.classList.contains("light-mode") ? "light" : "dark");
    updateThemeButton();
}

function updateThemeButton() {
    const button = document.querySelector(".theme-toggle");
    if (!button) return;
    button.textContent = document.body.classList.contains("light-mode") ? "Dark" : "Light";
}
