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

    // Send email notification if requested
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
        // Don't fail the request if email fails
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
