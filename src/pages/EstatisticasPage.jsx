import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { getLigas, getEstatisticas } from '../services/api';
import BackButton from '../components/common/BackButton';

const PageContainer = styled.div`
    width: 100%;
    min-height: 100vh;
    padding: clamp(20px, 5vw, 40px);
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Header = styled.div`
    width: 100%;
    max-width: 1200px;
    text-align: center;
    margin-bottom: clamp(20px, 5vw, 30px);
`;

const Title = styled.h1`
    font-family: 'Oswald', sans-serif;
    font-size: clamp(2rem, 6vw, 3rem);
    color: #e6f1ff;
    text-transform: uppercase;
`;

const FiltroContainer = styled.div`
    margin-bottom: clamp(20px, 5vw, 30px);
    width: 100%;
    max-width: 400px;
`;

const Select = styled.select`
    width: 100%;
    padding: clamp(10px, 2.5vw, 12px);
    background-color: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 8px;
    font-size: clamp(0.875rem, 2.5vw, 1rem);
    color: #0a192f;
    font-weight: bold;
`;

const KpiGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: clamp(15px, 4vw, 20px);
    width: 100%;
    max-width: 1000px;
    margin-bottom: clamp(30px, 6vw, 40px);

    @media (max-width: 480px) {
        grid-template-columns: 1fr;
        gap: 15px;
    }

    @media (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 1024px) {
        grid-template-columns: repeat(4, 1fr);
    }
`;

const KpiCard = styled.div`
    background-color: rgba(10, 25, 47, 0.8);
    padding: clamp(15px, 4vw, 20px);
    border-radius: 8px;
    text-align: center;
    border-left: 4px solid #facc15;
`;

const KpiTitle = styled.p`
    color: #94a3b8;
    font-size: clamp(0.8rem, 2vw, 0.9rem);
    margin-bottom: 5px;
`;

const KpiValue = styled.p`
    font-size: clamp(1.25rem, 4vw, 1.5rem);
    font-weight: bold;
    color: #facc15;
`;

const Tabela = styled.div`
    background-color: rgba(10, 25, 47, 0.8);
    border-radius: 8px;
    overflow: hidden;
    width: 100%;
    max-width: 1000px;
`;

const TabelaHeader = styled.h3`
    background-color: #1e293b;
    padding: 15px;
    text-align: center;
    font-size: 1.2rem;
    font-weight: bold;
`;

const TabelaRow = styled.div`
    display: grid;
    grid-template-columns: 50px 1fr repeat(5, 80px);
    align-items: center;
    padding: 12px 15px;
    border-bottom: 1px solid #1e293b;

    &:last-child {
        border-bottom: none;
    }
    
    &.header {
        font-weight: bold;
        color: #94a3b8;
    }
`;

const EstatisticasPage = () => {
    const [ligas, setLigas] = useState([]);
    const [selectedLiga, setSelectedLiga] = useState('');
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLigas = async () => {
            const data = await getLigas();
            setLigas(data);
        };
        fetchLigas();
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            const data = await getEstatisticas(selectedLiga);
            setStats(data);
            setLoading(false);
        };
        fetchStats();
    }, [selectedLiga]);

    const kpis = useMemo(() => {
        if (!stats || stats.length === 0) {
            return { mvp: '-', peDeRato: '-', artilheiro: '-', assistente: '-' };
        }
        const mvp = stats[0];
        const peDeRato = stats[stats.length - 1];
        const artilheiro = [...stats].sort((a, b) => b.gols - a.gols)[0];
        const assistente = [...stats].sort((a, b) => b.assistencias - a.assistencias)[0];
        return {
            mvp: mvp.nome,
            peDeRato: peDeRato.nome,
            artilheiro: `${artilheiro.nome} (${artilheiro.gols})`,
            assistente: `${assistente.nome} (${assistente.assistencias})`,
        };
    }, [stats]);

    return (
        <PageContainer>
            <Header>
                <Title>PAINEL DE ESTATÍSTICAS</Title>
            </Header>

            <FiltroContainer>
                <Select value={selectedLiga} onChange={(e) => setSelectedLiga(e.target.value)}>
                    <option value="">Todas as Ligas</option>
                    {ligas.map(liga => (
                        <option key={liga.id} value={liga.id}>{liga.nome}</option>
                    ))}
                </Select>
            </FiltroContainer>

            {loading ? <p>A carregar estatísticas...</p> : (
                <>
                    <KpiGrid>
                        <KpiCard><KpiTitle>MVP</KpiTitle><KpiValue>{kpis.mvp}</KpiValue></KpiCard>
                        <KpiCard><KpiTitle>Pé de Rato</KpiTitle><KpiValue>{kpis.peDeRato}</KpiValue></KpiCard>
                        <KpiCard><KpiTitle>Artilheiro</KpiTitle><KpiValue>{kpis.artilheiro}</KpiValue></KpiCard>
                        <KpiCard><KpiTitle>Maior Assistente</KpiTitle><KpiValue>{kpis.assistente}</KpiValue></KpiCard>
                    </KpiGrid>
                    
                    <Tabela>
                        <TabelaHeader>TABELA DE PONTOS</TabelaHeader>
                        <TabelaRow className="header">
                            <span>#</span>
                            <span>JOGADOR</span>
                            <span style={{textAlign: 'center'}}>PONTOS</span>
                            <span style={{textAlign: 'center'}}>V</span>
                            <span style={{textAlign: 'center'}}>E</span>
                            <span style={{textAlign: 'center'}}>D</span>
                            <span style={{textAlign: 'center'}}>G</span>
                        </TabelaRow>
                        {stats.map((j, i) => (
                            <TabelaRow key={j.id}>
                                <span>{i + 1}</span>
                                <span>{j.nome}</span>
                                <strong style={{textAlign: 'center', color: '#facc15'}}>{j.total_pontos}</strong>
                                <span style={{textAlign: 'center'}}>{j.vitorias}</span>
                                <span style={{textAlign: 'center'}}>{j.empates}</span>
                                <span style={{textAlign: 'center'}}>{j.derrotas}</span>
                                <span style={{textAlign: 'center'}}>{j.gols}</span>
                            </TabelaRow>
                        ))}
                    </Tabela>
                </>
            )}
            <BackButton />
        </PageContainer>
    );
};

export default EstatisticasPage;
