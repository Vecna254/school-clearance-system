import { Router } from "express"
import { auth } from "../middleware/auth.js"
import { me } from "../controllers/student.controller.js"

const r = Router()
r.get("/me", auth, me)

export default r
