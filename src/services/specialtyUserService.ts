
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

    } catch (error: any) {
      //Extraindo a resposta de error da mensagem da API
      if(error.response && error.response.data){
        //Se a API retornar um objetode erro com uma mensagem
        const errorMessage = error.response.data.error 
        || error.response.data.message 
        || 'erro ao Criar a associação'
        throw new Error(errorMessage)
      } else {
        console.error("Erro ao registrar", error.message);
        throw new Error(`Erro ao registrar ${error.messagem || "Erro ao conectar com o servidor"}`);
      }
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
    } catch (error: any) {
      //Extraindo a resposta de error da mensagem da API
      if(error.response && error.response.data){
        //Se a API retornar um objetode erro com uma mensagem
        const errorMessage = error.response.data.error 
        || error.response.data.message 
        || 'erro ao atualizar a associação'
        throw new Error(errorMessage)
      } else {
        console.error("Erro ao registrar", error.message);
        throw new Error(`Erro ao registrar ${error.messagem || "Erro ao conectar com o servidor"}`);
      }
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

   } catch (error: any) {
      //Extraindo a resposta de error da mensagem da API
      if(error.response && error.response.data){
        //Se a API retornar um objetode erro com uma mensagem
        const errorMessage = error.response.data.error 
        || error.response.data.message 
        || 'erro ao deletar essa associação'
        throw new Error(errorMessage)
      } else {
        console.error("Erro ao registrar", error.message);
        throw new Error(`Erro ao registrar ${error.messagem || "Erro ao conectar com o servidor"}`);
      }
    }
  },

  getAllSpecialtyAssociation: async (): Promise<any> => {
    const token = localStorage.getItem('token')
   

       try {
    const res = await api.get("specialty-user/list", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = res.data.result.specialty;
    return data;
    
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

  ListSpecialtyssociationID: async (id: string): Promise<any> => {
    const token = localStorage.getItem('token')
   
    
       try {
     const res = await api.get(`specialty-user/list-one/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
;
    
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

  getByUserAndSpecialty: async (userId: string, specialtyId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    


       try {
    const response = await api.get(`/specialty-user/list-user-and-specialty/user/${userId}/specialty/${specialtyId}`, {
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
        || 'erro ao deletar'
        throw new Error(errorMessage)
      } else {
        console.error("Erro ao registrar", error.message);
        throw new Error(`Erro ao registrar ${error.messagem || "Erro ao conectar com o servidor"}`);
      }
    }
  },

  getAllByUser: async (userId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    

        try {
    const response = await api.get(`specialty-user/list-all-user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
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

  getAllBySpecialty: async (specialtyId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    
         try {
    const response = await api.get(`specialty-user/list-all-specialty/${specialtyId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
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

  sendReport: async (id: string, userId: string, specialtyId: string, report: string[]): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.put(`specialty-user/report/${id}`, {userId, specialtyId, report},{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    return response.data;
    } catch (error: any) {
      //Extraindo a resposta de error da mensagem da API
      if(error.response && error.response.data){
        //Se a API retornar um objetode erro com uma mensagem
        const errorMessage = error.response.data.error 
        || error.response.data.message 
        || 'erro ao enviar relatório'
        throw new Error(errorMessage)
      } else {
        console.error("Erro ao registrar", error.message);
        throw new Error(`Erro ao registrar ${error.messagem || "Erro ao conectar com o servidor"}`);
      }
    }
  },


  approve: async (
    userId: string, 
    specialtyId: string, 
    userIdApproved: string, 
    comment: string[]
  ): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.put(
        `specialty-user/approve/user/${userId}/specialty/${specialtyId}`, 
            {userIdApproved, comment},
            {headers: {
              Authorization: `Bearer ${token}`
            }
          }
      );
      return response.data;
    } catch (error: any) {
      //Extraindo a resposta de error da mensagem da API
      if(error.response && error.response.data){
        //Se a API retornar um objetode erro com uma mensagem
        const errorMessage = error.response.data.error 
        || error.response.data.message 
        || 'erro ao enviar relatório'
        throw new Error(errorMessage)
      } else {
        console.error("Erro ao registrar", error.message);
        throw new Error(`Erro ao registrar ${error.messagem || "Erro ao conectar com o servidor"}`);
      }
    }
  },

  reject: async (
    userId: string, 
    specialtyId: string, 
    userIdRejected: string, 
    comment: string[]
  ): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.put(
      `specialty-user/reject/user/${userId}/specialty/${specialtyId}`, 
      {userIdRejected, comment},
      {headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error: any) {
      //Extraindo a resposta de error da mensagem da API
      if(error.response && error.response.data){
        //Se a API retornar um objetode erro com uma mensagem
        const errorMessage = error.response.data.error 
        || error.response.data.message 
        || 'erro ao enviar relatório'
        throw new Error(errorMessage)
      } else {
        console.error("Erro ao registrar", error.message);
        throw new Error(`Erro ao registrar ${error.messagem || "Erro ao conectar com o servidor"}`);
      }
    }
  },





};
