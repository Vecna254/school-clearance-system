//auth.controller.js
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { env } from "../config/env.js"
import { pool } from "../config/db.js"
import { createUser, findByEmail } from "../models/user.model.js"
import { createStudent } from "../models/student.model.js"

function sign(user) {
  const payload = { id: user.id, role: user.role, department: user.department || null }
    console.log("JWT Secret being used:", env.jwtSecret)
  return jwt.sign(payload, env.jwtSecret, { expiresIn: "7d" })

}

export async function login(req, res) {
  const { email, password } = req.body
  const user = await findByEmail(email)
  if (!user) return res.status(400).json({ message: "Invalid credentials" })

  const ok = await bcrypt.compare(password, user.password_hash)
  if (!ok) return res.status(400).json({ message: "Invalid credentials" })

  const token = sign(user)
  delete user.password_hash
  res.json({ token, user })
}

//registration
export async function registerStudent(req, res) {
  const { full_name, admission_number, kcse_year, class_form, stream, phone, email, password } = req.body
  const hash = await bcrypt.hash(password, 10)
  const username = admission_number

  const [exists] = await pool.query("SELECT id FROM users WHERE email = ? OR username = ?", [email, username])
  if (exists.length) return res.status(400).json({ message: "Email or Admission already exists" })

  const user = await createUser({
    username,
    email,
    password_hash: hash,
    role: "student",
    department: null,
    full_name,
    phone,
  })
  await createStudent(user.id, { admission_number, full_name, kcse_year, class_form, stream, phone, email })

  const token = sign(user)
  delete user.password_hash
  res.status(201).json({ token, user })

  
 
}
