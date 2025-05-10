import { useEffect, useState } from "react";
import { toast } from 'react-hot-toast';
import {
  Loader2,
  Trash2,
  Edit,
  Calendar,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Filter,
  Award,
  Clock,
  User,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { individualEvaluationService } from "../../services/individualEvaluationService";
import { useAuth } from "../../context/AuthContext";

// Components
import Button from './components/Button'
//import Card from './components/Card'
import Badge from './components/Badge'
import UserAvatar from './components/UserAvatar'
import CreateIndividualEvaluationModal from './components/CreateIndividualEvaluationModal';
import EditIndividualEvaluationModal from './components/EditIndividualEvaluationModal';
import ConfirmDeleteIndividualEvaluationModal from './components/ConfirmDeleteIndividualEvaluationModal';


interface IndividualEvaluation {
  id: string;
  userId: string;
  counselorId: string | null;
  evaluationDate: string | null;
  totalScore: number;
  status: string;
  week: number;
  createdAt: string;
  updatedAt: string;
  usersEvaluation: {
    id: string;
    name: string;
    photoUrl: string | null;
  };
}

interface IndividualEvaluationInputCreate {
  userId: string;
  week: string;
}

export default function IndividualEvaluations() {
  const [evaluations, setEvaluations] = useState<IndividualEvaluation[]>([]);
  const [filteredEvaluations, setFilteredEvaluations] = useState<IndividualEvaluation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<IndividualEvaluation | null>(null);
  const [expandedUsers, setExpandedUsers] = useState<Record<string, boolean>>({});
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterWeek, setFilterWeek] = useState<number | null>(null);
  const [filterUser, setFilterUser] = useState<string | null>(null);
  const [sortAscending, setSortAscending] = useState(true);

  const { userRole } = useAuth();

  const fetchEvaluations = async () => {
    setIsLoading(true);
    try {
      const data = await individualEvaluationService.ListAllEvaluation();
      setEvaluations(data.evaluations || data);
      setFilteredEvaluations(data.evaluations || data);
    } catch (err) {
      toast.error("Erro ao carregar avaliações individuais", {
        position: 'bottom-right',
        icon: '❌',
        style: {
          backgroundColor: '#1F2937',
          color: '#F9FAFB',
          border: '1px solid #374151',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvaluations();
  }, []);

  useEffect(() => {
    let filtered = [...evaluations];
    
    if (filterStatus) {
      filtered = filtered.filter(evaluation => evaluation.status === filterStatus);
    }
    
    if (filterWeek !== null) {
      filtered = filtered.filter(evaluation => evaluation.week === filterWeek);
    }
    
    if (filterUser) {
      filtered = filtered.filter(evaluation => evaluation.userId === filterUser);
    }
    
    // Sort by week
    filtered.sort((a, b) => {
      if (sortAscending) {
        return a.week - b.week;
      } else {
        return b.week - a.week;
      }
    });
    
    setFilteredEvaluations(filtered);
  }, [evaluations, filterStatus, filterWeek, filterUser, sortAscending]);

  const toggleUserExpansion = (userId: string) => {
    setExpandedUsers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleOpenCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (evaluation: IndividualEvaluation) => {
    setSelectedEvaluation(evaluation);
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (evaluation: IndividualEvaluation, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEvaluation(evaluation);
    setIsDeleteModalOpen(true);
  };

  const handleCreate = async (evaluationData: IndividualEvaluationInputCreate) => {
    try {
      const payload = {
        userId: evaluationData.userId,
        week: Number(evaluationData.week),
      };
      
      await individualEvaluationService.createEvaluation(payload);
      toast.success('Avaliação individual criada com sucesso!', {
        position: 'bottom-right',
        icon: '✅',
        style: {
          backgroundColor: '#1F2937',
          color: '#F9FAFB',
          border: '1px solid #374151',
        },
      });
      setIsCreateModalOpen(false);
      await fetchEvaluations();
    } catch (err) {
      toast.error('Erro ao criar avaliação individual.', {
        position: 'bottom-right',
        icon: '❌',
        style: {
          backgroundColor: '#1F2937',
          color: '#F9FAFB',
          border: '1px solid #374151',
        },
      });
    }
  };

  const handleEditEvaluation = async (data: any) => {
    if (selectedEvaluation) {
      try {
        const updatedData = {
          ...data,
          status: data.status || selectedEvaluation.status,
        };
        
        await individualEvaluationService.updateEvaluation(selectedEvaluation.id, updatedData);
        
        toast.success(`Avaliação individual atualizada com sucesso`, {
          position: 'bottom-right',
          icon: '✅',
          style: {
            backgroundColor: '#1F2937',
            color: '#F9FAFB',
            border: '1px solid #374151',
          },
        });
        
        setIsEditModalOpen(false);  
        await fetchEvaluations();
      } catch (err) {
        toast.error(`Erro na atualização: ${err}`, {
          position: 'bottom-right',
          icon: '❌',
          style: {
            backgroundColor: '#1F2937',
            color: '#F9FAFB',
            border: '1px solid #374151',
          },
        });
      }
    }
  };

  const handleDeleteEvaluation = async () => {
    if (selectedEvaluation) {
      try {
        await individualEvaluationService.deleteEvaluation(selectedEvaluation.id);
        toast.success('Avaliação individual excluída com sucesso!', {
          position: 'bottom-right',
          icon: '✅',
          style: {
            backgroundColor: '#1F2937',
            color: '#F9FAFB',
            border: '1px solid #374151',
          },
        });
        setIsDeleteModalOpen(false);
        await fetchEvaluations();
      } catch (err) {
        toast.error(`Erro ao excluir avaliação individual: ${err}`, {
          position: 'bottom-right',
          icon: '❌',
          style: {
            backgroundColor: '#1F2937',
            color: '#F9FAFB',
            border: '1px solid #374151',
          },
        });
      }
    }
  };

  const resetFilters = () => {
    setFilterStatus(null);
    setFilterWeek(null);
    setFilterUser(null);
    setFilteredEvaluations(evaluations);
  };

  const toggleSortOrder = () => {
    setSortAscending(!sortAscending);
  };

  // Group evaluations by user
  const evaluationsByUser = filteredEvaluations.reduce((acc, evaluation) => {
    if (!acc[evaluation.userId]) {
      acc[evaluation.userId] = {
        user: evaluation.usersEvaluation,
        evaluations: []
      };
    }
    acc[evaluation.userId].evaluations.push(evaluation);
    return acc;
  }, {} as Record<string, { user: IndividualEvaluation['usersEvaluation'], evaluations: IndividualEvaluation[] }>);

  // Unique weeks and users for filters
  const uniqueWeeks = [...new Set(evaluations.map(e => e.week))].sort((a, b) => a - b);
  const uniqueUsers = [...new Set(evaluations.map(e => e.userId))];
  const usersMap = evaluations.reduce((acc, evaluation) => {
    if (!acc[evaluation.userId]) {
      acc[evaluation.userId] = evaluation.usersEvaluation;
    }
    return acc;
  }, {} as Record<string, IndividualEvaluation['usersEvaluation']>);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Não avaliado";
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Avaliações Individuais
            </h1>
            <p className="text-gray-400 mt-1">
              Gerencie as avaliações individuais dos usuários
            </p>
          </div>
          
          {(userRole === "admin" || userRole === "director" || userRole === "counselor") && (
            <Button onClick={handleOpenCreate} className="w-full md:w-auto">
              <User size={18} />
              Nova avaliação individual
            </Button>
          )}
          
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-lg"
        >
          <div className="flex flex-col lg:flex-row gap-3 justify-between mb-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label className="text-xs text-gray-400 mb-1 block">Status</label>
                <div className="flex gap-2">
                  <Button
                    variant={filterStatus === "open" ? "primary" : "outline"}
                    className="text-sm py-1 flex-1"
                    onClick={() => setFilterStatus(prev => prev === "open" ? null : "open")}
                  >
                    <CheckCircle size={16} />
                    Abertas
                  </Button>
                  <Button
                    variant={filterStatus === "closed" ? "primary" : "outline"}
                    className="text-sm py-1 flex-1"
                    onClick={() => setFilterStatus(prev => prev === "closed" ? null : "closed")}
                  >
                    <XCircle size={16} />
                    Fechadas
                  </Button>
                </div>
              </div>
              
              <div className="flex-1">
                <label className="text-xs text-gray-400 mb-1 block">Rodada</label>
                <select
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={filterWeek !== null ? filterWeek : ""}
                  onChange={(e) => setFilterWeek(e.target.value ? Number(e.target.value) : null)}
                >
                  <option value="">Todas as rodadas</option>
                  {uniqueWeeks.map(week => (
                    <option key={week} value={week}>Rodada {week}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex-1">
                <label className="text-xs text-gray-400 mb-1 block">Usuário</label>
                <select
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={filterUser || ""}
                  onChange={(e) => setFilterUser(e.target.value || null)}
                >
                  <option value="">Todos os usuários</option>
                  {uniqueUsers.map(userId => (
                    <option key={userId} value={userId}>
                      {usersMap[userId]?.name || "Usuário"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="text-sm"
                onClick={toggleSortOrder}
              >
                {sortAscending ? (
                  <>
                    <ChevronUp size={16} />
                    Asc
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} />
                    Desc
                  </>
                )}
              </Button>
              
              <Button
                variant="secondary"
                className="text-sm"
                onClick={resetFilters}
              >
                <Filter size={16} />
                Limpar filtros
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Loader2 className="h-10 w-10 text-indigo-500" />
              </motion.div>
            </div>
          ) : filteredEvaluations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-gray-400"
            >
              <Users className="h-16 w-16 mx-auto mb-3 text-gray-600" />
              <h3 className="text-lg font-medium">Nenhuma avaliação individual encontrada</h3>
              <p className="mt-1">Tente ajustar seus filtros ou crie uma nova avaliação individual</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {Object.entries(evaluationsByUser).map(([userId, { user, evaluations }]) => {
                const isExpanded = expandedUsers[userId] !== false; // Default to expanded
                
                return (
                  <motion.div
                    key={userId}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800/50"
                  >
                    <div
                      className="bg-gray-800 p-3 flex items-center justify-between cursor-pointer hover:bg-gray-750"
                      onClick={() => toggleUserExpansion(userId)}
                    >
                      <div className="flex items-center gap-3">
                        <UserAvatar user={user} />
                        <div>
                          <h3 className="font-medium">{user.name}</h3>
                          <p className="text-sm text-gray-400">{evaluations.length} avaliações</p>
                        </div>
                      </div>
                      <Button variant="outline" className="p-2">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </Button>
                    </div>
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="divide-y divide-gray-700/50"
                        >
                          {evaluations.map((evaluation) => (
                            <motion.div
                              key={evaluation.id}
                              whileHover={{ backgroundColor: "rgba(75, 85, 99, 0.2)" }}
                              className="p-4 cursor-pointer transition-colors duration-200"
                              onClick={() => handleOpenEdit(evaluation)}
                            >
                              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                <div className="md:col-span-5">
                                  <div className="flex items-start gap-3">
                                    <div className="bg-gray-700 p-2 rounded-lg">
                                      <Calendar size={20} className="text-indigo-400" />
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-lg">Rodada {evaluation.week}</h4>
                                      <Badge status={evaluation.status as "open" | "closed"} />
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="md:col-span-5">
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-gray-800/80 rounded-lg p-3 border border-gray-700">
                                      <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                                        <Award size={14} />
                                        <span>Pontuação Total</span>
                                      </div>
                                      <div className="text-xl font-semibold">{evaluation.totalScore}</div>
                                    </div>
                                    
                                    <div className="bg-gray-800/80 rounded-lg p-3 border border-gray-700">
                                      <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                                        <Clock size={14} />
                                        <span>Última Atualização</span>
                                      </div>
                                      <div className="text-sm">{formatDate(evaluation.updatedAt)}</div>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-3">
                                    <div className="text-sm text-gray-400">
                                      <span className="font-medium text-gray-300">Avaliado em: </span>
                                      {evaluation.evaluationDate ? formatDate(evaluation.evaluationDate) : "Não avaliado"}
                                    </div>
                                    {evaluation.counselorId && (
                                      <div className="text-sm text-gray-400 mt-1">
                                        <span className="font-medium text-gray-300">Avaliador: </span>
                                        ID: {evaluation.counselorId.substring(0, 8)}...
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                {(userRole === "admin" || userRole === "director" || userRole === "counselor") && (
                                    <div className="md:col-span-2 flex md:justify-end items-center">
                                    <div className="flex gap-2 md:flex-col">
                                      <Button
                                        variant="outline"
                                        className="p-2"
                                        onClick={(e: React.MouseEvent) => {
                                          e.stopPropagation();
                                          handleOpenEdit(evaluation);
                                        }}
                                      >
                                        <Edit size={18} className="text-indigo-400" />
                                      </Button>
                                      
                                      <Button
                                        variant="outline"
                                        className="p-2"
                                        onClick={(e: React.MouseEvent) => handleOpenDelete(evaluation, e)}
                                      >
                                        <Trash2 size={18} className="text-red-400" />
                                      </Button>
                                    </div>
                                  </div>
                                )} 
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Modal de Criação */}
      {isCreateModalOpen && (
        <CreateIndividualEvaluationModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleCreate}
        />
      )}

      {/* Modal de Edição */}
      {isEditModalOpen && selectedEvaluation && (
        <EditIndividualEvaluationModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleEditEvaluation}
          evaluation={selectedEvaluation}
        />
      )}

      {/* Modal de Exclusão */}
      {isDeleteModalOpen && selectedEvaluation && (
        <ConfirmDeleteIndividualEvaluationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirmDelete={handleDeleteEvaluation}
          //userName={}
        />
      )}
    </div>
  );
}
