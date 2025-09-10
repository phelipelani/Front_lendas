import React from 'react';
import styled from 'styled-components';

// CORREÇÃO: Importando as imagens como módulos.
// O Vite irá processar estes caminhos e fornecer os links corretos.
import iconeAmarelo from '../../assets/Amarelo.png';
import iconePreto from '../../assets/Preto.png';
import iconeAzul from '../../assets/Azul.png';
import iconeRosa from '../../assets/Rosa.png';


const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: rgba(10, 25, 47, 0.9);
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  border: 1px solid #facc15;
`;

const ModalTitle = styled.h2`
  color: #e6f1ff;
  text-align: center;
  margin-bottom: 25px;
  font-size: 1.5rem;
`;

const TimesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
`;

const TimeIcon = styled.img`
  width: 100%;
  height: auto;
  cursor: pointer;
  border-radius: 50%;
  border: 4px solid transparent;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    border-color: #facc15;
  }
`;


const SelecionarTimeModal = ({ isOpen, onClose, onSelectTime, teams }) => {
  if (!isOpen) return null;

  const teamIcons = [iconeAmarelo, iconePreto, iconeAzul, iconeRosa];

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalTitle>Escolhendo Time</ModalTitle>
        <TimesGrid>
          {teams.map((team, index) => (
            <TimeIcon
              key={index}
              src={teamIcons[index % teamIcons.length]}
              alt={`Time ${index + 1}`}
              onClick={() => onSelectTime(team, index)}
            />
          ))}
        </TimesGrid>
      </ModalContent>
    </ModalOverlay>
  );
};

export default SelecionarTimeModal;
