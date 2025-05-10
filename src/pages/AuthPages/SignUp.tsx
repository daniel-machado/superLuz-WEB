import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="Cadastro | Tela de cadastro do SuperLuzeiros"
        description="Essa é a tela de cadastro do sistema Super Luzeiros"
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
