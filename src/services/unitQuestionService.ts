
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

  deleteQuestion: async (questionId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.delete(`unit-questions/delete/${questionId}`, {
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
        || 'erro ao enviar deletar'
        throw new Error(errorMessage)
      } else {
        console.error("Erro ao registrar", error.message);
        throw new Error(`Erro ao registrar ${error.messagem || "Erro ao conectar com o servidor"}`);
      }
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
