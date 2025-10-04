const notesList = document.getElementById("notesList");
const noteInput = document.getElementById("noteInput");
const addBtn = document.getElementById("addBtn");

async function fetchNotes() {
  const res = await fetch("/api/notes");
  const data = await res.json();

  notesList.innerHTML = "";
  data.forEach(note => {
    const li = document.createElement("li");
    li.textContent = note.text;

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = () => deleteNote(note.id);

    li.appendChild(delBtn);
    notesList.appendChild(li);
  });
}

async function addNote() {
  const text = noteInput.value.trim();
  if (!text) return alert("Please write something!");

  await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  noteInput.value = "";
  fetchNotes();
}

async function deleteNote(id) {
  await fetch(`/api/notes/${id}`, { method: "DELETE" });
  fetchNotes();
}

addBtn.addEventListener("click", addNote);

// Load notes initially
fetchNotes();