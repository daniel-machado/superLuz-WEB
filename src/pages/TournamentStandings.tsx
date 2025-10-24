import { useState, useEffect } from 'react';
import { Trophy, Target, Calendar, TrendingUp, Medal, Star, Swords, Clock, Users, Minus, TrendingDown, Crown, ChevronDown, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router';
import { tournamentService } from '../services/TournamentCup/tournamentService';
import { FinishMatchModal } from '../components/ClassModais/FinishMatchModal';
import { CreateMatchModal } from '../components/ClassModais/CreateMatchModal';

// Tipos
interface Player {
  id: string;
  name: string;
  photo: string;
  birthDate: string;
  gender: string;
  groupId: string;
  createdAt: string;
  updatedAt: string;
}

interface Standing {
  playerId: string;
  playerName: string;
  playerPhoto: string;
  groupId: string;
  groupName: string;
  classificationPoints: number;
  totalMatchPoints: number;
  wins: number;
  losses: number;
  draws: number;
  totalErrors: number;
  matchesPlayed: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  winRate?: number;
}

interface GroupStanding {
  groupId: string;
  groupName: string;
  groupDescription: string;
  standings: Standing[];
}

interface Stats {
  totalPlayers: number;
  totalGroups: number;
  totalMatches: number;
  completedMatches: number;
  pendingMatches: number;
  phaseStats: Array<{
    phase: string;
    total: string;
    completed: string;
  }>;
}

interface Match {
  id: string;
  groupId: string | null;
  round: string;
  player1Id: string;
  player2Id: string;
  matchDate: string | null;
  status: string;
  description: string;
  phase: string;
  player1: Player;
  player2: Player;
  result: any;
  resultInfo: {
    hasResult: boolean;
    resultType: string;
    winner: Player | null;
    isDraw: boolean;
    score: string | null;
    player1FinalScore?: number;
    player2FinalScore?: number;
    duration?: number;
    endReason?: string;
    classificationPoints: {
      player1: number;
      player2: number;
    };
  };
}

// phase display names used by several small components
const phaseNames: Record<string, string> = {
  group: 'Fase de Grupos',
  repechage: 'Repescagem',
  round_of_16: 'Oitavas de Final',
  quarter_finals: 'Quartas de Final',
  semi_finals: 'Semifinais',
  third_place: 'Disputa 3º Lugar',
  final: 'Final'
};

const TournamentStandings = () => {
  const [activeTab, setActiveTab] = useState<'groups' | 'overall' | 'matches'>('groups');
  const [groupStandings, setGroupStandings] = useState<GroupStanding[]>([]);
  const [overallStandings, setOverallStandings] = useState<Standing[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedPhase, setSelectedPhase] = useState<string>('group');
  const [loading, setLoading] = useState(true);

  // FOR CREATE MATCH MODAL
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalPhase, setCreateModalPhase] = useState<string>('group');
  const [selectedGroupForCreate, setSelectedGroupForCreate] = useState<{id: string, name: string} | null>(null);
  
  // Estados para controlar o modal
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const { userRole } = useAuth();

  // Carregar dados
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Usando o service em vez de fetch direto
      const [groupsData, overallData, statsData, matchesData] = await Promise.all([
        tournamentService.getGroupStandings(),
        tournamentService.getOverallStandings(),
        tournamentService.getTournamentStats(),
        tournamentService.getAllMatches()
      ]);

      setGroupStandings(groupsData);
      setOverallStandings(overallData);
      setStats(statsData);
      setMatches(matchesData);
      
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error.message);
      // Você pode adicionar um toast de erro aqui
    } finally {
      setLoading(false);
    }
  };

  // Filtrar partidas por fase
  const filteredMatches = matches.filter(m => m.phase === selectedPhase);

  // Função para abrir o modal
  const handleOpenFinishModal = (match: Match) => {
    setSelectedMatch(match);
    setIsFinishModalOpen(true);
  };

  // Função para fechar o modal
  const handleCloseFinishModal = () => {
    setIsFinishModalOpen(false);
    setSelectedMatch(null);
  };

  // Função chamada quando a partida é finalizada
  const handleMatchFinished = () => {
    handleCloseFinishModal();
    loadData(); // Recarrega os dados
  };

  // Funções para abrir o modal
  const handleOpenCreateModal = (phase: string, group?: {id: string, name: string}) => {
    setCreateModalPhase(phase);
    setSelectedGroupForCreate(group || null);
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setSelectedGroupForCreate(null);
  };

  const handleCreateSuccess = () => {
    loadData(); // Recarregar dados
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Carregando dados da copa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="grid grid-rows-[auto_auto_auto] gap-4">
          {/* Linha 1: Botão Voltar */}
          <div className="flex justify-start">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 text-green-500 hover:bg-green-500/10 font-medium rounded-lg transition-colors duration-300 transform hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Link>
          </div>

          {/* Linha 2: Título Centralizado */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-4">
              <Trophy className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-400" />
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-green-500 bg-clip-text text-transparent">
                Copa de Ordem Unida
              </h1>
              <Trophy className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-400" />
            </div>
            <p className="text-gray-400 text-sm sm:text-lg">Acompanhe a classificação e resultados</p>
          </div>

          {/* Linha 3: Botões de Criar */}
          {(userRole === "admin" || userRole === "director") && (
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-4">
              <Link
                to="/manage-group"
                className="px-4 py-2 sm:px-6 sm:py-2 border-2 border-orange-500 text-orange-500 hover:bg-orange-500/10 font-medium rounded-lg transition-colors duration-300 transform hover:scale-105 inline-flex items-center justify-center text-sm"
              >
                Criar Grupo
              </Link>
              <Link
                to="/manage-player"
                className="px-4 py-2 sm:px-6 sm:py-2 border-2 border-green-500 text-green-500 hover:bg-green-500/10 font-medium rounded-lg transition-colors duration-300 transform hover:scale-105 inline-flex items-center justify-center text-sm"
              >
                Criar Player
              </Link>
            </div>
          )}
        </div>

        {/* ESTATÍSTICAS PARA ADMINISTRADORES e DIRETORES */}
        {(userRole === "admin" || userRole === "director") && stats &&(
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {/* Estatísticas podem ser adicionadas aqui se necessário */}
          </div> 
        )}

        {/* NAVEGAÇÃO POR TABS PARA CLASSIFICAÇÃO DE GRUPOS, GERAL E CONFRONTOS */}
        <div className="flex justify-center gap-1 mb-6 py-2 relative border-b border-gray-700/50">
          <motion.button
            onClick={() => setActiveTab('groups')}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all flex-shrink-0 ${
              activeTab === 'groups'
                ? 'text-green-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
          >
            <Target className="w-4 h-4" />
            <span className="text-sm">Grupos</span>
            
            {activeTab === 'groups' && (
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-1 bg-green-500 rounded-full"
                layoutId="activeTabIndicator"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </motion.button>

          <motion.button
            onClick={() => setActiveTab('overall')}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all flex-shrink-0 ${
              activeTab === 'overall'
                ? 'text-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
          >
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Classificação Geral</span>
            
            {activeTab === 'overall' && (
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-1 bg-blue-500 rounded-full"
                layoutId="activeTabIndicator"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </motion.button>

          <motion.button
            onClick={() => setActiveTab('matches')}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all flex-shrink-0 ${
              activeTab === 'matches'
                ? 'text-purple-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
          >
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Confrontos</span>
            
            {activeTab === 'matches' && (
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-1 bg-purple-500 rounded-full"
                layoutId="activeTabIndicator"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </motion.button>
        </div>

        {/* Conteúdo das abas */}
        <div className="animate-fadeIn">
          {/* ============CLASSIFICAÇÃO POR GRUPOS ======================== */}        
          <AnimatePresence>
            {activeTab === 'groups' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                {groupStandings.map((group, groupIndex) => (
                  <motion.div
                    key={group.groupId}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: groupIndex * 0.1 }}
                    className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-3 hover:bg-gray-800/40 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    {/* Header do Grupo com animação expandir */}
                    <motion.div 
                      className="flex items-center gap-3 mb-3 cursor-pointer group"
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div 
                        className="bg-gradient-to-br from-green-500 to-green-600 w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold shadow-lg"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        {group.groupName}
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="font-bold text-base group-hover:text-green-400 transition-colors">
                          Grupo {group.groupName}
                        </h3>
                        <p className="text-gray-400 text-xs">{group.groupDescription}</p>
                      </div>
                      <motion.div
                        animate={{ rotate: 0 }}
                        whileHover={{ rotate: 180 }}
                        transition={{ type: "spring" }}
                      >
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </motion.div>
                    </motion.div>

                    {/* Tabela Ultra Compacta */}
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[250px]">
                        <thead>
                          <tr className="border-b border-gray-700/30">
                            <th className="text-left py-1 px-1 text-gray-400 text-xs font-medium w-6">#</th>
                            <th className="text-left py-1 px-1 text-gray-400 text-xs font-medium">Jogador</th>
                            <th className="text-center py-1 px-1 text-gray-400 text-xs font-medium w-10">PTS</th>
                            <th className="text-center py-1 px-1 text-gray-400 text-xs font-medium w-6">J</th>
                            <th className="text-center py-1 px-1 text-gray-400 text-xs font-medium w-16">V-E-D</th>
                            <th className="text-center py-1 px-1 text-gray-400 text-xs font-medium w-10">SG</th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.standings.map((standing, index) => (
                            <motion.tr 
                              key={standing.playerId}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ 
                                delay: (groupIndex * 0.1) + (index * 0.03),
                                type: "spring", 
                                stiffness: 100 
                              }}
                              className="border-b border-gray-700/20 hover:bg-gray-700/30 transition-all duration-200"
                              whileHover={{ 
                                scale: 1.02,
                                backgroundColor: "rgba(55, 65, 81, 0.4)",
                                transition: { duration: 0.2 }
                              }}
                            >
                              {/* Posição com medalha animada */}
                              <td className="py-2 px-1">
                                <motion.div 
                                  className="flex items-center gap-1"
                                  whileHover={{ scale: 1.1 }}
                                >
                                  {index < 3 && (
                                    <motion.div
                                      initial={{ scale: 0, rotate: -180 }}
                                      animate={{ scale: 1, rotate: 0 }}
                                      transition={{ 
                                        type: "spring", 
                                        delay: (groupIndex * 0.1) + (index * 0.05),
                                        stiffness: 200 
                                      }}
                                      className="relative"
                                    >
                                      {index === 0 && (
                                        <Crown className="w-4 h-4 text-yellow-400" />
                                      )}
                                      {index === 1 && (
                                        <Medal className="w-3 h-3 text-gray-300" />
                                      )}
                                      {index === 2 && (
                                        <Medal className="w-3 h-3 text-orange-400" />
                                      )}
                                    </motion.div>
                                  )}
                                  <span className={`text-xs font-bold ${
                                    index < 3 ? 'text-white' : 
                                    index < 6 ? 'text-gray-300' : 'text-gray-500'
                                  }`}>
                                    {index + 1}
                                  </span>
                                </motion.div>
                              </td>

                              {/* Jogador compacto */}
                              <td className="py-2 px-1">
                                <motion.div 
                                  className="flex items-center gap-2"
                                  whileHover={{ x: 3 }}
                                >
                                  <motion.div 
                                    className="relative w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-md"
                                    whileHover={{ 
                                      scale: 1.2,
                                      rotate: 360,
                                      transition: { duration: 0.4 }
                                    }}
                                  >
                                    {standing.playerPhoto ? (
                                      <img 
                                        src={standing.playerPhoto} 
                                        alt={standing.playerName}
                                        className="absolute inset-0 w-full h-full object-cover rounded-full border-2 border-gradient-to-br from-green-500 to-blue-500"
                                        style={{ borderColor: 'transparent' }}
                                      />
                                    ) : null}
                                    <span className={standing.playerPhoto ? 'opacity-0' : ''}>
                                      {standing.playerName.charAt(0)}
                                    </span>
                                  </motion.div>
                                  <span className="font-medium text-xs truncate max-w-[80px] sm:max-w-[100px]">
                                    {standing.playerName}
                                  </span>
                                </motion.div>
                              </td>

                              {/* Pontuação destacada */}
                              <td className="text-center py-2 px-1">
                                <motion.div
                                  className="bg-gradient-to-r from-green-500/30 to-emerald-500/30 border border-green-500/20 rounded-lg px-1 py-1"
                                  whileHover={{ 
                                    scale: 1.15,
                                    backgroundColor: "rgba(34, 197, 94, 0.4)"
                                  }}
                                >
                                  <span className="text-green-400 text-xs font-bold block">
                                    {standing.classificationPoints}
                                  </span>
                                </motion.div>
                              </td>

                              {/* Jogos */}
                              <td className="text-center py-2 px-1">
                                <span className="text-gray-300 text-xs font-medium">
                                  {standing.matchesPlayed}
                                </span>
                              </td>

                              {/* V-E-D em uma coluna só */}
                              <td className="text-center py-2 px-1">
                                <motion.div 
                                  className="flex justify-center items-center gap-1"
                                  whileHover={{ scale: 1.1 }}
                                >
                                  <span className="text-green-400 text-xs font-bold bg-green-500/20 px-1 rounded">
                                    {standing.wins}
                                  </span>
                                  <span className="text-gray-400 text-xs">-</span>
                                  <span className="text-yellow-400 text-xs font-bold bg-yellow-500/20 px-1 rounded">
                                    {standing.draws}
                                  </span>
                                  <span className="text-gray-400 text-xs">-</span>
                                  <span className="text-red-400 text-xs font-bold bg-red-500/20 px-1 rounded">
                                    {standing.losses}
                                  </span>
                                </motion.div>
                              </td>

                              {/* Saldo de Gols com indicador visual */}
                              <td className="text-center py-2 px-1">
                                <motion.div
                                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                                    standing.goalDifference > 0 
                                      ? 'bg-green-500/20 text-green-400' 
                                      : standing.goalDifference < 0 
                                      ? 'bg-red-500/20 text-red-400'
                                      : 'bg-gray-500/20 text-gray-400'
                                  }`}
                                  whileHover={{ 
                                    scale: 1.2,
                                    y: -2
                                  }}
                                >
                                  {standing.goalDifference > 0 && (
                                    <TrendingUp className="w-3 h-3" />
                                  )}
                                  {standing.goalDifference < 0 && (
                                    <TrendingDown className="w-3 h-3" />
                                  )}
                                  {standing.goalDifference === 0 && (
                                    <Minus className="w-3 h-3" />
                                  )}
                                  {standing.goalDifference > 0 ? '+' : ''}{standing.goalDifference}
                                </motion.div>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Footer minimalista */}
                    <motion.div 
                      className="flex justify-between items-center mt-3 pt-2 border-t border-gray-700/20 text-xs text-gray-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: (groupIndex * 0.1) + 0.3 }}
                    >
                      <div className="flex items-center gap-2">
                        <Users className="w-3 h-3" />
                        <span>{group.standings.length} jogadores</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Agora</span>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ============CLASSIFICAÇÃO GERAL ======================== */} 
          <AnimatePresence>
            {activeTab === 'overall' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-4 shadow-2xl"
              >
                {/* Header com destaque */}
                <motion.div 
                  className="flex items-center gap-3 mb-4 p-3 bg-gradient-to-r from-yellow-500/10 to-amber-500/5 rounded-lg border border-yellow-500/20"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                  >
                    <Trophy className="w-6 h-6 text-yellow-400" />
                  </motion.div>
                  <div>
                    <h2 className="font-bold text-xl bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                      Classificação Geral
                    </h2>
                    <p className="text-gray-400 text-xs">Ranking completo de todos os jogadores</p>
                  </div>
                </motion.div>

                {/* Tabela Compacta e Animada */}
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[350px]">
                    <thead>
                      <tr className="border-b border-gray-700/50">
                        <th className="text-left py-2 px-1 text-gray-400 text-xs font-medium w-8">#</th>
                        <th className="text-left py-2 px-1 text-gray-400 text-xs font-medium">Jogador</th>
                        <th className="text-center py-2 px-1 text-gray-400 text-xs font-medium w-12">Grupo</th>
                        <th className="text-center py-2 px-1 text-gray-400 text-xs font-medium w-10">PTS</th>
                        <th className="text-center py-2 px-1 text-gray-400 text-xs font-medium w-6">J</th>
                        <th className="text-center py-2 px-1 text-gray-400 text-xs font-medium w-14">V-E-D</th>
                        <th className="text-center py-2 px-1 text-gray-400 text-xs font-medium w-12">SG</th>
                        <th className="text-center py-2 px-1 text-gray-400 text-xs font-medium w-12">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {overallStandings.map((standing, index) => (
                        <motion.tr 
                          key={standing.playerId}
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ 
                            delay: index * 0.05,
                            type: "spring", 
                            stiffness: 100 
                          }}
                          className="border-b border-gray-700/20 hover:bg-gray-700/30 transition-all duration-200 group"
                          whileHover={{ 
                            scale: 1.01,
                            backgroundColor: "rgba(55, 65, 81, 0.4)",
                            transition: { duration: 0.2 }
                          }}
                        >
                          {/* Posição com premiação especial */}
                          <td className="py-3 px-1">
                            <motion.div 
                              className="flex items-center gap-1"
                              whileHover={{ scale: 1.1 }}
                            >
                              {index === 0 && (
                                <motion.div
                                  animate={{ 
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 5, -5, 0]
                                  }}
                                  transition={{ duration: 3, repeat: Infinity }}
                                >
                                  <Crown className="w-5 h-5 text-yellow-400" />
                                </motion.div>
                              )}
                              {index === 1 && (
                                <motion.div
                                  animate={{ scale: [1, 1.1, 1] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  <Medal className="w-4 h-4 text-gray-300" />
                                </motion.div>
                              )}
                              {index === 2 && (
                                <motion.div
                                  animate={{ scale: [1, 1.1, 1] }}
                                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                                >
                                  <Medal className="w-4 h-4 text-orange-400" />
                                </motion.div>
                              )}
                              {index > 2 && index < 8 && (
                                <Star className="w-3 h-3 text-blue-400 opacity-60" />
                              )}
                              <span className={`text-sm font-bold ${
                                index === 0 ? 'text-yellow-400' :
                                index === 1 ? 'text-gray-300' :
                                index === 2 ? 'text-orange-400' :
                                index < 8 ? 'text-blue-400' : 'text-gray-400'
                              }`}>
                                {index + 1}
                              </span>
                            </motion.div>
                          </td>

                          {/* Jogador com avatar animado */}
                          <td className="py-3 px-1">
                            <motion.div 
                              className="flex items-center gap-2"
                              whileHover={{ x: 3 }}
                            >
                              <motion.div 
                                className="relative"
                                whileHover={{ 
                                  scale: 1.2,
                                  rotate: [0, -10, 10, 0],
                                  transition: { duration: 0.4 }
                                }}
                              >
                                <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                                  {standing.playerPhoto ? (
                                    <img 
                                      src={standing.playerPhoto} 
                                      alt={standing.playerName}
                                      className="absolute inset-0.5 w-[calc(100%-4px)] h-[calc(100%-4px)] object-cover rounded-full"
                                    />
                                  ) : (
                                    <span>{standing.playerName.charAt(0)}</span>
                                  )}
                                </div>
                                {index < 3 && (
                                  <motion.div
                                    className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"
                                    animate={{ scale: [1, 1.5, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                  />
                                )}
                              </motion.div>
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-sm truncate max-w-[100px] sm:max-w-[120px]">
                                  {standing.playerName}
                                </p>
                                {index < 3 && (
                                  <motion.p 
                                    className="text-xs text-green-400 font-medium"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.1 + 0.5 }}
                                  >
                                    {index === 0 ? 'Líder' : index === 1 ? 'Vice' : '3º Lugar'}
                                  </motion.p>
                                )}
                              </div>
                            </motion.div>
                          </td>

                          {/* Grupo */}
                          <td className="text-center py-3 px-1">
                            <motion.span 
                              className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs font-bold inline-block"
                              whileHover={{ 
                                scale: 1.1,
                                backgroundColor: "rgba(59, 130, 246, 0.3)"
                              }}
                            >
                              {standing.groupName}
                            </motion.span>
                          </td>

                          {/* Pontuação com destaque */}
                          <td className="text-center py-3 px-1">
                            <motion.div
                              className="bg-gradient-to-r from-green-500/30 to-emerald-500/30 border border-green-500/30 rounded-lg px-2 py-1"
                              whileHover={{ 
                                scale: 1.15,
                                backgroundColor: "rgba(34, 197, 94, 0.4)"
                              }}
                            >
                              <span className="text-green-400 text-sm font-bold block">
                                {standing.classificationPoints}
                              </span>
                            </motion.div>
                          </td>

                          {/* Jogos */}
                          <td className="text-center py-3 px-1">
                            <span className="text-gray-300 text-sm font-medium bg-gray-700/50 rounded px-2 py-1 inline-block min-w-[2rem]">
                              {standing.matchesPlayed}
                            </span>
                          </td>

                          {/* V-E-D compacto */}
                          <td className="text-center py-3 px-1">
                            <motion.div 
                              className="flex justify-center items-center gap-1"
                              whileHover={{ scale: 1.1 }}
                            >
                              <div className="flex flex-col items-center">
                                <span className="text-green-400 text-xs font-bold">{standing.wins}</span>
                                <div className="w-4 h-0.5 bg-green-400/50 rounded"></div>
                              </div>
                              <span className="text-gray-400 text-xs mx-1">-</span>
                              <div className="flex flex-col items-center">
                                <span className="text-yellow-400 text-xs font-bold">{standing.draws}</span>
                                <div className="w-4 h-0.5 bg-yellow-400/50 rounded"></div>
                              </div>
                              <span className="text-gray-400 text-xs mx-1">-</span>
                              <div className="flex flex-col items-center">
                                <span className="text-red-400 text-xs font-bold">{standing.losses}</span>
                                <div className="w-4 h-0.5 bg-red-400/50 rounded"></div>
                              </div>
                            </motion.div>
                          </td>

                          {/* Saldo de Gols */}
                          <td className="text-center py-3 px-1">
                            <motion.div
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                                standing.goalDifference > 0 
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                  : standing.goalDifference < 0 
                                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                  : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                              }`}
                              whileHover={{ 
                                scale: 1.2,
                                y: -2
                              }}
                            >
                              {standing.goalDifference > 0 && (
                                <TrendingUp className="w-3 h-3" />
                              )}
                              {standing.goalDifference < 0 && (
                                <TrendingDown className="w-3 h-3" />
                              )}
                              {standing.goalDifference === 0 && (
                                <Minus className="w-3 h-3" />
                              )}
                              {standing.goalDifference > 0 ? '+' : ''}{standing.goalDifference}
                            </motion.div>
                          </td>

                          {/* Aproveitamento com barra visual */}
                          <td className="text-center py-3 px-1">
                            <motion.div 
                              className="flex flex-col items-center gap-1"
                              whileHover={{ scale: 1.1 }}
                            >
                              <span className={`text-xs font-bold ${
                                (standing.winRate || 0) >= 60 ? 'text-green-400' :
                                (standing.winRate || 0) >= 40 ? 'text-yellow-400' : 'text-red-400'
                              }`}>
                                {standing.winRate || 0}%
                              </span>
                              <div className="w-12 h-1 bg-gray-700 rounded-full overflow-hidden">
                                <motion.div 
                                  className={`h-full ${
                                    (standing.winRate || 0) >= 60 ? 'bg-green-500' :
                                    (standing.winRate || 0) >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min(standing.winRate || 0, 100)}%` }}
                                  transition={{ delay: index * 0.05 + 0.3, duration: 0.8 }}
                                />
                              </div>
                            </motion.div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer informativo */}
                <motion.div 
                  className="flex justify-between items-center mt-4 pt-3 border-t border-gray-700/30 text-xs text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Crown className="w-3 h-3 text-yellow-400" />
                      <span>Líder</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Medal className="w-3 h-3 text-gray-300" />
                      <span>Top 3</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-blue-400" />
                      <span>Top 8</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{overallStandings.length} jogadores</span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ============CONFRONTOS ======================== */} 
          <AnimatePresence>
            {activeTab === 'matches' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                {/* Seletor de Fase - Ultra Compacto */}
                <motion.div 
                  className="flex gap-1 overflow-x-auto pb-2 no-scrollbar"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {['group', 'round_of_16', 'quarter_finals', 'semi_finals', 'final', 'third_place'].map((phase) => (
                    <motion.button
                      key={phase}
                      onClick={() => setSelectedPhase(phase)}
                      className={`relative flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-all flex-shrink-0 text-xs sm:text-sm ${
                        selectedPhase === phase
                          ? 'text-white shadow-lg'
                          : 'text-gray-300 hover:text-white bg-gray-800/50 hover:bg-gray-700/50'
                      }`}
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {selectedPhase === phase && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg"
                          layoutId="phaseIndicator"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                      <Swords className="w-3 h-3 relative z-10" />
                      <span className="relative z-10">{phaseNames[phase]}</span>
                    </motion.button>
                  ))}
                </motion.div>

                {/* Conteúdo dos Confrontos */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {selectedPhase === 'group' ? (
                    <div className="space-y-3">
                      {['A', 'B', 'C', 'D', 'E'].map((groupName, groupIndex) => {
                        const groupMatches = filteredMatches.filter(m => {
                          if (!m.groupId) return false;
                          const g = groupStandings.find(gs => gs.groupId === m.groupId);
                          return g ? g.groupName === groupName : false;
                        });
                        
                        if (groupMatches.length === 0) return null;

                        const matchesByRound: Record<string, Match[]> = {};
                        groupMatches.forEach(match => {
                          if (!matchesByRound[match.round]) {
                            matchesByRound[match.round] = [];
                          }
                          matchesByRound[match.round].push(match);
                        });
                        const groupObj = groupStandings.find(gs => gs.groupName === groupName);

                        return (
                          <motion.div
                            key={groupName}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: groupIndex * 0.1 }}
                            className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden hover:bg-gray-800/40 transition-all duration-300"
                          >
                            {/* Header do Grupo - Super Compacto */}
                            {/* <motion.div 
                              className="bg-gradient-to-r from-green-600/80 to-green-700/80 p-3 flex items-center justify-between cursor-pointer"
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <motion.div 
                                  className="w-7 h-7 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center flex-shrink-0"
                                  whileHover={{ rotate: 360 }}
                                  transition={{ duration: 0.6 }}
                                >
                                  <span className="font-bold text-white text-sm">{groupName}</span>
                                </motion.div>
                                <div className="min-w-0 flex-1">
                                  <h3 className="font-bold text-white text-sm truncate">Grupo {groupName}</h3>
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                      <span className="text-green-100 text-xs">{completedMatches}</span>
                                    </div>
                                    <span className="text-green-100 text-xs">/</span>
                                    <span className="text-green-100 text-xs">{totalMatches}</span>
                                    <span className="text-green-100 text-xs">finalizadas</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                  {(userRole === "admin" || userRole === "director") && (
                                    <motion.button
                                      onClick={() => handleOpenCreateModal('group', {id: groupObj?.groupId ?? '', name: groupName})}
                                      className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-semibold hover:bg-white/30 transition-colors border border-white/30 flex items-center gap-1"
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      <Swords className="w-3 h-3" />
                                      Criar
                                    </motion.button>
                                  )}
                                </div>
                              <motion.div
                                animate={{ rotate: [0, 10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <Trophy className="w-4 h-4 text-yellow-400" />
                              </motion.div>
                            </motion.div> */}
                            <motion.div 
                              className="bg-gradient-to-r from-green-600/80 to-green-700/80 p-3 flex items-center justify-between cursor-pointer"
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <motion.div 
                                  className="w-7 h-7 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center flex-shrink-0"
                                  whileHover={{ rotate: 360 }}
                                  transition={{ duration: 0.6 }}
                                >
                                  <span className="font-bold text-white text-sm">{groupName}</span>
                                </motion.div>
                                <div className="min-w-0 flex-1">
                                  <h3 className="font-bold text-white text-sm truncate">Grupo {groupName}</h3>
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                      <span className="text-green-100 text-xs">{groupMatches.filter(m => m.status === 'completed').length}</span>
                                    </div>
                                    <span className="text-green-100 text-xs">/</span>
                                    <span className="text-green-100 text-xs">{groupMatches.length}</span>
                                    <span className="text-green-100 text-xs">finalizadas</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {(userRole === "admin" || userRole === "director") && (
                                  <motion.button
                                    onClick={() => handleOpenCreateModal('group', {id: groupObj?.groupId ?? '', name: groupName})}
                                    className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-semibold hover:bg-white/30 transition-colors border border-white/30 flex items-center gap-1"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <Swords className="w-3 h-3" />
                                    Criar
                                  </motion.button>
                                )}
                                <motion.div
                                  animate={{ rotate: [0, 10, 0] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  <Trophy className="w-4 h-4 text-yellow-400" />
                                </motion.div>
                              </div>
                            </motion.div>


                            {/* Rodadas e Partidas */}
                            <div className="p-3 space-y-3">
                              {Object.keys(matchesByRound)
                                .sort((a, b) => parseInt(a) - parseInt(b))
                                .map((round, roundIndex) => (
                                  <motion.div
                                    key={round}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: (groupIndex * 0.1) + (roundIndex * 0.05) }}
                                    className="space-y-2"
                                  >
                                    {/* Header da Rodada - Compacto */}
                                    <div className="flex items-center gap-2 pb-2 border-b border-gray-700/50">
                                      <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="font-bold text-white text-xs">{round}</span>
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <h4 className="font-bold text-white text-sm truncate">Rodada {round}</h4>
                                        <div className="flex items-center gap-1 text-xs text-gray-400">
                                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                                          <span>{matchesByRound[round].filter(m => m.status === 'completed').length}</span>
                                          <span>/</span>
                                          <span>{matchesByRound[round].length}</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Partidas - Grid Responsivo */}
                                    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-2">
                                      {matchesByRound[round].map((match, matchIndex) => (
                                        <MatchCard 
                                          key={match.id}
                                          match={match}
                                          groupName={groupName}
                                          delay={(groupIndex * 0.1) + (roundIndex * 0.05) + (matchIndex * 0.03)}
                                          onFinishMatch={handleOpenFinishModal}
                                        />
                                      ))}
                                    </div>
                                  </motion.div>
                                ))}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Fases Eliminatórias - Design Otimizado */
                    <div className="space-y-2">
                      {/* Botão para criar confronto em fases eliminatórias */}
                        {(userRole === "admin" || userRole === "director") && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-end mb-4"
                          >
                            <motion.button
                              onClick={() => handleOpenCreateModal(selectedPhase)}
                              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-colors flex items-center gap-2"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Swords className="w-4 h-4" />
                              Criar Confronto
                            </motion.button>
                          </motion.div>
                        )}
                      {filteredMatches.length === 0 ? (
                        <motion.div 
                          className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <Calendar className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                          <h3 className="font-bold text-gray-400 text-sm mb-1">Nenhuma partida nesta fase</h3>
                          <p className="text-gray-500 text-xs">As partidas serão agendadas em breve</p>
                        </motion.div>
                      ) : (
                        filteredMatches.map((match, index) => (
                          <EliminationMatchCard 
                            key={match.id}
                            match={match}
                            index={index}
                            phase={selectedPhase}
                            onFinishMatch={handleOpenFinishModal}
                          />
                        ))
                      )}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal no nível raiz - FORA de qualquer contexto limitado */}
      <FinishMatchModal
        isOpen={isFinishModalOpen}
        onClose={handleCloseFinishModal}
        onFinish={handleMatchFinished}
        match={selectedMatch}
      />

      <CreateMatchModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSuccess={handleCreateSuccess}
        phase={createModalPhase}
        groupId={selectedGroupForCreate?.id}
        groupName={selectedGroupForCreate?.name}
        availablePlayers={[]} // Pode ser preenchido conforme necessário
        groupStandings={groupStandings}
        matches={matches}
      />
    </div>
  );
};

export default TournamentStandings;

// Componente MatchCard
interface MatchCardProps {
  match: Match;
  groupName?: string;
  delay?: number;
  onFinishMatch?: (match: Match) => void; // Callback para abrir o modal
}

export const MatchCard = ({ match, groupName, delay = 0, onFinishMatch }: MatchCardProps) => {
  const { userRole } = useAuth();
  
  const { resultInfo, status, player1, player2, result } = match;

  const isCompleted = status === "completed";
  const hasResult = resultInfo.hasResult;
  const isDraw = resultInfo.isDraw;
  const winner = resultInfo.winner;

  const score1 = hasResult ? resultInfo.player1FinalScore ?? 0 : 0;
  const score2 = hasResult ? resultInfo.player2FinalScore ?? 0 : 0;

  const classPoints1 = resultInfo.classificationPoints?.player1 ?? 0;
  const classPoints2 = resultInfo.classificationPoints?.player2 ?? 0;

  const matchDuration = result?.duration ?? resultInfo?.duration ?? null;
  const judges = result?.judges ?? [];
  const instructor = result?.instructor ?? "—";

  const winnerColor = "from-green-600/40 to-green-500/20 border-green-400/40";
  const drawColor = "from-yellow-600/30 to-yellow-500/20 border-yellow-400/40";
  const pendingColor = "from-gray-700/40 to-gray-800/20 border-gray-600/30";

  const cardStyle = isDraw
    ? drawColor
    : winner
    ? winnerColor
    : pendingColor;

  const handleFinishMatch = () => {
    if (onFinishMatch) {
      onFinishMatch(match); // Chama a função do componente pai
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 90 }}
      className={`relative overflow-hidden rounded-2xl shadow-xl border backdrop-blur-xl transition-all hover:scale-[1.02] bg-gradient-to-br ${cardStyle} p-4 sm:p-6 w-full max-w-md mx-auto`}
    >
      {winner && !isDraw && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-transparent blur-2xl"
        />
      )}

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <p className="text-xs uppercase tracking-wide text-gray-300">
          {groupName ? `Grupo ${groupName}` : "Partida"}
        </p>
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isCompleted
                ? "bg-green-500/20 text-green-300"
                : "bg-yellow-500/20 text-yellow-300 animate-pulse"
            }`}
          >
            {isCompleted ? "Finalizada" : "Pendente"}
          </span>
          
          {/* Botão para finalizar partida */}
          {(userRole === "admin" || userRole === "director") && !isCompleted && (
            <button
              onClick={handleFinishMatch}
              className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold hover:bg-blue-500/30 transition-colors border border-blue-400/40"
            >
              Finalizar
            </button>
          )}
        </div>
      </div>

      {/* Placar */}
      <div className="flex items-center justify-between gap-4 sm:gap-6 lg:gap-8">
  {/* Player 1 */}
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`relative flex flex-col items-center text-center transition-all flex-1 ${
      winner?.id === player1.id
        ? "text-green-300 scale-105"
        : isDraw
        ? "text-yellow-300"
        : "text-gray-300"
    }`}
  >
    <motion.div
      animate={
        winner?.id === player1.id
          ? {
              boxShadow: [
                "0 0 0px rgba(34,197,94,0)",
                "0 0 20px rgba(34,197,94,0.6)",
                "0 0 0px rgba(34,197,94,0)",
              ],
            }
          : {}
      }
      transition={{
        repeat: Infinity,
        duration: 2,
        ease: "easeInOut",
      }}
      className={`relative w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center font-bold text-xl sm:text-2xl lg:text-3xl border-2 ${
        winner?.id === player1.id
          ? "border-green-400 bg-green-500/20"
          : isDraw
          ? "border-yellow-400 bg-yellow-500/10"
          : "border-gray-600 bg-gray-700/30"
      }`}
    >
      {player1.photo ? (
        <img 
          src={player1.photo} 
          alt={player1.name}
          className="absolute inset-0.5 w-[calc(100%-4px)] h-[calc(100%-4px)] object-cover rounded-full"
        />
      ) : (
        <span>{player1.name.charAt(0).toUpperCase()}</span>
      )}
    </motion.div>

    <p className="mt-2 font-semibold truncate w-full text-sm sm:text-base px-1">
      {player1.name}
    </p>
    
    {/* Badge discreto de resultado */}
    {(winner?.id === player1.id || isDraw) && (
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: delay + 0.2 }}
        className={`mt-1 text-[9px] sm:text-[10px] font-medium px-1.5 py-0.5 rounded ${
          isDraw
            ? "bg-yellow-500/10 text-yellow-400/80"
            : "bg-green-500/10 text-green-400/80"
        }`}
      >
        {isDraw ? "🤝 Empate" : "🏆 Venceu"}
      </motion.span>
    )}
    
    {/* Pontuação de classificação */}
    {isCompleted && (
      <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
        +{classPoints1} pts
      </p>
    )}
  </motion.div>

  {/* Centro */}
  <div className="flex flex-col items-center justify-center flex-shrink-0">
    <motion.div
      animate={{ rotate: [0, 10, -10, 0] }}
      transition={{ repeat: Infinity, duration: 3 }}
      className="flex items-center justify-center mb-2"
    >
      <Swords
        className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 ${
          isDraw
            ? "text-yellow-400"
            : winner
            ? "text-green-400"
            : "text-gray-400"
        }`}
      />
    </motion.div>

    <div className="flex items-center gap-2 sm:gap-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold">
      <span
        className={`${
          winner?.id === player1.id
            ? "text-green-400"
            : isDraw
            ? "text-yellow-300"
            : "text-gray-400"
        }`}
      >
        {score1}
      </span>
      <span className="text-gray-500">:</span>
      <span
        className={`${
          winner?.id === player2.id
            ? "text-green-400"
            : isDraw
            ? "text-yellow-300"
            : "text-gray-400"
        }`}
      >
        {score2}
      </span>
    </div>

    {!isCompleted && (
      <p className="text-[10px] sm:text-xs text-gray-400 mt-1 text-center">
        A definir
      </p>
    )}
  </div>

  {/* Player 2 */}
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`relative flex flex-col items-center text-center transition-all flex-1 ${
      winner?.id === player2.id
        ? "text-green-300 scale-105"
        : isDraw
        ? "text-yellow-300"
        : "text-gray-300"
    }`}
  >
    <motion.div
      animate={
        winner?.id === player2.id
          ? {
              boxShadow: [
                "0 0 0px rgba(34,197,94,0)",
                "0 0 20px rgba(34,197,94,0.6)",
                "0 0 0px rgba(34,197,94,0)",
              ],
            }
          : {}
      }
      transition={{
        repeat: Infinity,
        duration: 2,
        ease: "easeInOut",
      }}
      className={`relative w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center font-bold text-xl sm:text-2xl lg:text-3xl border-2 ${
        winner?.id === player2.id
          ? "border-green-400 bg-green-500/20"
          : isDraw
          ? "border-yellow-400 bg-yellow-500/10"
          : "border-gray-600 bg-gray-700/30"
      }`}
    >
      {player2.photo ? (
        <img 
          src={player2.photo} 
          alt={player2.name}
          className="absolute inset-0.5 w-[calc(100%-4px)] h-[calc(100%-4px)] object-cover rounded-full"
        />
      ) : (
        <span>{player2.name.charAt(0).toUpperCase()}</span>
      )}
    </motion.div>

    <p className="mt-2 font-semibold truncate w-full text-sm sm:text-base px-1">
      {player2.name}
    </p>
    
    {/* Badge discreto de resultado */}
    {(winner?.id === player2.id || isDraw) && (
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: delay + 0.2 }}
        className={`mt-1 text-[9px] sm:text-[10px] font-medium px-1.5 py-0.5 rounded ${
          isDraw
            ? "bg-yellow-500/10 text-yellow-400/80"
            : "bg-green-500/10 text-green-400/80"
        }`}
      >
        {isDraw ? "🤝 Empate" : "🏆 Venceu"}
      </motion.span>
    )}
    
    {/* Pontuação de classificação */}
    {isCompleted && (
      <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
        +{classPoints2} pts
      </p>
    )}
  </motion.div>
</div>

      {/* Footer */}
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 border-t border-gray-700/30 pt-2 text-gray-400 text-[10px] sm:text-[12px] flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-4"
        >
          {matchDuration && (
            <span className="flex items-center gap-1.5 justify-center">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {matchDuration} min
            </span>
          )}
          {judges && judges.length > 0 && (
            <span className="flex items-center gap-1.5 justify-center">
              <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {Array.isArray(judges)
                ? judges.length
                  ? `${judges.length} juíz${judges.length > 1 ? 'es' : ''}`
                  : "Sem juízes"
                : "Sem juízes"}
            </span>
          )}
          {instructor && instructor !== "—" && (
            <span className="flex items-center gap-1.5 justify-center">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {instructor}
            </span>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

// Componente EliminationMatchCard
export const EliminationMatchCard = ({ 
  match, 
  index, 
  phase, 
  onFinishMatch 
}: { 
  match: Match, 
  index: number, 
  phase: string,
  onFinishMatch?: (match: Match) => void 
}) => {
  const { userRole } = useAuth();
  
  const isCompleted = match.status === "completed";
  const hasResult = match.resultInfo.hasResult;
  const isDraw = match.resultInfo.isDraw;
  const winner = match.resultInfo.winner;

  const score1 = hasResult ? match.resultInfo.player1FinalScore ?? 0 : 0;
  const score2 = hasResult ? match.resultInfo.player2FinalScore ?? 0 : 0;

  const classPoints1 = match.resultInfo.classificationPoints?.player1 ?? 0;
  const classPoints2 = match.resultInfo.classificationPoints?.player2 ?? 0;

  const matchDuration = match.result?.duration ?? match.resultInfo?.duration ?? null;
  const judges = match.result?.judges ?? [];
  const instructor = match.result?.instructor ?? "—";

  const winnerColor = "from-green-700/30 to-green-500/10 border-green-400/40";
  const drawColor = "from-yellow-600/30 to-yellow-500/10 border-yellow-400/40";
  const pendingColor = "from-gray-700/40 to-gray-800/20 border-gray-600/30";

  const cardStyle = isDraw ? drawColor : winner ? winnerColor : pendingColor;

  const handleFinishMatch = () => {
    if (onFinishMatch) {
      onFinishMatch(match);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 90 }}
      className={`relative overflow-hidden rounded-2xl border backdrop-blur-xl p-5 sm:p-6 shadow-xl transition-all hover:scale-[1.02] bg-gradient-to-br ${cardStyle}`}
    >
      {/* Glow para o vencedor */}
      {winner && !isDraw && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-transparent blur-2xl"
        />
      )}

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center mb-4">
        <span className="text-xs uppercase tracking-wide text-gray-300">
          {phase ? `Fase: ${phase}` : "Partida Eliminatória"}
        </span>
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isCompleted
                ? "bg-green-500/20 text-green-300"
                : "bg-yellow-500/20 text-yellow-300 animate-pulse"
            }`}
          >
            {isCompleted ? "Finalizada" : "Pendente"}
          </span>
          
          {/* Botão para finalizar partida */}
          {(userRole === "admin" || userRole === "director") && !isCompleted && (
            <button
              onClick={handleFinishMatch}
              className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold hover:bg-blue-500/30 transition-colors border border-blue-400/40"
            >
              Finalizar
            </button>
          )}
        </div>
      </div>

      {/* Placar e jogadores */}
      <div className="flex items-center justify-between gap-6 sm:gap-10">
        {/* Player 1 */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`relative flex flex-col items-center text-center transition-all ${
            winner?.id === match.player1.id
              ? "text-green-300 scale-105"
              : isDraw
              ? "text-yellow-300"
              : "text-gray-300"
          }`}
        >
          <motion.div
            animate={
              winner?.id === match.player1.id
                ? {
                    boxShadow: [
                      "0 0 0px rgba(34,197,94,0)",
                      "0 0 20px rgba(34,197,94,0.6)",
                      "0 0 0px rgba(34,197,94,0)",
                    ],
                  }
                : {}
            }
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
            }}
            className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center font-bold text-2xl border-2 ${
              winner?.id === match.player1.id
                ? "border-green-400 bg-green-500/20"
                : isDraw
                ? "border-yellow-400 bg-yellow-500/10"
                : "border-gray-600 bg-gray-700/30"
            }`}
          >
            {match.player1.photo ? (
              <img 
                src={match.player1.photo} 
                alt={match.player1.name}
                className="absolute inset-0.5 w-[calc(100%-4px)] h-[calc(100%-4px)] object-cover rounded-full"
              />
            ) : (
              <span>{match.player1.name.charAt(0).toUpperCase()}</span>
            )}
          </motion.div>

          <p className="mt-2 font-semibold text-sm truncate max-w-[100px]">
            {match.player1.name}
          </p>

          {/* Badge discreto de resultado */}
          {(winner?.id === match.player1.id || isDraw) && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.08 + 0.2 }}
              className={`mt-1 text-[9px] sm:text-[10px] font-medium px-1.5 py-0.5 rounded ${
                isDraw
                  ? "bg-yellow-500/10 text-yellow-400/80"
                  : "bg-green-500/10 text-green-400/80"
              }`}
            >
              {isDraw ? "🤝 Empate" : "🏆 Venceu"}
            </motion.span>
          )}
        </motion.div>

        {/* Centro */}
        <div className="flex flex-col items-center justify-center">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="flex items-center justify-center mb-2"
          >
            <Swords
              className={`w-8 h-8 ${
                isDraw
                  ? "text-yellow-400"
                  : winner
                  ? "text-green-400"
                  : "text-gray-400"
              }`}
            />
          </motion.div>

          <div className="flex items-center gap-3 text-3xl sm:text-4xl font-extrabold">
            <span
              className={`${
                winner?.id === match.player1.id
                  ? "text-green-400"
                  : isDraw
                  ? "text-yellow-300"
                  : "text-gray-400"
              }`}
            >
              {score1}
            </span>
            <span className="text-gray-500">:</span>
            <span
              className={`${
                winner?.id === match.player2.id
                  ? "text-green-400"
                  : isDraw
                  ? "text-yellow-300"
                  : "text-gray-400"
              }`}
            >
              {score2}
            </span>
          </div>

          {!isCompleted && (
            <p className="text-[10px] sm:text-xs text-gray-400 mt-1 text-center">
              A definir
            </p>
          )}

          {isCompleted && hasResult && (
            <p className="text-[11px] sm:text-xs text-gray-400 mt-1">
              +{classPoints1} / +{classPoints2} pts
            </p>
          )}
        </div>

        {/* Player 2 */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`relative flex flex-col items-center text-center transition-all ${
            winner?.id === match.player2.id
              ? "text-green-300 scale-105"
              : isDraw
              ? "text-yellow-300"
              : "text-gray-300"
          }`}
        >
          <motion.div
            animate={
              winner?.id === match.player2.id
                ? {
                    boxShadow: [
                      "0 0 0px rgba(34,197,94,0)",
                      "0 0 20px rgba(34,197,94,0.6)",
                      "0 0 0px rgba(34,197,94,0)",
                    ],
                  }
                : {}
            }
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
            }}
            className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center font-bold text-2xl border-2 ${
              winner?.id === match.player2.id
                ? "border-green-400 bg-green-500/20"
                : isDraw
                ? "border-yellow-400 bg-yellow-500/10"
                : "border-gray-600 bg-gray-700/30"
            }`}
          >
            {match.player2.photo ? (
              <img 
                src={match.player2.photo} 
                alt={match.player2.name}
                className="absolute inset-0.5 w-[calc(100%-4px)] h-[calc(100%-4px)] object-cover rounded-full"
              />
            ) : (
              <span>{match.player2.name.charAt(0).toUpperCase()}</span>
            )}
          </motion.div>

          <p className="mt-2 font-semibold text-sm truncate max-w-[100px]">
            {match.player2.name}
          </p>

          {/* Badge discreto de resultado */}
          {(winner?.id === match.player2.id || isDraw) && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.08 + 0.2 }}
              className={`mt-1 text-[9px] sm:text-[10px] font-medium px-1.5 py-0.5 rounded ${
                isDraw
                  ? "bg-yellow-500/10 text-yellow-400/80"
                  : "bg-green-500/10 text-green-400/80"
              }`}
            >
              {isDraw ? "🤝 Empate" : "🏆 Venceu"}
            </motion.span>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 border-t border-gray-700/30 pt-2 text-gray-400 text-[11px] sm:text-[12px] flex flex-wrap justify-center gap-4"
        >
          {matchDuration && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> {matchDuration} min
            </span>
          )}
          {judges && judges.length > 0 && (
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              {Array.isArray(judges)
                ? judges.length
                  ? `${judges.length} juíz${judges.length > 1 ? 'es' : ''}`
                  : "Sem juízes"
                : "Sem juízes"}
            </span>
          )}
          {instructor && instructor !== "—" && (
            <span className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5" /> {instructor}
            </span>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};








































      // <div className="flex items-center justify-between gap-4 sm:gap-6 lg:gap-8">
      //   {/* Player 1 */}
      //   <motion.div
      //     whileHover={{ scale: 1.05 }}
      //     className={`relative flex flex-col items-center text-center transition-all flex-1 ${
      //       winner?.id === player1.id
      //         ? "text-green-300 scale-105"
      //         : isDraw
      //         ? "text-yellow-300"
      //         : "text-gray-300"
      //     }`}
      //   >
      //     {(winner?.id === player1.id || isDraw) && (
      //       <motion.span
      //         initial={{ opacity: 0, y: -8 }}
      //         animate={{ opacity: 1, y: 0 }}
      //         transition={{ delay: delay + 0.2 }}
      //         className={`absolute -top-3 sm:-top-4 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full ${
      //           isDraw
      //             ? "bg-yellow-500/20 text-yellow-300 border border-yellow-400/40"
      //             : "bg-green-500/20 text-green-300 border border-green-400/40"
      //         }`}
      //       >
      //         {isDraw ? "🤝 Empate" : "🏆 Venceu"}
      //       </motion.span>
      //     )}

      //     <motion.div
      //       animate={
      //         winner?.id === player1.id
      //           ? {
      //               boxShadow: [
      //                 "0 0 0px rgba(34,197,94,0)",
      //                 "0 0 20px rgba(34,197,94,0.6)",
      //                 "0 0 0px rgba(34,197,94,0)",
      //               ],
      //             }
      //           : {}
      //       }
      //       transition={{
      //         repeat: Infinity,
      //         duration: 2,
      //         ease: "easeInOut",
      //       }}
      //       className={`w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center font-bold text-xl sm:text-2xl lg:text-3xl border-2 ${
      //         winner?.id === player1.id
      //           ? "border-green-400 bg-green-500/20"
      //           : isDraw
      //           ? "border-yellow-400 bg-yellow-500/10"
      //           : "border-gray-600 bg-gray-700/30"
      //       }`}
      //     >
      //       {player1.name.charAt(0).toUpperCase()}
      //     </motion.div>

      //     <p className="mt-2 font-semibold truncate w-full text-sm sm:text-base px-1">
      //       {player1.name}
      //     </p>
          
      //     {/* Pontuação de classificação */}
      //     {isCompleted && (
      //       <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
      //         +{classPoints1} pts
      //       </p>
      //     )}
      //   </motion.div>

      //   {/* Centro */}
      //   <div className="flex flex-col items-center justify-center flex-shrink-0">
      //     <motion.div
      //       animate={{ rotate: [0, 10, -10, 0] }}
      //       transition={{ repeat: Infinity, duration: 3 }}
      //       className="flex items-center justify-center mb-2"
      //     >
      //       <Swords
      //         className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 ${
      //           isDraw
      //             ? "text-yellow-400"
      //             : winner
      //             ? "text-green-400"
      //             : "text-gray-400"
      //         }`}
      //       />
      //     </motion.div>

      //     <div className="flex items-center gap-2 sm:gap-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold">
      //       <span
      //         className={`${
      //           winner?.id === player1.id
      //             ? "text-green-400"
      //             : isDraw
      //             ? "text-yellow-300"
      //             : "text-gray-400"
      //         }`}
      //       >
      //         {score1}
      //       </span>
      //       <span className="text-gray-500">:</span>
      //       <span
      //         className={`${
      //           winner?.id === player2.id
      //             ? "text-green-400"
      //             : isDraw
      //             ? "text-yellow-300"
      //             : "text-gray-400"
      //         }`}
      //       >
      //         {score2}
      //       </span>
      //     </div>

      //     {!isCompleted && (
      //       <p className="text-[10px] sm:text-xs text-gray-400 mt-1 text-center">
      //         A definir
      //       </p>
      //     )}
      //   </div>

      //   {/* Player 2 */}
      //   <motion.div
      //     whileHover={{ scale: 1.05 }}
      //     className={`relative flex flex-col items-center text-center transition-all flex-1 ${
      //       winner?.id === player2.id
      //         ? "text-green-300 scale-105"
      //         : isDraw
      //         ? "text-yellow-300"
      //         : "text-gray-300"
      //     }`}
      //   >
      //     {(winner?.id === player2.id || isDraw) && (
      //       <motion.span
      //         initial={{ opacity: 0, y: -8 }}
      //         animate={{ opacity: 1, y: 0 }}
      //         transition={{ delay: delay + 0.2 }}
      //         className={`absolute -top-3 sm:-top-4 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full ${
      //           isDraw
      //             ? "bg-yellow-500/20 text-yellow-300 border border-yellow-400/40"
      //             : "bg-green-500/20 text-green-300 border border-green-400/40"
      //         }`}
      //       >
      //         {isDraw ? "🤝 Empate" : "🏆 Venceu"}
      //       </motion.span>
      //     )}

      //     <motion.div
      //       animate={
      //         winner?.id === player2.id
      //           ? {
      //               boxShadow: [
      //                 "0 0 0px rgba(34,197,94,0)",
      //                 "0 0 20px rgba(34,197,94,0.6)",
      //                 "0 0 0px rgba(34,197,94,0)",
      //               ],
      //             }
      //           : {}
      //       }
      //       transition={{
      //         repeat: Infinity,
      //         duration: 2,
      //         ease: "easeInOut",
      //       }}
      //       className={`w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center font-bold text-xl sm:text-2xl lg:text-3xl border-2 ${
      //         winner?.id === player2.id
      //           ? "border-green-400 bg-green-500/20"
      //           : isDraw
      //           ? "border-yellow-400 bg-yellow-500/10"
      //           : "border-gray-600 bg-gray-700/30"
      //       }`}
      //     >
      //       {player2.name.charAt(0).toUpperCase()}
      //     </motion.div>

      //     <p className="mt-2 font-semibold truncate w-full text-sm sm:text-base px-1">
      //       {player2.name}
      //     </p>
          
      //     {/* Pontuação de classificação */}
      //     {isCompleted && (
      //       <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
      //         +{classPoints2} pts
      //       </p>
      //     )}
      //   </motion.div>
      // </div>






// import { useState, useEffect } from 'react';
// import { Trophy, Target, Calendar, TrendingUp, Medal, Star, Swords, Clock, Users, Minus, TrendingDown, Crown, ChevronDown, ArrowLeft } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Link } from 'react-router';
// import { tournamentService } from '../services/TournamentCup/tournamentService';
// import { FinishMatchModal } from '../components/ClassModais/FinishMatchModal';

// // Tipos
// interface Player {
//   id: string;
//   name: string;
//   photo: string;
//   birthDate: string;
//   gender: string;
//   groupId: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface Standing {
//   playerId: string;
//   playerName: string;
//   playerPhoto: string;
//   groupId: string;
//   groupName: string;
//   classificationPoints: number;
//   totalMatchPoints: number;
//   wins: number;
//   losses: number;
//   draws: number;
//   totalErrors: number;
//   matchesPlayed: number;
//   goalsFor: number;
//   goalsAgainst: number;
//   goalDifference: number;
//   winRate?: number;
// }

// interface GroupStanding {
//   groupId: string;
//   groupName: string;
//   groupDescription: string;
//   standings: Standing[];
// }

// interface Stats {
//   totalPlayers: number;
//   totalGroups: number;
//   totalMatches: number;
//   completedMatches: number;
//   pendingMatches: number;
//   phaseStats: Array<{
//     phase: string;
//     total: string;
//     completed: string;
//   }>;
// }

// interface Match {
//   id: string;
//   groupId: string | null;
//   round: string;
//   player1Id: string;
//   player2Id: string;
//   matchDate: string | null;
//   status: string;
//   description: string;
//   phase: string;
//   player1: Player;
//   player2: Player;
//   result: any;
//   resultInfo: {
//     hasResult: boolean;
//     resultType: string;
//     winner: Player | null;
//     isDraw: boolean;
//     score: string | null;
//     player1FinalScore?: number;
//     player2FinalScore?: number;
//     duration?: number;
//     endReason?: string;
//     classificationPoints: {
//       player1: number;
//       player2: number;
//     };
//   };
// }

// // phase display names used by several small components
// const phaseNames: Record<string, string> = {
//   group: 'Fase de Grupos',
//   repechage: 'Repescagem',
//   round_of_16: 'Oitavas de Final',
//   quarter_finals: 'Quartas de Final',
//   semi_finals: 'Semifinais',
//   third_place: 'Disputa 3º Lugar',
//   final: 'Final'
// };

// const TournamentStandings = () => {
//   const [activeTab, setActiveTab] = useState<'groups' | 'overall' | 'matches'>('groups');
//   const [groupStandings, setGroupStandings] = useState<GroupStanding[]>([]);
//   const [overallStandings, setOverallStandings] = useState<Standing[]>([]);
//   const [stats, setStats] = useState<Stats | null>(null);
//   const [matches, setMatches] = useState<Match[]>([]);
//   const [selectedPhase, setSelectedPhase] = useState<string>('group');
//   const [loading, setLoading] = useState(true);

//   const { userRole } = useAuth();

//   // Carregar dados
//   useEffect(() => {
//     loadData();
//   }, []);

// const loadData = async () => {
//     try {
//       setLoading(true);
      
//       // Usando o service em vez de fetch direto
//       const [groupsData, overallData, statsData, matchesData] = await Promise.all([
//         tournamentService.getGroupStandings(),
//         tournamentService.getOverallStandings(),
//         tournamentService.getTournamentStats(),
//         tournamentService.getAllMatches()
//       ]);

//       setGroupStandings(groupsData);
//       setOverallStandings(overallData);
//       setStats(statsData);
//       setMatches(matchesData);
      
//     } catch (error: any) {
//       console.error('Erro ao carregar dados:', error.message);
//       // Você pode adicionar um toast de erro aqui
//     } finally {
//       setLoading(false);
//     }
//   };


//   // Filtrar partidas por fase
//   const filteredMatches = matches.filter(m => m.phase === selectedPhase);


//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
//           <p className="text-white text-xl">Carregando dados da copa...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 md:p-8">
//       {/* Header */}
//       <div className="max-w-7xl mx-auto mb-8">
//         <div className="grid grid-rows-[auto_auto_auto] gap-4">
//           {/* Linha 1: Botão Voltar */}
//           <div className="flex justify-start">
//             <Link
//               to="/"
//               className="inline-flex items-center px-4 py-2 text-green-500 hover:bg-green-500/10 font-medium rounded-lg transition-colors duration-300 transform hover:scale-105"
//             >
//               <ArrowLeft className="w-4 h-4 mr-2" />
//               Voltar
//             </Link>
//           </div>

//           {/* Linha 2: Título Centralizado */}
//           <div className="text-center">
//             <div className="inline-flex items-center gap-2 sm:gap-3 mb-4">
//               <Trophy className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-400" />
//               <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-green-500 bg-clip-text text-transparent">
//                 Copa de Ordem Unida
//               </h1>
//               <Trophy className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-400" />
//             </div>
//             <p className="text-gray-400 text-sm sm:text-lg">Acompanhe a classificação e resultados</p>
//           </div>

//           {/* Linha 3: Botões de Criar */}
//           {(userRole === "admin" || userRole === "director") && (
//             <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-4">
//               <Link
//                 to="/manage-group"
//                 className="px-4 py-2 sm:px-6 sm:py-2 border-2 border-orange-500 text-orange-500 hover:bg-orange-500/10 font-medium rounded-lg transition-colors duration-300 transform hover:scale-105 inline-flex items-center justify-center text-sm"
//               >
//                 Criar Grupo
//               </Link>
//               <Link
//                 to="/manage-player"
//                 className="px-4 py-2 sm:px-6 sm:py-2 border-2 border-green-500 text-green-500 hover:bg-green-500/10 font-medium rounded-lg transition-colors duration-300 transform hover:scale-105 inline-flex items-center justify-center text-sm"
//               >
//                 Criar Player
//               </Link>
//             </div>
//           )}
//         </div>

//         {/* ESTATÍSTICAS PARA ADMINISTRADORES e DIRETORES */}
//         {/* Estatísticas */}
//         {(userRole === "admin" || userRole === "director") && stats &&(
//           <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
//             {/* <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-sm border border-blue-500/30 rounded-xl p-4 text-center">
//               <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
//               <div className="text-3xl font-bold text-blue-400">{stats.totalPlayers}</div>
//               <div className="text-sm text-gray-400">Jogadores</div>
//             </div> */}
//             {/* <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 backdrop-blur-sm border border-purple-500/30 rounded-xl p-4 text-center">
//               <Target className="w-8 h-8 text-purple-400 mx-auto mb-2" />
//               <div className="text-3xl font-bold text-purple-400">{stats.totalGroups}</div>
//               <div className="text-sm text-gray-400">Grupos</div>
//             </div> */}
//             {/* <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-sm border border-green-500/30 rounded-xl p-4 text-center">
//               <Calendar className="w-8 h-8 text-green-400 mx-auto mb-2" />
//               <div className="text-3xl font-bold text-green-400">{stats.totalMatches}</div>
//               <div className="text-sm text-gray-400">Partidas</div>
//             </div>
//             <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-4 text-center">
//               <Check className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
//               <div className="text-3xl font-bold text-yellow-400">{stats.completedMatches}</div>
//               <div className="text-sm text-gray-400">Finalizadas</div>
//             </div>
//             <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 backdrop-blur-sm border border-red-500/30 rounded-xl p-4 text-center">
//               <Award className="w-8 h-8 text-red-400 mx-auto mb-2" />
//               <div className="text-3xl font-bold text-red-400">{stats.pendingMatches}</div>
//               <div className="text-sm text-gray-400">Pendentes</div>
//             </div> */}
//           </div> 
//         )}






//         {/* NAVEGAÇÃO POR TABS PARA CLASSIFICAÇÃO DE GRUPOS, GERAL E CONFRONTOS */}
//         {/* Versão aumentada e centralizada */}
//         <div className="flex justify-center gap-1 mb-6 py-2 relative border-b border-gray-700/50">
//           <motion.button
//             onClick={() => setActiveTab('groups')}
//             className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all flex-shrink-0 ${
//               activeTab === 'groups'
//                 ? 'text-green-400'
//                 : 'text-gray-400 hover:text-gray-300'
//             }`}
//             whileHover={{ scale: 1.05, y: -1 }}
//             whileTap={{ scale: 0.95 }}
//             transition={{ type: "spring", stiffness: 500, damping: 25 }}
//           >
//             <Target className="w-4 h-4" />
//             <span className="text-sm">Grupos</span>
            
//             {activeTab === 'groups' && (
//               <motion.div
//                 className="absolute -bottom-2 left-0 right-0 h-1 bg-green-500 rounded-full"
//                 layoutId="activeTabIndicator"
//                 transition={{ type: "spring", stiffness: 400, damping: 30 }}
//               />
//             )}
//           </motion.button>

//           <motion.button
//             onClick={() => setActiveTab('overall')}
//             className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all flex-shrink-0 ${
//               activeTab === 'overall'
//                 ? 'text-blue-400'
//                 : 'text-gray-400 hover:text-gray-300'
//             }`}
//             whileHover={{ scale: 1.05, y: -1 }}
//             whileTap={{ scale: 0.95 }}
//             transition={{ type: "spring", stiffness: 500, damping: 25 }}
//           >
//             <TrendingUp className="w-4 h-4" />
//             <span className="text-sm">Classificação Geral</span>
            
//             {activeTab === 'overall' && (
//               <motion.div
//                 className="absolute -bottom-2 left-0 right-0 h-1 bg-blue-500 rounded-full"
//                 layoutId="activeTabIndicator"
//                 transition={{ type: "spring", stiffness: 400, damping: 30 }}
//               />
//             )}
//           </motion.button>

//           <motion.button
//             onClick={() => setActiveTab('matches')}
//             className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all flex-shrink-0 ${
//               activeTab === 'matches'
//                 ? 'text-purple-400'
//                 : 'text-gray-400 hover:text-gray-300'
//             }`}
//             whileHover={{ scale: 1.05, y: -1 }}
//             whileTap={{ scale: 0.95 }}
//             transition={{ type: "spring", stiffness: 500, damping: 25 }}
//           >
//             <Calendar className="w-4 h-4" />
//             <span className="text-sm">Confrontos</span>
            
//             {activeTab === 'matches' && (
//               <motion.div
//                 className="absolute -bottom-2 left-0 right-0 h-1 bg-purple-500 rounded-full"
//                 layoutId="activeTabIndicator"
//                 transition={{ type: "spring", stiffness: 400, damping: 30 }}
//               />
//             )}
//           </motion.button>
//         </div>













//         {/* Conteúdo das abas */}
//         <div className="animate-fadeIn">


//           {/* ============CLASSIFICAÇÃO POR GRUPOS ======================== */}        
//             <AnimatePresence>
//               {activeTab === 'groups' && (
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   transition={{ duration: 0.3 }}
//                   className="space-y-3"
//                 >
//                   {groupStandings.map((group, groupIndex) => (
//                     <motion.div
//                       key={group.groupId}
//                       initial={{ opacity: 0, scale: 0.95 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       transition={{ delay: groupIndex * 0.1 }}
//                       className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-3 hover:bg-gray-800/40 transition-all duration-300 shadow-lg hover:shadow-xl"
//                     >
//                       {/* Header do Grupo com animação expandir */}
//                       <motion.div 
//                         className="flex items-center gap-3 mb-3 cursor-pointer group"
//                         whileHover={{ x: 3 }}
//                         whileTap={{ scale: 0.98 }}
//                       >
//                         <motion.div 
//                           className="bg-gradient-to-br from-green-500 to-green-600 w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold shadow-lg"
//                           whileHover={{ scale: 1.1, rotate: 5 }}
//                         >
//                           {group.groupName}
//                         </motion.div>
//                         <div className="flex-1">
//                           <h3 className="font-bold text-base group-hover:text-green-400 transition-colors">
//                             Grupo {group.groupName}
//                           </h3>
//                           <p className="text-gray-400 text-xs">{group.groupDescription}</p>
//                         </div>
//                         <motion.div
//                           animate={{ rotate: 0 }}
//                           whileHover={{ rotate: 180 }}
//                           transition={{ type: "spring" }}
//                         >
//                           <ChevronDown className="w-4 h-4 text-gray-400" />
//                         </motion.div>
//                       </motion.div>

//                       {/* Tabela Ultra Compacta */}
//                       <div className="overflow-x-auto">
//                         <table className="w-full min-w-[250px]">
//                           <thead>
//                             <tr className="border-b border-gray-700/30">
//                               <th className="text-left py-1 px-1 text-gray-400 text-xs font-medium w-6">#</th>
//                               <th className="text-left py-1 px-1 text-gray-400 text-xs font-medium">Jogador</th>
//                               <th className="text-center py-1 px-1 text-gray-400 text-xs font-medium w-10">PTS</th>
//                               <th className="text-center py-1 px-1 text-gray-400 text-xs font-medium w-6">J</th>
//                               <th className="text-center py-1 px-1 text-gray-400 text-xs font-medium w-16">V-E-D</th>
//                               <th className="text-center py-1 px-1 text-gray-400 text-xs font-medium w-10">SG</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {group.standings.map((standing, index) => (
//                               <motion.tr 
//                                 key={standing.playerId}
//                                 initial={{ opacity: 0, x: -20 }}
//                                 animate={{ opacity: 1, x: 0 }}
//                                 transition={{ 
//                                   delay: (groupIndex * 0.1) + (index * 0.03),
//                                   type: "spring", 
//                                   stiffness: 100 
//                                 }}
//                                 className="border-b border-gray-700/20 hover:bg-gray-700/30 transition-all duration-200"
//                                 whileHover={{ 
//                                   scale: 1.02,
//                                   backgroundColor: "rgba(55, 65, 81, 0.4)",
//                                   transition: { duration: 0.2 }
//                                 }}
//                               >
//                                 {/* Posição com medalha animada */}
//                                 <td className="py-2 px-1">
//                                   <motion.div 
//                                     className="flex items-center gap-1"
//                                     whileHover={{ scale: 1.1 }}
//                                   >
//                                     {index < 3 && (
//                                       <motion.div
//                                         initial={{ scale: 0, rotate: -180 }}
//                                         animate={{ scale: 1, rotate: 0 }}
//                                         transition={{ 
//                                           type: "spring", 
//                                           delay: (groupIndex * 0.1) + (index * 0.05),
//                                           stiffness: 200 
//                                         }}
//                                         className="relative"
//                                       >
//                                         {index === 0 && (
//                                           <Crown className="w-4 h-4 text-yellow-400" />
//                                         )}
//                                         {index === 1 && (
//                                           <Medal className="w-3 h-3 text-gray-300" />
//                                         )}
//                                         {index === 2 && (
//                                           <Medal className="w-3 h-3 text-orange-400" />
//                                         )}
//                                       </motion.div>
//                                     )}
//                                     <span className={`text-xs font-bold ${
//                                       index < 3 ? 'text-white' : 
//                                       index < 6 ? 'text-gray-300' : 'text-gray-500'
//                                     }`}>
//                                       {index + 1}
//                                     </span>
//                                   </motion.div>
//                                 </td>

//                                 {/* Jogador compacto */}
//                                 <td className="py-2 px-1">
//                                   <motion.div 
//                                     className="flex items-center gap-2"
//                                     whileHover={{ x: 3 }}
//                                   >
//                                     <motion.div 
//                                       className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-md"
//                                       whileHover={{ 
//                                         scale: 1.2,
//                                         rotate: 360,
//                                         transition: { duration: 0.4 }
//                                       }}
//                                     >
//                                       {standing.playerName.charAt(0)}
//                                     </motion.div>
//                                     <span className="font-medium text-xs truncate max-w-[80px] sm:max-w-[100px]">
//                                       {standing.playerName}
//                                     </span>
//                                   </motion.div>
//                                 </td>

//                                 {/* Pontuação destacada */}
//                                 <td className="text-center py-2 px-1">
//                                   <motion.div
//                                     className="bg-gradient-to-r from-green-500/30 to-emerald-500/30 border border-green-500/20 rounded-lg px-1 py-1"
//                                     whileHover={{ 
//                                       scale: 1.15,
//                                       backgroundColor: "rgba(34, 197, 94, 0.4)"
//                                     }}
//                                   >
//                                     <span className="text-green-400 text-xs font-bold block">
//                                       {standing.classificationPoints}
//                                     </span>
//                                   </motion.div>
//                                 </td>

//                                 {/* Jogos */}
//                                 <td className="text-center py-2 px-1">
//                                   <span className="text-gray-300 text-xs font-medium">
//                                     {standing.matchesPlayed}
//                                   </span>
//                                 </td>

//                                 {/* V-E-D em uma coluna só */}
//                                 <td className="text-center py-2 px-1">
//                                   <motion.div 
//                                     className="flex justify-center items-center gap-1"
//                                     whileHover={{ scale: 1.1 }}
//                                   >
//                                     <span className="text-green-400 text-xs font-bold bg-green-500/20 px-1 rounded">
//                                       {standing.wins}
//                                     </span>
//                                     <span className="text-gray-400 text-xs">-</span>
//                                     <span className="text-yellow-400 text-xs font-bold bg-yellow-500/20 px-1 rounded">
//                                       {standing.draws}
//                                     </span>
//                                     <span className="text-gray-400 text-xs">-</span>
//                                     <span className="text-red-400 text-xs font-bold bg-red-500/20 px-1 rounded">
//                                       {standing.losses}
//                                     </span>
//                                   </motion.div>
//                                 </td>

//                                 {/* Saldo de Gols com indicador visual */}
//                                 <td className="text-center py-2 px-1">
//                                   <motion.div
//                                     className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
//                                       standing.goalDifference > 0 
//                                         ? 'bg-green-500/20 text-green-400' 
//                                         : standing.goalDifference < 0 
//                                         ? 'bg-red-500/20 text-red-400'
//                                         : 'bg-gray-500/20 text-gray-400'
//                                     }`}
//                                     whileHover={{ 
//                                       scale: 1.2,
//                                       y: -2
//                                     }}
//                                   >
//                                     {standing.goalDifference > 0 && (
//                                       <TrendingUp className="w-3 h-3" />
//                                     )}
//                                     {standing.goalDifference < 0 && (
//                                       <TrendingDown className="w-3 h-3" />
//                                     )}
//                                     {standing.goalDifference === 0 && (
//                                       <Minus className="w-3 h-3" />
//                                     )}
//                                     {standing.goalDifference > 0 ? '+' : ''}{standing.goalDifference}
//                                   </motion.div>
//                                 </td>
//                               </motion.tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>

//                       {/* Footer minimalista */}
//                       <motion.div 
//                         className="flex justify-between items-center mt-3 pt-2 border-t border-gray-700/20 text-xs text-gray-500"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ delay: (groupIndex * 0.1) + 0.3 }}
//                       >
//                         <div className="flex items-center gap-2">
//                           <Users className="w-3 h-3" />
//                           <span>{group.standings.length} jogadores</span>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <Clock className="w-3 h-3" />
//                           <span>Agora</span>
//                         </div>
//                       </motion.div>
//                     </motion.div>
//                   ))}
//                 </motion.div>
//               )}
//             </AnimatePresence>
          



//           {/* ============CLASSIFICAÇÃO GERAL ======================== */} 
//             <AnimatePresence>
//               {activeTab === 'overall' && (
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.95 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   exit={{ opacity: 0, scale: 0.9 }}
//                   transition={{ duration: 0.4 }}
//                   className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-4 shadow-2xl"
//                 >
//                   {/* Header com destaque */}
//                   <motion.div 
//                     className="flex items-center gap-3 mb-4 p-3 bg-gradient-to-r from-yellow-500/10 to-amber-500/5 rounded-lg border border-yellow-500/20"
//                     initial={{ opacity: 0, y: -20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.1 }}
//                   >
//                     <motion.div
//                       animate={{ rotate: [0, 10, -10, 0] }}
//                       transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
//                     >
//                       <Trophy className="w-6 h-6 text-yellow-400" />
//                     </motion.div>
//                     <div>
//                       <h2 className="font-bold text-xl bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
//                         Classificação Geral
//                       </h2>
//                       <p className="text-gray-400 text-xs">Ranking completo de todos os jogadores</p>
//                     </div>
//                   </motion.div>

//                   {/* Tabela Compacta e Animada */}
//                   <div className="overflow-x-auto">
//                     <table className="w-full min-w-[350px]">
//                       <thead>
//                         <tr className="border-b border-gray-700/50">
//                           <th className="text-left py-2 px-1 text-gray-400 text-xs font-medium w-8">#</th>
//                           <th className="text-left py-2 px-1 text-gray-400 text-xs font-medium">Jogador</th>
//                           <th className="text-center py-2 px-1 text-gray-400 text-xs font-medium w-12">Grupo</th>
//                           <th className="text-center py-2 px-1 text-gray-400 text-xs font-medium w-10">PTS</th>
//                           <th className="text-center py-2 px-1 text-gray-400 text-xs font-medium w-6">J</th>
//                           <th className="text-center py-2 px-1 text-gray-400 text-xs font-medium w-14">V-E-D</th>
//                           <th className="text-center py-2 px-1 text-gray-400 text-xs font-medium w-12">SG</th>
//                           <th className="text-center py-2 px-1 text-gray-400 text-xs font-medium w-12">%</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {overallStandings.map((standing, index) => (
//                           <motion.tr 
//                             key={standing.playerId}
//                             initial={{ opacity: 0, x: -30 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             transition={{ 
//                               delay: index * 0.05,
//                               type: "spring", 
//                               stiffness: 100 
//                             }}
//                             className="border-b border-gray-700/20 hover:bg-gray-700/30 transition-all duration-200 group"
//                             whileHover={{ 
//                               scale: 1.01,
//                               backgroundColor: "rgba(55, 65, 81, 0.4)",
//                               transition: { duration: 0.2 }
//                             }}
//                           >
//                             {/* Posição com premiação especial */}
//                             <td className="py-3 px-1">
//                               <motion.div 
//                                 className="flex items-center gap-1"
//                                 whileHover={{ scale: 1.1 }}
//                               >
//                                 {index === 0 && (
//                                   <motion.div
//                                     animate={{ 
//                                       scale: [1, 1.2, 1],
//                                       rotate: [0, 5, -5, 0]
//                                     }}
//                                     transition={{ duration: 3, repeat: Infinity }}
//                                   >
//                                     <Crown className="w-5 h-5 text-yellow-400" />
//                                   </motion.div>
//                                 )}
//                                 {index === 1 && (
//                                   <motion.div
//                                     animate={{ scale: [1, 1.1, 1] }}
//                                     transition={{ duration: 2, repeat: Infinity }}
//                                   >
//                                     <Medal className="w-4 h-4 text-gray-300" />
//                                   </motion.div>
//                                 )}
//                                 {index === 2 && (
//                                   <motion.div
//                                     animate={{ scale: [1, 1.1, 1] }}
//                                     transition={{ duration: 2, repeat: Infinity, delay: 1 }}
//                                   >
//                                     <Medal className="w-4 h-4 text-orange-400" />
//                                   </motion.div>
//                                 )}
//                                 {index > 2 && index < 8 && (
//                                   <Star className="w-3 h-3 text-blue-400 opacity-60" />
//                                 )}
//                                 <span className={`text-sm font-bold ${
//                                   index === 0 ? 'text-yellow-400' :
//                                   index === 1 ? 'text-gray-300' :
//                                   index === 2 ? 'text-orange-400' :
//                                   index < 8 ? 'text-blue-400' : 'text-gray-400'
//                                 }`}>
//                                   {index + 1}
//                                 </span>
//                               </motion.div>
//                             </td>

//                             {/* Jogador com avatar animado */}
//                             <td className="py-3 px-1">
//                               <motion.div 
//                                 className="flex items-center gap-2"
//                                 whileHover={{ x: 3 }}
//                               >
//                                 <motion.div 
//                                   className="relative"
//                                   whileHover={{ 
//                                     scale: 1.2,
//                                     rotate: [0, -10, 10, 0],
//                                     transition: { duration: 0.4 }
//                                   }}
//                                 >
//                                   <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">
//                                     {standing.playerName.charAt(0)}
//                                   </div>
//                                   {index < 3 && (
//                                     <motion.div
//                                       className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"
//                                       animate={{ scale: [1, 1.5, 1] }}
//                                       transition={{ duration: 2, repeat: Infinity }}
//                                     />
//                                   )}
//                                 </motion.div>
//                                 <div className="min-w-0 flex-1">
//                                   <p className="font-semibold text-sm truncate max-w-[100px] sm:max-w-[120px]">
//                                     {standing.playerName}
//                                   </p>
//                                   {index < 3 && (
//                                     <motion.p 
//                                       className="text-xs text-green-400 font-medium"
//                                       initial={{ opacity: 0 }}
//                                       animate={{ opacity: 1 }}
//                                       transition={{ delay: index * 0.1 + 0.5 }}
//                                     >
//                                       {index === 0 ? 'Líder' : index === 1 ? 'Vice' : '3º Lugar'}
//                                     </motion.p>
//                                   )}
//                                 </div>
//                               </motion.div>
//                             </td>

//                             {/* Grupo */}
//                             <td className="text-center py-3 px-1">
//                               <motion.span 
//                                 className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs font-bold inline-block"
//                                 whileHover={{ 
//                                   scale: 1.1,
//                                   backgroundColor: "rgba(59, 130, 246, 0.3)"
//                                 }}
//                               >
//                                 {standing.groupName}
//                               </motion.span>
//                             </td>

//                             {/* Pontuação com destaque */}
//                             <td className="text-center py-3 px-1">
//                               <motion.div
//                                 className="bg-gradient-to-r from-green-500/30 to-emerald-500/30 border border-green-500/30 rounded-lg px-2 py-1"
//                                 whileHover={{ 
//                                   scale: 1.15,
//                                   backgroundColor: "rgba(34, 197, 94, 0.4)"
//                                 }}
//                               >
//                                 <span className="text-green-400 text-sm font-bold block">
//                                   {standing.classificationPoints}
//                                 </span>
//                               </motion.div>
//                             </td>

//                             {/* Jogos */}
//                             <td className="text-center py-3 px-1">
//                               <span className="text-gray-300 text-sm font-medium bg-gray-700/50 rounded px-2 py-1 inline-block min-w-[2rem]">
//                                 {standing.matchesPlayed}
//                               </span>
//                             </td>

//                             {/* V-E-D compacto */}
//                             <td className="text-center py-3 px-1">
//                               <motion.div 
//                                 className="flex justify-center items-center gap-1"
//                                 whileHover={{ scale: 1.1 }}
//                               >
//                                 <div className="flex flex-col items-center">
//                                   <span className="text-green-400 text-xs font-bold">{standing.wins}</span>
//                                   <div className="w-4 h-0.5 bg-green-400/50 rounded"></div>
//                                 </div>
//                                 <span className="text-gray-400 text-xs mx-1">-</span>
//                                 <div className="flex flex-col items-center">
//                                   <span className="text-yellow-400 text-xs font-bold">{standing.draws}</span>
//                                   <div className="w-4 h-0.5 bg-yellow-400/50 rounded"></div>
//                                 </div>
//                                 <span className="text-gray-400 text-xs mx-1">-</span>
//                                 <div className="flex flex-col items-center">
//                                   <span className="text-red-400 text-xs font-bold">{standing.losses}</span>
//                                   <div className="w-4 h-0.5 bg-red-400/50 rounded"></div>
//                                 </div>
//                               </motion.div>
//                             </td>

//                             {/* Saldo de Gols */}
//                             <td className="text-center py-3 px-1">
//                               <motion.div
//                                 className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
//                                   standing.goalDifference > 0 
//                                     ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
//                                     : standing.goalDifference < 0 
//                                     ? 'bg-red-500/20 text-red-400 border border-red-500/30'
//                                     : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
//                                 }`}
//                                 whileHover={{ 
//                                   scale: 1.2,
//                                   y: -2
//                                 }}
//                               >
//                                 {standing.goalDifference > 0 && (
//                                   <TrendingUp className="w-3 h-3" />
//                                 )}
//                                 {standing.goalDifference < 0 && (
//                                   <TrendingDown className="w-3 h-3" />
//                                 )}
//                                 {standing.goalDifference === 0 && (
//                                   <Minus className="w-3 h-3" />
//                                 )}
//                                 {standing.goalDifference > 0 ? '+' : ''}{standing.goalDifference}
//                               </motion.div>
//                             </td>

//                             {/* Aproveitamento com barra visual */}
//                             <td className="text-center py-3 px-1">
//                               <motion.div 
//                                 className="flex flex-col items-center gap-1"
//                                 whileHover={{ scale: 1.1 }}
//                               >
//                                 <span className={`text-xs font-bold ${
//                                   (standing.winRate || 0) >= 60 ? 'text-green-400' :
//                                   (standing.winRate || 0) >= 40 ? 'text-yellow-400' : 'text-red-400'
//                                 }`}>
//                                   {standing.winRate || 0}%
//                                 </span>
//                                 <div className="w-12 h-1 bg-gray-700 rounded-full overflow-hidden">
//                                   <motion.div 
//                                     className={`h-full ${
//                                       (standing.winRate || 0) >= 60 ? 'bg-green-500' :
//                                       (standing.winRate || 0) >= 40 ? 'bg-yellow-500' : 'bg-red-500'
//                                     }`}
//                                     initial={{ width: 0 }}
//                                     animate={{ width: `${Math.min(standing.winRate || 0, 100)}%` }}
//                                     transition={{ delay: index * 0.05 + 0.3, duration: 0.8 }}
//                                   />
//                                 </div>
//                               </motion.div>
//                             </td>
//                           </motion.tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>

//                   {/* Footer informativo */}
//                   <motion.div 
//                     className="flex justify-between items-center mt-4 pt-3 border-t border-gray-700/30 text-xs text-gray-500"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: 0.5 }}
//                   >
//                     <div className="flex items-center gap-4">
//                       <div className="flex items-center gap-1">
//                         <Crown className="w-3 h-3 text-yellow-400" />
//                         <span>Líder</span>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <Medal className="w-3 h-3 text-gray-300" />
//                         <span>Top 3</span>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <Star className="w-3 h-3 text-blue-400" />
//                         <span>Top 8</span>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <Users className="w-3 h-3" />
//                       <span>{overallStandings.length} jogadores</span>
//                     </div>
//                   </motion.div>
//                 </motion.div>
//               )}
//             </AnimatePresence>  



//           {/* ============CONFRONTOS ======================== */} 
//             <AnimatePresence>
//               {activeTab === 'matches' && (
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   transition={{ duration: 0.4 }}
//                   className="space-y-4"
//                 >
//                   {/* Seletor de Fase - Ultra Compacto */}
//                   <motion.div 
//                     className="flex gap-1 overflow-x-auto pb-2 no-scrollbar"
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: 0.1 }}
//                   >
//                     {['group', 'round_of_16', 'quarter_finals', 'semi_finals', 'final', 'third_place'].map((phase) => (
//                       <motion.button
//                         key={phase}
//                         onClick={() => setSelectedPhase(phase)}
//                         className={`relative flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-all flex-shrink-0 text-xs sm:text-sm ${
//                           selectedPhase === phase
//                             ? 'text-white shadow-lg'
//                             : 'text-gray-300 hover:text-white bg-gray-800/50 hover:bg-gray-700/50'
//                         }`}
//                         whileHover={{ scale: 1.05, y: -1 }}
//                         whileTap={{ scale: 0.95 }}
//                       >
//                         {selectedPhase === phase && (
//                           <motion.div
//                             className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg"
//                             layoutId="phaseIndicator"
//                             transition={{ type: "spring", stiffness: 500, damping: 30 }}
//                           />
//                         )}
//                         <Swords className="w-3 h-3 relative z-10" />
//                         <span className="relative z-10">{phaseNames[phase]}</span>
//                       </motion.button>
//                     ))}
//                   </motion.div>

