//department.routes.js..
import { Router } from "express"
import { auth } from "../middleware/auth.js"
import { allow } from "../middleware/roles.js"
import { decide, queue, stepDetail, history, stats } from "../controllers/department.controller.js"

const r = Router()
r.get("/queue", auth, allow("hod", "admin"), queue)
r.get("/stats", auth, allow("hod", "admin"), stats) // New endpoint for stats
r.get("/history", auth, allow("hod", "admin"), history) // New endpoint for history
r.get("/step/:id", auth, allow("hod", "admin"), stepDetail)
r.post("/step/:id/decision", auth, allow("hod", "admin"), decide)

export default r
