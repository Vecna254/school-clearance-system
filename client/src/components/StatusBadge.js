import styled from "styled-components"

const statusMap = {
  pending: "warning",
  cleared: "success",
  rejected: "danger",
  in_progress: "info",
  completed: "success",
  awaiting_final: "info",
}

const Badge = styled.span`
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  padding: ${({ theme }) => theme.spacing(0.5)} ${({ theme }) => theme.spacing(1.5)};
  border-radius: 999px;
  background: ${({ theme, status }) => theme.colors[statusMap[status] || "secondary"]};
  color: ${({ theme }) => theme.colors.white};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

export default function StatusBadge({ status }) {
  return <Badge status={status}>{status?.replace("_", " ")}</Badge>
}
