import { SignUpFormData } from '../dtos/SignUpFormData'
import { UserDTO } from '../dtos/UserDTO'
import api from "./api";


interface LoginResponse {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  user?: UserDTO;
}

export const authService = {

  signin: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>("/auth/signin", { email, password });
      
      return response.data;
   } catch (error: any) {
      //Extraindo a resposta de error da mensagem da API
      if(error.response && error.response.data){
        //Se a API retornar um objetode erro com uma mensagem
        const errorMessage = error.response.data.error 
        || error.response.data.message 
        || 'Error ao fazer Login'
        throw new Error(errorMessage)
      } else {
        console.error("Erro ao registrarr", error.message);
        throw new Error(`Erro ao registrar ${error.messagem || "Erro ao conectar com o servidor"}`);
      }
    }
  },

  signup: async (payload: SignUpFormData): Promise<any> => {
    try {
      const response = await api.post("/auth/signup", {...payload}, {
        headers: { "Content-Type": "application/json" },
      });

      return response.data;
    } catch (error: any) {
      //Extraindo a resposta de error da mensagem da API
      if(error.response && error.response.data){
        //Se a API retornar um objetode erro com uma mensagem
        const errorMessage = error.response.data.error 
        || error.response.data.message 
        || 'erro ao criar conta'
        throw new Error(errorMessage)
      } else {
        console.error("Erro ao registrar", error.message);
        throw new Error(`Erro ao registrar ${error.messagem || "Erro ao conectar com o servidor"}`);
      }
    }
  },

  signout: async (refreshToken: string | null): Promise<void> => {
    const token = localStorage.getItem('token')
    try {
      await api.post("/auth/signout", {refreshToken}, {
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`
        },
      });
   } catch (error: any) {
      //Extraindo a resposta de error da mensagem da API
      if(error.response && error.response.data){
        //Se a API retornar um objetode erro com uma mensagem
        const errorMessage = error.response.data.error 
        || error.response.data.message 
        || 'erro ao sair'
        throw new Error(errorMessage)
      } else {
        console.error("Erro ao registrar", error.message);
        throw new Error(`Erro ao registrar ${error.messagem || "Erro ao conectar com o servidor"}`);
      }
    }
  },

  refreshToken: async (refreshToken: string | null): Promise<string> => {
    try {
      const response = await api.post("/auth/refresh-token", {refreshToken}, {
        headers: { 
          "Content-Type": "application/json", 
        },
      });
      return response.data.accessToken
    } catch (error: any) {
      //Extraindo a resposta de error da mensagem da API
      if(error.response && error.response.data){
        //Se a API retornar um objetode erro com uma mensagem
        const errorMessage = error.response.data.error 
        || error.response.data.message 
        || 'erro no refresh token'
        throw new Error(errorMessage)
      } else {
        console.error("Erro ao registrar", error.message);
        throw new Error(`Erro ao registrar ${error.messagem || "Erro ao conectar com o servidor"}`);
      }
    }
  },

  // checkAuth: async (): Promise<boolean> => {
  //   try {
  //     const accessToken = Cookies.get("accessToken");
  //     if (accessToken) {
  //       const res = await api.post('/auth/refresh-token')
  //       Cookies.set("accessToken", res.data.accessToken, { expires: 7, path: "/" });
  //       return true;
  //     }
  //     return false;
  //   } catch (error) {
  //       console.error("Erro ao verificar autenticação:", error);
  //       return false;
  //     }
  // },

  sendForgotPasswordCode: async (email: string) => {
    try {
      const response = await api.patch('/auth/send-forgot-password-code', { email }, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
   } catch (error: any) {
      //Extraindo a resposta de error da mensagem da API
      if(error.response && error.response.data){
        //Se a API retornar um objetode erro com uma mensagem
        const errorMessage = error.response.data.error 
        || error.response.data.message 
        || 'erro ao enviar código com verificação'
        throw new Error(errorMessage)
      } else {
        console.error("Erro ao registrar", error.message);
        throw new Error(`Erro ao registrar ${error.messagem || "Erro ao conectar com o servidor"}`);
      }
    }
  },

  verifyForgotPasswordCode: async (email: string, providedCode: string, newPassword: string) => {
    try {
      const response = await api.patch('/auth/verify-forgot-password-code', {
        email,
        providedCode,
        newPassword,
      }, {headers: { "Content-Type": "application/json" }});
      return response.data;
   } catch (error: any) {
      //Extraindo a resposta de error da mensagem da API
      if(error.response && error.response.data){
        //Se a API retornar um objetode erro com uma mensagem
        const errorMessage = error.response.data.error 
        || error.response.data.message 
        || 'erro ao verificar código de verificação'
        throw new Error(errorMessage)
      } else {
        console.error("Erro ao registrar", error.message);
        throw new Error(`Erro ao registrar ${error.messagem || "Erro ao conectar com o servidor"}`);
      }
    }
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.patch('/auth/change-password', { oldPassword, newPassword}, 
        {
          headers: { 
            "Content-Type": "application/json",
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
        || 'erro ao alterar senha'
        throw new Error(errorMessage)
      } else {
        console.error("Erro ao registrar", error.message);
        throw new Error(`Erro ao registrar ${error.messagem || "Erro ao conectar com o servidor"}`);
      }
    }
  },

  sendVerificationCode: async (email: string) => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.patch('/auth/send-verification-code', { email}, 
        {
          headers: { 
            "Content-Type": "application/json",
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
        || 'erro ao enviar código'
        throw new Error(errorMessage)
      } else {
        console.error("Erro ao registrar", error.message);
        throw new Error(`Erro ao registrar ${error.messagem || "Erro ao conectar com o servidor"}`);
      }
    }
  },

  verifyVerificationCode: async (email: string, providedCode: string) => {
    const token = localStorage.getItem('token')
    try {
      const response = await api.patch('/auth/verify-verification-code', { email, providedCode}, 
        {
          headers: { 
            "Content-Type": "application/json",
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
        || 'erro ao verificar código'
        throw new Error(errorMessage)
      } else {
        console.error("Erro ao registrar", error.message);
        throw new Error(`Erro ao registrar ${error.messagem || "Erro ao conectar com o servidor"}`);
      }
    }
  },
};



  try {

  } catch (error: any) {
    //Extraindo a resposta de error da mensagem da API
    if(error.response && error.response.data){
      //Se a API retornar um objetode erro com uma mensagem
      const errorMessage = error.response.data.error 
      || error.response.data.message 
      || 'Error ao fazer Login'
      throw new Error(errorMessage)
    } else {
      console.error("Erro ao registrar", error.message);
      throw new Error(`Erro ao registrar ${error.messagem || "Erro ao conectar com o servidor"}`);
    }
  }