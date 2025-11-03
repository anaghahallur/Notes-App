import pool from "./db.js";

const insertNote = async (userId, title, content) => {
  const query = `
    INSERT INTO notes (user_id, title, content)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const result = await pool.query(query, [userId, title, content]);
  console.log("📝 Note added:", result.rows[0]);
};

const run = async () => {
  try {
    await insertNote(1, "First Note", "This is Anagha’s first note!");
    await insertNote(1, "Second Note", "Learning SQL joins today!");
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await pool.end();
  }
};

run();
