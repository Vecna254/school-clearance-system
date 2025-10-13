"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Field from "../../components/FormField"
import Button from "../../components/Button"
import Card from "../../components/Card"
import { registerStudent } from "../../services/auth"
import { saveToken, saveUser } from "../../services/storage"
import styled from "styled-components"

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing(2)};
`

const RegisterCard = styled(Card)`
  width: 100%;
  max-width: 700px;
  padding: ${({ theme }) => theme.spacing(3)};
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
`

const Title = styled.h2`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing(1.5)};
  color: #1e293b;
  font-size: 2rem;
  font-weight: 700;
`

const Subtitle = styled.p`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing(2.5)};
  color: #64748b;
  font-size: 1rem;
`

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`

const StyledField = styled(Field)`
  label {
    font-weight: 600;
    color: #374151;
    margin-bottom: ${({ theme }) => theme.spacing(0.5)};
    display: block;
  }
  
  input {
    width: 100%;
    padding: ${({ theme }) => theme.spacing(2)};
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: white;
    
    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    &::placeholder {
      color: #9ca3af;
    }
  }
`

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.danger}15, ${({ theme }) => theme.colors.danger}10);
  padding: ${({ theme }) => theme.spacing(2)};
  border-radius: 12px;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  border: 1px solid ${({ theme }) => theme.colors.danger}30;
  font-weight: 500;
  text-align: center;
`

const StyledButton = styled(Button)`
  width: 100%;
  padding: ${({ theme }) => theme.spacing(3)};
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.25);
    background: linear-gradient(135deg, #2563eb, #1e40af);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`

const LinkText = styled.p`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing(3)};
  color: #64748b;
  font-size: 0.95rem;
  
  a {
    color: #3b82f6;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: #1d4ed8;
      text-decoration: underline;
    }
  }
`

export default function RegisterStudent() {
  const [form, setForm] = useState({
    full_name: "",
    admission_number: "",
    kcse_year: "",
    class_form: "",
    stream: "",
    phone: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { token, user } = await registerStudent(form)
      saveToken(token)
      saveUser(user)
      navigate("/student/start")
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <RegisterCard>
        <Title>Student Registration</Title>
        <Subtitle>Create your clearance account to get started</Subtitle>
        <StyledForm onSubmit={onSubmit}>
          <FormGrid>
            <StyledField>
              <label>Full Name *</label>
              <input name="full_name" value={form.full_name} onChange={onChange} placeholder="John Doe" required />
            </StyledField>
            <StyledField>
              <label>Admission Number *</label>
              <input
                name="admission_number"
                value={form.admission_number}
                onChange={onChange}
                placeholder="ADM001"
                required
              />
            </StyledField>
            <StyledField>
              <label>KCSE Year</label>
              <input name="kcse_year" type="number" value={form.kcse_year} onChange={onChange} placeholder="2024" />
            </StyledField>
            <StyledField>
              <label>Class/Form</label>
              <input name="class_form" value={form.class_form} onChange={onChange} placeholder="Form 4" />
            </StyledField>
            <StyledField>
              <label>Stream</label>
              <input name="stream" value={form.stream} onChange={onChange} placeholder="A" />
            </StyledField>
            <StyledField>
              <label>Phone Number</label>
              <input name="phone" value={form.phone} onChange={onChange} placeholder="+254700000000" />
            </StyledField>
          </FormGrid>

          <StyledField>
            <label>Email Address *</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              placeholder="john@example.com"
              required
            />
          </StyledField>
          <StyledField>
            <label>Password *</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              placeholder="••••••••"
              required
            />
          </StyledField>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          <StyledButton type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </StyledButton>
        </StyledForm>
        <LinkText>
          Already have an account? <Link to="/login">Sign In</Link>
        </LinkText>
      </RegisterCard>
    </Container>
  )
}
