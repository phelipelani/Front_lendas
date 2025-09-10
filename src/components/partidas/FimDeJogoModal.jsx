import React from 'react';
import styled from 'styled-components';
import Button from '../common/Button';

const ModalOverlay = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(5px);
  display: flex; justify-content: center; align-items: center;
  z-index: 1002;
`;

const ModalContent = styled.div`
  background-color: #0a192f;
  padding: 40px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  border: 2px solid ${props => props.borderColor || '#facc15'};
  text-align: center;
  box-shadow: 0 0 30px ${props => props.borderColor || '#facc15'};
`;

const VencedorText = styled.h2`
  color: #e6f1ff;
  font-size: 2.5rem;
  font-family: 'Oswald', sans-serif;
  margin-bottom: 30px;
`;

const FimDeJogoModal = ({ isOpen, onProximaPartida, vencedorInfo }) => {
  if (!isOpen) return null;

  const getVencedorMessage = () => {
    if (!vencedorInfo) return "Fim da Partida";
    if (vencedorInfo.nome === 'Empate') return "Partida Empatada!";
    return `${vencedorInfo.nome} Venceu!`;
  };

  return (
    <ModalOverlay>
      <ModalContent borderColor={vencedorInfo?.cor}>
        <VencedorText>{getVencedorMessage()}</VencedorText>
        <Button onClick={onProximaPartida}>Próxima Partida</Button>
      </ModalContent>
    </ModalOverlay>
  );
};

export default FimDeJogoModal;
