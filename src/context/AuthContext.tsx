import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { UserDTO } from "../dtos/UserDTO";
import { SignUpFormData } from "../dtos/SignUpFormData";
import { userService } from '../services/userService';
import { unitsService } from '../services/unitsService';
import { Unit } from '../dtos/UnitDTO';
import { specialtyService } from '../services/specialtyService';
import { classService } from '../services/classService';
import { UserRole } from '../services/permissions/permissionsService';
import toast from 'react-hot-toast';




export interface UserResponseDTO {
  success: boolean;
  message: string;
  user: {
    user: UserDTO;  // user está aninhado dentro de outro 'user'
  };
}




export interface UnitsResponse {
  success: boolean;
  message: string;
  units: {
    units: Unit[];
  };
}




// Definição do tipo do contexto
interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: UserResponseDTO | null;
  token: string | null;
  units: Unit[];
  userRole: UserRole | undefined;
  specialtys: any[];
  classe: any[];
  findUnits: () => Promise<void>;
  findSpecialtys: () => Promise<void>;
  findClass: () => Promise<void>;
  signin: (email: string, password: string) => Promise<void>;
  signup: (userData: SignUpFormData) => Promise<void>;
  signout: () => Promise<void>;
  setUser: (user: UserResponseDTO) => void; // Adicionando setUser à interface
}




// Criando o contexto com um valor inicial undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);




// Componente do provedor de autenticação
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUserState] = useState<UserResponseDTO | null>(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [specialtys, setSpecialtys] = useState<any[]>([]);
  const [classe, setClasse] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole | undefined>(undefined);


  // Função setUser que será exposta no contexto
  const setUser = useCallback((newUser: UserResponseDTO) => {
    setUserState(newUser);
    setUserRole(newUser.user.user.role);
  }, []);


  const loadUser = useCallback(async () => {
    if (token) {
      try {
        const user = await userService.getUserData(token);
        setUserState(user);
        setUserRole(user.user.user.role); // Armazena o papel do usuário
        setIsAuthenticated(true);
      } catch (error: any) {
        console.error("Erro ao decodificar token:", error);
        setUserState(null);
        setIsAuthenticated(false);
        toast.error(`Error: ${error.message}`, {
          position: 'bottom-right',
          icon: '🚫',
          duration: 5000,
        });
      }
    } else {
      setUserState(null);
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, [token]);




  const signin = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.signin(email, password);
      if (response.accessToken) {
        localStorage.setItem('token', response.accessToken as string);
        localStorage.setItem('refreshToken', response.refreshToken as string);
        setToken(response.accessToken as string);
        setRefreshToken(response.refreshToken as string);
        setIsAuthenticated(true);
        findUnits();
        findSpecialtys();
        findClass();
      }
    } catch (error) {
      console.error("Erro no login:", error);
      throw new Error("Falha no login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  }, []);




  const findUnits = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await unitsService.ListAllUnits(token);
      setUnits(response.units.units);
    } catch (error: any) {
      console.error('Erro ao buscar unidades', error);
      toast.error(`Error: ${error.message}`, {
          position: 'bottom-right',
          icon: '🚫',
          duration: 5000,
        });
    }
  }, []);




  const findSpecialtys = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await specialtyService.ListAllSpecialty(token);
      setSpecialtys(response.result.specialty);
    } catch (error: any) {
      console.error('Erro ao buscar especialidades', error);
      toast.error(`Error: ${error.message}`, {
          position: 'bottom-right',
          icon: '🚫',
          duration: 5000,
        });
    }
  }, []);




  const findClass = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await classService.ListAllClass(token);
      setClasse(response.result.classAll);
    } catch (error: any) {
      console.error('Erro ao buscar classes', error);
      toast.error(`Error: ${error.message}`, {
          position: 'bottom-right',
          icon: '🚫',
          duration: 5000,
        });
    }
  }, []);




  const signout = useCallback(async () => {
    try {
      if (refreshToken) {
        await authService.signout(refreshToken); // Apenas se houver refreshToken
      }
    } catch (error: any) {
      console.warn("Erro ao deslogar no backend:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      setToken(null);
      setRefreshToken(null);
      setUserState(null);
      setIsAuthenticated(false);
    }
  }, [refreshToken]);




  const refreshAuthToken = useCallback(async () => {
    if (!refreshToken) {
      console.warn("Sem refresh token disponível. Deslogando usuário...");
      await signout();
      return;
    }
 
    setLoading(true);
    try {
      const newToken = await authService.refreshToken(refreshToken);
      localStorage.setItem("token", newToken);
      setToken(newToken);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error("Erro ao tentar renovar o token:", error);
      toast.error(`Error: ${error.message}`, {
          position: 'bottom-right',
          icon: '🚫',
          duration: 5000,
        });
     
      if (!error.response) {
        console.warn("Erro inesperado: sem resposta do servidor.");
        await signout();
        return;
      }
 
      // 🚀 Se o backend responder 401, força logout imediato
      if (error.response.status === 401) {
        console.warn("Refresh token inválido ou expirado. Deslogando usuário...");
        await signout();
      }
    } finally {
      setLoading(false);
    }
  }, [refreshToken, signout]);
 
 




  const signup = useCallback(async (userData: SignUpFormData) => {
    try {
      await authService.signup(userData);
      signin(userData.email, userData.password);
    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      toast.error(`Error: ${error.message}`, {
          position: 'bottom-right',
          icon: '🚫',
          duration: 5000,
        });
      throw new Error(`Erro no cadastro ${error}`);
     
    } finally {
      setLoading(false);
    }
  }, [signin]);




  useEffect(() => {
    loadUser();
  }, [loadUser]);




  useEffect(() => {
    if (!token) {
      console.warn("Nenhum token disponível. Usuário deve estar deslogado.");
      return;
    }
 
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const isExpired = decoded.exp * 1000 < Date.now();
 
      if (isExpired) {
        console.warn("Token expirado, tentando renovar...");
        refreshAuthToken();
      } else {
        findUnits();
        findSpecialtys();
        findClass();
      }
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
      signout(); // Se houver erro no token, desloga
    }
  }, [token, refreshAuthToken, findUnits, findSpecialtys, findClass, signout]);




  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      loading,
      token,
      units,
      userRole,
      specialtys,
      classe,
      findSpecialtys,
      findClass,
      findUnits,
      signup,
      signin,
      signout,
      setUser  // Adicionar setUser ao valor do contexto
    }}>
      {children}
    </AuthContext.Provider>
  );
};