//                   {/* Conteúdo dos Confrontos */}
//                   <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: 0.2 }}
//                   >
//                     {selectedPhase === 'group' ? (
//                       <div className="space-y-3">
//                         {['A', 'B', 'C', 'D', 'E'].map((groupName, groupIndex) => {
//                           const groupMatches = filteredMatches.filter(m => {
//                             if (!m.groupId) return false;
//                             const g = groupStandings.find(gs => gs.groupId === m.groupId);
//                             return g ? g.groupName === groupName : false;
//                           });
                          
//                           if (groupMatches.length === 0) return null;

//                           const matchesByRound: Record<string, Match[]> = {};
//                           groupMatches.forEach(match => {
//                             if (!matchesByRound[match.round]) {
//                               matchesByRound[match.round] = [];
//                             }
//                             matchesByRound[match.round].push(match);
//                           });

//                           const completedMatches = groupMatches.filter(m => m.status === 'completed').length;
//                           const totalMatches = groupMatches.length;

//                           return (
//                             <motion.div
//                               key={groupName}
//                               initial={{ opacity: 0, scale: 0.95 }}
//                               animate={{ opacity: 1, scale: 1 }}
//                               transition={{ delay: groupIndex * 0.1 }}
//                               className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden hover:bg-gray-800/40 transition-all duration-300"
//                             >
//                               {/* Header do Grupo - Super Compacto */}
//                               <motion.div 
//                                 className="bg-gradient-to-r from-green-600/80 to-green-700/80 p-3 flex items-center justify-between cursor-pointer"
//                                 whileHover={{ scale: 1.01 }}
//                                 whileTap={{ scale: 0.98 }}
//                               >
//                                 <div className="flex items-center gap-2 flex-1 min-w-0">
//                                   <motion.div 
//                                     className="w-7 h-7 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center flex-shrink-0"
//                                     whileHover={{ rotate: 360 }}
//                                     transition={{ duration: 0.6 }}
//                                   >
//                                     <span className="font-bold text-white text-sm">{groupName}</span>
//                                   </motion.div>
//                                   <div className="min-w-0 flex-1">
//                                     <h3 className="font-bold text-white text-sm truncate">Grupo {groupName}</h3>
//                                     <div className="flex items-center gap-2">
//                                       <div className="flex items-center gap-1">
//                                         <div className="w-2 h-2 bg-green-400 rounded-full"></div>
//                                         <span className="text-green-100 text-xs">{completedMatches}</span>
//                                       </div>
//                                       <span className="text-green-100 text-xs">/</span>
//                                       <span className="text-green-100 text-xs">{totalMatches}</span>
//                                       <span className="text-green-100 text-xs">finalizadas</span>
//                                     </div>
//                                   </div>
//                                 </div>
//                                 <motion.div
//                                   animate={{ rotate: [0, 10, 0] }}
//                                   transition={{ duration: 2, repeat: Infinity }}
//                                 >
//                                   <Trophy className="w-4 h-4 text-yellow-400" />
//                                 </motion.div>
//                               </motion.div>

