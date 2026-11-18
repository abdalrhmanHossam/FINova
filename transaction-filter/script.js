const transactions = [
    { title: "Salary Deposit", date: "May 1, 2026", type: "income", amount: 5200 },
    { title: "Apple Store", date: "May 2, 2026", type: "expense", amount: 1299 },
    { title: "Restaurant", date: "May 2, 2026", type: "expense", amount: 85 },
    { title: "Stock Dividend", date: "May 3, 2026", type: "income", amount: 156 },
    { title: "Gym Membership", date: "May 5, 2026", type: "expense", amount: 49 }
];
document.getElementById("applyFilter").addEventListener("click", render);
function render() {
    const type = document.getElementById("typeFilter").value;
    const min = parseFloat(document.getElementById("minAmount").value) || 0;
    const filtered = transactions.filter(item => (type === "all" || item.type === type) && item.amount >= min);
    document.getElementById("transactionList").innerHTML = filtered.map(item => `
        <div class="transaction">
            <div><strong>${item.title}</strong><span class="date">${item.date}</span></div>
            <strong class="${item.type}">${item.type === "income" ? "+" : "-"}$${item.amount.toFixed(2)}</strong>
        </div>
    `).join("") || "<p>No transactions found.</p>";
}
render();
