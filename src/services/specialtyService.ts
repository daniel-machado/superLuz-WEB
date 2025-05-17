
import api from "./api";


export const specialtyService = {

  createSpecialty: async (payload: any): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.post("specialty/create", {...payload}, {
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

  updateSpecialty: async (specialtyId: string, payload: any): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.put(`specialty/update/${specialtyId}`, payload, {
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

  deleteSpecialty: async (specialtyId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.delete(`specialty/delete/${specialtyId}`, {
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

  ListAllSpecialty: async (token?: string | null): Promise<any> => {
    const tokenAux = localStorage.getItem('token')
    const res = await api.get("specialty/list-all", {
      headers: {
        Authorization: `Bearer ${token ? token : tokenAux}`
      }
    });
    const data = res.data;
    return data
  },

  ListSpecialtyID: async (specialtyId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    const res = await api.get(`specialty/list-one-specialty${specialtyId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  },

  ListFromCategory: async (category: string): Promise<any> => {
    const token = localStorage.getItem('token')
    const response = await api.put(`specialty/list-category`, category, {
      headers: { 
        "Content-Type": "application/json", 
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  },

  ListFromLevel: async (level: number): Promise<any> => {
    const token = localStorage.getItem('token')
    const response = await api.get(`specialty/list-level${level}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },
};
