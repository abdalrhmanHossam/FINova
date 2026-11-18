document.getElementById("budgetForm").addEventListener("submit", event => {
    event.preventDefault();
    const income = parseFloat(document.getElementById("income").value) || 0;
    document.getElementById("needsValue").textContent = formatMoney(income * 0.5);
    document.getElementById("wantsValue").textContent = formatMoney(income * 0.3);
    document.getElementById("savingsValue").textContent = formatMoney(income * 0.2);
    document.getElementById("budgetResults").hidden = false;
    document.getElementById("budgetTip").textContent = "Tip: automate your savings transfer first, then spend from the remaining budget.";
});
function formatMoney(value) { return "$" + value.toFixed(2); }
