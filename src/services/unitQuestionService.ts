
import api from "./api";


export const unitQuestionService = {

  createQuestion: async (payload: any): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.post("unit-questions/create-question", {...payload}, {
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;

    } catch (error) {
      console.error("Erro na criação da Question:", error);
      throw new Error(`Erro na criação da Question: ${error}`);
    }
  },

  updateQuestion: async (questionId: string, payload: any): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.put(`unit-questions/update/${questionId}`, {...payload}, {
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro atualização da question:", error);
      throw new Error(`Erro na atualização da question: ${error}`);
    }
  },

  deleteQuestion: async (questionId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.delete(`unit-questions/delete/${questionId}`, {
        headers: { 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;

    } catch (error) {
      console.error("Erro ao excluir Question:", error);
      throw new Error(`Erro ao excluir Question: ${error}`);
    }
  },

  ListQuestions: async (token?: string | null): Promise<any> => {
    const tokenAux = localStorage.getItem('token')
    const res = await api.get("unit-questions/list-questions", {
      headers: {
        Authorization: `Bearer ${token ? token : tokenAux}`
      }
    });
    return res.data;
  },

};
