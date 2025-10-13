import { adminOverview, reportDepartmentSummary, fixAwaitingFinalStatus } from "../models/clearance.model.js"
import { createDepartment, listDepartments } from "../models/department.model.js"
import bcrypt from "bcryptjs"
import { createUser, listUsers } from "../models/user.model.js"
import { pool } from "../config/db.js"

export async function overview(req, res) {
  res.json(await adminOverview())
}

export async function departments(req, res) {
  if (req.method === "GET") return res.json(await listDepartments())
  if (req.method === "POST") {
    const { name, code } = req.body
    return res.status(201).json(await createDepartment({ name, code }))
  }
  if (req.method === "PUT") {
    const { id } = req.params
    const { name, code, is_active } = req.body
    await pool.query("UPDATE departments SET name = ?, code = ?, is_active = ? WHERE id = ?", [
      name,
      code,
      is_active ? 1 : 0,
      id,
    ])
    return res.json({ success: true, message: "Department updated successfully" })
  }
  if (req.method === "DELETE") {
    const { id } = req.params
    const [[count]] = await pool.query("SELECT COUNT(*) as count FROM department_clearances WHERE department_id = ?", [
      id,
    ])
    if (count.count > 0) {
      return res.status(400).json({
        error: "Cannot delete department with existing clearances. Deactivate instead.",
      })
    }
    await pool.query("DELETE FROM departments WHERE id = ?", [id])
    return res.json({ success: true, message: "Department deleted successfully" })
  }
}

export async function users(req, res) {
  if (req.method === "GET") {
    const rows = await listUsers()
    rows.forEach((r) => delete r.password_hash)
    return res.json(rows)
  }
  if (req.method === "POST") {
    const { full_name, email, username, role, department, password } = req.body
    const password_hash = await bcrypt.hash(password, 10)
    const user = await createUser({ full_name, email, username, role, department: department || null, password_hash })
    delete user.password_hash
    return res.status(201).json(user)
  }
  if (req.method === "PUT") {
    const { id } = req.params
    const { full_name, email, username, role, department, password } = req.body
    let updateQuery = "UPDATE users SET full_name = ?, email = ?, username = ?, role = ?, department = ?"
    const params = [full_name, email, username, role, department || null]
    if (password) {
      const password_hash = await bcrypt.hash(password, 10)
      updateQuery += ", password_hash = ?"
      params.push(password_hash)
    }
    updateQuery += " WHERE id = ?"
    params.push(id)
    await pool.query(updateQuery, params)
    return res.json({ success: true, message: "User updated successfully" })
  }
  if (req.method === "DELETE") {
    const { id } = req.params
    const [[count]] = await pool.query(
      "SELECT COUNT(*) as count FROM department_clearances WHERE cleared_by_user_id = ?",
      [id],
    )
    if (count.count > 0) {
      return res.status(400).json({
        error: "Cannot delete user with clearance history. Deactivate instead.",
      })
    }
    await pool.query("DELETE FROM users WHERE id = ?", [id])
    return res.json({ success: true, message: "User deleted successfully" })
  }
}

export async function createUserAdmin(req, res) {
  const { full_name, email, username, role, department, password } = req.body
  const password_hash = await bcrypt.hash(password, 10)
  const user = await createUser({ full_name, email, username, role, department: department || null, password_hash })
  delete user.password_hash
  res.status(201).json(user)
}

export async function report(req, res) {
  res.json(await reportDepartmentSummary())
}

export async function fixClearanceRequests(req, res) {
  try {
    console.log("[v0] Starting clearance requests fix...")

    // First, ensure all departments exist
    const departments = [
      ["Class Teacher", "CLASS_TEACHER"],
      ["Academic Office", "ACADEMIC"],
      ["Library", "LIBRARY"],
      ["Boarding", "BOARDING"],
      ["Accounts", "ACCOUNTS"],
      ["Catering", "CATERING"],
      ["Sanitation", "SANITATION"],
      ["Lab/Store", "LAB"],
      ["Games & Sports", "GAMES"],
      ["Guidance & Counseling", "COUNSELING"],
      ["Medical", "MEDICAL"],
      ["ICT", "ICT"],
      ["Discipline", "DISCIPLINE"],
    ]

    for (const [name, code] of departments) {
      await pool.query(
        "INSERT INTO departments (name, code, is_active) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE name = VALUES(name)",
        [name, code],
      )
    }

    // Fix existing clearance requests that don't have department clearances
    const [result] = await pool.query(`
      INSERT INTO department_clearances (clearance_request_id, department_id, status)
      SELECT cr.id, d.id, 'pending'
      FROM clearance_requests cr
      CROSS JOIN departments d
      WHERE d.is_active = 1
      AND NOT EXISTS (
          SELECT 1 FROM department_clearances dc 
          WHERE dc.clearance_request_id = cr.id AND dc.department_id = d.id
      )
    `)

    console.log(`[v0] Fixed ${result.affectedRows} missing department clearances`)

    res.json({
      success: true,
      message: `Fixed ${result.affectedRows} missing department clearances`,
      departmentsAdded: departments.length,
    })
  } catch (error) {
    console.error("[v0] Error fixing clearance requests:", error)
    res.status(500).json({ error: error.message })
  }
}

export async function fixAwaitingFinal(req, res) {
  try {
    console.log("[v0] Starting awaiting final status fix...")
    const fixedCount = await fixAwaitingFinalStatus()

    res.json({
      success: true,
      message: `Fixed ${fixedCount} clearances that should be awaiting final approval`,
      fixedCount,
    })
  } catch (error) {
    console.error("[v0] Error fixing awaiting final status:", error)
    res.status(500).json({ error: error.message })
  }
}
