//auth.routes.js
import { Router } from "express"
import { auth } from "../middleware/auth.js"
import { allow } from "../middleware/roles.js"
import { approveFinal, certificate, myLatest, start } from "../controllers/clearance.controller.js"
import { login, registerStudent } from "../controllers/auth.controller.js"


const r = Router()

// Student registration & login
r.post("/register-student", registerStudent)
r.post("/login", login)

// Clearance related
r.post("/start", auth, allow("student", "admin"), start)
r.get("/my-latest", auth, allow("student", "admin"), myLatest)
r.post("/:id/final-approve", auth, allow("admin"), approveFinal)
r.get("/:id/certificate", auth, allow("student", "admin"), certificate)


//admin

export default r
