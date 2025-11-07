import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import { verifyToken } from "./middleware/authMiddleware.js";

dotenv.config();
const app = express();

app.use(express.json());

// ✅ Enable CORS for local + deployed frontend

app.use(
  cors({
    origin: [
      "http://127.0.0.1:8080",            // ✅ local frontend (browser)
      "http://localhost:8080",            // ✅ local fallback
      "https://preeminent-buttercream-462689.netlify.app" // ✅ your Netlify site
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Routes
app.use("/auth", authRoutes);
app.use("/tasks", verifyToken, taskRoutes);

// ✅ Default route
app.get("/", (req, res) => {
  res.send("Notes App Backend is running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));