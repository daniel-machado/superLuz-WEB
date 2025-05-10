
import api from "./api";


export const classUserService = {

  createAssociation: async (payload: any): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.post("class-user/create", {...payload}, {
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;

    } catch (error) {
      console.error("Erro ao associar classe a usuário", error);
      throw new Error(`Erro ao associar classe ao usuário: ${error}`);
    }
  },

  getAllByUserClass: async (userId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.get(`class-user/list-user-all/${userId}`, {
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;

    } catch (error) {
      console.error("Erro ao buscar classe a usuário", error);
      throw new Error(`Erro ao buscar classe ao usuário: ${error}`);
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

  getAll: async (): Promise<any> => {
    const token = localStorage.getItem('token')
    const res = await api.get("class-user/list-all", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = res.data;
    return data;
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
