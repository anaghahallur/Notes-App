// runQueries.js
import pool from "./db.js";

// 1️⃣ Insert a new user (ignore if already exists)
const insertUser = async (name, email) => {
  const query = `
    INSERT INTO users (name, email)
    VALUES ($1, $2)
    ON CONFLICT (email) DO NOTHING
    RETURNING *;
  `;
  const result = await pool.query(query, [name, email]);
  if (result.rows.length > 0) {
    console.log("✅ User inserted:", result.rows[0]);
  } else {
    console.log("⚠️ User already exists, skipping insert.");
  }
};

// 2️⃣ Fetch all users
const fetchUsers = async () => {
  const result = await pool.query("SELECT * FROM users;");
  console.log("📋 All users:");
  console.table(result.rows);
};

// 3️⃣ Run the two functions
const run = async () => {
  try {
    await insertUser("Anagha", "anagha@example.com");
    await fetchUsers();
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await pool.end();
  }
};

run();
