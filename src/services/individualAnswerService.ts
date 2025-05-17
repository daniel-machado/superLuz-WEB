
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

  deleteAnswer: async (answerId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.delete(`individual-answer/delete-answer/${answerId}`, {
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
        || 'erro ao excluir'
        throw new Error(errorMessage)
      } else {
        console.error("Erro ao registrar", error.message);
        throw new Error(`Erro ao registrar ${error.messagem || "Erro ao conectar com o servidor"}`);
      }
    }
  },

  ListUserAnswer: async (userId: string, token?: string | null): Promise<any> => {
    const tokenAux = localStorage.getItem('token')
   
        try {
    const res = await api.get(`individual-answer/list-answer/${userId}`, {
      headers: {
        Authorization: `Bearer ${token ? token : tokenAux}`
      }
    });
    const data = res.data.answers;
    return data


  } catch (error: any) {
    //Extraindo a resposta de error da mensagem da API
    if(error.response && error.response.data){
      //Se a API retornar um objetode erro com uma mensagem
      const errorMessage = error.response.data.error 
      || error.response.data.message 
      || 'Error ao fazer Login'
      throw new Error(errorMessage)
    } else {
      console.error("Erro ao registrar", error.message);
      throw new Error(`Erro ao registrar ${error.messagem || "Erro ao conectar com o servidor"}`);
    }
  }
  },

  ListAllAnswer: async (): Promise<any> => {
    const token = localStorage.getItem('token')
   

         try {
     const res = await api.get(`individual-answer/list-all-answers`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;

  } catch (error: any) {
    //Extraindo a resposta de error da mensagem da API
    if(error.response && error.response.data){
      //Se a API retornar um objetode erro com uma mensagem
      const errorMessage = error.response.data.error 
      || error.response.data.message 
      || 'Error ao fazer Login'
      throw new Error(errorMessage)
    } else {
      console.error("Erro ao registrar", error.message);
      throw new Error(`Erro ao registrar ${error.messagem || "Erro ao conectar com o servidor"}`);
    }
  }
  },

};
