
import api from "./api";


export const individualAnswerService = {

  createAnswer: async (payload: any): Promise<any> => {
    const token = localStorage.getItem('token')
    //userId, questionId, answer, week
    try {
      const response = await api.post("individual-answer/create-answer", {...payload}, {
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;

    } catch (error) {
      console.error("Erro na criação da Answer individual:", error);
      throw new Error(`Erro na criação da Answer individual: ${error}`);
    }
  },

  deleteAnswer: async (answerId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.delete(`individual-answer/delete-answer/${answerId}`, {
        headers: { 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;

    } catch (error) {
      console.error("Erro ao excluir Answer individual:", error);
      throw new Error(`Erro ao excluir Answer individual: ${error}`);
    }
  },

  ListUserAnswer: async (userId: string, token?: string | null): Promise<any> => {
    const tokenAux = localStorage.getItem('token')
    const res = await api.get(`individual-answer/list-answer/${userId}`, {
      headers: {
        Authorization: `Bearer ${token ? token : tokenAux}`
      }
    });
    const data = res.data.answers;
    return data
  },

  ListAllAnswer: async (): Promise<any> => {
    const token = localStorage.getItem('token')
    const res = await api.get(`individual-answer/list-all-answers`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  },

};
