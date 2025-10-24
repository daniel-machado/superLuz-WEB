// playersService.ts
import api from "../api";

export interface Player {
  id: number | string;
  name: string;
  photo?: string;
  birthDate?: string;
  gender?: string;
  groupId?: number | string;
}

export interface PlayerInput {
  name: string;
  photo?: string;
  birthDate?: string;
  gender?: string;
  groupId?: number | string;
}

export const playersService = {
  // Listar todos os players
  listAllPlayers: async (): Promise<Player[]> => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.get("players/list-all", {
        headers: { 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;
    } catch (error: any) {
      if(error.response && error.response.data){
        const errorMessage = error.response.data.error 
          || error.response.data.message 
          || 'Erro ao buscar jogadores';
        throw new Error(errorMessage);
      } else {
        console.error("Erro ao buscar jogadores", error.message);
        throw new Error(`Erro ao buscar jogadores: ${error.message || "Erro ao conectar com o servidor"}`);
      }
    }
  },

  // Criar player
  createPlayer: async (playerData: PlayerInput): Promise<any> => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.post("players/create", playerData, {
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
          || 'Erro ao criar jogador';
        throw new Error(errorMessage);
      } else {
        console.error("Erro ao criar jogador", error.message);
        throw new Error(`Erro ao criar jogador: ${error.message || "Erro ao conectar com o servidor"}`);
      }
    }
  },

  // Atualizar player
  updatePlayer: async (playerId: string | number, playerData: Partial<PlayerInput>): Promise<any> => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.patch(`players/update/${playerId}`, playerData, {
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
          || 'Erro ao atualizar jogador';
        throw new Error(errorMessage);
      } else {
        console.error("Erro ao atualizar jogador", error.message);
        throw new Error(`Erro ao atualizar jogador: ${error.message || "Erro ao conectar com o servidor"}`);
      }
    }
  },

  // Deletar player
  deletePlayer: async (playerId: string | number): Promise<any> => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.delete(`players/delete/${playerId}`, {
        headers: { 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;
    } catch (error: any) {
      if(error.response && error.response.data){
        const errorMessage = error.response.data.error 
          || error.response.data.message 
          || 'Erro ao deletar jogador';
        throw new Error(errorMessage);
      } else {
        console.error("Erro ao deletar jogador", error.message);
        throw new Error(`Erro ao deletar jogador: ${error.message || "Erro ao conectar com o servidor"}`);
      }
    }
  },

  // Buscar player por ID (opcional)
  getPlayerById: async (playerId: string | number): Promise<Player> => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.get(`players/list-one/${playerId}`, {
        headers: { 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;
    } catch (error: any) {
      if(error.response && error.response.data){
        const errorMessage = error.response.data.error 
          || error.response.data.message 
          || 'Erro ao buscar jogador';
        throw new Error(errorMessage);
      } else {
        console.error("Erro ao buscar jogador", error.message);
        throw new Error(`Erro ao buscar jogador: ${error.message || "Erro ao conectar com o servidor"}`);
      }
    }
  },
};