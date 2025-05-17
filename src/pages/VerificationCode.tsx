import { useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { CheckCircle, Mail, AlertCircle, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";


export default function VerificationCode() {
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { user } = useAuth()
   const navigate = useNavigate()
  
  // Array para armazenar cada dígito do código individualmente
  const codeLength = 6;
  //const codeArray = Array(codeLength).fill("");
  
  // Função para lidar com a mudança em cada input do código
  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode.join(""));
      
      // Mover para o próximo input se não for o último
      if (value !== "" && index < codeLength - 1) {
        document.getElementById(`code-input-${index + 1}`)?.focus();
      }
    }
  };
  
  // Função para lidar com colagem do código
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();
    
    if (pastedData.length <= codeLength && /^\d+$/.test(pastedData)) {
      const newCode = pastedData.split("").slice(0, codeLength);
      setVerificationCode(newCode.join(""));
    }
  };
  
  // Função para verificar o código
  const verifyCode = async () => {
    setLoading(true);
    setError("");
    const email = user?.user.user.email;
    if (!email) {
      toast.error("Email do usuário não encontrado.", { position: 'bottom-right' });
      return;
    }
    try {
      await authService.verifyVerificationCode(email, verificationCode);
      toast.success("Conta verificada com sucesso", {position: 'bottom-right'});
      navigate("/home")
    } catch (error: any) {
      console.error("Erro ao verificar conta", error);
      toast.error(`Error: ${error.message}`, {
          position: 'bottom-right',
          icon: '🚫',
          duration: 5000,
        });
    }finally{
      setLoading(false)
    }
  };
  
  // Função para reenviar o código
  const resendCode = async () => {
    const email = user?.user.user.email;
    if (!email) {
      toast.error("Email do usuário não encontrado.", { position: 'bottom-right' });
      return;
    }
    try {
      await authService.sendVerificationCode(email);
      toast.success("Código Renviado com sucesso para o email", {position: 'bottom-right'});
    } catch (error: any) {
      console.error("Erro ao renviar codigo", error);
      toast.error(`Error: ${error.message}`, {
          position: 'bottom-right',
          icon: '🚫',
          duration: 5000,
        });
    }
  };


  return (
    <div>
      <PageMeta
        title="Verificação de Código | Ativação de Conta"
        description="Insira o código de verificação enviado ao seu email para ativar sua conta"
      />
      <PageBreadcrumb pageTitle="Verificação de Código" />
      
      <div className="min-h-screen rounded-2xl border border-gray-700 bg-white/[0.03] px-5 py-7 dark:border-gray-800 xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[500px] text-center">
          <div className="mb-8 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10">
              <Mail className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            Verifique seu Email
          </h3>


          <p className="mb-8 text-sm text-gray-500 dark:text-gray-400 sm:text-base">
            Enviamos um código de verificação para o seu email. 
            Por favor, insira o código abaixo para ativar sua conta.
          </p>
          
          {/* Campo de código de verificação */}
          <div className="mb-8">
            <div className="flex justify-center gap-2 sm:gap-4">
              {[...Array(codeLength)].map((_, index) => (
                <input
                  key={index}
                  id={`code-input-${index}`}
                  type="text"
                  value={verificationCode[index] || ""}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onPaste={handlePaste}
                  className="h-12 w-12 rounded-md border border-gray-300 bg-transparent p-0 text-center text-lg font-semibold text-white dark:border-gray-700 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:h-14 sm:w-14"
                />
              ))}
            </div>
            
            {error && (
              <div className="mt-4 flex items-center justify-center text-sm text-red-500">
                <AlertCircle className="mr-1 h-4 w-4" />
                {error}
              </div>
            )}
          </div>
          
          {/* Botão de verificação */}
          <button
            onClick={verifyCode}
            disabled={loading || verificationCode.length !== codeLength}
            className="mb-6 flex w-full items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-center font-medium text-white transition-all hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="mr-2 h-5 w-5 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verificando...
              </span>
            ) : (
              <span className="flex items-center">
                Verificar Conta
                <ArrowRight className="ml-2 h-5 w-5" />
              </span>
            )}
          </button>
          
          <div className="flex justify-center">
            <button
              onClick={resendCode}
              className="text-sm font-medium text-blue-500 transition-all hover:text-blue-600"
            >
              Não recebeu o código? Reenviar
            </button>
          </div>
          
          <div className="mt-8 flex items-center justify-center rounded-lg border border-gray-700 bg-gray-800/50 p-4 text-sm">
            <CheckCircle className="mr-2 h-5 w-5 text-blue-500" />
            <span className="text-gray-300">
              Verifique também sua pasta de spam ou lixo eletrônico.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
