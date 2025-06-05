import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { userService } from "../../../services/userService";
import UserAvatar from "../../../components/UserProfile/userAvatar";
import StreakFireProfileUser from "./StreakFireProfileUser";
import { DailyReadingService } from "../../../services/dailyVerseBiblicalService";
import { Modal } from "../../../components/ui/modal";
import { BookOpen, Calendar, Flame, Zap } from "lucide-react";


type Reading = {
    id: string;
    userId: string;
    date: string;
    readAt: string;
    verse: string;
    book: string;
    chapter: string;
    pointsEarned: number;
    life: number;
    streak: number;
};

type ReadingHistory = {
  result: {
    readings: Reading[];
    totalDays: number;
    longestStreak: number;
  }
};


interface IUser {
  id: string;
  name: string;
  birthDate: string;
  role: string;
  photoUrl: string | null;
  status: string;
  email: string;
  facebook: string;
  instagram: string;
  youtube: string;
  biografia: string;
  linkedin: string;
}

interface UserMetaCardProps {
  userId: string | undefined;
}

export default function UserMetaCardUser({ userId }: UserMetaCardProps) {
    const [userData, setUser] = useState<IUser | null>(null)
    const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);
    const [animateContent, setAnimateContent] = useState(false);

    const [streakData, setStreakData] = useState<ReadingHistory>({
      result: {
        readings: [],
        totalDays: 0,
        longestStreak: 0
      }
    });
    
    useEffect(() => {
      fetchDataUser()
    }, []);

    useEffect(() => {
      if (userData?.id) {
        DailyReadingService.getReadingHistory(userData.id).then((response) => {
          setStreakData({ result: response.result });
        });
      }
    }, [userData]);

    const fetchDataUser = async () => {
      try {
        const data = await userService.getAllUsers()
        const userFiltered = data.find((user: IUser) => user.id === userId);     
        setUser(userFiltered) 
        toast.success('👀 Curiando', {
          position: 'bottom-right',
          style: {
            background: '#1f2937', // Tailwind's gray-800
            color: '#fff',
            border: '1px solid #4b5563', // Tailwind's gray-600
          },
            iconTheme: {
            primary: '#10b981', // Tailwind's green-500
            secondary: '#1f2937', // background match
          },
        });

      } catch (error: any) {
        console.error("Erro ao buscar user", error);
        toast.error(`Error: ${error.message}`, {
          position: 'bottom-right',
          icon: '🚫',
          className: 'dark:bg-gray-800 dark:text-white',
          duration: 5000,
        });
      }
    };

  const definedRole = () => {
    if (!userData) return "Usuário";
    const role = userData.role;
    if (role === "admin") {
      return "Administrador";
    } else if (role === "dbv") {
      return "Desbravador";
    } else if (role === "director") {
      return "Diretor";
    } else if (role === "lead") {
      return "Líder | Direção";
    } else if (role === "counselor") {
      return "Conselheiro";
    } else if (role === "secretary") {
      return 'Liderança'
    } else if (role === "pending") {
      return "Pendente";
    }
    return "Usuário";
  }


interface UserData {
  name: string;
  photoUrl: string | null;
}

interface UserWrapper {
  user: {
    user: UserData;
  };
}

const userDataAux = {
  name: userData?.name || 'Error', 
  photoUrl: userData?.photoUrl || null, 
};

