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
      console.error("Erro no login:", error.response?.data || error.message);
      throw new Error("Falha no login. Verifique suas credenciais.");
    }
  },

  signup: async (payload: SignUpFormData): Promise<any> => {
    try {
      const response = await api.post("/auth/signup", {...payload}, {
        headers: { "Content-Type": "application/json" },
      });

      return response.data;
    } catch (error: any) {
      console.error("Erro ao criar conta:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Erro ao criar conta");
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
      console.error("Erro ao fazer signout:", error.response?.data || error.message);
      throw new Error(error);
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
        console.error("Erro ao fazer refreshToken:", error.response?.data || error.message);
        throw new Error(`Error no refresh Token ${error}`);
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
      console.error("Erro ao enviar codigo de verificação:", error.response?.data || error.message);
      throw new Error(`Erro ao enviar o código de recuperação. ${error}`);
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
      console.error("Erro ao verificar codigo de verificação:", error.response?.data || error.message);
      throw new Error(`Erro ao verificar o código de recuperação. ${error}`);
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
      console.error("Erro ao alterar senha:", error.response?.data || error.message);
      throw new Error(`Erro ao alterar senha. ${error}`);
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
      console.error("Erro ao enviar codigo", error.response?.data || error.message);
      throw new Error(`Erro ao enviar codigo ${error}`);
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
      console.error("Erro ao verificar codigo:", error.response?.data || error.message);
      throw new Error(`Erro ao verificar codigo. ${error}`);
    }
  },
};



