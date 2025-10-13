import { pool } from "../config/db.js"

export async function getActiveDepartments() {
  const [rows] = await pool.query("SELECT * FROM departments WHERE is_active = 1 ORDER BY id")
  return rows
}

export async function createDepartment({ name, code }) {
  const [res] = await pool.query("INSERT INTO departments (name, code, is_active) VALUES (?,?,1)", [name, code])
  return { id: res.insertId, name, code, is_active: 1 }
}

export async function listDepartments() {
  const [rows] = await pool.query("SELECT * FROM departments ORDER BY id")
  return rows
}
