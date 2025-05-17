
import api from "./api";


export const individualEvaluationService = {

  createEvaluation: async (payload: any): Promise<any> => {
    const token = localStorage.getItem('token')
    //userId, week
    try {
      const response = await api.post("individual-evaluation/create-evaluation", {...payload}, {
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

  updateEvaluation: async (evaluationId: string, payload: any): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.put(`individual-evaluation/update/${evaluationId}`, {...payload}, {
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

  deleteEvaluation: async (evaluationId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.delete(`individual-evaluation/delete/${evaluationId}`, {
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

  ListAllEvaluation: async (token?: string | null): Promise<any> => {
    const tokenAux = localStorage.getItem('token')
    

    
         try {
     const res = await api.get(`individual-evaluation/list-all`, {
      headers: {
        Authorization: `Bearer ${token ? token : tokenAux}`
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

  ListEvaluationID: async (evaluationId: string): Promise<any> => {
    const token = localStorage.getItem('token')
   

          try {
    const res = await api.get(`individual-evaluation/individual-evaluation/${evaluationId}`, {
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

  ListEvaluationFromUser: async (userId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    

    
          try {
  const res = await api.get(`individual-evaluation/list-all-evaluation/${userId}`, {
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

  ListEvaluationActives: async (): Promise<any> => {
    const token = localStorage.getItem('token')
   
       try {
  const res = await api.get(`individual-evaluation/evaluations-actives`, {
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

  ListEvaluationActivesFromUser: async (userId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    



    
       try {
 const res = await api.get(`individual-evaluation/evaluation-active/${userId}`, {
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
