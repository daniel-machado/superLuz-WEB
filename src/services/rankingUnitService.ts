
import api from "./api";


export const rankingUnitService = {

  listRanking: async (): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.get("unit-ranking/list-ranking", {
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data.ranking;

    } catch (error) {
      console.error("Erro ao buscar Ranking:", error);
      throw new Error(`Erro ao buscar ranking: ${error}`);
    }
  },

  getUnitRankingByUnit: async (unitId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.get(`unit-ranking/unit/${unitId}`, {
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar ranking", error);
      throw new Error(`Erro ao buscar ranking ${error}`);
    }
  },

  getUnitRankingWeek: async (week: string): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.get(`unit-ranking/${week}`, {
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
      const response = await api.get(`unit-ranking/${rankingId}`, {
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
