import styled from "styled-components"

const Button = styled.button`
  background: ${({ theme, variant = "primary" }) =>
    variant === "primary"
      ? "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
      : variant === "danger"
        ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
        : variant === "secondary"
          ? "#f8fafc"
          : theme.colors[variant]};
  color: ${({ theme, variant = "primary" }) => (variant === "secondary" ? "#475569" : "#ffffff")};
  border: ${({ theme, variant = "primary" }) => (variant === "secondary" ? "2px solid #e2e8f0" : "none")};
  padding: ${({ theme, size = "md" }) => (size === "sm" ? "8px 16px" : size === "lg" ? "16px 32px" : "12px 24px")};
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: ${({ size = "md" }) => (size === "sm" ? "14px" : size === "lg" ? "18px" : "16px")};
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing(1)};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    
    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled { 
    opacity: 0.6; 
    cursor: not-allowed;
    transform: none;
    
    &:hover {
      transform: none;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
  }
`

export default Button
