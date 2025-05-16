
import api from "./api";


export const dailyVerseBiblicalService = {

  registerRead: async (payload: any): Promise<any> => {
    const token = localStorage.getItem('token')
    //userId, book, verse, chapter
    try {
      const response = await api.post("biblical-daily/verse/read", {...payload}, {
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;

    } catch (error) {
      console.error("Erro ao registrar verso", error);
      throw new Error(`Erro ao registrar verso ${error}`);
    }
  },

  verifyStatusRead: async (userId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.get(`biblical-daily/verse/status/${userId}`, {
        headers: { 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;

    } catch (error) {
      console.error("Erro ao verificar verso", error);
      throw new Error(`Erro ao verificar verso: ${error}`);
    }
  },

  versesAllUser: async (userId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const res = await api.get(`biblical-daily/verse/all/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return res
    } catch (error) {
      console.error("Erro ao buscar verso", error);
      throw new Error(`Erro ao buscar verso: ${error}`);
    }
  },

  versesCount: async (userId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const res = await api.get(`biblical-daily/verse/count/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return res
    } catch (error) {
      console.error("Erro ao buscar numero verso", error);
      throw new Error(`Erro ao buscar numero verso ${error}`);
    }
  },

};
