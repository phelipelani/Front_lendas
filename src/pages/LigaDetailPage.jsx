import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/common/Button';
import BackButton from '../components/common/BackButton';
import CriarRodadaModal from '../components/rodadas/CriarRodadaModal';
import FimRodadaModal from '../components/rodadas/FimRodadaModal';
import { getRodadasPorLiga, getLigaById, finalizarRodada } from '../services/api';

const PageTitle = styled.h1`
  color: #e6f1ff;
  margin-bottom: 20px;
  font-size: clamp(1.5rem, 4vw, 2rem);
  text-align: center;
  padding: 0 1rem;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  padding: 0 1rem;
  box-sizing: border-box;
`;

const RodadaList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  background-color: rgba(10, 25, 47, 0.8);
  padding: clamp(15px, 4vw, 20px);
  border-radius: 8px;
  min-height: 200px;
  max-width: 450px;
  border: 1px solid #facc15;
  box-sizing: border-box;

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 10px;
    gap: 10px;
  }
`;

const RodadaItemContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const RodadaLink = styled(Link)`
  background-color: rgba(255, 255, 255, 0.9);
  color: #0a192f;
  padding: clamp(10px, 3vw, 12px) clamp(15px, 4vw, 20px);
  border-radius: 6px;
  text-align: center;
  font-weight: bold;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  flex-grow: 1;
  font-size: clamp(0.875rem, 2.5vw, 1rem);
  word-break: break-word;

  &:hover {
    background-color: #fde047;
    transform: scale(1.02);
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 12px 15px;
  }
`;

const FinalizarButton = styled.button`
  background-color: #10b981;
  color: white;
  border: none;
  padding: clamp(8px, 2.5vw, 10px) clamp(12px, 3vw, 15px);
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: clamp(0.75rem, 2vw, 0.875rem);
  white-space: nowrap;

  &:hover {
    background-color: #059669;
  }
  
  &:disabled {
    background-color: #374151;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 10px 15px;
    white-space: normal;
  }
`;

const ListTitle = styled.h2`
  color: #facc15;
  text-align: center;
  font-size: clamp(1rem, 3vw, 1.2rem);
  margin-bottom: 10px;
  border-bottom: 1px solid #facc15;
  padding-bottom: 10px;
`;

const LigaDetailPage = () => {
  const { ligaId } = useParams();
  const [liga, setLiga] = useState(null);
  const [isCriarModalOpen, setIsCriarModalOpen] = useState(false);
  const [isFimModalOpen, setIsFimModalOpen] = useState(false);
  const [resultadoRodada, setResultadoRodada] = useState(null);
  const [rodadas, setRodadas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLigaData = useCallback(async () => {
    setLoading(true);
    const [ligaData, rodadasData] = await Promise.all([
      getLigaById(ligaId),
      getRodadasPorLiga(ligaId)
    ]);
    setLiga(ligaData);
    setRodadas(rodadasData);
    setLoading(false);
  }, [ligaId]);

  useEffect(() => {
    fetchLigaData();
  }, [fetchLigaData]);

  const handleRodadaCriada = () => {
    setIsCriarModalOpen(false);
    fetchLigaData();
  };

  const handleFinalizarRodada = async (rodadaId) => {
    const confirma = window.confirm("Tem a certeza que quer finalizar esta rodada? Esta ação não pode ser desfeita.");
    if (confirma) {
        try {
            const resultado = await finalizarRodada(rodadaId);
            setResultadoRodada(resultado);
            setIsFimModalOpen(true);
            fetchLigaData(); // Atualiza a lista para mostrar a rodada como "finalizada"
        } catch (error) {
            alert(`Erro ao finalizar rodada: ${error.message}`);
        }
    }
  };

  if (loading) {
    return <PageTitle>A carregar...</PageTitle>;
  }

  return (
    <>
      <Container>
        <PageTitle>{liga ? liga.nome : `Liga ${ligaId}`}</PageTitle>
        <Button onClick={() => setIsCriarModalOpen(true)}>Criar Rodada</Button>
        
        <RodadaList>
          <ListTitle>Histórico de Rodadas</ListTitle>
          {rodadas.length > 0 ? (
            rodadas.map((rodada) => (
              <RodadaItemContainer key={rodada.id}>
                <RodadaLink to={`/liga/${ligaId}/rodada/${rodada.id}`}>
                  Rodada: {new Date(rodada.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}
                  ({rodada.status})
                </RodadaLink>
                {rodada.status === 'aberta' && (
                    <FinalizarButton onClick={() => handleFinalizarRodada(rodada.id)}>
                        Finalizar
                    </FinalizarButton>
                )}
              </RodadaItemContainer>
            ))
          ) : (
            <p style={{textAlign: 'center'}}>Nenhuma rodada encontrada.</p>
          )}
        </RodadaList>
        <BackButton />
      </Container>

      <CriarRodadaModal
        isOpen={isCriarModalOpen}
        onClose={() => setIsCriarModalOpen(false)}
        onSuccess={handleRodadaCriada}
        ligaId={ligaId}
      />
      <FimRodadaModal
        isOpen={isFimModalOpen}
        onClose={() => setIsFimModalOpen(false)}
        resultado={resultadoRodada}
      />
    </>
  );
};

export default LigaDetailPage;