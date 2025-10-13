"use client"

import { useEffect, useState } from "react"
import Field from "../../components/FormField"
import Button from "../../components/Button"
import Card from "../../components/Card"
import api from "../../services/api"

export default function ClearanceForm() {
  const [me, setMe] = useState(null)
  const [reason, setReason] = useState("kcse_completion")
  const [reason_other, setReasonOther] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    ;(async () => {
      const { data } = await api.get("/student/me")
      setMe(data)
    })()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    const { data } = await api.post("/clearance/start", { reason, reason_other })
    setMessage(`Clearance started. Ref: #${data.id}`)
  }

  if (!me) return <div>Loading...</div>

  return (
    <Card>
      <h2>Student Clearance Request Form</h2>
      <p>
        <b>Name:</b> {me.full_name} &nbsp; | &nbsp; <b>Admission:</b> {me.admission_number}
      </p>
      <form onSubmit={submit}>
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
            <label>Other (specify)</label>
            <input value={reason_other} onChange={(e) => setReasonOther(e.target.value)} />
          </Field>
        )}
        <Button type="submit">Submit</Button>
      </form>
      {message && <p style={{ color: "green" }}>{message}</p>}
    </Card>
  )
}
