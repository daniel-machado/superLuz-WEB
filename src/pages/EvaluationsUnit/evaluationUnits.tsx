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
  Book 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { unitEvaluationService } from "../../services/unitEvaluationService";
import { useAuth } from "../../context/AuthContext";
import CreateEvaUnitModal from "../../components/EvaluationUnitComponents/CreateEvaUnitModal";
import ConfirmDeleteEvaUnitModal from "../../components/EvaluationUnitComponents/ConfirmDeleteEvaUnitModal";
import EditEvaUnitModal from "../../components/EvaluationUnitComponents/EditEvaUnitModal";

// Components
import { ReactNode } from "react";
import PageMeta from "../../components/common/PageMeta";
import { unitsService } from "../../services/unitsService";

const Button = ({ children, variant = "primary", className = "", ...props }: { children: ReactNode; variant?: "primary" | "secondary" | "outline" | "danger"; className?: string; [key: string]: any }) => {
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
    secondary: "bg-gray-700 hover:bg-gray-800 text-white",
    outline: "bg-transparent border border-gray-600 hover:bg-gray-800 text-gray-300",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };

  return (
    <button
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// const Card = ({ children, className = "", ...props }: { children: ReactNode; className?: string; [key: string]: any }) => {
//   return (
//     <div
//       className={`bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-4 ${className}`}
//       {...props}
//     >
//       {children}
//     </div>
//   );
// };

const Badge = ({ status }: { status: "open" | "closed" }) => {
  const variants = {
    open: "bg-green-900/30 text-green-400 border-green-500",
    closed: "bg-red-900/30 text-red-400 border-red-500",
  };

  return (
    <span
      className={`text-xs px-2 py-1 rounded-full border ${variants[status]} inline-flex items-center gap-1`}
    >
      {status === "open" ? (
        <>
          <CheckCircle size={12} />
          <span>Aberta</span>
        </>
      ) : (
        <>
          <XCircle size={12} />
          <span>Fechada</span>
        </>
      )}
    </span>
  );
};

interface Evaluation {
  id: string;
  week: number;
  examScore: number;
  correctAnswers: number;
  wrongAnswers: number;
  totalScore: number;
  status: string;
  unit: {
    id: string;
    name: string;
  };
}

interface evaluationUnitInput {
  selectedUnit: string;
  correct: string;
  wrong: string;
  examScore: string;
  week: string;
}

export default function EvaluationUnits() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [filteredEvaluations, setFilteredEvaluations] = useState<Evaluation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
  const [expandedWeeks, setExpandedWeeks] = useState<Record<number, boolean>>({});
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterWeek, setFilterWeek] = useState<number | null>(null);
  const [sortAscending, setSortAscending] = useState(true);

  const { user, userRole } = useAuth();

  const fetchEvaluations = async () => {
    setIsLoading(true);
    try {
      // Check user role to determine what data to fetch
      if (user?.user?.user?.role === 'counselor' || user?.user?.user?.role === 'dbv') {
        // Counselor or DBV sees only their unit's DBVs
        const userId = user.user.user.id;
        
        const existingUnitResponse = 
          user?.user?.user?.role === 'counselor' 
          ? await unitsService.existCounselorUnit(userId)
          : await unitsService.existDbvUnit(userId);
      
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
        const data = await unitEvaluationService.ListAllEvaluation();
        
        // Filter evaluations for the specific unit
        const filteredEvaluations = data.evaluations.filter(
          (evaluation: Evaluation) => evaluation.unit.id === unitId
        );
  
  
        setEvaluations(filteredEvaluations);
        setFilteredEvaluations(filteredEvaluations);
      } else if (user?.user?.user?.role === 'admin' || 
        user?.user?.user?.role === 'director' ||
        user?.user?.user?.role === 'lead' ||
        user?.user?.user?.role === 'secretary'
      ) {
        // Admin and director see all evaluations
        const data = await unitEvaluationService.ListAllEvaluation();
        setEvaluations(data.evaluations);
        setFilteredEvaluations(data.evaluations);
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
        setEvaluations([]);
        setFilteredEvaluations([]);
      }
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
  }, [ user?.user?.user?.role, user?.user?.user?.id ]);

  useEffect(() => {
    let filtered = [...evaluations];
    
    if (filterStatus) {
      filtered = filtered.filter(evaluation => evaluation.status === filterStatus);
    }
    
    if (filterWeek !== null) {
      filtered = filtered.filter(evaluation => evaluation.week === filterWeek);
    }
    
    // Sort by week
    filtered.sort((a, b) => 
      sortAscending 
        ? a.week - b.week 
        : b.week - a.week
    );
    
    setFilteredEvaluations(filtered);
  }, [evaluations, filterStatus, filterWeek, sortAscending]);

  const toggleWeekExpansion = (week: number) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [week]: !prev[week]
    }));
  };

  const handleOpenCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation);
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (evaluation: Evaluation, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEvaluation(evaluation);
    setIsDeleteModalOpen(true);
  };

  const handleCreate = async (evaluationUnit: evaluationUnitInput) => {
    try {
      const data = {
        unitId: evaluationUnit.selectedUnit,
        evaluatedBy: user?.user.user.id,
        correctAnswers: Number(evaluationUnit.correct),
        wrongAnswers: Number(evaluationUnit.wrong),
        examScore: Number(evaluationUnit.examScore),
        week: Number(evaluationUnit.week)
      };
      await unitEvaluationService.createEvaluation(data);
      toast.success('Avaliação criada com sucesso!', {
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
      toast.error('Erro ao criar avaliação.', {
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
          correctAnswers: Number(data.correctAnswers),
          wrongAnswers: Number(data.wrongAnswers),
          examScore: Number(data.examScore),
        };
        await unitEvaluationService.updateEvaluation(selectedEvaluation.id, updatedData);
      
        toast.success(`Avaliação atualizada com sucesso`, {
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
        await unitEvaluationService.deleteEvaluation(selectedEvaluation.id);
        toast.success('Avaliação excluída com sucesso!', {
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
        toast.error(`Erro ao excluir avaliação: ${err}`, {
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
    setFilteredEvaluations(evaluations);
  };

  const toggleSortOrder = () => {
    setSortAscending(!sortAscending);
  };

  // Group evaluations by week
  const evaluationsByWeek = filteredEvaluations.reduce((acc, evaluation) => {
    if (!acc[evaluation.week]) {
      acc[evaluation.week] = [];
    }
    acc[evaluation.week].push(evaluation);
    return acc;
  }, {} as Record<number, Evaluation[]>);

  // Unique weeks for filter
  const uniqueWeeks = [...new Set(evaluations.map(e => e.week))].sort((a, b) => a - b);

  return (
    <>
      <PageMeta
        title="Avaliação de unidades | Luzeiros do Norte"
        description="Clube de Desbravadores - Avaliação de Unidades"
      />
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
                Gerenciar Avaliações
              </h1>
              <p className="text-gray-400 mt-1">
                Visualize, edite e organize as avaliações por unidade
              </p>
            </div>
            
            {( userRole === "admin" || userRole === "director" ) && (
              <Button onClick={handleOpenCreate} className="w-full md:w-auto">
                <Calendar size={18} />
                Nova avaliação
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
                <Book className="h-16 w-16 mx-auto mb-3 text-gray-600" />
                <h3 className="text-lg font-medium">Nenhuma avaliação encontrada</h3>
                <p className="mt-1">Tente ajustar seus filtros ou crie uma nova avaliação</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {Object.entries(evaluationsByWeek).map(([week, weekEvaluations]) => {
                  const isExpanded = expandedWeeks[Number(week)] !== false; // Default to expanded
                  
                  return (
                    <motion.div 
                      key={week}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800/50"
                    >
                      <div 
                        className="bg-gray-800 p-3 flex items-center justify-between cursor-pointer hover:bg-gray-750"
                        onClick={() => toggleWeekExpansion(Number(week))}
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-indigo-600 w-10 h-10 rounded-full flex items-center justify-center">
                            <Calendar size={18} />
                          </div>
                          <div>
                            <h3 className="font-medium">Rodada {week}</h3>
                            <p className="text-sm text-gray-400">{weekEvaluations.length} avaliações</p>
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
                            {weekEvaluations.map((evaluation) => (
                              <motion.div
                                key={evaluation.id}
                                whileHover={{ backgroundColor: "rgba(75, 85, 99, 0.2)" }}
                                className="p-4 cursor-pointer transition-colors duration-200"
                                onClick={() => {
                                  if (userRole === "admin" || userRole === "director") {
                                    handleOpenEdit(evaluation);
                                  }
                                }}
                              >
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                  <div className="md:col-span-5">
                                    <div className="flex items-start gap-3">
                                      <div className="bg-gray-700 p-2 rounded-lg">
                                        <Book size={20} className="text-indigo-400" />
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-lg">{evaluation.unit.name}</h4>
                                        <Badge status={evaluation.status as "open" | "closed"} />
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="md:col-span-5">
                                    <div className="grid grid-cols-2 gap-3">
                                      <div className="bg-gray-800/80 rounded-lg p-3 border border-gray-700">
                                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                                          <Award size={14} />
                                          <span>Pontuação do Exame</span>
                                        </div>
                                        <div className="text-xl font-semibold">{evaluation.examScore}</div>
                                      </div>
                                      
                                      <div className="bg-gray-800/80 rounded-lg p-3 border border-gray-700">
                                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                                          <Award size={14} />
                                          <span>Pontuação Total</span>
                                        </div>
                                        <div className="text-xl font-semibold">{evaluation.totalScore}</div>
                                      </div>
                                    </div>
                                    
                                    <div className="mt-3 grid grid-cols-2 gap-3">
                                      <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 rounded-full bg-green-500/20 flex items-center justify-center">
                                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                        </div>
                                        <span className="text-sm text-gray-300">
                                          {evaluation.correctAnswers} corretas
                                        </span>
                                      </div>
                                      
                                      <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 rounded-full bg-red-500/20 flex items-center justify-center">
                                          <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                        </div>
                                        <span className="text-sm text-gray-300">
                                          {evaluation.wrongAnswers} incorretas
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {(userRole === "admin" || userRole === "director") && (
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
          <CreateEvaUnitModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSave={handleCreate}
          />
        )}

        {/* Modal de Edição */}
        {isEditModalOpen && selectedEvaluation && (
          <EditEvaUnitModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleEditEvaluation}
            evaluation={selectedEvaluation}
          />
        )}

        {/* Modal de Exclusão */}
        {isDeleteModalOpen && selectedEvaluation && (
          <ConfirmDeleteEvaUnitModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirmDelete={handleDeleteEvaluation}
          />
        )}
      </div>
    </>
  );
}




// import { useEffect, useState } from "react";

// import Button from '../../components/ui/button/Button'
// import ComponentCard from '../../components/common/ComponentCard'
// import { toast } from 'react-hot-toast'
// import { Loader2, Trash2 } from "lucide-react";
// import { motion } from "framer-motion";
// import { unitEvaluationService } from "../../services/unitEvaluationService";
// import CreateEvaUnitModal from "../../components/EvaluationUnitComponents/CreateEvaUnitModal";
// import { useAuth } from "../../context/AuthContext";
// import ConfirmDeleteEvaUnitModal from "../../components/EvaluationUnitComponents/ConfirmDeleteEvaUnitModal";
// import EditEvaUnitModal from "../../components/EvaluationUnitComponents/EditEvaUnitModal";

// interface Evaluation {
//   id: string;
//   week: number;
//   examScore: number;
//   correctAnswers: number;
//   wrongAnswers: number;
//   totalScore: number;
//   status: string;
//   unit: {
//     id: string;
//     name: string;
//   };
// }

// interface evaluationUnitInput {
//   selectedUnit: string;
//   correct: string;
//   wrong: string;
//   examScore: string;
//   week: string
// }

// export default function evaluationUnits() {
//   const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);

//   const { user } = useAuth();
  
//   const fetchEvaluations = async () => {
//     setIsLoading(true);
//     try {
//       const data = await unitEvaluationService.ListAllEvaluation();
//       setEvaluations(data.evaluations);
//     } catch (err) {
//       toast.error("Erro ao carregar ranking", {position: 'bottom-right'});
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEvaluations();
//   }, []);

//   const handleOpenCreate = () => {
//     setIsCreateModalOpen(true);
//   };

//   const handleOpenEdit = (q: Evaluation) => {
//     setSelectedEvaluation(q);
//     setIsEditModalOpen(true);
//   };

//   const handleOpenDelete = (q: Evaluation) => {
//     setSelectedEvaluation(q);
//     setIsDeleteModalOpen(true);
//   };

//   const handleCreate = async (evaluationUnit: evaluationUnitInput) => {
//     try {
//       const data = {
//         unitId: evaluationUnit.selectedUnit,
//         evaluatedBy: user?.user.user.id,
//         correctAnswers: Number(evaluationUnit.correct),
//         wrongAnswers: Number(evaluationUnit.wrong),
//         examScore: Number(evaluationUnit.examScore),
//         week: Number(evaluationUnit.week)
//       }
//       await unitEvaluationService.createEvaluation(data);
//       toast.success('Avaliação criada com sucesso!', {
//         position: 'bottom-right',
//       });
//       setIsCreateModalOpen(false);
//       await fetchEvaluations();
//     } catch (err) {
//       toast.error('Erro ao criar avaliação.', {
//         position: 'bottom-right',
//       });
//     }
//   };

//   const handleEditEvaluation = async (data: any) => {
//     if (selectedEvaluation) {
//       try {
//         const updatedData = {
//           ...data,
//           correctAnswers: Number(data.correctAnswers),
//           wrongAnswers: Number(data.wrongAnswers),
//           examScore: Number(data.examScore),
//         };
//         await unitEvaluationService.updateEvaluation(selectedEvaluation.id, updatedData);
        
//         toast.success(`Avaliação atualizada com sucesso`, {
//           position: 'bottom-right',
//         });
        
//         setIsEditModalOpen(false);  
//         await fetchEvaluations();
      
//       } catch (err) {
//         toast.error(`Error na atualização ${err}`, {
//           position: 'bottom-right',
//         });
//       }
//     }
//   };

//   const handleDeleteEvaluation = async () => {
//     if (selectedEvaluation) {
//       try {
//         await unitEvaluationService.deleteEvaluation(selectedEvaluation.id);
//         toast.success('Avaliação excluída com sucesso!', {
//           position: 'bottom-right',
//         });
//         setIsDeleteModalOpen(false);
//         await fetchEvaluations();
//       } catch (err) {
//         toast.error(`Erro ao excluir avaliação ${err}`, {
//           position: 'bottom-right',
//         });
//       }
//     }
//   };

//   return (
//     <div className="p-6 space-y-4">
//       <div className="flex justify-between items-center">
//         <h2 className="text-xl font-bold">Gerenciar Avaliações</h2>
//         <Button variant="primary" onClick={handleOpenCreate}>
//           + Nova avaliação
//         </Button>
//       </div>

//       {isLoading ? (
//         <div className="flex justify-center py-6">
//           <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
//         </div>
//       ) : (
//         <motion.div 
//           layout
//           className="grid gap-4"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.3 }}
//         >
//           <ComponentCard title="Avaliações">
//             {evaluations.length === 0 && (
//               <p className="text-center text-gray-500">Nenhuma avaliação encontrada.</p>
//             )}
//             {evaluations.map((q) => (
//               <div key={q.id} className="flex justify-between items-center">
//                 <div onClick={() => handleOpenEdit(q)} className="cursor-pointer">
//                   <p className="text-base font-medium"> Unidade: {q.unit.name}</p>
//                   <p className="text-sm text-gray-500">Exame Score: {q.examScore} pontos</p>
//                   <p className="text-sm text-gray-500">Total: {q.totalScore} pontos</p>
//                   <p className="text-sm text-gray-500">Status: {q.status}</p>
//                   <p className="text-sm text-gray-500">Rodada: {q.week}</p>
//                 </div>
//                 <button onClick={() => handleOpenDelete(q)} className="text-red-500 hover:text-red-700">
//                   <Trash2 className="animate h-6 w-6 text-muted-foreground" />
//                 </button>
//               </div>
//             ))}
//           </ComponentCard>
//         </motion.div>
//       )}

//       {/* Modal de Criação */}
//       {isCreateModalOpen && (
//         <CreateEvaUnitModal
//           isOpen={isCreateModalOpen}
//           onClose={() => setIsCreateModalOpen(false)}
//           onSave={handleCreate}
//         />
//       )}

//       {/* Modal de Edição */}
//       {isEditModalOpen && selectedEvaluation &&(
//         <EditEvaUnitModal
//         isOpen={isEditModalOpen}
//         onClose={() => setIsEditModalOpen(false)}
//         onSave={handleEditEvaluation}
//         evaluation={selectedEvaluation}
//       />
//       )}

//       {/* Modal de Exclusão */}
//       {isDeleteModalOpen && selectedEvaluation &&(
//         <ConfirmDeleteEvaUnitModal
//         isOpen={isDeleteModalOpen}
//         onClose={() => setIsDeleteModalOpen(false)}
//         onConfirmDelete={handleDeleteEvaluation}
//       />
//       )}
//     </div>
//   );
// };
