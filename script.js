// ===== To-Do List App =====
// Adding, editing, deleting, and marking tasks complete.
// Also includes dark mode, list/card views, and a recursion demo (countdown).

// Keep tasks saved in localStorage so they don’t disappear on refresh
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentView = "list"; // start with list view

// Bring back dark mode if user had it turned on before
if (localStorage.getItem("darkMode") === "enabled") {
document.body.classList.add("dark");
}

// ===== Event Listeners =====
document.getElementById("addBtn").addEventListener("click", addTask);

// Toggle between list view and card view
document.getElementById("listViewBtn").addEventListener("click", () => {
currentView = "list";
renderTasks();
});
document.getElementById("cardViewBtn").addEventListener("click", () => {
currentView = "cards";
renderTasks();
});

// Dark mode button (if it’s in the HTML)
const darkToggle = document.getElementById("darkModeToggle");
if (darkToggle) {
darkToggle.addEventListener("click", toggleDarkMode);
}

// ===== Main Functions =====

// Add a new task
function addTask() {
const input = document.getElementById("taskInput");
const dateInput = document.getElementById("taskDate");
const taskText = input.value.trim();
const dueDate = dateInput ? dateInput.value : "";

try {
    // Don’t allow empty tasks
    if (taskText === "") {
    throw new Error("Task cannot be empty!");
    }

    // Build the new task object
    tasks.push({
    text: taskText,
    completed: false,
    createdAt: dayjs().format("HH:mm:ss"),
    dueDate: dueDate || "No due date",
    });

    // Save changes and reset inputs
    saveTasks();
    input.value = "";
    if (dateInput) dateInput.value = "";
    renderTasks();
} catch (error) {
    alert(error.message);
}
}

// Show tasks on the page
function renderTasks() {
const container = document.getElementById("taskContainer");
container.innerHTML = "";
container.className = currentView === "cards" ? "cards" : "";

tasks.forEach((task, index) => {
    if (currentView === "list") {
    // --- List View ---
    const li = document.createElement("li");
    li.textContent = `${task.text} (Created: ${task.createdAt}, Due: ${task.dueDate})`;
    if (task.completed) li.classList.add("completed");

    // Buttons for actions
    const toggleBtn = createActionButton(
        task.completed ? "✅" : "✔️",
        () => toggleTask(index)
    );
    const editBtn = createActionButton("✏️", () => editTask(index));
    const deleteBtn = createActionButton("🗑️", () => deleteTask(index), "delete");

    li.append(toggleBtn, editBtn, deleteBtn);
    container.appendChild(li);
    } else {
    // --- Card View ---
    const card = document.createElement("div");
    card.className = "task-card";
    if (task.completed) card.classList.add("completed");

    const text = document.createElement("p");
    text.textContent = task.text;

    const dates = document.createElement("small");
    dates.textContent = `Created: ${task.createdAt} | Due: ${task.dueDate}`;

    const actions = document.createElement("div");
    actions.className = "task-actions";

    // Buttons for actions
    const toggleBtn = createActionButton(
        task.completed ? "✅" : "✔️",
        () => toggleTask(index)
    );
    const editBtn = createActionButton("✏️", () => editTask(index));
    const deleteBtn = createActionButton("🗑️", () => deleteTask(index), "delete");

    actions.append(toggleBtn, editBtn, deleteBtn);
    card.append(text, dates, actions);
    container.appendChild(card);
    }
});
}

// Make a button with an icon and action
function createActionButton(icon, action, extraClass = "") {
const btn = document.createElement("button");
btn.innerHTML = icon;
if (extraClass) btn.classList.add(extraClass);
btn.onclick = action;
return btn;
}

// Mark task as done/undone
function toggleTask(index) {
tasks[index].completed = !tasks[index].completed;
saveTasks();
renderTasks();
}

// Remove a task
function deleteTask(index) {
tasks = tasks.filter((_, i) => i !== index);
saveTasks();
renderTasks();
}

// Edit an existing task
function editTask(index) {
const newText = prompt("Edit task:", tasks[index].text);
if (newText !== null && newText.trim() !== "") {
    tasks[index].text = newText.trim();
    saveTasks();
    renderTasks();
}
}

// Switch between light and dark mode
function toggleDarkMode() {
document.body.classList.toggle("dark");
if (document.body.classList.contains("dark")) {
    localStorage.setItem("darkMode", "enabled");
} else {
    localStorage.setItem("darkMode", "disabled");
}
}

// Save tasks back to localStorage
function saveTasks() {
localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ===== Recursion Example =====
// Just a simple countdown in the console.
function countdown(seconds) {
if (seconds <= 0) {
    console.log("Countdown finished!");
    return;
}
console.log(seconds);
setTimeout(() => countdown(seconds - 1), 1000);
}

// Quick test: prints 5 → 0 in console
countdown(5);

// Load tasks right away when page starts
renderTasks();
