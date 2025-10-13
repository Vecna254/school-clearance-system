import { config } from "dotenv"

config()

export const env = {
  jwtSecret: process.env.JWT_SECRET,
  appName: process.env.APP_NAME || "Clearance System",
}
