import styled from "styled-components"

const Table = styled.table`
  width: 100%; 
  border-collapse: collapse; 
  background: #ffffff; 
  border-radius: 12px; 
  overflow: hidden;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  
  thead { 
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  }
  
  th, td { 
    padding: ${({ theme }) => theme.spacing(3)}; 
    border-bottom: 1px solid #e2e8f0; 
    text-align: left; 
  }
  
  th {
    font-weight: 700;
    color: #1e293b;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    position: relative;
  }
  
  td {
    color: #475569;
    font-weight: 500;
  }
  
  tbody tr {
    transition: all 0.2s ease;
    
    &:hover {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      transform: scale(1.01);
    }
    
    &:last-child td {
      border-bottom: none;
    }
  }

  a {
    color: #3b82f6;
    font-weight: 600;
    text-decoration: none;
    padding: 6px 12px;
    border-radius: 8px;
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    transition: all 0.2s ease;
    
    &:hover {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      color: white;
      transform: translateY(-1px);
    }
  }
`

export default Table
