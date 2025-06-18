import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Star, Trophy, Crown, User, X, Loader2, Clock, CheckCircle } from "lucide-react";
import { specialtyUserService } from "../../services/specialtyUserService";
import toast from "react-hot-toast";
import { Modal } from "../../components/ui/modal";


// Interfaces
interface SpecialtyInfo {
  name: string;
  category: string;
  emblem: string;
}


interface SpecialtyUser {
  name: string;
  photoUrl: string | null;
}


interface SpecialtyData {
  id: string;
  userId: string;
  specialtyId: string;
  approvalStatus: string;
  specialtyUser: SpecialtyUser;
  specialtyInfo: SpecialtyInfo;
}


interface RankedUser {
  userId: string;
  name: string;
  photoUrl: string | null;
  approvedSpecialties: SpecialtyData[];
  pendingSpecialties: SpecialtyData[];
  allSpecialties: SpecialtyData[];
  count: number;
  totalSpecialties: number;
}


// Modal Component
const SpecialtyDetailModal = ({ user, isOpen, onClose }: { user: RankedUser | null; isOpen: boolean; onClose: () => void }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [activeTab, setActiveTab] = useState<'approved' | 'pending'>('approved');


  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };


  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen]);


  if (!isOpen || !user) return null;


  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'recreativas': 'from-blue-500 to-blue-600',
      'missionarias': 'from-purple-500 to-purple-600',
      'natureza': 'from-green-500 to-green-600',
      'artes': 'from-pink-500 to-pink-600',
      'atividades': 'from-orange-500 to-orange-600',
      'default': 'from-gray-500 to-gray-600'
    };
    return colors[category] || colors.default;
  };


  const currentSpecialties = activeTab === 'approved' ? user.approvedSpecialties : user.pendingSpecialties;


  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: isClosing ? 0 : 1 }}
      exit={{ opacity: 0 }}
      onClick={handleClose}
    >
      <motion.div
        className="relative w-full max-w-3xl bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: isClosing ? 0.9 : 1, y: isClosing ? 20 : 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 to-indigo-700 p-6">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-opacity-20 text-white hover:bg-opacity-30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              {user.photoUrl ? (
                <img
                  src={user.photoUrl}
                  alt={user.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-lg object-cover"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center">
                  <User className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg border-2 border-white">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
            
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{user.name}</h2>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/30 bg-opacity-20 rounded-lg p-3 backdrop-blur-sm">
                  <div className="flex items-center justify-center mb-1">
                    <CheckCircle className="w-4 h-4 text-green-300 mr-1" />
                    <span className="text-sm font-medium text-white">Aprovadas</span>
                  </div>
                  <div className="text-2xl font-bold text-white text-center">{user.count}</div>
                </div>
                
                <div className="bg-white/10 bg-opacity-20 rounded-lg p-3 backdrop-blur-sm">
                  <div className="flex items-center justify-center mb-1">
                    <Clock className="w-4 h-4 text-yellow-300 mr-1" />
                    <span className="text-sm font-medium text-white">Pendentes</span>
                  </div>
                  <div className="text-2xl font-bold text-white text-center">{user.pendingSpecialties.length}</div>
                </div>
              </div>
              
              <div className="mt-3 text-center">
                <span className="text-purple-100 text-sm">
                  Total: {user.totalSpecialties} especialidade{user.totalSpecialties !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>


        {/* Tab Navigation */}
        <div className="px-6 pt-4">
          <div className="flex bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('approved')}
              className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'approved'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-600'
              }`}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Aprovadas ({user.count})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'pending'
                  ? 'bg-yellow-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-600'
              }`}
            >
              <Clock className="w-4 h-4 mr-2" />
              Pendentes ({user.pendingSpecialties.length})
            </button>
          </div>
        </div>


        {/* Specialties Grid */}
        <div className="p-6">
          <motion.h3
            key={activeTab}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-lg font-semibold text-white mb-4 flex items-center"
          >
            {activeTab === 'approved' ? (
              <>
                <Award className="w-5 h-5 mr-2 text-green-500" />
                Especialidades Conquistadas
              </>
            ) : (
              <>
                <Clock className="w-5 h-5 mr-2 text-yellow-500" />
                Especialidades Pendentes
              </>
            )}
          </motion.h3>
          
          {currentSpecialties.length > 0 ? (
            <div className="max-h-96 overflow-y-auto pt-3 pr-3 custom-scrollbar scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {currentSpecialties.map((specialty, index) => (
                  <motion.div
                    key={specialty.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`group relative p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                      activeTab === 'approved'
                        ? 'bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 border border-green-500/30'
                        : 'bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 border border-yellow-500/30'
                    }`}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    {/* Status Badge */}
                    <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                      activeTab === 'approved' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}>
                      {activeTab === 'approved' ? (
                        <CheckCircle className="w-3 h-3 text-white" />
                      ) : (
                        <Clock className="w-3 h-3 text-white" />
                      )}
                    </div>


                    <div className="flex items-start space-x-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-white p-2 flex-shrink-0 shadow-lg">
                        <img
                          src={specialty.specialtyInfo.emblem}
                          alt={specialty.specialtyInfo.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white text-sm mb-2 leading-tight">
                          {specialty.specialtyInfo.name}
                        </h4>
                        
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getCategoryColor(specialty.specialtyInfo.category)} text-white shadow-sm`}>
                          <div className="w-2 h-2 bg-white rounded-full mr-2 opacity-70"></div>
                          {specialty.specialtyInfo.category}
                        </div>
                      </div>
                    </div>


                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-indigo-500/0 group-hover:from-purple-500/10 group-hover:to-indigo-500/10 rounded-xl transition-all duration-300"></div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ) : (
            <motion.div
              key={`${activeTab}-empty`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                activeTab === 'approved' ? 'bg-green-500/20' : 'bg-yellow-500/20'
              }`}>
                {activeTab === 'approved' ? (
                  <Award className="w-8 h-8 text-green-400" />
                ) : (
                  <Clock className="w-8 h-8 text-yellow-400" />
                )}
              </div>
              <p className="text-gray-400">
                {activeTab === 'approved' 
                  ? 'Nenhuma especialidade aprovada ainda' 
                  : 'Nenhuma especialidade pendente'
                }
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
    </Modal>
  );
};


