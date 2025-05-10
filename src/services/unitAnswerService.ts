
import api from "./api";


export const unitAnswerService = {

  createAnswer: async (payload: any): Promise<any> => {
    const token = localStorage.getItem('token')
    // O que precisa mandar no Payload {
    //   "unitId":"ad6a067e-e0c2-4512-9603-c7efe559efdb",
    //   "questionId":"7b7d4c67-e7e5-4203-b618-f95a382495e4",
    //   "answer":"Sim",
    //   "week": 3
    // }
    try {
      const response = await api.post("unit-answer/create-answer", {...payload}, {
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;

    } catch (error) {
      console.error("Erro na criação da Answer:", error);
      throw new Error(`Erro na criação da Answer: ${error}`);
    }
  },

  deleteAnswer: async (answerId: string): Promise<any> => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.delete(`unit-answer/delete/${answerId}`, {
        headers: { 
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;

    } catch (error) {
      console.error("Erro ao excluir Answer:", error);
      throw new Error(`Erro ao excluir Answer: ${error}`);
    }
  },

  ListUnitAnswer: async (unitId: string, token?: string | null): Promise<any> => {
    const tokenAux = localStorage.getItem('token')
    const res = await api.get(`unit-answer/list-questions/${unitId}`, {
      headers: {
        Authorization: `Bearer ${token ? token : tokenAux}`
      }
    });
    const data = res.data.answers;
    return data
  },

  ListAllAnswer: async (): Promise<any> => {
    const token = localStorage.getItem('token')
    const res = await api.get(`unit-answer/list-all-answers`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  },

};
