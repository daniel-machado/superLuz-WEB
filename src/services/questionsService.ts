
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
   } catch (error: any) {
      //Extraindo a resposta de error da mensagem da API
      if(error.response && error.response.data){
        //Se a API retornar um objetode erro com uma mensagem
        const errorMessage = error.response.data.error 
        || error.response.data.message 
        || 'erro ao quiz'
        throw new Error(errorMessage)
      } else {
        console.error("Erro ao registrar", error.message);
        throw new Error(`Erro ao registrar ${error.messagem || "Erro ao conectar com o servidor"}`);
      }
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
    } catch (error: any) {
      //Extraindo a resposta de error da mensagem da API
      if(error.response && error.response.data){
        //Se a API retornar um objetode erro com uma mensagem
        const errorMessage = error.response.data.error 
        || error.response.data.message 
        || 'erro ao atualizar'
        throw new Error(errorMessage)
      } else {
        console.error("Erro ao registrar", error.message);
        throw new Error(`Erro ao registrar ${error.messagem || "Erro ao conectar com o servidor"}`);
      }
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

    } catch (error: any) {
      //Extraindo a resposta de error da mensagem da API
      if(error.response && error.response.data){
        //Se a API retornar um objetode erro com uma mensagem
        const errorMessage = error.response.data.error 
        || error.response.data.message 
        || 'erro ao deletar'
        throw new Error(errorMessage)
      } else {
        console.error("Erro ao registrar", error.message);
        throw new Error(`Erro ao registrar ${error.messagem || "Erro ao conectar com o servidor"}`);
      }
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