// Main Component
const SpecialtyRanking = () => {
  const [data, setData] = useState<SpecialtyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<RankedUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  // Process data to get ranking
  const processRankingData = (specialtyData: SpecialtyData[]): RankedUser[] => {
    const userMap = new Map<string, RankedUser>();


    // First pass: collect all specialties for each user
    specialtyData.forEach(item => {
      const userId = item.userId;
      
      if (!userMap.has(userId)) {
        userMap.set(userId, {
          userId,
          name: item.specialtyUser.name,
          photoUrl: item.specialtyUser.photoUrl,
          approvedSpecialties: [],
          pendingSpecialties: [],
          allSpecialties: [],
          count: 0,
          totalSpecialties: 0
        });
      }


      const user = userMap.get(userId)!;
      user.allSpecialties.push(item);
      user.totalSpecialties++;


      if (item.approvalStatus === 'approved') {
        user.approvedSpecialties.push(item);
        user.count = user.approvedSpecialties.length;
      } else {
        user.pendingSpecialties.push(item);
      }
      // } else if (item.approvalStatus === 'pending') {
      //   user.pendingSpecialties.push(item);
      // }
    });

    return Array.from(userMap.values())
      .filter(user => user.count > 0) // Only users with at least 1 approved specialty
      .sort((a, b) => {
        // Primary criteria: number of approved specialties
        if (b.count !== a.count) {
          return b.count - a.count;
        }
        // Tiebreaker: total number of specialties (approved + pending + rejected)
        return b.totalSpecialties - a.totalSpecialties;
      });
  };


  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await specialtyUserService.getAllSpecialtyAssociation();
      setData(response || []);
      return response;
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error(`Error: ${error.message}`, {
        position: 'bottom-right',
        icon: '🚫',
        className: 'dark:bg-gray-800 dark:text-white',
        duration: 5000,
      });
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);


  const ranking = processRankingData(data);
  const topThree = ranking.slice(0, 3);
  const restOfRanking = ranking.slice(3);


  const handleOpenDetail = (user: RankedUser) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };


  const getPodiumHeight = (position: number) => {
    const heights = ['h-32 sm:h-40', 'h-24 sm:h-32', 'h-20 sm:h-28'];
    return heights[position] || 'h-16';
  };


  const getPodiumColor = (position: number) => {
    const colors = [
      'from-yellow-400 to-yellow-600', // 1st place
      'from-gray-400 to-gray-600',     // 2nd place
      'from-amber-600 to-amber-800'    // 3rd place
    ];
    return colors[position] || 'from-gray-500 to-gray-700';
  };

  // Cores para os pódios
    const podiumColors = [
      'bg-gradient-to-t from-yellow-500 to-yellow-300 h-40', // Primeiro lugar
      'bg-gradient-to-t from-gray-400 to-gray-300 h-32',     // Segundo lugar
      'bg-gradient-to-t from-amber-700 to-amber-500 h-24'    // Terceiro lugar
    ];
  
     // Animações para os pódios
  const podiumAnimations = [
    {
      initial: { height: 0, opacity: 0 },
      animate: { height: 160, opacity: 1 },
      transition: { duration: 0.8, delay: 0.5, ease: "easeOut" }
    },
    {
      initial: { height: 0, opacity: 0 },
      animate: { height: 128, opacity: 1 },
      transition: { duration: 0.8, delay: 0.7, ease: "easeOut" }
    },
    {
      initial: { height: 0, opacity: 0 },
      animate: { height: 96, opacity: 1 },
      transition: { duration: 0.8, delay: 0.9, ease: "easeOut" }
    }
  ];



  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="flex flex-col items-center justify-center h-64 bg-gray-900 rounded-xl">
          <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
          <p className="mt-4 text-gray-400">Carregando ranking...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6 text-center"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center justify-center">
          <Award className="w-8 h-8 mr-2 text-yellow-500" />
          Ranking de Especialidades
        </h1>
        <p className="text-gray-400">Conquiste mais especialidades e suba no ranking!</p>
      </motion.div>


      <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
        {/* Podium Section */}
        <div className="relative bg-gradient-to-b from-purple-900 via-indigo-900 to-gray-900 p-6">
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full opacity-30"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale:  [0, 1, 0],
                  x: Math.random() * 100 + '%',
                  y: Math.random() * 100 + '%',
                }}
                transition={{
                  duration: 3 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>


          <motion.h2
            className="relative z-10 text-xl sm:text-2xl font-bold text-center text-white mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            🏆 Pódio dos Campeões
          </motion.h2>


          {/* Podium */}
          <div className="relative z-10 flex items-end justify-center gap-2 sm:gap-4 mb-8">
            {/* 2nd Place */}
            {topThree[1] && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col items-center cursor-pointer"
                onClick={() => handleOpenDetail(topThree[1])}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 mb-2 text-sm font-bold text-white bg-gray-600 rounded-full">
                  2
                </div>
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 mb-2">
                  {topThree[1].photoUrl ? (
                    <img
                      src={topThree[1].photoUrl}
                      alt={topThree[1].name}
                      className="w-full h-full rounded-full object-cover border-2 border-gray-400"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-600 flex items-center justify-center border-2 border-gray-400">
                      <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                  )}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gray-400 opacity-10"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <p className="text-xs sm:text-sm font-medium text-white text-center w-16 sm:w-20 truncate">
                  {topThree[1].name}
                </p>
                
                <div className="bg-white text-gray-800 px-2 py-1 rounded-full text-xs font-bold mb-1">
                  {topThree[1].count}
                </div>
                {topThree[1].totalSpecialties > topThree[1].count && (
                  <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold mb-3">
                    +{topThree[1].totalSpecialties - topThree[1].count}
                  </div>
                )}
                 {/* Pódio */}
                  <motion.div
                    className={`w-16 sm:w-24 rounded-t-lg ${podiumColors[1]} shadow-lg`}
                    {...podiumAnimations[1]}
                  ></motion.div>
                <motion.div
                  className={`w-16 sm:w-24 rounded-t-lg bg-gradient-to-t ${getPodiumColor(1)} ${getPodiumHeight(1)}`}
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                />
              </motion.div>
            )}


            {/* 1st Place */}
            {topThree[0] && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center cursor-pointer"
                onClick={() => handleOpenDetail(topThree[0])}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 mb-2 text-sm sm:text-base font-bold text-white bg-yellow-500 rounded-full"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  1
                </motion.div>
                <motion.div
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Crown className="w-6 h-6 sm:w-8 sm:h-8 mb-2 text-yellow-400" />
                </motion.div>
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-2">
                  {topThree[0].photoUrl ? (
                    <img
                      src={topThree[0].photoUrl}
                      alt={topThree[0].name}
                      className="w-full h-full rounded-full object-cover border-4 border-yellow-400"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-yellow-600 flex items-center justify-center border-4 border-yellow-400">
                      <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>
                  )}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-yellow-400 opacity-10"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <p className="text-sm sm:text-base font-medium text-white text-center w-20 sm:w-24 truncate">
                  {topThree[0].name}
                </p>
                <motion.div
                  className="bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-bold mb-1"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {topThree[0].count}
                </motion.div>
                {topThree[0].totalSpecialties > topThree[0].count && (
                  <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold mb-3">
                    +{topThree[0].totalSpecialties - topThree[0].count}
                  </div>
                )}
                {/* Pódio */}
                <motion.div
                  className={`w-20 sm:w-28 rounded-t-lg ${podiumColors[0]} shadow-lg relative overflow-hidden`}
                  {...podiumAnimations[0]}
                >
                  {/* Decoração do pódio */}
                  <motion.div 
                    className="absolute inset-x-0 top-0 h-3 bg-yellow-300"
                    animate={{ 
                      backgroundImage: [
                        "linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b)",
                        "linear-gradient(90deg, #fbbf24, #f59e0b, #fbbf24)",
                        "linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  
                  {/* Estrelas no pódio */}
                  <motion.div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="w-4 h-4 text-yellow-200"
                      animate={{ 
                        opacity: [0.5, 1, 0.5],
                        scale: [0.8, 1, 0.8]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      ★
                    </motion.div>
                  </motion.div>
                </motion.div>
                <motion.div
                  className={`w-20 sm:w-28 rounded-t-lg bg-gradient-to-t ${getPodiumColor(0)} ${getPodiumHeight(0)} relative overflow-hidden`}
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <div className="absolute inset-x-0 top-0 h-2 bg-yellow-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Star className="w-4 h-4 text-yellow-200 opacity-50" />
                  </div>
                </motion.div>
              </motion.div>
            )}


            {/* 3rd Place */}
            {topThree[2] && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-center cursor-pointer"
                onClick={() => handleOpenDetail(topThree[2])}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 mb-2 text-sm font-bold text-white bg-amber-700 rounded-full">
                  3
                </div>
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 mb-2">
                  {topThree[2].photoUrl ? (
                    <img
                      src={topThree[2].photoUrl}
                      alt={topThree[2].name}
                      className="w-full h-full rounded-full object-cover border-2 border-amber-600"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-amber-700 flex items-center justify-center border-2 border-amber-600">
                      <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                  )}
                   <motion.div
                    className="absolute inset-0 rounded-full bg-amber-400 opacity-10"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <p className="text-xs sm:text-sm font-medium text-white text-center w-16 sm:w-20 truncate">
                  {topThree[2].name}
                </p>
                <div className="bg-white text-gray-800 px-2 py-1 rounded-full text-xs font-bold mb-1">
                  {topThree[2].count}
                </div>
                {topThree[2].totalSpecialties > topThree[2].count && (
                  <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold mb-3">
                    +{topThree[2].totalSpecialties - topThree[2].count}
                  </div>
                )}
                {/* Pódio */}
                <motion.div
                  className={`w-16 sm:w-22 rounded-t-lg ${podiumColors[2]} shadow-lg`}
                  {...podiumAnimations[2]}
                ></motion.div>
                <motion.div
                  className={`w-16 sm:w-22 rounded-t-lg bg-gradient-to-t ${getPodiumColor(2)} ${getPodiumHeight(2)}`}
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                />
              </motion.div>
            )}
          </div>
        </div>


        {/* Rest of Ranking */}
        {restOfRanking.length > 0 && (
          <div className="p-4">
            {/* <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Medal className="w-5 h-5 mr-2 text-blue-500" />
              Demais Posições
            </h3> */}
            <div className="space-y-3">
              {restOfRanking.map((user, index) => (
                <motion.div
                  key={user.userId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                  onClick={() => handleOpenDetail(user)}
                  whileHover={{ scale: 1.02 }}
                >

                <div className="flex items-center justify-center w-8 h-8 mr-3 text-sm font-bold text-gray-300 bg-gray-700 rounded-full">
                    {index + 4}
                  </div>
                  <div className="w-10 h-10 mr-3 rounded-full overflow-hidden">
                    {user.photoUrl ? (
                      <img
                        src={user.photoUrl}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{user.name}</p>
                    <p className="text-xs text-gray-400">
                      {user.count} aprovada{user.count !== 1 ? 's' : ''} • {user.totalSpecialties} total
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="px-3 py-1 text-sm font-bold text-white bg-green-600 rounded-full">
                      {user.count}
                    </div>
                    {user.pendingSpecialties.length > 0 && (
                      <div className="px-2 py-1 text-xs font-bold text-white bg-yellow-600 rounded-full">
                        +{user.pendingSpecialties.length}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}


        {ranking.length === 0 && !isLoading && (
          <div className="p-8 text-center text-gray-400">
            <Award className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Nenhuma especialidade aprovada encontrada</p>
          </div>
        )}


        {ranking.length > 0 && (
          <div className="p-4 text-center text-gray-400 text-sm border-t border-gray-800">
            Mostrando {ranking.length} desbravador{ranking.length !== 1 ? 'es' : ''} com especialidades aprovadas
          </div>
        )}
      </div>


      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <SpecialtyDetailModal
            user={selectedUser}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedUser(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};


export default SpecialtyRanking;
