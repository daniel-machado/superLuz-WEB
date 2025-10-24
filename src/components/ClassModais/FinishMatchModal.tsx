// FinishMatchModal.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal } from '../ui/modal';


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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...formData,
        judges: formData.judges.filter(judge => judge.trim() !== '').join(', ')
      };

      const response = await fetch(
        `http://localhost:5555/api/matches/${match.id}/finish`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao finalizar partida');
      }

      toast.success('Partida finalizada com sucesso!');
      onFinish();
      onClose();
    } catch (error) {
      console.error('Erro ao finalizar partida:', error);
      toast.error('Erro ao finalizar partida');
    } finally {
      setLoading(false);
    }
  };
  
  // Se não há match selecionado, não renderiza o modal
  if (!match) {
    return null;
  } else {
    return (
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-gray-900 rounded-2xl border border-gray-700/50 p-6 w-full"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              Finalizar Partida
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Informações da Partida */}
          <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-white mb-2">Partida</h3>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-400 flex items-center justify-center text-white font-bold text-lg">
                  {match.player1.name.charAt(0).toUpperCase()}
                </div>
                <p className="text-sm text-white mt-1 font-medium">
                  {match.player1.name}
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2 text-gray-400">
                  <span className="text-lg">VS</span>
                </div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-400 flex items-center justify-center text-white font-bold text-lg">
                  {match.player2.name.charAt(0).toUpperCase()}
                </div>
                <p className="text-sm text-white mt-1 font-medium">
                  {match.player2.name}
                </p>
              </div>
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pontuação Final */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Pontos {match.player1.name}
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.player1FinalScore}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    player1FinalScore: parseInt(e.target.value) || 0
                  }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Pontos {match.player2.name}
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.player2FinalScore}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    player2FinalScore: parseInt(e.target.value) || 0
                  }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Erros */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Erros {match.player1.name}
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.player1Errors}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    player1Errors: parseInt(e.target.value) || 0
                  }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Erros {match.player2.name}
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.player2Errors}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    player2Errors: parseInt(e.target.value) || 0
                  }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Duração e Motivo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
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
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Motivo do Término
                </label>
                <select
                  value={formData.endReason}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    endReason: e.target.value as 'time' | 'completed' | 'walkover'
                  }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value="completed">Completo</option>
                  <option value="time">Tempo</option>
                  <option value="walkover">Walkover</option>
                </select>
              </div>
            </div>

            {/* Data e Hora */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Data e Hora da Finalização
              </label>
              <input
                type="datetime-local"
                value={formData.matchDate}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  matchDate: e.target.value
                }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Juízes */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  Juízes ({formData.judges.length}/5)
                </label>
                <button
                  type="button"
                  onClick={handleAddJudge}
                  disabled={formData.judges.length >= 5}
                  className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-300 rounded-lg text-sm hover:bg-green-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar
                </button>
              </div>
              <div className="space-y-2">
                {formData.judges.map((judge, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={judge}
                      onChange={(e) => handleJudgeChange(index, e.target.value)}
                      placeholder={`Nome do juíz ${index + 1}`}
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                    {formData.judges.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveJudge(index)}
                        className="px-3 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
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
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Instrutor
              </label>
              <input
                type="text"
                value={formData.instructor}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  instructor: e.target.value
                }))}
                placeholder="Nome do instrutor"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Observações */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Observações
              </label>
              <textarea
                value={formData.observations}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  observations: e.target.value
                }))}
                placeholder="Observações sobre a partida..."
                rows={3}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Finalizando...' : 'Finalizar Partida'}
              </button>
            </div>
          </form>
        </motion.div>
      </Modal>
    );
  }
};