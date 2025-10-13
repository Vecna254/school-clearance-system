"use client"

import { useEffect, useState } from "react"
import styled from "styled-components"
import Card from "../../components/Card"
import Table from "../../components/Table"
import api from "../../services/api"

const ReportsContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`

const HeaderCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing(6)};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.darkBg}, ${({ theme }) => theme.colors.primary});
  color: white;
  text-align: center;
  border: none;
  box-shadow: ${({ theme }) => theme.shadow.xl};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`

const ReportCard = styled(Card)`
  padding: 0;
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  overflow: hidden;
`

const ReportHeader = styled.div`
  padding: ${({ theme }) => theme.spacing(4)};
  background: ${({ theme }) => theme.colors.gray[50]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  h3 {
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
    font-size: 1.25rem;
    font-weight: 700;
  }

  p {
    margin: ${({ theme }) => theme.spacing(1)} 0 0 0;
    color: ${({ theme }) => theme.colors.gray[600]};
    font-size: 0.875rem;
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
      text-align: left;
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

const StatBadge = styled.span`
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2)};
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  background: ${({ type, theme }) =>
    type === "cleared"
      ? theme.colors.success
      : type === "rejected"
        ? theme.colors.danger
        : type === "pending"
          ? theme.colors.warning
          : theme.colors.gray[400]};
  color: white;
  min-width: 60px;
  text-align: center;
  display: inline-block;
`

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`

const SummaryCard = styled.div`
  padding: ${({ theme }) => theme.spacing(4)};
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  text-align: center;
  box-shadow: ${({ theme }) => theme.shadow.sm};

  .summary-number {
    font-size: 2rem;
    font-weight: 800;
    color: ${({ type, theme }) =>
      type === "cleared"
        ? theme.colors.success
        : type === "rejected"
          ? theme.colors.danger
          : type === "pending"
            ? theme.colors.warning
            : theme.colors.primary};
    display: block;
    margin-bottom: ${({ theme }) => theme.spacing(1)};
  }

  .summary-label {
    color: ${({ theme }) => theme.colors.gray[600]};
    font-weight: 600;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing(8)};
  
  &::after {
    content: '';
    width: 40px;
    height: 40px;
    border: 4px solid ${({ theme }) => theme.colors.gray[300]};
    border-top: 4px solid ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

export default function Reports() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState({
    totalCleared: 0,
    totalRejected: 0,
    totalPending: 0,
    totalRequests: 0,
  })

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await api.get("/admin/reports/clearance-summary")
        setRows(data)

        const totals = data.reduce(
          (acc, row) => ({
            totalCleared: acc.totalCleared + (Number.parseInt(row.cleared) || 0),
            totalRejected: acc.totalRejected + (Number.parseInt(row.rejected) || 0),
            totalPending: acc.totalPending + (Number.parseInt(row.pending) || 0),
            totalRequests:
              acc.totalRequests +
              (Number.parseInt(row.cleared) || 0) +
              (Number.parseInt(row.rejected) || 0) +
              (Number.parseInt(row.pending) || 0),
          }),
          { totalCleared: 0, totalRejected: 0, totalPending: 0, totalRequests: 0 },
        )

        setSummary(totals)
      } catch (error) {
        console.error("Error loading reports:", error)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <ReportsContainer>
      <HeaderCard>
        <h1 style={{ margin: "0 0 1rem 0", fontSize: "2rem" }}>📊 Clearance Reports</h1>
        <p style={{ margin: 0, fontSize: "1.125rem", opacity: 0.9 }}>
          Comprehensive overview of clearance statistics across all departments
        </p>
      </HeaderCard>

      <SummaryGrid>
        <SummaryCard type="total">
          <span className="summary-number">{summary.totalRequests}</span>
          <span className="summary-label">Total Requests</span>
        </SummaryCard>
        <SummaryCard type="cleared">
          <span className="summary-number">{summary.totalCleared}</span>
          <span className="summary-label">Cleared</span>
        </SummaryCard>
        <SummaryCard type="pending">
          <span className="summary-number">{summary.totalPending}</span>
          <span className="summary-label">Pending</span>
        </SummaryCard>
        <SummaryCard type="rejected">
          <span className="summary-number">{summary.totalRejected}</span>
          <span className="summary-label">Rejected</span>
        </SummaryCard>
      </SummaryGrid>

      <ReportCard>
        <ReportHeader>
          <h3>Department-wise Clearance Summary</h3>
          <p>Detailed breakdown of clearance status by department</p>
        </ReportHeader>
        <ModernTable>
          <thead>
            <tr>
              <th>Department</th>
              <th>Cleared</th>
              <th>Rejected</th>
              <th>Pending</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const total =
                (Number.parseInt(r.cleared) || 0) +
                (Number.parseInt(r.rejected) || 0) +
                (Number.parseInt(r.pending) || 0)
              return (
                <tr key={r.department_code}>
                  <td>
                    <div>
                      <strong style={{ color: "#1e293b" }}>{r.department_name}</strong>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#64748b",
                          fontFamily: "monospace",
                          marginTop: "2px",
                        }}
                      >
                        {r.department_code}
                      </div>
                    </div>
                  </td>
                  <td>
                    <StatBadge type="cleared">{Number.parseInt(r.cleared) || 0}</StatBadge>
                  </td>
                  <td>
                    <StatBadge type="rejected">{Number.parseInt(r.rejected) || 0}</StatBadge>
                  </td>
                  <td>
                    <StatBadge type="pending">{Number.parseInt(r.pending) || 0}</StatBadge>
                  </td>
                  <td>
                    <strong style={{ fontSize: "1.125rem", color: "#1e293b" }}>{total}</strong>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </ModernTable>
      </ReportCard>
    </ReportsContainer>
  )
}