// Hook para consumir o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};







































// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import { authService } from '../services/authService';
// import { UserDTO } from "../dtos/UserDTO"; 
// import { SignUpFormData } from "../dtos/SignUpFormData"; 
// import { userService } from '../services/userService';
// import { unitsService } from '../services/unitsService';
// import { Unit } from '../dtos/UnitDTO';
// import { specialtyService } from '../services/specialtyService';
// import { classService } from '../services/classService';
// import { UserRole } from '../services/permissions/permissionsService';
// import toast from 'react-hot-toast';

// export interface UserResponseDTO {
//   success: boolean;
//   message: string;
//   user: {
//     user: UserDTO;  // user está aninhado dentro de outro 'user'
//   };
// }

// export interface UnitsResponse {
//   success: boolean;
//   message: string;
//   units: {
//     units: Unit[];
//   };
// }

// // Definição do tipo do contexto
// interface AuthContextType {
//   isAuthenticated: boolean;
//   loading: boolean;
//   user: UserResponseDTO | null;
//   token: string | null;
//   units: Unit[];
//   userRole: UserRole | undefined;
//   specialtys: any[];
//   classe: any[];
//   findUnits: () => Promise<void>;
//   findSpecialtys: () => Promise<void>;
//   findClass: () => Promise<void>;
//   signin: (email: string, password: string) => Promise<void>;
//   signup: (userData: SignUpFormData) => Promise<void>;
//   signout: () => Promise<void>;
// }

// // Criando o contexto com um valor inicial undefined
// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Componente do provedor de autenticação
// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState<UserResponseDTO | null>(null);
//   const [token, setToken] = useState(localStorage.getItem('token') || null);
//   const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || null);
//   const [units, setUnits] = useState<Unit[]>([]);
//   const [specialtys, setSpecialtys] = useState<any[]>([]);
//   const [classe, setClasse] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [userRole, setUserRole] = useState<UserRole | undefined>(undefined);

//   const loadUser = useCallback(async () => {
//     if (token) {
//       try {
//         const user = await userService.getUserData(token);
//         setUser(user);
//         setUserRole(user.user.user.role); // Armazena o papel do usuário
//         setIsAuthenticated(true);
//       } catch (error: any) {
//         console.error("Erro ao decodificar token:", error);
//         setUser(null);
//         setIsAuthenticated(false);
//         toast.error(`Error: ${error.message}`, {
//           position: 'bottom-right',
//           icon: '🚫',
//           duration: 5000,
//         });
//       }
//     } else {
//       setUser(null);
//       setIsAuthenticated(false);
//     }
//     setLoading(false);
//   }, [token]);

