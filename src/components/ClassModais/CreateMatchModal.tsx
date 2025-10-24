// components/CreateMatchModal.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Swords } from 'lucide-react';
import { tournamentService } from '../../services/TournamentCup/tournamentService';

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

interface GroupStanding {
  groupId: string;
  groupName: string;
  groupDescription: string;
  standings: Array<{
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
  }>;
}

interface CreateMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  phase: string;
  groupId?: string;
  groupName?: string;
  availablePlayers?: Player[];
  groupStandings?: GroupStanding[];
  matches?: any[];
}

const phaseRounds: Record<string, string> = {
  group: '1',
  round_of_16: '7',
  quarter_finals: '8',
  semi_finals: '9',
  final: '10',
  third_place: '11'
};

const phaseNames: Record<string, string> = {
  group: 'Fase de Grupos',
  round_of_16: 'Oitavas de Final',
  quarter_finals: 'Quartas de Final',
  semi_finals: 'Semifinais',
  final: 'Final',
  third_place: 'Disputa 3º Lugar'
};

export const CreateMatchModal = ({
  isOpen,
  onClose,
  onSuccess,
  phase,
  groupId,
  groupName,
  //availablePlayers = [],
  groupStandings = [],
  matches = []
}: CreateMatchModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    player1Id: '',
    player2Id: '',
    round: phaseRounds[phase] || '1',
    description: '',
    groupId: groupId || ''
  });

  const [players, setPlayers] = useState<Player[]>([]);

  // Reset form quando o modal abre/fecha ou a fase muda
  useEffect(() => {
    if (isOpen) {
      setFormData({
        player1Id: '',
        player2Id: '',
        round: phaseRounds[phase] || '1',
        description: '',
        groupId: groupId || ''
      });
      loadAvailablePlayers();
    }
  }, [isOpen, phase, groupId]);

  const loadAvailablePlayers = () => {
    if (phase === 'group' && groupId) {
      // Para fase de grupos, usar jogadores da classificação do grupo
      const group = groupStandings.find(g => g.groupId === groupId);
      if (group) {
        // Converter standings em players
        const groupPlayers = group.standings.map(standing => ({
          id: standing.playerId,
          name: standing.playerName,
          photo: standing.playerPhoto,
          birthDate: '',
          gender: '',
          groupId: standing.groupId,
          createdAt: '',
          updatedAt: ''
        }));
        setPlayers(groupPlayers);
      }
    } else {
      // Para fases eliminatórias, usar a lógica baseada em partidas anteriores
      const availablePlayers = getEliminationPhasePlayers(phase);
      setPlayers(availablePlayers);
    }
  };

  const getEliminationPhasePlayers = (currentPhase: string): Player[] => {
    const previousPhaseMap: Record<string, string> = {
      round_of_16: 'group',
      quarter_finals: 'round_of_16',
      semi_finals: 'quarter_finals',
      final: 'semi_finals',
      third_place: 'semi_finals'
    };

    const previousPhase = previousPhaseMap[currentPhase];
    if (!previousPhase) return [];

    if (currentPhase === 'round_of_16') {
      // Para oitavas, pegar os melhores de cada grupo da classificação
      const topPlayers: Player[] = [];
      groupStandings.forEach(group => {
        const sortedStandings = [...group.standings].sort((a, b) => 
          b.classificationPoints - a.classificationPoints || 
          b.goalDifference - a.goalDifference ||
          b.goalsFor - a.goalsFor
        );
        
        // Pegar os 2 primeiros de cada grupo
        const topGroupPlayers = sortedStandings.slice(0, 2);
        topGroupPlayers.forEach(standing => {
          topPlayers.push({
            id: standing.playerId,
            name: standing.playerName,
            photo: standing.playerPhoto,
            birthDate: '',
            gender: '',
            groupId: standing.groupId,
            createdAt: '',
            updatedAt: ''
          });
        });
      });
      
      return topPlayers;
    } else if (currentPhase === 'third_place') {
      // Para disputa de 3º lugar, pegar os perdedores das semifinais
      const semiFinalMatches = matches.filter(m => m.phase === 'semi_finals' && m.status === 'completed');
      const losers: Player[] = [];
      
      semiFinalMatches.forEach(match => {
        if (match.resultInfo.winner) {
          // O perdedor é o jogador que NÃO é o vencedor
          const loser = match.player1.id === match.resultInfo.winner.id ? match.player2 : match.player1;
          if (loser) {
            losers.push(loser);
          }
        } else if (match.resultInfo.isDraw) {
          // Em caso de empate, ambos são considerados
          if (match.player1) losers.push(match.player1);
          if (match.player2) losers.push(match.player2);
        }
      });
      
      return losers;
    } else {
      // Para outras fases, pegar vencedores das partidas da fase anterior
      const winners: Player[] = [];
      const previousMatches = matches.filter(m => m.phase === previousPhase && m.status === 'completed');
      
      previousMatches.forEach(match => {
        if (match.resultInfo.winner) {
          winners.push(match.resultInfo.winner);
        } else if (match.resultInfo.isDraw) {
          // Em caso de empate, adicionar ambos os jogadores
          if (match.player1) winners.push(match.player1);
          if (match.player2) winners.push(match.player2);
        }
      });
      
      return winners;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!formData.player1Id || !formData.player2Id || formData.player1Id === formData.player2Id) {
    alert('Selecione dois jogadores diferentes');
    return;
  }

  setLoading(true);
  try {
    // Criar payload base
    const payload: any = {
      player1Id: formData.player1Id,
      player2Id: formData.player2Id,
      round: formData.round,
      phase: phase,
      description: formData.description
    };

    // Só adicionar groupId se for fase de grupos
    if (phase === 'group' && formData.groupId) {
      payload.groupId = formData.groupId;
    }

    await tournamentService.createMatch(payload);
    onSuccess();
    onClose();
  } catch (error: any) {
    console.error('Erro ao criar confronto:', error);
    alert('Erro ao criar confronto: ' + error.message);
  } finally {
    setLoading(false);
  }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Atualizar descrição automaticamente quando selecionar jogadores
    if ((field === 'player1Id' || field === 'player2Id') && formData.player1Id && formData.player2Id) {
      const player1 = players.find(p => p.id === (field === 'player1Id' ? value : formData.player1Id));
      const player2 = players.find(p => p.id === (field === 'player2Id' ? value : formData.player2Id));
      
      if (player1 && player2) {
        setFormData(prev => ({
          ...prev,
          description: `${player1.name} X ${player2.name}`
        }));
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                  <Swords className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Criar Confronto
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {phaseNames[phase]} {groupName ? `- Grupo ${groupName}` : ''}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Rodada (apenas para fase de grupos) */}
              {phase === 'group' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rodada
                  </label>
                  <select
                    value={formData.round}
                    onChange={(e) => handleInputChange('round', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    {[1, 2, 3, 4, 5, 6].map(round => (
                      <option key={round} value={round.toString()}>
                        Rodada {round}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Jogador 1 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Jogador 1
                </label>
                <select
                  value={formData.player1Id}
                  onChange={(e) => handleInputChange('player1Id', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Selecione o jogador 1</option>
                  {players.map(player => (
                    <option key={player.id} value={player.id}>
                      {player.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Jogador 2 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Jogador 2
                </label>
                <select
                  value={formData.player2Id}
                  onChange={(e) => handleInputChange('player2Id', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Selecione o jogador 2</option>
                  {players
                    .filter(player => player.id !== formData.player1Id)
                    .map(player => (
                      <option key={player.id} value={player.id}>
                        {player.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descrição
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Ex: Myllena X Enzo"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Criando...' : 'Criar Confronto'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};












// // components/CreateMatchModal.tsx
// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { X, Swords } from 'lucide-react';
// import { tournamentService } from '../../services/TournamentCup/tournamentService';

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

// interface GroupStanding {
//   groupId: string;
//   groupName: string;
//   groupDescription: string;
//   standings: Array<{
//     playerId: string;
//     playerName: string;
//     playerPhoto: string;
//     groupId: string;
//     groupName: string;
//     classificationPoints: number;
//     totalMatchPoints: number;
//     wins: number;
//     losses: number;
//     draws: number;
//     totalErrors: number;
//     matchesPlayed: number;
//     goalsFor: number;
//     goalsAgainst: number;
//     goalDifference: number;
//   }>;
// }

// interface CreateMatchModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess: () => void;
//   phase: string;
//   groupId?: string;
//   groupName?: string;
//   availablePlayers?: Player[];
//   groupStandings?: GroupStanding[];
//   matches?: any[];
// }

// const phaseRounds: Record<string, string> = {
//   group: '1',
//   round_of_16: '7',
//   quarter_finals: '8',
//   semi_finals: '9',
//   final: '10',
//   third_place: '11'
// };

// const phaseNames: Record<string, string> = {
//   group: 'Fase de Grupos',
//   round_of_16: 'Oitavas de Final',
//   quarter_finals: 'Quartas de Final',
//   semi_finals: 'Semifinais',
//   final: 'Final',
//   third_place: 'Disputa 3º Lugar'
// };

// export const CreateMatchModal = ({
//   isOpen,
//   onClose,
//   onSuccess,
//   phase,
//   groupId,
//   groupName,
//   availablePlayers = [],
//   groupStandings = [],
//   matches = []
// }: CreateMatchModalProps) => {
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     player1Id: '',
//     player2Id: '',
//     round: phaseRounds[phase] || '1',
//     description: '',
//     groupId: groupId || ''
//   });

//   const [players, setPlayers] = useState<Player[]>([]);

//   // Reset form quando o modal abre/fecha ou a fase muda
//   useEffect(() => {
//     if (isOpen) {
//       setFormData({
//         player1Id: '',
//         player2Id: '',
//         round: phaseRounds[phase] || '1',
//         description: '',
//         groupId: groupId || ''
//       });
//       loadAvailablePlayers();
//     }
//   }, [isOpen, phase, groupId]);

//   const loadAvailablePlayers = async () => {
//     try {
//       if (phase === 'group' && groupId) {
//         // Para fase de grupos, usar jogadores do grupo específico
//         const group = groupStandings.find(g => g.groupId === groupId);
//         if (group) {
//           const groupPlayers = await tournamentService.getPlayersByGroup(groupId);
//           setPlayers(groupPlayers);
//         }
//       } else {
//         // Para fases eliminatórias, determinar jogadores disponíveis baseado na fase anterior
//         const availablePlayers = await getEliminationPhasePlayers(phase);
//         setPlayers(availablePlayers);
//       }
//     } catch (error) {
//       console.error('Erro ao carregar jogadores:', error);
//       setPlayers(availablePlayers);
//     }
//   };

//   const getEliminationPhasePlayers = async (currentPhase: string): Promise<Player[]> => {
//     const previousPhaseMap: Record<string, string> = {
//       round_of_16: 'group',
//       quarter_finals: 'round_of_16',
//       semi_finals: 'quarter_finals',
//       final: 'semi_finals',
//       third_place: 'semi_finals'
//     };

//     const previousPhase = previousPhaseMap[currentPhase];
//     if (!previousPhase) return [];

//     try {
//       // Buscar partidas da fase anterior
//       const previousMatches = matches.filter(m => m.phase === previousPhase);
      
//       if (currentPhase === 'round_of_16') {
//         // Para oitavas, pegar os melhores de cada grupo
//         const topPlayers: Player[] = [];
//         groupStandings.forEach(group => {
//           const sortedStandings = [...group.standings].sort((a, b) => 
//             b.classificationPoints - a.classificationPoints || 
//             b.goalDifference - a.goalDifference ||
//             b.goalsFor - a.goalsFor
//           );
          
//           // Pegar os 2 primeiros de cada grupo (ou menos se não houver)
//           const topGroupPlayers = sortedStandings.slice(0, 2);
//           topGroupPlayers.forEach(standing => {
//             // Encontrar o objeto Player completo
//             const player = availablePlayers.find(p => p.id === standing.playerId);
//             if (player) {
//               topPlayers.push(player);
//             }
//           });
//         });
        
//         return topPlayers;
//       } else {
//         // Para outras fases, pegar vencedores das partidas da fase anterior
//         const winners: Player[] = [];
//         previousMatches.forEach(match => {
//           if (match.status === 'completed' && match.resultInfo.winner) {
//             winners.push(match.resultInfo.winner);
//           } else if (match.status === 'completed' && match.resultInfo.isDraw) {
//             // Em caso de empate, adicionar ambos os jogadores
//             winners.push(match.player1, match.player2);
//           }
//         });
        
//         return winners;
//       }
//     } catch (error) {
//       console.error('Erro ao determinar jogadores:', error);
//       return [];
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!formData.player1Id || !formData.player2Id || formData.player1Id === formData.player2Id) {
//       alert('Selecione dois jogadores diferentes');
//       return;
//     }

//     setLoading(true);
//     try {
//       const payload = {
//         ...formData,
//         phase: phase
//       };

//       await tournamentService.createMatch(payload);
//       onSuccess();
//       onClose();
//     } catch (error: any) {
//       console.error('Erro ao criar confronto:', error);
//       alert('Erro ao criar confronto: ' + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (field: string, value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));

//     // Atualizar descrição automaticamente quando selecionar jogadores
//     if ((field === 'player1Id' || field === 'player2Id') && formData.player1Id && formData.player2Id) {
//       const player1 = players.find(p => p.id === (field === 'player1Id' ? value : formData.player1Id));
//       const player2 = players.find(p => p.id === (field === 'player2Id' ? value : formData.player2Id));
      
//       if (player1 && player2) {
//         setFormData(prev => ({
//           ...prev,
//           description: `${player1.name} X ${player2.name}`
//         }));
//       }
//     }
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.9 }}
//             className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-md"
//           >
//             {/* Header */}
//             <div className="flex items-center justify-between p-6 border-b border-gray-700">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
//                   <Swords className="w-5 h-5 text-white" />
//                 </div>
//                 <div>
//                   <h2 className="text-xl font-bold text-white">
//                     Criar Confronto
//                   </h2>
//                   <p className="text-gray-400 text-sm">
//                     {phaseNames[phase]} {groupName ? `- Grupo ${groupName}` : ''}
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={onClose}
//                 className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             {/* Form */}
//             <form onSubmit={handleSubmit} className="p-6 space-y-4">
//               {/* Rodada (apenas para fase de grupos) */}
//               {phase === 'group' && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">
//                     Rodada
//                   </label>
//                   <select
//                     value={formData.round}
//                     onChange={(e) => handleInputChange('round', e.target.value)}
//                     className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
//                     required
//                   >
//                     {[1, 2, 3, 4, 5, 6].map(round => (
//                       <option key={round} value={round.toString()}>
//                         Rodada {round}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               )}

//               {/* Jogador 1 */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-2">
//                   Jogador 1
//                 </label>
//                 <select
//                   value={formData.player1Id}
//                   onChange={(e) => handleInputChange('player1Id', e.target.value)}
//                   className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   required
//                 >
//                   <option value="">Selecione o jogador 1</option>
//                   {players.map(player => (
//                     <option key={player.id} value={player.id}>
//                       {player.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Jogador 2 */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-2">
//                   Jogador 2
//                 </label>
//                 <select
//                   value={formData.player2Id}
//                   onChange={(e) => handleInputChange('player2Id', e.target.value)}
//                   className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   required
//                 >
//                   <option value="">Selecione o jogador 2</option>
//                   {players
//                     .filter(player => player.id !== formData.player1Id)
//                     .map(player => (
//                       <option key={player.id} value={player.id}>
//                         {player.name}
//                       </option>
//                     ))}
//                 </select>
//               </div>

//               {/* Descrição */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-2">
//                   Descrição
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.description}
//                   onChange={(e) => handleInputChange('description', e.target.value)}
//                   placeholder="Ex: Myllena X Enzo"
//                   className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   required
//                 />
//               </div>

//               {/* Actions */}
//               <div className="flex gap-3 pt-4">
//                 <button
//                   type="button"
//                   onClick={onClose}
//                   className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
//                 >
//                   Cancelar
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {loading ? 'Criando...' : 'Criar Confronto'}
//                 </button>
//               </div>
//             </form>
//           </motion.div>
//         </div>
//       )}
//     </AnimatePresence>
//   );
// };