//                               {/* Rodadas e Partidas */}
//                               <div className="p-3 space-y-3">
//                                 {Object.keys(matchesByRound)
//                                   .sort((a, b) => parseInt(a) - parseInt(b))
//                                   .map((round, roundIndex) => (
//                                     <motion.div
//                                       key={round}
//                                       initial={{ opacity: 0, y: 20 }}
//                                       animate={{ opacity: 1, y: 0 }}
//                                       transition={{ delay: (groupIndex * 0.1) + (roundIndex * 0.05) }}
//                                       className="space-y-2"
//                                     >
//                                       {/* Header da Rodada - Compacto */}
//                                       <div className="flex items-center gap-2 pb-2 border-b border-gray-700/50">
//                                         <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0">
//                                           <span className="font-bold text-white text-xs">{round}</span>
//                                         </div>
//                                         <div className="min-w-0 flex-1">
//                                           <h4 className="font-bold text-white text-sm truncate">Rodada {round}</h4>
//                                           <div className="flex items-center gap-1 text-xs text-gray-400">
//                                             <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
//                                             <span>{matchesByRound[round].filter(m => m.status === 'completed').length}</span>
//                                             <span>/</span>
//                                             <span>{matchesByRound[round].length}</span>
//                                           </div>
//                                         </div>
//                                       </div>

