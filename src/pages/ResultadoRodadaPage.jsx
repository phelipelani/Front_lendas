import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { getResultadosDaRodada } from '../services/api';
import BackButton from '../components/common/BackButton';

const PageContainer = styled.div`
    width: 100%;
    min-height: 100vh;
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Header = styled.div`
    width: 100%;
    max-width: 1200px;
    text-align: center;
    margin-bottom: 40px;
`;

const Title = styled.h1`
    font-family: 'Oswald', sans-serif;
    font-size: 3rem;
    color: #e6f1ff;
    text-transform: uppercase;
`;

const KpiGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    width: 100%;
    max-width: 1000px;
    margin-bottom: 40px;

    @media (min-width: 768px) {
        grid-template-columns: repeat(4, 1fr);
    }
`;

const KpiCard = styled.div`
    background-color: rgba(10, 25, 47, 0.8);
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    border-left: 4px solid #facc15;
`;

const KpiTitle = styled.p`
    color: #94a3b8;
    font-size: 0.9rem;
    margin-bottom: 5px;
`;

const KpiValue = styled.p`
    font-size: 1.5rem;
    font-weight: bold;
    color: #facc15;
`;

const TabelasContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 30px;
    width: 100%;
    max-width: 1200px;

    @media (min-width: 1024px) {
        grid-template-columns: repeat(3, 1fr);
    }
`;

const Tabela = styled.div`
    background-color: rgba(10, 25, 47, 0.8);
    border-radius: 8px;
    overflow: hidden;
`;

const TabelaHeader = styled.h3`
    background-color: #1e293b;
    padding: 15px;
    text-align: center;
    font-size: 1.2rem;
    font-weight: bold;
`;

const TabelaRow = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 12px 15px;
    border-bottom: 1px solid #1e293b;

    &:last-child {
        border-bottom: none;
    }

    &.rank-1 {
        background-color: rgba(250, 204, 21, 0.2);
        font-weight: bold;
    }
    &.rank-last {
        background-color: rgba(239, 68, 68, 0.2);
    }
`;

const ResultadoRodadaPage = () => {
    const { rodadaId } = useParams();
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            const data = await getResultadosDaRodada(rodadaId);
            setStats(data);
            setLoading(false);
        };
        fetchStats();
    }, [rodadaId]);

    if (loading) {
        return <PageContainer><Title>A carregar estatísticas...</Title></PageContainer>;
    }

    const mvp = stats[0];
    const peDeRato = stats[stats.length - 1];
    const artilheiro = [...stats].sort((a, b) => b.gols - a.gols)[0];
    const assistente = [...stats].sort((a, b) => b.assistencias - a.assistencias)[0];

    return (
        <PageContainer>
            <Header>
                <Title>Painel de Estatísticas</Title>
            </Header>

            <KpiGrid>
                <KpiCard><KpiTitle>MVP DA RODADA</KpiTitle><KpiValue>{mvp?.nome || '-'}</KpiValue></KpiCard>
                <KpiCard><KpiTitle>Pé de Rato</KpiTitle><KpiValue>{peDeRato?.nome || '-'}</KpiValue></KpiCard>
                <KpiCard><KpiTitle>Artilheiro</KpiTitle><KpiValue>{artilheiro?.nome} ({artilheiro?.gols})</KpiValue></KpiCard>
                <KpiCard><KpiTitle>Maior Assistente</KpiTitle><KpiValue>{assistente?.nome} ({assistente?.assistencias})</KpiValue></KpiCard>
            </KpiGrid>
            
            <TabelasContainer>
                <Tabela>
                    <TabelaHeader>TABELA PONTOS</TabelaHeader>
                    {stats.map((j, i) => (
                        <TabelaRow key={j.id} className={i === 0 ? 'rank-1' : i === stats.length - 1 ? 'rank-last' : ''}>
                            <span>{i + 1}. {j.nome}</span>
                            <strong>{j.total_pontos}</strong>
                        </TabelaRow>
                    ))}
                </Tabela>
                 <Tabela>
                    <TabelaHeader>TABELA DE GOLS</TabelaHeader>
                    {[...stats].sort((a, b) => b.gols - a.gols).map((j, i) => (
                        <TabelaRow key={j.id} className={i === 0 ? 'rank-1' : ''}>
                            <span>{i + 1}. {j.nome}</span>
                            <strong>{j.gols}</strong>
                        </TabelaRow>
                    ))}
                </Tabela>
                 <Tabela>
                    <TabelaHeader>TABELA DE ASSISTÊNCIAS</TabelaHeader>
                    {[...stats].sort((a, b) => b.assistencias - a.assistencias).map((j, i) => (
                        <TabelaRow key={j.id} className={i === 0 ? 'rank-1' : ''}>
                            <span>{i + 1}. {j.nome}</span>
                            <strong>{j.assistencias}</strong>
                        </TabelaRow>
                    ))}
                </Tabela>
            </TabelasContainer>

            <BackButton />
        </PageContainer>
    );
};

export default ResultadoRodadaPage;
