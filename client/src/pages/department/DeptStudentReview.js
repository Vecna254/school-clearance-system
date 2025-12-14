//DeptStudentReview.js..
"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Card from "../../components/Card"
import Button from "../../components/Button"
import api from "../../services/api"
import styled from "styled-components"

const ReviewContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  min-height: calc(100vh - 80px);
`

const StudentHeader = styled.div`
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: white;
  padding: 32px;
  border-radius: 16px;
  margin-bottom: 32px;
  text-align: center;
  
  h1 {
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 8px;
    color: white;
  }
  
  .admission {
    font-family: monospace;
    font-size: 1.125rem;
    opacity: 0.9;
    margin-bottom: 16px;
  }
  
  .department {
    background: rgba(255, 255, 255, 0.1);
    padding: 8px 16px;
    border-radius: 20px;
    display: inline-block;
    font-weight: 600;
  }
`

const StudentInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 32px;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const InfoCard = styled.div`
  background: #f8fafc;
  padding: 16px;
  border-radius: 12px;
  border-left: 4px solid #3b82f6;
  
  label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 6px;
  }
  
  .value {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
  }
`

const FormGrid = styled.div`
  display: grid;
  gap: 24px;
`

const Field = styled.div`
  label {
    display: block;
    font-weight: 600;
    color: #374151;
    margin-bottom: 8px;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  select, textarea, input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    font-size: 16px;
    transition: all 0.2s ease;
    background: white;
    
    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  }
  
  textarea {
    min-height: 120px;
    resize: vertical;
  }
  
  input[type="checkbox"] {
    width: auto;
    margin-right: 8px;
  }
  
  input[type="number"] {
    font-family: monospace;
  }
`

const CheckboxField = styled(Field)`
  label {
    display: flex;
    align-items: center;
    font-weight: 500;
    text-transform: none;
    letter-spacing: normal;
    cursor: pointer;
    
    input {
      margin-right: 12px;
      width: 18px;
      height: 18px;
    }
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 32px;
  
  @media (max-width: 640px) {
    flex-direction: column;
  }
`

const StatusBadge = styled.span`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
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

export default function DeptStudentReview() {
  const { id } = useParams()
  const nav = useNavigate()
  const [item, setItem] = useState(null)
  const [status, setStatus] = useState("pending")
  const [remarks, setRemarks] = useState("")
  const [has_dues, setHasDues] = useState(false)
  const [dues_amount, setDuesAmount] = useState(0)

  useEffect(() => {
    ;(async () => {
      const { data } = await api.get(`/department/step/${id}`)
      setItem(data)
      setStatus(data.status)
      setRemarks(data.remarks || "")
      setHasDues(Boolean(data.has_dues))
      setDuesAmount(data.dues_amount || 0)
    })()
  }, [id])

  const save = async (newStatus) => {
    await api.post(`/department/step/${id}/decision`, {
      status: newStatus || status,
      remarks,
      has_dues,
      dues_amount,
      user_id: item?.cleared_by_user_id,
    })
    nav("/department/dashboard")
  }

  if (!item)
    return (
      <ReviewContainer>
        <Card style={{ textAlign: "center", padding: "48px" }}>
          <div style={{ fontSize: "18px", color: "#64748b" }}>Loading student details...</div>
        </Card>
      </ReviewContainer>
    )

  return (
    <ReviewContainer>
      <StudentHeader>
        <h1>{item.full_name}</h1>
        <div className="admission">{item.admission_number}</div>
        <div className="department">{item.department_name}</div>
      </StudentHeader>

      <StudentInfoGrid>
        <InfoCard>
          <label>Clearance Reason</label>
          <div className="value">{item.reason || "N/A"}</div>
        </InfoCard>
        <InfoCard>
          <label>Request Status</label>
          <div className="value" style={{ textTransform: "capitalize" }}>
            {item.clearance_status || "N/A"}
          </div>
        </InfoCard>
        <InfoCard>
          <label>Requested On</label>
          <div className="value">{item.submitted_at ? new Date(item.submitted_at).toLocaleDateString() : "N/A"}</div>
        </InfoCard>
        <InfoCard>
          <label>Current Review Status</label>
          <StatusBadge status={status}>{status}</StatusBadge>
        </InfoCard>
      </StudentInfoGrid>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ margin: 0 }}>Department Decision</h2>
          <StatusBadge status={status}>{status}</StatusBadge>
        </div>

        <FormGrid>
          <Field>
            <label>Clearance Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="pending">Pending Review</option>
              <option value="cleared">Cleared</option>
              <option value="rejected">Rejected</option>
            </select>
          </Field>

          <Field>
            <label>Remarks & Comments</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add any comments or reasons for your decision..."
            />
          </Field>

          <CheckboxField>
            <label>
              <input type="checkbox" checked={has_dues} onChange={(e) => setHasDues(e.target.checked)} />
              Student has outstanding dues
            </label>
          </CheckboxField>

          {has_dues && (
            <Field>
              <label>Outstanding Dues Amount (KSh)</label>
              <input
                type="number"
                value={dues_amount}
                onChange={(e) => setDuesAmount(Number(e.target.value))}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </Field>
          )}
        </FormGrid>

        <ButtonGroup>
          <Button onClick={() => save("cleared")} size="lg">
            ✓ Mark as Cleared
          </Button>
          <Button variant="danger" onClick={() => save("rejected")} size="lg">
            ✗ Reject Clearance
          </Button>
          <Button variant="secondary" onClick={() => save("pending")} size="lg">
            💾 Save as Pending
          </Button>
        </ButtonGroup>
      </Card>
    </ReviewContainer>
  )
}
