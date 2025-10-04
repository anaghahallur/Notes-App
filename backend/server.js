// Import required modules
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend"))); // Serves frontend files

// Path to store notes
const notesFile = path.join(__dirname, "notes.json");

// Helper functions
function readNotes() {
  try {
    if (!fs.existsSync(notesFile)) {
      fs.writeFileSync(notesFile, "[]"); // Create file if it doesn't exist
    }
    const data = fs.readFileSync(notesFile, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading notes:", error);
    return [];
  }
}

function writeNotes(notes) {
  try {
    fs.writeFileSync(notesFile, JSON.stringify(notes, null, 2));
  } catch (error) {
    console.error("Error writing notes:", error);
  }
}

// Routes

// GET all notes
app.get("/api/notes", (req, res) => {
  const notes = readNotes();
  res.json(notes);
});

// POST a new note
app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;
  if (!title || !text) {
    return res.status(400).json({ message: "Both title and text are required" });
  }

  const notes = readNotes();
  const newNote = {
    id: Date.now(),
    title,
    text,
    createdAt: new Date().toLocaleString()
  };
  notes.push(newNote);
  writeNotes(notes);

  res.status(201).json(newNote);
});

// PUT (Edit note)
app.put("/api/notes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { title, text } = req.body;

  const notes = readNotes();
  const index = notes.findIndex(note => note.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Note not found" });
  }

  notes[index] = {
    ...notes[index],
    title,
    text,
    updatedAt: new Date().toLocaleString()
  };
  writeNotes(notes);
  res.json(notes[index]);
});

// DELETE a note
app.delete("/api/notes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let notes = readNotes();
  const noteExists = notes.some(note => note.id === id);

  if (!noteExists) {
    return res.status(404).json({ message: "Note not found" });
  }

  notes = notes.filter(note => note.id !== id);
  writeNotes(notes);

  res.json({ message: "Note deleted" });
});

// Start server
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));