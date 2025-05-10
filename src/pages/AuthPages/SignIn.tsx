import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function SignIn() {
  const { token } = useAuth()
  return (
    <>
    {
    token 
    ? 
      <Navigate to="/" replace /> 
    : 
      <>
        <PageMeta
          title="Login Super Luzeiros | Desbravadores Luzeiros do Norte"
          description="Login do sistema de Gerencimento do clube de desbravadores Luzeiros do Norte"
        />
        <AuthLayout>
          <SignInForm />
        </AuthLayout>
      </>
    }
    </>
  );
}
