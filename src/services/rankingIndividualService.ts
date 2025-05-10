
import api from "./api";


export const rankingIndividualService = {
  listRanking: async (): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.get("individual-ranking/list-ranking", {
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data.ranking;

    } catch (error) {
      console.error("Erro ao buscar Ranking Individual:", error);
      throw new Error(`Erro ao buscar ranking Individual: ${error}`);
    }
  },

  getIndividualRankingByUser: async (userId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.get(`individual-ranking/ranking-user/${userId}`, {
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar ranking Individual", error);
      throw new Error(`Erro ao buscar ranking Individual ${error}`);
    }
  },

  getIndividualRankingWeek: async (week: string): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.get(`individual-ranking/list-ranking-week/${week}`, {
        headers: { 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;

    } catch (error) {
      console.error("Erro ao buscar semana do Ranking:", error);
      throw new Error(`Erro ao buscar semana do Ranking ${error}`);
    }
  },

  deleteRanking: async (rankingId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.get(`individual-ranking/${rankingId}`, {
        headers: { 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;

    } catch (error) {
      console.error("Erro ao buscar semana do Ranking:", error);
      throw new Error(`Erro ao buscar semana do Ranking ${error}`);
    }
  },
};
