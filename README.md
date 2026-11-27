# SpendWise — Interactive Budget & Expense Tracker

## What Improvements Were Made to SpendWise This Week
In the **Make SpendWise Interactive** assignment on [PLP Academy](https://academy.powerlearnprojectafrica.org/module/6a7d55799bdd17521a677e8a?study=true&week=6a7d559b9bdd17521a677f80&assignment=6a7d559e9bdd17521a677f87), SpendWise progressed from static/console-driven budget logic into a dynamic, interactive budgeting web application:
- Added forms for setting the monthly budget (`#budget-form`) and logging expense records (`#expense-form`) with description, category, and amount.
- Stored expense entries in an array of objects (`expenseRecords`) instead of separate variables per expense.
- Processed expense arrays with loops to calculate total spending and render matching items on the page.
- Updated summary metrics, status badges, feedback banners, and expense items directly in the DOM.
- Added event listeners for form submissions, category filtering, deleting single expenses, clearing expenses, and resetting sample data.

## How Conditionals Are Used in the Project
- **Input Validation:** Form handlers check whether the budget or expense amount is `NaN` or less than or equal to `0` (and whether the description is empty) before updating application state, showing an alert message when input is invalid.
- **Budget Decision Logic (`getBudgetDecision`):** Uses `if / else if` conditions to determine budget status:
  - **Over Budget** (`remaining < 0`): Highlights overspending and displays the excess amount.
  - **Near Limit** (`ratioUsed >= 0.8`): Warns when spending reaches 80% or more of the monthly budget.
  - **Within Budget** (otherwise): Confirms remaining funds within the budget.
- **Category Filtering:** Inside `renderExpensesUI()`, checks `selectedCategory !== "All"` to skip items that do not match the selected category filter.

## How Arrays Are Used to Store Data
- `SAMPLE_EXPENSES` holds starter expense objects (`{ id, title, category, amount }`).
- `expenseRecords` stores the active list of expense objects in memory during the session.
- `.push()` adds new expenses from the form, `.filter()` removes a specific expense by `id` when deleted, and `.map()` clones default records when resetting sample data.

## How the DOM Is Updated
- `document.getElementById()` selects key UI elements (`#budget-display`, `#expenses-display`, `#balance-display`, `#status-badge`, `#budget-alert`, `#alert-text`, `#expense-list`, `#record-count`, and `#empty-message`).
- `.textContent` and `.className` dynamically update totals, remaining balance, status labels, and alert styling.
- `renderExpensesUI()` clears `#expense-list` and builds list items using `document.createElement()`, `.textContent`, and `.appendChild()`, toggling `#empty-message.hidden` when no matching records are shown.

## How User Interactions Are Handled Through Events
- `#budget-form` (`submit` with `event.preventDefault()`) updates `monthlyBudget` and refreshes the dashboard.
- `#expense-form` (`submit` with `event.preventDefault()`) validates fields, appends the new record to `expenseRecords`, resets inputs, and updates the view.
- `#expense-list` uses `click` event delegation to detect `.btn-delete` buttons via `target.dataset.id` and remove that record.
- `#filter-select` (`change`) updates `selectedCategory` and re-renders the list, `#clear-all-btn` (`click`) clears `expenseRecords`, and `#reset-btn` (`click`) restores sample data.

## Challenges Encountered and How They Were Resolved
- **Keeping Totals Accurate While Filtering by Category:** Filtering the displayed list by category could misreport total expenses if calculated only from visible rows. This was resolved by summing the full `expenseRecords` array in `sumExpenses(expenseRecords)` while filtering only during `renderExpensesUI()`.
- **Preventing Page Reloads and Invalid Inputs:** Default form submissions reload the page and can accept blank or non-positive numbers. Using `event.preventDefault()` along with `Number.isNaN()` and `<= 0` checks kept state reliable and surfaced clear error messages.
- **Managing Delete Actions on Dynamic Items:** Because expense rows are rendered dynamically, attaching individual listeners during creation can get messy. Event delegation on `#expense-list` using `data-id` handles any added or filtered item cleanly.

## Project Files
- `index.html` — Page structure, summary cards, forms, filter controls, and expense list container.
- `style.css` — Layout styling, status/alert states, and responsive rules.
- `script.js` — Conditionals, arrays, loops, DOM updates, and event listeners.
- `README.md` — Project overview and implementation notes.
