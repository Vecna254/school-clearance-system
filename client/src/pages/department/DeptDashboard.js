//DeptDashboard.js..
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

const TabContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  border-bottom: 2px solid #e2e8f0;
`

const Tab = styled.button`
  background: none;
  border: none;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 600;
  color: ${({ $active }) => ($active ? "#3b82f6" : "#94a3b8")};
  border-bottom: ${({ $active }) => ($active ? "3px solid #3b82f6" : "none")};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: #1e293b;
  }
`

const DetailsRow = styled.div`
  background: #f8fafc;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 8px;
  font-size: 14px;
  color: #475569;
  
  .detail-item {
    margin: 4px 0;
    
    strong {
      color: #1e293b;
    }
  }
`

export default function DeptDashboard() {
  const [rows, setRows] = useState([])
  const [history, setHistory] = useState([])
  const [activeTab, setActiveTab] = useState("queue")
  const [stats, setStats] = useState({
    total_count: 0,
    pending_count: 0,
    cleared_count: 0,
    rejected_count: 0,
    total_dues: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const [queueRes, historyRes, statsRes] = await Promise.all([
          api.get("/department/queue"),
          api.get("/department/history"),
          api.get("/department/stats"),
        ])

        setRows(queueRes.data)
        setHistory(historyRes.data)
        setStats(statsRes.data)
      } catch (error) {
        console.error("[v0] Error loading dashboard:", error)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

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
          <h3>{stats.total_count}</h3>
          <p>Total Processed</p>
        </StatCard>
        <StatCard color="pending">
          <h3>{stats.pending_count}</h3>
          <p>Pending Review</p>
        </StatCard>
        <StatCard color="cleared">
          <h3>{stats.cleared_count}</h3>
          <p>Cleared</p>
        </StatCard>
        <StatCard color="rejected">
          <h3>{stats.rejected_count}</h3>
          <p>Rejected</p>
        </StatCard>
      </StatsGrid>

      <TabContainer>
        <Tab $active={activeTab === "queue"} onClick={() => setActiveTab("queue")}>
          📋 Pending Queue ({stats.pending_count})
        </Tab>
        <Tab $active={activeTab === "history"} onClick={() => setActiveTab("history")}>
          📜 Clearance History ({stats.cleared_count + stats.rejected_count})
        </Tab>
      </TabContainer>

      {activeTab === "queue" && (
        <TableCard>
          <div className="table-header">
            <h2>Student Queue - Pending Review</h2>
          </div>
          <div className="table-container">
            {rows.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 24px", color: "#94a3b8" }}>
                <p style={{ fontSize: "18px" }}>No pending requests</p>
                <p style={{ fontSize: "14px" }}>All students have been reviewed!</p>
              </div>
            ) : (
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
            )}
          </div>
        </TableCard>
      )}

      {activeTab === "history" && (
        <TableCard>
          <div className="table-header">
            <h2>Clearance History - Past Decisions</h2>
          </div>
          <div className="table-container">
            {history.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 24px", color: "#94a3b8" }}>
                <p style={{ fontSize: "18px" }}>No clearance history yet</p>
              </div>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Student Name</th>
                    <th>Admission Number</th>
                    <th>Status</th>
                    <th>Cleared By</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, i) => (
                    <tr key={item.id}>
                      <td>{i + 1}</td>
                      <td style={{ fontWeight: "600", color: "#1e293b" }}>{item.full_name}</td>
                      <td style={{ fontFamily: "monospace", fontSize: "14px" }}>{item.admission_number}</td>
                      <td>
                        <StatusBadge status={item.status}>{item.status}</StatusBadge>
                      </td>
                      <td style={{ fontSize: "14px", color: "#64748b" }}>{item.cleared_by_name || "N/A"}</td>
                      <td style={{ fontSize: "14px", color: "#64748b" }}>{formatDate(item.cleared_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </TableCard>
      )}
    </DashboardContainer>
  )
}
