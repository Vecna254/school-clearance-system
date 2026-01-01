//ClearanceStatus.js...
"use client"

import { useEffect, useState } from "react"
import styled from "styled-components"
import Card from "../../components/Card"
import ProgressTracker from "../../components/ProgressTracker"
import StatusBadge from "../../components/StatusBadge"
import Button from "../../components/Button"
import api from "../../services/api"

const StatusContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  display: grid;
  gap: ${({ theme }) => theme.spacing(4)};
`

const HeaderCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing(6)};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.accent});
  color: white;
  text-align: center;
  border: none;
  box-shadow: ${({ theme }) => theme.shadow.xl};
`

const StatusCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing(5)};
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadow.lg};
`

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`

const InfoItem = styled.div`
  .label {
    font-size: 0.875rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.gray[600]};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: ${({ theme }) => theme.spacing(1)};
  }

  .value {
    font-size: 1.125rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
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
    margin: 0 0 ${({ theme }) => theme.spacing(2)} 0;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing(2)};
  }

  p {
    margin: 0;
    line-height: 1.6;
  }
`

const ModernButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(6)};
  border-radius: ${({ theme }) => theme.radius};
  font-weight: 700;
  font-size: 1.125rem;
  transition: all 0.3s ease;
  box-shadow: ${({ theme }) => theme.shadow.md};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadow.lg};
  }
`

const DepartmentTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: ${({ theme }) => theme.spacing(4)};
  border-radius: ${({ theme }) => theme.radius};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow.md};
`

const TableHeader = styled.th`
  text-align: left;
  padding: ${({ theme }) => theme.spacing(3)};
  background: ${({ theme }) => theme.colors.gray[50]};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[700]};
  
  &:first-child {
    border-top-left-radius: ${({ theme }) => theme.radius};
  }
  
  &:last-child {
    border-top-right-radius: ${({ theme }) => theme.radius};
  }
`

const TableRow = styled.tr`
  background: ${({ status, theme }) =>
    status === "cleared" ? "#f0fdf4" : status === "rejected" ? "#fef2f2" : "white"};
  
  &:hover {
    background: ${({ status, theme }) =>
      status === "cleared" ? "#e6f7eb" : status === "rejected" ? "#fee5e5" : theme.colors.gray[50]};
  }
`

const TableCell = styled.td`
  padding: ${({ theme }) => theme.spacing(3)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  vertical-align: top;
  word-wrap: break-word;
  word-break: break-word;
  
  &:first-child {
    border-left: 2px solid ${({ status, theme }) =>
      status === "cleared" ? theme.colors.success : status === "rejected" ? theme.colors.danger : "transparent"};
  }
  
  &:last-child {
    max-width: 300px;
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

export default function ClearanceStatus() {
  const [clearance, setClearance] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await api.get("/clearance/my-latest")
        setClearance(data)
      } catch (error) {
        console.error("Error loading clearance:", error)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const downloadCertificate = async () => {
    try {
      const response = await api.get(`/clearance/${clearance.id}/certificate`, {
        responseType: "blob",
      })

      const blob = new Blob([response.data], { type: "application/pdf" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `clearance_${clearance.admission_number}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading certificate:", error)
      alert("Error downloading certificate. Please try again.")
    }
  }

  if (loading) return <LoadingSpinner />

  if (!clearance || !clearance.id)
    return (
      <StatusContainer>
        <StatusCard>
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <h3 style={{ color: "#64748b", marginBottom: "1rem" }}>No Clearance Request Found</h3>
            <p style={{ color: "#94a3b8" }}>You haven't submitted a clearance request yet.</p>
          </div>
        </StatusCard>
      </StatusContainer>
    )

  const clearedCount = clearance.departments?.filter((d) => d.status === "cleared").length || 0
  const totalCount = clearance.departments?.length || 0
  const rejectedCount = clearance.departments?.filter((d) => d.status === "rejected").length || 0

  return (
    <StatusContainer>
      <HeaderCard>
        <h1 style={{ margin: "0 0 1rem 0", fontSize: "2rem" }}>Clearance Status</h1>
        <p style={{ margin: 0, fontSize: "1.125rem", opacity: 0.9 }}>Track your clearance progress in real-time</p>
      </HeaderCard>

      <StatusCard>
        <InfoGrid>
          <InfoItem>
            <div className="label">Admission Number</div>
            <div className="value">{clearance.admission_number}</div>
          </InfoItem>
          <InfoItem>
            <div className="label">Current Status</div>
            <div className="value">
              <StatusBadge status={clearance.status} />
            </div>
          </InfoItem>
          <InfoItem>
            <div className="label">Submitted Date</div>
            <div className="value">{new Date(clearance.submitted_at).toLocaleDateString()}</div>
          </InfoItem>
          <InfoItem>
            <div className="label">Progress</div>
            <div className="value">
              {clearedCount}/{totalCount} Departments
            </div>
          </InfoItem>
        </InfoGrid>

        {clearance.status === "awaiting_final" && (
          <AlertCard variant="warning">
            <h4>🎓 Awaiting Final Approval</h4>
            <p>
              Congratulations! All departments have cleared you. Your clearance is now awaiting final approval from the
              Admin.
            </p>
          </AlertCard>
        )}

        {clearance.status === "completed" && (
          <AlertCard variant="success">
            <h4>✅ Clearance Completed!</h4>
            <p>Your clearance has been fully approved. You can now download your clearance certificate.</p>
            <div style={{ marginTop: "1rem" }}>
              <ModernButton
                onClick={downloadCertificate}
                style={{
                  backgroundColor: "#10b981",
                  color: "white",
                }}
              >
                📄 Download Certificate
              </ModernButton>
            </div>
          </AlertCard>
        )}

        <ProgressTracker cleared={clearedCount} total={totalCount} rejected={rejectedCount} />
      </StatusCard>

      {clearance.departments && (
        <StatusCard>
          <h3 style={{ marginBottom: "1.5rem", color: "#1e293b" }}>Department Status Details</h3>
          <DepartmentTable>
            <thead>
              <tr>
                <TableHeader>Department</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Remarks</TableHeader>
              </tr>
            </thead>
            <tbody>
              {clearance.departments.map((dept) => (
                <TableRow key={dept.id} status={dept.status}>
                  <TableCell status={dept.status}>
                    {dept.department_name}
                    {dept.has_dues && (
                      <div style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#dc2626" }}>
                        💰 Outstanding Dues: KSh {dept.dues_amount?.toLocaleString()}
                      </div>
                    )}
                  </TableCell>
                  <TableCell status={dept.status}>
                    <StatusBadge status={dept.status} />
                  </TableCell>
                  <TableCell status={dept.status}>
                    {dept.remarks || "—"}
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </DepartmentTable>
        </StatusCard>
      )}
    </StatusContainer>
  )
}