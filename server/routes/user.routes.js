import { Router } from "express"
import { auth } from "../middleware/auth.js"
import { getUsers } from "../controllers/user.controller.js"

const r = Router()
r.get("/", auth, getUsers)

export default r