//                                       {/* Partidas - Grid Responsivo */}
//                                       <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-2">
//                                         {matchesByRound[round].map((match, matchIndex) => (
//                                           <MatchCard 
//                                             key={match.id}
//                                             match={match}
//                                             groupName={groupName}
//                                             delay={(groupIndex * 0.1) + (roundIndex * 0.05) + (matchIndex * 0.03)}
//                                             onMatchFinish={loadData} // função que recarrega os matches
//                                           />
//                                         ))}
//                                       </div>
//                                     </motion.div>
//                                   ))}
//                               </div>
//                             </motion.div>
//                           );
//                         })}
//                       </div>
//                     ) : (
//                       /* Fases Eliminatórias - Design Otimizado */
//                       <div className="space-y-2">
//                         {filteredMatches.length === 0 ? (
//                           <motion.div 
//                             className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center"
//                             initial={{ opacity: 0, scale: 0.9 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                           >
//                             <Calendar className="w-10 h-10 text-gray-600 mx-auto mb-2" />
//                             <h3 className="font-bold text-gray-400 text-sm mb-1">Nenhuma partida nesta fase</h3>
//                             <p className="text-gray-500 text-xs">As partidas serão agendadas em breve</p>
//                           </motion.div>
//                         ) : (
//                           filteredMatches.map((match, index) => (
//                             <EliminationMatchCard 
//                               key={match.id}
//                               match={match}
//                               index={index}
//                               phase={selectedPhase}
//                             />
//                           ))
//                         )}
//                       </div>
//                     )}
//                   </motion.div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TournamentStandings;


