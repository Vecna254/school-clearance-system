const express = require("express")
const cors = require("cors")
const mysql = require("mysql2/promise")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const multer = require("multer")
const path = require("path")
const fs = require("fs")


require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use("/uploads", express.static("uploads"))

// Create uploads directory if it doesn't exist
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads")
}

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "school_clearance_system",
}

let db

async function initDatabase() {
  try {
    db = await mysql.createConnection(dbConfig)
    console.log("Connected to MySQL database")
  } catch (error) {
    console.error("Database connection failed:", error)
    process.exit(1)
  }
}

// JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "Access token required" })
  }

  jwt.verify(token, process.env.JWT_SECRET || "your-secret-key", (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" })
    }
    req.user = user
    next()
  })
}

// Routes

// Auth routes
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body

    const [users] = await db.execute("SELECT * FROM users WHERE username = ? AND is_active = TRUE", [username])

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const user = users[0]
    const validPassword = await bcrypt.compare(password, user.password_hash)

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
        department: user.department,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" },
    )

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        full_name: user.full_name,
        department: user.department,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Student registration
app.post("/api/auth/register-student", async (req, res) => {
  try {
    const { admission_number, full_name, kcse_year, class_form, stream, phone, email, parent_phone, password } =
      req.body

    // Check if student already exists
    const [existing] = await db.execute("SELECT * FROM students WHERE admission_number = ?", [admission_number])

    if (existing.length > 0) {
      return res.status(400).json({ error: "Student already registered" })
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10)

    // Create user account
    const [userResult] = await db.execute(
      "INSERT INTO users (username, email, password_hash, role, full_name, phone) VALUES (?, ?, ?, ?, ?, ?)",
      [
        admission_number,
        email || `${admission_number}@student.school.ac.ke`,
        password_hash,
        "student",
        full_name,
        phone,
      ],
    )

    // Create student record
    await db.execute(
      "INSERT INTO students (user_id, admission_number, full_name, kcse_year, class_form, stream, phone, email, parent_phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [userResult.insertId, admission_number, full_name, kcse_year, class_form, stream, phone, email, parent_phone],
    )

    res.json({ message: "Student registered successfully" })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Submit clearance request
app.post("/api/clearance/submit", authenticateToken, async (req, res) => {
  try {
    const { reason, reason_other } = req.body

    // Get student info
    const [students] = await db.execute("SELECT * FROM students WHERE user_id = ?", [req.user.id])

    if (students.length === 0) {
      return res.status(404).json({ error: "Student not found" })
    }

    const student = students[0]

    // Check if student already has a pending clearance
    const [existing] = await db.execute(
      'SELECT * FROM clearance_requests WHERE student_id = ? AND status IN ("pending", "in_progress")',
      [student.id],
    )

    if (existing.length > 0) {
      return res.status(400).json({ error: "You already have a pending clearance request" })
    }

    // Create clearance request
    const [result] = await db.execute(
      "INSERT INTO clearance_requests (student_id, admission_number, reason, reason_other, status) VALUES (?, ?, ?, ?, ?)",
      [student.id, student.admission_number, reason, reason_other, "in_progress"],
    )

    const clearanceId = result.insertId

    // Create department clearance records
    const [departments] = await db.execute("SELECT * FROM departments WHERE is_active = TRUE")

    for (const dept of departments) {
      await db.execute("INSERT INTO department_clearances (clearance_request_id, department_id) VALUES (?, ?)", [
        clearanceId,
        dept.id,
      ])
    }

    res.json({
      message: "Clearance request submitted successfully",
      clearance_id: clearanceId,
    })
  } catch (error) {
    console.error("Submit clearance error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get clearance status for student
app.get("/api/clearance/status", authenticateToken, async (req, res) => {
  try {
    const [students] = await db.execute("SELECT * FROM students WHERE user_id = ?", [req.user.id])

    if (students.length === 0) {
      return res.status(404).json({ error: "Student not found" })
    }

    const student = students[0]

    // Get latest clearance request
    const [clearances] = await db.execute(
      `SELECT cr.*, s.full_name, s.admission_number, s.class_form, s.stream 
             FROM clearance_requests cr 
             JOIN students s ON cr.student_id = s.id 
             WHERE cr.student_id = ? 
             ORDER BY cr.submitted_at DESC LIMIT 1`,
      [student.id],
    )

    if (clearances.length === 0) {
      return res.json({ clearance: null })
    }

    const clearance = clearances[0]

    // Get department clearances
    const [deptClearances] = await db.execute(
      `SELECT dc.*, d.name as department_name, d.code as department_code, u.full_name as cleared_by_name
             FROM department_clearances dc
             JOIN departments d ON dc.department_id = d.id
             LEFT JOIN users u ON dc.cleared_by_user_id = u.id
             WHERE dc.clearance_request_id = ?
             ORDER BY d.name`,
      [clearance.id],
    )

    // Get final approvals
    const [approvals] = await db.execute(
      `SELECT fa.*, u.full_name as approved_by_name
             FROM final_approvals fa
             JOIN users u ON fa.approved_by_user_id = u.id
             WHERE fa.clearance_request_id = ?
             ORDER BY fa.approval_level`,
      [clearance.id],
    )

    res.json({
      clearance,
      departments: deptClearances,
      approvals,
    })
  } catch (error) {
    console.error("Get status error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get pending clearances for HOD
app.get("/api/hod/pending-clearances", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "hod") {
      return res.status(403).json({ error: "Access denied" })
    }

    // Get department for this HOD
    const [departments] = await db.execute("SELECT * FROM departments WHERE hod_user_id = ?", [req.user.id])

    if (departments.length === 0) {
      return res.status(404).json({ error: "Department not found" })
    }

    const department = departments[0]

    // Get pending clearances for this department
    const [clearances] = await db.execute(
      `SELECT dc.*, cr.reason, cr.submitted_at, s.full_name, s.admission_number, s.class_form, s.stream, s.phone
             FROM department_clearances dc
             JOIN clearance_requests cr ON dc.clearance_request_id = cr.id
             JOIN students s ON cr.student_id = s.id
             WHERE dc.department_id = ? AND dc.status = 'pending' AND cr.status = 'in_progress'
             ORDER BY cr.submitted_at ASC`,
      [department.id],
    )

    res.json({ clearances, department })
  } catch (error) {
    console.error("Get pending clearances error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Process department clearance
app.post("/api/hod/process-clearance", authenticateToken, async (req, res) => {
  try {
    const { clearance_id, status, remarks, has_dues, dues_amount } = req.body

    if (req.user.role !== "hod") {
      return res.status(403).json({ error: "Access denied" })
    }

    // Update department clearance
    await db.execute(
      `UPDATE department_clearances 
             SET status = ?, remarks = ?, has_dues = ?, dues_amount = ?, cleared_by_user_id = ?, cleared_at = NOW()
             WHERE id = ?`,
      [status, remarks, has_dues || false, dues_amount || 0, req.user.id, clearance_id],
    )

    res.json({ message: "Clearance processed successfully" })
  } catch (error) {
    console.error("Process clearance error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get all clearances for admin
app.get("/api/admin/all-clearances", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" })
    }

    const [clearances] = await db.execute(
      `SELECT cr.*, s.full_name, s.admission_number, s.class_form, s.stream,
                    COUNT(dc.id) as total_departments,
                    SUM(CASE WHEN dc.status = 'cleared' THEN 1 ELSE 0 END) as cleared_departments
             FROM clearance_requests cr
             JOIN students s ON cr.student_id = s.id
             LEFT JOIN department_clearances dc ON cr.id = dc.clearance_request_id
             GROUP BY cr.id
             ORDER BY cr.submitted_at DESC`,
    )

    res.json({ clearances })
  } catch (error) {
    console.error("Get all clearances error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Final approval by admin
app.post("/api/admin/final-approval", authenticateToken, async (req, res) => {
  try {
    const { clearance_request_id, approval_level, status, remarks } = req.body

    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" })
    }

    // Check if all departments have cleared
    const [deptStatus] = await db.execute(
      `SELECT COUNT(*) as total, SUM(CASE WHEN status = 'cleared' THEN 1 ELSE 0 END) as cleared
             FROM department_clearances WHERE clearance_request_id = ?`,
      [clearance_request_id],
    )

    if (deptStatus[0].total !== deptStatus[0].cleared && status === "approved") {
      return res.status(400).json({ error: "All departments must clear the student first" })
    }

    // Add final approval
    await db.execute(
      "INSERT INTO final_approvals (clearance_request_id, approved_by_user_id, approval_level, status, remarks) VALUES (?, ?, ?, ?, ?)",
      [clearance_request_id, req.user.id, approval_level, status, remarks],
    )

    // If principal approved, mark clearance as completed
    if (approval_level === "principal" && status === "approved") {
      await db.execute('UPDATE clearance_requests SET status = "completed", completed_at = NOW() WHERE id = ?', [
        clearance_request_id,
      ])
    }

    res.json({ message: "Final approval processed successfully" })
  } catch (error) {
    console.error("Final approval error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Initialize database and start server
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
})
