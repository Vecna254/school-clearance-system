//Navbar.js..
"use client"

import styled from "styled-components"
import { Link, useNavigate, useLocation } from "react-router-dom"
import Button from "./Button"
import { clearToken, clearUser, getUser } from "../services/storage"
import { useEffect, useState } from "react"
import api from "../services/api"

const Bar = styled.header`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
  position: sticky; 
  top: 0; 
  z-index: 100;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(8px);
`

const Inner = styled.div`
  max-width: 1200px; 
  margin: 0 auto; 
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
  padding: 16px 24px;
  
  @media (max-width: 768px) {
    padding: 12px 16px;
  }
`

const Logo = styled(Link)`
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: '🎓';
    font-size: 1.5rem;
  }
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    
    &::before {
      font-size: 1.25rem;
    }
  }
`

const Nav = styled.nav`
  display: flex;
  gap: 8px;
  align-items: center;
  
  @media (max-width: 768px) {
    gap: 4px;
  }
`

const NavLink = styled(Link)`
  color: #475569;
  font-weight: 600;
  padding: 10px 16px;
  border-radius: 12px;
  transition: all 0.2s ease;
  text-decoration: none;
  font-size: 14px;
  position: relative;
  
  &:hover {
    background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
    color: #3730a3;
    transform: translateY(-1px);
  }
  
  &.active {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
  }
  
  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 13px;
  }
`

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  .user-badge {
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    color: white;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  @media (max-width: 768px) {
    .user-badge {
      display: none;
    }
  }
`

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = getUser()
  const [studentStatus, setStudentStatus] = useState(null)
  const [loadingStatus, setLoadingStatus] = useState(true)

  useEffect(() => {
    ;(async () => {
      if (user?.role === "student") {
        try {
          const { data } = await api.get("/clearance/my-latest")
          setStudentStatus(data?.status)
        } catch (error) {
          console.error("Error fetching student status:", error)
        } finally {
          setLoadingStatus(false)
        }
      } else {
        setLoadingStatus(false)
      }
    })()
  }, [user])

  const logout = () => {
    clearToken()
    clearUser()
    navigate("/")
  }

  const isActive = (path) => location.pathname === path

  return (
    <Bar>
      <Inner>
        <Logo to="/">ClearanceSystem</Logo>
        <Nav>
          {!user ? (
            <>
              <NavLink to="/" className={isActive("/") ? "active" : ""}>
                Home
              </NavLink>
              <NavLink to="/login" className={isActive("/login") ? "active" : ""}>
                Login
              </NavLink>
              <NavLink to="/register" className={isActive("/register") ? "active" : ""}>
                Register
              </NavLink>
            </>
          ) : (
            <>
              <UserInfo>
                <div className="user-badge">{user.role}</div>
              </UserInfo>

              {user.role === "student" && !loadingStatus && (
                <>
                  {!studentStatus || studentStatus === "rejected" ? (
                    <NavLink to="/student/start" className={isActive("/student/start") ? "active" : ""}>
                      Start Clearance
                    </NavLink>
                  ) : null}
                  <NavLink to="/student/status" className={isActive("/student/status") ? "active" : ""}>
                    My Status
                  </NavLink>
                  <NavLink to="/student/downloads" className={isActive("/student/downloads") ? "active" : ""}>
                    Downloads
                  </NavLink>
                </>
              )}

              {user.role === "hod" && (
                <>
                  <NavLink to="/department/dashboard" className={isActive("/department/dashboard") ? "active" : ""}>
                    Department
                  </NavLink>
                </>
              )}

              {user.role === "admin" && (
                <>
                  <NavLink to="/admin/dashboard" className={isActive("/admin/dashboard") ? "active" : ""}>
                    Dashboard
                  </NavLink>
                  <NavLink to="/admin/departments" className={isActive("/admin/departments") ? "active" : ""}>
                    Departments
                  </NavLink>
                  <NavLink to="/admin/users" className={isActive("/admin/users") ? "active" : ""}>
                    Users
                  </NavLink>
                  <NavLink to="/admin/reports" className={isActive("/admin/reports") ? "active" : ""}>
                    Reports
                  </NavLink>
                </>
              )}

              <Button size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          )}
        </Nav>
      </Inner>
    </Bar>
  )
}
