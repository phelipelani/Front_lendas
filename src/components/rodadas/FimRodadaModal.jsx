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
  max-width: 600px;
  border: 2px solid #facc15;
  text-align: center;
  box-shadow: 0 0 30px #facc15;
`;

const ModalTitle = styled.h2`
  color: #e6f1ff;
  font-size: 2.5rem;
  font-family: 'Oswald', sans-serif;
  margin-bottom: 30px;
`;

const PremiosContainer = styled.div`
    display: flex;
    justify-content: space-around;
    margin-bottom: 30px;
    gap: 20px;
`;

const PremioColuna = styled.div``;

const PremioTitulo = styled.h3`
    font-size: 1.5rem;
    color: ${props => props.color};
    margin-bottom: 15px;
`;

const JogadorPremiado = styled.p`
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 5px;
`;

const FimRodadaModal = ({ isOpen, onClose, resultado }) => {
  if (!isOpen || !resultado) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>Resultados da Rodada</ModalTitle>
        <PremiosContainer>
            <PremioColuna>
                <PremioTitulo color="#22c55e">🏆 MVPs</PremioTitulo>
                {resultado.mvps.map(mvp => (
                    <JogadorPremiado key={mvp.jogador_id}>
                        {mvp.jogador_id} - {mvp.total_pontos.toFixed(2)} pts
                    </JogadorPremiado>
                ))}
            </PremioColuna>
            <PremioColuna>
                <PremioTitulo color="#ef4444">💀 Pés de Rato</PremioTitulo>
                 {resultado.pesDeRato.map(pe => (
                    <JogadorPremiado key={pe.jogador_id}>
                        {pe.jogador_id} - {pe.total_pontos.toFixed(2)} pts
                    </JogadorPremiado>
                ))}
            </PremioColuna>
        </PremiosContainer>
        <Button onClick={onClose}>Fechar</Button>
      </ModalContent>
    </ModalOverlay>
  );
};

export default FimRodadaModal;
