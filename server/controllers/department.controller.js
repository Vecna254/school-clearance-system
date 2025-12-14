//Department.controller.js..
import {
  deptQueueForUser,
  getClearanceStep,
  updateDepartmentDecisionAndCheckStatus,
} from "../models/clearance.model.js"
import { sendDepartmentNotificationEmail } from "../utils/mailer.js"
import { pool } from "../config/db.js"

export async function queue(req, res) {
  const rows = await deptQueueForUser(req.user)
  res.json(rows)
}

export async function history(req, res) {
  try {
    const deptCode = req.user.department
    const [[dept]] = await pool.query("SELECT id FROM departments WHERE code = ?", [deptCode])

    if (!dept) {
      return res.status(400).json({ error: "Department not found" })
    }

    const deptId = dept.id

    const [rows] = await pool.query(
      `SELECT 
        dc.id,
        dc.status,
        dc.remarks,
        dc.cleared_at,
        dc.has_dues,
        dc.dues_amount,
        s.full_name,
        s.admission_number,
        cr.status as clearance_request_status,
        u.full_name as cleared_by_name
      FROM department_clearances dc
      JOIN clearance_requests cr ON dc.clearance_request_id = cr.id
      JOIN students s ON cr.student_id = s.id
      LEFT JOIN users u ON dc.cleared_by_user_id = u.id
      WHERE dc.department_id = ? AND (dc.status = 'cleared' OR dc.status = 'rejected')
      ORDER BY dc.cleared_at DESC
      LIMIT 50`,
      [deptId],
    )
    res.json(rows)
  } catch (error) {
    console.error("[v0] Error fetching history:", error)
    res.status(500).json({ error: "Failed to fetch history" })
  }
}

export async function stats(req, res) {
  try {
    const deptCode = req.user.department
    const [[dept]] = await pool.query("SELECT id FROM departments WHERE code = ?", [deptCode])

    if (!dept) {
      return res.status(400).json({ error: "Department not found" })
    }

    const deptId = dept.id

    const [[statsData]] = await pool.query(
      `SELECT 
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
        COUNT(CASE WHEN status = 'cleared' THEN 1 END) as cleared_count,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_count,
        COUNT(*) as total_count,
        SUM(CASE WHEN has_dues = 1 THEN dues_amount ELSE 0 END) as total_dues
      FROM department_clearances
      WHERE department_id = ?`,
      [deptId],
    )
    res.json(statsData)
  } catch (error) {
    console.error("[v0] Error fetching stats:", error)
    res.status(500).json({ error: "Failed to fetch stats" })
  }
}

export async function stepDetail(req, res) {
  const step = await getClearanceStep(req.params.id)
  res.json(step)
}

export async function decide(req, res) {
  const { status, remarks, has_dues, dues_amount, notify_student, notification_message } = req.body

  try {
    const step = await getClearanceStep(req.params.id)
    if (!step) {
      return res.status(404).json({ error: "Clearance step not found" })
    }

    console.log(`[v0] Processing decision for step ${req.params.id}: ${status}`)

    const newStatus = await updateDepartmentDecisionAndCheckStatus(req.params.id, {
      status,
      remarks,
      has_dues,
      dues_amount,
      user_id: req.user.id,
    })

    console.log(`[v0] Decision processed successfully - clearance status: ${newStatus}`)

    if (notify_student && notification_message && step) {
      try {
        const [[student]] = await pool.query("SELECT email, phone FROM students WHERE admission_number = ?", [
          step.admission_number,
        ])
        if (student && student.email) {
          await sendDepartmentNotificationEmail(
            student.email,
            step.full_name,
            step.department_name,
            notification_message,
            student.phone,
          )
          console.log(`[v0] Email notification sent to ${student.email}`)
        }
      } catch (error) {
        console.error("[v0] Failed to send email notification:", error)
      }
    }

    res.json({
      ok: true,
      message: "Decision processed successfully",
      clearanceStatus: newStatus,
    })
  } catch (error) {
    console.error(`[v0] Error processing decision for step ${req.params.id}:`, error)
    res.status(500).json({ error: "Failed to process decision", details: error.message })
  }
}
