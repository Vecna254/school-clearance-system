import { Router } from "express"
import { auth } from "../middleware/auth.js"
import { allow } from "../middleware/roles.js"
import { approveFinal, certificate, myLatest, start } from "../controllers/clearance.controller.js"

const r = Router()
r.post("/start", auth, allow("student", "admin"), start)
r.get("/my-latest", auth, allow("student", "admin"), myLatest)
r.post("/:id/final-approve", auth, allow("admin"), approveFinal)
r.get("/:id/certificate", auth, allow("student", "admin"), certificate)

export default r