//   const signin = useCallback(async (email: string, password: string) => {
//     setLoading(true);
//     try {
//       const response = await authService.signin(email, password);
//       if (response.accessToken) {
//         localStorage.setItem('token', response.accessToken as string);
//         localStorage.setItem('refreshToken', response.refreshToken as string);
//         setToken(response.accessToken as string);
//         setRefreshToken(response.refreshToken as string);
//         setIsAuthenticated(true);
//         findUnits();
//         findSpecialtys();
//         findClass();
//       }
//     } catch (error) {
//       console.error("Erro no login:", error);
//       throw new Error("Falha no login. Verifique suas credenciais.");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const findUnits = useCallback(async () => {
//     const token = localStorage.getItem('token');
//     try {
//       const response = await unitsService.ListAllUnits(token);
//       setUnits(response.units.units);
//     } catch (error: any) {
//       console.error('Erro ao buscar unidades', error);
//       toast.error(`Error: ${error.message}`, {
//           position: 'bottom-right',
//           icon: '🚫',
//           duration: 5000,
//         });
//     }
//   }, []);

//   const findSpecialtys = useCallback(async () => {
//     const token = localStorage.getItem('token');
//     try {
//       const response = await specialtyService.ListAllSpecialty(token);
//       setSpecialtys(response.result.specialty);
//     } catch (error: any) {
//       console.error('Erro ao buscar especialidades', error);
//       toast.error(`Error: ${error.message}`, {
//           position: 'bottom-right',
//           icon: '🚫',
//           duration: 5000,
//         });
//     }
//   }, []);

//   const findClass = useCallback(async () => {
//     const token = localStorage.getItem('token');
//     try {
//       const response = await classService.ListAllClass(token);
//       setClasse(response.result.classAll);
//     } catch (error: any) {
//       console.error('Erro ao buscar classes', error);
//       toast.error(`Error: ${error.message}`, {
//           position: 'bottom-right',
//           icon: '🚫',
//           duration: 5000,
//         });
//     }
//   }, []);

//   const signout = useCallback(async () => {
//     try {
//       if (refreshToken) {
//         await authService.signout(refreshToken); // Apenas se houver refreshToken
//       }
//     } catch (error: any) {
//       console.warn("Erro ao deslogar no backend:", error);
//     } finally {
//       localStorage.removeItem("token");
//       localStorage.removeItem("refreshToken");
//       setToken(null);
//       setRefreshToken(null);
//       setUser(null);
//       setIsAuthenticated(false);
//     }
//   }, [refreshToken]);

//   // const refreshAuthToken = useCallback(async () => {
//   //   if (!refreshToken) {
//   //     console.warn("Sem refresh token disponível. Deslogando usuário...");
//   //     await signout(); // Aguarde o logout corretamente
//   //     return;
//   //   }
  
//   //   setLoading(true);
//   //   try {
//   //     const newToken = await authService.refreshToken(refreshToken);
//   //     localStorage.setItem("token", newToken);
//   //     setToken(newToken);
//   //     setIsAuthenticated(true);
//   //   } catch (error: any) {
//   //     console.error("Erro ao tentar renovar o token:", error);
//   //     if (error.response?.status === 401) {
//   //       console.warn("Refresh token expirado. Forçando logout...");
//   //       await signout(); // Força logout quando o refresh token expira
//   //     }
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // }, [refreshToken, signout]);
//   const refreshAuthToken = useCallback(async () => {
//     if (!refreshToken) {
//       console.warn("Sem refresh token disponível. Deslogando usuário...");
//       await signout();
//       return;
//     }
  
//     setLoading(true);
//     try {
//       const newToken = await authService.refreshToken(refreshToken);
//       localStorage.setItem("token", newToken);
//       setToken(newToken);
//       setIsAuthenticated(true);
//     } catch (error: any) {
//       console.error("Erro ao tentar renovar o token:", error);
//       toast.error(`Error: ${error.message}`, {
//           position: 'bottom-right',
//           icon: '🚫',
//           duration: 5000,
//         });
      
//       if (!error.response) {
//         console.warn("Erro inesperado: sem resposta do servidor.");
//         await signout();
//         return;
//       }
  
//       // 🚀 Se o backend responder 401, força logout imediato
//       if (error.response.status === 401) {
//         console.warn("Refresh token inválido ou expirado. Deslogando usuário...");
//         await signout();
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [refreshToken, signout]);
  
  

//   const signup = useCallback(async (userData: SignUpFormData) => {
//     try {
//       await authService.signup(userData);
//       signin(userData.email, userData.password);
//     } catch (error: any) {
//       console.error("Erro no cadastro:", error);
//       toast.error(`Error: ${error.message}`, {
//           position: 'bottom-right',
//           icon: '🚫',
//           duration: 5000,
//         });
//       throw new Error(`Erro no cadastro ${error}`);
      
