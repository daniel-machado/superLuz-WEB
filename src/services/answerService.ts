
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
      //Extraindo a resposta de error da mensagem da API
      if(error.response && error.response.data){
        //Se a API retornar um objetode erro com uma mensagem
        const errorMessage = error.response.data.error 
        || error.response.data.message 
        || 'erro ao criar'
        throw new Error(errorMessage)
      } else {
        console.error("Erro ao registrar", error.message);
        throw new Error(`Erro ao registrar ${error.messagem || "Erro ao conectar com o servidor"}`);
      }
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
      //Extraindo a resposta de error da mensagem da API
      if(error.response && error.response.data){
        //Se a API retornar um objetode erro com uma mensagem
        const errorMessage = error.response.data.error 
        || error.response.data.message 
        || 'erro na atualização da resposta'
        throw new Error(errorMessage)
      } else {
        console.error("Erro ao registrar", error.message);
        throw new Error(`Erro ao registrar ${error.messagem || "Erro ao conectar com o servidor"}`);
      }
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
      //Extraindo a resposta de error da mensagem da API
      if(error.response && error.response.data){
        //Se a API retornar um objetode erro com uma mensagem
        const errorMessage = error.response.data.error 
        || error.response.data.message 
        || 'erro ao deletar resposta'
        throw new Error(errorMessage)
      } else {
        console.error("Erro ao registrar", error.message);
        throw new Error(`Erro ao registrar ${error.messagem || "Erro ao conectar com o servidor"}`);
      }
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
