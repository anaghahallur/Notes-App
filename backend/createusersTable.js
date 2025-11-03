// backend/createUserTable.js
import pool from "./db.js";

const createUserTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(query);
    console.log("✅ 'users' table created successfully!");
  } catch (err) {
    console.error("❌ Error creating users table:", err.message);
  } finally {
    await pool.end();
  }
};

createUserTable();