const userAdapted: UserWrapper = {
  user: {
    user: userDataAux,
  },
};

  //const totalPoints = streakData.result.readings.reduce((sum, reading) => sum + reading.pointsEarned, 0);

  useEffect(() => {
    if (isOpenDetailsModal) {
      setTimeout(() => setAnimateContent(true), 500);
    } else {
      setAnimateContent(false);
    }
  }, [isOpenDetailsModal]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit',
      timeZone: 'UTC'
    });
  };


  //   const FlameIcon = ({ className }: { className?: string }) => (
  //   <svg className={className} viewBox="0 0 24 24" fill="currentColor">
  //     <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
  //   </svg>
  // );


  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <UserAvatar user={userAdapted} />
            </div>

            <div className="order-3 xl:order-2 flex-grow">
              <div className="flex flex-col items-center md:flex-row md:items-start gap-4 md:gap-8">
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white/90">
                    {userData?.name}
                  </h3>
                  <div className="text-sm font-semibold text-gray-800 dark:text-white/50 lg:mb-6">
                    {definedRole()}
                  </div>
                </div>

                {userId && 
                  <>
                  <StreakFireProfileUser userId={userId} />
                  <button
                    onClick={() => setIsOpenDetailsModal(true)}
                    className="text-orange-400 hover:text-orange-300 transition-colors text-sm"
                  >
                    Informações do fogo
                  </button>
                  </>
                }
              </div>

              <div className="flex flex-col items-center gap-2 xl:items-start">    
                  {userData?.biografia && (
                      <div className="mt-3 text-gray-600 dark:text-gray-300 text-center xl:text-left max-w-md">
                          <p className="font-medium text-md leading-relaxed">
                              {userData?.biografia}
                          </p>
                      </div>
                  )}
              </div>
          </div>
           <div className="flex items-center order-2 gap-3 justify-center xl:order-3 xl:justify-end">
                            {userData?.facebook && (
                                <a
                                    href={userData?.facebook}
                                    target="_blank"
                                    rel="noopener"
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-primary hover:bg-primary hover:text-white transition-colors duration-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-primary"
                                    aria-label="Facebook"
                                >
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M11.6666 11.2503H13.7499L14.5833 7.91699H11.6666V6.25033C11.6666 5.39251 11.6666 4.58366 13.3333 4.58366H14.5833V1.78374C14.3118 1.7477 13.2858 1.66699 12.2023 1.66699C9.94025 1.66699 8.33325 3.04771 8.33325 5.58342V7.91699H5.83325V11.2503H8.33325V18.3337H11.6666V11.2503Z"
                                        />
                                    </svg>
                                </a>
                            )}
                            
                            {userData?.youtube && (
                                <a
                                    href={userData?.youtube}
                                    target="_blank"
                                    rel="noopener"
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-red-600 hover:bg-red-600 hover:text-white transition-colors duration-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-red-600"
                                    aria-label="YouTube"
                                >
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M15.1708 1.875H17.9274L11.9049 8.75833L18.9899 18.125H13.4424L9.09742 12.4442L4.12578 18.125H1.36745L7.80912 10.7625L1.01245 1.875H6.70078L10.6283 7.0675L15.1708 1.875ZM14.2033 16.475H15.7308L5.87078 3.43833H4.23162L14.2033 16.475Z"
                                        />
                                    </svg>
                                </a>
                            )}
                            
                            {userData?.linkedin && (
                                <a
                                    href={userData?.linkedin}
                                    target="_blank"
                                    rel="noopener"
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-blue-700 hover:bg-blue-700 hover:text-white transition-colors duration-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-blue-700"
                                    aria-label="LinkedIn"
                                >
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M5.78381 4.16645C5.78351 4.84504 5.37181 5.45569 4.74286 5.71045C4.11391 5.96521 3.39331 5.81321 2.92083 5.32613C2.44836 4.83904 2.31837 4.11413 2.59216 3.49323C2.86596 2.87233 3.48886 2.47942 4.16715 2.49978C5.06804 2.52682 5.78422 3.26515 5.78381 4.16645ZM5.83381 7.06645H2.50048V17.4998H5.83381V7.06645ZM11.1005 7.06645H7.78381V17.4998H11.0672V12.0248C11.0672 8.97475 15.0422 8.69142 15.0422 12.0248V17.4998H18.3338V10.8914C18.3338 5.74978 12.4505 5.94145 11.0672 8.46642L11.1005 7.06645Z"
                                        />
                                    </svg>
                                </a>
                            )}
                            
                            {userData?.instagram && (
                                <a
                                    href={userData?.instagram}
                                    target="_blank"
                                    rel="noopener"
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-pink-600 hover:bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:text-white transition-colors duration-300 dark:border-gray-700 dark:bg-gray-800"
                                    aria-label="Instagram"
                                >
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M10.8567 1.66699C11.7946 1.66854 12.2698 1.67351 12.6805 1.68573L12.8422 1.69102C13.0291 1.69766 13.2134 1.70599 13.4357 1.71641C14.3224 1.75738 14.9273 1.89766 15.4586 2.10391C16.0078 2.31572 16.4717 2.60183 16.9349 3.06503C17.3974 3.52822 17.6836 3.99349 17.8961 4.54141C18.1016 5.07197 18.2419 5.67753 18.2836 6.56433C18.2935 6.78655 18.3015 6.97088 18.3081 7.15775L18.3133 7.31949C18.3255 7.73011 18.3311 8.20543 18.3328 9.1433L18.3335 9.76463C18.3336 9.84055 18.3336 9.91888 18.3336 9.99972L18.3335 10.2348L18.333 10.8562C18.3314 11.794 18.3265 12.2694 18.3142 12.68L18.3089 12.8417C18.3023 13.0286 18.294 13.213 18.2836 13.4351C18.2426 14.322 18.1016 14.9268 17.8961 15.458C17.6842 16.0074 17.3974 16.4713 16.9349 16.9345C16.4717 17.397 16.0057 17.6831 15.4586 17.8955C14.9273 18.1011 14.3224 18.2414 13.4357 18.2831C13.2134 18.293 13.0291 18.3011 12.8422 18.3076L12.6805 18.3128C12.2698 18.3251 11.7946 18.3306 10.8567 18.3324L10.2353 18.333C10.1594 18.333 10.0811 18.333 10.0002 18.333H9.76516L9.14375 18.3325C8.20591 18.331 7.7306 18.326 7.31997 18.3137L7.15824 18.3085C6.97136 18.3018 6.78703 18.2935 6.56481 18.2831C5.67801 18.2421 5.07384 18.1011 4.5419 17.8955C3.99328 17.6838 3.5287 17.397 3.06551 16.9345C2.60231 16.4713 2.3169 16.0053 2.1044 15.458C1.89815 14.9268 1.75856 14.322 1.7169 13.4351C1.707 13.213 1.69892 13.0286 1.69238 12.8417L1.68714 12.68C1.67495 12.2694 1.66939 11.794 1.66759 10.8562L1.66748 9.1433C1.66903 8.20543 1.67399 7.73011 1.68621 7.31949L1.69151 7.15775C1.69815 6.97088 1.70648 6.78655 1.7169 6.56433C1.75786 5.67683 1.89815 5.07266 2.1044 4.54141C2.3162 3.9928 2.60231 3.52822 3.06551 3.06503C3.5287 2.60183 3.99398 2.31641 4.5419 2.10391C5.07315 1.89766 5.67731 1.75808 6.56481 1.71641C6.78703 1.70652 6.97136 1.69844 7.15824 1.6919L7.31997 1.68666C7.7306 1.67446 8.20591 1.6689 9.14375 1.6671L10.8567 1.66699ZM10.0002 5.83308C7.69781 5.83308 5.83356 7.69935 5.83356 9.99972C5.83356 12.3021 7.69984 14.1664 10.0002 14.1664C12.3027 14.1664 14.1669 12.3001 14.1669 9.99972C14.1669 7.69732 12.3006 5.83308 10.0002 5.83308ZM10.0002 7.49974C11.381 7.49974 12.5002 8.61863 12.5002 9.99972C12.5002 11.3805 11.3813 12.4997 10.0002 12.4997C8.6195 12.4997 7.50023 11.3809 7.50023 9.99972C7.50023 8.61897 8.61908 7.49974 10.0002 7.49974ZM14.3752 4.58308C13.8008 4.58308 13.3336 5.04967 13.3336 5.62403C13.3336 6.19841 13.8002 6.66572 14.3752 6.66572C14.9496 6.66572 15.4169 6.19913 15.4169 5.62403C15.4169 5.04967 14.9488 4.58236 14.3752 4.58308Z"
                                        />
                                    </svg>
                                </a>
                            )}
                        </div>
                    </div>
          </div>
        </div>


        
        {/* Modal Details StreakFire*/}
              {isOpenDetailsModal && (
                <Modal isOpen={isOpenDetailsModal} onClose={() => setIsOpenDetailsModal(false)} className="max-w-[700px] m-4">
                <div className="fixed custom-scrollbar inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                  <div 
                    className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-700/50 transform transition-all duration-500 ${
                      animateContent ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                    }`}
                  >
                    {/* Header com animação de fogo */}
                    <div className="relative p-6 pb-4 border-b border-gray-700/50 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-red-500/20 to-yellow-500/20 animate-pulse"></div>
                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="absolute -inset-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur opacity-50 animate-pulse"></div>
                            <div className="relative bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-full">
                              <Flame className="w-8 h-8 text-white animate-bounce" />
                            </div>
                          </div>
                          <div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                              Fogo de {userData?.name}
                            </h2>
                            <p className="text-gray-400 mt-1">jornada de leitura diária</p>
                          </div>
                        </div>
                        {/* <button
                          onClick={() => setIsOpenDetailsModal(false)}
                          className="p-2 hover:bg-gray-700/50 rounded-full transition-colors"
                        >
                          <X className="w-6 h-6 text-gray-400" />
                        </button> */}
                      </div>
                    </div>
        
                    {/* Estatísticas principais */}
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Streak Atual */}
                        <div className={`bg-gradient-to-br from-orange-500/20 to-red-500/20 p-6 rounded-2xl border border-orange-500/30 transform transition-all duration-700 ${animateContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-orange-500/20 rounded-lg">
                              <Flame className="w-6 h-6 text-orange-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">Fogo Atual</h3>
                          </div>
                          <div className="text-4xl font-bold text-orange-400 mb-2">{streakData.result.longestStreak}</div>
                          <p className="text-gray-400 text-sm">dias consecutivos</p>
                        </div>
        
                        {/* Total de Dias */}
                        <div className={`bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-6 rounded-2xl border border-blue-500/30 transform transition-all duration-700 delay-100 ${animateContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                              <Calendar className="w-6 h-6 text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">Total de Dias</h3>
                          </div>
                          <div className="text-4xl font-bold text-blue-400 mb-2">{streakData.result.totalDays}</div>
                          <p className="text-gray-400 text-sm">dias de leitura</p>
                        </div>
        
                        {/* Pontos Totais */}
                        {/* <div className={`bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-6 rounded-2xl border border-green-500/30 transform transition-all duration-700 delay-200 ${animateContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-green-500/20 rounded-lg">
                              <Star className="w-6 h-6 text-green-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">Pontos Totais</h3>
                          </div>
                          <div className="text-4xl font-bold text-green-400 mb-2">{totalPoints}</div>
                          <p className="text-gray-400 text-sm">pontos conquistados</p>
                        </div> */}
                      </div>
        
                      {/* Histórico de Leituras */}
                      <div className={`transform transition-all duration-700 delay-300 ${animateContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2 bg-purple-500/20 rounded-lg">
                            <BookOpen className="w-6 h-6 text-purple-400" />
                          </div>
                          <h3 className="text-xl font-semibold text-white">Histórico de Leituras</h3>
                        </div>
        
                        {streakData.result.readings.length === 0 
                          ?
                            <h3 className="text-md font-regular text-white/30">Não tem leitura registrada ainda</h3>
                          :
                            <div className="grid gap-4">
                              {streakData.result.readings.map((reading, index) => (
                                <div
                                  key={index}
                                  className={`bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 transform ${
                                    animateContent ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                                  }`}
                                  style={{ transitionDelay: `${400 + index * 100}ms` }}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                      <div className="relative">
                                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                                          <span className="text-white font-bold text-lg">{reading.streak}</span>
                                        </div>
                                        {index === 0 && (
                                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                                            <Zap className="w-3 h-3 text-white" />
                                          </div>
                                        )}
                                      </div>
                                      
                                      <div>
                                        <div className="text-white font-semibold">
                                          {reading.book} - Capítulo {reading.chapter}
                                        </div>
                                        <div className="text-gray-400 text-sm">
                                          {formatDate(reading.date)}
                                        </div>
                                      </div>
                                    </div>
            
                                    <div className="text-right">
                                      {/* <div className="text-green-400 font-semibold">
                                        +{reading.pointsEarned} pts
                                      </div> */}
                                      <div className="text-gray-500 text-sm">
                                        Dia {reading.streak}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                        }
                      </div>
        
                      {/* Motivação */}
                      {/* <div className={`mt-8 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20 p-6 rounded-2xl border border-purple-500/30 text-center transform transition-all duration-700 delay-700 ${animateContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                        <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-3 animate-bounce" />
                        <h3 className="text-xl font-bold text-white mb-2">Parabéns! 🎉</h3>
                        <p className="text-gray-300">
                          Você está mantendo uma consistência incrível na sua jornada de leitura bíblica. 
                          Continue assim e alcance novos patamares!
                        </p>
                      </div> */}
                    </div>
                  </div>
                </div>
              </Modal>
              )}









    </>
  );
}
