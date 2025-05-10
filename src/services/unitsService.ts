
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

    } catch (error) {
      console.error("Erro na criação da unidade:", error);
      throw new Error(`Erro na criação da unidade: ${error}`);
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
    } catch (error) {
      console.error("Erro atualização da unidade:", error);
      throw new Error(`Erro na atualização da unidade: ${error}`);
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

    } catch (error) {
      console.error("Erro ao excluir unidade:", error);
      throw new Error(`Erro ao excluir unidade: ${error}`);
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
    } catch (error) {
      console.error("Error na busca", error);
      throw new Error(`Erro na busca${error}`);
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

};
