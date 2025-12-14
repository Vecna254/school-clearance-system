//clearance.model.js..
import { pool } from "../config/db.js"

export async function startClearance(studentId, admission_number, reason, reason_other) {
  const [res] = await pool.query(
    `INSERT INTO clearance_requests (student_id, admission_number, reason, reason_other, status)
     VALUES (?,?,?,?, 'in_progress')`,
    [studentId, admission_number, reason, reason_other || null],
  )
  const clearanceId = res.insertId

  const [deps] = await pool.query("SELECT id, name FROM departments WHERE is_active = 1")
  console.log(`[v0] Creating clearance steps for ${deps.length} departments`)

  if (deps.length === 0) {
    throw new Error("No active departments found. Please contact administrator.")
  }

  const values = deps.map((d) => [clearanceId, d.id, "pending"])
  await pool.query("INSERT INTO department_clearances (clearance_request_id, department_id, status) VALUES ?", [values])

  console.log(`[v0] Created ${values.length} department clearance steps for request ${clearanceId}`)
  return clearanceId
}

export async function getLatestForStudent(studentId) {
  const [reqs] = await pool.query("SELECT * FROM clearance_requests WHERE student_id = ? ORDER BY id DESC LIMIT 1", [
    studentId,
  ])
  const req = reqs[0]
  if (!req) return null

  const [steps] = await pool.query(
    `SELECT dc.*, d.name as department_name, d.code as department_code
     FROM department_clearances dc JOIN departments d ON d.id = dc.department_id
     WHERE dc.clearance_request_id = ? ORDER BY d.id`,
    [req.id],
  )

  console.log(`[v0] Found ${steps.length} department steps for student ${studentId}`)

  return { ...req, departments: steps }
}

export async function getClearanceStep(stepId) {
  const [rows] = await pool.query(
    `SELECT dc.*, cr.admission_number, s.full_name, d.name as department_name
     FROM department_clearances dc
     JOIN clearance_requests cr ON cr.id = dc.clearance_request_id
     JOIN students s ON s.id = cr.student_id
     JOIN departments d ON d.id = dc.department_id
     WHERE dc.id = ?`,
    [stepId],
  )
  return rows[0]
}

export async function updateDepartmentDecisionAndCheckStatus(stepId, payload) {
  const { status, remarks, has_dues, dues_amount, user_id } = payload

  console.log(`[v0] EVENT-DRIVEN: Processing decision for step ${stepId}: ${status}`)

  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    // 1. Update the department clearance
    await connection.query(
      `UPDATE department_clearances SET status=?, remarks=?, has_dues=?, dues_amount=?, cleared_by_user_id=?, cleared_at = NOW() WHERE id=?`,
      [status, remarks || null, has_dues ? 1 : 0, dues_amount || 0, user_id || null, stepId],
    )

    // 2. Get the clearance request ID
    const [[parent]] = await connection.query("SELECT clearance_request_id FROM department_clearances WHERE id=?", [
      stepId,
    ])
    const clearanceId = parent.clearance_request_id

    console.log(`[v0] EVENT-DRIVEN: Checking status for clearance ${clearanceId}`)

    // 3. Immediately check if all departments are done
    const newStatus = await checkAndUpdateClearanceStatus(connection, clearanceId)

    await connection.commit()
    console.log(`[v0] EVENT-DRIVEN: ✅ Successfully updated clearance ${clearanceId} to status: ${newStatus}`)

    return newStatus
  } catch (error) {
    await connection.rollback()
    console.error(`[v0] EVENT-DRIVEN: Error processing step ${stepId}:`, error)
    throw error
  } finally {
    connection.release()
  }
}

