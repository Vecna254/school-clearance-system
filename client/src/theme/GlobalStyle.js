import { createGlobalStyle } from "styled-components"

const GlobalStyle = createGlobalStyle`
  * { 
    box-sizing: border-box; 
    margin: 0;
    padding: 0;
  }
  
  html, body, #root { 
    height: 100%; 
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.gray[50]};
    line-height: 1.6;
  }
  
  a { 
    text-decoration: none; 
    color: inherit; 
  }
  
  button {
    font-family: inherit;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  input, textarea, select {
    font-family: inherit;
    transition: all 0.2s ease;
  }

  /* Added smooth scrolling and improved focus styles */
  html {
    scroll-behavior: smooth;
  }

  *:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  /* Custom scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.gray[100]};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray[400]};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.gray[500]};
  }
`

export default GlobalStyle
