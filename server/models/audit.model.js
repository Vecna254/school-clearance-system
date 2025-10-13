import { pool } from "../config/db.js"

export async function logAction(userId, action, details) {
  await pool.query("INSERT INTO audit_logs (user_id, action, details, created_at) VALUES (?, ?, ?, NOW())", [
    userId,
    action,
    JSON.stringify(details),
  ])
}
