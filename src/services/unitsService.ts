
import api from "./api";


export const unitsService = {

  createUnit: async (payload: any): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.post("unit/createUnit", {...payload}, {
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

  updateUnit: async (unitId: string, name: string, photo: string): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.put(`unit/updateUnit/${unitId}`, {name, photo}, {
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

  deleteUnit: async (unitId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.delete(`unit/deleteUnit/${unitId}`, {
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

  ListAllUnits: async (token?: string | null): Promise<any> => {
    const tokenAux = localStorage.getItem('token')
    const res = await api.get("unit/getunits", {
      headers: {
        Authorization: `Bearer ${token ? token : tokenAux}`
      }
    });
    return res.data;
  },

  getUnitById: async (unitId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    const res = await api.get(`unit/getunit/${unitId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  },
  
  existCounselorUnit: async (userId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.get(`unit/exist-counselor-unit/${userId}`, {
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
        || 'erro ao procurar se existe'
        throw new Error(errorMessage)
      } else {
        console.error("Erro ao registrar", error.message);
        throw new Error(`Erro ao registrar ${error.messagem || "Erro ao conectar com o servidor"}`);
      }
    }
  },

  existDbvUnit: async (userId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.get(`unit/exist-dbv-unit/${userId}`, {
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
        || 'erro ao procurar se existe na unidade'
        throw new Error(errorMessage)
      } else {
        console.error("Erro ao registrar", error.message);
        throw new Error(`Erro ao registrar ${error.messagem || "Erro ao conectar com o servidor"}`);
      }
    }
  },

  removeCounselorFromUnit: async (unitId: string, userId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    const res = await api.delete(`/unit/removecounselor/${unitId}/counselor/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return res.data;
  },

  removeDbvFromUnit: async (unitId: string, userId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    const res = await api.delete(`/unit/removedbv/${unitId}/dbv/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  },

    addCounselorFromUnit: async (unitId: string, userId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    const res = await api.post(`/unit/${unitId}/counselor`, { userId }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return res.data;
  },

  addDbvFromUnit: async (unitId: string, userId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    const res = await api.post(`/unit/${unitId}/dbv`, {userId}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  },

};
