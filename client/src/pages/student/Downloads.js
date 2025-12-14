//Downloads.js..
"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Card from "../../components/Card"
import Button from "../../components/Button"
import api from "../../services/api"
import styled from "styled-components"

const DownloadsContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
  min-height: calc(100vh - 80px);
`

const StatusCard = styled(Card)`
  text-align: center;
  background: ${({ status }) =>
    status === "completed"
      ? "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)"
      : status === "awaiting_final"
        ? "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)"
        : status === "in_progress"
          ? "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)"
          : "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)"};
  
  .icon {
    font-size: 4rem;
    margin-bottom: 16px;
  }
  
  h2 {
    color: ${({ status }) =>
      status === "completed"
        ? "#065f46"
        : status === "awaiting_final"
          ? "#92400e"
          : status === "in_progress"
            ? "#1e3a8a"
            : "#7f1d1d"};
    margin-bottom: 16px;
  }
  
  p {
    color: ${({ status }) =>
      status === "completed"
        ? "#047857"
        : status === "awaiting_final"
          ? "#78350f"
          : status === "in_progress"
            ? "#1e40af"
            : "#991b1b"};
    font-size: 1.125rem;
    margin-bottom: 24px;
  }
`

const CertificatePreview = styled.div`
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: white;
  padding: 32px;
  border-radius: 16px;
  margin-bottom: 24px;
  text-align: center;
  
  .certificate-icon {
    font-size: 3rem;
    margin-bottom: 16px;
    opacity: 0.9;
  }
  
  h3 {
    color: white;
    margin-bottom: 8px;
    font-size: 1.5rem;
  }
  
  .student-info {
    opacity: 0.8;
    font-size: 1.125rem;
    margin-bottom: 16px;
  }
  
  .download-info {
    background: rgba(255, 255, 255, 0.1);
    padding: 16px;
    border-radius: 12px;
    font-size: 14px;
    opacity: 0.9;
  }
`

const LoadingCard = styled(Card)`
  text-align: center;
  padding: 48px;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e5e7eb;
    border-top: 4px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 16px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const ModernButton = styled(Button)`
  padding: 12px 24px;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
  }
`

export default function Downloads() {
  const [latest, setLatest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await api.get("/clearance/my-latest")
        setLatest(data)
      } catch (error) {
        console.error("Error fetching clearance data:", error)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const download = async () => {
    setDownloading(true)
    try {
      const res = await api.get(`/clearance/${latest.id}/certificate`, {
        responseType: "blob",
      })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement("a")
      a.href = url
      a.download = `clearance_certificate_${latest.admission_number}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading certificate:", error)
      alert("Error downloading certificate. Please try again.")
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <DownloadsContainer>
        <LoadingCard>
          <div className="spinner"></div>
          <h3>Loading your clearance status...</h3>
          <p style={{ color: "#64748b" }}>Please wait while we fetch your information</p>
        </LoadingCard>
      </DownloadsContainer>
    )
  }

  if (!latest || !latest.id) {
    return (
      <DownloadsContainer>
        <StatusCard status="new">
          <div className="icon">📋</div>
          <h2>No Clearance Started Yet</h2>
          <p>You haven't started the clearance process yet.</p>
          <Link to="/student/start">
            <ModernButton size="lg" style={{ backgroundColor: "#ef4444", color: "white" }}>
              🚀 Start Your Clearance
            </ModernButton>
          </Link>
        </StatusCard>
      </DownloadsContainer>
    )
  }

  if (latest.status === "in_progress") {
    return (
      <DownloadsContainer>
        <StatusCard status="in_progress">
          <div className="icon">⏳</div>
          <h2>Clearance In Progress</h2>
          <p>Your clearance is currently being processed by all departments.</p>
          <p style={{ fontSize: "1rem", opacity: 0.8 }}>
            Progress:{" "}
            <strong>
              {latest.departments?.filter((d) => d.status === "cleared").length || 0}/{latest.departments?.length || 0}{" "}
              departments cleared
            </strong>
          </p>
          <Link to="/student/status">
            <ModernButton size="lg" style={{ backgroundColor: "#3b82f6", color: "white" }}>
              📊 View Detailed Status
            </ModernButton>
          </Link>
        </StatusCard>
      </DownloadsContainer>
    )
  }

  if (latest.status === "awaiting_final") {
    return (
      <DownloadsContainer>
        <StatusCard status="awaiting_final">
          <div className="icon">⏳</div>
          <h2>Awaiting Final Approval</h2>
          <p>All departments have cleared you! Your clearance is now awaiting final approval from the Principal.</p>
          <Link to="/student/status">
            <ModernButton size="lg" style={{ backgroundColor: "#f59e0b", color: "white" }}>
              📊 View Status
            </ModernButton>
          </Link>
        </StatusCard>
      </DownloadsContainer>
    )
  }

  if (latest.status === "rejected") {
    return (
      <DownloadsContainer>
        <StatusCard status="rejected">
          <div className="icon">❌</div>
          <h2>Clearance Rejected</h2>
          <p>
            Your clearance request was rejected by one or more departments. Please review the feedback and resubmit.
          </p>
          <Link to="/student/start">
            <ModernButton size="lg" style={{ backgroundColor: "#ef4444", color: "white" }}>
              🔄 Start New Clearance
            </ModernButton>
          </Link>
        </StatusCard>
      </DownloadsContainer>
    )
  }

  return (
    <DownloadsContainer>
      <div style={{ marginBottom: "32px", textAlign: "center" }}>
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
          Download Certificate
        </h1>
        <p style={{ color: "#64748b", fontSize: "1.125rem" }}>Your clearance has been completed successfully</p>
      </div>

      <StatusCard status="completed">
        <div className="icon">🎉</div>
        <h2>Clearance Completed!</h2>
        <p>Congratulations! Your clearance has been approved by all departments and the Principal.</p>
      </StatusCard>

      <CertificatePreview>
        <div className="certificate-icon">📜</div>
        <h3>Clearance Certificate</h3>
        <div className="student-info">Admission Number: {latest.admission_number}</div>
        <div className="download-info">
          This certificate confirms that you have successfully completed all clearance requirements
        </div>
      </CertificatePreview>

      <div style={{ textAlign: "center" }}>
        <ModernButton
          onClick={download}
          size="lg"
          disabled={downloading}
          style={{ minWidth: "200px", backgroundColor: "#10b981", color: "white" }}
        >
          {downloading ? "Downloading..." : "📥 Download PDF Certificate"}
        </ModernButton>
      </div>
    </DownloadsContainer>
  )
}
