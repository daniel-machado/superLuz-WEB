
import api from "./api";


export const quizStatisticsService = {

  getByUserQuizStatisticsUseCase: async (userId: string): Promise<any> => {
    const token = localStorage.getItem('token')
  
    try {
      const res = await api.get(`/quiz-statistics/by-user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = res.data;
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

};
