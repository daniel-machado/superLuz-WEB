// groupsService.ts
import api from "../api";

export interface Group {
  id: string;
  name: string;
  description?: string;
  // adicione outros campos conforme sua API
}

export interface GroupInput {
  name: string;
  description?: string;
  // adicione outros campos conforme necessário
}

export const groupsService = {
  // Listar todos os grupos
  listAllGroups: async (): Promise<Group[]> => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.get("groups/list-all", {
        headers: { 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;
    } catch (error: any) {
      if(error.response && error.response.data){
        const errorMessage = error.response.data.error 
          || error.response.data.message 
          || 'Erro ao buscar grupos';
        throw new Error(errorMessage);
      } else {
        console.error("Erro ao buscar grupos", error.message);
        throw new Error(`Erro ao buscar grupos: ${error.message || "Erro ao conectar com o servidor"}`);
      }
    }
  },

  // Criar grupo
  createGroup: async (groupData: GroupInput): Promise<any> => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.post("groups/create", groupData, {
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;
    } catch (error: any) {
      if(error.response && error.response.data){
        const errorMessage = error.response.data.error 
          || error.response.data.message 
          || 'Erro ao criar grupo';
        throw new Error(errorMessage);
      } else {
        console.error("Erro ao criar grupo", error.message);
        throw new Error(`Erro ao criar grupo: ${error.message || "Erro ao conectar com o servidor"}`);
      }
    }
  },

  // Atualizar grupo
  updateGroup: async (groupId: string, groupData: GroupInput): Promise<any> => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.patch(`groups/update/${groupId}`, groupData, {
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;
    } catch (error: any) {
      if(error.response && error.response.data){
        const errorMessage = error.response.data.error 
          || error.response.data.message 
          || 'Erro ao atualizar grupo';
        throw new Error(errorMessage);
      } else {
        console.error("Erro ao atualizar grupo", error.message);
        throw new Error(`Erro ao atualizar grupo: ${error.message || "Erro ao conectar com o servidor"}`);
      }
    }
  },

  // Deletar grupo
  deleteGroup: async (groupId: string): Promise<any> => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.delete(`groups/delete/${groupId}`, {
        headers: { 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;
    } catch (error: any) {
      if(error.response && error.response.data){
        const errorMessage = error.response.data.error 
          || error.response.data.message 
          || 'Erro ao deletar grupo';
        throw new Error(errorMessage);
      } else {
        console.error("Erro ao deletar grupo", error.message);
        throw new Error(`Erro ao deletar grupo: ${error.message || "Erro ao conectar com o servidor"}`);
      }
    }
  },

  // Buscar grupo por ID (opcional)
  getGroupById: async (groupId: string): Promise<Group> => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.get(`groups/list-one/${groupId}`, {
        headers: { 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;
    } catch (error: any) {
      if(error.response && error.response.data){
        const errorMessage = error.response.data.error 
          || error.response.data.message 
          || 'Erro ao buscar grupo';
        throw new Error(errorMessage);
      } else {
        console.error("Erro ao buscar grupo", error.message);
        throw new Error(`Erro ao buscar grupo: ${error.message || "Erro ao conectar com o servidor"}`);
      }
    }
  },
};