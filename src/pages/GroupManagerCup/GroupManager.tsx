import { useState, useEffect } from 'react';
import GroupModal from './modais/GroupModal';
import DeleteConfirmationModal from './modais/DeleteConfirmationModal';
import { Link } from 'react-router';
import { groupsService } from '../../services/TournamentCup/groupService';

type ID = string | number;

interface Group {
  id: ID;
  name: string;
  description?: string;
}

interface GroupInput {
  name: string;
  description?: string;
}

const GroupsManager = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [editingGroup, setEditingGroup] = useState<Group | undefined>(undefined);
  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Buscar grupos da API
  const fetchGroups = async () => {
    try {
      setLoading(true);
      const data = await groupsService.listAllGroups();
      setGroups(data);
    } catch (error: any) {
      console.error('Erro ao buscar grupos:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // Criar grupo
  const handleCreateGroup = async (groupData: GroupInput) => {
    try {
      await groupsService.createGroup(groupData);
      fetchGroups();
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('Erro ao criar grupo:', error.message);
    }
  };

  // Atualizar grupo
  const handleUpdateGroup = async (groupData: GroupInput) => {
    if (!editingGroup) return;
    try {
      await groupsService.updateGroup(String(editingGroup.id), groupData);
      fetchGroups();
      setIsModalOpen(false);
      setEditingGroup(undefined);
    } catch (error: any) {
      console.error('Erro ao atualizar grupo:', error.message);
    }
  };

  // Deletar grupo
  const handleDeleteGroup = async () => {
    if (!groupToDelete) return;
    try {
      await groupsService.deleteGroup(String(groupToDelete.id));
      fetchGroups();
      setIsDeleteModalOpen(false);
      setGroupToDelete(null);
    } catch (error: any) {
      console.error('Erro ao deletar grupo:', error.message);
    }
  };

  // Abrir modal de edição
  const handleEdit = (group: Group) => {
    setEditingGroup(group);
    setIsModalOpen(true);
  };

  // Abrir modal de confirmação de exclusão
  const handleDelete = (group: Group) => {
    setGroupToDelete(group);
    setIsDeleteModalOpen(true);
  };

  // Fechar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGroup(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
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
            Gerenciar Grupos
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
            <div className="hidden md:block bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {groups.map((group) => (
                    <tr key={group.id} className="hover:bg-gray-750 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{group.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-300">{group.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(group)}
                          className="text-blue-400 hover:text-blue-300 mr-4 transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(group)}
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

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {groups.length === 0 ? (
                <div className="bg-gray-800 rounded-lg p-8 text-center">
                  <p className="text-gray-400">Nenhum grupo cadastrado ainda</p>
                </div>
              ) : (
                groups.map((group) => (
                  <div
                    key={group.id}
                    className="bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-700 hover:border-gray-600 transition-all"
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {group.name}
                        </h3>
                        {group.description && (
                          <p className="text-sm text-gray-400 line-clamp-2">
                            {group.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="flex gap-2 pt-3 border-t border-gray-700">
                      <button
                        onClick={() => handleEdit(group)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition-colors font-medium text-sm shadow-md"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDelete(group)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg transition-colors font-medium text-sm shadow-md"
                      >
                        🗑️ Excluir
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* Modal para Criar/Editar */}
        <GroupModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={editingGroup ? handleUpdateGroup : handleCreateGroup}
          group={editingGroup}
        />

        {/* Modal de Confirmação de Exclusão */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setGroupToDelete(null);
          }}
          onConfirm={handleDeleteGroup}
          groupName={groupToDelete?.name ?? ''}
        />
      </div>
    </div>
  );
};

export default GroupsManager;