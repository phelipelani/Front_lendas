import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { createPartida, savePartidaResultados, finalizarRodada } from "../services/api";
import SelecionarTimeModal from "../components/partidas/SelecionarTimeModal";
import SubstituirJogadorModal from "../components/partidas/SubstituirJogadorModal";
import TimeDisplay from "../components/partidas/TimeDisplay";
import FimDeJogoModal from "../components/partidas/FimDeJogoModal";
import FimRodadaModal from "../components/rodadas/FimRodadaModal";
import ConfirmacaoModal from "../components/common/ConfirmacaoModal";
import Button from "../components/common/Button";

// Caminhos corretos para as imagens, como pediu
import Amarelo from "../assets/Amarelo.png";
import Preto from "../assets/Preto.png";
import Azul from "../assets/Azul.png";
import Rosa from "../assets/Rosa.png";
const teamIcons = [Amarelo, Preto, Azul, Rosa];

const PageContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative; /* Para o botão de voltar */
`;

const FloatingBackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: rgba(250, 204, 21, 0.8);
  color: #0a192f;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  transition: all 0.3s ease;

  &:hover {
    background-color: #facc15;
    transform: scale(1.1);
  }
`;

const PlacarContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  width: 100%;
  max-width: 1000px;
  margin-bottom: 20px;
`;

const TimePlacar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 35%;
`;

const PlacarLabel = styled.h2`
  font-size: 1.5rem;
  color: #e6f1ff;
  text-align: center;
`;

const PlacarNumero = styled.div`
  font-size: 4rem;
  font-weight: bold;
  color: #facc15;
`;

const CronometroContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 50px;
`;

const Tempo = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 10px;
  width: 200px;
  text-align: center;
  color: #ef4444;
`;

const BotoesCronometro = styled.div`
  display: flex;
  gap: 15px;
  button {
    background: #facc15;
    color: #0a192f;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
  }
`;

