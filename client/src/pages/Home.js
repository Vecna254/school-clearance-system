import styled from "styled-components"
import { Link } from "react-router-dom"
import Card from "../components/Card"
import Button from "../components/Button"
import { getUser } from "../services/storage"

const Hero = styled.section`
  position: relative;
  text-align: center;
  padding: ${({ theme }) => theme.spacing(12)} ${({ theme }) => theme.spacing(3)};
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.darkBg} 0%, 
    ${({ theme }) => theme.colors.gray[800]} 50%, 
    ${({ theme }) => theme.colors.primary} 100%);
  border-radius: ${({ theme }) => theme.radius};
  margin-bottom: ${({ theme }) => theme.spacing(6)};
  color: white;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 1;
  }

  > * {
    position: relative;
    z-index: 2;
  }
`

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  background: linear-gradient(135deg, #ffffff, #e2e8f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`

const Subtitle = styled.p`
  font-size: 1.375rem;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  opacity: 0.95;
  font-weight: 300;
`

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing(4)};
  margin: ${({ theme }) => theme.spacing(6)} 0;
  padding: ${({ theme }) => theme.spacing(4)};
  background: white;
  border-radius: ${({ theme }) => theme.radius};
  box-shadow: ${({ theme }) => theme.shadow.lg};
`

const StatCard = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing(3)};
  
  .stat-number {
    font-size: 2.5rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.primary};
    display: block;
  }
  
  .stat-label {
    color: ${({ theme }) => theme.colors.gray[600]};
    font-weight: 500;
    margin-top: ${({ theme }) => theme.spacing(1)};
  }
`

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing(4)};
  margin-top: ${({ theme }) => theme.spacing(6)};
`

const FeatureCard = styled(Card)`
  text-align: left;
  padding: ${({ theme }) => theme.spacing(6)};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${({ theme }) => theme.colors.primary};
    transform: scaleY(0);
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadow.xl};
    
    &::before {
      transform: scaleY(1);
    }
  }
  
  .feature-icon {
    font-size: 3rem;
    margin-bottom: ${({ theme }) => theme.spacing(3)};
    display: block;
  }
  
  h3 {
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: ${({ theme }) => theme.spacing(3)};
    font-size: 1.5rem;
    font-weight: 700;
  }
  
  p {
    color: ${({ theme }) => theme.colors.gray[600]};
    line-height: 1.7;
    font-size: 1.1rem;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(3)};
  justify-content: center;
  flex-wrap: wrap;
  margin-top: ${({ theme }) => theme.spacing(6)};
`

const ModernButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(6)};
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: ${({ theme }) => theme.radius};
  transition: all 0.3s ease;
  box-shadow: ${({ theme }) => theme.shadow.md};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadow.lg};
  }
`

export default function Home() {
  const user = getUser()

  return (
    <div>
      <Hero>
        <Title>Digital School Clearance System</Title>
        <Subtitle>Revolutionizing the clearance process for Kenyan high schools with modern technology</Subtitle>
        <p style={{ fontSize: "1.1rem", opacity: 0.9, marginBottom: "2rem" }}>
          Streamline operations, reduce paperwork, and track progress in real-time
        </p>
        <ButtonGroup>
          {!user ? (
            <>
              <Link to="/register">
                <ModernButton size="lg">Get Started Today</ModernButton>
              </Link>
              <Link to="/login">
                <ModernButton variant="secondary" size="lg">
                  Sign In
                </ModernButton>
              </Link>
            </>
          ) : (
            <>
              {user.role === "student" && (
                <Link to="/student/start">
                  <ModernButton size="lg">Start Your Clearance</ModernButton>
                </Link>
              )}
              {user.role === "hod" && (
                <Link to="/department/dashboard">
                  <ModernButton size="lg">Department Dashboard</ModernButton>
                </Link>
              )}
              {user.role === "admin" && (
                <Link to="/admin/dashboard">
                  <ModernButton size="lg">Admin Dashboard</ModernButton>
                </Link>
              )}
            </>
          )}
        </ButtonGroup>
      </Hero>

      <StatsSection>
        <StatCard>
          <span className="stat-number">98%</span>
          <span className="stat-label">Success Rate</span>
        </StatCard>
        <StatCard>
          <span className="stat-number">75%</span>
          <span className="stat-label">Time Saved</span>
        </StatCard>
        <StatCard>
          <span className="stat-number">24/7</span>
          <span className="stat-label">Available</span>
        </StatCard>
        <StatCard>
          <span className="stat-number">100+</span>
          <span className="stat-label">Schools Served</span>
        </StatCard>
      </StatsSection>

      <Features>
        <FeatureCard>
          <span className="feature-icon">🎓</span>
          <h3>For Students</h3>
          <p>
            Submit clearance requests online and track your progress through each department. No more running around
            campus or waiting in long queues. Get real-time updates and notifications on your clearance status.
          </p>
        </FeatureCard>

        <FeatureCard>
          <span className="feature-icon">🏢</span>
          <h3>For Departments</h3>
          <p>
            Efficiently review student clearances with our intuitive dashboard. Manage outstanding dues, add detailed
            remarks, and approve or reject requests with comprehensive tracking and reporting capabilities.
          </p>
        </FeatureCard>

        <FeatureCard>
          <span className="feature-icon">⚙️</span>
          <h3>For Administrators</h3>
          <p>
            Complete oversight of the entire clearance ecosystem. Manage departments and users, generate comprehensive
            reports, and maintain system integrity with advanced administrative tools and analytics.
          </p>
        </FeatureCard>
      </Features>
    </div>
  )
}
