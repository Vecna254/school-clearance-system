"use client"

import { useEffect, useState } from "react"
import styled from "styled-components"
import Card from "../../components/Card"
import Table from "../../components/Table"
import Button from "../../components/Button"
import api from "../../services/api"

const DashboardContainer = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing(4)};
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`

const StatCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing(4)};
  text-align: center;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.white}, ${({ theme }) => theme.colors.gray[50]});
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadow.lg};
  }

  .stat-number {
    font-size: 2.5rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.primary};
    display: block;
    margin-bottom: ${({ theme }) => theme.spacing(1)};
  }

  .stat-label {
    color: ${({ theme }) => theme.colors.gray[600]};
    font-weight: 600;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`

const ActionCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing(4)};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadow.md};
`

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  flex-wrap: wrap;
`

const ModernButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(4)};
  border-radius: ${({ theme }) => theme.radius};
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: ${({ theme }) => theme.shadow.sm};

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadow.md};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`

const AlertCard = styled.div`
  padding: ${({ theme }) => theme.spacing(4)};
  background: ${({ variant }) =>
    variant === "success"
      ? "#d4edda"
      : variant === "warning"
        ? "#fff3cd"
        : variant === "error"
          ? "#f8d7da"
          : "#e2e3e5"};
  border: 1px solid ${({ variant }) =>
    variant === "success"
      ? "#c3e6cb"
      : variant === "warning"
        ? "#ffeaa7"
        : variant === "error"
          ? "#f5c6cb"
          : "#d6d8db"};
  border-radius: ${({ theme }) => theme.radius};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  color: ${({ variant }) =>
    variant === "success"
      ? "#155724"
      : variant === "warning"
        ? "#856404"
        : variant === "error"
          ? "#721c24"
          : "#495057"};

  h4 {
    margin: 0 0 ${({ theme }) => theme.spacing(1)} 0;
    font-weight: 700;
  }

  p {
    margin: 0;
    line-height: 1.5;
  }
`

const ModernTable = styled(Table)`
  background: white;
  border-radius: ${({ theme }) => theme.radius};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};

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
      }
    }
  }
`

const StatusBadge = styled.span`
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2)};
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${({ status, theme }) =>
    status === "completed"
      ? theme.colors.success
      : status === "awaiting_final"
        ? theme.colors.warning
        : status === "rejected"
          ? theme.colors.danger
          : theme.colors.gray[400]};
  color: white;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