// interface MatchCardProps {
//   match: Match;
//   groupName?: string;
//   delay?: number;
//   onMatchFinish?: () => void; // Callback para atualizar a lista após finalizar
// }

// export const MatchCard = ({ match, groupName, delay = 0, onMatchFinish }: MatchCardProps) => {
//   const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
//   const { userRole } = useAuth();
  
//   const { resultInfo, status, player1, player2, result } = match;

//   const isCompleted = status === "completed";
//   const hasResult = resultInfo.hasResult;
//   const isDraw = resultInfo.isDraw;
//   const winner = resultInfo.winner;

//   const score1 = hasResult ? resultInfo.player1FinalScore ?? 0 : 0;
//   const score2 = hasResult ? resultInfo.player2FinalScore ?? 0 : 0;

//   const classPoints1 = resultInfo.classificationPoints?.player1 ?? 0;
//   const classPoints2 = resultInfo.classificationPoints?.player2 ?? 0;

//   const matchDuration = result?.duration ?? resultInfo?.duration ?? null;
//   const judges = result?.judges ?? [];
//   const instructor = result?.instructor ?? "—";

//   const winnerColor = "from-green-600/40 to-green-500/20 border-green-400/40";
//   const drawColor = "from-yellow-600/30 to-yellow-500/20 border-yellow-400/40";
//   const pendingColor = "from-gray-700/40 to-gray-800/20 border-gray-600/30";

