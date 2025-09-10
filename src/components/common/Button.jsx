import styled from 'styled-components';

const Button = styled.button`
  background-color: #facc15; /* Amarelo/Dourado baseado nos prints */
  color: #0a192f; /* Cor de texto escura para contraste */
  font-size: clamp(1rem, 3vw, 1.2rem);
  font-weight: bold;
  padding: clamp(12px, 3vw, 15px) clamp(20px, 5vw, 30px);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  width: 100%;
  max-width: 280px;
  min-width: 200px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #fde047;
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }

  /* Breakpoints para diferentes tamanhos de tela */
  @media (max-width: 480px) {
    max-width: 100%;
    min-width: auto;
    font-size: 1rem;
    padding: 12px 20px;
  }

  @media (min-width: 768px) {
    max-width: 300px;
  }

  @media (min-width: 1024px) {
    max-width: 320px;
  }
`;

export default Button;