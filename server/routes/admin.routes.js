import express from "express"
import { auth } from "../middleware/auth.js"
import { allow } from "../middleware/roles.js"
import {
  overview,
  departments,
  users,
  createUserAdmin,
  report,
  fixClearanceRequests,
  fixAwaitingFinal, // Added import for fixAwaitingFinal function
} from "../controllers/admin.controller.js"

const router = express.Router()

router.use(auth, allow("admin"))

router.get("/overview", overview)
router.get("/departments", departments)
router.post("/departments", departments)
router.put("/departments/:id", departments)
router.delete("/departments/:id", departments)

router.get("/users", users)
router.post("/users", users)
router.put("/users/:id", users)
router.delete("/users/:id", users)

router.post("/create-user", createUserAdmin)
router.get("/report", report)
router.get("/reports/clearance-summary", report)
router.post("/fix-clearances", fixClearanceRequests)
router.post("/fix-awaiting-final", fixAwaitingFinal) // Added route for fixing awaiting final status

export default router
