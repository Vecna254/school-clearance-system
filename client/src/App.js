import { Routes, Route, Navigate } from "react-router-dom"
import Navbar from "./components/Navbar"
import Page from "./components/Page"
import Home from "./pages/Home"
import Login from "./pages/auth/Login"
import RegisterStudent from "./pages/auth/RegisterStudent"
import StartClearance from "./pages/student/StartClearance"
import ClearanceForm from "./pages/student/ClearanceForm"
import ClearanceStatus from "./pages/student/ClearanceStatus"
import Downloads from "./pages/student/Downloads"
import DeptLogin from "./pages/department/DeptLogin"
import DeptDashboard from "./pages/department/DeptDashboard"
import DeptStudentReview from "./pages/department/DeptStudentReview"
import AdminLogin from "./pages/admin/AdminLogin"
import AdminDashboard from "./pages/admin/AdminDashboard"
import ManageDepartments from "./pages/admin/ManageDepartments"
import ManageUsers from "./pages/admin/ManageUsers"
import Reports from "./pages/admin/Reports"
import ProtectedRoute from "./routes/ProtectedRoute"

export default function App() {
  return (
    <>
      <Navbar />
      <Page>
        <Routes>
         <Route path="/" element={<Home />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterStudent />} />

          {/* Student */}
          <Route element={<ProtectedRoute roles={["student", "admin"]} />}>
            <Route path="/student/start" element={<StartClearance />} />
            <Route path="/student/form" element={<ClearanceForm />} />
            <Route path="/student/status" element={<ClearanceStatus />} />
            <Route path="/student/downloads" element={<Downloads />} />
          </Route>
          {/* Department */}
          <Route path="/department/login" element={<DeptLogin />} />
          <Route element={<ProtectedRoute roles={["hod", "admin"]} />}>
            <Route path="/department/dashboard" element={<DeptDashboard />} />
            <Route path="/department/student/:id" element={<DeptStudentReview />} />
          </Route>
          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<ProtectedRoute roles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/departments" element={<ManageDepartments />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/reports" element={<Reports />} />
          </Route>
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </Page>
    </>
  )
}
