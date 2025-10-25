// FinishMatchModal.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Trash2, Swords, Target, AlertCircle, Clock, Calendar, Users, Star, FileText, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal } from '../ui/modal';
import { tournamentService } from '../../services/TournamentCup/tournamentService';


interface FinishMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFinish: () => void;
  match: any | null; // Agora explicitamente pode ser null
}
interface FinishMatchData {
  player1FinalScore: number;
  player2FinalScore: number;
  player1Errors: number;
  player2Errors: number;
  duration: number;
  endReason: 'time' | 'completed' | 'walkover';
  judges: string[];
  instructor: string;
  matchDate: string;
  observations: string;
}

export const FinishMatchModal = ({ isOpen, onClose, onFinish, match }: FinishMatchModalProps) => {
  const [formData, setFormData] = useState<FinishMatchData>({
    player1FinalScore: 0,
    player2FinalScore: 0,
    player1Errors: 0,
    player2Errors: 0,
    duration: 0,
    endReason: 'completed',
    judges: [''],
    instructor: '',
    matchDate: new Date().toISOString().slice(0, 16),
    observations: ''
  });

  const [loading, setLoading] = useState(false);

  const handleAddJudge = () => {
    if (formData.judges.length < 5) {
      setFormData(prev => ({
        ...prev,
        judges: [...prev.judges, '']
      }));
    }
  };

  const handleRemoveJudge = (index: number) => {
    if (formData.judges.length > 1) {
      setFormData(prev => ({
        ...prev,
        judges: prev.judges.filter((_, i) => i !== index)
      }));
    }
  };

  const handleJudgeChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      judges: prev.judges.map((judge, i) => i === index ? value : judge)
    }));
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     const token = localStorage.getItem('token');
  //     const payload = {
  //       ...formData,
  //       judges: formData.judges.filter(judge => judge.trim() !== '').join(', ')
  //     };

  //     const response = await fetch(
  //       `http://localhost:5555/api/matches/${match.id}/finish`,
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${token}`
  //         },
  //         body: JSON.stringify(payload)
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error('Erro ao finalizar partida');
  //     }

  //     toast.success('Partida finalizada com sucesso!');
  //     onFinish();
  //     onClose();
  //   } catch (error) {
  //     console.error('Erro ao finalizar partida:', error);
  //     toast.error('Erro ao finalizar partida');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const p1 = formData.player1FinalScore;
    const p2 = formData.player2FinalScore;

    let winnerId = '';
    let winnerScore = 0;
    let loserScore = 0;

    if (p1 > p2) {
      winnerId = match.player1?.id ?? '';
      winnerScore = p1;
      loserScore = p2;
    } else if (p2 > p1) {
      winnerId = match.player2?.id ?? '';
      winnerScore = p2;
      loserScore = p1;
    } else {
      // Empate — não há vencedor claro. Envia campos vazios/iguais.
      winnerId = '';
      winnerScore = p1;
      loserScore = p2;
    }

    const payload = {
      winnerId,
      winnerScore,
      loserScore,
      judges: formData.judges.filter(judge => judge.trim() !== '').join(', '),
      // incluir campos adicionais para o backend se necessário
      player1FinalScore: formData.player1FinalScore,
      player2FinalScore: formData.player2FinalScore,
      player1Errors: formData.player1Errors,
      player2Errors: formData.player2Errors,
      duration: formData.duration,
      endReason: formData.endReason,
      instructor: formData.instructor,
      matchDate: formData.matchDate,
      observations: formData.observations
    };

    // Usando o service em vez do fetch direto
    // cast to any because service signature declares a minimal required payload
    await tournamentService.finishMatch(match.id, payload as any);

    toast.success('Partida finalizada com sucesso!');
    onFinish();
    onClose();
  } catch (error) {
    console.error('Erro ao finalizar partida:', error);
    toast.error(error instanceof Error ? error.message : 'Erro ao finalizar partida');
  } finally {
    setLoading(false);
  }
};
  
  // Se não há match selecionado, não renderiza o modal

  if (!match) {
    return null;
  } else {
    return (
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="no-scrollbar bg-gray-900 rounded-2xl border border-gray-700/50 w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header - Fixed */}
          <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-700/50 flex-shrink-0">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Finalizar Partida
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Preencha os dados da partida finalizada
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="no-scrollbar overflow-y-auto flex-1 p-4 sm:p-6">
            {/* Informações da Partida - Card dos Jogadores */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-800/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 mb-6 border border-gray-700/50">
              <h3 className="font-semibold text-white mb-4 text-sm sm:text-base flex items-center gap-2">
                <Swords className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                Confronto
              </h3>
              <div className="flex items-center justify-between gap-4">
                {/* Player 1 */}
                <div className="flex flex-col items-center flex-1">
                  <div className="relative">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-blue-400 flex items-center justify-center shadow-lg overflow-hidden">
                      {match.player1.photo ? (
                        <img 
                          src={match.player1.photo} 
                          alt={match.player1.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold text-xl sm:text-2xl">
                          {match.player1.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 bg-blue-500 rounded-full flex items-center justify-center border-2 border-gray-900">
                      <span className="text-white text-xs font-bold">1</span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-white mt-2 font-medium text-center break-words max-w-[120px]">
                    {match.player1.name}
                  </p>
                </div>

                {/* VS Divider */}
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-700/50 border border-gray-600 flex items-center justify-center">
                    <span className="text-gray-400 font-bold text-sm sm:text-base">VS</span>
                  </div>
                  <div className="hidden sm:block h-8 w-px bg-gray-700"></div>
                </div>

                {/* Player 2 */}
                <div className="flex flex-col items-center flex-1">
                  <div className="relative">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-red-500 to-red-600 border-2 border-red-400 flex items-center justify-center shadow-lg overflow-hidden">
                      {match.player2.photo ? (
                        <img 
                          src={match.player2.photo} 
                          alt={match.player2.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold text-xl sm:text-2xl">
                          {match.player2.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 bg-red-500 rounded-full flex items-center justify-center border-2 border-gray-900">
                      <span className="text-white text-xs font-bold">2</span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-white mt-2 font-medium text-center break-words max-w-[120px]">
                    {match.player2.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {/* Seção: Pontuação */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-400" />
                  Pontuação Final
                </h4>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-2">
                      Jogador 1
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={formData.player1FinalScore}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          player1FinalScore: parseInt(e.target.value) || 0
                        }))}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm sm:text-base transition-colors"
                        required
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500"></div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-2">
                      Jogador 2
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={formData.player2FinalScore}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          player2FinalScore: parseInt(e.target.value) || 0
                        }))}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500 text-sm sm:text-base transition-colors"
                        required
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção: Erros */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  Erros Cometidos
                </h4>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-2">
                      Jogador 1
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.player1Errors}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        player1Errors: parseInt(e.target.value) || 0
                      }))}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm sm:text-base transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-2">
                      Jogador 2
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.player2Errors}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        player2Errors: parseInt(e.target.value) || 0
                      }))}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500 text-sm sm:text-base transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Seção: Detalhes da Partida */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  Detalhes da Partida
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-2">
                      Duração (minutos)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        duration: parseInt(e.target.value) || 0
                      }))}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500 text-sm sm:text-base transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-2">
                      Motivo do Término
                    </label>
                    <select
                      value={formData.endReason}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        endReason: e.target.value as 'time' | 'completed' | 'walkover'
                      }))}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500 text-sm sm:text-base transition-colors"
                      required
                    >
                      <option value="completed">Completo (Zerou)</option>
                      <option value="time">Tempo Esgotado</option>
                      <option value="walkover">W.O (Desistência)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Data e Hora */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  Data e Hora da Finalização
                </label>
                <input
                  type="datetime-local"
                  value={formData.matchDate}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    matchDate: e.target.value
                  }))}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 text-sm sm:text-base transition-colors"
                  required
                />
              </div>

              {/* Juízes */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="block text-xs sm:text-sm font-medium text-gray-400 flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    Juízes ({formData.judges.length}/5)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddJudge}
                    disabled={formData.judges.length >= 5}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 text-green-300 rounded-lg text-xs sm:text-sm hover:bg-green-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Adicionar</span>
                    <span className="sm:hidden">+</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.judges.map((judge, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={judge}
                          onChange={(e) => handleJudgeChange(index, e.target.value)}
                          placeholder={`Nome do juíz ${index + 1}`}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-8 sm:pl-10 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm sm:text-base transition-colors"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs sm:text-sm font-medium">
                          {index + 1}
                        </div>
                      </div>
                      {formData.judges.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveJudge(index)}
                          className="px-3 py-2.5 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Instrutor */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  Instrutor Responsável
                </label>
                <input
                  type="text"
                  value={formData.instructor}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    instructor: e.target.value
                  }))}
                  placeholder="Digite o nome do instrutor"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500 text-sm sm:text-base transition-colors"
                  required
                />
              </div>

              {/* Observações */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  Observações
                  <span className="text-xs text-gray-500">(opcional)</span>
                </label>
                <textarea
                  value={formData.observations}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    observations: e.target.value
                  }))}
                  placeholder="Adicione observações sobre a partida, destaques, acontecimentos relevantes..."
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500 resize-none text-sm sm:text-base transition-colors"
                />
              </div>
            </form>
          </div>

          {/* Footer - Fixed */}
          <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 border-t border-gray-700/50 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 sm:px-6 py-3 border-2 border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm sm:text-base"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
              className="flex-1 px-4 sm:px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-semibold text-sm sm:text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Finalizando...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Finalizar Partida</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </Modal>
    );
  }
};