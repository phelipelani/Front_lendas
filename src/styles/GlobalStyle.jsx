import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Arial', sans-serif;
    background-color: #0a192f;
    background-image: url('https://www.transparenttextures.com/patterns/dark-denim-3.png');
    color: #e6f1ff;
    /* A linha 'overflow: hidden;' foi removida para permitir o scroll */
  }
`;

export default GlobalStyle;