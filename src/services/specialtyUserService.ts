
import api from "./api";


export const specialtyUserService = {

  createAssociation: async (payload: any): Promise<any> => {
    const token = localStorage.getItem('token')
    // {
    //   "userId": "3ffe808c-c627-45d8-8cc5-1e9dc1f2d894",
    //   "specialtyId": "3c36985f-6a2f-4523-84be-9c48d908e154"
    // }
    try {
      const response = await api.post("specialty-user/create", {...payload}, {
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;

    } catch (error) {
      console.error("Erro ao associar Especialidade a usuário", error);
      throw new Error(`Erro ao associar Especialidade a usuário: ${error}`);
    }
  },

  updateSpecialtyAssociation: async (id: string, payload: any): Promise<any> => {
    const token = localStorage.getItem('token')
    //userId, specialtyId
    try {
      const response = await api.put(`specialty-user/update/${id}`, payload, {
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro na atualização da associação da especialidade:", error);
      throw new Error(`Erro na atualização da associação da especialidade: ${error}`);
    }
  },

  deleteSpecialtyAssociation: async (id: string): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.delete(`specialty-user/delete/${id}`, {
        headers: { 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;

    } catch (error) {
      console.error("Erro ao deleter associação de especialidade:", error);
      throw new Error(`Erro ao deletar associação de especialidade: ${error}`);
    }
  },

  getAllSpecialtyAssociation: async (): Promise<any> => {
    const token = localStorage.getItem('token')
    const res = await api.get("specialty-user/list", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = res.data.result.specialty;
    return data;
  },

  ListSpecialtyssociationID: async (id: string): Promise<any> => {
    const token = localStorage.getItem('token')
    const res = await api.get(`specialty-user/list-one/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  },

  getByUserAndSpecialty: async (userId: string, specialtyId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    const response = await api.get(`/specialty-user/list-user-and-specialty/user/${userId}/specialty/${specialtyId}`, {
      headers: { 
        "Content-Type": "application/json", 
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  },

  getAllByUser: async (userId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    const response = await api.get(`specialty-user/list-all-user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  getAllBySpecialty: async (specialtyId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    const response = await api.get(`specialty-user/list-all-specialty/${specialtyId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  sendReport: async (id: string, userId: string, specialtyId: string, report: string[]): Promise<any> => {
    const token = localStorage.getItem('token')
    const response = await api.put(`specialty-user/report/${id}`, {userId, specialtyId, report},{
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  approve: async (
    userId: string, 
    specialtyId: string, 
    userIdApproved: string, 
    comment: string[]
  ): Promise<any> => {
    const token = localStorage.getItem('token')
    const response = await api.put(
      `specialty-user/approve/user/${userId}/specialty/${specialtyId}`, 
      {userIdApproved, comment},
      {headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  },

  reject: async (
    userId: string, 
    specialtyId: string, 
    userIdRejected: string, 
    comment: string[]
  ): Promise<any> => {
    const token = localStorage.getItem('token')
    const response = await api.put(
      `specialty-user/reject/user/${userId}/specialty/${specialtyId}`, 
      {userIdRejected, comment},
      {headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  },

};
