import React from 'react';
import styled from 'styled-components';
import Button from './Button';

const ModalOverlay = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(5px);
  display: flex; justify-content: center; align-items: center;
  z-index: 1002;
`;

const ModalContent = styled.div`
  background-color: #0a192f;
  padding: clamp(25px, 6vw, 40px);
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  min-width: 280px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid #facc15;
  text-align: center;

  @media (max-width: 480px) {
    width: 95%;
    padding: 25px 20px;
  }

  @media (max-height: 600px) {
    padding: 20px;
    max-height: 85vh;
  }
`;

const ModalTitle = styled.h2`
  color: #e6f1ff;
  font-size: clamp(1.25rem, 4vw, 1.8rem);
  margin-bottom: clamp(20px, 5vw, 30px);
`;

const ModalMessage = styled.p`
  color: #e6f1ff;
  font-size: clamp(0.875rem, 2.5vw, 1rem);
  margin-bottom: clamp(20px, 5vw, 30px);
  line-height: 1.5;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: clamp(10px, 3vw, 20px);
    flex-wrap: wrap;

    @media (max-width: 480px) {
      flex-direction: column;
      gap: 15px;
    }
`;

const ConfirmacaoModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalTitle>{title}</ModalTitle>
        <ModalMessage>{message}</ModalMessage>
        <ButtonContainer>
            <Button onClick={onConfirm} style={{backgroundColor: '#10b981'}}>Confirmar</Button>
            <Button onClick={onClose} style={{backgroundColor: '#6b7280'}}>Cancelar</Button>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ConfirmacaoModal;
