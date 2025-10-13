import { findStudentByUserId } from "../models/student.model.js"

export async function me(req, res) {
  const me = await findStudentByUserId(req.user.id)
  res.json(me)
}
