
import api from "./api";


export const quizDetailedAttemptService = {

  findByAttemptId: async (attemptId: string): Promise<any> => {
    const token = localStorage.getItem('token');
    try {
        const response = await api.get(`quiz-detailed-attempt/attempt/${attemptId}`, {
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

  findByUserAndQuiz: async (userId: string, quizId: string): Promise<any> => {
    const token = localStorage.getItem('token');
    try {
        const response = await api.get(`quiz-detailed-attempt/user/${userId}/quiz/${quizId}`, {
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


  findByUser: async (userId: string): Promise<any> => {
    const token = localStorage.getItem('token');
    try {
        const response = await api.get(`quiz-detailed-attempt/user/${userId}`, {
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
}