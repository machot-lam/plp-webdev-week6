// SpendWise — Interactive Budgeting Application

const CURRENCY = "KES";
const INITIAL_BUDGET = 50000;

const SAMPLE_EXPENSES = [
  { id: 1, title: "Groceries & Market", category: "Food", amount: 8500 },
  { id: 2, title: "Commute & Matatu", category: "Transport", amount: 3200 },
  { id: 3, title: "Electricity Token", category: "Utilities", amount: 2000 },
  { id: 4, title: "Emergency Fund Transfer", category: "Savings", amount: 6000 },
];

// Application State
let monthlyBudget = INITIAL_BUDGET;
let expenseRecords = [];
let selectedCategory = "All";
let nextId = 5;

// DOM Element References
const budgetForm = document.getElementById("budget-form");
const budgetInput = document.getElementById("budget-input");
const expenseForm = document.getElementById("expense-form");
const titleInput = document.getElementById("title-input");
const categoryInput = document.getElementById("category-input");
const amountInput = document.getElementById("amount-input");
const filterSelect = document.getElementById("filter-select");
const resetBtn = document.getElementById("reset-btn");
const clearAllBtn = document.getElementById("clear-all-btn");

const budgetDisplay = document.getElementById("budget-display");
const expensesDisplay = document.getElementById("expenses-display");
const balanceDisplay = document.getElementById("balance-display");
const recordCountDisplay = document.getElementById("record-count");
const statusBadge = document.getElementById("status-badge");
const budgetAlert = document.getElementById("budget-alert");
const alertText = document.getElementById("alert-text");
const expenseList = document.getElementById("expense-list");
const emptyMessage = document.getElementById("empty-message");

// Format currency consistently across the UI
function formatCurrency(amount) {
  return `${CURRENCY} ${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// 1. Loop through stored expense records to calculate total spending
function sumExpenses(records) {
  let total = 0;
  for (let i = 0; i < records.length; i += 1) {
    total += records[i].amount;
  }
  return total;
}

// 2. Conditional decision making for budget status and user feedback
function getBudgetDecision(budget, totalSpent) {
  const remaining = budget - totalSpent;
  const ratioUsed = budget > 0 ? totalSpent / budget : 1;

  if (remaining < 0) {
    return {
      remaining,
      badgeLabel: "Over Budget",
      badgeClass: "badge-danger",
      alertClass: "alert-danger",
      message: `Over budget by ${formatCurrency(Math.abs(remaining))}. Review discretionary expenses to get back on track.`,
    };
  }

  if (ratioUsed >= 0.8) {
    return {
      remaining,
      badgeLabel: "Near Limit",
      badgeClass: "badge-warn",
      alertClass: "alert-warn",
      message: `Warning: You have used ${Math.round(ratioUsed * 100)}% of your budget (${formatCurrency(remaining)} remaining).`,
    };
  }

  return {
    remaining,
    badgeLabel: "Within Budget",
    badgeClass: "badge-safe",
    alertClass: "alert-safe",
    message: `On track: ${formatCurrency(remaining)} remaining out of ${formatCurrency(budget)}.`,
  };
}

// 3. Dynamically update summary cards, badge, and alert banner
function updateSummaryUI(totalSpent) {
  const decision = getBudgetDecision(monthlyBudget, totalSpent);

  budgetDisplay.textContent = formatCurrency(monthlyBudget);
  expensesDisplay.textContent = formatCurrency(totalSpent);
  balanceDisplay.textContent = formatCurrency(decision.remaining);

  statusBadge.textContent = decision.badgeLabel;
  statusBadge.className = `badge ${decision.badgeClass}`;

  budgetAlert.className = `alert ${decision.alertClass}`;
  alertText.textContent = decision.message;
}

// 4. Loop through expenseRecords array and render matching items in the DOM
function renderExpensesUI() {
  expenseList.innerHTML = "";
  let shownCount = 0;

  for (const record of expenseRecords) {
    if (selectedCategory !== "All" && record.category !== selectedCategory) {
      continue;
    }

    shownCount += 1;

    const li = document.createElement("li");
    li.className = "expense-item";

    const infoBox = document.createElement("div");
    infoBox.className = "expense-meta";

    const titleEl = document.createElement("span");
    titleEl.className = "expense-title";
    titleEl.textContent = record.title;

    const categoryEl = document.createElement("span");
    categoryEl.className = "expense-category";
    categoryEl.textContent = record.category;

    infoBox.appendChild(titleEl);
    infoBox.appendChild(categoryEl);

    const actionBox = document.createElement("div");
    actionBox.className = "expense-actions";

    const amountEl = document.createElement("span");
    amountEl.className = "expense-amount";
    amountEl.textContent = formatCurrency(record.amount);

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "btn-delete";
    deleteBtn.dataset.id = String(record.id);
    deleteBtn.textContent = "Delete";

    actionBox.appendChild(amountEl);
    actionBox.appendChild(deleteBtn);

    li.appendChild(infoBox);
    li.appendChild(actionBox);
    expenseList.appendChild(li);
  }

  recordCountDisplay.textContent = String(shownCount);
  emptyMessage.hidden = shownCount > 0;
}

// 5. Coordinate full state-to-DOM refresh
function syncDashboard() {
  const totalSpent = sumExpenses(expenseRecords);
  updateSummaryUI(totalSpent);
  renderExpensesUI();
}

function resetToSampleData() {
  monthlyBudget = INITIAL_BUDGET;
  selectedCategory = "All";
  filterSelect.value = "All";
  budgetInput.value = String(INITIAL_BUDGET);
  expenseRecords = SAMPLE_EXPENSES.map((item) => ({ ...item }));
  nextId = expenseRecords.length + 1;
  syncDashboard();
}

// Event Listeners
budgetForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const parsedBudget = Number(budgetInput.value);

  if (Number.isNaN(parsedBudget) || parsedBudget <= 0) {
    budgetAlert.className = "alert alert-danger";
    alertText.textContent = "Please enter a valid monthly budget greater than 0.";
    return;
  }

  monthlyBudget = parsedBudget;
  syncDashboard();
});

expenseForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const category = categoryInput.value;
  const amount = Number(amountInput.value);

  if (!title || Number.isNaN(amount) || amount <= 0) {
    budgetAlert.className = "alert alert-danger";
    alertText.textContent = "Please enter an expense description and an amount greater than 0.";
    return;
  }

  expenseRecords.push({
    id: nextId,
    title,
    category,
    amount,
  });
  nextId += 1;

  expenseForm.reset();
  categoryInput.value = category;
  titleInput.focus();
  syncDashboard();
});

expenseList.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement) || !target.classList.contains("btn-delete")) {
    return;
  }

  const idToRemove = Number(target.dataset.id);
  expenseRecords = expenseRecords.filter((item) => item.id !== idToRemove);
  syncDashboard();
});

filterSelect.addEventListener("change", () => {
  selectedCategory = filterSelect.value;
  renderExpensesUI();
});

clearAllBtn.addEventListener("click", () => {
  expenseRecords = [];
  syncDashboard();
});

resetBtn.addEventListener("click", () => {
  resetToSampleData();
});

document.addEventListener("DOMContentLoaded", () => {
  resetToSampleData();
});
