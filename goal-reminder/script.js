document.getElementById("reminderForm").addEventListener("submit", event => {
    event.preventDefault();
    const target = parseFloat(document.getElementById("target").value) || 0;
    const saved = parseFloat(document.getElementById("saved").value) || 0;
    const months = parseInt(document.getElementById("months").value, 10) || 1;
    const remaining = Math.max(target - saved, 0);
    const monthly = remaining / months;
    document.getElementById("result").textContent =
        remaining === 0
            ? "Goal reached. You are already at or above your target."
            : `You need to save $${monthly.toFixed(2)} per month to reach your goal.`;
});
