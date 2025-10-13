"use client"

import { useEffect, useState } from "react"
import styled from "styled-components"
import Card from "../../components/Card"
import Table from "../../components/Table"
import Field from "../../components/FormField"
import Button from "../../components/Button"
import api from "../../services/api"

const PageContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`

const FormCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing(6)};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadow.lg};
`

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto auto;
  gap: ${({ theme }) => theme.spacing(3)};
  align-items: end;
  margin-bottom: ${({ theme }) => theme.spacing(4)};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing(2)};
  }
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

  input {
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
`

const CheckboxField = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(2)};
  background: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.radius};
  border: 2px solid ${({ theme }) => theme.colors.border};

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: ${({ theme }) => theme.colors.primary};
  }

  label {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.gray[700]};
    cursor: pointer;
    margin: 0;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
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

const StatusBadge = styled.span`
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2)};
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${({ active, theme }) => (active ? theme.colors.success : theme.colors.gray[400])};
  color: white;
`

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(1)};
`

export default function ManageDepartments() {
  const [rows, setRows] = useState([])
  const [form, setForm] = useState({ name: "", code: "", is_active: true })
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState("")

  useEffect(() => {
    loadDepartments()
  }, [])

  const loadDepartments = async () => {
    try {
      const { data } = await api.get("/admin/departments")
      setRows(data)
    } catch (error) {
      console.error("Error loading departments:", error)
      setMessage("Error loading departments")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.put(`/admin/departments/${editingId}`, form)
        setMessage("Department updated successfully")
        setEditingId(null)
      } else {
        await api.post("/admin/departments", form)
        setMessage("Department added successfully")
      }
      setForm({ name: "", code: "", is_active: true })
      loadDepartments()
    } catch (error) {
      console.error("Error saving department:", error)
      setMessage("Error saving department: " + (error.response?.data?.error || error.message))
    }
  }

  const handleEdit = (dept) => {
    setForm({ name: dept.name, code: dept.code, is_active: Boolean(dept.is_active) })
    setEditingId(dept.id)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return
    try {
      await api.delete(`/admin/departments/${id}`)
      setMessage("Department deleted successfully")
      loadDepartments()
    } catch (error) {
      console.error("Error deleting department:", error)
      setMessage("Error deleting department: " + (error.response?.data?.error || error.message))
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm({ name: "", code: "", is_active: true })
  }

  return (
    <PageContainer>
      <FormCard>
        <h2 style={{ marginBottom: "1.5rem", color: "#1e293b", fontSize: "1.5rem", fontWeight: "700" }}>
          {editingId ? "✏️ Edit Department" : "🏢 Add New Department"}
        </h2>

        {message && <AlertMessage>{message}</AlertMessage>}

        <form onSubmit={handleSubmit}>
          <FormRow>
            <ModernField>
              <label>Department Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                placeholder="e.g., Library Services"
              />
            </ModernField>
            <ModernField>
              <label>Department Code</label>
              <input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                required
                placeholder="e.g., LIBRARY"
                style={{ textTransform: "uppercase" }}
              />
            </ModernField>
            <CheckboxField>
              <input
                type="checkbox"
                id="is_active"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              />
              <label htmlFor="is_active">Active Department</label>
            </CheckboxField>
            <ButtonGroup>
              <ModernButton type="submit">{editingId ? "💾 Update" : "➕ Add"}</ModernButton>
              {editingId && (
                <ModernButton type="button" variant="secondary" onClick={cancelEdit}>
                  ❌ Cancel
                </ModernButton>
              )}
            </ButtonGroup>
          </FormRow>
        </form>
      </FormCard>

      <TableCard>
        <TableHeader>
          <h3>🏢 Department Management ({rows.length} departments)</h3>
        </TableHeader>
        <ModernTable>
          <thead>
            <tr>
              <th>Department Name</th>
              <th>Code</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>
                  <strong style={{ color: "#1e293b" }}>{r.name}</strong>
                </td>
                <td>
                  <span
                    style={{
                      fontFamily: "monospace",
                      background: "#f1f5f9",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontWeight: "600",
                    }}
                  >
                    {r.code}
                  </span>
                </td>
                <td>
                  <StatusBadge active={r.is_active}>{r.is_active ? "✅ Active" : "❌ Inactive"}</StatusBadge>
                </td>
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
