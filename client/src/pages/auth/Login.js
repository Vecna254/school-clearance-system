//login.js
"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Field from "../../components/FormField"
import Button from "../../components/Button"
import Card from "../../components/Card"
import { login } from "../../services/auth"
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

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 420px;
  padding: ${({ theme }) => theme.spacing(4)};
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
`

const Title = styled.h2`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  color: #1e293b;
  font-size: 2rem;
  font-weight: 700;
`

const Subtitle = styled.p`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing(4)};
  color: #64748b;
  font-size: 1rem;
`

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.danger}15, ${({ theme }) => theme.colors.danger}10);
  padding: ${({ theme }) => theme.spacing(2)};
  border-radius: 12px;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  border: 1px solid ${({ theme }) => theme.colors.danger}30;
  font-weight: 500;
  text-align: center;
`

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`

const StyledField = styled(Field)`
  label {
    font-weight: 600;
    color: #374151;
    margin-bottom: ${({ theme }) => theme.spacing(1)};
    display: block;
  }
  
  input {
    width: 100%;
    padding: ${({ theme }) => theme.spacing(2.5)};
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
  margin-top: ${({ theme }) => theme.spacing(4)};
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

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { token, user } = await login(email, password)
      saveToken(token)
      saveUser(user)

      if (user.role === "student") navigate("/student/start")
      else if (user.role === "hod") navigate("/department/dashboard")
      else navigate("/admin/dashboard")
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <LoginCard>
        <Title>Welcome Back</Title>
        <Subtitle>Sign in to your clearance account</Subtitle>
        <StyledForm onSubmit={onSubmit}>
          <StyledField>
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </StyledField>
          <StyledField>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </StyledField>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <StyledButton type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </StyledButton>
        </StyledForm>
        <LinkText>
          Don't have an account? <Link to="/register">Register as Student</Link>
        </LinkText>
      </LoginCard>
    </Container>
  )
}
