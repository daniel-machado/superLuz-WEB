
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

    } catch (error) {
      console.error("Erro na criação da Especialidade", error);
      throw new Error(`Erro na criação da especialidade: ${error}`);
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
    } catch (error) {
      console.error("Erro na atualização da Especialidade:", error);
      throw new Error(`Erro na atualização da especialidade: ${error}`);
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

    } catch (error) {
      console.error("Erro ao deleter especialidade:", error);
      throw new Error(`Erro ao deletar a especialidade: ${error}`);
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
