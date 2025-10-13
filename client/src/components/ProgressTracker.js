import styled from "styled-components"
import StatusBadge from "./StatusBadge"

const Wrap = styled.div`
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
  gap: ${({ theme }) => theme.spacing(2)};
`

const Item = styled.div`
  background: ${({ theme }) => theme.colors.white}; 
  border: 1px solid ${({ theme }) => theme.colors.gray[200]}; 
  border-radius: ${({ theme }) => theme.radius}; 
  padding: ${({ theme }) => theme.spacing(2)};
  
  h4 {
    margin-bottom: ${({ theme }) => theme.spacing(1)};
    color: ${({ theme }) => theme.colors.text};
  }
  
  .status-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${({ theme }) => theme.spacing(1)};
  }
  
  small { 
    color: ${({ theme }) => theme.colors.gray[600]}; 
  }
`

export default function ProgressTracker({ steps = [] }) {
  return (
    <Wrap>
      {steps.map((step) => (
        <Item key={step.department_code}>
          <h4>{step.department_name}</h4>
          <div className="status-row">
            <small>Status:</small>
            <StatusBadge status={step.status} />
          </div>
          {step.remarks && (
            <div>
              <small>Remarks:</small>
              <p>{step.remarks}</p>
            </div>
          )}
          {step.has_dues && (
            <div>
              <small>Dues: KSh {step.dues_amount}</small>
            </div>
          )}
        </Item>
      ))}
    </Wrap>
  )
}
