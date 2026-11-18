const form = document.getElementById("profileForm");
const fields = ["fullName", "email", "phone", "currency"];
fields.forEach(id => {
    const saved = localStorage.getItem("profile_" + id);
    if (saved) document.getElementById(id).value = saved;
});
form.addEventListener("submit", event => {
    event.preventDefault();
    fields.forEach(id => localStorage.setItem("profile_" + id, document.getElementById(id).value));
    document.getElementById("status").textContent = "Profile saved successfully.";
});
