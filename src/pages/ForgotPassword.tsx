import { useState } from 'react';
import { Mail, ArrowRight, Lock, KeyRound } from 'lucide-react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';


const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1 = email step, 2 = code and new password step
  const [isLoading, setIsLoading] = useState(false);
const navigate = useNavigate()

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const form = e.target as HTMLFormElement;
      const email = form.email.value; 

      await authService.sendForgotPasswordCode(email)
      toast.success("Código Enviado com sucesso para o email", {position: 'bottom-right'});
      setIsLoading(false);
      setStep(2);
    } catch (error: any) {
      console.error("Erro ao enviar codigo", error);
      toast.error(`Error: ${error.message}`, {
          position: 'bottom-right',
          icon: '🚫',
          duration: 5000,
        });
    } finally {
      setIsLoading(false);
    }
  };


  const handleSubmitNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const form = e.target as HTMLFormElement;
      const code = form.code.value
      const password = form.newPassword.value;

      await authService.verifyForgotPasswordCode(email, code, password)
      toast.success("Senha alterada com sucesso", {position: 'bottom-right'});
      setIsLoading(false);
      navigate('/sign-in')
    } catch (error: any) {
      console.error("Erro ao enviar codigo", error);
      toast.error(`Error: ${error.message}`, {
          position: 'bottom-right',
          icon: '🚫',
          duration: 5000,
        });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          {step === 1 ? 'Recuperar senha' : 'Redefinir senha'}
        </h2>
      </div>


      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {step === 1 ? (
            <form className="space-y-6" onSubmit={handleSubmitEmail}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 py-2 sm:text-sm rounded-md"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>


              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    'Enviando...'
                  ) : (
                    <>
                      Enviar código
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmitNewPassword}>
              <div className="text-sm text-gray-300 mb-4">
                Enviamos um código de verificação para <span className="font-medium text-indigo-400">{email}</span>.
              </div>


              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-300">
                  Código de verificação
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="code"
                    name="code"
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 py-2 sm:text-sm rounded-md"
                    placeholder="123456"
                  />
                </div>
              </div>


              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300">
                  Nova senha
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 py-2 sm:text-sm rounded-md"
                    placeholder="••••••••"
                  />
                </div>
              </div>


              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    'Redefinindo...'
                  ) : (
                    <>
                      Redefinir senha
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}


          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <a
                  href="/sign-in"
                  className="px-2 bg-gray-800 text-gray-400 hover:text-indigo-400"
                >
                  Voltar para login
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ForgotPassword;