`

export default function AdminDashboard() {
  const [rows, setRows] = useState([])
  const [awaitingFinal, setAwaitingFinal] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    awaitingFinal: 0,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const { data } = await api.get("/admin/overview")
      setRows(data)

      const awaitingFinalApproval = data.filter((item) => item.status === "awaiting_final")
      setAwaitingFinal(awaitingFinalApproval)

      setStats({
        total: data.length,
        completed: data.filter((item) => item.status === "completed").length,
        pending: data.filter((item) => item.status === "pending").length,
        awaitingFinal: awaitingFinalApproval.length,
      })
    } catch (error) {
      console.error("Error loading overview:", error)
    }
  }

  const fixClearances = async () => {
    setLoading(true)
    setMessage("")
    try {
      const { data } = await api.post("/admin/fix-clearances")
      setMessage(`✅ ${data.message}`)
      await loadData()
    } catch (error) {
      setMessage(`❌ Error: ${error.response?.data?.error || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const fixAwaitingFinal = async () => {
    setLoading(true)
    setMessage("")
    try {
      const { data } = await api.post("/admin/fix-awaiting-final")
      setMessage(`✅ ${data.message}`)
      await loadData()
    } catch (error) {
      setMessage(`❌ Error: ${error.response?.data?.error || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const approveFinal = async (clearanceId, studentName) => {
    if (!window.confirm(`Are you sure you want to give final approval for ${studentName}?`)) {
      return
    }

    try {
      await api.post(`/clearance/${clearanceId}/final-approve`)
      setMessage(`✅ Final approval granted for ${studentName}`)
      await loadData()
    } catch (error) {
      setMessage(`❌ Error: ${error.response?.data?.error || error.message}`)
    }
  }

  return (
    <DashboardContainer>
      <StatsGrid>
        <StatCard>
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Total Clearances</span>
        </StatCard>
        <StatCard>
          <span className="stat-number">{stats.completed}</span>
          <span className="stat-label">Completed</span>
        </StatCard>
        <StatCard>
          <span className="stat-number">{stats.pending}</span>
          <span className="stat-label">In Progress</span>
        </StatCard>
        <StatCard>
          <span className="stat-number">{stats.awaitingFinal}</span>
          <span className="stat-label">Awaiting Final</span>
        </StatCard>
      </StatsGrid>

      {awaitingFinal.length > 0 && (
        <ActionCard>
          <h2 style={{ marginBottom: "1rem", color: "#856404" }}>
            🎓 Final Approvals Required ({awaitingFinal.length})
          </h2>
          <AlertCard variant="warning">
            <h4>Action Required</h4>
            <p>These students have been cleared by all departments and are awaiting your final approval.</p>
          </AlertCard>

          <ModernTable>
            <thead>
              <tr>
                <th>Student</th>
                <th>Admission</th>
                <th>Progress</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {awaitingFinal.map((r) => (
                <tr key={r.id}>
                  <td>
                    <strong style={{ color: "#1e293b" }}>{r.full_name}</strong>
                  </td>
                  <td>{r.admission_number}</td>
                  <td>
                    <StatusBadge status="completed">
                      ✅ {r.cleared_count}/{r.total_departments} All Cleared
                    </StatusBadge>
                  </td>
                  <td>
                    <ModernButton
                      onClick={() => approveFinal(r.id, r.full_name)}
                      style={{
                        backgroundColor: "#10b981",
                        color: "white",
                      }}
                    >
                      🎓 Grant Final Approval
                    </ModernButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </ModernTable>
        </ActionCard>
      )}

      <ActionCard>
        <h2 style={{ marginBottom: "1.5rem", color: "#1e293b" }}>System Administration</h2>

        <ActionButtons>
          <ModernButton onClick={fixClearances} disabled={loading}>
            {loading ? "Processing..." : "🔧 Fix Missing Clearances"}
          </ModernButton>
          <ModernButton
            onClick={fixAwaitingFinal}
            disabled={loading}
            style={{ backgroundColor: "#f59e0b", color: "white" }}
          >
            {loading ? "Processing..." : "⚡ Fix Awaiting Final Status"}
          </ModernButton>
        </ActionButtons>

        {message && (
          <AlertCard variant={message.includes("✅") ? "success" : "error"}>
            <p>{message}</p>
          </AlertCard>
        )}

        <h3 style={{ marginBottom: "1rem", color: "#1e293b" }}>All Clearance Requests</h3>
        <ModernTable>
          <thead>
            <tr>
              <th>Student</th>
              <th>Admission</th>
              <th>Status</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>
                  <strong style={{ color: "#1e293b" }}>{r.full_name}</strong>
                </td>
                <td>{r.admission_number}</td>
                <td>
                  <StatusBadge status={r.status}>
                    {r.status === "awaiting_final"
                      ? "⏳ Awaiting Final"
                      : r.status === "completed"
                        ? "✅ Completed"
                        : r.status === "rejected"
                          ? "❌ Rejected"
                          : "🔄 In Progress"}
                  </StatusBadge>
                </td>
                <td>
                  <span style={{ fontWeight: "600" }}>
                    {r.cleared_count}/{r.total_departments}
                  </span>
                  {r.status === "awaiting_final" && (
                    <span style={{ color: "#10b981", marginLeft: 8, fontSize: "0.875rem" }}>
                      (Ready for Final Approval)
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </ModernTable>
      </ActionCard>
    </DashboardContainer>
  )
}
