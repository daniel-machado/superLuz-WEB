// import LoadingScreen from "../components/LoadingScreen";
// import { useAuth } from "../context/AuthContext";
// import AppRoutes from "./AppRoutes";
// import AuthRoutes from "./AuthRoutes";

// const Routes = () => {
//   const { token, loading } = useAuth();

//   if (loading) {
//     return <LoadingScreen />; // 🔹 Exibe a animação enquanto verifica a autenticação
//   }

//   return (
//     <>
//       {token ? <AppRoutes /> : <AuthRoutes />}
//     </>
//   );
// };

// export default Routes;