const TimeSelector = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  font-size: 1.2rem;
  text-align: center;
  border: 2px dashed #facc15;
  transition: all 0.3s ease;
  overflow: hidden;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  &:hover {
    background-color: ${(props) =>
      props.disabled ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.2)"};
    border-style: ${(props) => (props.disabled ? "dashed" : "solid")};
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const JogadoresContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  max-width: 1000px;
  gap: 20px;
`;

const EventHistory = styled.div`
  font-size: 0.9rem;
  color: #cbd5e1;
  height: 80px;
  overflow-y: auto;
  text-align: center;
  margin-top: 10px;
  width: 100%;
  div {
    margin-bottom: 4px;
  }
`;

const BottomRightButtonContainer = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
`;

const CenterButtonContainer = styled.div`
  margin-top: 40px;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const PartidasPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { ligaId, rodadaId } = useParams();
  const { teams, colors } = location.state || { teams: [], colors: [] };

  const [partidaId, setPartidaId] = useState(null);
  const [time1, setTime1] = useState(null);
  const [time2, setTime2] = useState(null);
  const [eventHistory, setEventHistory] = useState({ time1: [], time2: [] });

  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isFimDeJogoModalOpen, setIsFimDeJogoModalOpen] = useState(false);
  const [vencedorInfo, setVencedorInfo] = useState(null);

  const [substituicaoInfo, setSubstituicaoInfo] = useState({
    jogador: null,
    setTime: null,
  });
  const [selectingFor, setSelectingFor] = useState(null);

  const [tempo, setTempo] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const countRef = useRef(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isFimRodadaModalOpen, setIsFimRodadaModalOpen] = useState(false);
  const [resultadoRodada, setResultadoRodada] = useState(null);

  const createNewPartida = useCallback(async () => {
    try {
      const novaPartida = await createPartida(rodadaId);
      setPartidaId(novaPartida.id);
    } catch (error) {
      alert("Não foi possível criar uma nova partida no servidor.");
      navigate(-1);
    }
  }, [rodadaId, navigate]);

  useEffect(() => {
    createNewPartida();
  }, [createNewPartida]);

  const handleStart = () => {
    if (!isActive && time1 && time2) {
      setIsActive(true);
      countRef.current = setInterval(() => setTempo((t) => t + 1), 1000);
    }
  };

  const handlePause = () => {
    clearInterval(countRef.current);
    setIsActive(false);
  };

  const placar1 = time1
    ? time1.jogadores.reduce((sum, j) => sum + j.gols, 0)
    : 0;
  const placar2 = time2
    ? time2.jogadores.reduce((sum, j) => sum + j.gols, 0)
    : 0;

  const handleFinalizarPartida = async () => {
    handlePause();
    if (!time1 || !time2) return;

    let vencedor = null;
    if (placar1 > placar2) {
      vencedor = {
        nome: `Time ${time1.teamIndex + 1}`,
        cor: colors[time1.teamIndex][0],
        timeVencedor: time1,
      };
    } else if (placar2 > placar1) {
      vencedor = {
        nome: `Time ${time2.teamIndex + 1}`,
        cor: colors[time2.teamIndex][0],
        timeVencedor: time2,
      };
    } else {
      vencedor = { nome: "Empate" };
    }
    setVencedorInfo(vencedor);
    
    const data = {
      placar1,
      placar2,
      duracao: tempo,
      time1: time1.jogadores,
      time2: time2.jogadores,
      time1_numero: time1.teamIndex + 1,
      time2_numero: time2.teamIndex + 1,
    };
    try {
      await savePartidaResultados(partidaId, data);
      setIsFimDeJogoModalOpen(true);
    } catch (error) {
      alert(`Erro ao finalizar a partida: ${error.message}`);
    }
  };

  const handleProximaPartida = () => {
    setIsFimDeJogoModalOpen(false);
    setTempo(0);
    setEventHistory({ time1: [], time2: [] });

    if (vencedorInfo.nome === "Empate") {
      setTime1(null);
      setTime2(null);
    } else {
      const timeVencedorResetado = {
        ...vencedorInfo.timeVencedor,
        jogadores: vencedorInfo.timeVencedor.jogadores.map((j) => ({
          ...j,
          gols: 0,
          assistencias: 0,
        })),
      };
      setTime1(timeVencedorResetado);
      setTime2(null);
    }

    setVencedorInfo(null);
    createNewPartida();
  };

  const openSelectModal = (timeSlot) => {
    if (isActive) {
      alert("Pause o cronómetro para trocar os times.");
      return;
    }
    setSelectingFor(timeSlot);
    setIsSelectModalOpen(true);
  };
  const handleSelectTime = (teamData, teamIndex) => {
    const timeComStats = {
      ...teamData,
      teamIndex,
      jogadores: teamData.jogadores.map((j) => ({
        ...j,
        gols: 0,
        assistencias: 0,
      })),
    };
    if (selectingFor === "time1") setTime1(timeComStats);
    else setTime2(timeComStats);
    setIsSelectModalOpen(false);
  };
  const openSubModal = (jogador, setTime) => {
    if (isActive) {
      alert("Pause o cronómetro para fazer uma substituição.");
      return;
    }
    setSubstituicaoInfo({ jogador, setTime });
    setIsSubModalOpen(true);
  };
  const handleSubstituicao = (novoJogador) => {
    const { jogador: jogadorAntigo, setTime } = substituicaoInfo;
    const novoJogadorComStats = {
      ...novoJogador,
      gols: jogadorAntigo.gols,
      assistencias: jogadorAntigo.assistencias,
    };
    setTime((prevTime) => ({
      ...prevTime,
      jogadores: prevTime.jogadores.map((j) =>
        j.id === jogadorAntigo.id ? novoJogadorComStats : j
      ),
    }));
    setIsSubModalOpen(false);
  };
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const handleStatChange = (timeSlot, jogadorId, stat, delta) => {
    const setTime = timeSlot === "time1" ? setTime1 : setTime2;
    setTime((prevTime) => {
      if (!prevTime) return null;
      return {
        ...prevTime,
        jogadores: prevTime.jogadores.map((j) => {
          if (j.id === jogadorId) {
            return { ...j, [stat]: Math.max(0, j[stat] + delta) };
          }
          return j;
        }),
      };
    });
  };

  const handleFinalizarRodadaClick = async () => {
    setIsConfirmModalOpen(false);
    try {
      const resultado = await finalizarRodada(rodadaId);
      setResultadoRodada(resultado);
      setIsFimRodadaModalOpen(true);
    } catch (error) {
      alert(`Erro ao finalizar a rodada: ${error.message}`);
    }
  };

  useEffect(() => {
    const reconcileHistory = (time, timeSlot) => {
      if (!time) return;
      const currentHistory = eventHistory[timeSlot];
      const newHistory = [];

      time.jogadores.forEach((jogador) => {
        const goalsInState = jogador.gols;
        const goalsInHistory = currentHistory.filter(
          (e) => e.jogadorId === jogador.id
        ).length;

        if (goalsInState > goalsInHistory) {
          for (let i = 0; i < goalsInState; i++) {
            const existingEvent = currentHistory.filter(
              (e) => e.jogadorId === jogador.id
            )[i];
            if (existingEvent) {
              newHistory.push(existingEvent);
            } else {
              newHistory.push({
                id: Date.now() + Math.random(),
                text: `Golo: ${jogador.nome} ${formatTime(tempo)}`,
                jogadorId: jogador.id,
              });
            }
          }
        } else if (goalsInState < goalsInHistory) {
          const goalsToRemove = goalsInHistory - goalsInState;
          let removedCount = 0;
          const reversedHistory = [...currentHistory].reverse();
          const keptGoals = reversedHistory
            .filter((e) => {
              if (e.jogadorId === jogador.id && removedCount < goalsToRemove) {
                removedCount++;
                return false;
              }
              return true;
            })
            .reverse();
          newHistory.push(
            ...keptGoals.filter((e) => e.jogadorId === jogador.id)
          );
        } else {
          newHistory.push(
            ...currentHistory.filter((e) => e.jogadorId === jogador.id)
          );
        }
      });

      const jogadoresAtuaisIds = time.jogadores.map((j) => j.id);
      currentHistory.forEach((event) => {
        if (
          !jogadoresAtuaisIds.includes(event.jogadorId) &&
          !newHistory.some((e) => e.id === event.id)
        ) {
          newHistory.push(event);
        }
      });

      setEventHistory((prev) => ({ ...prev, [timeSlot]: newHistory }));
    };

    reconcileHistory(time1, "time1");
    reconcileHistory(time2, "time2");
  }, [placar1, placar2, time1, time2, tempo]);

  const jogadoresEmCampoIds = [
    ...(time1?.jogadores.map((j) => j.id) || []),
    ...(time2?.jogadores.map((j) => j.id) || []),
  ];
  const todosJogadoresSorteados = teams.flatMap((t) => t.jogadores);
  const jogadoresNoBanco = todosJogadoresSorteados.filter(
    (j) => !jogadoresEmCampoIds.includes(j.id)
  );

  return (
    <PageContainer>
      <FloatingBackButton onClick={() => navigate(-1)}>
        &larr;
      </FloatingBackButton>

      <PlacarContainer>
        <TimePlacar>
          <PlacarLabel>Placar Time 1</PlacarLabel>
          <TimeSelector
            onClick={() => openSelectModal("time1")}
            disabled={isActive}
          >
            {time1 ? (
              <img
                src={teamIcons[time1.teamIndex]}
                alt={`Time ${time1.teamIndex + 1}`}
              />
            ) : (
              "Selecionar"
            )}
          </TimeSelector>
          <PlacarNumero>{placar1}</PlacarNumero>
          <EventHistory>
            {eventHistory.time1.map((event) => (
              <div key={event.id}>{event.text}</div>
            ))}
          </EventHistory>
        </TimePlacar>
        <CronometroContainer>
          <Tempo>{formatTime(tempo)}</Tempo>
          <BotoesCronometro>
            <button onClick={handleStart}>▶</button>
            <button onClick={handlePause}>⏸</button>
          </BotoesCronometro>
        </CronometroContainer>
        <TimePlacar>
          <PlacarLabel>Placar Time 2</PlacarLabel>
          <TimeSelector
            onClick={() => openSelectModal("time2")}
            disabled={isActive}
          >
            {time2 ? (
              <img
                src={teamIcons[time2.teamIndex]}
                alt={`Time ${time2.teamIndex + 1}`}
              />
            ) : (
              "Selecionar"
            )}
          </TimeSelector>
          <PlacarNumero>{placar2}</PlacarNumero>
          <EventHistory>
            {eventHistory.time2.map((event) => (
              <div key={event.id}>{event.text}</div>
            ))}
          </EventHistory>
        </TimePlacar>
      </PlacarContainer>
      <JogadoresContainer>
        <TimeDisplay
          timeData={time1}
          onStatChange={(...args) => handleStatChange("time1", ...args)}
          onOpenSubModal={(jogador) => openSubModal(jogador, setTime1)}
          bgColor={time1 ? `${colors[time1.teamIndex][0]}99` : undefined}
          isJogoAtivo={isActive}
        />
        <TimeDisplay
          timeData={time2}
          onStatChange={(...args) => handleStatChange("time2", ...args)}
          onOpenSubModal={(jogador) => openSubModal(jogador, setTime2)}
          bgColor={time2 ? `${colors[time2.teamIndex][0]}99` : undefined}
          isJogoAtivo={isActive}
        />
      </JogadoresContainer>
      
      <CenterButtonContainer>
          <Button onClick={handleFinalizarPartida}>Finalizar Partida</Button>
      </CenterButtonContainer>

      <BottomRightButtonContainer>
          <Button
            onClick={() => setIsConfirmModalOpen(true)}
            style={{ backgroundColor: "#ef4444", width: 'auto', padding: '10px 20px', fontSize: '0.9rem' }}
          >
            Finalizar Rodada
          </Button>
      </BottomRightButtonContainer>

      <SelecionarTimeModal
        isOpen={isSelectModalOpen}
        onClose={() => setIsSelectModalOpen(false)}
        onSelectTime={handleSelectTime}
        teams={teams}
      />
      <SubstituirJogadorModal
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
        onSelectSub={handleSubstituicao}
        jogadoresDisponiveis={jogadoresNoBanco}
        jogadorASubstituir={substituicaoInfo.jogador}
      />
      <ConfirmacaoModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleFinalizarRodadaClick}
        title="Finalizar Rodada"
        message="Tem a certeza que quer finalizar esta rodada? Esta ação não pode ser desfeita."
      />
      <FimRodadaModal
        isOpen={isFimRodadaModalOpen}
        onClose={() => navigate(`/liga/${ligaId}`)}
        resultado={resultadoRodada}
      />
      <FimDeJogoModal 
        isOpen={isFimDeJogoModalOpen} 
        onProximaPartida={handleProximaPartida} 
        vencedorInfo={vencedorInfo} 
      />
    </PageContainer>
  );
};

export default PartidasPage;
