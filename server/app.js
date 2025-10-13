import express from "express"
import cors from "cors"
import helmet from "helmet"
import { config } from "dotenv"
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import studentRoutes from "./routes/student.routes.js"
import deptRoutes from "./routes/department.routes.js"
import clearanceRoutes from "./routes/clearance.routes.js"
import adminRoutes from "./routes/admin.routes.js"


config()

const app = express()

app.use(helmet())
app.use(cors({ origin: process.env.APP_ORIGIN, credentials: true }))
app.use(express.json())

app.get("/api/health", (req, res) => res.json({ ok: true }))

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/student", studentRoutes)
app.use("/api/department", deptRoutes)
app.use("/api/clearance", clearanceRoutes)
app.use("/api/admin", adminRoutes)

app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ message: err.message || "Server error" })
})

export default app
