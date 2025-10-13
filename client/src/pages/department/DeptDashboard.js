"use client"

import { useEffect, useState } from "react"
import Table from "../../components/Table"
import Card from "../../components/Card"
import { Link } from "react-router-dom"
import api from "../../services/api"
import styled from "styled-components"

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  min-height: calc(100vh - 80px);
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`

const StatCard = styled(Card)`
  text-align: center;
  background: ${({ color }) =>
    color === "pending"
      ? "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)"
      : color === "cleared"
        ? "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)"
        : color === "rejected"
          ? "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)"
          : "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)"};
  
  h3 {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 8px;
    color: ${({ color }) =>
      color === "pending" ? "#92400e" : color === "cleared" ? "#065f46" : color === "rejected" ? "#991b1b" : "#3730a3"};
  }
  
  p {
    color: ${({ color }) =>
      color === "pending" ? "#78350f" : color === "cleared" ? "#047857" : color === "rejected" ? "#7f1d1d" : "#4338ca"};
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: 0.875rem;
  }
`

const TableCard = styled(Card)`
  overflow: hidden;
  padding: 0;
  
  .table-header {
    padding: 24px;
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    color: white;
    margin: 0;
    
    h2 {
      color: white;
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
    }
  }
  
  .table-container {
    padding: 24px;
  }
`

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${({ status }) =>
    status === "pending"
      ? "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)"
      : status === "cleared"
        ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
        : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"};
  color: white;
`

export default function DeptDashboard() {
  const [rows, setRows] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    cleared: 0,
    rejected: 0,
  })

  useEffect(() => {
    ;(async () => {
      const { data } = await api.get("/department/queue")
      setRows(data)

      // Calculate statistics
      const pending = data.filter((r) => r.status === "pending").length
      const cleared = data.filter((r) => r.status === "cleared").length
      const rejected = data.filter((r) => r.status === "rejected").length

      setStats({
        total: data.length,
        pending,
        cleared,
        rejected,
      })
    })()
  }, [])

  return (
    <DashboardContainer>
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "800",
            background: "linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "8px",
          }}
        >
          Department Dashboard
        </h1>
        <p style={{ color: "#64748b", fontSize: "1.125rem" }}>Manage and review student clearance requests</p>
      </div>

      <StatsGrid>
        <StatCard color="total">
          <h3>{stats.total}</h3>
          <p>Total Requests</p>
        </StatCard>
        <StatCard color="pending">
          <h3>{stats.pending}</h3>
          <p>Pending Review</p>
        </StatCard>
        <StatCard color="cleared">
          <h3>{stats.cleared}</h3>
          <p>Cleared</p>
        </StatCard>
        <StatCard color="rejected">
          <h3>{stats.rejected}</h3>
          <p>Rejected</p>
        </StatCard>
      </StatsGrid>

      <TableCard>
        <div className="table-header">
          <h2>Student Queue</h2>
        </div>
        <div className="table-container">
          <Table>
            <thead>
              <tr>
                <th>#</th>
                <th>Student Name</th>
                <th>Admission Number</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.clearance_step_id}>
                  <td>{i + 1}</td>
                  <td style={{ fontWeight: "600", color: "#1e293b" }}>{r.full_name}</td>
                  <td style={{ fontFamily: "monospace", fontSize: "14px" }}>{r.admission_number}</td>
                  <td>
                    <StatusBadge status={r.status}>{r.status}</StatusBadge>
                  </td>
                  <td>
                    <Link to={`/department/student/${r.clearance_step_id}`}>Review Student</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </TableCard>
    </DashboardContainer>
  )
}
