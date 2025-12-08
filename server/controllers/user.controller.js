//user.controller.js
import { listUsers } from "../models/user.model.js"

export async function getUsers(req, res) {
  const rows = await listUsers()
  rows.forEach((r) => delete r.password_hash)
  res.json(rows)
}
