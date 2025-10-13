import { Navigate, Outlet } from "react-router-dom"
import { getToken, getUser } from "../services/storage"

export default function ProtectedRoute({ roles }) {
  const token = getToken()
  const user = getUser()

  if (!token) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user?.role)) return <Navigate to="/" replace />

  return <Outlet />
}
