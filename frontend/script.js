// DOM Elements
const notesList = document.getElementById("notesList");
const titleInput = document.getElementById("titleInput");
const noteInput = document.getElementById("noteInput");
const addBtn = document.getElementById("addBtn");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const darkModeToggle = document.getElementById("darkModeToggle");
const filterSelect = document.getElementById("filterSelect");

let notes = [];

// Fetch notes from backend
async function fetchNotes() {
  const res = await fetch("/api/notes");
  notes = await res.json();
  displayNotes(notes);
}

// Display notes in cards
function displayNotes(notesToDisplay) {
  notesList.innerHTML = "";
  notesToDisplay.forEach(note => {
    const card = document.createElement("div");
    card.className = "note-card";

    card.innerHTML = `
      <h3>${note.title || "Untitled"}</h3>
      <p>${note.text}</p>
      <small>Created: ${note.createdAt}${note.updatedAt ? " | Updated: " + note.updatedAt : ""}</small>
      <div class="note-actions">
        <button class="star-btn">${note.favorite ? "⭐" : "☆"}</button>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;

    // Toggle favorite instantly and update backend
    const starBtn = card.querySelector(".star-btn");
    starBtn.onclick = async () => {
      note.favorite = !note.favorite; // update locally
      starBtn.textContent = note.favorite ? "⭐" : "☆"; // toggle instantly
      // Update backend
      await fetch(`/api/notes/${note.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorite: note.favorite })
      });
    };

    // Edit note
    card.querySelector(".edit-btn").onclick = async () => {
      const newTitle = prompt("Edit title:", note.title);
      const newText = prompt("Edit text:", note.text);
      if (!newTitle || !newText) return;
      await fetch(`/api/notes/${note.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, text: newText })
      });
      fetchNotes();
    };

    // Delete note
    card.querySelector(".delete-btn").onclick = async () => {
      if (!confirm("Are you sure you want to delete this note?")) return;
      await fetch(`/api/notes/${note.id}`, { method: "DELETE" });
      fetchNotes();
    };

    notesList.appendChild(card);
  });
}

// Add new note
async function addNote() {
  const title = titleInput.value.trim();
  const text = noteInput.value.trim();
  if (!text || !title) return alert("Please fill in both title and note!");

  await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, text })
  });

  titleInput.value = "";
  noteInput.value = "";
  fetchNotes();
}

// Search notes
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filtered = notes.filter(note =>
    note.title.toLowerCase().includes(query) ||
    note.text.toLowerCase().includes(query)
  );
  displayNotes(filtered);
});

// Sort notes
sortSelect.addEventListener("change", () => {
  let sorted = [...notes];
  if (sortSelect.value === "newest") sorted.sort((a, b) => b.id - a.id);
  else sorted.sort((a, b) => a.id - b.id);
  displayNotes(sorted);
});

// Filter notes
filterSelect.addEventListener("change", () => {
  let filtered = [...notes];
  if (filterSelect.value === "favorites") {
    filtered = filtered.filter(n => n.favorite);
  }
  displayNotes(filtered);
});

// Dark mode toggle
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Event listener for adding note
addBtn.addEventListener("click", addNote);

// Load notes initially
fetchNotes();