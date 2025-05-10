
import api from "./api";


export const unitEvaluationService = {

  createEvaluation: async (payload: any): Promise<any> => {
    const token = localStorage.getItem('token')
    //unitId, evaluatedBy, correctAnswers, wrongAnswers, exameScore, week
    try {
      const response = await api.post("unit-evaluation/create-evaluation", {...payload}, {
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;

    } catch (error) {
      console.error("Erro na criação da Avaliação:", error);
      throw new Error(`Erro na criação da Avaliação: ${error}`);
    }
  },

  updateEvaluation: async (evaluationId: string, payload: any): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.put(`unit-evaluation/update/${evaluationId}`, {...payload}, {
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro atualização da Avaliação:", error);
      throw new Error(`Erro na atualização da Avaliação: ${error}`);
    }
  },

  deleteEvaluation: async (evaluationId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.delete(`unit-evaluation/delete/${evaluationId}`, {
        headers: { 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;

    } catch (error) {
      console.error("Erro ao excluir Avaliação:", error);
      throw new Error(`Erro ao excluir Avaliação: ${error}`);
    }
  },

  ListAllEvaluation: async (token?: string | null): Promise<any> => {
    const tokenAux = localStorage.getItem('token')
    const res = await api.get(`unit-evaluation/list-all`, {
      headers: {
        Authorization: `Bearer ${token ? token : tokenAux}`
      }
    });
    return res.data;
  },

  ListEvaluationID: async (evaluationId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    const res = await api.get(`unit-evaluation/list/${evaluationId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  },

  ListEvaluationFromUnit: async (unitId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    const res = await api.get(`unit-evaluation/list-all-evaluation-unit/${unitId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  },

  ListEvaluationActives: async (): Promise<any> => {
    const token = localStorage.getItem('token')
    const res = await api.get(`unit-evaluation/evaluations-actives`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  },

  ListEvaluationActivesFromUnit: async (unitId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    const res = await api.get(`unit-evaluation/evaluations-actives/${unitId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  },

};
