"use client"

import { useEffect, useState } from "react"
import styled from "styled-components"
import Card from "../../components/Card"
import Table from "../../components/Table"
import Field from "../../components/FormField"
import Button from "../../components/Button"
import api from "../../services/api"

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`

const FormCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing(6)};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadow.lg};
`

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`

const ModernField = styled(Field)`
  label {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.gray[700]};
    margin-bottom: ${({ theme }) => theme.spacing(1)};
    display: block;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  input, select {
    width: 100%;
    padding: ${({ theme }) => theme.spacing(2.5)};
    border: 2px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius};
    font-size: 1rem;
    transition: all 0.3s ease;
    background: white;

    &:focus {
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
      outline: none;
    }

    &:hover {
      border-color: ${({ theme }) => theme.colors.gray[400]};
    }
  }

  select {
    cursor: pointer;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  flex-wrap: wrap;
`

const ModernButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing(2.5)} ${({ theme }) => theme.spacing(4)};
  border-radius: ${({ theme }) => theme.radius};
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: ${({ theme }) => theme.shadow.sm};

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadow.md};
  }
`

const AlertMessage = styled.div`
  padding: ${({ theme }) => theme.spacing(3)};
  background: ${({ theme }) => theme.colors.gray[100]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  color: ${({ theme }) => theme.colors.gray[700]};
  font-weight: 500;
`

const TableCard = styled(Card)`
  padding: 0;
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  overflow: hidden;
`

const TableHeader = styled.div`
  padding: ${({ theme }) => theme.spacing(4)};
  background: ${({ theme }) => theme.colors.gray[50]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  h3 {
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
    font-size: 1.25rem;
    font-weight: 700;
  }
`

const ModernTable = styled(Table)`
  margin: 0;
  
  thead {
    background: ${({ theme }) => theme.colors.gray[50]};
    
    th {
      padding: ${({ theme }) => theme.spacing(3)};
      font-weight: 700;
      color: ${({ theme }) => theme.colors.gray[700]};
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.5px;
      border-bottom: 2px solid ${({ theme }) => theme.colors.border};
    }
  }

  tbody {
    tr {
      transition: all 0.2s ease;
      
      &:hover {
        background: ${({ theme }) => theme.colors.gray[50]};
      }

      td {
        padding: ${({ theme }) => theme.spacing(3)};
        border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
        vertical-align: middle;
      }
    }
  }
`

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(1)};
`

const RoleBadge = styled.span`
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2)};
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${({ role, theme }) =>
    role === "admin" ? theme.colors.danger : role === "hod" ? theme.colors.primary : theme.colors.success};
  color: white;
`

export default function ManageUsers() {
  const [rows, setRows] = useState([])
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    username: "",
    role: "hod",
    department: "",
    password: "",
  })
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState("")

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const { data } = await api.get("/admin/users")
      setRows(data)
    } catch (error) {
      setMessage("Error loading users")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.put(`/admin/users/${editingId}`, form)
        setMessage("User updated successfully")
        setEditingId(null)
      } else {
        await api.post("/admin/users", form)
        setMessage("User added successfully")
      }
      setForm({ full_name: "", email: "", username: "", role: "hod", department: "", password: "" })
      loadUsers()
    } catch (error) {
      setMessage("Error saving user: " + (error.response?.data?.error || error.message))
    }
  }

  const handleEdit = (user) => {
    setForm({
      full_name: user.full_name,
      email: user.email,
      username: user.username,
      role: user.role,
      department: user.department || "",
      password: "",
    })
    setEditingId(user.id)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return
    try {
      await api.delete(`/admin/users/${id}`)
      setMessage("User deleted successfully")
      loadUsers()
    } catch (error) {
      setMessage("Error deleting user: " + (error.response?.data?.error || error.message))
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm({ full_name: "", email: "", username: "", role: "hod", department: "", password: "" })
  }

  return (
    <PageContainer>
      <FormCard>
        <h2 style={{ marginBottom: "1.5rem", color: "#1e293b", fontSize: "1.5rem", fontWeight: "700" }}>
          {editingId ? "✏️ Edit User" : "➕ Add New User"}
        </h2>

        {message && <AlertMessage>{message}</AlertMessage>}

        <form onSubmit={handleSubmit}>
          <FormGrid>
            <ModernField>
              <label>Full Name</label>
              <input
                name="full_name"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                required
                placeholder="Enter full name"
              />
            </ModernField>
            <ModernField>
              <label>Email Address</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                required
                placeholder="user@school.edu"
              />
            </ModernField>
            <ModernField>
              <label>Username</label>
              <input
                name="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                required
                placeholder="Enter username"
              />
            </ModernField>
            <ModernField>
              <label>Password {editingId && "(leave blank to keep current)"}</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                required={!editingId}
                placeholder={editingId ? "Leave blank to keep current" : "Enter password"}
              />
            </ModernField>
            <ModernField>
              <label>User Role</label>
              <select
                name="role"
                value={form.role}
                onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
              >
                <option value="hod">Head of Department</option>
                <option value="admin">Administrator</option>
                <option value="student">Student</option>
              </select>
            </ModernField>
            <ModernField>
              <label>Department (if HOD)</label>
              <input
                name="department"
                value={form.department}
                onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                placeholder="e.g., LIBRARY, ACCOUNTS, SPORTS"
              />
            </ModernField>
          </FormGrid>

          <ButtonGroup>
            <ModernButton type="submit">{editingId ? "💾 Update User" : "➕ Create User"}</ModernButton>
            {editingId && (
              <ModernButton type="button" variant="secondary" onClick={cancelEdit}>
                ❌ Cancel
              </ModernButton>
            )}
          </ButtonGroup>
        </form>
      </FormCard>

      <TableCard>
        <TableHeader>
          <h3>👥 User Management ({rows.length} users)</h3>
        </TableHeader>
        <ModernTable>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Username</th>
              <th>Role</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>
                  <strong style={{ color: "#1e293b" }}>{r.full_name}</strong>
                </td>
                <td style={{ color: "#64748b" }}>{r.email}</td>
                <td style={{ fontFamily: "monospace", background: "#f1f5f9", padding: "4px 8px", borderRadius: "4px" }}>
                  {r.username}
                </td>
                <td>
                  <RoleBadge role={r.role}>{r.role}</RoleBadge>
                </td>
                <td>{r.department || <span style={{ color: "#94a3b8" }}>—</span>}</td>
                <td>
                  <ActionButtons>
                    <ModernButton
                      variant="info"
                      onClick={() => handleEdit(r)}
                      style={{ fontSize: "0.875rem", padding: "6px 12px" }}
                    >
                      ✏️ Edit
                    </ModernButton>
                    <ModernButton
                      variant="danger"
                      onClick={() => handleDelete(r.id)}
                      style={{ fontSize: "0.875rem", padding: "6px 12px" }}
                    >
                      🗑️ Delete
                    </ModernButton>
                  </ActionButtons>
                </td>
              </tr>
            ))}
          </tbody>
        </ModernTable>
      </TableCard>
    </PageContainer>
  )
}
