// =====================================================
// TASK MANAGER - WEEK 4
// =====================================================

// =====================================================
// 1. HTML ELEMENTS
// =====================================================

const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const taskForm = document.getElementById("taskForm");
const saveTaskBtn = document.getElementById("saveTaskBtn");

const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const taskPriority = document.getElementById("taskPriority");

const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");

const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

const progressText = document.getElementById("progressText");
const progressPercentage = document.getElementById("progressPercentage");

const searchBtn = document.getElementById("searchBtn");
const notificationBtn = document.getElementById("notificationBtn");

const dashboardLink = document.getElementById("dashboardLink");
const myTasksLink = document.getElementById("myTasksLink");
const completedLink = document.getElementById("completedLink");
const settingsLink = document.getElementById("settingsLink");

// =====================================================
// 2. LOAD TASKS
// =====================================================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [
  {
    id: 1,
    title: "Learn JavaScript",
    description: "Practice DOM",
    priority: "High",
    completed: false,
  },
];

// Task currently being edited
let editingTaskId = null;

// =====================================================
// 3. SAVE TASKS
// =====================================================

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// =====================================================
// 4. UPDATE STATISTICS
// =====================================================

function updateStats() {
  const total = tasks.length;

  const completed = tasks.filter(function (task) {
    return task.completed;
  }).length;

  const pending = total - completed;

  totalTasks.textContent = total;
  pendingTasks.textContent = pending;
  completedTasks.textContent = completed;

  let percentage = 0;

  if (total > 0) {
    percentage = Math.round((completed / total) * 100);
  }

  progressText.textContent = `${completed} of ${total} tasks completed`;

  progressPercentage.textContent = `${percentage}%`;

  const progressFill = document.querySelector(".progress-fill");

  if (progressFill) {
    progressFill.style.width = `${percentage}%`;
  }
}

// =====================================================
// 5. RENDER TASKS
// =====================================================

function renderTasks(taskArray = tasks) {
  taskList.innerHTML = "";

  // No tasks found message
  if (taskArray.length === 0) {
    const message = document.createElement("p");

    message.textContent = "No tasks found.";

    message.style.textAlign = "center";
    message.style.padding = "20px";
    message.style.color = "var(--muted)";

    taskList.appendChild(message);

    return;
  }

  // Create every task card
  taskArray.forEach(function (task) {
    // =============================================
    // TASK CARD
    // =============================================

    const card = document.createElement("div");

    card.classList.add("task-card");

    if (task.completed) {
      card.classList.add("completed");
    }

    // =============================================
    // CHECKBOX
    // =============================================

    const check = document.createElement("div");

    check.classList.add("task-check");

    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";

    checkbox.checked = task.completed;

    checkbox.addEventListener("change", function () {
      task.completed = checkbox.checked;

      saveTasks();

      updateStats();

      renderTasks(taskArray);
    });

    check.appendChild(checkbox);

    // =============================================
    // TASK INFORMATION
    // =============================================

    const info = document.createElement("div");

    info.classList.add("task-info");

    const title = document.createElement("h3");

    title.textContent = task.title;

    const description = document.createElement("p");

    description.textContent = task.description;

    // =============================================
    // TASK META
    // =============================================

    const meta = document.createElement("div");

    meta.classList.add("task-meta");

    const date = document.createElement("span");

    date.textContent = "Today";

    const priority = document.createElement("span");

    priority.textContent = task.priority;

    meta.appendChild(date);
    meta.appendChild(priority);

    info.appendChild(title);
    info.appendChild(description);
    info.appendChild(meta);

    // =============================================
    // THREE DOT MENU
    // =============================================

    const menuContainer = document.createElement("div");

    menuContainer.classList.add("task-menu-container");

    const menu = document.createElement("button");

    menu.classList.add("task-menu");

    menu.textContent = "⋮";

    const menuOptions = document.createElement("div");

    menuOptions.classList.add("task-options");

    // =============================================
    // EDIT
    // =============================================

    const editBtn = document.createElement("button");

    editBtn.textContent = "Edit";

    editBtn.addEventListener("click", function () {
      editingTaskId = task.id;

      taskTitle.value = task.title;

      taskDescription.value = task.description;

      taskPriority.value = task.priority;

      taskForm.style.display = "flex";

      saveTaskBtn.textContent = "Update Task";

      menuOptions.classList.remove("show");
    });

    // =============================================
    // DELETE
    // =============================================

    const deleteBtn = document.createElement("button");

    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", function () {
      const confirmDelete = confirm(
        "Are you sure you want to delete this task?",
      );

      if (!confirmDelete) {
        return;
      }

      tasks = tasks.filter(function (item) {
        return item.id !== task.id;
      });

      saveTasks();

      renderTasks();

      updateStats();

      menuOptions.classList.remove("show");
    });

    menuOptions.appendChild(editBtn);
    menuOptions.appendChild(deleteBtn);

    menuContainer.appendChild(menu);
    menuContainer.appendChild(menuOptions);

    // Open menu

    menu.addEventListener("click", function () {
      menuOptions.classList.toggle("show");
    });

    // =============================================
    // COMPLETE CARD
    // =============================================

    card.appendChild(check);
    card.appendChild(info);
    card.appendChild(menuContainer);

    taskList.appendChild(card);
  });
}

