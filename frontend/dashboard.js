const API_URL = "https://notes-app-1-gw0y.onrender.com";

document.addEventListener("DOMContentLoaded", async () => {
  const username = localStorage.getItem("username") || "User";
  document.getElementById("username").textContent = username;

  const token = localStorage.getItem("token");
  const taskList = document.getElementById("task-list");
  const addBtn = document.getElementById("add-btn");
  const newTaskInput = document.getElementById("new-task");
  const logoutBtn = document.getElementById("logout-btn");

  async function fetchTasks() {
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const tasks = await res.json();
      if (res.ok) renderTasks(tasks);
      else throw new Error(tasks.error || "Failed to load tasks");
    } catch (err) {
      console.error(err);
      alert("❌ Unable to fetch tasks.");
    }
  }

  function renderTasks(tasks) {
    taskList.innerHTML = "";
    if (!tasks.length) {
      taskList.innerHTML = "<li>No tasks yet.</li>";
      return;
    }

    tasks.forEach((task) => {
      const li = document.createElement("li");
      li.textContent = task.title;
      taskList.appendChild(li);
    });
  }

  addBtn.addEventListener("click", async () => {
    const newTask = newTaskInput.value.trim();
    if (!newTask) return alert("Please enter a task");

    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTask }),
      });

      if (res.ok) {
        newTaskInput.value = "";
        fetchTasks();
      } else {
        alert("Failed to add task");
      }
    } catch (err) {
      console.error(err);
    }
  });

  logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "index.html";
  });

  fetchTasks();
});