import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex; justify-content: center; align-items: center;
  z-index: 1001; /* Acima do outro modal */
`;

const ModalContent = styled.div`
  background-color: rgba(10, 25, 47, 0.9);
  padding: 30px; border-radius: 12px; width: 90%;
  max-width: 400px; border: 1px solid #facc15;
`;

const ModalTitle = styled.h2`
  color: #e6f1ff; text-align: center; margin-bottom: 25px; font-size: 1.5rem;
`;

const JogadorList = styled.div`
  max-height: 50vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const JogadorButton = styled.button`
  width: 100%;
  background-color: #0a192f;
  color: #e6f1ff;
  border: 1px solid #facc15;
  padding: 12px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #172a45;
  }
`;

const SubstituirJogadorModal = ({ isOpen, onClose, onSelectSub, jogadoresDisponiveis, jogadorASubstituir }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalTitle>Substituir: {jogadorASubstituir?.nome}</ModalTitle>
        <JogadorList>
          {jogadoresDisponiveis.length > 0 ? (
            jogadoresDisponiveis.map(jogador => (
              <JogadorButton key={jogador.id} onClick={() => onSelectSub(jogador)}>
                {jogador.nome} (Nível: {jogador.nivel})
              </JogadorButton>
            ))
          ) : (
            <p style={{textAlign: 'center'}}>Nenhum jogador disponível para substituição.</p>
          )}
        </JogadorList>
      </ModalContent>
    </ModalOverlay>
  );
};

export default SubstituirJogadorModal;
