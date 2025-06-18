import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Target,
  TrendingUp,
  Users,
  Award,
  BarChart3,
  User,
  ChevronRight,
  CheckCircle,
  BookOpen,
  ArrowLeft,
  Search,
  Filter,
  AlertCircle,
  Star,
  Activity,
  TrendingDown,
  Percent,
  ChevronDown,
  X,
  UserCheck,
} from 'lucide-react';
//import { quizStatisticsService } from '../../services/quizStatisticsService';
import { quizDetailedAttemptService } from '../../services/quizDetailedAttemptService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { userService } from '../../services/userService';


const StatisticsQuiz = () => {
  type UserType = {
    id: string;
    name: string;
    email: string;
    role: string;
    photoUrl: string | null;
  };


  const [activeTab, setActiveTab] = useState('my-stats');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchUser, setSearchUser] = useState('');
  type UserStatsType = {
    result?: Array<any>;
  };
  const [userStats, setUserStats] = useState<UserStatsType | null>(null);
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [expandedQuizzes, setExpandedQuizzes] = useState<Record<string, boolean>>({});
  const [filterCategory, setFilterCategory] = useState('all');


  const { user } = useAuth();
  const canViewAllUsers = ['admin', 'director'].includes(user?.user.user.role ?? '');


  // Categorias com cores
  const categoryStyles: Record<
    'profissionais' | 'manuais' | 'agricolas' | 'missionarias' | 'recreativas' | 'saude' | 'natureza' | 'domesticas' | 'adra' | 'default',
    string
  > = {
    profissionais: "bg-blue-500 text-white",
    manuais: "bg-yellow-500 text-gray-800",
    agricolas: "bg-green-500 text-white",
    missionarias: "bg-purple-500 text-white",
    recreativas: "bg-red-500 text-white",
    saude: "bg-pink-500 text-white",
    natureza: "bg-emerald-500 text-white",
    domesticas: "bg-orange-500 text-white",
    adra: "bg-indigo-500 text-white",
    default: "bg-gray-500 text-white"
  };


  const categories = ['all', 'profissionais', 'manuais', 'agricolas', 'missionarias', 'recreativas', 'saude', 'natureza', 'domesticas', 'adra'];


  useEffect(() => {
    if (activeTab === 'my-stats' && !userStats) {
      fetchMyStats();
    }
  }, [activeTab, userStats]);


  useEffect(() => {
    if (activeTab === 'all-users' && allUsers.length === 0) {
      fetchUsers();
    }
  }, [activeTab, allUsers]);


  const fetchMyStats = async () => {
    setLoading(true);
    try {
      if (!user?.user.user.id) {
        toast.error('Usuário não encontrado.', {
          position: 'bottom-right',
          icon: '🚫',
          className: 'dark:bg-gray-800 dark:text-white',
          duration: 5000,
        });
        return;
      }
      const data = await quizDetailedAttemptService.findByUser(user.user.user.id);
      setUserStats(data);
    } catch (error: any) {
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


  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers();
      const filteredUsers = data.filter((user: any) => user.role !== 'pending');
      setAllUsers(filteredUsers);
    } catch (error: any) {
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


  const fetchUserStats = async (userId: string) => {
    setLoading(true);
    try {
      const data = await quizDetailedAttemptService.findByUser(userId);
      setUserStats(data);
    } catch (error: any) {
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


  
  const groupAttemptsByQuiz = (attempts: any[]) => {
  console.log("ATTEMPTS:", attempts);

  const grouped: Record<string, any> = {};

  attempts.forEach(attempt => {
    const quizId = attempt.quizId;
    const quiz = attempt.quiz ?? attempt.quizDetails ?? {};
    const specialty = quiz.specialty ?? {};
    //const stats = attempt.stats ?? attempt.summary ?? {};

    if (!grouped[quizId]) {
      grouped[quizId] = {
        quizId,
        quizTitle: quiz.title ?? attempt["quiz.title"] ?? 'Título não disponível',
        specialty: {
          name: specialty.name ?? attempt["quiz.specialty.name"] ?? 'Especialidade não disponível',
          category: specialty.category ?? 'Categoria não informada',
          emblem: specialty.emblem ?? null
        },
        attempts: [],
        stats: {
          attempts: 0,
          averageScore: 0,
          bestScore: 0,
          totalQuestions: attempt.totalQuestions ?? 0
        }
      };
    }

    grouped[quizId].attempts.push(attempt);
    grouped[quizId].stats.attempts += 1;

    const currentAttempts = grouped[quizId].attempts.length;
    grouped[quizId].stats.averageScore =
      ((grouped[quizId].stats.averageScore * (currentAttempts - 1)) + (attempt.score ?? 0)) / currentAttempts;

    if ((attempt.score ?? 0) > grouped[quizId].stats.bestScore) {
      grouped[quizId].stats.bestScore = attempt.score;
    }
  });

  return Object.values(grouped);
};





  const calculateSummary = (data: any) => {
    if (!data?.result || !Array.isArray(data.result)) {
      return {
        totalQuizzes: 0,
        totalAttempts: 0,
        averageScore: 0,
        bestOverallScore: 0
      };
    }


    const groupedQuizzes = groupAttemptsByQuiz(data.result);
    const totalAttempts = groupedQuizzes.reduce((sum, q) => sum + q.stats.attempts, 0);
    const totalScore = groupedQuizzes.reduce((sum, q) => sum + q.stats.averageScore, 0);
    const bestScores = groupedQuizzes.map(q => q.stats.bestScore);


    return {
      totalQuizzes: groupedQuizzes.length,
      totalAttempts,
      averageScore: groupedQuizzes.length > 0 ? totalScore / groupedQuizzes.length : 0,
      bestOverallScore: bestScores.length > 0 ? Math.max(...bestScores) : 0
    };
  };


  const getPerformanceLevel = (score: number, totalQuestions: number) => {
    const percentage = (score / totalQuestions) * 100;
    if (percentage >= 90) return { level: 'Excelente', color: 'emerald', icon: Trophy };
    if (percentage >= 80) return { level: 'Muito Bom', color: 'blue', icon: Award };
    if (percentage >= 70) return { level: 'Bom', color: 'purple', icon: Star };
    if (percentage >= 60) return { level: 'Regular', color: 'yellow', icon: Target };
    return { level: 'Precisa Melhorar', color: 'red', icon: TrendingDown };
  };


  const getCategoryStyle = (category: string) => {
    return categoryStyles[category as keyof typeof categoryStyles] || categoryStyles.default;
  };


  type StatCardProps = {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    value: React.ReactNode;
    subtitle?: string;
    color?: string;
    trend?: number | null;
    onClick?: () => void;
  };


  const StatCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    color = "blue",
    trend = null,
    onClick,
  }: StatCardProps) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 hover:border-${color}-500/50 transition-all duration-300 ${onClick ? 'cursor-pointer' : ''} relative overflow-hidden`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br from-${color}-500/5 to-transparent`} />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div className={`p-2 rounded-lg bg-${color}-500/20`}>
            <Icon className={`w-5 h-5 text-${color}-400`} />
          </div>
          {trend && (
            <div className={`flex items-center space-x-1 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="text-xs font-medium">{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <div>
          <p className="text-gray-400 text-xs font-medium">{title}</p>
          <p className="text-xl font-bold text-white mt-1">{value}</p>
          {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
        </div>
      </div>
    </motion.div>
  );


  type QuizStatsCardProps = {
    quiz: {
      quizId: string;
      quizTitle: string;
      specialty: {
        name: string;
        category: string;
        emblem: string;
      };
      attempts: Array<any>;
      stats: {
        attempts: number;
        averageScore: number;
        bestScore: number;
        totalQuestions: number;
      };
    };
    index: number;
  };


  const QuizStatsCard = ({ quiz, index }: QuizStatsCardProps) => {
    const performance = getPerformanceLevel(quiz.stats.bestScore, quiz.stats.totalQuestions);
    const categoryStyle = getCategoryStyle(quiz.specialty.category);
    const isExpanded = expandedQuizzes[quiz.quizId];

console.log("QUIZ:", quiz);
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-700/50 rounded-xl overflow-hidden hover:border-gray-600/50 transition-all duration-300"
      >
        {/* Header */}
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="relative flex-shrink-0">
                <img
                  src={quiz.specialty.emblem}
                  alt={quiz.specialty.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.display = 'none';
                    if (img.nextSibling && img.nextSibling instanceof HTMLElement) {
                      (img.nextSibling as HTMLElement).style.display = 'flex';
                    }
                  }}
                />
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gray-600/20 hidden items-center justify-center`}>
                  <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
                <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full bg-${performance.color}-500/20 flex items-center justify-center`}>
                  <performance.icon className={`w-3 h-3 sm:w-4 sm:h-4 text-${performance.color}-400`} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-base sm:text-lg truncate">{quiz.quizTitle}</h3>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className={`px-2 py-1 ${categoryStyle} text-xs rounded-md font-medium`}>
                    {quiz.specialty.name}
                  </span>
                  <span className={`px-2 py-1 bg-${performance.color}-500/20 text-${performance.color}-400 text-xs rounded-md font-medium`}>
                    {performance.level}
                  </span>
                </div>
                <p className="text-gray-500 text-xs mt-1">
                  {quiz.stats.totalQuestions} questões • {quiz.stats.attempts} tentativas
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end space-x-2 mb-1">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                <span className="text-xl sm:text-2xl font-bold text-white">{quiz.stats.bestScore}</span>
                <span className="text-gray-400 text-sm">/{quiz.stats.totalQuestions}</span>
              </div>
              <p className="text-gray-400 text-xs">Melhor resultado</p>
            </div>
          </div>


          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4">
            <div className="text-center p-2 sm:p-3 bg-gray-700/30 rounded-lg">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Target className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                <span className="text-sm sm:text-lg font-bold text-white">{quiz.stats.averageScore.toFixed(1)}</span>
              </div>
              <p className="text-gray-400 text-xs">Média</p>
            </div>
            <div className="text-center p-2 sm:p-3 bg-gray-700/30 rounded-lg">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                <span className="text-sm sm:text-lg font-bold text-white">{quiz.stats.attempts}</span>
              </div>
              <p className="text-gray-400 text-xs">Tentativas</p>
            </div>
            <div className="text-center p-2 sm:p-3 bg-gray-700/30 rounded-lg">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Percent className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
                <span className="text-sm sm:text-lg font-bold text-white">
                  {((quiz.stats.bestScore / quiz.stats.totalQuestions) * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-gray-400 text-xs">Melhor %</p>
            </div>
          </div>


          {/* Expand Button */}
          <button
            onClick={() => setExpandedQuizzes(prev => ({ ...prev, [quiz.quizId]: !prev[quiz.quizId] }))}
            className="w-full flex items-center justify-center space-x-2 p-2 sm:p-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <span className="text-white text-sm sm:text-base font-medium">
              {isExpanded ? 'Ocultar Tentativas' : 'Ver Todas as Tentativas'}
            </span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            </motion.div>
          </button>
        </div>


        {/* Expanded Content - Attempts */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-700/50"
            >
              <div className="p-4 sm:p-6 space-y-4">
                <h4 className="text-white font-semibold flex items-center space-x-2 text-sm sm:text-base">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                  <span>Histórico de Tentativas</span>
                </h4>
                
                {quiz.attempts.map((attempt, attemptIndex) => {
                  const attemptPerformance = getPerformanceLevel(attempt.score, attempt.totalQuestions);
                  return (
                    <div key={attempt.id} className={`rounded-lg p-3 sm:p-4 border ${
                      attempt.status === 'approved'
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-red-500/10 border-red-500/30'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-md text-xs font-medium bg-${attemptPerformance.color}-500/20 text-${attemptPerformance.color}-400`}>
                            Tentativa {attemptIndex + 1}
                          </span>
                          <span className="text-white text-sm font-medium">
                            {attempt.score}/{attempt.totalQuestions} pontos
                          </span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          attempt.status === 'approved'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {attempt.status === 'approved' ? 'Aprovado' : 'Reprovado'}
                        </span>
                      </div>
                      
                      <div className="mt-2">
                        <button
                          onClick={() => setExpandedQuizzes(prev => ({
                            ...prev,
                            [`${quiz.quizId}-${attempt.id}`]: !prev[`${quiz.quizId}-${attempt.id}`]
                          }))}
                          className="text-xs text-purple-400 hover:text-purple-300 flex items-center space-x-1"
                        >
                          <span>Ver detalhes das respostas</span>
                          <ChevronDown className={`w-3 h-3 transition-transform ${
                            expandedQuizzes[`${quiz.quizId}-${attempt.id}`] ? 'rotate-180' : ''
                          }`} />
                        </button>
                        
                        <AnimatePresence>
                          {expandedQuizzes[`${quiz.quizId}-${attempt.id}`] && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-2 space-y-2"
                            >
                              {attempt.userAnswers?.map((answer: {
                                questionId: string;
                                isCorrect: boolean;
                                questionText: string;
                                userAnswerText: string;
                                correctAnswerText: string;
                              }, qIndex: number) => (
                                <div key={`${attempt.id}-${answer.questionId}`} className={`rounded-lg p-3 border ${
                                  answer.isCorrect
                                    ? 'bg-green-500/10 border-green-500/30'
                                    : 'bg-red-500/10 border-red-500/30'
                                }`}>
                                  <div className="flex items-start space-x-2">
                                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                                      answer.isCorrect
                                        ? 'bg-green-500/20 text-green-400'
                                        : 'bg-red-500/20 text-red-400'
                                    }`}>
                                      {answer.isCorrect ? (
                                        <CheckCircle className="w-3 h-3" />
                                      ) : (
                                        <X className="w-3 h-3" />
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-white text-xs font-medium mb-1">Pergunta {qIndex + 1}</p>
                                      <p className="text-white text-xs mb-2">{answer.questionText}</p>
                                      
                                      <div className={`p-2 rounded-lg ${
                                        answer.isCorrect
                                          ? 'bg-green-500/20 border border-green-500/30'
                                          : 'bg-red-500/20 border border-red-500/30'
                                      }`}>
                                        <div className="flex items-center space-x-1">
                                          <UserCheck className="w-3 h-3" />
                                          <span className="text-xs font-medium text-gray-300">Sua resposta:</span>
                                        </div>
                                        <p className={`text-xs mt-1 ${
                                          answer.isCorrect ? 'text-green-300' : 'text-red-300'
                                        }`}>
                                          {answer.userAnswerText}
                                        </p>
                                      </div>


                                      {!answer.isCorrect && (
                                        <div className="mt-2 p-2 rounded-lg bg-green-500/20 border border-green-500/30">
                                          <div className="flex items-center space-x-1">
                                            <CheckCircle className="w-3 h-3 text-green-400" />
                                            <span className="text-xs font-medium text-gray-300">Resposta correta:</span>
                                          </div>
                                          <p className="text-xs mt-1 text-green-300">
                                            {answer.correctAnswerText}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };


  type UserSelectorProps = {
    onUserSelect: (user: any) => void;
    onBack: () => void;
  };

//onUserSelect
  const UserSelector = ({ onBack }: UserSelectorProps) => {
    const filteredUsers = allUsers.filter(user =>
      user.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      user.email.toLowerCase().includes(searchUser.toLowerCase())
    );


    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Selecionar Usuário</h2>
            <p className="text-gray-400 text-sm sm:text-base">Escolha um usuário para ver suas estatísticas detalhadas</p>
          </div>
        </div>


        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar usuário por nome ou email..."
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors text-sm sm:text-base"
          />
        </div>


        {/* Users Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedUser(user);
                fetchUserStats(user.id);
              }}
              className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-3 sm:p-4 cursor-pointer hover:border-gray-600/50 transition-all duration-300 group"
            >
              <div className="flex items-center space-x-3">
                <div className="relative flex-shrink-0">
                  {user.photoUrl ? (
                    <img
                      src={user.photoUrl}
                      alt={user.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-gray-900" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white text-sm sm:text-base font-medium truncate group-hover:text-purple-400 transition-colors">
                    {user.name}
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-sm truncate">{user.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-md">
                    {user.role}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 group-hover:text-purple-400 transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>


        {filteredUsers.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <Search className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-white text-lg sm:text-xl font-semibold mb-2">Nenhum usuário encontrado</h3>
            <p className="text-gray-400 text-sm sm:text-base">Tente buscar com outros termos.</p>
          </div>
        )}
      </motion.div>
    );
  };


  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-12 sm:py-20">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full"
      />
    </div>
  );


  const groupedQuizzes = userStats?.result ? groupAttemptsByQuiz(userStats.result) : [];
  const filteredQuizzes = groupedQuizzes.filter(quiz =>
    filterCategory === 'all' || quiz.specialty.category === filterCategory
  );


  const summary = calculateSummary(userStats);


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />
     
      <div className="relative z-10 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8"
          >
            <div className="flex items-center space-x-3 mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Dashboard de Quizzes</h1>
                <p className="text-gray-400 text-sm sm:text-base">Análise completa do seu desempenho e evolução</p>
              </div>
            </div>
          </motion.div>


          {/* Tabs */}
          {canViewAllUsers && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-1 bg-gray-800/50 p-1 rounded-xl mb-6 sm:mb-8 backdrop-blur-sm border border-gray-700/50"
            >
              <button
                onClick={() => {
                  setActiveTab('my-stats');
                  setSelectedUser(null);
                  setUserStats(null);
                  fetchMyStats();
                }}
                className={`flex-1 py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base ${
                  activeTab === 'my-stats'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <User className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Minhas Estatísticas</span>
                </div>
              </button>
              <button
                onClick={() => {
                  setActiveTab('all-users');
                  setSelectedUser(null);
                  setUserStats(null);
                }}
                className={`flex-1 py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base ${
                  activeTab === 'all-users'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Outros Usuários</span>
                </div>
              </button>
            </motion.div>
          )}


          {/* Content */}
          <AnimatePresence mode="wait">
            {loading ? (
              <LoadingSpinner />
            ) : activeTab === 'my-stats' || selectedUser ? (
              <motion.div
                key="stats"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6 sm:space-y-8"
              >
                {selectedUser && (
                  <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                    <button
                      onClick={() => {
                        setSelectedUser(null);
                        setUserStats(null);
                      }}
                      className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
                    >
                      <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      {selectedUser.photoUrl ? (
                        <img
                          src={selectedUser.photoUrl}
                          alt={selectedUser.name}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                      )}
                      <div>
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">{selectedUser.name}</h2>
                        <p className="text-gray-400 text-xs sm:text-sm">{selectedUser.email}</p>
                      </div>
                    </div>
                  </div>
                )}


                {groupedQuizzes.length > 0 ? (
                  <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
                      <StatCard
                        icon={BookOpen}
                        title="Total de Quizzes"
                        value={summary.totalQuizzes}
                        subtitle="Quizzes realizados"
                        color="purple"
                      />
                      <StatCard
                        icon={Activity}
                        title="Total de Tentativas"
                        value={summary.totalAttempts}
                        subtitle="Tentativas realizadas"
                        color="blue"
                      />
                      <StatCard
                        icon={Target}
                        title="Pontuação Média"
                        value={summary.averageScore.toFixed(1)}
                        subtitle="Média geral"
                        color="green"
                      />
                      <StatCard
                        icon={Award}
                        title="Melhor Pontuação"
                        value={summary.bestOverallScore}
                        subtitle="Melhor resultado"
                        color="yellow"
                      />
                    </div>


                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6">
                      <div className="flex items-center space-x-1 text-gray-400 text-xs sm:text-sm">
                        <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Filtrar por categoria:</span>
                      </div>
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => setFilterCategory(category)}
                          className={`px-2 py-1 sm:px-3 sm:py-1 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                            filterCategory === category
                              ? category === 'all'
                                ? 'bg-gray-600 text-white'
                                : categoryStyles[category as keyof typeof categoryStyles] || categoryStyles.default
                              : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-white'
                          }`}
                        >
                          {category === 'all' ? 'Todas' : category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                      ))}
                    </div>


                    {/* Quiz Stats */}
                    <div className="space-y-4 sm:space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                          <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                          <span>Desempenho Detalhado por Quiz</span>
                        </h2>
                        <span className="text-gray-400 text-xs sm:text-sm">
                          {filteredQuizzes.length} quiz{filteredQuizzes.length !== 1 ? 'zes' : ''} encontrado{filteredQuizzes.length !== 1 ? 's' : ''}
                        </span>
                      </div>


                      {filteredQuizzes.length > 0 ? (
                        <div className="space-y-4 sm:space-y-6">
                          {filteredQuizzes.map((quiz, index) => (
                            <QuizStatsCard key={quiz.quizId} quiz={quiz} index={index} />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 sm:py-12">
                          <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500 mx-auto mb-4" />
                          <h3 className="text-white text-lg sm:text-xl font-semibold mb-2">
                            {selectedUser
                              ? `${selectedUser.name} não possui estatísticas ainda`
                              : 'Nenhum quiz encontrado'}
                          </h3>
                          <p className="text-gray-400 text-sm sm:text-base">
                            {selectedUser
                              ? 'Este usuário ainda não completou nenhum quiz.'
                              : 'Não há quizzes nesta categoria ainda.'}
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 sm:py-20">
                    <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-white text-lg sm:text-xl font-semibold mb-2">
                      {selectedUser
                        ? `${selectedUser.name} não possui estatísticas ainda`
                        : 'Sem dados disponíveis'}
                    </h3>
                    <p className="text-gray-400 text-sm sm:text-base">
                      {selectedUser
                        ? 'Este usuário ainda não completou nenhum quiz.'
                        : 'Realize alguns quizzes para ver suas estatísticas aqui.'}
                    </p>
                  </div>
                )}
              </motion.div>
            ) : activeTab === 'all-users' ? (
              <UserSelector
                onUserSelect={setSelectedUser}
                onBack={() => {
                  setActiveTab('my-stats');
                  setUserStats(null);
                  fetchMyStats();
                }}
              />
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};


export default StatisticsQuiz;


















































// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   Trophy,
//   Target,
//   TrendingUp,
//   Users,
//   Award,
//   BarChart3,
//   User,
//   ChevronRight,
//   CheckCircle,
//   BookOpen,
//   ArrowLeft,
//   Search,
//   Filter,
//   AlertCircle,
//   Star,
//   Brain,
//   Activity,
//   TrendingDown,
//   Percent,
//   ChevronDown,
//   X,
//   UserCheck,
// } from 'lucide-react';
// import { quizStatisticsService } from '../../services/quizStatisticsService';
// import { quizDetailedAttemptService } from '../../services/quizDetailedAttemptService';
// import { useAuth } from '../../context/AuthContext';
// import toast from 'react-hot-toast';
// import { userService } from '../../services/userService';


// const StatisticsQuiz = () => {
//   type UserType = {
//     id: string;
//     name: string;
//     email: string;
//     role: string;
//     photoUrl: string | null;
//   };

//   const [activeTab, setActiveTab] = useState('my-stats');
//   const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [searchUser, setSearchUser] = useState('');
//   type UserStatsType = {
//     result?: Array<any>;
//     // Add other properties if needed
//   };
//   const [userStats, setUserStats] = useState<UserStatsType | null>(null);
//   const [allUsers, setAllUsers] = useState<UserType[]>([]);
//   const [expandedStats, setExpandedStats] = useState<Record<string, boolean>>({});
//   const [filterCategory, setFilterCategory] = useState('all');


//   const { user } = useAuth();


//   const canViewAllUsers = ['admin', 'director'].includes(user?.user.user.role ?? '');


//   // Categorias com cores
//   const categoryStyles: Record<
//     'profissionais' | 'manuais' | 'agricolas' | 'missionarias' | 'recreativas' | 'saude' | 'natureza' | 'domesticas' | 'adra' | 'default',
//     string
//   > = {
//     profissionais: "bg-blue-500 text-white",
//     manuais: "bg-yellow-500 text-gray-800",
//     agricolas: "bg-green-500 text-white",
//     missionarias: "bg-purple-500 text-white",
//     recreativas: "bg-red-500 text-white",
//     saude: "bg-pink-500 text-white",
//     natureza: "bg-emerald-500 text-white",
//     domesticas: "bg-orange-500 text-white",
//     adra: "bg-indigo-500 text-white",
//     default: "bg-gray-500 text-white"
//   };


//   const categories = ['all', 'profissionais', 'manuais', 'agricolas', 'missionarias', 'recreativas', 'saude', 'natureza', 'domesticas', 'adra'];


//   useEffect(() => {
//     if (activeTab === 'my-stats' && !userStats) {
//       fetchMyStats();
//     }
//   }, [activeTab, userStats]);


//   useEffect(() => {
//     if (activeTab === 'all-users' && allUsers.length === 0) {
//       fetchUsers();
//     }
//   }, [activeTab, allUsers]);


//   const fetchMyStats = async () => {
//     setLoading(true);
//     try {
//       if (!user?.user.user.id) {
//         toast.error('Usuário não encontrado.', {
//           position: 'bottom-right',
//           icon: '🚫',
//           className: 'dark:bg-gray-800 dark:text-white',
//           duration: 5000,
//         });
//         return;
//       }
//       const data = await quizDetailedAttemptService.findByUser(user.user.user.id);
//       setUserStats(data);
//     } catch (error: any) {
//       toast.error(`Error: ${error.message}`, {
//         position: 'bottom-right',
//         icon: '🚫',
//         className: 'dark:bg-gray-800 dark:text-white',
//         duration: 5000,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };


//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const data = await userService.getAllUsers();
//       // Filtrar usuários com role 'pending'
//       const filteredUsers = data.filter((user: any) => user.role !== 'pending');
//       setAllUsers(filteredUsers);
//     } catch (error: any) {
//       toast.error(`Error: ${error.message}`, {
//         position: 'bottom-right',
//         icon: '🚫',
//         className: 'dark:bg-gray-800 dark:text-white',
//         duration: 5000,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };


//   const fetchUserStats = async (userId: string) => {
//     setLoading(true);
//     try {
//       const data = await quizDetailedAttemptService.findByUser(userId);
//       setUserStats(data);
//     } catch (error: any) {
//       toast.error(`Error: ${error.message}`, {
//         position: 'bottom-right',
//         icon: '🚫',
//         className: 'dark:bg-gray-800 dark:text-white',
//         duration: 5000,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };


//   const calculateSummary = (data: any) => {
//     if (!data?.result || !Array.isArray(data.result)) {
//       return {
//         totalQuizzes: 0,
//         totalAttempts: 0,
//         averageScore: 0,
//         bestOverallScore: 0
//       };
//     }


//     const quizzes = data.result;
//     const uniqueQuizzes = new Set(quizzes.map((q: any) => q.quizId));
//     const totalAttempts = quizzes.reduce((sum: number, q: any) => sum + q.stats.attempts, 0);
//     const totalScore = quizzes.reduce((sum: number, q: any) => sum + q.stats.averageScore, 0);
//     const bestScores = quizzes.map((q: any) => q.stats.bestScore);


//     return {
//       totalQuizzes: uniqueQuizzes.size,
//       totalAttempts,
//       averageScore: quizzes.length > 0 ? totalScore / quizzes.length : 0,
//       bestOverallScore: bestScores.length > 0 ? Math.max(...bestScores) : 0
//     };
//   };


//   const getPerformanceLevel = (score: number, totalQuestions: number) => {
//     const percentage = (score / totalQuestions) * 100;
//     if (percentage >= 90) return { level: 'Excelente', color: 'emerald', icon: Trophy };
//     if (percentage >= 80) return { level: 'Muito Bom', color: 'blue', icon: Award };
//     if (percentage >= 70) return { level: 'Bom', color: 'purple', icon: Star };
//     if (percentage >= 60) return { level: 'Regular', color: 'yellow', icon: Target };
//     return { level: 'Precisa Melhorar', color: 'red', icon: TrendingDown };
//   }

//   const getCategoryStyle = (category: string) => {
//     return categoryStyles[category as keyof typeof categoryStyles] || categoryStyles.default;
//   };

//   type StatCardProps = {
//     icon: React.ComponentType<{ className?: string }>;
//     title: string;
//     value: React.ReactNode;
//     subtitle?: string;
//     color?: string;
//     trend?: number | null;
//     onClick?: () => void;
//   };

//   const StatCard = ({
//     icon: Icon,
//     title,
//     value,
//     subtitle,
//     color = "blue",
//     trend = null,
//     onClick,
//   }: StatCardProps) => (
//     <motion.div
//       whileHover={{ scale: 1.02, y: -2 }}
//       whileTap={{ scale: 0.98 }}
//       onClick={onClick}
//       className={`bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-${color}-500/50 transition-all duration-300 ${onClick ? 'cursor-pointer' : ''} relative overflow-hidden`}
//     >
//       <div className={`absolute inset-0 bg-gradient-to-br from-${color}-500/5 to-transparent`} />
//       <div className="relative z-10">
//         <div className="flex items-center justify-between mb-4">
//           <div className={`p-3 rounded-lg bg-${color}-500/20`}>
//             <Icon className={`w-6 h-6 text-${color}-400`} />
//           </div>
//           {trend && (
//             <div className={`flex items-center space-x-1 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
//               {trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
//               <span className="text-sm font-medium">{Math.abs(trend)}%</span>
//             </div>
//           )}
//         </div>
//         <div>
//           <p className="text-gray-400 text-sm font-medium">{title}</p>
//           <p className="text-2xl font-bold text-white mt-1">{value}</p>
//           {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
//         </div>
//       </div>
//     </motion.div>
//   );


//   type QuizStatsCardProps = {
//     attempt: {
//       id: string;
//       score: number;
//       totalQuestions: number;
//       stats: {
//         attempts: number;
//         averageScore: number;
//         bestScore: number;
//       };
//       quiz: {
//         title: string;
//         specialty: {
//           name: string;
//           category: string;
//           emblem: string;
//         };
//       };
//       status?: string;
//       userAnswers?: Array<{
//         questionId: string;
//         isCorrect: boolean;
//         questionText: string;
//         userAnswerText: string;
//         correctAnswerText: string;
//       }>;
//     };
//     index: number;
//   };

//   const QuizStatsCard = ({ attempt, index }: QuizStatsCardProps) => {
//     const performance = getPerformanceLevel(attempt.score, attempt.totalQuestions);
//     const categoryStyle = getCategoryStyle(attempt.quiz.specialty.category);
//     const isExpanded = expandedStats[attempt.id];


//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: index * 0.1 }}
//         className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-700/50 rounded-xl overflow-hidden hover:border-gray-600/50 transition-all duration-300"
//       >
//         {/* Header */}
//         <div className="p-6">
//           <div className="flex items-start justify-between mb-4">
//             <div className="flex items-center space-x-4">
//               <div className="relative">
//                 <img
//                   src={attempt.quiz.specialty.emblem}
//                   alt={attempt.quiz.specialty.name}
//                   className="w-16 h-16 rounded-xl object-cover"
//                   onError={(e) => {
//                     const img = e.target as HTMLImageElement;
//                     img.style.display = 'none';
//                     if (img.nextSibling && img.nextSibling instanceof HTMLElement) {
//                       (img.nextSibling as HTMLElement).style.display = 'flex';
//                     }
//                   }}
//                 />
//                 <div className={`w-16 h-16 rounded-xl bg-gray-600/20 hidden items-center justify-center`}>
//                   <BookOpen className="w-8 h-8 text-gray-400" />
//                 </div>
//                 <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full bg-${performance.color}-500/20 flex items-center justify-center`}>
//                   <performance.icon className={`w-4 h-4 text-${performance.color}-400`} />
//                 </div>
//               </div>
//               <div>
//                 <h3 className="text-white font-semibold text-lg">{attempt.quiz.title}</h3>
//                 <div className="flex items-center space-x-2 mt-1">
//                   <span className={`px-2 py-1 ${categoryStyle} text-xs rounded-md font-medium`}>
//                     {attempt.quiz.specialty.name}
//                   </span>
//                   <span className={`px-2 py-1 bg-${performance.color}-500/20 text-${performance.color}-400 text-xs rounded-md font-medium`}>
//                     {performance.level}
//                   </span>
//                 </div>
//                 <p className="text-gray-500 text-sm mt-1">
//                   {attempt.totalQuestions} questões • {attempt.stats.attempts} tentativas
//                 </p>
//               </div>
//             </div>
//             <div className="text-right">
//               <div className="flex items-center space-x-2 mb-1">
//                 <Trophy className="w-5 h-5 text-yellow-400" />
//                 <span className="text-2xl font-bold text-white">{attempt.stats.bestScore}</span>
//                 <span className="text-gray-400">/{attempt.totalQuestions}</span>
//               </div>
//               <p className="text-gray-400 text-sm">Melhor resultado</p>
//             </div>
//           </div>


//           {/* Stats Grid */}
//           <div className="grid grid-cols-3 gap-4 mb-4">
//             <div className="text-center p-3 bg-gray-700/30 rounded-lg">
//               <div className="flex items-center justify-center space-x-1 mb-1">
//                 <Target className="w-4 h-4 text-blue-400" />
//                 <span className="text-lg font-bold text-white">{attempt.stats.averageScore.toFixed(1)}</span>
//               </div>
//               <p className="text-gray-400 text-xs">Média</p>
//             </div>
//             <div className="text-center p-3 bg-gray-700/30 rounded-lg">
//               <div className="flex items-center justify-center space-x-1 mb-1">
//                 <Activity className="w-4 h-4 text-green-400" />
//                 <span className="text-lg font-bold text-white">{attempt.stats.attempts}</span>
//               </div>
//               <p className="text-gray-400 text-xs">Tentativas</p>
//             </div>
//             <div className="text-center p-3 bg-gray-700/30 rounded-lg">
//               <div className="flex items-center justify-center space-x-1 mb-1">
//                 <Percent className="w-4 h-4 text-purple-400" />
//                 <span className="text-lg font-bold text-white">
//                   {((attempt.score / attempt.totalQuestions) * 100).toFixed(0)}%
//                 </span>
//               </div>
//               <p className="text-gray-400 text-xs">Última tentativa</p>
//             </div>
//           </div>


//           {/* Expand Button */}
//           <button
//             onClick={() => setExpandedStats(prev => ({ ...prev, [attempt.id]: !prev[attempt.id] }))}
//             className="w-full flex items-center justify-center space-x-2 p-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-colors"
//           >
//             <span className="text-white font-medium">
//               {isExpanded ? 'Ocultar Detalhes' : 'Ver Questões Detalhadas'}
//             </span>
//             <motion.div
//               animate={{ rotate: isExpanded ? 180 : 0 }}
//               transition={{ duration: 0.2 }}
//             >
//               <ChevronDown className="w-5 h-5 text-gray-400" />
//             </motion.div>
//           </button>
//         </div>


//         {/* Expanded Content */}
//         <AnimatePresence>
//           {isExpanded && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: 'auto' }}
//               exit={{ opacity: 0, height: 0 }}
//               className="border-t border-gray-700/50"
//             >
//               <div className="p-6 space-y-4">
//                 <div className="flex items-center justify-between mb-4">
//                   <h4 className="text-white font-semibold flex items-center space-x-2">
//                     <Brain className="w-5 h-5 text-purple-400" />
//                     <span>Análise Detalhada da Última Tentativa</span>
//                   </h4>
//                   <div className="flex items-center space-x-2">
//                     <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//                       attempt.status === 'passed' 
//                         ? 'bg-green-500/20 text-green-400' 
//                         : 'bg-red-500/20 text-red-400'
//                     }`}>
//                       {attempt.status === 'passed' ? 'Aprovado' : 'Reprovado'}
//                     </span>
//                   </div>
//                 </div>
              
//                 {attempt.userAnswers?.map((answer, qIndex) => (
//                   <div key={answer.questionId} className={`rounded-lg p-4 border ${
//                     answer.isCorrect 
//                       ? 'bg-green-500/10 border-green-500/30' 
//                       : 'bg-red-500/10 border-red-500/30'
//                   }`}>
//                     <div className="flex items-start space-x-3">
//                       <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
//                         answer.isCorrect 
//                           ? 'bg-green-500/20 text-green-400' 
//                           : 'bg-red-500/20 text-red-400'
//                       }`}>
//                         {answer.isCorrect ? (
//                           <CheckCircle className="w-5 h-5" />
//                         ) : (
//                           <X className="w-5 h-5" />
//                         )}
//                       </div>
//                       <div className="flex-1">
//                         <div className="flex items-center justify-between mb-2">
//                           <span className="text-sm text-gray-400">Pergunta {qIndex + 1}</span>
//                           <span className={`text-sm font-medium ${
//                             answer.isCorrect ? 'text-green-400' : 'text-red-400'
//                           }`}>
//                             {answer.isCorrect ? 'Correto' : 'Incorreto'}
//                           </span>
//                         </div>
//                         <p className="text-white font-medium mb-3">{answer.questionText}</p>
                        
//                         <div className="space-y-2">
//                           {/* Resposta do usuário */}
//                           <div className={`p-3 rounded-lg ${
//                             answer.isCorrect 
//                               ? 'bg-green-500/20 border border-green-500/30' 
//                               : 'bg-red-500/20 border border-red-500/30'
//                           }`}>
//                             <div className="flex items-center space-x-2">
//                               <UserCheck className="w-4 h-4" />
//                               <span className="text-sm font-medium text-gray-300">Sua resposta:</span>
//                             </div>
//                             <p className={`text-sm mt-1 ${
//                               answer.isCorrect ? 'text-green-300' : 'text-red-300'
//                             }`}>
//                               {answer.userAnswerText}
//                             </p>
//                           </div>


//                           {/* Resposta correta (se errou) */}
//                           {!answer.isCorrect && (
//                             <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/30">
//                               <div className="flex items-center space-x-2">
//                                 <CheckCircle className="w-4 h-4 text-green-400" />
//                                 <span className="text-sm font-medium text-gray-300">Resposta correta:</span>
//                               </div>
//                               <p className="text-sm mt-1 text-green-300">
//                                 {answer.correctAnswerText}
//                               </p>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.div>
//     );
//   };


//   type UserSelectorProps = {
//     onUserSelect: (user: any) => void;
//     onBack: () => void;
//   };

//   const UserSelector = ({ onUserSelect, onBack }: UserSelectorProps) => {
//     const filteredUsers = allUsers.filter(user =>
//       user.name.toLowerCase().includes(searchUser.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchUser.toLowerCase())
//     );


//     return (
//       <motion.div
//         initial={{ opacity: 0, x: 20 }}
//         animate={{ opacity: 1, x: 0 }}
//         className="space-y-6"
//       >
//         <div className="flex items-center space-x-4 mb-6">
//           <button
//             onClick={onBack}
//             className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
//           >
//             <ArrowLeft className="w-5 h-5" />
//           </button>
//           <div>
//             <h2 className="text-2xl font-bold text-white">Selecionar Usuário</h2>
//             <p className="text-gray-400">Escolha um usuário para ver suas estatísticas detalhadas</p>
//           </div>
//         </div>


//         {/* Search */}
//         <div className="relative">
//           <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Buscar usuário por nome ou email..."
//             value={searchUser}
//             onChange={(e) => setSearchUser(e.target.value)}
//             className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
//           />
//         </div>


//         {/* Users Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {filteredUsers.map((user, index) => (
//             <motion.div
//               key={user.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.1 }}
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={() => {
//                 setSelectedUser(user);
//                 fetchUserStats(user.id);
//               }}
//               className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 cursor-pointer hover:border-gray-600/50 transition-all duration-300 group"
//             >
//               <div className="flex items-center space-x-3">
//                 <div className="relative">
//                   {user.photoUrl ? (
//                     <img
//                       src={user.photoUrl}
//                       alt={user.name}
//                       className="w-12 h-12 rounded-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
//                       <User className="w-6 h-6 text-white" />
//                     </div>
//                   )}
//                   <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900" />
//                 </div>
//                 <div className="flex-1">
//                   <h3 className="text-white font-medium group-hover:text-purple-400 transition-colors">
//                     {user.name}
//                   </h3>
//                   <p className="text-gray-500 text-sm">{user.email}</p>
//                   <span className="inline-block mt-1 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-md">
//                     {user.role}
//                   </span>
//                 </div>
//                 <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition-colors" />
//               </div>
//             </motion.div>
//           ))}
//         </div>


//         {filteredUsers.length === 0 && (
//           <div className="text-center py-12">
//             <Search className="w-16 h-16 text-gray-500 mx-auto mb-4" />
//             <h3 className="text-white text-xl font-semibold mb-2">Nenhum usuário encontrado</h3>
//             <p className="text-gray-400">Tente buscar com outros termos.</p>
//           </div>
//         )}
//       </motion.div>
//     );
//   };


//   const LoadingSpinner = () => (
//     <div className="flex items-center justify-center py-20">
//       <motion.div
//         animate={{ rotate: 360 }}
//         transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//         className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full"
//       />
//     </div>
//   );


//   const filteredStats = userStats?.result?.filter(attempt =>
//     filterCategory === 'all' || attempt.quiz.specialty.category === filterCategory
//   ) || [];


//   const summary = calculateSummary(userStats);


//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
//       {/* Background Pattern */}
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />
     
//       <div className="relative z-10 p-4 sm:p-6">
//         <div className="max-w-7xl mx-auto">
//           {/* Header */}
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="mb-8"
//           >
//             <div className="flex items-center space-x-3 mb-4">
//               <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20">
//                 <BarChart3 className="w-8 h-8 text-purple-400" />
//               </div>
//               <div>
//                 <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard de Quizzes</h1>
//                 <p className="text-gray-400">Análise completa do seu desempenho e evolução</p>
//               </div>
//             </div>
//           </motion.div>


//           {/* Tabs */}
//           {canViewAllUsers && (
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-1 bg-gray-800/50 p-1 rounded-xl mb-8 backdrop-blur-sm border border-gray-700/50"
//             >
//               <button
//                 onClick={() => {
//                   setActiveTab('my-stats');
//                   setSelectedUser(null);
//                   setUserStats(null);
//                   fetchMyStats();
//                 }}
//                 className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
//                   activeTab === 'my-stats'
//                     ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
//                     : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
//                 }`}
//               >
//                 <div className="flex items-center justify-center space-x-2">
//                   <User className="w-4 h-4" />
//                   <span>Minhas Estatísticas</span>
//                 </div>
//               </button>
//               <button
//                 onClick={() => {
//                   setActiveTab('all-users');
//                   setSelectedUser(null);
//                   setUserStats(null);
//                 }}
//                 className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
//                   activeTab === 'all-users'
//                     ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
//                     : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
//                 }`}
//               >
//                 <div className="flex items-center justify-center space-x-2">
//                   <Users className="w-4 h-4" />
//                   <span>Outros Usuários</span>
//                 </div>
//               </button>
//             </motion.div>
//           )}


//           {/* Content */}
//           <AnimatePresence mode="wait">
//             {loading ? (
//               <LoadingSpinner />
//             ) : activeTab === 'my-stats' || selectedUser ? (
//               <motion.div
//                 key="stats"
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: 20 }}
//                 className="space-y-8"
//               >
//                 {selectedUser && (
//                   <div className="flex items-center space-x-4 mb-6">
//                     <button
//                       onClick={() => {
//                         setSelectedUser(null);
//                         setUserStats(null);
//                       }}
//                       className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
//                     >
//                       <ArrowLeft className="w-5 h-5" />
//                     </button>
//                     <div className="flex items-center space-x-3">
//                       {selectedUser.photoUrl ? (
//                         <img
//                           src={selectedUser.photoUrl}
//                           alt={selectedUser.name}
//                           className="w-12 h-12 rounded-full object-cover"
//                         />
//                       ) : (
//                         <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
//                           <User className="w-6 h-6 text-white" />
//                         </div>
//                       )}
//                       <div>
//                         <h2 className="text-2xl font-bold text-white">{selectedUser.name}</h2>
//                         <p className="text-gray-400">{selectedUser.email}</p>
//                       </div>
//                     </div>
//                   </div>
//                 )}


//                 {userStats?.result && userStats.result.length > 0 ? (
//                   <>
//                     {/* Summary Cards */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

//                       <StatCard
//                         icon={BookOpen}
//                         title="Total de Quizzes"
//                         value={summary.totalQuizzes}
//                         subtitle="Quizzes realizados"
//                         color="purple"
//                       />
//                       <StatCard
//                         icon={Activity}
//                         title="Total de Tentativas"
//                         value={summary.totalAttempts}
//                         subtitle="Tentativas realizadas"
//                         color="blue"
//                       />
//                       <StatCard
//                         icon={Target}
//                         title="Pontuação Média"
//                         value={summary.averageScore.toFixed(1)}
//                         subtitle="Média geral"
//                         color="green"
//                       />
//                       <StatCard
//                         icon={Award}
//                         title="Melhor Pontuação"
//                         value={summary.bestOverallScore}
//                         subtitle="Melhor resultado"
//                         color="yellow"
//                       />
//                     </div>


//                     {/* Filters */}
//                     <div className="flex flex-wrap items-center gap-2 mb-6">
//                       <div className="flex items-center space-x-1 text-gray-400">
//                         <Filter className="w-4 h-4" />
//                         <span className="text-sm">Filtrar por categoria:</span>
//                       </div>
//                       {categories.map((category) => (
//                         <button
//                           key={category}
//                           onClick={() => setFilterCategory(category)}
//                           className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
//                             filterCategory === category
//                               ? category === 'all' 
//                                 ? 'bg-gray-600 text-white' 
//                                 : categoryStyles[category as keyof typeof categoryStyles] || categoryStyles.default
//                               : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-white'
//                           }`}
//                         >
//                           {category === 'all' ? 'Todas' : category.charAt(0).toUpperCase() + category.slice(1)}
//                         </button>
//                       ))}
//                     </div>


//                     {/* Quiz Stats */}
//                     <div className="space-y-6">
//                       <div className="flex items-center justify-between">
//                         <h2 className="text-xl font-bold text-white flex items-center space-x-2">
//                           <BarChart3 className="w-5 h-5 text-purple-400" />
//                           <span>Desempenho Detalhado por Quiz</span>
//                         </h2>
//                         <span className="text-gray-400 text-sm">
//                           {filteredStats.length} quiz{filteredStats.length !== 1 ? 'zes' : ''} encontrado{filteredStats.length !== 1 ? 's' : ''}
//                         </span>
//                       </div>


//                       {filteredStats.length > 0 ? (
//                         <div className="space-y-6">
//                           {filteredStats.map((attempt, index) => (
//                             <QuizStatsCard key={attempt.id} attempt={attempt} index={index} />
//                           ))}
//                         </div>
//                       ) : (
//                         <div className="text-center py-12">
//                           <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
//                           <h3 className="text-white text-xl font-semibold mb-2">
//                             {selectedUser 
//                               ? `${selectedUser.name} não possui estatísticas ainda`
//                               : 'Nenhum quiz encontrado'}
//                           </h3>
//                           <p className="text-gray-400">
//                             {selectedUser
//                               ? 'Este usuário ainda não completou nenhum quiz.'
//                               : 'Não há quizzes nesta categoria ainda.'}
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                     </>
//                     ) : (
//                     <div className="text-center py-20">
//                       <AlertCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
//                       <h3 className="text-white text-xl font-semibold mb-2">
//                         {selectedUser 
//                           ? `${selectedUser.name} não possui estatísticas ainda`
//                           : 'Sem dados disponíveis'}
//                       </h3>
//                       <p className="text-gray-400">
//                         {selectedUser
//                           ? 'Este usuário ainda não completou nenhum quiz.'
//                           : 'Realize alguns quizzes para ver suas estatísticas aqui.'}
//                       </p>
//                     </div>
//                     )}
//                     </motion.div>
//                     ) : activeTab === 'all-users' ? (
//                     <UserSelector
//                       onUserSelect={setSelectedUser}
//                       onBack={() => {
//                         setActiveTab('my-stats');
//                         setUserStats(null);
//                         fetchMyStats();
//                       }}
//                     />
//                     ) : null}
//                   </AnimatePresence>
//                 </div>
//               </div>
//             </div>
//           );
//         };


// export default StatisticsQuiz;
























// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   Trophy, 
//   Target, 
//   TrendingUp, 
//   Users, 
//   Clock, 
//   Award, 
//   BarChart3, 
//   User,
//   ChevronRight,
//   CheckCircle,
//   BookOpen,
//   ArrowLeft,
//   Search,
//   Filter,
//   AlertCircle,
//   Star,
//   Brain,
//   Activity,
//   TrendingDown,
//   Percent,
//   ChevronDown,

// } from 'lucide-react';
// import { quizStatisticsService } from '../../services/quizStatisticsService';
// import { useAuth } from '../../context/AuthContext';
// import toast from 'react-hot-toast';
// import { userService } from '../../services/userService';


// const StatisticsQuiz = () => {
//   const [activeTab, setActiveTab] = useState('my-stats');
//   interface UserType {
//     id: string;
//     name: string;
//     email: string;
//     role: string;
//     photoUrl: string | null;
//   }
//   const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
//   const [userRole, setUserRole] = useState(''); 
//   const [currentUserId, setCurrentUserId] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [searchUser, setSearchUser] = useState('');
//   interface QuizStats {
//     id: string;
//     userId: string;
//     quizId: string;
//     attempts: number;
//     bestScore: number;
//     averageScore: number;
//     createdAt: string;
//     updatedAt: string;
//     quiz: {
//       id: string;
//       title: string;
//       is_active: boolean;
//       specialtyId: string;
//       specialty: {
//         id: string;
//         name: string;
//         category: string;
//         emblem: string;
//       };
//       questions: Array<{
//         id: string;
//         question: string;
//         quizAnswers: Array<{
//           id: string;
//           answer: string;
//           isCorrect: boolean;
//         }>;
//       }>;
//     };
//   }

//   interface UserStatsType {
//     success: boolean;
//     message: string;
//     result: {
//       stats: {
//         stats: QuizStats[];
//       };
//       summary: {
//         totalQuizzes: number;
//         totalAttempts: number;
//         averageScore: number;
//         bestOverallScore: number;
//       };
//     };
//   }

//   const [userStats, setUserStats] = useState<UserStatsType | null>(null);
//   interface UserType {
//     id: string;
//     name: string;
//     email: string;
//     role: string;
//     photoUrl: string | null;
//   }
//   const [allUsers, setAllUsers] = useState<UserType[]>([]);
//   const [expandedStats, setExpandedStats] = useState<Record<string, boolean>>({});
//   const [selectedQuizDetails, setSelectedQuizDetails] = useState(null);
//   const [filterCategory, setFilterCategory] = useState('all');

//   const { user } = useAuth()


//   const canViewAllUsers = ['admin', 'director'].includes(user?.user.user.role ?? '');


//   // Mock data - substitua pelas suas chamadas de API reais
//   const mockUserStats = {
//     success: true,
//     message: "Estatísticas do usuário com detalhes dos quizzes",
//     result: {
//       stats: {
//         stats: [
//           {
//             id: "bc059263-1f36-4062-926b-37808deaf152",
//             userId: "795b6f98-1ac8-45f7-b095-abe03ea9f9dd",
//             quizId: "d4df02c8-0e14-4cfd-97eb-f858ae886747",
//             attempts: 3,
//             bestScore: 8,
//             averageScore: 6.7,
//             createdAt: "2025-06-16T22:01:17.634Z",
//             updatedAt: "2025-06-16T22:01:17.634Z",
//             quiz: {
//               id: "d4df02c8-0e14-4cfd-97eb-f858ae886747",
//               title: "Sementes (Quiz)",
//               is_active: true,
//               specialtyId: "c39e340e-b1b3-4405-9c52-9c7a96bf221b",
//               specialty: {
//                 id: "c39e340e-b1b3-4405-9c52-9c7a96bf221b",
//                 name: "Sementes",
//                 category: "natureza",
//                 emblem: "https://res.cloudinary.com/dpiodfiad/image/upload/v1750076682/imagem_en040_jkyhyt.png"
//               },
//               questions: [
//                 {
//                   id: "a6e4d9b3-1f89-4a3f-98f0-460445d693a0",
//                   question: "Qual é o principal objetivo de uma semente?",
//                   quizAnswers: [
//                     { id: "b799cf70-3ef3-44b1-9a0c-3d8561e1794f", answer: "Atrair insetos", isCorrect: false },
//                     { id: "3932c587-d465-4c4b-af31-f0734a0029f9", answer: "Reproduzir sua espécie", isCorrect: true },
//                     { id: "153ea467-c0d3-4f4e-a367-a68e69052710", answer: "Servir de alimento para animais", isCorrect: false },
//                     { id: "8e7bd5f9-588e-4b61-be12-ab035ff189b9", answer: "Produzir flores", isCorrect: false }
//                   ]
//                 },
//                 {
//                   id: "b7f5e8c4-2g90-5b4g-09g1-571556e804b1",
//                   question: "Como as sementes se dispersam na natureza?",
//                   quizAnswers: [
//                     { id: "c800dg81-4fg4-55c2-0d9d-4e9672f2805g", answer: "Apenas pelo vento", isCorrect: false },
//                     { id: "4043d698-e576-5d5c-bg42-g1845b1140g0", answer: "Vento, água, animais", isCorrect: true },
//                     { id: "264fb578-d1e4-5g5f-b478-b79f80163811", answer: "Apenas por animais", isCorrect: false },
//                     { id: "9f8ce6g0-699f-5c72-cf23-bc146gg290c0", answer: "Apenas pela água", isCorrect: false }
//                   ]
//                 }
//               ]
//             }
//           },
//           {
//             id: "cd160374-2g47-5173-037c-48919efbc263",
//             userId: "795b6f98-1ac8-45f7-b095-abe03ea9f9dd",
//             quizId: "e5eg13d9-1f25-5dge-98gc-g969bf997858",
//             attempts: 2,
//             bestScore: 10,
//             averageScore: 9.5,
//             createdAt: "2025-06-15T18:30:45.123Z",
//             updatedAt: "2025-06-15T18:30:45.123Z",
//             quiz: {
//               id: "e5eg13d9-1f25-5dge-98gc-g969bf997858",
//               title: "Matemática Básica",
//               is_active: true,
//               specialtyId: "d40f451f-c2c4-5516-ad63-ad8b97cg332c",
//               specialty: {
//                 id: "d40f451f-c2c4-5516-ad63-ad8b97cg332c",
//                 name: "Matemática",
//                 category: "exatas",
//                 emblem: "https://res.cloudinary.com/dpiodfiad/image/upload/v1750076682/math_icon.png"
//               },
//               questions: [
//                 {
//                   id: "f8g6f0e5-30a1-6c5h-10h2-682667g915c2",
//                   question: "Quanto é 2 + 2?",
//                   quizAnswers: [
//                     { id: "g901eh92-5hg5-66d3-1e0e-5f0783g316h", answer: "3", isCorrect: false },
//                     { id: "5154e709-f687-6e6d-ch53-h2956c2251h1", answer: "4", isCorrect: true },
//                     { id: "375gc689-e2f5-6h6g-c589-c80g91274922", answer: "5", isCorrect: false },
//                     { id: "0g9df7h1-700g-6d83-dg34-cd257hh401d1", answer: "6", isCorrect: false }
//                   ]
//                 }
//               ]
//             }
//           }
//         ]
//       },
//       summary: {
//         totalQuizzes: 17,
//         totalAttempts: 31,
//         averageScore: 7.553921568627451,
//         bestOverallScore: 10
//       }
//     }
//   };


//   const mockAllUsers = [
//     { id: '1', name: 'João Silva', email: 'joao@example.com', role: 'student', photoUrl: null },
//     { id: '2', name: 'Maria Santos', email: 'maria@example.com', role: 'counselor', photoUrl: null },
//     { id: '3', name: 'Pedro Costa', email: 'pedro@example.com', role: 'student', photoUrl: null },
//     { id: '4', name: 'Ana Oliveira', email: 'ana@example.com', role: 'dbv', photoUrl: null }
//   ];


//   useEffect(() => {
//     if (activeTab === 'my-stats' && !userStats) {
//       fetchMyStats();
//     }
//   }, [activeTab, userStats]);


//   useEffect(() => {
//     if (activeTab === 'all-users' && allUsers.length === 0) {
//       fetchUsers();
//     }
//   }, [activeTab, allUsers]);

//     const fetchMyStats = async () => {
//       setLoading(true);
//       try {
//         if (!user?.user.user.id) {
//           toast.error('Usuário não encontrado.', {
//             position: 'bottom-right',
//             icon: '🚫',
//             className: 'dark:bg-gray-800 dark:text-white',
//             duration: 5000,
//           });
//           setLoading(false);
//           return;
//         }
//         const data = await quizStatisticsService.getByUserQuizStatisticsUseCase(user.user.user.id);
//         setUserStats(data);
//         setLoading(false);
//       } catch (error: any) {
//         toast.error(`Error: ${error.message}`, {
//             position: 'bottom-right',
//             icon: '🚫',
//             className: 'dark:bg-gray-800 dark:text-white',
//             duration: 5000,
//           });
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchUsers = async () => {
//       setLoading(true);
//       try {
//         const data = await userService.getAllUsers();
//         setAllUsers(data);
//         setLoading(false);
//       } catch (error: any) {
//         toast.error(`Error: ${error.message}`, {
//             position: 'bottom-right',
//             icon: '🚫',
//             className: 'dark:bg-gray-800 dark:text-white',
//             duration: 5000,
//           });
//       } finally {
//         setLoading(false);
//       }
//     };


//   const getPerformanceLevel = (score: number, maxScore: number) => {
//     const percentage = (score / maxScore) * 100;
//     if (percentage >= 90) return { level: 'Excelente', color: 'emerald', icon: Trophy };
//     if (percentage >= 80) return { level: 'Muito Bom', color: 'blue', icon: Award };
//     if (percentage >= 70) return { level: 'Bom', color: 'purple', icon: Star };
//     if (percentage >= 60) return { level: 'Regular', color: 'yellow', icon: Target };
//     return { level: 'Precisa Melhorar', color: 'red', icon: TrendingDown };
//   };


//   const getCategoryColor = (category: string) => {
//     const colors: Record<string, string> = {
//       'natureza': 'emerald',
//       'exatas': 'blue',
//       'humanas': 'purple',
//       'tecnologia': 'cyan',
//       'default': 'gray'
//     };
//     return colors[category] || colors.default;
//   };


//   interface StatCardProps {
//     icon: React.ComponentType<{ className?: string }>;
//     title: string;
//     value: React.ReactNode;
//     subtitle?: string;
//     color?: string;
//     trend?: number | null;
//     onClick?: (() => void) | undefined;
//   }

//   const StatCard = ({
//     icon: Icon,
//     title,
//     value,
//     subtitle,
//     color = "blue",
//     trend = null,
//     onClick,
//   }: StatCardProps) => (
//     <motion.div
//       whileHover={{ scale: 1.02, y: -2 }}
//       whileTap={{ scale: 0.98 }}
//       onClick={onClick}
//       className={`bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-${color}-500/50 transition-all duration-300 ${onClick ? 'cursor-pointer' : ''} relative overflow-hidden`}
//     >
//       <div className={`absolute inset-0 bg-gradient-to-br from-${color}-500/5 to-transparent`} />
//       <div className="relative z-10">
//         <div className="flex items-center justify-between mb-4">
//           <div className={`p-3 rounded-lg bg-${color}-500/20`}>
//             <Icon className={`w-6 h-6 text-${color}-400`} />
//           </div>
//           {trend && (
//             <div className={`flex items-center space-x-1 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
//               {trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
//               <span className="text-sm font-medium">{Math.abs(trend)}%</span>
//             </div>
//           )}
//         </div>
//         <div>
//           <p className="text-gray-400 text-sm font-medium">{title}</p>
//           <p className="text-2xl font-bold text-white mt-1">{value}</p>
//           {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
//         </div>
//       </div>
//     </motion.div>
//   );


//   interface QuizStatsCardProps {
//     stat: {
//       id: string;
//       userId: string;
//       quizId: string;
//       attempts: number;
//       bestScore: number;
//       averageScore: number;
//       createdAt: string;
//       updatedAt: string;
//       quiz: {
//         id: string;
//         title: string;
//         is_active: boolean;
//         specialtyId: string;
//         specialty: {
//           id: string;
//           name: string;
//           category: string;
//           emblem: string;
//         };
//         questions: Array<{
//           id: string;
//           question: string;
//           quizAnswers: Array<{
//             id: string;
//             answer: string;
//             isCorrect: boolean;
//           }>;
//         }>;
//       };
//     };
//     index: number;
//   }

//   const QuizStatsCard = ({ stat, index }: QuizStatsCardProps) => {
//     const performance = getPerformanceLevel(stat.bestScore, stat.quiz.questions?.length || 10);
//     const categoryColor = getCategoryColor(stat.quiz.specialty.category);
//     const isExpanded = expandedStats[stat.id];


//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: index * 0.1 }}
//         className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-700/50 rounded-xl overflow-hidden hover:border-gray-600/50 transition-all duration-300"
//       >
//         {/* Header */}
//         <div className="p-6">
//           <div className="flex items-start justify-between mb-4">
//             <div className="flex items-center space-x-4">
//               <div className="relative">
//                 <img 
//                   src={stat.quiz.specialty.emblem} 
//                   alt={stat.quiz.specialty.name}
//                   className="w-16 h-16 rounded-xl object-cover"
//                   onError={(e) => {
//                     const img = e.target as HTMLImageElement;
//                     img.style.display = 'none';
//                     if (img.nextSibling && img.nextSibling instanceof HTMLElement) {
//                       (img.nextSibling as HTMLElement).style.display = 'flex';
//                     }
//                   }}
//                 />
//                 <div className={`w-16 h-16 rounded-xl bg-${categoryColor}-500/20 hidden items-center justify-center`}>
//                   <BookOpen className={`w-8 h-8 text-${categoryColor}-400`} />
//                 </div>
//                 <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full bg-${performance.color}-500/20 flex items-center justify-center`}>
//                   <performance.icon className={`w-4 h-4 text-${performance.color}-400`} />
//                 </div>
//               </div>
//               <div>
//                 <h3 className="text-white font-semibold text-lg">{stat.quiz.title}</h3>
//                 <div className="flex items-center space-x-2 mt-1">
//                   <span className={`px-2 py-1 bg-${categoryColor}-500/20 text-${categoryColor}-400 text-xs rounded-md font-medium`}>
//                     {stat.quiz.specialty.name}
//                   </span>
//                   <span className={`px-2 py-1 bg-${performance.color}-500/20 text-${performance.color}-400 text-xs rounded-md font-medium`}>
//                     {performance.level}
//                   </span>
//                 </div>
//                 <p className="text-gray-500 text-sm mt-1">
//                   {stat.quiz.questions?.length || 0} questões • {stat.attempts} tentativas
//                 </p>
//               </div>
//             </div>
//             <div className="text-right">
//               <div className="flex items-center space-x-2 mb-1">
//                 <Trophy className="w-5 h-5 text-yellow-400" />
//                 <span className="text-2xl font-bold text-white">{stat.bestScore}</span>
//                 <span className="text-gray-400">/10</span>
//               </div>
//               <p className="text-gray-400 text-sm">Melhor resultado</p>
//             </div>
//           </div>


//           {/* Stats Grid */}
//           <div className="grid grid-cols-3 gap-4 mb-4">
//             <div className="text-center p-3 bg-gray-700/30 rounded-lg">
//               <div className="flex items-center justify-center space-x-1 mb-1">
//                 <Target className="w-4 h-4 text-blue-400" />
//                 <span className="text-lg font-bold text-white">{stat.averageScore.toFixed(1)}</span>
//               </div>
//               <p className="text-gray-400 text-xs">Média</p>
//             </div>
//             <div className="text-center p-3 bg-gray-700/30 rounded-lg">
//               <div className="flex items-center justify-center space-x-1 mb-1">
//                 <Activity className="w-4 h-4 text-green-400" />
//                 <span className="text-lg font-bold text-white">{stat.attempts}</span>
//               </div>
//               <p className="text-gray-400 text-xs">Tentativas</p>
//             </div>
//             <div className="text-center p-3 bg-gray-700/30 rounded-lg">
//               <div className="flex items-center justify-center space-x-1 mb-1">
//                 <Percent className="w-4 h-4 text-purple-400" />
//                 <span className="text-lg font-bold text-white">
//                   {((stat.bestScore / (stat.quiz.questions?.length || 10)) * 100).toFixed(0)}%
//                 </span>
//               </div>
//               <p className="text-gray-400 text-xs">Precisão</p>
//             </div>
//           </div>


//           {/* Expand Button */}
//           <button
//             onClick={() => setExpandedStats(prev => ({ ...prev, [stat.id]: !prev[stat.id] }))}
//             className="w-full flex items-center justify-center space-x-2 p-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-colors"
//           >
//             <span className="text-white font-medium">
//               {isExpanded ? 'Ocultar Detalhes' : 'Ver Questões Detalhadas'}
//             </span>
//             <motion.div
//               animate={{ rotate: isExpanded ? 180 : 0 }}
//               transition={{ duration: 0.2 }}
//             >
//               <ChevronDown className="w-5 h-5 text-gray-400" />
//             </motion.div>
//           </button>
//         </div>


//         {/* Expanded Content */}
//         <AnimatePresence>
//           {isExpanded && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: 'auto' }}
//               exit={{ opacity: 0, height: 0 }}
//               className="border-t border-gray-700/50"
//             >
//               <div className="p-6 space-y-4">
//                 <h4 className="text-white font-semibold flex items-center space-x-2">
//                   <Brain className="w-5 h-5 text-purple-400" />
//                   <span>Análise das Questões</span>
//                 </h4>
                
//                 {stat.quiz.questions?.map((question, qIndex) => (
//                   <div key={question.id} className="bg-gray-700/30 rounded-lg p-4">
//                     <div className="flex items-start space-x-3">
//                       <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
//                         <span className="text-blue-400 font-bold text-sm">{qIndex + 1}</span>
//                       </div>
//                       <div className="flex-1">
//                         <p className="text-white font-medium mb-3">{question.question}</p>
//                         <div className="space-y-2">
//                           {question.quizAnswers?.map((answer) => (
//                             <div
//                               key={answer.id}
//                               className={`p-3 rounded-lg border ${
//                                 answer.isCorrect
//                                   ? 'bg-green-500/10 border-green-500/30'
//                                   : 'bg-gray-600/30 border-gray-600/30'
//                               }`}
//                             >
//                               <div className="flex items-center space-x-2">
//                                 {answer.isCorrect ? (
//                                   <CheckCircle className="w-4 h-4 text-green-400" />
//                                 ) : (
//                                   <div className="w-4 h-4 rounded-full border-2 border-gray-500" />
//                                 )}
//                                 <span className={`text-sm ${answer.isCorrect ? 'text-green-400 font-medium' : 'text-gray-300'}`}>
//                                   {answer.answer}
//                                 </span>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.div>
//     );
//   };


//   interface UserSelectorProps {
//     onUserSelect: (user: { id: string; name: string; email: string; role: string; photoUrl: string | null }) => void;
//     onBack: () => void;
//   }

//   const UserSelector = ({ onUserSelect, onBack }: UserSelectorProps) => {
//     const filteredUsers = allUsers.filter(user => 
//       user.name.toLowerCase().includes(searchUser.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchUser.toLowerCase())
//     );


//     return (
//       <motion.div
//         initial={{ opacity: 0, x: 20 }}
//         animate={{ opacity: 1, x: 0 }}
//         className="space-y-6"
//       >
//         <div className="flex items-center space-x-4 mb-6">
//           <button
//             onClick={onBack}
//             className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
//           >
//             <ArrowLeft className="w-5 h-5" />
//           </button>
//           <div>
//             <h2 className="text-2xl font-bold text-white">Selecionar Usuário</h2>
//             <p className="text-gray-400">Escolha um usuário para ver suas estatísticas detalhadas</p>
//           </div>
//         </div>


//         {/* Search */}
//         <div className="relative">
//           <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Buscar usuário por nome ou email..."
//             value={searchUser}
//             onChange={(e) => setSearchUser(e.target.value)}
//             className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
//           />
//         </div>


//         {/* Users Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {filteredUsers.map((user, index) => (
//             <motion.div
//               key={user.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.1 }}
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={() => onUserSelect(user)}
//               className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 cursor-pointer hover:border-gray-600/50 transition-all duration-300 group"
//             >
//               <div className="flex items-center space-x-3">
//                 <div className="relative">
//                   {user.photoUrl ? (
//                     <img
//                       src={user.photoUrl}
//                       alt={user.name}
//                       className="w-12 h-12 rounded-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
//                       <User className="w-6 h-6 text-white" />
//                     </div>
//                   )}
//                   <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900" />
//                 </div>
//                 <div className="flex-1">
//                   <h3 className="text-white font-medium group-hover:text-purple-400 transition-colors">
//                     {user.name}
//                   </h3>
//                   <p className="text-gray-500 text-sm">{user.email}</p>
//                   <span className="inline-block mt-1 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-md">
//                     {user.role}
//                   </span>
//                 </div>
//                 <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition-colors" />
//               </div>
//             </motion.div>
//           ))}
//         </div>


//         {filteredUsers.length === 0 && (
//           <div className="text-center py-12">
//             <Search className="w-16 h-16 text-gray-500 mx-auto mb-4" />
//             <h3 className="text-white text-xl font-semibold mb-2">Nenhum usuário encontrado</h3>
//             <p className="text-gray-400">Tente buscar com outros termos.</p>
//           </div>
//         )}
//       </motion.div>
//     );
//   };


//   const LoadingSpinner = () => (
//     <div className="flex items-center justify-center py-20">
//       <motion.div
//         animate={{ rotate: 360 }}
//         transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//         className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full"
//       />
//     </div>
//   );


//   const categories = ['all', 'natureza', 'exatas', 'humanas', 'tecnologia'];


//   const filteredStats = userStats?.result?.stats?.stats?.filter(stat => 
//     filterCategory === 'all' || stat.quiz.specialty.category === filterCategory
//   ) || [];


//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
//       {/* Background Pattern */}
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />
      
//       <div className="relative z-10 p-4 sm:p-6">
//         <div className="max-w-7xl mx-auto">
//           {/* Header */}
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="mb-8"
//           >
//             <div className="flex items-center space-x-3 mb-4">
//               <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20">
//                 <BarChart3 className="w-8 h-8 text-purple-400" />
//               </div>
//               <div>
//                 <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard de Quizzes</h1>
//                 <p className="text-gray-400">Análise completa do seu desempenho e evolução</p>
//               </div>
//             </div>
//           </motion.div>


//           {/* Tabs */}
//           {canViewAllUsers && (
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-1 bg-gray-800/50 p-1 rounded-xl mb-8 backdrop-blur-sm border border-gray-700/50"
//             >
//               <button
//                 onClick={() => {
//                   setActiveTab('my-stats');
//                   setSelectedUser(null);
//                 }}
//                 className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
//                   activeTab === 'my-stats'
//                     ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
//                     : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
//                 }`}
//               >
//                 <div className="flex items-center justify-center space-x-2">
//                   <User className="w-4 h-4" />
//                   <span>Minhas Estatísticas</span>
//                 </div>
//               </button>
//               <button
//                 onClick={() => {
//                   setActiveTab('all-users');
//                   setSelectedUser(null);
//                 }}
//                 className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
//                   activeTab === 'all-users'
//                     ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
//                     : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
//                 }`}
//               >
//                 <div className="flex items-center justify-center space-x-2">
//                   <Users className="w-4 h-4" />
//                   <span>Outros Usuários</span>
//                 </div>
//               </button>
//             </motion.div>
//           )}


//           {/* Content */}
//           <AnimatePresence mode="wait">
//             {loading ? (
//               <LoadingSpinner />
//             ) : activeTab === 'my-stats' ? (
//               <motion.div
//                 key="my-stats"
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: 20 }}
//                 className="space-y-8"
//               >
//                 {userStats?.result ? (
//                   <>
//                     {/* Summary Cards */}






// <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                       <StatCard
//                         icon={Trophy}
//                         title="Total de Quizzes"
//                         value={userStats.result.summary.totalQuizzes}
//                         subtitle="Quizzes realizados"
//                         color="purple"
//                       />
//                       <StatCard
//                         icon={Activity}
//                         title="Total de Tentativas"
//                         value={userStats.result.summary.totalAttempts}
//                         subtitle="Tentativas realizadas"
//                         color="blue"
//                       />
//                       <StatCard
//                         icon={Target}
//                         title="Pontuação Média"
//                         value={userStats.result.summary.averageScore.toFixed(1)}
//                         subtitle="Média geral"
//                         color="green"
//                       />
//                       <StatCard
//                         icon={Award}
//                         title="Melhor Pontuação"
//                         value={userStats.result.summary.bestOverallScore}
//                         subtitle="Melhor resultado"
//                         color="yellow"
//                       />
//                     </div>


//                     {/* Filters */}
//                     <div className="flex flex-wrap items-center gap-2 mb-6">
//                       <div className="flex items-center space-x-1 text-gray-400">
//                         <Filter className="w-4 h-4" />
//                         <span className="text-sm">Filtrar por categoria:</span>
//                       </div>
//                       {categories.map((category) => (
//                         <button
//                           key={category}
//                           onClick={() => setFilterCategory(category)}
//                           className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
//                             filterCategory === category
//                               ? 'bg-purple-500 text-white'
//                               : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-white'
//                           }`}
//                         >
//                           {category === 'all' ? 'Todas' : category.charAt(0).toUpperCase() + category.slice(1)}
//                         </button>
//                       ))}
//                     </div>


//                     {/* Quiz Stats */}
//                     <div className="space-y-6">
//                       <div className="flex items-center justify-between">
//                         <h2 className="text-xl font-bold text-white flex items-center space-x-2">
//                           <BarChart3 className="w-5 h-5 text-purple-400" />
//                           <span>Desempenho Detalhado por Quiz</span>
//                         </h2>
//                         <span className="text-gray-400 text-sm">
//                           {filteredStats.length} quiz{filteredStats.length !== 1 ? 'zes' : ''} encontrado{filteredStats.length !== 1 ? 's' : ''}
//                         </span>
//                       </div>


//                       {filteredStats.length > 0 ? (
//                         <div className="space-y-6">
//                           {filteredStats.map((stat, index) => (
//                             <QuizStatsCard key={stat.id} stat={stat} index={index} />
//                           ))}
//                         </div>
//                       ) : (
//                         <div className="text-center py-12">
//                           <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
//                           <h3 className="text-white text-xl font-semibold mb-2">Nenhum quiz encontrado</h3>
//                           <p className="text-gray-400">Não há quizzes nesta categoria ainda.</p>
//                         </div>
//                       )}
//                     </div>
//                   </>
//                 ) : (
//                   <div className="text-center py-20">
//                     <AlertCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
//                     <h3 className="text-white text-xl font-semibold mb-2">Sem dados disponíveis</h3>
//                     <p className="text-gray-400">Realize alguns quizzes para ver suas estatísticas aqui.</p>
//                   </div>
//                 )}
//               </motion.div>
//             ) : activeTab === 'all-users' && !selectedUser ? (
//               <UserSelector
//                 onUserSelect={setSelectedUser}
//                 onBack={() => setActiveTab('my-stats')}
//               />
//             ) : selectedUser ? (
//               <motion.div
//                 key="selected-user"
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -20 }}
//                 className="space-y-6"
//               >
//                 <div className="flex items-center space-x-4 mb-6">
//                   <button
//                     onClick={() => {
//                       setSelectedUser(null)
//                       console.log('Back to user selection');
//                     }}
//                     className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
//                   >
//                     <ArrowLeft className="w-5 h-5" />
//                   </button>
//                   <div className="flex items-center space-x-3">
//                     {selectedUser.photoUrl ? (
//                       <img
//                         src={selectedUser.photoUrl}
//                         alt={selectedUser.name}
//                         className="w-12 h-12 rounded-full object-cover"
//                       />
//                     ) : (
//                       <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
//                         <User className="w-6 h-6 text-white" />
//                       </div>
//                     )}
//                     <div>
//                       <h2 className="text-2xl font-bold text-white">{selectedUser.name}</h2>
//                       <p className="text-gray-400">{selectedUser.email}</p>
//                     </div>
//                   </div>
//                 </div>


//                 {/* User stats would be loaded here - similar structure to my-stats */}
//                 <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-8 text-center">
//                   <Clock className="w-16 h-16 text-gray-500 mx-auto mb-4" />
//                   <h3 className="text-white text-xl font-semibold mb-2">Carregando estatísticas...</h3>
//                   <p className="text-gray-400">As estatísticas de {selectedUser.name} serão carregadas em breve.</p>
//                 </div>
//               </motion.div>
//             ) : null}
//           </AnimatePresence>
//         </div>
//       </div>
//     </div>
//   );
// };


// export default StatisticsQuiz;
