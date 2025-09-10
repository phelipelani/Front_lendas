import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { syncJogadoresNaRodada, getJogadoresDaRodada, saveTimesSorteados, getTimesSorteados } from '../services/api';
import Button from '../components/common/Button';
import NotasJogadoresStep from '../components/sorteio/NotasJogadoresStep';
import BackButton from '../components/common/BackButton';

// Lógica de Sorteio ORIGINAL (adaptada para objetos)
const embaralharArray = (array) => array.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);

const sorteiarTimes = (jogadores, jogadoresPorTime) => {
    const totalJogadores = jogadores.length;
    const quantidadeTimes = Math.floor(totalJogadores / jogadoresPorTime);
    if (quantidadeTimes === 0) return [];

    let times = Array.from({ length: quantidadeTimes }, () => ({ jogadores: [], pontuacaoTotal: 0 }));
    
    const recuados = embaralharArray(jogadores.filter(j => j.joga_recuado));
    const avancados = embaralharArray(jogadores.filter(j => !j.joga_recuado));

    for (let i = 0; i < quantidadeTimes; i++) {
        if (recuados.length > 0) {
            const jogador = recuados.shift();
            times[i].jogadores.push(jogador);
            times[i].pontuacaoTotal += jogador.nivel;
        }
    }

    const jogadoresRestantes = [...recuados, ...avancados].sort((a, b) => b.nivel - a.nivel);

    jogadoresRestantes.forEach(jogador => {
        times.sort((a, b) => a.pontuacaoTotal - b.pontuacaoTotal);
        const timeParaAdicionar = times.find(time => time.jogadores.length < jogadoresPorTime);
        if (timeParaAdicionar) {
            timeParaAdicionar.jogadores.push(jogador);
            timeParaAdicionar.pontuacaoTotal += jogador.nivel;
        }
    });

    return times.map(time => ({ ...time, jogadores: embaralharArray(time.jogadores) }));
};

// Styled Components
const PageContainer = styled.div`
    width: 100vw;
    min-height: 100vh;
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const StepContainer = styled.div`
    background-color: rgba(10, 25, 47, 0.8);
    padding: 40px;
    border-radius: 12px;
    border: 1px solid #facc15;
    width: 100%;
    max-width: 900px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const StepTitle = styled.h2`
    color: #facc15;
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 30px;
    font-family: 'Oswald', sans-serif;
`;

const TextArea = styled.textarea`
    width: 100%;
    max-width: 600px;
    height: 250px;
    background-color: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 8px;
    padding: 15px;
    font-size: 1.1rem;
    color: #0a192f;
    resize: vertical;
    margin-bottom: 20px;
`;

const TimesContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    width: 100%;
    margin-top: 20px;
`;

const TimeCard = styled.div`
    background: linear-gradient(135deg, ${props => props.color1}, ${props => props.color2});
    padding: 15px;
    border-radius: 12px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.3);
`;

const TimeHeader = styled.h3`
    color: white;
    text-align: center;
    margin-bottom: 15px;
    font-size: 1.2rem;
`;

const JogadorItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(0,0,0,0.3);
    padding: 8px 12px;
    border-radius: 6px;
    margin-bottom: 8px;
    color: white;
`;

const NavigationButtons = styled.div`
    display: flex;
    justify-content: center;
    gap: 20px;
    width: 100%;
    margin-top: 30px;
`;

