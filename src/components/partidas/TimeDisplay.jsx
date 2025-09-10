import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background-color: ${props => props.bgColor || 'rgba(10, 25, 47, 0.8)'};
  padding: 15px;
  border-radius: 8px;
  width: 48%;
  transition: background-color 0.3s ease;
`;

const JogadorRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  background-color: rgba(0,0,0,0.2);
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(0,0,0,0.4);
    transform: scale(1.02);
  }
`;

const PlayerName = styled.span`
    font-weight: 500;
    flex-grow: 1;
`;

const StatsControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 10px;
  opacity: ${props => (props.show ? 1 : 0)};
  transition: opacity 0.3s ease;

  button {
    background: #facc15;
    color: #0a192f;
    border: none;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    font-weight: bold;
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }
`;

const TimeDisplay = ({ timeData, onStatChange, onOpenSubModal, bgColor, isJogoAtivo }) => {
  if (!timeData) return null;

  return (
    <Container bgColor={bgColor}>
      {timeData.jogadores.map(j => (
        <JogadorRow key={j.id} onClick={() => onOpenSubModal(j)}>
          <PlayerName>{j.nome}</PlayerName>
          <StatsControl show={isJogoAtivo}>
            G: {j.gols}
            <button onClick={(e) => { e.stopPropagation(); onStatChange(j.id, 'gols', 1); }}>+</button>
            <button onClick={(e) => { e.stopPropagation(); onStatChange(j.id, 'gols', -1); }}>-</button>
          </StatsControl>
          <StatsControl show={isJogoAtivo}>
            A: {j.assistencias}
            <button onClick={(e) => { e.stopPropagation(); onStatChange(j.id, 'assistencias', 1); }}>+</button>
            <button onClick={(e) => { e.stopPropagation(); onStatChange(j.id, 'assistencias', -1); }}>-</button>
          </StatsControl>
        </JogadorRow>
      ))}
    </Container>
  );
};

export default TimeDisplay;
