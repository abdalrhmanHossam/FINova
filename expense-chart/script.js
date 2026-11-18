const colors = ["#1E90FF", "#22c55e", "#f59e0b", "#ef4444"];
const labels = ["Food", "Transport", "Bills", "Shopping"];
const ids = ["food", "transport", "bills", "shopping"];
document.getElementById("expenseForm").addEventListener("submit", event => {
    event.preventDefault();
    const values = ids.map(id => parseFloat(document.getElementById(id).value) || 0);
    render(values);
});
function render(values) {
    const total = values.reduce((sum, value) => sum + value, 0) || 1;
    let start = 0;
    const parts = values.map((value, index) => {
        const pct = (value / total) * 100;
        const segment = `${colors[index]} ${start}% ${start + pct}%`;
        start += pct;
        return segment;
    });
    document.getElementById("donut").style.background = `conic-gradient(${parts.join(",")})`;
    document.getElementById("legend").innerHTML = labels.map((label, index) => {
        const pct = ((values[index] / total) * 100).toFixed(1);
        return `<div><span style="color:${colors[index]}">${label}</span><strong>$${values[index].toFixed(2)} (${pct}%)</strong></div>`;
    }).join("");
}
render([650, 180, 900, 300]);