//     } finally {
//       setLoading(false);
//     }
//   }, [signin]);

//   useEffect(() => {
//     loadUser();
//   }, [loadUser]);

//   useEffect(() => {
//     if (!token) {
//       console.warn("Nenhum token disponível. Usuário deve estar deslogado.");
//       return;
//     }
  
//     try {
//       const decoded = JSON.parse(atob(token.split(".")[1]));
//       const isExpired = decoded.exp * 1000 < Date.now();
  
//       if (isExpired) {
//         console.warn("Token expirado, tentando renovar...");
//         refreshAuthToken();
//       } else {
//         findUnits();
//         findSpecialtys();
//         findClass();
//       }
//     } catch (error) {
//       console.error("Erro ao decodificar token:", error);
//       signout(); // Se houver erro no token, desloga
//     }
//   }, [token]);
  
  
  

//   // useEffect(() => {
//   //   if (token) {
//   //     const decoded = JSON.parse(atob(token.split('.')[1]));
//   //     const isExpired = decoded.exp * 1000 < Date.now();
  
//   //     if (isExpired) {
//   //       refreshAuthToken();
//   //     } else {
//   //       findUnits();
//   //       findSpecialtys();
//   //       findClass();
//   //     }
//   //   }
//   // }, [token, refreshAuthToken]);

//   return (
//     <AuthContext.Provider value={{
//       isAuthenticated,
//       user,
//       loading,
//       token,
//       units,
//       userRole,
//       specialtys,
//       classe,
//       findSpecialtys,
//       findClass,
//       findUnits,
//       signup,
//       signin,
//       signout
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Hook para consumir o contexto de autenticação
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth deve ser usado dentro de um AuthProvider");
//   }
//   return context;
// };


















































// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { authService } from '../services/authService'
// import { UserDTO } from "../dtos/UserDTO"; 
// import { SignUpFormData } from "../dtos/SignUpFormData"; 
// import { userService } from '../services/userService';
// import { unitsService } from '../services/unitsService';
// import { Unit } from '../dtos/UnitDTO';
// import { specialtyService } from '../services/specialtyService';

// export interface UserResponseDTO {
//   success: boolean;
//   message: string;
//   user: {
//     user: UserDTO;  // user está aninhado dentro de outro 'user'
//   };
// }

// export interface UnitsResponse {
//   success: boolean;
//   message: string;
//   units: {
//     units: Unit[];
//   };
// };

// // Definição do tipo do contexto
// interface AuthContextType {
//   isAuthenticated: boolean;
//   loading: boolean;
//   user: UserResponseDTO | null;
//   token: string | null;
//   units: Unit[];
//   specialtys: any[];
//   findUnits: () => Promise<void>;
//   findSpecialtys: () => Promise<void>;
//   signin: (email: string, password: string) => Promise<void>;
//   signup: (userData: SignUpFormData) => Promise<void>;
//   signout: () => Promise<void>;
// }

// // Criando o contexto com um valor inicial undefined
// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Componente do provedor de autenticação
// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState<UserResponseDTO | null>(null);
//   const [token, setToken] = useState(localStorage.getItem('token') || null)
//   const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || null)
//   const [units, setUnits] = useState<Unit[]>([])
//   const [specialtys, setSpecialtys] = useState<any[]>([])
//   const [loading, setLoading] = useState(true);

//     // // Verifica se o token está expirado e atualiza automaticamente
//     // useEffect(() => {
//     //   const loadUser = () => {
//     //     if (token) {
//     //       const decoded = JSON.parse(atob(token.split('.')[1]));
//     //       setUser(decoded)
//     //       setLoading(false)
//     //     }
//     //   }
//     //   loadUser();
//     // }, [token]);


//     useEffect(() => {
//       const loadUser = async () => {
//         if (token) {
//           try {
//             //const decoded = JSON.parse(atob(token.split('.')[1]));
//             const user =  await userService.getUserData(token)
//             setUser(user);
//             setIsAuthenticated(true);
//           } catch (error) {
//             console.error("Erro ao decodificar token:", error);
//             setUser(null);
//             setIsAuthenticated(false);
//           }
//         } else {
//           setUser(null);
//           setIsAuthenticated(false);
//         }
//         setLoading(false); // 🔹 Certifica-se de que loading sempre será atualizado
//       };
    
