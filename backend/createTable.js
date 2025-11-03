// createTable.js
import pool from "../db.js";

const createNotesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS notes (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id),
      title VARCHAR(100),
      content TEXT
    );
  `;
  await pool.query(query);
  console.log("✅ 'notes' table created successfully!");
  await pool.end();
};

createNotesTable();
