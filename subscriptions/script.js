let savings = 1250.00;

let subscriptions = [
    { id: 1, name: "Netflix", price: 15.99, lastUsed: 1 },
    { id: 2, name: "Spotify", price: 9.99, lastUsed: 2 },
    { id: 3, name: "Gym Membership", price: 50.00, lastUsed: 4 },
    { id: 4, name: "Adobe Software", price: 35.00, lastUsed: 5 },
    { id: 5, name: "Disney+", price: 12.99, lastUsed: 1 }
];

let selectedId = null;

function renderSubscriptions() {
    const container = document.getElementById("subscription-container");
    const savingsDisplay = document.getElementById("savings-balance");

    container.innerHTML = "";
    savingsDisplay.innerText = "$" + savings.toFixed(2);

    subscriptions.forEach(sub => {
        const isUnused = sub.lastUsed >= 3;
        const div = document.createElement("div");
        div.className = "sub-item";

        div.innerHTML = `
            <div class="sub-info">
                <span class="name">${sub.name}</span>
                <span class="status ${isUnused ? "warning" : ""}">
                    ${isUnused ? `Unused for ${sub.lastUsed} months` : `Last used: ${sub.lastUsed} month(s) ago`}
                </span>
            </div>
            <div class="sub-actions">
                <span class="sub-price">$${sub.price.toFixed(2)}</span>
                <button class="btn-cancel ${isUnused ? "warning-btn" : ""}" onclick="openConfirm(${sub.id})">
                    ${isUnused ? "Cancel & Transfer" : "Cancel"}
                </button>
            </div>
        `;

        container.appendChild(div);
    });
}

function openConfirm(id) {
    selectedId = id;
    const sub = subscriptions.find(item => item.id === id);

    document.getElementById("modal-text").innerHTML =
        `Are you sure you want to cancel <strong>${sub.name}</strong> and transfer <strong>$${sub.price.toFixed(2)}</strong> to your savings account?`;

    document.getElementById("overlay").style.display = "flex";
}

function closeModal() {
    document.getElementById("overlay").style.display = "none";
    selectedId = null;
}

function confirmCancellation() {
    const index = subscriptions.findIndex(item => item.id === selectedId);

    if (index !== -1) {
        const removed = subscriptions[index];
        savings += removed.price;
        subscriptions.splice(index, 1);
        showSuccess(`${removed.name} cancelled. $${removed.price.toFixed(2)} transferred to savings.`);
    }

    closeModal();
    renderSubscriptions();
}

function showSuccess(message) {
    const box = document.getElementById("success-message");
    box.innerText = message;
    box.style.display = "block";

    setTimeout(() => {
        box.style.display = "none";
    }, 4000);
}

renderSubscriptions();
