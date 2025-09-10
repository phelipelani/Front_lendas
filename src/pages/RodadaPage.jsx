import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/common/Button';
import BackButton from '../components/common/BackButton';
import { getLigaById, getRodadasPorLiga, getTimesSorteados } from '../services/api';

const PageTitle = styled.h1`
  color: #e6f1ff;
  margin-bottom: 30px;
  font-size: 1.8rem;
  text-align: center;
  line-height: 1.4;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const RodadaPage = () => {
  const { ligaId, rodadaId } = useParams();
  const navigate = useNavigate();
  const [liga, setLiga] = useState(null);
  const [rodada, setRodada] = useState(null);
  const [timesSorteados, setTimesSorteados] = useState(null);
  const [loading, setLoading] = useState(true);

  const teamColors = [
      ['#facc15', '#f59e0b'], ['#4b5563', '#1f2937'],
      ['#3b82f6', '#1d4ed8'], ['#ec4899', '#be185d'],
  ];

  const fetchPageData = useCallback(async () => {
    setLoading(true);
    const [ligaData, rodadasData, timesData] = await Promise.all([
      getLigaById(ligaId),
      getRodadasPorLiga(ligaId),
      getTimesSorteados(rodadaId)
    ]);
    
    setLiga(ligaData);
    const rodadaAtual = rodadasData.find(r => r.id === parseInt(rodadaId));
    setRodada(rodadaAtual);

    if (timesData && timesData.length > 0) {
        const timesReconstruidos = [];
        timesData.forEach(jogador => {
            const timeIndex = jogador.numero_time - 1;
            if (!timesReconstruidos[timeIndex]) {
                timesReconstruidos[timeIndex] = { jogadores: [], pontuacaoTotal: 0 };
            }
            timesReconstruidos[timeIndex].jogadores.push(jogador);
            timesReconstruidos[timeIndex].pontuacaoTotal += jogador.nivel;
        });
        setTimesSorteados(timesReconstruidos);
    } else {
        setTimesSorteados([]);
    }

    setLoading(false);
  }, [ligaId, rodadaId]);

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);

  const handlePartidasClick = () => {
    if (rodada?.status === 'finalizada') return;
    if (timesSorteados && timesSorteados.length > 0) {
      navigate(`/liga/${ligaId}/rodada/${rodadaId}/partidas`, { state: { teams: timesSorteados, colors: teamColors } });
    } else {
      alert("Nenhum sorteio foi guardado para esta rodada. Por favor, faça o sorteio primeiro.");
      navigate(`/liga/${ligaId}/rodada/${rodadaId}/sorteio`);
    }
  };

  if (loading) {
    return <PageTitle>A carregar dados da rodada...</PageTitle>;
  }

  const isRodadaFinalizada = rodada?.status === 'finalizada';

  return (
    <>
      <PageTitle>
        {liga?.nome} <br /> 
        Rodada {rodada ? new Date(rodada.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : ''}
      </PageTitle>
      <ButtonContainer>
        <Button 
            as={isRodadaFinalizada ? 'div' : Link} 
            to={`/liga/${ligaId}/rodada/${rodadaId}/sorteio`}
            style={isRodadaFinalizada ? {backgroundColor: '#4b5563', cursor: 'not-allowed'} : {}}
        >
            {timesSorteados && timesSorteados.length > 0 ? 'Refazer Sorteio' : 'Sorteio'}
        </Button>
        <Button 
            onClick={handlePartidasClick}
            disabled={isRodadaFinalizada}
            style={isRodadaFinalizada ? {backgroundColor: '#4b5563', cursor: 'not-allowed'} : {}}
        >
            Partidas
        </Button>
        <Link to={`/liga/${ligaId}/rodada/${rodadaId}/resultados`}>
            <Button>Resultado das Partidas</Button>
        </Link>
        <BackButton />
      </ButtonContainer>
    </>
  );
};

export default RodadaPage;