//   const cardStyle = isDraw
//     ? drawColor
//     : winner
//     ? winnerColor
//     : pendingColor;

//   const handleFinishMatch = () => {
//     setIsFinishModalOpen(true);
//   };

//   const handleMatchFinished = () => {
//     setIsFinishModalOpen(false);
//     if (onMatchFinish) {
//       onMatchFinish(); // Atualiza a lista de matches
//     }
//   };

//   return (
//     <>
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay, type: "spring", stiffness: 90 }}
//         className={`relative overflow-hidden rounded-2xl shadow-xl border backdrop-blur-xl transition-all hover:scale-[1.02] bg-gradient-to-br ${cardStyle} p-4 sm:p-6 w-full max-w-md mx-auto`}
//       >
//         {winner && !isDraw && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 0.4 }}
//             className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-transparent blur-2xl"
//           />
//         )}

//         {/* Header */}
//         <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
//           <p className="text-xs uppercase tracking-wide text-gray-300">
//             {groupName ? `Grupo ${groupName}` : "Partida"}
//           </p>
//           <div className="flex items-center gap-2">
//             <span
//               className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                 isCompleted
//                   ? "bg-green-500/20 text-green-300"
//                   : "bg-yellow-500/20 text-yellow-300 animate-pulse"
//               }`}
//             >
//               {isCompleted ? "Finalizada" : "Pendente"}
//             </span>
            
