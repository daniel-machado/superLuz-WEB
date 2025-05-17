
import api from "./api";


export const classService = {

  createClass: async (payload: any): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.post("class/create", {...payload}, {
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
        || 'erro ao criar classe'
        throw new Error(errorMessage)
      } else {
        console.error("Erro ao registrar", error.message);
        throw new Error(`Erro ao registrar ${error.messagem || "Erro ao conectar com o servidor"}`);
      }
    }
  },

  updateClass: async (classId: string, payload: any): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.put(`class/update/${classId}`, payload, {
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
        || 'erro ao atualizar classe'
        throw new Error(errorMessage)
      } else {
        console.error("Erro ao registrar", error.message);
        throw new Error(`Erro ao registrar ${error.messagem || "Erro ao conectar com o servidor"}`);
      }
    }
  },

  deleteClass: async (classId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.delete(`class/delete/${classId}`, {
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
        || 'erro ao deletar classe'
        throw new Error(errorMessage)
      } else {
        console.error("Erro ao registrar", error.message);
        throw new Error(`Erro ao registrar ${error.messagem || "Erro ao conectar com o servidor"}`);
      }
    }
  },

  ListAllClass: async (token?: string | null): Promise<any> => {
    const tokenAux = localStorage.getItem('token')
    

  try {
    const res = await api.get("class/list-all", {
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

  ListClassID: async (classId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    
    try {
   const res = await api.get(`class/list-one-id/${classId}`, {
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

  ListFromType: async (category: string): Promise<any> => {
    const token = localStorage.getItem('token')
    
     try {
   const response = await api.put(`class/list-class-type`, category, {
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
      || 'Error ao fazer Login'
      throw new Error(errorMessage)
    } else {
      console.error("Erro ao registrar", error.message);
      throw new Error(`Erro ao registrar ${error.messagem || "Erro ao conectar com o servidor"}`);
    }
  }
  },
};