export async function checkAndUpdateClearanceStatus(connection, clearanceId) {
  const queryConnection = connection || pool

  // Get current status counts
  const [[stats]] = await queryConnection.query(
    `SELECT 
      SUM(CASE WHEN status='cleared' THEN 1 ELSE 0 END) AS cleared_count,
      SUM(CASE WHEN status='rejected' THEN 1 ELSE 0 END) AS rejected_count,
      COUNT(*) AS total_count
     FROM department_clearances 
     WHERE clearance_request_id = ?`,
    [clearanceId],
  )

  console.log(
    `[v0] EVENT-DRIVEN: Clearance ${clearanceId} - ${stats.cleared_count} cleared, ${stats.rejected_count} rejected, ${stats.total_count} total`,
  )

  // Determine new status based on department decisions
  let newStatus = "in_progress"

  if (stats.rejected_count > 0) {
    newStatus = "rejected"
    console.log(`[v0] EVENT-DRIVEN: Setting to 'rejected' - has ${stats.rejected_count} rejections`)
  } else if (stats.cleared_count === stats.total_count && stats.total_count > 0) {
    newStatus = "awaiting_final"
    console.log(`[v0] EVENT-DRIVEN: Setting to 'awaiting_final' - ALL ${stats.total_count} departments cleared! 🎉`)
  } else {
    console.log(`[v0] EVENT-DRIVEN: Keeping 'in_progress' - ${stats.cleared_count}/${stats.total_count} cleared`)
  }

  // Get current status to avoid unnecessary updates
  const [[current]] = await queryConnection.query("SELECT status FROM clearance_requests WHERE id = ?", [clearanceId])

  if (current.status !== newStatus) {
    await queryConnection.query("UPDATE clearance_requests SET status = ? WHERE id = ?", [newStatus, clearanceId])
    console.log(
      `[v0] EVENT-DRIVEN: ✅ STATUS CHANGED: '${current.status}' → '${newStatus}' for clearance ${clearanceId}`,
    )
  } else {
    console.log(`[v0] EVENT-DRIVEN: Status already '${newStatus}' - no change needed`)
  }

  return newStatus
}

export async function setStepDecision(stepId, payload) {
  console.log(`[v0] DEPRECATED: setStepDecision called for step ${stepId} - using new event-driven approach`)
  return await updateDepartmentDecisionAndCheckStatus(stepId, payload)
}

export async function markFinalApproval(clearanceId, approver) {
  await pool.query(
    "UPDATE clearance_requests SET status = ?, final_approved_by = ?, final_approved_at = NOW() WHERE id = ?",
    ["completed", approver, clearanceId],
  )
}

export async function adminOverview() {
  const [rows] = await pool.query(
    `SELECT cr.id, s.full_name, cr.admission_number, cr.status,
            SUM(dc.status='cleared') AS cleared_count,
            COUNT(dc.id) AS total_departments
     FROM clearance_requests cr
     JOIN students s ON s.id = cr.student_id
     JOIN department_clearances dc ON dc.clearance_request_id = cr.id
     GROUP BY cr.id, s.full_name, cr.admission_number, cr.status
     ORDER BY cr.id DESC`,
  )
  return rows
}

export async function deptQueueForUser(user) {
  console.log(`[v0] Getting queue for user department: ${user.department}`)

  const [rows] = await pool.query(
    `SELECT dc.id as clearance_step_id, s.full_name, cr.admission_number, dc.status, d.name as department_name
     FROM department_clearances dc
     JOIN clearance_requests cr ON cr.id = dc.clearance_request_id
     JOIN students s ON s.id = cr.student_id
     JOIN departments d ON d.id = dc.department_id
     WHERE d.code = ? AND cr.status IN ('in_progress','awaiting_final')
     ORDER BY dc.id DESC`,
    [user.department],
  )

  console.log(`[v0] Found ${rows.length} pending clearances for department ${user.department}`)
  return rows
}

export async function reportDepartmentSummary() {
  const [rows] = await pool.query(
    `SELECT d.name as department_name, d.code as department_code,
            SUM(dc.status='cleared') AS cleared,
            SUM(dc.status='rejected') AS rejected,
            SUM(dc.status='pending') AS pending
     FROM departments d
     LEFT JOIN department_clearances dc ON dc.department_id = d.id
     GROUP BY d.id, d.name, d.code
     ORDER BY d.id`,
  )
  return rows
}

export async function fixAwaitingFinalStatus() {
  console.log("[v0] Checking for clearances that should be awaiting_final...")

  const [clearances] = await pool.query(`SELECT cr.id, cr.status, cr.admission_number,
           SUM(dc.status='cleared') AS cleared_count,
           SUM(dc.status='rejected') AS rejected_count,
           COUNT(dc.id) AS total_count
    FROM clearance_requests cr
    JOIN department_clearances dc ON dc.clearance_request_id = cr.id
    WHERE cr.status = 'in_progress'
    GROUP BY cr.id, cr.status, cr.admission_number
    HAVING rejected_count = 0 AND cleared_count = total_count`)

  console.log(`[v0] Found ${clearances.length} clearances that should be awaiting_final`)

  for (const clearance of clearances) {
    console.log(
      `[v0] Fixing clearance ${clearance.id} (${clearance.admission_number}) - ${clearance.cleared_count}/${clearance.total_count} cleared`,
    )
    await pool.query("UPDATE clearance_requests SET status = 'awaiting_final' WHERE id = ?", [clearance.id])
  }

  return clearances.length
}
