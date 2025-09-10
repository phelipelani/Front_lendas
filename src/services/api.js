const BASE_URL = "/api";

// Função auxiliar para obter os headers de autenticação
const getAuthHeaders = () => {
  // Em um app real, isso viria do estado de login (ex: localStorage, Context)
  // Por enquanto, vamos simular com um header fixo para testes.
  return { "X-User-Role": "admin" };
};

export const getLigas = async () => {
  try {
    const response = await fetch(`${BASE_URL}/ligas`);
    if (!response.ok) {
      throw new Error("Erro de rede ao buscar ligas");
    }
    return await response.json();
  } catch (error) {
    console.error("Falha ao buscar ligas:", error);
    return [];
  }
};

export const createLiga = async (ligaData) => {
  try {
    const response = await fetch(`${BASE_URL}/ligas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(ligaData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao criar liga");
    }
    return await response.json();
  } catch (error) {
    console.error("Falha ao criar liga:", error);
    throw error; // Propaga o erro para ser tratado na UI
  }
};

export const createRodada = async (ligaId, rodadaData) => {
  try {
    const response = await fetch(`${BASE_URL}/rodadas/liga/${ligaId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(rodadaData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      // Verificamos se o erro do backend é sobre uma data duplicada
      if (
        errorData.message &&
        errorData.message.includes("UNIQUE constraint failed")
      ) {
        throw new Error("Já existe uma rodada para essa liga nessa data");
      }
      // Se for outro erro, mostramos a mensagem padrão
      throw new Error(errorData.message || "Já existe uma rodada para essa liga nessa data");
    }

    return await response.json();
  } catch (error) {
    console.error("Falha ao criar rodada:", error);
    throw error;
  }
};

export const getLigaById = async (ligaId) => {
  try {
    const response = await fetch(`${BASE_URL}/ligas/${ligaId}`);
    if (!response.ok) {
      throw new Error("Erro de rede ao buscar detalhes da liga");
    }
    return await response.json();
  } catch (error) {
    console.error("Falha ao buscar detalhes da liga:", error);
    return null;
  }
};

export const getRodadasPorLiga = async (ligaId) => {
  try {
    const response = await fetch(`${BASE_URL}/rodadas/liga/${ligaId}`);
    if (!response.ok) {
      throw new Error("Erro de rede ao buscar rodadas");
    }
    return await response.json();
  } catch (error) {
    console.error("Falha ao buscar rodadas:", error);
    return [];
  }
};

export const getAllJogadores = async () => {
  try {
    const response = await fetch(`${BASE_URL}/jogadores`);
    if (!response.ok) throw new Error('Erro de rede ao buscar jogadores');
    return await response.json();
  } catch (error) {
    console.error("Falha ao buscar todos os jogadores:", error);
    return [];
  }
};

export const addJogadoresNaRodada = async (rodadaId, jogadoresIds) => {
  try {
    const response = await fetch(`${BASE_URL}/rodadas/${rodadaId}/jogadores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ jogadores_ids: jogadoresIds }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao adicionar jogadores na rodada');
    }
    return await response.json();
  } catch (error) {
    console.error("Falha ao adicionar jogadores na rodada:", error);
    throw error;
  }
};


export const syncJogadoresNaRodada = async (rodadaId, nomes) => {
  try {
    const response = await fetch(`${BASE_URL}/rodadas/${rodadaId}/sync-jogadores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ nomes }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao sincronizar jogadores');
    }
    return await response.json();
  } catch (error) {
    console.error("Falha ao sincronizar jogadores na rodada:", error);
    throw error;
  }
};

export const updatePlayerNivel = async (playerId, nivel) => {
  try {
    const response = await fetch(`${BASE_URL}/jogadores/${playerId}/nivel`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ nivel }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao atualizar nível do jogador');
    }
    return await response.json();
  } catch (error) {
    console.error(`Falha ao atualizar nível para o jogador ${playerId}:`, error);
    throw error;
  }
};

export const updatePlayerCaracteristica = async (playerId, joga_recuado) => {
  try {
    const response = await fetch(`${BASE_URL}/jogadores/${playerId}/caracteristica`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ joga_recuado }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao atualizar característica do jogador');
    }
    return await response.json();
  } catch (error) {
    console.error(`Falha ao atualizar característica para o jogador ${playerId}:`, error);
    throw error;
  }
};

export const getJogadoresDaRodada = async (rodadaId) => {
  try {
    const response = await fetch(`${BASE_URL}/rodadas/${rodadaId}/jogadores`);
    if (!response.ok) {
      throw new Error('Erro de rede ao buscar jogadores da rodada');
    }
    return await response.json();
  } catch (error) {
    console.error("Falha ao buscar jogadores da rodada:", error);
    return [];
  }
};

// Adicione estas funções ao ficheiro src/services/api.js

export const createPartida = async (rodadaId) => {
  try {
    const response = await fetch(`${BASE_URL}/rodadas/${rodadaId}/partidas`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao criar partida');
    return await response.json();
  } catch (error) {
    console.error("Falha ao criar partida:", error);
    throw error;
  }
};

export const savePartidaResultados = async (partidaId, data) => {
  try {
    const response = await fetch(`${BASE_URL}/partidas/${partidaId}/resultados`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Erro ao salvar resultados da partida');
    return await response.json();
  } catch (error) {
    console.error("Falha ao salvar partida:", error);
    throw error;
  }
};

export const finalizarRodada = async (rodadaId) => {
  try {
    const response = await fetch(`${BASE_URL}/rodadas/${rodadaId}/finalizar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao finalizar rodada');
    }
    return await response.json();
  } catch (error) {
    console.error("Falha ao finalizar rodada:", error);
    throw error;
  }
}

export const saveTimesSorteados = async (rodadaId, times) => {
  try {
    const response = await fetch(`${BASE_URL}/rodadas/${rodadaId}/times`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ times }),
    });
    if (!response.ok) throw new Error('Erro ao guardar os times sorteados');
    return await response.json();
  } catch (error) {
    console.error("Falha ao guardar os times:", error);
    throw error;
  }
};

export const getTimesSorteados = async (rodadaId) => {
  try {
    const response = await fetch(`${BASE_URL}/rodadas/${rodadaId}/times`);
    if (!response.ok) {
      // Se der 404 (sem times), não é um erro, apenas retorna vazio
      if (response.status === 404) return [];
      throw new Error('Erro ao buscar times sorteados');
    }
    return await response.json();
  } catch (error) {
    console.error("Falha ao buscar times sorteados:", error);
    return []; // Retorna vazio em caso de erro
  }
};

export const getResultadosDaRodada = async (rodadaId) => {
  try {
    const response = await fetch(`${BASE_URL}/rodadas/${rodadaId}/resultados`);
    if (!response.ok) {
      throw new Error('Erro de rede ao buscar resultados da rodada');
    }
    return await response.json();
  } catch (error) {
    console.error("Falha ao buscar resultados da rodada:", error);
    return [];
  }
};

export const getEstatisticas = async (ligaId) => {
  // Constrói a URL com o filtro de liga, se ele existir
  const url = ligaId ? `${BASE_URL}/estatisticas?liga_id=${ligaId}` : `${BASE_URL}/estatisticas`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Erro de rede ao buscar estatísticas');
    }
    return await response.json();
  } catch (error) {
    console.error("Falha ao buscar estatísticas:", error);
    return []; // Retorna um array vazio em caso de erro
  }
};
