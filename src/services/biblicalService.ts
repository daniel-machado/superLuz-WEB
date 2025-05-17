
import api from "./api";


export const biblicalService = {
  bibleChapterDay: async (): Promise<any> => {
    try {
      const res = await api.get("/bible/capitulo-do-dia", {});
      const data = res.data; 
      
      return data    
      
    } catch (error: any) {
      //Extraindo a resposta de error da mensagem da API
      if(error.response && error.response.data){
        //Se a API retornar um objetode erro com uma mensagem
        const errorMessage = error.response.data.error 
        || error.response.data.message 
        || 'erro ao buscar verso bíblico'
        throw new Error(errorMessage)
      } else {
        console.error("Erro ao buscar", error.message);
        throw new Error(`Erro ao buscar ${error.messagem || "Erro ao conectar com o servidor"}`);
      }
    }
  },
};
