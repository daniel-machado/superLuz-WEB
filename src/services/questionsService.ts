
import api from "./api";


export const questionsService = {

  createQuestion: async (payload: any): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.post("quiz-question/create", {...payload}, {
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

  updateQuestion: async (quizId: string, payload: any): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.put(`quiz-question/update/${quizId}`, payload, {
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro na atualização da question:", error);
      throw new Error(`Erro na atualização da question: ${error}`);
    }
  },

  deleteQuestion: async (quizId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.delete(`quiz-question/delete/${quizId}`, {
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

  ListAllQuestion: async (token?: string | null): Promise<any> => {
    const tokenAux = localStorage.getItem('token')
    const res = await api.get("quiz-question/list-all", {
      headers: {
        Authorization: `Bearer ${token ? token : tokenAux}`
      }
    });
    const data = res.data.result.quizzes;
    return data
  },

  getQuestionID: async (questionId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    const res = await api.get(`quiz-question/list-question/${questionId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  },

  getAllByQuizId: async (quizId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    const response = await api.get(`quiz-question/quiz-all-questions/${quizId}`, {
      headers: { 
        "Content-Type": "application/json", 
        Authorization: `Bearer ${token}`
      },
    });
    const data = response.data.result;
    return data
  },

  getRandomQuestions: async (quizId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    const response = await api.get(`quiz-question/quiz/${quizId}/random`, {
      headers: { 
        "Content-Type": "application/json", 
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  },
};
