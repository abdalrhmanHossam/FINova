const form = document.getElementById("goalForm");
const resultBox = document.getElementById("result");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const goalName = document.getElementById("goalName").value.trim();
    const target = parseFloat(document.getElementById("targetAmount").value) || 0;
    const saved = parseFloat(document.getElementById("savedAmount").value) || 0;

    const progress = target > 0 ? Math.min((saved / target) * 100, 100) : 0;
    let points = Math.floor(saved);
    let milestone = "Not reached 50% yet";

    if (progress >= 50) {
        points += 30;
        milestone = "50% Milestone Bonus +30 points";
    }

    let reward = "Keep saving to unlock rewards";
    if (points >= 200) {
        reward = "Gold Reward + Cashback 2%";
    } else if (points >= 100) {
        reward = "Silver Badge + Cashback 1%";
    } else if (points >= 50) {
        reward = "Bronze Badge";
    }

    let status = "Needs Improvement";
    if (progress >= 75) {
        status = "Excellent";
    } else if (progress >= 40) {
        status = "On Track";
    }

    document.getElementById("goalTitle").textContent = `Goal: ${goalName}`;
    document.getElementById("progressBar").style.width = `${progress}%`;
    document.getElementById("progressText").textContent = `${progress.toFixed(2)}%`;
    document.getElementById("pointsText").textContent = `Points: ${points}`;
    document.getElementById("rewardText").textContent = `Reward: ${reward}`;
    document.getElementById("statusText").textContent = `Status: ${status}`;
    document.getElementById("milestoneText").textContent = milestone;

    resultBox.hidden = false;
});