const SorteioPage = () => {
    const { rodadaId, ligaId } = useParams();
    const navigate = useNavigate();
    const [step, setStep] = useState(0); // 0: Carregando
    const [listaTexto, setListaTexto] = useState('');
    const [jogadoresDaRodada, setJogadoresDaRodada] = useState([]);
    const [jogadoresPorTime, setJogadoresPorTime] = useState(4);
    const [sortedTeams, setSortedTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    const teamColors = [
        ['#facc15', '#f59e0b'], ['#4b5563', '#1f2937'],
        ['#3b82f6', '#1d4ed8'], ['#ec4899', '#be185d'],
    ];

    const checkRodadaState = useCallback(async () => {
        setLoading(true);
        const timesSalvos = await getTimesSorteados(rodadaId);
        if (timesSalvos.length > 0) {
            const timesReconstruidos = [];
            timesSalvos.forEach(jogador => {
                const timeIndex = jogador.numero_time - 1;
                if (!timesReconstruidos[timeIndex]) {
                    timesReconstruidos[timeIndex] = { jogadores: [], pontuacaoTotal: 0 };
                }
                timesReconstruidos[timeIndex].jogadores.push(jogador);
                timesReconstruidos[timeIndex].pontuacaoTotal += jogador.nivel;
            });
            setSortedTeams(timesReconstruidos);
            setStep(3);
        } else {
            const jogadoresNaRodada = await getJogadoresDaRodada(rodadaId);
            if (jogadoresNaRodada.length > 0) {
                const jogadoresComBoolean = jogadoresNaRodada.map(j => ({...j, joga_recuado: !!j.joga_recuado}));
                setJogadoresDaRodada(jogadoresComBoolean);
                setStep(2);
            } else {
                setStep(1);
            }
        }
        setLoading(false);
    }, [rodadaId]);

    useEffect(() => {
        checkRodadaState();
    }, [checkRodadaState]);

    const handleValidar = async () => {
        setLoading(true);
        const nomesDaLista = listaTexto
            .split('\n')
            .map(line => line.replace(/^\d+\s*-\s*/, '').trim())
            .filter(Boolean);

        if (nomesDaLista.length === 0) {
            alert("Por favor, cole a lista de jogadores.");
            setLoading(false);
            return;
        }

        try {
            const resultadoSync = await syncJogadoresNaRodada(rodadaId, nomesDaLista);
            const jogadoresProcessados = resultadoSync.jogadores;
            const jogadoresComBoolean = jogadoresProcessados.map(j => ({...j, joga_recuado: !!j.joga_recuado}));
            setJogadoresDaRodada(jogadoresComBoolean);
            setStep(2);
        } catch (error) {
            alert(`Erro ao validar jogadores: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };
    
    const handleSortear = (jogadoresAtualizados) => {
        const teams = sorteiarTimes(jogadoresAtualizados, jogadoresPorTime);
        setSortedTeams(teams);
        setStep(3);
    };

    const handleIniciarPartidas = async () => {
        try {
            await saveTimesSorteados(rodadaId, sortedTeams);
            navigate(`/liga/${ligaId}/rodada/${rodadaId}/partidas`, { state: { teams: sortedTeams, colors: teamColors } });
        } catch (error) {
            alert(`Erro ao guardar o sorteio: ${error.message}`);
        }
    };

    if (loading || step === 0) {
        return <PageContainer><StepTitle>A verificar estado da rodada...</StepTitle></PageContainer>;
    }

    return (
        <PageContainer>
            {step === 1 && (
                <StepContainer>
                    <StepTitle>Sorteio de Times</StepTitle>
                    <TextArea
                        value={listaTexto}
                        onChange={(e) => setListaTexto(e.target.value)}
                        placeholder="Cole a lista de jogadores do WhatsApp aqui..."
                    />
                    <Button onClick={handleValidar} disabled={loading} style={{width: '100%', maxWidth: '600px'}}>
                        {loading ? 'A validar...' : 'Validar'}
                    </Button>
                </StepContainer>
            )}
            
            {step === 2 && (
                <StepContainer>
                    <StepTitle>Notas das Lendas</StepTitle>
                    <NotasJogadoresStep 
                        jogadores={jogadoresDaRodada} 
                        onSortear={handleSortear}
                        jogadoresPorTime={jogadoresPorTime}
                        setJogadoresPorTime={setJogadoresPorTime}
                    />
                </StepContainer>
            )}

            {step === 3 && (
                <StepContainer>
                    <StepTitle>Times Sorteados</StepTitle>
                    <TimesContainer>
                        {sortedTeams.map((time, index) => (
                            <TimeCard key={index} color1={teamColors[index % teamColors.length][0]} color2={teamColors[index % teamColors.length][1]}>
                                <TimeHeader>Time {index + 1} (Média: {(time.pontuacaoTotal / time.jogadores.length).toFixed(1)})</TimeHeader>
                                {time.jogadores.map(jogador => (
                                    <JogadorItem key={jogador.id}>
                                        <span>{jogador.nome}</span>
                                        <strong>{jogador.nivel}</strong>
                                    </JogadorItem>
                                ))}
                            </TimeCard>
                        ))}
                    </TimesContainer>
                </StepContainer>
            )}

            <NavigationButtons>
                {step > 1 && <Button onClick={() => setStep(step - 1)} style={{backgroundColor: '#6b7280', width: 'auto'}}>Voltar</Button>}
                {step === 3 && <Button onClick={handleIniciarPartidas}>Iniciar Partidas</Button>}
                <Button onClick={() => navigate(-1)} style={{backgroundColor: '#ef4444', width: 'auto'}}>Sair do Sorteio</Button>
            </NavigationButtons>
        </PageContainer>
    );
};

export default SorteioPage;