// =====================================================
// 6. ADD / UPDATE TASK
// =====================================================

saveTaskBtn.addEventListener("click", function () {
  const title = taskTitle.value.trim();

  const description = taskDescription.value.trim();

  const priority = taskPriority.value;

  // Validation

  if (title === "") {
    alert("Please enter a task title.");

    taskTitle.focus();

    return;
  }

  // =============================================
  // UPDATE
  // =============================================

  if (editingTaskId !== null) {
    const task = tasks.find(function (item) {
      return item.id === editingTaskId;
    });

    if (task) {
      task.title = title;

      task.description = description;

      task.priority = priority;
    }

    editingTaskId = null;

    saveTaskBtn.textContent = "Save Task";
  }

  // =============================================
  // CREATE
  // =============================================
  else {
    const newTask = {
      id: Date.now(),

      title: title,

      description: description,

      priority: priority,

      completed: false,
    };

    tasks.push(newTask);
  }

  saveTasks();

  renderTasks();

  updateStats();

  // Clear form

  taskTitle.value = "";

  taskDescription.value = "";

  taskPriority.value = "High";

  // Hide form

  taskForm.style.display = "none";
});

// =====================================================
// 7. ADD TASK BUTTON
// =====================================================

addTaskBtn.addEventListener("click", function () {
  taskForm.style.display = "flex";

  editingTaskId = null;

  saveTaskBtn.textContent = "Save Task";

  taskTitle.value = "";

  taskDescription.value = "";

  taskPriority.value = "High";

  taskTitle.focus();
});

// =====================================================
// 8. SEARCH + FILTER
// =====================================================

function filterTasks() {
  const searchText = searchInput.value.toLowerCase().trim();

  const filterValue = filterSelect.value;

  const filteredTasks = tasks.filter(function (task) {
    // Search title OR description

    const matchesSearch =
      task.title.toLowerCase().includes(searchText) ||
      task.description.toLowerCase().includes(searchText);

    // Status filter

    const matchesFilter =
      filterValue === "all" ||
      (filterValue === "completed" && task.completed === true) ||
      (filterValue === "pending" && task.completed === false);

    return matchesSearch && matchesFilter;
  });

  renderTasks(filteredTasks);
}

// Search while typing

searchInput.addEventListener("input", filterTasks);

// Filter dropdown

filterSelect.addEventListener("change", filterTasks);

// =====================================================
// 9. TOP SEARCH BUTTON
// =====================================================

searchBtn.addEventListener("click", function () {
  searchInput.focus();
});

// =====================================================
// 10. NOTIFICATION BUTTON
// =====================================================

notificationBtn.addEventListener("click", function () {
  const pendingCount = tasks.filter(function (task) {
    return !task.completed;
  }).length;

  if (pendingCount === 0) {
    alert("🎉 You have no pending tasks!");
  } else {
    alert(
      `You have ${pendingCount} pending task${pendingCount > 1 ? "s" : ""}.`,
    );
  }
});

// =====================================================
// 11. DASHBOARD
// =====================================================

dashboardLink.addEventListener("click", function (event) {
  event.preventDefault();

  // Reset filters

  searchInput.value = "";

  filterSelect.value = "all";

  renderTasks();

  updateStats();

  window.scrollTo({
    top: 0,

    behavior: "smooth",
  });
});

// =====================================================
// 12. MY TASKS
// =====================================================

myTasksLink.addEventListener("click", function (event) {
  event.preventDefault();

  searchInput.value = "";

  filterSelect.value = "all";

  renderTasks();

  document.querySelector(".tasks-section").scrollIntoView({
    behavior: "smooth",
  });
});

// =====================================================
// 13. COMPLETED
// =====================================================

completedLink.addEventListener("click", function (event) {
  event.preventDefault();

  searchInput.value = "";

  filterSelect.value = "completed";

  filterTasks();

  document.querySelector(".tasks-section").scrollIntoView({
    behavior: "smooth",
  });
});

// =====================================================
// 14. SETTINGS
// =====================================================

settingsLink.addEventListener("click", function (event) {
  event.preventDefault();

  alert("Settings section coming soon.");
});

// =====================================================
// 15. INITIAL LOAD
// =====================================================

renderTasks();

updateStats();

// =====================================================
// 16. CONSOLE
// =====================================================

console.log("Task Manager loaded successfully!");
