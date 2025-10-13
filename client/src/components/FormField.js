import styled from "styled-components"

const Field = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  
  label { 
    display: block; 
    font-weight: 600; 
    margin-bottom: ${({ theme }) => theme.spacing(1)};
    color: ${({ theme }) => theme.colors.text};
  }
  
  input, select, textarea {
    width: 100%;
    padding: ${({ theme }) => theme.spacing(1.5)};
    border-radius: ${({ theme }) => theme.radius};
    border: 1px solid ${({ theme }) => theme.colors.gray[300]};
    background: ${({ theme }) => theme.colors.white};
    font-size: 16px;
    transition: border-color 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
    }
  }
  
  textarea {
    resize: vertical;
    min-height: 100px;
  }
`

export default Field
