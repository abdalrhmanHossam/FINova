// 1. Initialize Doughnut Chart
const ctx = document.getElementById('financeChart').getContext('2d');
let financeChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Loans', 'Living', 'Savings'],
        datasets: [{
            data: [800, 1200, 3000],
            backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
            borderWidth: 0
        }]
    },
    options: { cutout: '80%', plugins: { legend: { display: false } } }
});

// 2. Two-way Binding for Sliders & Inputs
const pairs = [
    { range: 'income-range', num: 'income-num' },
    { range: 'loan-range', num: 'loan-num' },
    { range: 'lifestyle-range', num: 'lifestyle-num' }
];

pairs.forEach(pair => {
    const rangeEl = document.getElementById(pair.range);
    const numEl = document.getElementById(pair.num);

    rangeEl.addEventListener('input', () => {
        numEl.value = rangeEl.value;
        updateFinance();
    });

    numEl.addEventListener('input', () => {
        let val = parseInt(numEl.value) || 0;
        if (val > parseInt(rangeEl.max)) val = rangeEl.max;
        rangeEl.value = val;
        updateFinance();
    });
});

function updateFinance() {
    const inc = parseInt(document.getElementById('income-num').value) || 0;
    const loa = parseInt(document.getElementById('loan-num').value) || 0;
    const lif = parseInt(document.getElementById('lifestyle-num').value) || 0;

    const remaining = Math.max(0, inc - (loa + lif));
    financeChart.data.datasets[0].data = [loa, lif, remaining];
    financeChart.update();

    const statusCircle = document.getElementById('status-circle');
    const label = document.getElementById('status-label');
    const advice = document.getElementById('advice-text');
    const ratio = inc > 0 ? (remaining / inc) * 100 : 0;

    if (ratio > 30) {
        label.innerText = "Safe";
        statusCircle.className = "status-center safe";
        advice.innerText = "Analysis: Your budget is in a very healthy and stable position.";
    } else if (ratio > 10) {
        label.innerText = "Warning";
        statusCircle.className = "status-center warn";
        advice.innerText = "Caution: Your expenses are high. Try to increase your savings.";
    } else {
        label.innerText = "Risk";
        statusCircle.className = "status-center risk";
        advice.innerText = "Risk: Your commitments exceed your safe limits. Review your spending.";
    }
}

// 3. Export PDF Report
function downloadReport() {
    const element = document.getElementById('report-area');
    const options = {
        margin: 10,
        filename: 'Financial_Report_BankPro.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, backgroundColor: '#1e293b' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(element).set(options).save();
}

// 4. AI Chatbot Logic
function toggleChat() { 
    document.getElementById('chat-window').classList.toggle('hidden'); 
}

function handleChat() {
    const input = document.getElementById('user-msg-input');
    const content = document.getElementById('chat-content');
    if (!input.value) return;

    content.innerHTML += `<div class="msg user">${input.value}</div>`;
    const userText = input.value.toLowerCase();
    input.value = "";

    setTimeout(() => {
        let reply = "I'm here to help! You can ask about savings or loans.";
        if (userText.includes("loan") || userText.includes("debt")) {
            reply = "Financial tip: Your total debt payments should ideally stay below 30% of your gross income.";
        } else if (userText.includes("save") || userText.includes("savings")) {
            reply = "A common rule is the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings.";
        } else if (userText.includes("hello") || userText.includes("hi")) {
            reply = "Hello! How can I assist you with your financial planning today?";
        }
        
        content.innerHTML += `<div class="msg bot">${reply}</div>`;
        content.scrollTop = content.scrollHeight;
    }, 800);
}