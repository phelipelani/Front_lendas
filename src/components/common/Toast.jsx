import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }`;
const fadeOut = keyframes`from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(20px); }`;

const ToastWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  z-index: 2000;
  animation: ${fadeIn} 0.3s ease-out forwards;
  
  &.exiting {
    animation: ${fadeOut} 0.3s ease-in forwards;
  }

  ${({ type }) => {
    if (type === 'success') {
      return `background-color: #10b981;`; // Verde
    }
    if (type === 'error') {
      return `background-color: #ef4444;`; // Vermelho
    }
    return `background-color: #3b82f6;`; // Azul (padrão)
  }}
`;

const Toast = ({ message, type, onDone }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDone();
    }, 3000); // O toast some após 3 segundos

    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <ToastWrapper type={type}>
      {message}
    </ToastWrapper>
  );
};

export default Toast;
