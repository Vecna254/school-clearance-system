// controllers/clearance.controller.js..
import { findStudentByUserId } from "../models/student.model.js"
import * as clearanceService from "../services/clearanceService.js"
import { pool } from "../config/db.js"
import { updateDepartmentDecisionAndCheckStatus } from "../services/clearanceService.js" // Import the new function

export async function start(req, res) {
  const student = await findStudentByUserId(req.user.id)
  if (!student) return res.status(400).json({ message: "Student not found" })

  const id = await clearanceService.startClearance(
    student.id,
    student.admission_number,
    req.body.reason,
    req.body.reason_other,
  )
  res.status(201).json({ id })
}

export async function myLatest(req, res) {
  const student = await findStudentByUserId(req.user.id)
  if (!student) return res.status(400).json({ message: "Student not found" })

  const latest = await clearanceService.getLatestForStudent(student.id)
  res.json(latest || {})
}

export async function approveFinal(req, res) {
  const { id } = req.params
  const [[cr]] = await pool.query("SELECT * FROM clearance_requests WHERE id = ?", [id])
  const [[student]] = await pool.query("SELECT * FROM students WHERE id = ?", [cr.student_id])

  await clearanceService.markFinalApproval(id, req.user.id)
  await clearanceService.sendCompletionEmail(student)

  res.json({ ok: true })
}

export async function certificate(req, res) {
  const { id } = req.params

  const [[cr]] = await pool.query("SELECT * FROM clearance_requests WHERE id = ?", [id])
  if (!cr) return res.status(404).end()
  if (cr.status !== "completed") return res.status(400).json({ message: "Not completed" })

  const [[student]] = await pool.query("SELECT * FROM students WHERE id = ?", [cr.student_id])
  const [steps] = await pool.query(
    `SELECT d.name, dc.status, dc.remarks 
     FROM department_clearances dc 
     JOIN departments d ON d.id = dc.department_id 
     WHERE dc.clearance_request_id = ?`,
    [id],
  )

  res.setHeader("Content-Type", "application/pdf")
  res.setHeader("Content-Disposition", `attachment; filename=clearance_${cr.admission_number}.pdf`)

  const doc = clearanceService.generateCertificatePDF({ student, cr, steps })
  doc.pipe(res)
  doc.end()
}

export async function setStepDecision(req, res) {
  try {
    const { id } = req.params
    const payload = req.body
    payload.user_id = req.user.id

    const newStatus = await updateDepartmentDecisionAndCheckStatus(id, payload)

    res.json({
      success: true,
      message: `Decision recorded. Status: ${newStatus}`,
      newStatus,
    })
  } catch (error) {
    console.error("[v0] Error in setStepDecision:", error)
    res.status(500).json({ error: error.message })
  }
}

export const getClearanceStep = clearanceService.getClearanceStep
export const adminOverview = clearanceService.adminOverview
export const deptQueueForUser = clearanceService.deptQueueForUser
export const reportDepartmentSummary = clearanceService.reportDepartmentSummary
export const fixAwaitingFinalStatus = clearanceService.fixAwaitingFinalStatus
