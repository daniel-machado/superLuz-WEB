import api from './api';


// Interface para os dados de registro de leitura
interface RegisterReadingData {
  userId: string;
  book: string;
  chapter: string;
  verse: string;
  pointsEarned?: number;
}


// Interface para as informações do streak
interface StreakInfoResponse {
  streakInfo: {
    currentStreak: number;
    lives: number;
    lastReadingDate: string | null;
    hasReadToday: boolean;
    streakActive: boolean
  }
  
}


// Interface para o histórico de leituras
interface ReadingHistory {
  readings: Array<{
    id: string;
    userId: string;
    date: string;
    readAt: string;
    verse: string;
    book: string;
    chapter: string;
    pointsEarned: number;
    life: number;
    streak: number;
  }>;
  totalDays: number;
  longestStreak: number;
}


// Service para manipulação do sistema de leituras diárias
export const DailyReadingService = {
  /**
   * Registra uma leitura diária
   * @param data Dados da leitura
   * @returns Resposta da API com informações da leitura e do streak
   */
  async registerReading(data: RegisterReadingData): Promise<any> {
    const token = localStorage.getItem('token')
    try {
      const response = await api.post("/daily-reading/register", data, {
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
        || 'erro ao registrar'
        throw new Error(errorMessage)
      } else {
        console.error("Erro ao registrar", error.message);
        throw new Error(`Erro ao registrar ${error.messagem || "Erro ao conectar com o servidor"}`);
      }
    }
  },


  /**
   * Obtém as informações do streak atual do usuário
   * @param userId ID do usuário
   * @returns Informações do streak
   */
  async getStreakInfo(userId: string): Promise<StreakInfoResponse> {
    const token = localStorage.getItem('token')
    try {
      const response = await api.get(`/daily-reading/streak/${userId}`, {
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
        || 'erro ao buscar'
        throw new Error(errorMessage)
      } else {
        console.error("Erro ao registrar", error.message);
        throw new Error(`Erro ao registrar ${error.messagem || "Erro ao conectar com o servidor"}`);
      }
    }
  },


  /**
   * Obtém o histórico de leituras do usuário
   * @param userId ID do usuário
   * @returns Histórico de leituras
   */
  async getReadingHistory(userId: string): Promise<ReadingHistory> {
    const token = localStorage.getItem('token')
    try {
      const response = await api.get(`/daily-reading/history/${userId}`, {
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
        || 'erro ao registrar'
        throw new Error(errorMessage)
      } else {
        console.error("Erro ao registrar", error.message);
        throw new Error(`Erro ao registrar ${error.messagem || "Erro ao conectar com o servidor"}`);
      }
    }
  }
};
