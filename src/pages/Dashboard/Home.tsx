import PageMeta from "../../components/common/PageMeta";
import { useAuth } from "../../context/AuthContext";
import Card from "../../components/ui/Card/Card";
import Button from "../../components/ui/button/Button";
import { authService } from "../../services/authService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import BibleVerseOfTheDay from "../../components/BibleVerseOfTheDay/BibleVerdeDay";
import { DailyReadingService } from "../../services/dailyVerseBiblicalService";
import StreakFire from "../../components/StreakFire/StreakFire";
import Avatar from "../../components/ui/avatar/Avatar";
import BirthdayCard from "../../components/BirthDayCard/BirthDayCard";
import { userService } from "../../services/userService";

interface IUser {
  id: string;
  birthDate: string;
  email: string;
  name: string;
  photoUrl: string;
  role: string;
  status: string;
}

export default function Home() {
  const [_loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [readingStatus, setReadingStatus] = useState({
    isLoading: false,
    message: '',
    type: '' // 'success' | 'error'
  });
  const [_isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<IUser[]>([]);

  const navigate = useNavigate();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      
  const data = await userService.getAllUsers();
    const filteredUsers = data.map((user: any) => ({
      id: user.id,
      name: user.name,
      birthDate: user.birthDate,
      role: user.role,
      photoUrl: user.photoUrl,
      status: user.status,
    }));
    setUsers(filteredUsers);
    } catch (error: any) {
      console.log(error.message)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if ((!user || !user.user)) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-300 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </div>
          <p className="text-lg font-semibold text-gray-800 dark:text-white/90">Carregando...</p>
        </div>
      </div>
    );
  }


  const userName = user?.user.user.name || '';
  const firstTwoNames = userName.split(' ').slice(0, 2).join(' '); 


  const handleLink = async () => {
    setLoading(true);
    try {
      await authService.sendVerificationCode(user?.user.user.email);
      navigate("/verification-code");
      toast.success("Código Enviado com sucesso para o email", {position: 'bottom-right'});
    } catch (error: any) {
      console.error("Erro ao enviar codigo", error);
      toast.error(`Error: ${error.message}`, {
          position: 'bottom-right',
          icon: '🚫',
          className: 'dark:bg-gray-800 dark:text-white',
          duration: 5000,
        });
    } finally {
      setLoading(false);
    }
  };


  // Defina o tipo para os dados de leitura
  interface ReadingData {
    book: string;
    chapter: number;
    verse: number;
  }


  // Manipular registro de leitura diária
  const handleRegisterReading = async (readingData: ReadingData) => {
    try {
      setReadingStatus({
        isLoading: true,
        message: 'Registrando leitura...',
        type: ''
      });
      
      // Chama o serviço para registrar a leitura e obter streakInfo
      await DailyReadingService.registerReading({
        userId: user.user.user.id,
        book: readingData.book,
        chapter: String(readingData.chapter),
        verse: String(readingData.verse),
        pointsEarned: 10 // Pontos por leitura
      });

      // Atualiza o componente do fogo
      setRefreshTrigger(prev => prev + 1);

      setReadingStatus({
        isLoading: false,
        message: 'Leitura registrada com sucesso!',
        type: 'success'
      });
      
      // Limpa a mensagem após 3 segundos
      setTimeout(() => {
        setReadingStatus({
          isLoading: false,
          message: '',
          type: ''
        });
      }, 3000);

    } catch (error: any) {
      console.error('Error registering reading:', error);
      setReadingStatus({
        isLoading: false,
        message: `Erro: ${error.message}`,
        type: 'error'
      });
      toast.error(`Error: ${error.message}`, {
                position: 'bottom-right',
                icon: '🚫',
                className: 'dark:bg-gray-800 dark:text-white',
                duration: 5000,
              });
    }
  };


  // Função para lidar com a mudança do streak
  const handleStreakChange = (newStreak: number) => {
    console.log(`Unção atualizada: ${newStreak} dias`);
    // Você pode disparar alguma lógica adicional quando o streak mudar
  };

  return (
    <>
      <PageMeta
        title="Página Inicial - SuperLuzeiros"
        description="Página inicial do sistema do Luzeiros"
      />
      
      {/* Header com boas-vindas e streak */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mr-3 shadow-lg">
            <span className="text-white font-bold text-xl">
              {/* {firstTwoNames.split(' ').map(name => name[0]).join('')} */}
              { !user.user.user.photoUrl 
                ? 
                  ( firstTwoNames.split(' ').map(name => name[0]).join(''))
                :  
                  <Avatar
                    src={user.user.user.photoUrl}
                    size="large"
                    status="online"
                  />
              }
              
            </span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Olá, {firstTwoNames}! 👋
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Pronto para brilhar hoje?
            </p>
          </div>
        </div>
        
        {/* StreakFire componente à direita */}
        <div className="w-full sm:w-auto mt-4 sm:mt-0">
          {(user.user.user.role === "admin" || user.user.user.role === "director") && (
              <StreakFire
                className="w-full justify-center sm:justify-end" 
                onStreakChange={handleStreakChange}
                refreshTrigger={refreshTrigger}
              />
          )}
          
        </div>
      </div>

      {/* Status de Leitura */}
      {readingStatus.message && (
        <div className={`p-3 rounded-lg mb-4 transition-all duration-300 ${
          readingStatus.type === 'success' 
            ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' 
            : readingStatus.type === 'error'
              ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
              : 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
        }`}>
          {readingStatus.isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {readingStatus.message}
            </div>
          ) : (
            <div className="flex items-center">
              {readingStatus.type === 'success' && (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              )}
              {readingStatus.type === 'error' && (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              )}
              {readingStatus.message}
            </div>
          )}
        </div>
      )}


      {/* Verificação de conta - se não estiver verificado */}
      {user.user.user.isVerified !== true && (
        <Card variant="light" size="md" color="warning">
          <div>
            <p>
              <strong>Olá {firstTwoNames}</strong>,<br/>
              Notamos que você ainda não verificou sua conta. <br/>
              A verificação é importante para garantir a segurança e o acesso completo aos nossos serviços.
            </p>
            <div className="text-right mt-5">
              <Button size="sm" onClick={handleLink} className="bg-orange-500 hover:bg-orange-400">
                Enviar Código
              </Button>
            </div>
          </div>
        </Card>
      )}


      {/* Componente do versículo do dia */}
      {user.user.user.role !== "pending" && (
        <div className="mt-4">
          <BibleVerseOfTheDay 
            onRegisterReading={handleRegisterReading} 
            refreshTrigger={refreshTrigger}
            onStreakChange={handleStreakChange}

          />
        </div>
      )}
      
      {/* Card de Aniversário */}
      <div className="mt-3 mb-3" >
      <BirthdayCard users={users} />
      </div>

    </>
  );
}
