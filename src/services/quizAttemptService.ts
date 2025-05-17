
import api from "./api";


export const quizAttemptService = {

  submitQuiz: async (data: { userId: string, quizId: string, answers: any }): Promise<any> => {
    const token = localStorage.getItem('token');
    try {
        const response = await api.post("quiz-user-attempt/submit", data, {
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
        || 'erro ao submeter quiz'
        throw new Error(errorMessage)
      } else {
        console.error("Erro ao registrar", error.message);
        throw new Error(`Erro ao registrar ${error.messagem || "Erro ao conectar com o servidor"}`);
      }
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

  deleteQuiz: async (quizId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.delete(`quiz/delete/${quizId}`, {
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

  ListAllQuiz: async (token?: string | null): Promise<any> => {
    const tokenAux = localStorage.getItem('token')
   
    try {
      const res = await api.get("quiz/list", {
      headers: {
        Authorization: `Bearer ${token ? token : tokenAux}`
      }
    });
    const data = res.data.result.quizzes;
    return data

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

  getQuizID: async (quizId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    


    try {
    const res = await api.get(`quiz/${quizId}`, {
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
        || 'erro ao deletar'
        throw new Error(errorMessage)
      } else {
        console.error("Erro ao registrar", error.message);
        throw new Error(`Erro ao registrar ${error.messagem || "Erro ao conectar com o servidor"}`);
      }
    }
  },

  listByQuizSpecialty: async (specialtyId: string): Promise<any> => {
    const token = localStorage.getItem('token')
   

      try {
   const response = await api.get(`quiz/list-quiz-specialty${specialtyId}`, {
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
        || 'erro ao deletar'
        throw new Error(errorMessage)
      } else {
        console.error("Erro ao registrar", error.message);
        throw new Error(`Erro ao registrar ${error.messagem || "Erro ao conectar com o servidor"}`);
      }
    }
  },

};
