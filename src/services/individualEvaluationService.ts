
import api from "./api";


export const individualEvaluationService = {

  createEvaluation: async (payload: any): Promise<any> => {
    const token = localStorage.getItem('token')
    //userId, week
    try {
      const response = await api.post("individual-evaluation/create-evaluation", {...payload}, {
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;

    } catch (error) {
      console.error("Erro na criação da Avaliação individual:", error);
      throw new Error(`Erro na criação da Avaliação individual: ${error}`);
    }
  },

  updateEvaluation: async (evaluationId: string, payload: any): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.put(`individual-evaluation/update/${evaluationId}`, {...payload}, {
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro atualização da Avaliação individual:", error);
      throw new Error(`Erro na atualização da Avaliação individual: ${error}`);
    }
  },

  deleteEvaluation: async (evaluationId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.delete(`individual-evaluation/delete/${evaluationId}`, {
        headers: { 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;

    } catch (error) {
      console.error("Erro ao excluir Avaliação individual:", error);
      throw new Error(`Erro ao excluir Avaliação individual: ${error}`);
    }
  },

  ListAllEvaluation: async (token?: string | null): Promise<any> => {
    const tokenAux = localStorage.getItem('token')
    const res = await api.get(`individual-evaluation/list-all`, {
      headers: {
        Authorization: `Bearer ${token ? token : tokenAux}`
      }
    });
    return res.data;
  },

  ListEvaluationID: async (evaluationId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    const res = await api.get(`individual-evaluation/individual-evaluation/${evaluationId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  },

  ListEvaluationFromUser: async (userId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    const res = await api.get(`individual-evaluation/list-all-evaluation/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  },

  ListEvaluationActives: async (): Promise<any> => {
    const token = localStorage.getItem('token')
    const res = await api.get(`individual-evaluation/evaluations-actives`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  },

  ListEvaluationActivesFromUser: async (userId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    const res = await api.get(`individual-evaluation/evaluation-active/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  },

};
