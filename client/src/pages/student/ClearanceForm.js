//ClearanceForm.js..
"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Field from "../../components/FormField"
import Button from "../../components/Button"
import Card from "../../components/Card"
import api from "../../services/api"
import styled from "styled-components"

const FormContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
`

const LoadingMessage = styled.div`
  text-align: center;
  padding: 32px;
  color: #64748b;
`

const FormCard = styled(Card)`
  padding: 32px;
  background: white;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`

const FormTitle = styled.h2`
  color: #1e293b;
  margin-bottom: 8px;
  font-size: 1.75rem;
  font-weight: 700;
`

const FormSubtitle = styled.p`
  color: #64748b;
  margin-bottom: 24px;
  line-height: 1.6;
`

const StudentInfo = styled.div`
  background: #f1f5f9;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  border-left: 4px solid #3b82f6;

  p {
    margin: 8px 0;
    color: #334155;
    font-weight: 500;
  }
`

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const StyledButton = styled(Button)`
  width: 100%;
  padding: 12px;
  font-weight: 600;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`

const SuccessMessage = styled.div`
  background: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-weight: 500;
`

export default function ClearanceForm() {
  const navigate = useNavigate()
  const [me, setMe] = useState(null)
  const [reason, setReason] = useState("kcse_completion")
  const [reason_other, setReasonOther] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await api.get("/student/me")
        setMe(data)
      } catch (error) {
        console.error("Error loading student data:", error)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const { data } = await api.post("/clearance/start", { reason, reason_other })
      setMessage(`✅ Clearance started successfully! Ref: #${data.id}`)

      setTimeout(() => {
        navigate("/student/status")
      }, 2000)
    } catch (error) {
      console.error("Error submitting clearance:", error)
      setMessage(`❌ Error: ${error?.response?.data?.message || "Failed to start clearance"}`)
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <FormContainer>
        <FormCard>
          <LoadingMessage>Loading your information...</LoadingMessage>
        </FormCard>
      </FormContainer>
    )
  }

  if (!me) {
    return (
      <FormContainer>
        <FormCard>
          <LoadingMessage>Error loading student data. Please try again.</LoadingMessage>
        </FormCard>
      </FormContainer>
    )
  }

  return (
    <FormContainer>
      <FormCard>
        <FormTitle>Student Clearance Request Form</FormTitle>
        <FormSubtitle>Submit your clearance request to begin the process through all departments</FormSubtitle>

        <StudentInfo>
          <p>
            <strong>Name:</strong> {me.full_name}
          </p>
          <p>
            <strong>Admission Number:</strong> {me.admission_number}
          </p>
        </StudentInfo>

        {message &&
          (message.includes("✅") ? (
            <SuccessMessage>{message}</SuccessMessage>
          ) : (
            <div
              style={{
                background: "#f8d7da",
                border: "1px solid #f5c6cb",
                color: "#721c24",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "16px",
                fontWeight: "500",
              }}
            >
              {message}
            </div>
          ))}

        <StyledForm onSubmit={submit}>
          <Field>
            <label>Reason for Clearance</label>
            <select value={reason} onChange={(e) => setReason(e.target.value)}>
              <option value="kcse_completion">KCSE Completion</option>
              <option value="transfer">Transfer</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="other">Other</option>
            </select>
          </Field>
          {reason === "other" && (
            <Field>
              <label>Please specify the reason</label>
              <input
                value={reason_other}
                onChange={(e) => setReasonOther(e.target.value)}
                placeholder="Enter your reason"
                required
              />
            </Field>
          )}
          <StyledButton type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Clearance Request"}
          </StyledButton>
        </StyledForm>
      </FormCard>
    </FormContainer>
  )
}