//             {/* Botão para finalizar partida */}
//             {(userRole === "admin" || userRole === "director") && !isCompleted && (
//               <button
//                 onClick={handleFinishMatch}
//                 className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold hover:bg-blue-500/30 transition-colors border border-blue-400/40"
//               >
//                 Finalizar
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Placar */}
//         <div className="flex items-center justify-between gap-4 sm:gap-6 lg:gap-8">
//           {/* Player 1 */}
//           <motion.div
//             whileHover={{ scale: 1.05 }}
//             className={`relative flex flex-col items-center text-center transition-all flex-1 ${
//               winner?.id === player1.id
//                 ? "text-green-300 scale-105"
//                 : isDraw
//                 ? "text-yellow-300"
//                 : "text-gray-300"
//             }`}
//           >
//             {(winner?.id === player1.id || isDraw) && (
//               <motion.span
//                 initial={{ opacity: 0, y: -8 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: delay + 0.2 }}
//                 className={`absolute -top-3 sm:-top-4 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full ${
//                   isDraw
//                     ? "bg-yellow-500/20 text-yellow-300 border border-yellow-400/40"
//                     : "bg-green-500/20 text-green-300 border border-green-400/40"
//                 }`}
//               >
//                 {isDraw ? "🤝 Empate" : "🏆 Venceu"}
//               </motion.span>
//             )}

