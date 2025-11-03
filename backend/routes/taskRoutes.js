import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import Task from "../models/taskModel.js";

const router = express.Router();

// 🧠 Get all tasks of a user
router.get("/", verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

// ➕ Add new task
router.post("/", verifyToken, async (req, res) => {
  try {
    const newTask = new Task({
      userId: req.user.id,
      title: req.body.title,
    });
    await newTask.save();
    res.json(newTask);
  } catch (err) {
    res.status(500).json({ message: "Error adding task" });
  }
});

export default router;