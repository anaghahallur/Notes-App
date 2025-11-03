import pool from "./db.js";

const showUserNotes = async () => {
  const query = `
    SELECT 
      users.id AS user_id,
      users.name AS username,
      notes.id AS note_id,
      notes.title,
      notes.content
    FROM users
    INNER JOIN notes
    ON users.id = notes.user_id;
  `;

  const result = await pool.query(query);
  console.log("📒 Joined User + Notes:");
  console.table(result.rows);
};

showUserNotes()
  .then(() => pool.end())
  .catch((err) => console.error("❌ Error:", err.message));
