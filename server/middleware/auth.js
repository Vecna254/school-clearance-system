import jwt from "jsonwebtoken"
import { env } from "../config/env.js"

export function auth(req, res, next) {
  const header = req.headers.authorization || ""
  const token = header.startsWith("Bearer ") ? header.slice(7) : null

  if (!token) return res.status(401).json({ message: "Unauthorized" })

  try {
    const payload = jwt.verify(token, env.jwtSecret)
    req.user = payload // { id, role, department }
    next()
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" })
  }
}
