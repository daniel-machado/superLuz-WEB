
import api from "./api";


export const answerService = {

  createAnswer: async (payload: any): Promise<any> => {
    const token = localStorage.getItem('token')
    // const { questionId, answer, isCorrect } = payload;
    try {
      const response = await api.post("quiz-answer/create", {...payload}, {
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Erro ao criar answer:", error.response?.data || error.message);
      throw new Error(`Erro ao criar Answer ${error}`);
    }
  },

  updateAnswer: async (answerId: string, payload: any): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.put(`quiz-answer/update/${answerId}`, payload, {
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Erro na atualização da answer:", error.response?.data || error.message);
      throw new Error(`Erro na atualização da answer: ${error}`);
    }
  },

  deleteAnswer: async (answerId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.delete(`quiz-answer/delete/${answerId}`, {
        headers: { 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;

    } catch (error: any) {
      console.error("Erro ao deleter quiz:", error.response?.data || error.message);
      throw new Error(`Erro ao deletar quiz: ${error}`);
    }
  },

  ListAllAnswer: async (token?: string | null): Promise<any> => {
    const tokenAux = localStorage.getItem('token')
    const res = await api.get("quiz-answer/list-all", {
      headers: {
        Authorization: `Bearer ${token ? token : tokenAux}`
      }
    });
    const data = res.data.result;
    return data
  },

  getAnswerId: async (answerId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    const res = await api.get(`quiz-answer/list-one${answerId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  },

  getQuestionId: async (questionId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    const response = await api.get(`quiz-answer/question/${questionId}`, {
      headers: { 
        "Content-Type": "application/json", 
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  },

};
