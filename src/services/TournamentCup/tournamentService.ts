// tournamentService.ts
import api from "../api";

export const tournamentService = {
  // Standings - Classificações
  getGroupStandings: async (): Promise<any> => {
    //const token = localStorage.getItem('token');
    try {
      const response = await api.get("tournament/standings/group", {
        // headers: { 
        //   Authorization: `Bearer ${token}`
        // },
      });
      return response.data;
    } catch (error: any) {
      if(error.response && error.response.data){
        const errorMessage = error.response.data.error 
          || error.response.data.message 
          || 'Erro ao buscar classificações por grupo';
        throw new Error(errorMessage);
      } else {
        console.error("Erro ao buscar classificações", error.message);
        throw new Error(`Erro ao buscar classificações: ${error.message || "Erro ao conectar com o servidor"}`);
      }
    }
  },

  getOverallStandings: async (): Promise<any> => {
    //const token = localStorage.getItem('token');
    try {
      const response = await api.get("tournament/standings/overall", {
        // headers: { 
        //   Authorization: `Bearer ${token}`
        // },
      });
      return response.data;
    } catch (error: any) {
      if(error.response && error.response.data){
        const errorMessage = error.response.data.error 
          || error.response.data.message 
          || 'Erro ao buscar classificação geral';
        throw new Error(errorMessage);
      } else {
        console.error("Erro ao buscar classificação geral", error.message);
        throw new Error(`Erro ao buscar classificação geral: ${error.message || "Erro ao conectar com o servidor"}`);
      }
    }
  },

  // Estatísticas
  getTournamentStats: async (): Promise<any> => {
    //const token = localStorage.getItem('token');
    try {
      const response = await api.get("tournament/stats", {
        // headers: { 
        //   Authorization: `Bearer ${token}`
        // },
      });
      return response.data;
    } catch (error: any) {
      if(error.response && error.response.data){
        const errorMessage = error.response.data.error 
          || error.response.data.message 
          || 'Erro ao buscar estatísticas do torneio';
        throw new Error(errorMessage);
      } else {
        console.error("Erro ao buscar estatísticas", error.message);
        throw new Error(`Erro ao buscar estatísticas: ${error.message || "Erro ao conectar com o servidor"}`);
      }
    }
  },

  // Partidas
  getAllMatches: async (): Promise<any> => {
    //const token = localStorage.getItem('token');
    try {
      const response = await api.get("matches/list-all", {
        // headers: { 
        //   Authorization: `Bearer ${token}`
        // },
      });
      return response.data;
    } catch (error: any) {
      if(error.response && error.response.data){
        const errorMessage = error.response.data.error 
          || error.response.data.message 
          || 'Erro ao buscar partidas';
        throw new Error(errorMessage);
      } else {
        console.error("Erro ao buscar partidas", error.message);
        throw new Error(`Erro ao buscar partidas: ${error.message || "Erro ao conectar com o servidor"}`);
      }
    }
  },

  getMatchById: async (matchId: string): Promise<any> => {
    //const token = localStorage.getItem('token');
    try {
      const response = await api.get(`matches/list-one/${matchId}`, {
        // headers: { 
        //   Authorization: `Bearer ${token}`
        // },
      });
      return response.data;
    } catch (error: any) {
      if(error.response && error.response.data){
        const errorMessage = error.response.data.error 
          || error.response.data.message 
          || 'Erro ao buscar partida';
        throw new Error(errorMessage);
      } else {
        console.error("Erro ao buscar partida", error.message);
        throw new Error(`Erro ao buscar partida: ${error.message || "Erro ao conectar com o servidor"}`);
      }
    }
  },

  // =============== MANAGE MATCHES =================
  
  createMatch: async (payload: {
    groupId?: string;
    player1Id: string;
    player2Id: string;
    round: string;
    phase: string;
    description: string;
  }): Promise<any> => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.post("matches/create", payload, {
        headers: { 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;
    } catch (error: any) {
      if(error.response && error.response.data){
        const errorMessage = error.response.data.error 
          || error.response.data.message 
          || 'Erro ao criar partida';
        throw new Error(errorMessage);
      } else {
        console.error("Erro ao criar partida", error.message);
        throw new Error(`Erro ao criar partida: ${error.message || "Erro ao conectar com o servidor"}`);
      }
    }
  },

  getMatchesByPhase: async (phase: string): Promise<any> => {
    //const token = localStorage.getItem('token');
    try {
      const response = await api.get(`matches/phase/${phase}`, {
        // headers: { 
        //   Authorization: `Bearer ${token}`
        // },
      });
      return response.data;
    } catch (error: any) {
      if(error.response && error.response.data){
        const errorMessage = error.response.data.error 
          || error.response.data.message 
          || 'Erro ao buscar partidas por fase';
        throw new Error(errorMessage);
      } else {
        console.error("Erro ao buscar partidas por fase", error.message);
        throw new Error(`Erro ao buscar partidas por fase: ${error.message || "Erro ao conectar com o servidor"}`);
      }
    }
  }

};