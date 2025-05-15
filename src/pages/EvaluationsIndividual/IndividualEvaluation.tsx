import { useEffect, useState } from "react";
import { toast } from 'react-hot-toast';
import {
  Loader2,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Filter,
  Award,
  Clock,
  User,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { individualEvaluationService } from "../../services/individualEvaluationService";
import { useAuth } from "../../context/AuthContext";


// Components
import Button from './components/Button'
import Badge from "../../components/ui/badge/Badge";
import UserAvatar from './components/UserAvatar'
import CreateIndividualEvaluationModal from './components/CreateIndividualEvaluationModal';
import EditIndividualEvaluationModal from './components/EditIndividualEvaluationModal';
import ConfirmDeleteIndividualEvaluationModal from './components/ConfirmDeleteIndividualEvaluationModal';
import { unitsService } from "../../services/unitsService";
import { normalizeEvaluationData } from "./nomalizeEvaluationData";
import PageMeta from "../../components/common/PageMeta";
import Avatar from "../../components/ui/avatar/Avatar";



interface IndividualEvaluation {
  id: string;
  userId: string;
  counselorId: string | null;
  evaluationDate: string | null;
  totalScore: number | string;
  status: string;
  week: number;
  createdAt: string;
  updatedAt: string;
  usersEvaluation: {
    id: string;
    name: string;
    photoUrl: string | null;
  };
  unitId?: string; // Adicionamos unitId para organizar por unidade
  unitName?: string; // Nome da unidade para exibição
}


interface IndividualEvaluationInputCreate {
  userId: string;
  week: string;
}


interface UnitWithDbvs {
  id: string;
  name: string;
  photo: string;
  dbvs: Array<{
    dbv: {
      id: string;
      name: string;
      photoUrl?: string | null;
    }
  }>;
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
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({}); // Para controlar unidades expandidas
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterWeek, setFilterWeek] = useState<number | null>(null);
  const [filterUser, setFilterUser] = useState<string | null>(null);
  const [filterUnit, setFilterUnit] = useState<string | null>(null); // Novo filtro por unidade
  const [sortAscending, setSortAscending] = useState(true);
  const [units, setUnits] = useState<UnitWithDbvs[]>([]);


  const { user } = useAuth();
  const userRole = user?.user?.user?.role;


  // Função para buscar unidades conforme o papel do usuário
  const fetchUnits = async () => {
    setIsLoading(true);
    try {
      // Check user role to determine what data to fetch
      if (user?.user?.user?.role === 'counselor') {
        // Counselor sees only their unit's DBVs
        const counselorId = user.user.user.id;
        const counselorUnitResponse = await unitsService.existCounselorUnit(counselorId);
      
        if (!counselorUnitResponse.success || !counselorUnitResponse.result?.existingInOtherUnit) {
          toast.error('Você não está associado a nenhuma unidade', {
            position: 'bottom-right',
            className: 'dark:bg-gray-800 dark:text-white',
            duration: 3000,
          });
          setUnits([]);
          setIsLoading(false);
          return;
        }
       
        const unitId = counselorUnitResponse.result.existingInOtherUnit.unitId;
        const unitResponse = await unitsService.getUnitById(unitId);
       
        if (unitResponse.success && unitResponse.unit?.unit) {
          const unitData = [unitResponse.unit.unit];
          setUnits(unitData);
          toast.success('Unidade carregada com sucesso', {
            position: 'bottom-right',
            className: 'dark:bg-gray-800 dark:text-white',
            duration: 3000,
          });
        }
      } else if (
        user?.user?.user?.role === 'admin' 
        || user?.user?.user?.role === 'director'
        || user?.user?.user?.role === 'lead'
        || user?.user?.user?.role === 'secretary'
      ) {
        // Admin and director see all units
        const response = await unitsService.ListAllUnits();
        if (response.success && response.units?.units) {
          setUnits(response.units.units);
          toast.success(`${response.units.units.length} unidades carregadas com sucesso`, {
            position: 'bottom-right',
            className: 'dark:bg-gray-800 dark:text-white',
            duration: 3000,
          });
        }
      } else if (user?.user?.user?.role === 'dbv') {
        // DBV sees only their unit
        const userId = user.user.user.id;
        const dbvUnitResponse = await unitsService.existDbvUnit(userId);
        
        if (!dbvUnitResponse.success || !dbvUnitResponse.result?.existingInOtherUnit) {
          toast.error('Você não está associado a nenhuma unidade', {
            position: 'bottom-right',
            className: 'dark:bg-gray-800 dark:text-white',
            duration: 3000,
          });
          setUnits([]);
          setIsLoading(false);
          return;
        }
        
        const unitId = dbvUnitResponse.result.existingInOtherUnit.unitId;
        const unitResponse = await unitsService.getUnitById(unitId);
        
        if (unitResponse.success && unitResponse.unit?.unit) {
          const unitData = [unitResponse.unit.unit];
          setUnits(unitData);
          toast.success('Unidade carregada com sucesso', {
            position: 'bottom-right',
            className: 'dark:bg-gray-800 dark:text-white',
            duration: 3000,
          });
        }
      } else {
        toast.error('Você não tem permissão para visualizar avaliações de desbravadores', {
          position: 'bottom-right',
          className: 'dark:bg-gray-800 dark:text-white',
          duration: 3000,
        });
        setUnits([]);
      }
    } catch (error) {
      console.error("Erro ao carregar unidades:", error);
      toast.error('Não foi possível carregar as unidades', {
        position: 'bottom-right',
        className: 'dark:bg-gray-800 dark:text-white',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Função para buscar avaliações e associá-las às unidades
  const fetchEvaluations = async () => {
    setIsLoading(true);
    try {
      // Primeiro, busca as unidades para obter informações dos desbravadores e suas unidades
      await fetchUnits();
      
      let allEvaluations: IndividualEvaluation[] = [];
      
      if (userRole === 'counselor' || userRole === 'dbv') {
        // Counselor ou DBV vê apenas sua unidade
        const userId = user?.user?.user?.id;
        const existingUnitResponse =
          userRole === 'counselor'
          ? await unitsService.existCounselorUnit(userId as string)
          : await unitsService.existDbvUnit(userId as string);
   
        if (!existingUnitResponse.success || !existingUnitResponse.result?.existingInOtherUnit) {
          toast.error('Você não está associado a nenhuma unidade', {
            position: 'bottom-right',
            icon: '❌',
            style: {
              backgroundColor: '#1F2937',
              color: '#F9FAFB',
              border: '1px solid #374151',
            },
          });
          setEvaluations([]);
          setFilteredEvaluations([]);
          setIsLoading(false);
          return;
        }
     
        const unitId = existingUnitResponse.result.existingInOtherUnit.unitId;
        const unitResponse = await unitsService.getUnitById(unitId);
        const unit = unitResponse.unit.unit;
        
        // Busca avaliações de todos os DBVs da unidade
        const evaluationsByDbv = await buscarAvaliacoesDbvs(unitId);
        
        // Normaliza e adiciona informações da unidade
        const normalizedData = normalizeEvaluationData(evaluationsByDbv).map(evaluation => ({
          ...evaluation,
          unitId,
          unitName: unit.name
        }));
        
        allEvaluations = normalizedData;
      } else if (userRole === 'admin' || userRole === 'director' || userRole === 'lead' || userRole === 'secretary') {
        // Busca todas as unidades
        const unitsResponse = await unitsService.ListAllUnits();
        const allUnits = unitsResponse.success && unitsResponse.units?.units ? unitsResponse.units.units : [];
        
        // Para cada unidade, busca as avaliações dos DBVs
        for (const unit of allUnits) {
          const evaluationsByDbv = await buscarAvaliacoesDbvs(unit.id);
          
          // Normaliza e adiciona informações da unidade
          const normalizedData = normalizeEvaluationData(evaluationsByDbv).map(evaluation => ({
            ...evaluation,
            unitId: unit.id,
            unitName: unit.name
          }));
          
          allEvaluations = [...allEvaluations, ...normalizedData];
        }
      } else {
        toast.error('Você não tem permissão para visualizar avaliações', {
          position: 'bottom-right',
          icon: '❌',
          style: {
            backgroundColor: '#1F2937',
            color: '#F9FAFB',
            border: '1px solid #374151',
          },
        });
      }
      
      setEvaluations(allEvaluations);
      setFilteredEvaluations(allEvaluations);
      
    } catch (err) {
      toast.error("Erro ao carregar avaliações", {
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
    
    if (filterUnit) {
      filtered = filtered.filter(evaluation => evaluation.unitId === filterUnit);
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
  }, [evaluations, filterStatus, filterWeek, filterUser, filterUnit, sortAscending]);


  const buscarAvaliacoesDbvs = async (unitId: string) => {
    const dbvsResponse = await unitsService.getUnitById(unitId);
    const dbvs = dbvsResponse.unit.unit.dbvs;


    const userPromises = dbvs.map(async (dbv: { dbv: { id: string } }) => {
      const evaluationDbv = await individualEvaluationService.ListEvaluationFromUser(dbv.dbv.id);
      return evaluationDbv;
    });


    const data = await Promise.all(userPromises);
    return data;
  };
 
  const toggleUserExpansion = (userId: string) => {
    setExpandedUsers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };


  const toggleUnitExpansion = (unitId: string) => {
    setExpandedUnits(prev => ({
      ...prev,
      [unitId]: !prev[unitId]
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
    setFilterUnit(null);
    setFilteredEvaluations(evaluations);
  };


  const toggleSortOrder = () => {
    setSortAscending(!sortAscending);
  };

  // Agrupar avaliações por unidade
  const evaluationsByUnit = filteredEvaluations.reduce((acc, evaluation) => {
    const unitId = evaluation.unitId || 'sem-unidade';
    const unitName = evaluation.unitName || 'Sem Unidade';
    
    if (!acc[unitId]) {
      acc[unitId] = {
        unitId,
        unitName,
        users: {}
      };
    }
    
    const userId = evaluation.userId;
    
    if (!acc[unitId].users[userId]) {
      acc[unitId].users[userId] = {
        user: evaluation.usersEvaluation,
        evaluations: []
      };
    }
    
    acc[unitId].users[userId].evaluations.push(evaluation);
    return acc;
  }, {} as Record<string, { 
    unitId: string, 
    unitName: string, 
    users: Record<string, { 
      user: IndividualEvaluation['usersEvaluation'], 
      evaluations: IndividualEvaluation[] 
    }> 
  }>);


  // Obtém listas únicas para filtros
  const uniqueWeeks = [...new Set(evaluations.map(e => e.week))].sort((a, b) => a - b);
  const uniqueUsers = [...new Set(evaluations.map(e => e.userId))];
  const uniqueUnits = [...new Set(evaluations.filter(e => e.unitId).map(e => e.unitId))];
  
  const usersMap = evaluations.reduce((acc, evaluation) => {
    if (!acc[evaluation.userId]) {
      acc[evaluation.userId] = evaluation.usersEvaluation;
    }
    return acc;
  }, {} as Record<string, IndividualEvaluation['usersEvaluation']>);
  
  const unitsMap = evaluations.reduce((acc, evaluation) => {
    if (evaluation.unitId && !acc[evaluation.unitId]) {
      acc[evaluation.unitId] = {
        id: evaluation.unitId,
        name: evaluation.unitName || 'Unidade Desconhecida'
      };
    }
    return acc;
  }, {} as Record<string, { id: string, name: string }>);


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
    <>
      <PageMeta
        title="Avaliações individuais dos desbravadores | Luzeiros do Norte"
        description="Clube de Desbravadores - Fotos das atividades do clube, incluindo acampamentos, reuniões e eventos especiais."
      />
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <div className="max-w-7xl mx-auto p-4 md:p-3 space-y-3">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            {(userRole === "admin" || userRole === "director" || userRole === "counselor") ? (
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                  Avaliações Individuais
                </h1>
                <p className="text-gray-400 mt-1">
                  Gerencie as avaliações individuais dos desbravadores por unidade
                </p>
              </div>
            ) : (
              <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                Avaliações Individuais
              </h1>
              <p className="text-gray-400 mt-1">
                Avaliações dos desbravadores
              </p>
            </div>
            )
          }
            
            {(userRole === "admin" || userRole === "director" || userRole === "counselor") && (
              <Button onClick={handleOpenCreate} className="w-full md:w-auto justify-center ">
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
                
                {/* Filtro de Unidade */}
                <div className="flex-1">
                  <label className="text-xs text-gray-400 mb-1 block">Unidade</label>
                  <select
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={filterUnit || ""}
                    onChange={(e) => setFilterUnit(e.target.value || null)}
                  >
                    <option value="">Todas as unidades</option>
                    {uniqueUnits.map(unitId => (
                      <option key={unitId} value={unitId}>
                        {unitId ? unitsMap[unitId]?.name || "Unidade" : "Unidade"}
                      </option>
                    ))}
                  </select>
                </div>
              
                <div className="flex-1">
                  <label className="text-xs text-gray-400 mb-1 block">Desbravador</label>
                  <select
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={filterUser || ""}
                    onChange={(e) => setFilterUser(e.target.value || null)}
                  >
                    <option value="">Todos os desbravadores</option>
                    {uniqueUsers.map(userId => (
                      <option key={userId} value={userId}>
                        {usersMap[userId]?.name || "Desbravador"}
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
              <div className="space-y-6">
                {/* Lista de Unidades */}
                {Object.entries(evaluationsByUnit).map(([unitId, unitData]) => {
                  const isUnitExpanded = expandedUnits[unitId] !== false; // Por padrão, expandido
                  
                  return (
                    <motion.div
                      key={unitId}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800/50"
                    >
                      {/* Cabeçalho da Unidade */}
                      <div
                        className="bg-gray-750 p-3 flex items-center justify-between cursor-pointer hover:bg-gray-700"
                        onClick={() => toggleUnitExpansion(unitId)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-indigo-600/10 p-2 border-indigo-600/30 rounded-full border-2">
                          
                            {/* <Flag size={24} className="text-indigo-500" /> */}
                            <Avatar
                              src={units.find(unit => unit.id === unitId)?.photo || ""}
                              size="medium"
                              status="online"
                            />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-white">{unitData.unitName}</h2>
                            <p className="text-sm text-gray-400">
                              {Object.keys(unitData.users).length} desbravadores • {
                                Object.values(unitData.users).reduce((total, user) => total + user.evaluations.length, 0)
                              } avaliações
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" className="p-2">
                          {isUnitExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </Button>
                      </div>
                      
                      {/* Conteúdo da Unidade (Desbravadores) */}
                      
                      <AnimatePresence>
                        {isUnitExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="divide-y divide-gray-700/30"
                          >
                            {/* Lista de Desbravadores */}
                            <div className="p-2 bg-gray-850">
                              <div className="space-y-3">
                                {Object.entries(unitData.users).map(([userId, { user, evaluations }]) => {
                                  const isExpanded = expandedUsers[userId] !== false; // Default to expanded
                                
                                  return (
                                    <motion.div
                                      key={userId}
                                      layout
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800"
                                    >
                                      <div
                                        className="bg-gray-800 p-3 flex items-center justify-between cursor-pointer hover:bg-gray-750"
                                        onClick={() => toggleUserExpansion(userId)}
                                      >
                                        <div className="flex items-center gap-3">
                                          <UserAvatar 
                                            user={user}
                                            size="md"
                                          />
                                          <div>
                                            <h3 className="font-medium text-white">{user.name}</h3>
                                            <p className="text-xs text-gray-400">
                                              {evaluations.length} avaliações • {
                                                evaluations.filter(e => e.status === 'closed').length
                                              } concluídas
                                            </p>
                                          </div>
                                        </div>
                                        <Button variant="outline" className="p-2">
                                          {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                        </Button>
                                      </div>
                                      
                                      <AnimatePresence>
                                          {isExpanded && (
                                            <motion.div
                                              initial={{ height: 0, opacity: 0 }}
                                              animate={{ height: "auto", opacity: 1 }}
                                              exit={{ height: 0, opacity: 0 }}
                                              transition={{ duration: 0.2 }}
                                            >
                                              <div className="p-3 space-y-2">
                                                {evaluations.length === 0 ? (
                                                  <p className="text-center text-gray-400 py-3">
                                                    Nenhuma avaliação encontrada
                                                  </p>
                                                ) : (
                                                  evaluations.map((evaluation) => (
                                                    <motion.div
                                                      key={evaluation.id}
                                                      className="bg-gray-750 p-3 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors flex flex-col"
                                                      whileHover={{ y: -2 }}
                                                      initial={{ opacity: 0 }}
                                                      animate={{ opacity: 1 }}
                                                      //onClick={() => handleOpenEdit(evaluation)}
                                                      onClick={() => (userRole === "admin" || userRole === "director" || userRole === "counselor") 
                                                        ? handleOpenEdit(evaluation)
                                                        : {}
                                                      }
                                                    >
                                                      <div className="flex items-center justify-between">
                                                        <h2 className="text-xl font-bold">
                                                          Rodada {evaluation.week}
                                                        </h2>
                                                        <Badge 
                                                          variant="light" 
                                                          color={evaluation.status === "open" ? "success" : "error"} 
                                                          size="md"
                                                          startIcon={evaluation.status === "open" 
                                                            ? <CheckCircle size={12} />
                                                            : <XCircle size={12} />
                                                          }  
                                                        >
                                                          {evaluation.status === "open" ? "Aberta" : "Fechada"}
                                                        </Badge>
                                                      </div>

                                                      
                                                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        <div className="bg-gray-800/50 p-2 rounded-md">
                                                          <p className="text-xs text-gray-400">Pontuação Total</p>
                                                          <div className="flex items-center gap-2 mt-1">
                                                            <Award className="text-yellow-500" size={18} />
                                                            <span className="font-medium text-white">
                                                              {evaluation.totalScore === "" ? "Não avaliado" : evaluation.totalScore}
                                                            </span>
                                                          </div>
                                                        </div>
                                                        
                                                        <div className="bg-gray-800/50 p-2 rounded-md">
                                                          <p className="text-xs text-gray-400">Data da Avaliação</p>
                                                          <div className="flex items-center gap-2 mt-1">
                                                            <Clock className="text-indigo-400" size={18} />
                                                            <span className="font-medium text-white text-sm">
                                                              {formatDate(evaluation.evaluationDate)}
                                                            </span>
                                                          </div>
                                                        </div>
                                                      </div>


                                                      {(userRole === "admin" || userRole === "director" || userRole === "counselor") && (
                                                        <div className="mt-3 pt-3 border-t border-gray-700 flex justify-center">
                                                          <div className="flex gap-2">
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
                                                    </motion.div>
                                                  ))
                                                )}
                                              </div>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>

                                    </motion.div>
                                  );
                                })}
                              </div>
                            </div>
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
    </>
  );
}


































// import { useEffect, useState } from "react";
// import { toast } from 'react-hot-toast';
// import {
//   Loader2,
//   Trash2,
//   Edit,
//   Calendar,
//   CheckCircle,
//   XCircle,
//   ChevronDown,
//   ChevronUp,
//   Filter,
//   Award,
//   Clock,
//   User,
//   Users
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { individualEvaluationService } from "../../services/individualEvaluationService";
// import { useAuth } from "../../context/AuthContext";

// // Components
// import Button from './components/Button'
// //import Card from './components/Card'
// import Badge from './components/Badge'
// import UserAvatar from './components/UserAvatar'
// import CreateIndividualEvaluationModal from './components/CreateIndividualEvaluationModal';
// import EditIndividualEvaluationModal from './components/EditIndividualEvaluationModal';
// import ConfirmDeleteIndividualEvaluationModal from './components/ConfirmDeleteIndividualEvaluationModal';
// import { unitsService } from "../../services/unitsService";
// import { Unit } from "../../dtos/UnitDTO";
// import { normalizeEvaluationData } from "./nomalizeEvaluationData";

// interface IndividualEvaluation {
//   id: string;
//   userId: string;
//   counselorId: string | null;
//   evaluationDate: string | null;
//   totalScore: number | string;
//   status: string;
//   week: number;
//   createdAt: string;
//   updatedAt: string;
//   usersEvaluation: {
//     id: string;
//     name: string;
//     photoUrl: string | null;
//   };
// }

// interface IndividualEvaluationInputCreate {
//   userId: string;
//   week: string;
// }

// export default function IndividualEvaluations() {
//   const [evaluations, setEvaluations] = useState<IndividualEvaluation[]>([]);
//   const [filteredEvaluations, setFilteredEvaluations] = useState<IndividualEvaluation[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [selectedEvaluation, setSelectedEvaluation] = useState<IndividualEvaluation | null>(null);
//   const [expandedUsers, setExpandedUsers] = useState<Record<string, boolean>>({});
//   const [filterStatus, setFilterStatus] = useState<string | null>(null);
//   const [filterWeek, setFilterWeek] = useState<number | null>(null);
//   const [filterUser, setFilterUser] = useState<string | null>(null);
//   const [sortAscending, setSortAscending] = useState(true);

//   const { userRole, user } = useAuth();

//   const fetchEvaluations = async () => {
//     setIsLoading(true);
//     try {
//       // Check user role to determine what data to fetch
//       if (userRole === 'counselor' || userRole === 'dbv') {
//         // Counselor or DBV sees only their unit's DBVs
//         const userId = user?.user?.user?.id;
      
//         const existingUnitResponse =
//           user?.user?.user?.role === 'counselor'
//           ? await unitsService.existCounselorUnit(userId as string)
//           : await unitsService.existDbvUnit(userId as string);
    
//         if (!existingUnitResponse.success || !existingUnitResponse.result?.existingInOtherUnit) {
//           toast.error('Você não está associado a nenhuma unidade', {
//             position: 'bottom-right',
//             icon: '❌',
//             style: {
//               backgroundColor: '#1F2937',
//               color: '#F9FAFB',
//               border: '1px solid #374151',
//             },
//           });
//           setEvaluations([]);
//           setFilteredEvaluations([]);
//           setIsLoading(false);
//           return;
//         }
      
//         const unitId = existingUnitResponse.result.existingInOtherUnit.unitId;
//         const avaliacoesDbvs = await buscarAvaliacoesDbvs(unitId);
        
//         // Normaliza os dados antes de salvar no estado
//         const normalizedData = normalizeEvaluationData(avaliacoesDbvs);
        
//         setEvaluations(normalizedData);
//         setFilteredEvaluations(normalizedData);
//       } else if (user?.user?.user?.role === 'admin' ||
//         user?.user?.user?.role === 'director' ||
//         user?.user?.user?.role === 'lead' ||
//         user?.user?.user?.role === 'secretary'
//       ) {
//         // Admin and director see all evaluations
//         const data = await individualEvaluationService.ListAllEvaluation();
        
//         // Normaliza também os dados do admin/director
//         const normalizedData = normalizeEvaluationData(data.evaluations);
        
//         setEvaluations(normalizedData);
//         setFilteredEvaluations(normalizedData);
//       } else {
//         toast.error('Você não tem permissão para visualizar avaliações', {
//           position: 'bottom-right',
//           icon: '❌',
//           style: {
//             backgroundColor: '#1F2937',
//             color: '#F9FAFB',
//             border: '1px solid #374151',
//           },
//         });
//         setEvaluations([]);
//         setFilteredEvaluations([]);
//       }
//     } catch (err) {
//       toast.error("Erro ao carregar avaliações", {
//         position: 'bottom-right',
//         icon: '❌',
//         style: {
//           backgroundColor: '#1F2937',
//           color: '#F9FAFB',
//           border: '1px solid #374151',
//         },
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   useEffect(() => {
//     fetchEvaluations();
//   }, []);

//   useEffect(() => {
//     let filtered = [...evaluations];
    
//     if (filterStatus) {
//       filtered = filtered.filter(evaluation => evaluation.status === filterStatus);
//     }
    
//     if (filterWeek !== null) {
//       filtered = filtered.filter(evaluation => evaluation.week === filterWeek);
//     }
    
//     if (filterUser) {
//       filtered = filtered.filter(evaluation => evaluation.userId === filterUser);
//     }
    
//     // Sort by week
//     filtered.sort((a, b) => {
//       if (sortAscending) {
//         return a.week - b.week;
//       } else {
//         return b.week - a.week;
//       }
//     });
    
//     setFilteredEvaluations(filtered);
//   }, [evaluations, filterStatus, filterWeek, filterUser, sortAscending]);


//   const buscarAvaliacoesDbvs = async (unitId: string) => {
//     const dbvsResponse = await unitsService.getUnitById(unitId);
//     const dbvs = dbvsResponse.unit.unit.dbvs;

//     const userPromises = dbvs.map(async (dbv: { dbv: { id: string } }) => {
//       const evaluationDbv = await individualEvaluationService.ListEvaluationFromUser(dbv.dbv.id);
//       return evaluationDbv
//     });

//     const data = await Promise.all(userPromises);
//     return data;
//   };
  

//   const toggleUserExpansion = (userId: string) => {
//     setExpandedUsers(prev => ({
//       ...prev,
//       [userId]: !prev[userId]
//     }));
//   };

//   const handleOpenCreate = () => {
//     setIsCreateModalOpen(true);
//   };

//   const handleOpenEdit = (evaluation: IndividualEvaluation) => {
//     setSelectedEvaluation(evaluation);
//     setIsEditModalOpen(true);
//   };

//   const handleOpenDelete = (evaluation: IndividualEvaluation, e: React.MouseEvent) => {
//     e.stopPropagation();
//     setSelectedEvaluation(evaluation);
//     setIsDeleteModalOpen(true);
//   };

//   const handleCreate = async (evaluationData: IndividualEvaluationInputCreate) => {
//     try {
//       const payload = {
//         userId: evaluationData.userId,
//         week: Number(evaluationData.week),
//       };
      
//       await individualEvaluationService.createEvaluation(payload);
//       toast.success('Avaliação individual criada com sucesso!', {
//         position: 'bottom-right',
//         icon: '✅',
//         style: {
//           backgroundColor: '#1F2937',
//           color: '#F9FAFB',
//           border: '1px solid #374151',
//         },
//       });
//       setIsCreateModalOpen(false);
//       await fetchEvaluations();
//     } catch (err) {
//       toast.error('Erro ao criar avaliação individual.', {
//         position: 'bottom-right',
//         icon: '❌',
//         style: {
//           backgroundColor: '#1F2937',
//           color: '#F9FAFB',
//           border: '1px solid #374151',
//         },
//       });
//     }
//   };

//   const handleEditEvaluation = async (data: any) => {
//     if (selectedEvaluation) {
//       try {
//         const updatedData = {
//           ...data,
//           status: data.status || selectedEvaluation.status,
//         };
        
//         await individualEvaluationService.updateEvaluation(selectedEvaluation.id, updatedData);
        
//         toast.success(`Avaliação individual atualizada com sucesso`, {
//           position: 'bottom-right',
//           icon: '✅',
//           style: {
//             backgroundColor: '#1F2937',
//             color: '#F9FAFB',
//             border: '1px solid #374151',
//           },
//         });
        
//         setIsEditModalOpen(false);  
//         await fetchEvaluations();
//       } catch (err) {
//         toast.error(`Erro na atualização: ${err}`, {
//           position: 'bottom-right',
//           icon: '❌',
//           style: {
//             backgroundColor: '#1F2937',
//             color: '#F9FAFB',
//             border: '1px solid #374151',
//           },
//         });
//       }
//     }
//   };

//   const handleDeleteEvaluation = async () => {
//     if (selectedEvaluation) {
//       try {
//         await individualEvaluationService.deleteEvaluation(selectedEvaluation.id);
//         toast.success('Avaliação individual excluída com sucesso!', {
//           position: 'bottom-right',
//           icon: '✅',
//           style: {
//             backgroundColor: '#1F2937',
//             color: '#F9FAFB',
//             border: '1px solid #374151',
//           },
//         });
//         setIsDeleteModalOpen(false);
//         await fetchEvaluations();
//       } catch (err) {
//         toast.error(`Erro ao excluir avaliação individual: ${err}`, {
//           position: 'bottom-right',
//           icon: '❌',
//           style: {
//             backgroundColor: '#1F2937',
//             color: '#F9FAFB',
//             border: '1px solid #374151',
//           },
//         });
//       }
//     }
//   };

//   const resetFilters = () => {
//     setFilterStatus(null);
//     setFilterWeek(null);
//     setFilterUser(null);
//     setFilteredEvaluations(evaluations);
//   };

//   const toggleSortOrder = () => {
//     setSortAscending(!sortAscending);
//   };

//   // Group evaluations by user
//   const evaluationsByUser = filteredEvaluations.reduce((acc, evaluation) => {
//     if (!acc[evaluation.userId]) {
//       acc[evaluation.userId] = {
//         user: evaluation.usersEvaluation,
//         evaluations: []
//       };
//     }
//     acc[evaluation.userId].evaluations.push(evaluation);
//     return acc;
//   }, {} as Record<string, { user: IndividualEvaluation['usersEvaluation'], evaluations: IndividualEvaluation[] }>);

//   // Unique weeks and users for filters
//   const uniqueWeeks = [...new Set(evaluations.map(e => e.week))].sort((a, b) => a - b);
//   const uniqueUsers = [...new Set(evaluations.map(e => e.userId))];
//   const usersMap = evaluations.reduce((acc, evaluation) => {
//     if (!acc[evaluation.userId]) {
//       acc[evaluation.userId] = evaluation.usersEvaluation;
//     }
//     return acc;
//   }, {} as Record<string, IndividualEvaluation['usersEvaluation']>);

//   const formatDate = (dateString: string | null) => {
//     if (!dateString) return "Não avaliado";
//     const date = new Date(dateString);
//     return date.toLocaleDateString('pt-BR', { 
//       day: '2-digit', 
//       month: '2-digit', 
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-gray-100">
//       <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
//         >
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
//               Avaliações Individuais
//             </h1>
//             <p className="text-gray-400 mt-1">
//               Gerencie as avaliações individuais dos usuários
//             </p>
//           </div>
          
//           {(userRole === "admin" || userRole === "director" || userRole === "counselor") && (
//             <Button onClick={handleOpenCreate} className="w-full md:w-auto">
//               <User size={18} />
//               Nova avaliação individual
//             </Button>
//           )}
          
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//           className="bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-lg"
//         >
//           <div className="flex flex-col lg:flex-row gap-3 justify-between mb-4">
//             <div className="flex flex-col sm:flex-row gap-3">
//               <div className="flex-1">
//                 <label className="text-xs text-gray-400 mb-1 block">Status</label>
//                 <div className="flex gap-2">
//                   <Button
//                     variant={filterStatus === "open" ? "primary" : "outline"}
//                     className="text-sm py-1 flex-1"
//                     onClick={() => setFilterStatus(prev => prev === "open" ? null : "open")}
//                   >
//                     <CheckCircle size={16} />
//                     Abertas
//                   </Button>
//                   <Button
//                     variant={filterStatus === "closed" ? "primary" : "outline"}
//                     className="text-sm py-1 flex-1"
//                     onClick={() => setFilterStatus(prev => prev === "closed" ? null : "closed")}
//                   >
//                     <XCircle size={16} />
//                     Fechadas
//                   </Button>
//                 </div>
//               </div>
              
//               <div className="flex-1">
//                 <label className="text-xs text-gray-400 mb-1 block">Rodada</label>
//                 <select
//                   className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                   value={filterWeek !== null ? filterWeek : ""}
//                   onChange={(e) => setFilterWeek(e.target.value ? Number(e.target.value) : null)}
//                 >
//                   <option value="">Todas as rodadas</option>
//                   {uniqueWeeks.map(week => (
//                     <option key={week} value={week}>Rodada {week}</option>
//                   ))}
//                 </select>
//               </div>
              
//               <div className="flex-1">
//                 <label className="text-xs text-gray-400 mb-1 block">Usuário</label>
//                 <select
//                   className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                   value={filterUser || ""}
//                   onChange={(e) => setFilterUser(e.target.value || null)}
//                 >
//                   <option value="">Todos os usuários</option>
//                   {uniqueUsers.map(userId => (
//                     <option key={userId} value={userId}>
//                       {usersMap[userId]?.name || "Usuário"}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
            
//             <div className="flex gap-2">
//               <Button
//                 variant="outline"
//                 className="text-sm"
//                 onClick={toggleSortOrder}
//               >
//                 {sortAscending ? (
//                   <>
//                     <ChevronUp size={16} />
//                     Asc
//                   </>
//                 ) : (
//                   <>
//                     <ChevronDown size={16} />
//                     Desc
//                   </>
//                 )}
//               </Button>
              
//               <Button
//                 variant="secondary"
//                 className="text-sm"
//                 onClick={resetFilters}
//               >
//                 <Filter size={16} />
//                 Limpar filtros
//               </Button>
//             </div>
//           </div>

//           {isLoading ? (
//             <div className="flex justify-center py-12">
//               <motion.div
//                 animate={{ rotate: 360 }}
//                 transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
//               >
//                 <Loader2 className="h-10 w-10 text-indigo-500" />
//               </motion.div>
//             </div>
//           ) : filteredEvaluations.length === 0 ? (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="text-center py-12 text-gray-400"
//             >
//               <Users className="h-16 w-16 mx-auto mb-3 text-gray-600" />
//               <h3 className="text-lg font-medium">Nenhuma avaliação individual encontrada</h3>
//               <p className="mt-1">Tente ajustar seus filtros ou crie uma nova avaliação individual</p>
//             </motion.div>
//           ) : (
//             <div className="space-y-4">
//               {Object.entries(evaluationsByUser).map(([userId, { user, evaluations }]) => {
//                 const isExpanded = expandedUsers[userId] !== false; // Default to expanded
                
//                 return (
//                   <motion.div
//                     key={userId}
//                     layout
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.3 }}
//                     className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800/50"
//                   >
//                     <div
//                       className="bg-gray-800 p-3 flex items-center justify-between cursor-pointer hover:bg-gray-750"
//                       onClick={() => toggleUserExpansion(userId)}
//                     >
//                       <div className="flex items-center gap-3">
//                         <UserAvatar user={user} />
//                         <div>
//                           <h3 className="font-medium">{user.name}</h3>
//                           <p className="text-sm text-gray-400">{evaluations.length} avaliações</p>
//                         </div>
//                       </div>
//                       <Button variant="outline" className="p-2">
//                         {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//                       </Button>
//                     </div>
                    
//                     <AnimatePresence>
//                       {isExpanded && (
//                         <motion.div
//                           initial={{ height: 0, opacity: 0 }}
//                           animate={{ height: "auto", opacity: 1 }}
//                           exit={{ height: 0, opacity: 0 }}
//                           transition={{ duration: 0.3 }}
//                           className="divide-y divide-gray-700/50"
//                         >
//                           {evaluations.map((evaluation) => (
//                             <motion.div
//                               key={evaluation.id}
//                               whileHover={{ backgroundColor: "rgba(75, 85, 99, 0.2)" }}
//                               className="p-4 cursor-pointer transition-colors duration-200"
//                               onClick={() => handleOpenEdit(evaluation)}
//                             >
//                               <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
//                                 <div className="md:col-span-5">
//                                   <div className="flex items-start gap-3">
//                                     <div className="bg-gray-700 p-2 rounded-lg">
//                                       <Calendar size={20} className="text-indigo-400" />
//                                     </div>
//                                     <div>
//                                       <h4 className="font-medium text-lg">Rodada {evaluation.week}</h4>
//                                       <Badge status={evaluation.status as "open" | "closed"} />
//                                     </div>
//                                   </div>
//                                 </div>
                                
//                                 <div className="md:col-span-5">
//                                   <div className="grid grid-cols-2 gap-3">
//                                     <div className="bg-gray-800/80 rounded-lg p-3 border border-gray-700">
//                                       <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
//                                         <Award size={14} />
//                                         <span>Pontuação Total</span>
//                                       </div>
//                                       <div className="text-xl font-semibold">{evaluation.totalScore}</div>
//                                     </div>
                                    
//                                     <div className="bg-gray-800/80 rounded-lg p-3 border border-gray-700">
//                                       <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
//                                         <Clock size={14} />
//                                         <span>Última Atualização</span>
//                                       </div>
//                                       <div className="text-sm">{formatDate(evaluation.updatedAt)}</div>
//                                     </div>
//                                   </div>
                                  
//                                   <div className="mt-3">
//                                     <div className="text-sm text-gray-400">
//                                       <span className="font-medium text-gray-300">Avaliado em: </span>
//                                       {evaluation.evaluationDate ? formatDate(evaluation.evaluationDate) : "Não avaliado"}
//                                     </div>
//                                     {evaluation.counselorId && (
//                                       <div className="text-sm text-gray-400 mt-1">
//                                         <span className="font-medium text-gray-300">Avaliador: </span>
//                                         ID: {evaluation.counselorId.substring(0, 8)}...
//                                       </div>
//                                     )}
//                                   </div>
//                                 </div>
                                
//                                 {(userRole === "admin" || userRole === "director" || userRole === "counselor") && (
//                                     <div className="md:col-span-2 flex md:justify-end items-center">
//                                     <div className="flex gap-2 md:flex-col">
//                                       <Button
//                                         variant="outline"
//                                         className="p-2"
//                                         onClick={(e: React.MouseEvent) => {
//                                           e.stopPropagation();
//                                           handleOpenEdit(evaluation);
//                                         }}
//                                       >
//                                         <Edit size={18} className="text-indigo-400" />
//                                       </Button>
                                      
//                                       <Button
//                                         variant="outline"
//                                         className="p-2"
//                                         onClick={(e: React.MouseEvent) => handleOpenDelete(evaluation, e)}
//                                       >
//                                         <Trash2 size={18} className="text-red-400" />
//                                       </Button>
//                                     </div>
//                                   </div>
//                                 )} 
//                               </div>
//                             </motion.div>
//                           ))}
//                         </motion.div>
//                       )}
//                     </AnimatePresence>
//                   </motion.div>
//                 );
//               })}
//             </div>
//           )}
//         </motion.div>
//       </div>

//       {/* Modal de Criação */}
//       {isCreateModalOpen && (
//         <CreateIndividualEvaluationModal
//           isOpen={isCreateModalOpen}
//           onClose={() => setIsCreateModalOpen(false)}
//           onSave={handleCreate}
//         />
//       )}

//       {/* Modal de Edição */}
//       {isEditModalOpen && selectedEvaluation && (
//         <EditIndividualEvaluationModal
//           isOpen={isEditModalOpen}
//           onClose={() => setIsEditModalOpen(false)}
//           onSave={handleEditEvaluation}
//           evaluation={selectedEvaluation}
//         />
//       )}

//       {/* Modal de Exclusão */}
//       {isDeleteModalOpen && selectedEvaluation && (
//         <ConfirmDeleteIndividualEvaluationModal
//           isOpen={isDeleteModalOpen}
//           onClose={() => setIsDeleteModalOpen(false)}
//           onConfirmDelete={handleDeleteEvaluation}
//           //userName={}
//         />
//       )}
//     </div>
//   );
// }
