import { Link } from "react-router-dom"
import styled from "styled-components"
import Card from "../../components/Card"
import Button from "../../components/Button"

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`

const HeroCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing(8)};
  text-align: center;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.accent});
  color: white;
  border: none;
  box-shadow: ${({ theme }) => theme.shadow.xl};
  margin-bottom: ${({ theme }) => theme.spacing(6)};
`

const ContentCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing(6)};
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`

const Title = styled.h2`
  color: white;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  font-size: 2.5rem;
  font-weight: 800;
`

const Description = styled.p`
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.7;
  margin-bottom: ${({ theme }) => theme.spacing(4)};
  font-size: 1.125rem;
`

const ProcessSection = styled.div`
  margin: ${({ theme }) => theme.spacing(4)} 0;
`

const StepsList = styled.ol`
  margin: ${({ theme }) => theme.spacing(4)} 0;
  padding: 0;
  list-style: none;
  counter-reset: step-counter;
  
  li {
    counter-increment: step-counter;
    margin-bottom: ${({ theme }) => theme.spacing(3)};
    padding: ${({ theme }) => theme.spacing(3)};
    background: ${({ theme }) => theme.colors.gray[50]};
    border-radius: ${({ theme }) => theme.radius};
    border-left: 4px solid ${({ theme }) => theme.colors.primary};
    position: relative;
    color: ${({ theme }) => theme.colors.gray[700]};
    line-height: 1.6;

    &::before {
      content: counter(step-counter);
      position: absolute;
      left: -2px;
      top: -2px;
      background: ${({ theme }) => theme.colors.primary};
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      font-weight: 700;
    }

    strong {
      color: ${({ theme }) => theme.colors.text};
    }
  }
`

const ImportantNote = styled.div`
  padding: ${({ theme }) => theme.spacing(4)};
  background: ${({ theme }) => theme.colors.warning}20;
  border: 1px solid ${({ theme }) => theme.colors.warning};
  border-radius: ${({ theme }) => theme.radius};
  margin: ${({ theme }) => theme.spacing(4)} 0;

  h4 {
    color: ${({ theme }) => theme.colors.warning};
    margin: 0 0 ${({ theme }) => theme.spacing(2)} 0;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing(2)};
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.gray[700]};
    line-height: 1.6;
  }
`

const CTASection = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing(4)};
  background: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.radius};
`

const ModernButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(8)};
  font-size: 1.25rem;
  font-weight: 700;
  border-radius: ${({ theme }) => theme.radius};
  transition: all 0.3s ease;
  box-shadow: ${({ theme }) => theme.shadow.lg};

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${({ theme }) => theme.shadow.xl};
  }
`

export default function StartClearance() {
  return (
    <Container>
      <HeroCard>
        <Title>Start Your Digital Clearance Journey</Title>
        <Description>
          Welcome to the future of school clearance! Our streamlined digital process eliminates the hassle of running
          between departments and waiting in long queues.
        </Description>
      </HeroCard>

      <ContentCard>
        <ProcessSection>
          <h3 style={{ color: "#1e293b", marginBottom: "1.5rem", fontSize: "1.5rem" }}>📋 How the Process Works</h3>
          <StepsList>
            <li>
              <strong>Submit Your Request:</strong> Fill out the comprehensive clearance form with your personal and
              academic details. Ensure all information is accurate and complete.
            </li>
            <li>
              <strong>Automatic Distribution:</strong> Your request is instantly sent to all relevant departments
              including Library, Accounts, Sports, Hostel, and Academic offices.
            </li>
            <li>
              <strong>Department Review:</strong> Each department reviews your clearance status, checks for outstanding
              dues, and provides their approval or feedback.
            </li>
            <li>
              <strong>Real-time Tracking:</strong> Monitor your progress through our intuitive dashboard. Get instant
              notifications when departments update your status.
            </li>
            <li>
              <strong>Final Approval & Certificate:</strong> Once all departments clear you, receive final approval and
              download your official clearance certificate.
            </li>
          </StepsList>
        </ProcessSection>

        <ImportantNote>
          <h4>⚠️ Important Information</h4>
          <p>
            <strong>Before submitting:</strong> Ensure all your information is accurate and up-to-date. You may need to
            settle any outstanding dues with departments before receiving clearance. The process typically takes 3-5
            business days depending on department response times.
          </p>
        </ImportantNote>

        <CTASection>
          <h4 style={{ color: "#1e293b", marginBottom: "1rem" }}>Ready to Begin?</h4>
          <p style={{ color: "#64748b", marginBottom: "2rem" }}>
            Start your clearance request now and experience the convenience of our digital system.
          </p>
          <Link to="/student/form">
            <ModernButton size="lg">🚀 Start Clearance Request</ModernButton>
          </Link>
        </CTASection>
      </ContentCard>
    </Container>
  )
}
