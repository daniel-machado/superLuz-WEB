
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Toaster, toast } from "react-hot-toast";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
//import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { useAuth } from "../../context/AuthContext";

// Esquema de validação com Yup
const loginSchema = yup.object({
  email: yup
    .string()
    .min(6)
    .max(60)
    .email("Digite um e-mail válido")
    .required("O e-mail é obrigatório"),
  password: yup
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .required("A senha é obrigatória")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
      "A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula e um número"
    ),
});

type LoginFormData = yup.InferType<typeof loginSchema>;

export default function SignInForm() {
  const { signin } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  //const [isChecked, setIsChecked] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await signin(data.email, data.password);
      navigate("/home");
    } catch (error) {
      toast.error("Credenciais incorretas", {position: 'bottom-right'});
    }
  };

  const handleSignUp = () => {
    navigate("/sign-up")
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password")
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Voltar para o início
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Acesse sua conta
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Entre com o seu email e senha
            </p>
          </div>
          <div>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input 
                    type="email"
                    placeholder="Seu e-mail" 
                    {...register("email")}  
                  />
                  {errors.email && <span className="text-red-500">{errors.email.message}</span>}
                </div>
                <div>
                  <Label>
                    Senha <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Sua senha"
                      {...register("password")}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                  {errors.password && <span className="text-red-500">{errors.password.message}</span>}
                </div>
                {/* <div className="flex items-center justify-between">
                  {/* <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div> 
                  <Link
                    to="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Esqueceu sua senha?
                  </Link>
                </div> */}
                <div className="flex items-center justify-between">
                    {/* Se quiser manter um checkbox futuramente, ele pode ficar aqui */}
                    <button
                      type="button"
                      onClick={() => handleForgotPassword()}
                      className="text-sm text-brand-500 hover:text-green-600 dark:text-green-400 ml-auto"
                    >
                      Esqueceu sua senha?
                    </button>
                  </div>
                <div>
                  <Button className="w-full" size="sm">
                    Entrar
                  </Button>
                </div>
              </div>
            </form>

            {/* <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Não tem uma conta ainda? {""}
                <Link
                  to="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Cadastrar
                </Link>
              </p>
            </div> */}
            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Não tem uma conta ainda?{" "}
                <button
                  onClick={() => handleSignUp()}
                  className="text-brand-500 hover:text-green-600 dark:text-green-400"
                >
                  Cadastrar
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}
