document.addEventListener("DOMContentLoaded", async () => {
    const username = localStorage.getItem("username");
    document.getElementById("username").textContent = username || "User";
  
    const token = localStorage.getItem("token");
    const taskList = document.getElementById("task-list");
    const addBtn = document.getElementById("add-btn");
    const newTaskInput = document.getElementById("new-task");
    const logoutBtn = document.getElementById("logout-btn");
  
    // ✅ Fetch tasks
    async function fetchTasks() {
      try {
        const res = await fetch("http://localhost:5001/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (!res.ok) throw new Error("Failed to fetch tasks");
        const tasks = await res.json();
        renderTasks(tasks);
      } catch (err) {
        console.error("❌ Error fetching tasks:", err);
        alert("Error fetching tasks. Check backend connection.");
      }
    }
  
    // 🧱 Render tasks (with Edit ✏️ & Delete ❌ buttons)
    function renderTasks(tasks) {
      taskList.innerHTML = "";
      if (tasks.length === 0) {
        taskList.innerHTML = "<li>No tasks yet. Add one below!</li>";
        return;
      }
  
      tasks.forEach((task) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <span contenteditable="false" class="task-title">${task.title}</span>
          <button class="edit-btn" data-id="${task.id}">✏️</button>
          <button class="delete-btn" data-id="${task.id}">❌</button>
        `;
        taskList.appendChild(li);
      });
  
      // 🗑️ Delete task
      document.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const id = e.target.getAttribute("data-id");
          try {
            const res = await fetch(`http://localhost:5001/tasks/${id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to delete task");
            fetchTasks();
          } catch (err) {
            console.error("❌ Error deleting task:", err);
            alert("Error deleting task");
          }
        });
      });
  
      // ✏️ Edit task
      document.querySelectorAll(".edit-btn").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const id = e.target.getAttribute("data-id");
          const li = e.target.parentElement;
          const span = li.querySelector(".task-title");
  
          // Toggle edit mode
          if (btn.textContent === "✏️") {
            span.contentEditable = true;
            span.focus();
            btn.textContent = "💾"; // change to save icon
          } else {
            span.contentEditable = false;
            btn.textContent = "✏️";
  
            try {
              const res = await fetch(`http://localhost:5001/tasks/${id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title: span.textContent }),
              });
  
              if (!res.ok) throw new Error("Failed to update task");
              fetchTasks();
            } catch (err) {
              console.error("❌ Error updating task:", err);
              alert("Error updating task");
            }
          }
        });
      });
    }
  
    // ➕ Add new task
    addBtn.addEventListener("click", async () => {
      const newTask = newTaskInput.value.trim();
      if (!newTask) return alert("Please enter a task");
  
      try {
        const res = await fetch("http://localhost:5001/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title: newTask }),
        });
  
        if (!res.ok) throw new Error("Failed to add task");
        newTaskInput.value = "";
        fetchTasks(); // refresh list
      } catch (err) {
        console.error("❌ Error adding task:", err);
        alert("Error adding task");
      }
    });
  
    // 🚪 Logout
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "index.html";
    });
  
    // Load tasks when page loads
    fetchTasks();
  });