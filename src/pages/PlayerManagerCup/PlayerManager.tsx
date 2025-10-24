import { useState, useEffect } from 'react';
import DeleteConfirmationModal from './modais/DeleteConfirmationModal';
import PlayerModal from './modais/PlayerModal.tsx';
import { Link } from 'react-router';
import toast from "react-hot-toast";
import { PlayerInput, playersService } from '../../services/TournamentCup/playerService.ts';
import { groupsService } from '../../services/TournamentCup/groupService.ts';

type Player = {
  id: number | string;
  name: string;
  photo?: string;
  birthDate?: string;
  gender?: string;
  groupId?: number | string;
};

type Group = {
  id: number | string;
  name: string;
  description?: string;
};

const PlayersManager = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);
  const [loading, setLoading] = useState(false);

  // Buscar players da API
  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const data = await playersService.listAllPlayers();
      setPlayers(data);
    } catch (error: any) {
      console.error('Erro ao buscar players:', error.message);
      toast.error('Erro ao carregar jogadores');
    } finally {
      setLoading(false);
    }
  };

  // Buscar grupos da API
  const fetchGroups = async () => {
    try {
      const data = await groupsService.listAllGroups();
      setGroups(data);
    } catch (error: any) {
      console.error('Erro ao buscar grupos:', error.message);
      toast.error('Erro ao carregar grupos');
    }
  };

  useEffect(() => {
    fetchPlayers();
    fetchGroups();
  }, []);

  // Criar player
  const handleCreatePlayer = async (playerData: Partial<Player>) => {
    try {
      await playersService.createPlayer(playerData as PlayerInput);
      await fetchPlayers();
      setIsModalOpen(false);
      toast.success('Jogador criado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao criar player:', error.message);
      toast.error(error.message || 'Erro ao criar jogador');
    }
  };

  // Atualizar player
  const handleUpdatePlayer = async (playerData: Partial<Player>) => {
    if (!editingPlayer) return;
    try {
      await playersService.updatePlayer(editingPlayer.id, playerData);
      await fetchPlayers();
      setIsModalOpen(false);
      setEditingPlayer(null);
      toast.success('Jogador atualizado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao atualizar player:', error.message);
      toast.error(error.message || 'Erro ao atualizar jogador');
    }
  };

  // Deletar player
  const handleDeletePlayer = async () => {
    if (!playerToDelete) return;
    try {
      await playersService.deletePlayer(playerToDelete.id);
      await fetchPlayers();
      setIsDeleteModalOpen(false);
      setPlayerToDelete(null);
      toast.success('Jogador deletado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao deletar player:', error.message);
      toast.error(error.message || 'Erro ao deletar jogador');
    }
  };

  // Abrir modal de edição
  const handleEdit = (player: Player) => {
    setEditingPlayer(player);
    setIsModalOpen(true);
  };

  // Abrir modal de confirmação de exclusão
  const handleDelete = (player: Player) => {
    setPlayerToDelete(player);
    setIsDeleteModalOpen(true);
  };

  // Fechar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlayer(null);
  };

  // Formatar data para exibição
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  // Formatar gênero
  const formatGender = (gender?: string) => {
    return gender === 'M' ? 'Masculino' : gender === 'F' ? 'Feminino' : (gender ?? '-');
  };

  // Obter iniciais do gênero
  const getGenderBadge = (gender?: string) => {
    if (gender === 'M') return { label: 'M', color: 'bg-blue-500' };
    if (gender === 'F') return { label: 'F', color: 'bg-pink-500' };
    return { label: '-', color: 'bg-gray-500' };
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - Mobile Optimized */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Link
              to="/cup"
              className="px-4 sm:px-6 py-2 sm:py-2.5 border-2 border-green-500 text-green-500 hover:bg-green-500/10 font-medium rounded-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base"
            >
              ← Voltar
            </Link>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg transition-colors text-sm sm:text-base font-medium shadow-lg"
            >
              + Criar
            </button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white text-center">
            Gerenciar Jogadores
          </h1>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Foto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Data Nasc.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Gênero
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Grupo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {players.map((player) => (
                    <tr key={player.id} className="hover:bg-gray-750 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={player.photo || '/default-avatar.png'}
                          alt={player.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{player.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{formatDate(player.birthDate)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{formatGender(player.gender)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {groups.find(g => g.id === player.groupId)?.name || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(player)}
                          className="text-blue-400 hover:text-blue-300 mr-4 transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(player)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden space-y-4">
              {players.length === 0 ? (
                <div className="bg-gray-800 rounded-lg p-8 text-center">
                  <p className="text-gray-400">Nenhum jogador cadastrado ainda</p>
                </div>
              ) : (
                players.map((player) => {
                  const genderBadge = getGenderBadge(player.gender);
                  const groupName = groups.find(g => g.id === player.groupId)?.name;
                  
                  return (
                    <div
                      key={player.id}
                      className="bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-700 hover:border-gray-600 transition-all"
                    >
                      {/* Card Header com Foto e Info */}
                      <div className="flex items-start gap-4 mb-4">
                        <img
                          src={player.photo || '/default-avatar.png'}
                          alt={player.name}
                          className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover border-2 border-gray-700 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                            {player.name}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {/* Badge de Gênero */}
                            <span className={`${genderBadge.color} px-2 py-1 rounded-full text-xs font-medium text-white`}>
                              {genderBadge.label}
                            </span>
                            {/* Badge de Grupo */}
                            {groupName && (
                              <span className="bg-purple-600 px-2 py-1 rounded-full text-xs font-medium text-white">
                                {groupName}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Informações Adicionais */}
                      <div className="grid grid-cols-2 gap-3 mb-4 bg-gray-750 rounded-lg p-3">
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Data de Nascimento</p>
                          <p className="text-sm text-white font-medium">
                            {formatDate(player.birthDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Gênero</p>
                          <p className="text-sm text-white font-medium">
                            {formatGender(player.gender)}
                          </p>
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(player)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition-colors font-medium text-sm shadow-md"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleDelete(player)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg transition-colors font-medium text-sm shadow-md"
                        >
                          🗑️ Excluir
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* Modal para Criar/Editar */}
        <PlayerModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={editingPlayer ? handleUpdatePlayer : handleCreatePlayer}
          player={editingPlayer ?? undefined}
          groups={groups}
        />

        {/* Modal de Confirmação de Exclusão */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setPlayerToDelete(null);
          }}
          onConfirm={handleDeletePlayer}
          itemName={playerToDelete?.name ?? ''}
          itemType="jogador"
        />
      </div>
    </div>
  );
};

export default PlayersManager;