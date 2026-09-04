import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    scroll-behavior: auto;
    -webkit-text-size-adjust: 100%;
  }

  body {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.typography.fontBody};
    font-size: ${({ theme }) => theme.typography.sizes.base};
    line-height: ${({ theme }) => theme.typography.lineHeights.normal};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
    /* Smooth cross-theme colour transitions */
    transition: background-color 0.35s ease, color 0.35s ease;
  }

  /* Bold scrollbar — on-brand, inverts with mono theme */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${({ theme }) => theme.colors.background}; }
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.text};
    border-radius: 0;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.primary};
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.typography.fontDisplay};
    font-weight: ${({ theme }) => theme.typography.weights.bold};
    line-height: ${({ theme }) => theme.typography.lineHeights.tight};
    color: ${({ theme }) => theme.colors.text};
  }

  p {
    color: ${({ theme }) => theme.colors.textMuted};
    line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
  }

  a { color: inherit; text-decoration: none; }

  button {
    font-family: ${({ theme }) => theme.typography.fontBody};
    cursor: pointer;
    border: none;
    background: none;
    padding: 0;
  }

  ul, ol { list-style: none; }
  img, svg { display: block; max-width: 100%; }
  input, textarea { font-family: ${({ theme }) => theme.typography.fontBody}; }

  /* Focus — thick black outline, brutalist */
  :focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.text};
    outline-offset: 2px;
  }

  /* Selection — yellow highlight */
  ::selection {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text};
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  section[id] {
    scroll-margin-top: 72px;
  }
`
