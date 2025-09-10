import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../common/Button';
import { updatePlayerNivel, updatePlayerCaracteristica } from '../../services/api';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const SettingsContainer = styled.div`
  margin-bottom: 25px;
  color: #e6f1ff;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.1rem;
  
  input {
    width: 80px;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 4px;
    padding: 8px;
    color: #0a192f;
    font-size: 1.1rem;
    font-weight: bold;
  }
`;

// NOVO: Container principal com scroll e altura limitada
const JogadorListContainer = styled.div`
  width: 95%;
  max-height: 70vh; /* Limita a altura para permitir scroll */
  overflow-y: auto; /* Adiciona scroll vertical quando necessário */
  padding: 20px;
  border: 1px solid rgba(250, 204, 21, 0.2);
  border-radius: 8px;
  margin-bottom: 20px;

  /* Estilização da barra de scroll (opcional, mas melhora a estética) */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #0a192f;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #facc15;
    border-radius: 10px;
  }
`;

// NOVO: Divisão em colunas
const JogadorList = styled.div`
  column-count: 3; /* Divide em 3 colunas por padrão */
  column-gap: 20px;

  @media (max-width: 1024px) {
    column-count: 2; /* 2 colunas para ecrãs menores */
  }

  @media (max-width: 768px) {
    column-count: 1; /* 1 coluna para telemóveis */
  }
`;

// Função para retornar a cor da borda com base na nota
const getNotaStyles = (nota) => {
    switch (nota) {
        case 10:
            return `border: 2px solid #ffd700; box-shadow: 0 0 8px #ffd700;`; // Dourado
        case 7:
            return `border: 2px solid #c0c0c0; box-shadow: 0 0 8px #c0c0c0;`; // Prata
        case 5:
            return `border: 2px solid #cd7f32; box-shadow: 0 0 8px #cd7f32;`; // Bronze
        default:
            return `border: 2px solid transparent;`;
    }
};

const JogadorRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #0a192f;
  padding: 10px 15px;
  border-radius: 6px;
  margin-bottom: 15px; /* Espaço entre os itens na coluna */
  break-inside: avoid-column; /* Evita que um item quebre entre colunas */
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.03);
  }

  /* ALTERADO: Adiciona borda colorida com base na nota */
  ${props => getNotaStyles(props.nota)}
`;

const JogadorName = styled.span`
  font-weight: bold;
  flex-grow: 1;
`;

const InputNota = styled.input`
  width: 60px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 4px;
  padding: 8px;
  color: #0a192f;
  margin: 0 15px;
  font-weight: bold;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  input {
    margin-right: 8px;
  }
`;

const NotasJogadoresStep = ({ jogadores, onSortear, jogadoresPorTime, setJogadoresPorTime }) => {
  const [jogadoresData, setJogadoresData] = useState(jogadores);
  const [loading, setLoading] = useState(false);

  const handleNotaChange = (id, nivel) => {
    const novoNivel = parseInt(nivel, 10);
    if (isNaN(novoNivel)) return;

    setJogadoresData(prev =>
      prev.map(j => (j.id === id ? { ...j, nivel: novoNivel } : j))
    );
  };

  const handleRecuadoChange = (id, joga_recuado) => {
    setJogadoresData(prev =>
      prev.map(j => (j.id === id ? { ...j, joga_recuado } : j))
    );
  };

  const handleConfirmarNotasESortear = async () => {
    setLoading(true);
    try {
      await Promise.all(
        jogadoresData.map(j => Promise.all([
          updatePlayerNivel(j.id, j.nivel),
          updatePlayerCaracteristica(j.id, j.joga_recuado)
        ]))
      );
      onSortear(jogadoresData);
    } catch (error) {
      alert(`Erro ao salvar notas: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <SettingsContainer>
        <label htmlFor="jogadoresPorLinha">Jogadores por linha:</label>
        <input
          type="number"
          id="jogadoresPorLinha"
          value={jogadoresPorTime}
          onChange={(e) => setJogadoresPorTime(parseInt(e.target.value, 10))}
          min="1"
        />
      </SettingsContainer>
      <JogadorListContainer>
        <JogadorList>
            {jogadoresData.map(jogador => (
            <JogadorRow key={jogador.id} nota={jogador.nivel}>
                <JogadorName>{jogador.nome}</JogadorName>
                <InputNota
                type="number"
                value={jogador.nivel}
                onChange={(e) => handleNotaChange(jogador.id, e.target.value)}
                min="1"
                max="10"
                />
                <CheckboxLabel>
                <input
                    type="checkbox"
                    checked={jogador.joga_recuado}
                    onChange={(e) => handleRecuadoChange(jogador.id, e.target.checked)}
                />
                Recuado
                </CheckboxLabel>
            </JogadorRow>
            ))}
        </JogadorList>
      </JogadorListContainer>
      <Button onClick={handleConfirmarNotasESortear} disabled={loading} style={{width: '100%', maxWidth: '500px', backgroundColor: '#10b981'}}>
        {loading ? 'A guardar...' : 'Sortear Times'}
      </Button>
    </Container>
  );
};

export default NotasJogadoresStep;
