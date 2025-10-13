"use client"

import { useEffect, useState } from "react"
import styled from "styled-components"

const Wrap = styled.div`
  position: fixed; 
  right: ${({ theme }) => theme.spacing(2)}; 
  bottom: ${({ theme }) => theme.spacing(2)}; 
  background: ${({ theme }) => theme.colors.dark}; 
  color: ${({ theme }) => theme.colors.white}; 
  padding: ${({ theme }) => theme.spacing(2)}; 
  border-radius: ${({ theme }) => theme.radius};
  box-shadow: ${({ theme }) => theme.shadow};
  z-index: 1000;
`

export default function Toast({ message, onClose, timeout = 3000 }) {
  const [open, setOpen] = useState(Boolean(message))

  useEffect(() => {
    if (message) {
      setOpen(true)
      const timer = setTimeout(() => {
        setOpen(false)
        onClose && onClose()
      }, timeout)
      return () => clearTimeout(timer)
    }
  }, [message, onClose, timeout])

  if (!open || !message) return null

  return <Wrap role="status">{message}</Wrap>
}
