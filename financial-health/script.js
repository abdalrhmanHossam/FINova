const form = document.getElementById("healthForm");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const income = getNumber("income");
    const expenses = getNumber("expenses");
    const debt = getNumber("debt");
    const savings = getNumber("savings");
    const emergency = getNumber("emergency");

    if (income <= 0) {
        alert("Please enter a monthly income greater than zero.");
        return;
    }

    const expenseRatio = expenses / income;
    const debtRatio = debt / income;
    const savingsRate = savings / income;
    const monthlyNeeds = Math.max(expenses + debt, 1);
    const emergencyCover = emergency / monthlyNeeds;

    let score = 100;
    score -= Math.max(0, expenseRatio - 0.5) * 70;
    score -= Math.max(0, debtRatio - 0.25) * 90;
    score -= Math.max(0, 0.2 - savingsRate) * 100;
    score += Math.min(emergencyCover, 6) * 2;
    score = Math.max(0, Math.min(100, Math.round(score)));

    updateScore(score);
    updateMetric("expenseRatio", expenseRatio * 100, "%");
    updateMetric("debtRatio", debtRatio * 100, "%");
    updateMetric("savingsRate", savingsRate * 100, "%");
    document.getElementById("emergencyCover").textContent = emergencyCover.toFixed(1) + " mo";
    updateRecommendations({ expenseRatio, debtRatio, savingsRate, emergencyCover });
});

function getNumber(id) {
    return parseFloat(document.getElementById(id).value) || 0;
}

function updateMetric(id, value, suffix) {
    document.getElementById(id).textContent = value.toFixed(1) + suffix;
}

function updateScore(score) {
    const ring = document.getElementById("scoreRing");
    const value = document.getElementById("scoreValue");
    const label = document.getElementById("scoreLabel");
    const summary = document.getElementById("scoreSummary");

    let color = "#22c55e";
    let title = "Strong position";
    let text = "Your money habits look healthy. Keep protecting your savings and emergency fund.";

    if (score < 55) {
        color = "#ef4444";
        title = "Needs attention";
        text = "Your budget is under pressure. Focus on reducing expenses or debt first.";
    } else if (score < 75) {
        color = "#f59e0b";
        title = "Stable but improvable";
        text = "You are on track, but a few adjustments can strengthen your monthly position.";
    }

    value.textContent = score;
    label.textContent = title;
    summary.textContent = text;
    ring.style.background = `conic-gradient(${color} ${score * 3.6}deg, rgba(255,255,255,0.12) 0deg)`;
}

function updateRecommendations(data) {
    const list = document.getElementById("recommendationList");
    const items = [];

    if (data.expenseRatio > 0.6) {
        items.push("Your living expenses are above 60% of income. Try setting a monthly spending cap.");
    } else {
        items.push("Your expense ratio is manageable. Keep tracking spending weekly.");
    }

    if (data.debtRatio > 0.3) {
        items.push("Debt payments are high. Prioritize paying down the highest-interest balance.");
    } else {
        items.push("Your debt ratio is within a safer range.");
    }

    if (data.savingsRate < 0.2) {
        items.push("Aim for at least 20% savings if possible, even by starting with small automatic transfers.");
    } else {
        items.push("Great savings rate. Consider assigning savings to specific goals.");
    }

    if (data.emergencyCover < 3) {
        items.push("Build your emergency fund toward 3 to 6 months of essential costs.");
    } else {
        items.push("Your emergency fund coverage is healthy.");
    }

    list.innerHTML = items.map(item => `<li>${item}</li>`).join("");
}
