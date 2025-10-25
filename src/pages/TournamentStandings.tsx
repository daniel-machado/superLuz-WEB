import { useState, useEffect } from 'react';
import { Trophy, Target, Calendar, TrendingUp, Medal, Star, Swords, Clock, Users, Minus, TrendingDown, Crown, ChevronDown, ArrowLeft, Info, FileText, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router';
import { tournamentService } from '../services/TournamentCup/tournamentService';
import { FinishMatchModal } from '../components/ClassModais/FinishMatchModal';
import { CreateMatchModal } from '../components/ClassModais/CreateMatchModal';

// Tipos (mantidos iguais)
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
  round_of_16: 'Oitavas de Finais',
  quarter_finals: 'Quartas de Finais',
  semi_finals: 'Semifinais',
  third_place: 'Disputa 3º Lugar',
  final: 'Final'
};

const TournamentStandings = () => {
  const [activeTab, setActiveTab] = useState<'groups' | 'overall' | 'matches'>('groups');
  const [groupStandings, setGroupStandings] = useState<GroupStanding[]>([]);
  const [overallStandings, setOverallStandings] = useState<Standing[]>([]);
  const [_stats, setStats] = useState<Stats | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedPhase, setSelectedPhase] = useState<string>('group');
  const [loading, setLoading] = useState(true);

  // Estados para controlar dropdowns de grupos e rodadas
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [expandedRounds, setExpandedRounds] = useState<Record<string, boolean>>({});

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
      
      // Inicializar todos os grupos como expandidos por padrão
      const initialExpandedGroups: Record<string, boolean> = {};
      groupsData.forEach((group: { groupName: string | number; }) => {
        initialExpandedGroups[group.groupName] = true;
      });
      setExpandedGroups(initialExpandedGroups);
      
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error.message);
      // Você pode adicionar um toast de erro aqui
    } finally {
      setLoading(false);
    }
  };

  // Filtrar partidas por fase
  const filteredMatches = matches.filter(m => m.phase === selectedPhase);

  // Função para alternar expansão de grupo
  const toggleGroupExpansion = (groupName: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  // Função para alternar expansão de rodada
  const toggleRoundExpansion = (roundKey: string) => {
    setExpandedRounds(prev => ({
      ...prev,
      [roundKey]: !prev[roundKey]
    }));
  };

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
                                {(standing.winRate || 0).toFixed(1)}%
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
                        const isGroupExpanded = expandedGroups[groupName];

                        return (
                          <motion.div
                            key={groupName}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: groupIndex * 0.1 }}
                            className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden hover:bg-gray-800/40 transition-all duration-300"
                          >
                            {/* Header do Grupo com Dropdown */}
                            <motion.div 
                              className="bg-gradient-to-r from-green-600/80 to-green-700/80 p-3 flex items-center justify-between cursor-pointer"
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => toggleGroupExpansion(groupName)}
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
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenCreateModal('group', {id: groupObj?.groupId ?? '', name: groupName});
                                    }}
                                    className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-semibold hover:bg-white/30 transition-colors border border-white/30 flex items-center gap-1"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <Swords className="w-3 h-3" />
                                    Criar
                                  </motion.button>
                                )}
                                <motion.div
                                  animate={{ 
                                    rotate: isGroupExpanded ? 180 : 0,
                                    scale: [1, 1.1, 1]
                                  }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <ChevronDown className="w-4 h-4 text-white" />
                                </motion.div>
                              </div>
                            </motion.div>

                            {/* Conteúdo do Grupo (Dropdown) */}
                            <AnimatePresence>
                              {isGroupExpanded && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="overflow-hidden"
                                >
                                  <div className="p-3 space-y-3">
                                    {Object.keys(matchesByRound)
                                      .sort((a, b) => parseInt(a) - parseInt(b))
                                      .map((round, roundIndex) => {
                                        const roundKey = `${groupName}-${round}`;
                                        const isRoundExpanded = expandedRounds[roundKey] ?? true;

                                        return (
                                          <motion.div
                                            key={round}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: (groupIndex * 0.1) + (roundIndex * 0.05) }}
                                            className="space-y-2"
                                          >
                                            {/* Header da Rodada com Dropdown */}
                                            <div 
                                              className="flex items-center gap-2 pb-2 border-b border-gray-700/50 cursor-pointer"
                                              onClick={() => toggleRoundExpansion(roundKey)}
                                            >
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
                                              <motion.div
                                                animate={{ 
                                                  rotate: isRoundExpanded ? 180 : 0,
                                                  scale: [1, 1.1, 1]
                                                }}
                                                transition={{ duration: 0.3 }}
                                              >
                                                <ChevronDown className="w-4 h-4 text-gray-400" />
                                              </motion.div>
                                            </div>

                                            {/* Partidas da Rodada (Dropdown) */}
                                            <AnimatePresence>
                                              {isRoundExpanded && (
                                                <motion.div
                                                  initial={{ opacity: 0, height: 0 }}
                                                  animate={{ opacity: 1, height: 'auto' }}
                                                  exit={{ opacity: 0, height: 0 }}
                                                  transition={{ duration: 0.3 }}
                                                  className="overflow-hidden"
                                                >
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
                                              )}
                                            </AnimatePresence>
                                          </motion.div>
                                        );
                                      })}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
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
  const [showDetails, setShowDetails] = useState(false);
  
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
  const judgesRaw = result?.judges ?? "";
  const instructor = result?.instructor ?? "—";
  const observations = result?.observations ?? "";

  // Parse judges: pode ser string ou array
  const judges = typeof judgesRaw === 'string' 
    ? judgesRaw.split(',').map(j => j.trim()).filter(Boolean)
    : Array.isArray(judgesRaw) 
    ? judgesRaw 
    : [];

  const winnerColor = "from-green-600/40 to-green-500/20 border-green-400/40";
  const drawColor = "from-yellow-600/30 to-yellow-500/20 border-yellow-400/40";
  const pendingColor = "from-gray-700/40 to-gray-800/20 border-gray-600/30";

  const cardStyle = isDraw ? drawColor : winner ? winnerColor : pendingColor;

  const handleFinishMatch = () => {
    if (onFinishMatch) {
      onFinishMatch(match);
    }
  };

  // Tradução do motivo de término
  const getEndReasonLabel = (reason: string) => {
    const reasons: Record<string, string> = {
      'completed': 'Zerou',
      'time': 'Tempo',
      'walkover': 'W.O'
    };
    return reasons[reason] || reason;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 90 }}
      className={`relative overflow-hidden rounded-2xl shadow-2xl border backdrop-blur-xl transition-all hover:scale-[1.01] bg-gradient-to-br ${cardStyle} w-full max-w-md mx-auto`}
    >
      {/* Glow Effect para vencedor */}
      {winner && !isDraw && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-transparent blur-3xl"
        />
      )}

      {/* Header com Gradiente */}
      <div className="relative z-10 bg-gradient-to-r from-gray-900/60 to-gray-800/40 backdrop-blur-sm border-b border-gray-700/50 p-3 sm:p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-400/40 flex items-center justify-center">
              <Swords className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">
                {groupName ? `Grupo ${groupName}` : "Eliminatória"}
              </p>
              {isCompleted && matchDuration && (
                <p className="text-[10px] text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {matchDuration} min • {getEndReasonLabel(result?.endReason || '')}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                isCompleted
                  ? "bg-green-500/20 text-green-300 border border-green-400/30"
                  : "bg-yellow-500/20 text-yellow-300 animate-pulse border border-yellow-400/30"
              }`}
            >
              {isCompleted ? "✓ Finalizada" : "⏱ Pendente"}
            </span>
            
            {(userRole === "admin" || userRole === "director") && !isCompleted && (
              <button
                onClick={handleFinishMatch}
                className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold hover:bg-blue-500/40 transition-all border border-blue-400/40 hover:scale-105"
              >
                Finalizar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Placar - Players */}
      <div className="relative z-10 p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Player 1 */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className={`relative flex flex-col items-center text-center flex-1 ${
              winner?.id === player1.id
                ? "text-green-300"
                : isDraw
                ? "text-yellow-300"
                : "text-gray-300"
            }`}
          >
            {/* Avatar com borda animada */}
            <div className="relative">
              <motion.div
                animate={
                  winner?.id === player1.id
                    ? {
                        boxShadow: [
                          "0 0 0px rgba(34,197,94,0)",
                          "0 0 30px rgba(34,197,94,0.8)",
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
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center font-bold text-2xl sm:text-3xl border-[3px] ${
                  winner?.id === player1.id
                    ? "border-green-400 bg-green-500/20"
                    : isDraw
                    ? "border-yellow-400 bg-yellow-500/10"
                    : "border-gray-500 bg-gray-700/30"
                } overflow-hidden shadow-xl`}
              >
                {player1.photo ? (
                  <img 
                    src={player1.photo} 
                    alt={player1.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white drop-shadow-lg">{player1.name.charAt(0).toUpperCase()}</span>
                )}
              </motion.div>
              
              {/* Badge de vitória */}
              {winner?.id === player1.id && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="absolute -top-1 -right-1 w-7 h-7 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg border-2 border-gray-900"
                >
                  <Trophy className="w-3.5 h-3.5 text-white" />
                </motion.div>
              )}
            </div>

            {/* Nome */}
            <p className="mt-2 font-bold truncate w-full text-sm sm:text-base px-1 drop-shadow-md">
              {player1.name}
            </p>
            
            {/* Badges e Pontos */}
            <div className="flex flex-col gap-1 mt-1">
              {(winner?.id === player1.id || isDraw) && (
                <motion.span
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isDraw
                      ? "bg-yellow-500/20 text-yellow-300 border border-yellow-400/40"
                      : "bg-green-500/20 text-green-300 border border-green-400/40"
                  }`}
                >
                  {isDraw ? "Empate" : "Vencedor"}
                </motion.span>
              )}
              
              {isCompleted && (
                <span className="text-[10px] text-gray-400 font-semibold">
                  +{classPoints1} pts classificação
                </span>
              )}
            </div>
          </motion.div>

          {/* Score Central */}
          <div className="flex flex-col items-center justify-center flex-shrink-0">
            <motion.div
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="mb-3"
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${
                isDraw
                  ? "from-yellow-500/30 to-yellow-600/20 border-yellow-400/40"
                  : winner
                  ? "from-green-500/30 to-green-600/20 border-green-400/40"
                  : "from-gray-600/30 to-gray-700/20 border-gray-500/40"
              } border-2 flex items-center justify-center shadow-lg`}>
                <Swords className={`w-5 h-5 sm:w-6 sm:h-6 ${
                  isDraw ? "text-yellow-400" : winner ? "text-green-400" : "text-gray-400"
                }`} />
              </div>
            </motion.div>

            <div className="flex items-center gap-2 sm:gap-3">
              <motion.span
                whileHover={{ scale: 1.1 }}
                className={`text-3xl sm:text-5xl font-black ${
                  winner?.id === player1.id
                    ? "text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                    : isDraw
                    ? "text-yellow-300"
                    : "text-gray-400"
                }`}
              >
                {score1}
              </motion.span>
              <span className="text-2xl sm:text-3xl text-gray-500 font-bold">×</span>
              <motion.span
                whileHover={{ scale: 1.1 }}
                className={`text-3xl sm:text-5xl font-black ${
                  winner?.id === player2.id
                    ? "text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                    : isDraw
                    ? "text-yellow-300"
                    : "text-gray-400"
                }`}
              >
                {score2}
              </motion.span>
            </div>

            {!isCompleted && (
              <p className="text-xs text-gray-400 mt-2 font-medium">
                Aguardando resultado
              </p>
            )}
          </div>

          {/* Player 2 */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className={`relative flex flex-col items-center text-center flex-1 ${
              winner?.id === player2.id
                ? "text-green-300"
                : isDraw
                ? "text-yellow-300"
                : "text-gray-300"
            }`}
          >
            <div className="relative">
              <motion.div
                animate={
                  winner?.id === player2.id
                    ? {
                        boxShadow: [
                          "0 0 0px rgba(34,197,94,0)",
                          "0 0 30px rgba(34,197,94,0.8)",
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
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center font-bold text-2xl sm:text-3xl border-[3px] ${
                  winner?.id === player2.id
                    ? "border-green-400 bg-green-500/20"
                    : isDraw
                    ? "border-yellow-400 bg-yellow-500/10"
                    : "border-gray-500 bg-gray-700/30"
                } overflow-hidden shadow-xl`}
              >
                {player2.photo ? (
                  <img 
                    src={player2.photo} 
                    alt={player2.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white drop-shadow-lg">{player2.name.charAt(0).toUpperCase()}</span>
                )}
              </motion.div>
              
              {winner?.id === player2.id && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="absolute -top-1 -right-1 w-7 h-7 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg border-2 border-gray-900"
                >
                  <Trophy className="w-3.5 h-3.5 text-white" />
                </motion.div>
              )}
            </div>

            <p className="mt-2 font-bold truncate w-full text-sm sm:text-base px-1 drop-shadow-md">
              {player2.name}
            </p>
            
            <div className="flex flex-col gap-1 mt-1">
              {(winner?.id === player2.id || isDraw) && (
                <motion.span
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isDraw
                      ? "bg-yellow-500/20 text-yellow-300 border border-yellow-400/40"
                      : "bg-green-500/20 text-green-300 border border-green-400/40"
                  }`}
                >
                  {isDraw ? "Empate" : "Vencedor"}
                </motion.span>
              )}
              
              {isCompleted && (
                <span className="text-[10px] text-gray-400 font-semibold">
                  +{classPoints2} pts classificação
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Detalhes da Partida */}
      {isCompleted && (
        <div className="relative z-10 border-t border-gray-700/50 bg-gray-900/40 backdrop-blur-sm">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800/30 transition-colors"
          >
            <span className="text-xs font-semibold text-gray-300 flex items-center gap-2">
              <Info className="w-3.5 h-3.5" />
              Detalhes da Partida
            </span>
            <motion.div
              animate={{ rotate: showDetails ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </motion.div>
          </button>

          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-3">
                  {/* Grid de Informações */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Erros */}
                    <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                        <span className="text-[10px] text-gray-400 font-semibold uppercase">Erros</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-white font-bold">{result?.player1Errors || 0}</span>
                        <span className="text-gray-500">×</span>
                        <span className="text-white font-bold">{result?.player2Errors || 0}</span>
                      </div>
                    </div>

                    {/* Instrutor */}
                    {instructor && instructor !== "—" && (
                      <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="w-3.5 h-3.5 text-yellow-400" />
                          <span className="text-[10px] text-gray-400 font-semibold uppercase">Instrutor</span>
                        </div>
                        <p className="text-xs text-white font-medium truncate">{instructor}</p>
                      </div>
                    )}
                  </div>

                  {/* Juízes */}
                  {judges.length > 0 && judges[0] !== "" && (
                    <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-[10px] text-gray-400 font-semibold uppercase">
                          Juízes ({judges.length})
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {judges.map((judge, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-500/10 text-blue-300 rounded text-[10px] font-medium border border-blue-400/30"
                          >
                            {judge}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Observações */}
                  {observations && (
                    <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-[10px] text-gray-400 font-semibold uppercase">Observações</span>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">{observations}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
  const [showDetails, setShowDetails] = useState(false);
  
  const isCompleted = match.status === "completed";
  const hasResult = match.resultInfo.hasResult;
  const isDraw = match.resultInfo.isDraw;
  const winner = match.resultInfo.winner;

  const score1 = hasResult ? match.resultInfo.player1FinalScore ?? 0 : 0;
  const score2 = hasResult ? match.resultInfo.player2FinalScore ?? 0 : 0;

  const classPoints1 = match.resultInfo.classificationPoints?.player1 ?? 0;
  const classPoints2 = match.resultInfo.classificationPoints?.player2 ?? 0;

  const matchDuration = match.result?.duration ?? match.resultInfo?.duration ?? null;
  const judgesRaw = match.result?.judges ?? "";
  const instructor = match.result?.instructor ?? "—";
  const observations = match.result?.observations ?? "";

  // Parse judges
  const judges = typeof judgesRaw === 'string' 
    ? judgesRaw.split(',').map(j => j.trim()).filter(Boolean)
    : Array.isArray(judgesRaw) 
    ? judgesRaw 
    : [];

  // Detectar se é a FINAL
  const isFinal = phase === 'final';
  const isThirdPlace = phase === 'third_place';
  const isSemiFinal = phase === 'semi_finals';
  const isQuarterFinals = phase === 'quarter_finals';
  const isRoundOf16 = phase === 'round_of_16';
  
  // Obter nome amigável da fase
  const phaseDisplayName = phaseNames[phase] || phase;

  // Cores baseadas na fase
  const getPhaseColors = () => {
    if (isFinal) {
      return {
        gradient: isDraw 
          ? "from-yellow-600/50 via-yellow-500/30 to-amber-600/40" 
          : winner 
          ? "from-yellow-500/50 via-amber-500/40 to-yellow-600/50" 
          : "from-gray-700/50 to-gray-800/30",
        border: isDraw ? "border-yellow-400/60" : winner ? "border-yellow-400/60" : "border-gray-600/40",
        glow: "from-yellow-500/30 via-amber-500/20 to-yellow-600/30",
        icon: "text-yellow-400"
      };
    } else if (isThirdPlace) {
      return {
        gradient: isDraw 
          ? "from-yellow-600/40 to-yellow-500/20" 
          : winner 
          ? "from-orange-600/40 to-orange-500/20" 
          : "from-gray-700/40 to-gray-800/20",
        border: isDraw ? "border-yellow-400/40" : winner ? "border-orange-400/40" : "border-gray-600/30",
        glow: "from-orange-500/20 to-transparent",
        icon: "text-orange-400"
      };
    } else if (isSemiFinal) {
      return {
        gradient: isDraw 
          ? "from-yellow-600/40 to-yellow-500/20" 
          : winner 
          ? "from-blue-600/40 to-blue-500/20" 
          : "from-gray-700/40 to-gray-800/20",
        border: isDraw ? "border-yellow-400/40" : winner ? "border-blue-400/40" : "border-gray-600/30",
        glow: "from-blue-500/20 to-transparent",
        icon: "text-blue-400"
      };
    } else if (isQuarterFinals) {
      return {
        gradient: isDraw 
          ? "from-yellow-600/30 to-yellow-500/20" 
          : winner 
          ? "from-purple-600/40 to-purple-500/20" 
          : "from-gray-700/40 to-gray-800/20",
        border: isDraw ? "border-yellow-400/40" : winner ? "border-purple-400/40" : "border-gray-600/30",
        glow: "from-purple-500/20 to-transparent",
        icon: "text-purple-400"
      };
    } else if (isRoundOf16) {
      return {
        gradient: isDraw 
          ? "from-yellow-600/30 to-yellow-500/20" 
          : winner 
          ? "from-indigo-600/40 to-indigo-500/20" 
          : "from-gray-700/40 to-gray-800/20",
        border: isDraw ? "border-yellow-400/40" : winner ? "border-indigo-400/40" : "border-gray-600/30",
        glow: "from-indigo-500/20 to-transparent",
        icon: "text-indigo-400"
      };
    } else {
      return {
        gradient: isDraw 
          ? "from-yellow-600/30 to-yellow-500/20" 
          : winner 
          ? "from-green-700/30 to-green-500/10" 
          : "from-gray-700/40 to-gray-800/20",
        border: isDraw ? "border-yellow-400/40" : winner ? "border-green-400/40" : "border-gray-600/30",
        glow: "from-green-500/20 to-transparent",
        icon: "text-green-400"
      };
    }
  };

  const phaseColors = getPhaseColors();

  const getEndReasonLabel = (reason: string) => {
    const reasons: Record<string, string> = {
      'completed': 'Zerou',
      'time': 'Tempo',
      'walkover': 'W.O'
    };
    return reasons[reason] || reason;
  };

  // Função para obter o ícone baseado na fase
  const getPhaseIcon = () => {
    if (isFinal) {
      return (
        <motion.div 
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity }
          }}
          className="w-10 h-10 rounded-xl bg-yellow-500/30 border-2 border-yellow-400/60 flex items-center justify-center shadow-lg"
        >
          <Crown className="w-6 h-6 text-yellow-400" />
        </motion.div>
      );
    } else if (isThirdPlace) {
      return (
        <div className="w-9 h-9 rounded-lg bg-orange-500/20 border-2 border-orange-400/50 flex items-center justify-center">
          <Medal className="w-5 h-5 text-orange-400" />
        </div>
      );
    } else if (isSemiFinal) {
      return (
        <div className="w-9 h-9 rounded-lg bg-blue-500/20 border-2 border-blue-400/50 flex items-center justify-center">
          <Trophy className="w-5 h-5 text-blue-400" />
        </div>
      );
    } else if (isQuarterFinals) {
      return (
        <div className="w-9 h-9 rounded-lg bg-purple-500/20 border-2 border-purple-400/50 flex items-center justify-center">
          <Target className="w-5 h-5 text-purple-400" />
        </div>
      );
    } else if (isRoundOf16) {
      return (
        <div className="w-9 h-9 rounded-lg bg-indigo-500/20 border-2 border-indigo-400/50 flex items-center justify-center">
          <Swords className="w-5 h-5 text-indigo-400" />
        </div>
      );
    } else {
      return (
        <div className="w-9 h-9 rounded-lg bg-green-500/20 border-2 border-green-400/50 flex items-center justify-center">
          <Swords className="w-5 h-5 text-green-400" />
        </div>
      );
    }
  };

  // Função para obter o background do header baseado na fase
  const getHeaderBackground = () => {
    if (isFinal) {
      return 'bg-gradient-to-r from-yellow-600/80 via-amber-500/70 to-yellow-600/80';
    } else if (isThirdPlace) {
      return 'bg-gradient-to-r from-orange-600/60 to-orange-500/50';
    } else if (isSemiFinal) {
      return 'bg-gradient-to-r from-blue-600/60 to-blue-500/50';
    } else if (isQuarterFinals) {
      return 'bg-gradient-to-r from-purple-600/60 to-purple-500/50';
    } else if (isRoundOf16) {
      return 'bg-gradient-to-r from-indigo-600/60 to-indigo-500/50';
    } else {
      return 'bg-gradient-to-r from-gray-900/60 to-gray-800/40';
    }
  };

  // Função para obter a cor do texto do header
  const getHeaderTextColor = () => {
    if (isFinal) {
      return 'text-yellow-100';
    } else if (isThirdPlace) {
      return 'text-orange-100';
    } else if (isSemiFinal) {
      return 'text-blue-100';
    } else if (isQuarterFinals) {
      return 'text-purple-100';
    } else if (isRoundOf16) {
      return 'text-indigo-100';
    } else {
      return 'text-white';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: index * 0.08, 
        type: "spring", 
        stiffness: 90,
        duration: 0.6 
      }}
      className={`relative overflow-hidden rounded-2xl border backdrop-blur-xl shadow-2xl transition-all hover:scale-[1.01] bg-gradient-to-br ${phaseColors.gradient} ${phaseColors.border} ${
        isFinal ? 'ring-2 ring-yellow-400/30 ring-offset-2 ring-offset-gray-900' : ''
      }`}
    >
      {/* Glow Effect Especial para Final */}
      {isFinal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ 
            repeat: Infinity, 
            duration: 3,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-amber-500/30 to-yellow-600/20 blur-3xl"
        />
      )}

      {/* Glow para vencedor */}
      {winner && !isDraw && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isFinal ? 0.5 : 0.3 }}
          className={`absolute inset-0 bg-gradient-to-r ${phaseColors.glow} blur-2xl`}
        />
      )}

      {/* Confete animado para FINAL completa */}
      {isFinal && isCompleted && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -20, x: Math.random() * 100 + '%', opacity: 0 }}
              animate={{ 
                y: '110%', 
                x: Math.random() * 100 + '%',
                opacity: [0, 1, 0],
                rotate: Math.random() * 360
              }}
              transition={{ 
                delay: i * 0.2,
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2
              }}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: ['#fbbf24', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'][i % 5]
              }}
            />
          ))}
        </div>
      )}

      {/* Header Premium */}
      <div className={`relative z-10 ${getHeaderBackground()} backdrop-blur-sm border-b ${
        isFinal ? 'border-yellow-400/50' : 'border-gray-700/50'
      } p-4`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {getPhaseIcon()}
            <div>
              <p className={`text-sm font-bold uppercase tracking-wider ${getHeaderTextColor()}`}>
                {isFinal ? '🏆 GRANDE FINAL' : isThirdPlace ? '🥉 DISPUTA 3º LUGAR' : phaseDisplayName.toUpperCase()}
              </p>
              {isCompleted && matchDuration && (
                <p className="text-[10px] text-gray-300 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" />
                  {matchDuration} min • {getEndReasonLabel(match.result?.endReason || '')}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${
                isCompleted
                  ? isFinal
                    ? "bg-yellow-500/30 text-yellow-100 border-2 border-yellow-400/50"
                    : "bg-green-500/20 text-green-300 border border-green-400/40"
                  : "bg-yellow-500/20 text-yellow-300 animate-pulse border border-yellow-400/30"
              }`}
            >
              {isCompleted ? "✓ Finalizada" : "⏱ Pendente"}
            </span>
            
            {(userRole === "admin" || userRole === "director") && !isCompleted && (
              <button
                onClick={() => onFinishMatch?.(match)}
                className="px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold hover:bg-blue-500/40 transition-all border border-blue-400/40 hover:scale-105"
              >
                Finalizar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Placar */}
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between gap-4 sm:gap-8">
          {/* Player 1 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`relative flex flex-col items-center text-center flex-1 ${
              winner?.id === match.player1.id
                ? "text-green-300"
                : isDraw
                ? "text-yellow-300"
                : "text-gray-300"
            }`}
          >
            <div className="relative">
              <motion.div
                animate={
                  winner?.id === match.player1.id
                    ? {
                        boxShadow: isFinal 
                          ? [
                              "0 0 0px rgba(250,204,21,0)",
                              "0 0 40px rgba(250,204,21,0.9)",
                              "0 0 0px rgba(250,204,21,0)",
                            ]
                          : [
                              "0 0 0px rgba(34,197,94,0)",
                              "0 0 30px rgba(34,197,94,0.8)",
                              "0 0 0px rgba(34,197,94,0)",
                            ],
                      }
                    : {}
                }
                transition={{
                  repeat: Infinity,
                  duration: isFinal ? 1.5 : 2,
                  ease: "easeInOut",
                }}
                className={`relative ${
                  isFinal ? 'w-20 h-20 sm:w-24 sm:h-24' : 'w-16 h-16 sm:w-20 sm:h-20'
                } rounded-full flex items-center justify-center font-bold text-2xl sm:text-3xl border-[3px] ${
                  winner?.id === match.player1.id
                    ? isFinal
                      ? "border-yellow-400 bg-yellow-500/20"
                      : "border-green-400 bg-green-500/20"
                    : isDraw
                    ? "border-yellow-400 bg-yellow-500/10"
                    : "border-gray-500 bg-gray-700/30"
                } overflow-hidden shadow-2xl`}
              >
                {match.player1.photo ? (
                  <img 
                    src={match.player1.photo} 
                    alt={match.player1.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white drop-shadow-lg">{match.player1.name.charAt(0).toUpperCase()}</span>
                )}
              </motion.div>
              
              {winner?.id === match.player1.id && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className={`absolute -top-2 -right-2 ${
                    isFinal ? 'w-9 h-9' : 'w-7 h-7'
                  } bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-xl border-2 border-gray-900`}
                >
                  {isFinal ? (
                    <Crown className="w-5 h-5 text-white" />
                  ) : (
                    <Trophy className="w-4 h-4 text-white" />
                  )}
                </motion.div>
              )}
            </div>

            <p className={`mt-2 font-bold truncate w-full ${
              isFinal ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
            } px-1 drop-shadow-md`}>
              {match.player1.name}
            </p>
            
            <div className="flex flex-col gap-1 mt-1">
              {(winner?.id === match.player1.id || isDraw) && (
                <motion.span
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isDraw
                      ? "bg-yellow-500/20 text-yellow-300 border border-yellow-400/40"
                      : isFinal
                      ? "bg-yellow-500/30 text-yellow-200 border border-yellow-400/50"
                      : "bg-green-500/20 text-green-300 border border-green-400/40"
                  }`}
                >
                  {isDraw ? "Empate" : isFinal ? "CAMPEÃO" : "Vencedor"}
                </motion.span>
              )}
              
              {isCompleted && (
                <span className="text-[10px] text-gray-400 font-semibold">
                  +{classPoints1} pts
                </span>
              )}
            </div>
          </motion.div>

          {/* Score Central */}
          <div className="flex flex-col items-center justify-center flex-shrink-0">
            <motion.div
              animate={{ 
                rotate: [0, 8, -8, 0],
                scale: isFinal ? [1, 1.1, 1] : 1
              }}
              transition={{ 
                rotate: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                scale: isFinal ? { repeat: Infinity, duration: 2 } : {}
              }}
              className="mb-3"
            >
              <div className={`${
                isFinal ? 'w-14 h-14' : 'w-12 h-12'
              } rounded-xl bg-gradient-to-br ${
                isDraw
                  ? "from-yellow-500/40 to-yellow-600/30 border-yellow-400/50"
                  : winner
                  ? isFinal
                    ? "from-yellow-500/40 to-amber-600/30 border-yellow-400/50"
                    : "from-green-500/30 to-green-600/20 border-green-400/40"
                  : "from-gray-600/30 to-gray-700/20 border-gray-500/40"
              } border-2 flex items-center justify-center shadow-xl`}>
                {isFinal ? (
                  <Trophy className={`w-7 h-7 ${
                    isDraw ? "text-yellow-400" : winner ? "text-yellow-300" : "text-gray-400"
                  }`} />
                ) : (
                  <Swords className={`w-6 h-6 ${
                    isDraw ? "text-yellow-400" : winner ? "text-green-400" : "text-gray-400"
                  }`} />
                )}
              </div>
            </motion.div>

            <div className="flex items-center gap-3">
              <motion.span
                whileHover={{ scale: 1.1 }}
                className={`${
                  isFinal ? 'text-4xl sm:text-6xl' : 'text-3xl sm:text-5xl'
                } font-black ${
                  winner?.id === match.player1.id
                    ? isFinal
                      ? "text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]"
                      : "text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                    : isDraw
                    ? "text-yellow-300"
                    : "text-gray-400"
                }`}
              >
                {score1}
              </motion.span>
              <span className={`${
                isFinal ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'
              } text-gray-500 font-bold`}>×</span>
              <motion.span
                whileHover={{ scale: 1.1 }}
                className={`${
                  isFinal ? 'text-4xl sm:text-6xl' : 'text-3xl sm:text-5xl'
                } font-black ${
                  winner?.id === match.player2.id
                    ? isFinal
                      ? "text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]"
                      : "text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                    : isDraw
                    ? "text-yellow-300"
                    : "text-gray-400"
                }`}
              >
                {score2}
              </motion.span>
            </div>

            {!isCompleted && (
              <p className="text-xs text-gray-400 mt-2 font-medium">
                Aguardando resultado
              </p>
            )}
          </div>

          {/* Player 2 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`relative flex flex-col items-center text-center flex-1 ${
              winner?.id === match.player2.id
                ? "text-green-300"
                : isDraw
                ? "text-yellow-300"
                : "text-gray-300"
            }`}
          >
            <div className="relative">
              <motion.div
                animate={
                  winner?.id === match.player2.id
                    ? {
                        boxShadow: isFinal 
                          ? [
                              "0 0 0px rgba(250,204,21,0)",
                              "0 0 40px rgba(250,204,21,0.9)",
                              "0 0 0px rgba(250,204,21,0)",
                            ]
                          : [
                              "0 0 0px rgba(34,197,94,0)",
                              "0 0 30px rgba(34,197,94,0.8)",
                              "0 0 0px rgba(34,197,94,0)",
                            ],
                      }
                    : {}
                }
                transition={{
                  repeat: Infinity,
                  duration: isFinal ? 1.5 : 2,
                  ease: "easeInOut",
                }}
                className={`relative ${
                  isFinal ? 'w-20 h-20 sm:w-24 sm:h-24' : 'w-16 h-16 sm:w-20 sm:h-20'
                } rounded-full flex items-center justify-center font-bold text-2xl sm:text-3xl border-[3px] ${
                  winner?.id === match.player2.id
                    ? isFinal
                      ? "border-yellow-400 bg-yellow-500/20"
                      : "border-green-400 bg-green-500/20"
                    : isDraw
                    ? "border-yellow-400 bg-yellow-500/10"
                    : "border-gray-500 bg-gray-700/30"
                } overflow-hidden shadow-2xl`}
              >
                {match.player2.photo ? (
                  <img 
                    src={match.player2.photo} 
                    alt={match.player2.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white drop-shadow-lg">{match.player2.name.charAt(0).toUpperCase()}</span>
                )}
              </motion.div>
              
              {winner?.id === match.player2.id && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className={`absolute -top-2 -right-2 ${
                    isFinal ? 'w-9 h-9' : 'w-7 h-7'
                  } bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-xl border-2 border-gray-900`}
                >
                  {isFinal ? (
                    <Crown className="w-5 h-5 text-white" />
                  ) : (
                    <Trophy className="w-4 h-4 text-white" />
                  )}
                </motion.div>
              )}
            </div>

            <p className={`mt-2 font-bold truncate w-full ${
              isFinal ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
            } px-1 drop-shadow-md`}>
              {match.player2.name}
            </p>
            
            <div className="flex flex-col gap-1 mt-1">
              {(winner?.id === match.player2.id || isDraw) && (
                <motion.span
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isDraw
                      ? "bg-yellow-500/20 text-yellow-300 border border-yellow-400/40"
                      : isFinal
                      ? "bg-yellow-500/30 text-yellow-200 border border-yellow-400/50"
                      : "bg-green-500/20 text-green-300 border border-green-400/40"
                  }`}
                >
                  {isDraw ? "Empate" : isFinal ? "CAMPEÃO" : "Vencedor"}
                </motion.span>
              )}
              
              {isCompleted && (
                <span className="text-[10px] text-gray-400 font-semibold">
                  +{classPoints2} pts
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Detalhes Expansíveis */}
      {isCompleted && (
        <div className="relative z-10 border-t border-gray-700/50 bg-gray-900/40 backdrop-blur-sm">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800/30 transition-colors"
          >
            <span className="text-xs font-semibold text-gray-300 flex items-center gap-2">
              <Info className="w-3.5 h-3.5" />
              Detalhes da Partida
            </span>
            <motion.div
              animate={{ rotate: showDetails ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </motion.div>
          </button>

          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                        <span className="text-[10px] text-gray-400 font-semibold uppercase">Erros</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-white font-bold">{match.result?.player1Errors || 0}</span>
                        <span className="text-gray-500">×</span>
                        <span className="text-white font-bold">{match.result?.player2Errors || 0}</span>
                      </div>
                    </div>

                    {instructor && instructor !== "—" && (
                      <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="w-3.5 h-3.5 text-yellow-400" />
                          <span className="text-[10px] text-gray-400 font-semibold uppercase">Instrutor</span>
                        </div>
                        <p className="text-xs text-white font-medium truncate">{instructor}</p>
                      </div>
                    )}
                  </div>

                  {judges.length > 0 && judges[0] !== "" && (
                    <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-[10px] text-gray-400 font-semibold uppercase">
                          Juízes ({judges.length})
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {judges.map((judge, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-500/10 text-blue-300 rounded text-[10px] font-medium border border-blue-400/30"
                          >
                            {judge}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {observations && (
                    <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-[10px] text-gray-400 font-semibold uppercase">Observações</span>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">{observations}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};