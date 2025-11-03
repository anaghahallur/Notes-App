import express from "express";
import pool from "../db.js";

const router = express.Router();

// ✅ Get all tasks for logged-in user
router.get("/", async (req, res) => {
  const userId = req.user.userId;
  try {
    const result = await pool.query("SELECT * FROM tasks WHERE user_id = $1", [userId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add new task
router.post("/", async (req, res) => {
  const userId = req.user.userId;
  const { title } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO tasks (title, user_id) VALUES ($1, $2) RETURNING *",
      [title, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Edit task (PUT)
router.put("/:id", async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;
  const { title } = req.body;

  try {
    const result = await pool.query(
      "UPDATE tasks SET title = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
      [title, id, userId]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Task not found or unauthorized" });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete task (DELETE)
router.delete("/:id", async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Task not found or unauthorized" });

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;