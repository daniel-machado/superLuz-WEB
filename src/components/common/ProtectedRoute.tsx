import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { hasRoutePermission } from "../../services/permissions/permissionsService"; 


const ProtectedRoute = () => {
  const { token, userRole } = useAuth();
  const location = useLocation();
  
  // Primeiro verificamos se o usuário está autenticado
  if (!token) {
    return <Navigate to="/" replace />;
  }
  
  // Depois verificamos se o usuário tem permissão para acessar a rota
  const hasPermission = hasRoutePermission(location.pathname, userRole);
  
  if (!hasPermission) {
    // Redireciona para a página inicial ou uma página de acesso negado
    return <Navigate to="/access-denied" replace />;
  }
  
  // Se estiver autenticado e tiver permissão, permite o acesso
  return <Outlet />;
};


export default ProtectedRoute;







// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";

// const ProtectedRoute = () => {
//   const { token  } = useAuth()

//   //return token ? <Outlet /> : <Navigate to="/sign-in" replace />;

//   return token ? <Outlet /> : <Navigate to="/sign-in" replace />;
  
// };

// export default ProtectedRoute;