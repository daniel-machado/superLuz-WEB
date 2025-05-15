
import api from "./api";

export const userService = {

  getUserData: async (token: string): Promise<any>=> {
    try {
      const response = await api.get("/user/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;  
    } catch (error: any) {
      console.error("❌ Erro ao buscar dados do usuário:", error.response?.data || error.message);
      throw new Error(`❌ Erro ao buscar dados do usuário: ${error}`);    
    }
  },

  usersPending: async (): Promise<any>=> {
    const token = localStorage.getItem('token')
    try {
      const response = await api.get("user/users-pending", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.usersPending.usersPending;  
    } catch (error: any) {   
      console.error("❌ Erro não foi possível buscar usuários pendentes", error.response?.data || error.message);
      throw new Error(`❌ Erro ao buscar dados do usuário pendentes: ${error}`);    
    }
  },

  getAllUsers: async (): Promise<any>=> {
    const token = localStorage.getItem('token')
    try {
      const response = await api.get("/user/users", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.users.users;  
    } catch (error: any) {
      console.error("❌ Erro não foi possível buscar usuários: ", error.response?.data || error.message);
      throw new Error(`❌ Erro ao buscar dados do usuário: ${error}`);        
    }
  },

  approveUser: async (userId: string, payload: any): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.patch(`user/approve-user/${userId}`, {...payload}, {
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;

    } catch (error: any) {
      console.error("Error ao aprovar usuário", error.response?.data || error.message);
      throw new Error(`Erro ao aprovar usuário: ${error}`);
    }
  },

  getUser: async (userId: string): Promise<any>=> {
    const token = localStorage.getItem('token')
    try {
      const response = await api.get(`/user/get-user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = response.data.user
      console.log("DATA USER", data)
      return data
    } catch (error: any) {
      console.error("❌ Erro não foi possível buscar usuário: ", error.response?.data || error.message);
      throw new Error(`❌ Erro ao buscar dados do usuário: ${error}`);        
    }
  },
};
