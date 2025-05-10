
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

    } catch (error) {
      console.error("Erro na criação da Class", error);
      throw new Error(`Erro na criação da Class ${error}`);
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
    } catch (error) {
      console.error("Erro na atualização da class", error);
      throw new Error(`Erro na atualização da class ${error}`);
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

    } catch (error) {
      console.error("Erro ao deleter class", error);
      throw new Error(`Erro ao deletar a class ${error}`);
    }
  },

  ListAllClass: async (token?: string | null): Promise<any> => {
    const tokenAux = localStorage.getItem('token')
    const res = await api.get("class/list-all", {
      headers: {
        Authorization: `Bearer ${token ? token : tokenAux}`
      }
    });
    return res.data;
  },

  ListClassID: async (classId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    const res = await api.get(`class/list-one-id/${classId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  },

  ListFromType: async (category: string): Promise<any> => {
    const token = localStorage.getItem('token')
    const response = await api.put(`class/list-class-type`, category, {
      headers: { 
        "Content-Type": "application/json", 
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  },
};
