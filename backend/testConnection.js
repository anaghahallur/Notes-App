// testConnection.js
import pool from "./db.js";

const testConnection = async () => {
  try {
    const result = await pool.query("SELECT NOW();");
    console.log("✅ Database connected successfully!");
    console.log("🕒 Current time from Neon:", result.rows[0]);
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  } finally {
    await pool.end();
  }
};

testConnection();
