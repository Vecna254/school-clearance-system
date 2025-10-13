import styled, { keyframes } from "styled-components"

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

const Dot = styled.div`
  width: 32px; 
  height: 32px; 
  border-radius: 50%; 
  border: 3px solid ${({ theme }) => theme.colors.gray[300]}; 
  border-top-color: ${({ theme }) => theme.colors.primary}; 
  animation: ${spin} 1s linear infinite; 
  margin: ${({ theme }) => theme.spacing(3)} auto;
`

export default function Loader() {
  return <Dot aria-label="Loading" />
}
