import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const StyledButton = styled.button`
  background-color: transparent;
  color: #facc15;
  font-size: clamp(0.875rem, 2.5vw, 1rem);
  font-weight: bold;
  padding: clamp(8px, 2vw, 10px) clamp(15px, 4vw, 20px);
  border: 2px solid #facc15;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  max-width: 180px;
  min-width: 120px;
  transition: all 0.3s ease;
  margin-top: clamp(15px, 4vw, 20px);

  &:hover {
    background-color: #facc15;
    color: #0a192f;
  }

  @media (max-width: 480px) {
    max-width: 100%;
    min-width: auto;
  }
`;

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <StyledButton onClick={() => navigate(-1)}>
      &larr; Voltar
    </StyledButton>
  );
};

export default BackButton;
