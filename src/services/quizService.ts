
import api from "./api";


export const quizService = {

  createQuiz: async (payload: any): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.post("quiz/create", {...payload}, {
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao criar Quiz", error);
      throw new Error(`Erro ao criar Quiz ${error}`);
    }
  },

  updateQuiz: async (quizId: string, payload: any): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.put(`quiz/update/${quizId}`, payload, {
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro na atualização do quiz:", error);
      throw new Error(`Erro na atualização do quiz: ${error}`);
    }
  },

  deleteQuiz: async (quizId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.delete(`quiz/delete/${quizId}`, {
        headers: { 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;

    } catch (error) {
      console.error("Erro ao deleter quiz:", error);
      throw new Error(`Erro ao deletar quiz: ${error}`);
    }
  },

  ListAllQuiz: async (token?: string | null): Promise<any> => {
    const tokenAux = localStorage.getItem('token')
    const res = await api.get("quiz/list", {
      headers: {
        Authorization: `Bearer ${token ? token : tokenAux}`
      }
    });
    const data = res.data.result.quizzes;
    return data
  },

  getQuizID: async (quizId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    const res = await api.get(`quiz/${quizId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  },

  listByQuizSpecialty: async (specialtyId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    const response = await api.get(`quiz/list-quiz-specialty/${specialtyId}`, {
      headers: { 
        "Content-Type": "application/json", 
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  },

};
