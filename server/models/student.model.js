import { pool } from "../config/db.js"

export async function createStudent(userId, payload) {
  const { admission_number, full_name, kcse_year, class_form, stream, phone, email, parent_phone } = payload
  const [res] = await pool.query(
    `INSERT INTO students (user_id, admission_number, full_name, kcse_year, class_form, stream, phone, email, parent_phone)
     VALUES (?,?,?,?,?,?,?,?,?)`,
    [
      userId,
      admission_number,
      full_name,
      kcse_year || null,
      class_form || null,
      stream || null,
      phone || null,
      email || null,
      parent_phone || null,
    ],
  )
  return { id: res.insertId, user_id: userId, ...payload }
}

export async function findStudentByUserId(userId) {
  const [rows] = await pool.query("SELECT * FROM students WHERE user_id = ?", [userId])
  return rows[0]
}

export async function findStudentByAdmission(adm) {
  const [rows] = await pool.query("SELECT * FROM students WHERE admission_number = ?", [adm])
  return rows[0]
}
