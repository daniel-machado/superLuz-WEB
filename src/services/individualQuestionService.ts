
import api from "./api";


export const individualQuestionService = {

  createQuestion: async (payload: any): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.post("individual-questions/create-question", {...payload}, {
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;

    } catch (error) {
      console.error("Erro na criação da Question individual:", error);
      throw new Error(`Erro na criação da Question individual: ${error}`);
    }
  },

  updateQuestion: async (questionId: string, payload: any): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.put(`individual-questions/update-question/${questionId}`, {...payload}, {
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro atualização da question individual:", error);
      throw new Error(`Erro na atualização da question individual: ${error}`);
    }
  },

  deleteQuestion: async (questionId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.delete(`individual-questions/delete-question/${questionId}`, {
        headers: { 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;

    } catch (error) {
      console.error("Erro ao excluir Question individual:", error);
      throw new Error(`Erro ao excluir Question individual: ${error}`);
    }
  },

  ListQuestions: async (token?: string | null): Promise<any> => {
    const tokenAux = localStorage.getItem('token')
    const res = await api.get("individual-questions/list-questions", {
      headers: {
        Authorization: `Bearer ${token ? token : tokenAux}`
      }
    });
    return res.data;
  },

};
