let currentCategory = "All";

async function fetchExpenses() {
    const url = currentCategory === "All"
        ? "/api/expenses"
        : `/api/expenses?category=${currentCategory}`;
    const res = await fetch(url);
    const expenses = await res.json();
    renderExpenses(expenses);
    updateTotal(expenses);
}

function renderExpenses(expenses) {
    const list = document.getElementById("expense-list");
    list.innerHTML = "";

    expenses.forEach(exp => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${exp.description || "-"}<br><small>${exp.date}</small></td>
            <td>${exp.category}</td>
            <td>${exp.amount.toLocaleString()}</td>
            <td><button class="delete-btn" data-id="${exp.id}">Delete</button></td>
        `;
        list.appendChild(row);
    });
}

function updateTotal(expenses) {
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    document.getElementById("total").textContent = `UGX ${total.toLocaleString()}`;
}

document.getElementById("expense-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const amount = parseFloat(document.getElementById("amount").value);
    const description = document.getElementById("description").value;
    const date = document.getElementById("date").value;
    const category = document.getElementById("category").value;

    await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, description, date, category })
    });

    document.getElementById("expense-form").reset();
    fetchExpenses();
});

document.getElementById("expense-list").addEventListener("click", async (e) => {
    if (e.target.classList.contains("delete-btn")) {
        const id = e.target.getAttribute("data-id");
        await fetch(`/api/expenses/${id}`, { method: "DELETE" });
        fetchExpenses();
    }
});

document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentCategory = btn.getAttribute("data-category");
        fetchExpenses();
    });
});

fetchExpenses();