//             <motion.div
//               animate={
//                 winner?.id === player1.id
//                   ? {
//                       boxShadow: [
//                         "0 0 0px rgba(34,197,94,0)",
//                         "0 0 20px rgba(34,197,94,0.6)",
//                         "0 0 0px rgba(34,197,94,0)",
//                       ],
//                     }
//                   : {}
//               }
//               transition={{
//                 repeat: Infinity,
//                 duration: 2,
//                 ease: "easeInOut",
//               }}
//               className={`w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center font-bold text-xl sm:text-2xl lg:text-3xl border-2 ${
//                 winner?.id === player1.id
//                   ? "border-green-400 bg-green-500/20"
//                   : isDraw
//                   ? "border-yellow-400 bg-yellow-500/10"
//                   : "border-gray-600 bg-gray-700/30"
//               }`}
//             >
//               {player1.name.charAt(0).toUpperCase()}
//             </motion.div>

//             <p className="mt-2 font-semibold truncate w-full text-sm sm:text-base px-1">
//               {player1.name}
//             </p>
            
//             {/* Pontuação de classificação */}
//             {isCompleted && (
//               <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
//                 +{classPoints1} pts
//               </p>
//             )}
//           </motion.div>

//           {/* Centro */}
//           <div className="flex flex-col items-center justify-center flex-shrink-0">
//             <motion.div
//               animate={{ rotate: [0, 10, -10, 0] }}
//               transition={{ repeat: Infinity, duration: 3 }}
//               className="flex items-center justify-center mb-2"
//             >
//               <Swords
//                 className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 ${
//                   isDraw
//                     ? "text-yellow-400"
//                     : winner
//                     ? "text-green-400"
//                     : "text-gray-400"
//                 }`}
//               />
//             </motion.div>

//             <div className="flex items-center gap-2 sm:gap-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold">
//               <span
//                 className={`${
//                   winner?.id === player1.id
//                     ? "text-green-400"
//                     : isDraw
//                     ? "text-yellow-300"
//                     : "text-gray-400"
//                 }`}
//               >
//                 {score1}
//               </span>
//               <span className="text-gray-500">:</span>
//               <span
//                 className={`${
//                   winner?.id === player2.id
//                     ? "text-green-400"
//                     : isDraw
//                     ? "text-yellow-300"
//                     : "text-gray-400"
//                 }`}
//               >
//                 {score2}
//               </span>
//             </div>

//             {!isCompleted && (
//               <p className="text-[10px] sm:text-xs text-gray-400 mt-1 text-center">
//                 A definir
//               </p>
//             )}
//           </div>

//           {/* Player 2 */}
//           <motion.div
//             whileHover={{ scale: 1.05 }}
//             className={`relative flex flex-col items-center text-center transition-all flex-1 ${
//               winner?.id === player2.id
//                 ? "text-green-300 scale-105"
//                 : isDraw
//                 ? "text-yellow-300"
//                 : "text-gray-300"
//             }`}
//           >
//             {(winner?.id === player2.id || isDraw) && (
//               <motion.span
//                 initial={{ opacity: 0, y: -8 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: delay + 0.2 }}
//                 className={`absolute -top-3 sm:-top-4 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full ${
//                   isDraw
//                     ? "bg-yellow-500/20 text-yellow-300 border border-yellow-400/40"
//                     : "bg-green-500/20 text-green-300 border border-green-400/40"
//                 }`}
//               >
//                 {isDraw ? "🤝 Empate" : "🏆 Venceu"}
//               </motion.span>
//             )}

//             <motion.div
//               animate={
//                 winner?.id === player2.id
//                   ? {
//                       boxShadow: [
//                         "0 0 0px rgba(34,197,94,0)",
//                         "0 0 20px rgba(34,197,94,0.6)",
//                         "0 0 0px rgba(34,197,94,0)",
//                       ],
//                     }
//                   : {}
//               }
//               transition={{
//                 repeat: Infinity,
//                 duration: 2,
//                 ease: "easeInOut",
//               }}
//               className={`w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center font-bold text-xl sm:text-2xl lg:text-3xl border-2 ${
//                 winner?.id === player2.id
//                   ? "border-green-400 bg-green-500/20"
//                   : isDraw
//                   ? "border-yellow-400 bg-yellow-500/10"
//                   : "border-gray-600 bg-gray-700/30"
//               }`}
//             >
//               {player2.name.charAt(0).toUpperCase()}
//             </motion.div>

//             <p className="mt-2 font-semibold truncate w-full text-sm sm:text-base px-1">
//               {player2.name}
//             </p>
            
//             {/* Pontuação de classificação */}
//             {isCompleted && (
//               <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
//                 +{classPoints2} pts
//               </p>
//             )}
//           </motion.div>
//         </div>

//         {/* Footer */}
//         {isCompleted && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="mt-4 border-t border-gray-700/30 pt-2 text-gray-400 text-[10px] sm:text-[12px] flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-4"
//           >
//             {matchDuration && (
//               <span className="flex items-center gap-1.5 justify-center">
//                 <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {matchDuration} min
//               </span>
//             )}
//             {judges && judges.length > 0 && (
//               <span className="flex items-center gap-1.5 justify-center">
//                 <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
//                 {Array.isArray(judges)
//                   ? judges.length
//                     ? `${judges.length} juíz${judges.length > 1 ? 'es' : ''}`
//                     : "Sem juízes"
//                   : "Sem juízes"}
//               </span>
//             )}
//             {instructor && instructor !== "—" && (
//               <span className="flex items-center gap-1.5 justify-center">
//                 <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {instructor}
//               </span>
//             )}
//           </motion.div>
//         )}
//       </motion.div>

//       {/* Modal para finalizar partida*/}
//       <FinishMatchModal
//         isOpen={isFinishModalOpen}
//         onClose={() => setIsFinishModalOpen(false)}
//         onFinish={handleMatchFinished}
//         match={match}
//       />
//     </>
//   );
// };




// export const EliminationMatchCard = ({ match, index, phase }: { match: Match, index: number, phase: string }) => {
//   const isCompleted = match.status === "completed";
//   const hasResult = match.resultInfo.hasResult;
//   const isDraw = match.resultInfo.isDraw;
//   const winner = match.resultInfo.winner;

//   const score1 = hasResult ? match.resultInfo.player1FinalScore ?? 0 : 0;
//   const score2 = hasResult ? match.resultInfo.player2FinalScore ?? 0 : 0;

//   const classPoints1 = match.resultInfo.classificationPoints?.player1 ?? 0;
//   const classPoints2 = match.resultInfo.classificationPoints?.player2 ?? 0;

//   const matchDuration = match.result?.duration ?? match.resultInfo?.duration ?? null;
//   const judges = match.result?.judges ?? [];
//   const instructor = match.result?.instructor ?? "—";

//   const winnerColor = "from-green-700/30 to-green-500/10 border-green-400/40";
//   const drawColor = "from-yellow-600/30 to-yellow-500/10 border-yellow-400/40";
//   const pendingColor = "from-gray-700/40 to-gray-800/20 border-gray-600/30";

//   const cardStyle = isDraw ? drawColor : winner ? winnerColor : pendingColor;

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 15 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: index * 0.08, type: "spring", stiffness: 90 }}
//       className={`relative overflow-hidden rounded-2xl border backdrop-blur-xl p-5 sm:p-6 shadow-xl transition-all hover:scale-[1.02] bg-gradient-to-br ${cardStyle}`}
//     >
//       {/* Glow para o vencedor */}
//       {winner && !isDraw && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 0.4 }}
//           className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-transparent blur-2xl"
//         />
//       )}

//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <span className="text-xs uppercase tracking-wide text-gray-300">
//           {phase ? `Fase: ${phase}` : "Partida Eliminatória"}
//         </span>
//         <span
//           className={`px-3 py-1 rounded-full text-xs font-semibold ${
//             isCompleted
//               ? "bg-green-500/20 text-green-300"
//               : "bg-yellow-500/20 text-yellow-300 animate-pulse"
//           }`}
//         >
//           {isCompleted ? "Finalizada" : "Pendente"}
//         </span>
//       </div>

//       {/* Placar e jogadores */}
//       <div className="flex items-center justify-between gap-6 sm:gap-10">
//         {/* Player 1 */}
//         <motion.div
//           whileHover={{ scale: 1.05 }}
//           className={`relative flex flex-col items-center text-center ${
//             winner?.id === match.player1.id
//               ? "text-green-300 scale-105"
//               : isDraw
//               ? "text-yellow-300"
//               : "text-gray-300"
//           }`}
//         >
//           {(winner?.id === match.player1.id || isDraw) && (
//             <motion.span
//               initial={{ opacity: 0, y: -6 }}
//               animate={{ opacity: 1, y: 0 }}
//               className={`absolute -top-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${
//                 isDraw
//                   ? "bg-yellow-500/20 text-yellow-300 border border-yellow-400/40"
//                   : "bg-green-500/20 text-green-300 border border-green-400/40"
//               }`}
//             >
//               {isDraw ? "🤝 Empate" : "🏆 Venceu"}
//             </motion.span>
//           )}

//           <div
//             className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center font-bold text-2xl border-2 ${
//               winner?.id === match.player1.id
//                 ? "border-green-400 bg-green-500/20"
//                 : isDraw
//                 ? "border-yellow-400 bg-yellow-500/10"
//                 : "border-gray-600 bg-gray-700/30"
//             }`}
//           >
//             {match.player1.name.charAt(0).toUpperCase()}
//           </div>
//           <p className="mt-2 font-semibold text-sm truncate max-w-[100px]">
//             {match.player1.name}
//           </p>
//         </motion.div>

//         {/* Centro */}
//         <div className="flex flex-col items-center justify-center">
//           <motion.div
//             animate={{ rotate: [0, 10, -10, 0] }}
//             transition={{ repeat: Infinity, duration: 3 }}
//           >
//             <Swords
//               className={`w-8 h-8 ${
//                 isDraw
//                   ? "text-yellow-400"
//                   : winner
//                   ? "text-green-400"
//                   : "text-gray-400"
//               }`}
//             />
//           </motion.div>

//           <div className="flex items-center gap-3 text-3xl sm:text-4xl font-extrabold mt-1">
//             <span
//               className={`${
//                 winner?.id === match.player1.id
//                   ? "text-green-400"
//                   : isDraw
//                   ? "text-yellow-300"
//                   : "text-gray-400"
//               }`}
//             >
//               {score1}
//             </span>
//             <span className="text-gray-500">:</span>
//             <span
//               className={`${
//                 winner?.id === match.player2.id
//                   ? "text-green-400"
//                   : isDraw
//                   ? "text-yellow-300"
//                   : "text-gray-400"
//               }`}
//             >
//               {score2}
//             </span>
//           </div>

//           {hasResult && (
//             <p className="text-[11px] sm:text-xs text-gray-400 mt-1">
//               +{classPoints1} / +{classPoints2} pts classificação
//             </p>
//           )}
//         </div>

//         {/* Player 2 */}
//         <motion.div
//           whileHover={{ scale: 1.05 }}
//           className={`relative flex flex-col items-center text-center ${
//             winner?.id === match.player2.id
//               ? "text-green-300 scale-105"
//               : isDraw
//               ? "text-yellow-300"
//               : "text-gray-300"
//           }`}
//         >
//           {(winner?.id === match.player2.id || isDraw) && (
//             <motion.span
//               initial={{ opacity: 0, y: -6 }}
//               animate={{ opacity: 1, y: 0 }}
//               className={`absolute -top-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${
//                 isDraw
//                   ? "bg-yellow-500/20 text-yellow-300 border border-yellow-400/40"
//                   : "bg-green-500/20 text-green-300 border border-green-400/40"
//               }`}
//             >
//               {isDraw ? "🤝 Empate" : "🏆 Venceu"}
//             </motion.span>
//           )}

//           <div
//             className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center font-bold text-2xl border-2 ${
//               winner?.id === match.player2.id
//                 ? "border-green-400 bg-green-500/20"
//                 : isDraw
//                 ? "border-yellow-400 bg-yellow-500/10"
//                 : "border-gray-600 bg-gray-700/30"
//             }`}
//           >
//             {match.player2.name.charAt(0).toUpperCase()}
//           </div>
//           <p className="mt-2 font-semibold text-sm truncate max-w-[100px]">
//             {match.player2.name}
//           </p>
//         </motion.div>
//       </div>

//       {/* Footer */}
//       {isCompleted && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="mt-4 border-t border-gray-700/30 pt-2 text-gray-400 text-[11px] sm:text-[12px] flex flex-wrap justify-center gap-4"
//         >
//           {matchDuration && (
//             <span className="flex items-center gap-1.5">
//               <Clock className="w-3.5 h-3.5" /> {matchDuration} min
//             </span>
//           )}
//           {judges && (
//             <span className="flex items-center gap-1.5">
//               <Users className="w-3.5 h-3.5" />
//               {Array.isArray(judges)
//                 ? judges.length
//                   ? judges.map((j: any) => j.name || j).join(", ")
//                   : "Juízes não informados"
//                 : typeof judges === "string" && judges.trim() !== ""
//                 ? judges
//                 : "Juízes não informados"}
//             </span>
//           )}
//           {instructor && (
//             <span className="flex items-center gap-1.5">
//               <Star className="w-3.5 h-3.5" /> {instructor}
//             </span>
//           )}
//         </motion.div>
//       )}
//     </motion.div>
//   );
// };