//       loadUser();
//     }, [token]);

    
//   // Verifica se o token está expirado e atualiza automaticamente
//   useEffect(() => {
//     if (token) {
//       const decoded = JSON.parse(atob(token.split('.')[1]));
//       const isExpired = decoded.exp * 1000 < Date.now();
//       if (isExpired) {
//         refreshAuthToken();
//       }
//       findUnits()
//       findSpecialtys()
//     }
//   }, [token]);
    
//     // 🔹 Login
//   const signin = async (email: string, password: string) => {
//     setLoading(true)
//     try {
//       const response = await authService.signin(email, password);
      
//       if (response.accessToken) {
        
//         localStorage.setItem('token', response.accessToken as string);
//         localStorage.setItem('refreshToken', response.refreshToken as string);
//         setToken(response.accessToken as string);
//         setRefreshToken(response.refreshToken as string);

//         // Decodificar o token para obter informações do usuário (opcional)
//         const decoded = JSON.parse(atob(response.accessToken.split('.')[1]));
//         setUser(decoded);
//         setIsAuthenticated(true)

//         findUnits()
//         findSpecialtys()
//       }
//     } catch (error) {
//       console.error("Erro no login:", error);
//       throw new Error("Falha no login. Verifique suas credenciais.");
//     } finally {
//       setLoading(false)
//     }
//   };

//   // Função para buscar unidades
//   const findUnits = async () => {
//     const token = await localStorage.getItem('token')
//     try {
//       const response = await unitsService.ListAllUnits(token);
//       setUnits(response.units.units)
//     } catch (error) {
//       console.error('Erro ao buscar unidades', error);
//     }
//   };

//   // Função para buscar unidades
//   const findSpecialtys = async () => {
//     const token = await localStorage.getItem('token')
//     try {
//       const response = await specialtyService.ListAllSpecialty(token);
//       setSpecialtys(response)
//     } catch (error) {
//       console.error('Erro ao buscar especialidades', error);
//     }
//   };

//   // Função para fazer logout
//   const signout = async () => {
//     try {
//       await authService.signout(refreshToken);
//       localStorage.removeItem('token');
//       localStorage.removeItem('refreshToken');
//       setToken(null);
//       setRefreshToken(null);
//       setUser(null);
//       setIsAuthenticated(false);
//     } catch (error) {
//       console.error('Logout failed:', error);
//     }
//   };

//   // Função para atualizar o token
//   const refreshAuthToken = async () => {
//     setLoading(true); 
//     try {
//       const newToken = await authService.refreshToken(refreshToken);
//       localStorage.setItem('token', newToken);
//       setToken(newToken);
//       setIsAuthenticated(true);
//     } catch (error) {
//       console.error('Failed to refresh token:', error);
//       signout(); // Desloga o usuário se o refresh token falhar
//     } finally {
//       setLoading(false)
//     }
//   };

//   const signup = async (userData: SignUpFormData) => {
//     try {
//       await authService.signup(userData);
//       signin(userData.email, userData.password);
//     } catch (error) {
//       console.error("Erro no cadastro:", error);
//       throw new Error(`Erro no cadastro ${error}`);
//     }finally {
//       setLoading(false)
//     }
//   };

  
//   // // 🔹 Verifica se o usuário está autenticado
//   // const checkAuth = async () => {
//   //   setLoading(true); 
//   //   try {
//   //     const isAuth = await authService.checkAuth();
//   //     console.log("ISAUTH", isAuth)
//   //     if (isAuth) {
//   //       const userData = await authService.getUserData();
//   //       setUser(userData);
//   //       setIsAuthenticated(true);
//   //     } else {
//   //       setUser(null);
//   //       setIsAuthenticated(false);
//   //     }
//   //   } catch (error) {
//   //     console.error("Erro ao verificar autenticação:", error);
//   //     setUser(null);
//   //     setIsAuthenticated(false);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };


//   // // 🔹 Logout
//   // const logout = async () => {
//   //   try {
//   //     await authService.logout();
//   //     setUser(null);
//   //     setIsAuthenticated(false);
//   //   } catch (error) {
//   //     console.error("Erro no logout:", error);
//   //   }
//   // };


  
//   // // Verifica se o usuário está autenticado ao carregar a aplicação
//   // useEffect(() => {
//   //   checkAuth();
//   // }, []);




//   return (
//     <AuthContext.Provider value={{ 
//       isAuthenticated, 
//       user,
//       loading,
//       token,
//       units,
//       specialtys,
//       findSpecialtys,
//       findUnits,
//       signup,
//       signin, 
//       signout 
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// // Hook para consumir o contexto de autenticação
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth deve ser usado dentro de um AuthProvider");
//   }
//   return context;
// };
