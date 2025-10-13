import styled from "styled-components"

const Page = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing(3)};
  min-height: calc(100vh - 80px);
`

export default Page
