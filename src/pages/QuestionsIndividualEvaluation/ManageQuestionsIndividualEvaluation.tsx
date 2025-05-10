import React, { useEffect, useState, ReactNode } from "react";
import { Modal } from '../../components/ui/modal';
import Input from '../../components/form/input/InputField';
import { toast } from 'react-hot-toast';
import { 
  Loader2, 
  Trash2, 
  Search, 
  Plus, 
  Edit2, 
  HelpCircle, 
  X, 
  AlertTriangle, 
  Check, 
  Award, 
  ArrowUp, 
  ArrowDown,
  Hash
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { individualQuestionService } from "../../services/individualQuestionService";
import { useAuth } from "../../context/AuthContext";

const variants = {
  primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
  secondary: "bg-gray-700 hover:bg-gray-800 text-white",
  outline: "bg-transparent border border-gray-600 hover:bg-gray-800 text-gray-300",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  ghost: "bg-transparent hover:bg-gray-800 text-gray-300",
};

const Button = ({ children, variant = "primary", className = "", ...props }: { children: ReactNode; variant?: keyof typeof variants; className?: string; [key: string]: any }) => {

  return (
    <button
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Custom Card Component
const Card: React.FC<{ className?: string; [key: string]: any }> = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`bg-gray-800 border border-gray-700 rounded-xl shadow-lg ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

interface Question {
  id: string;
  question: string;
  points: number;
}

const ManageQuestionsIndividualEvaluation = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [form, setForm] = useState({ question: "", points: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"
  const [sortBy, setSortBy] = useState("points"); // "points" or "question"

  const { userRole } = useAuth()

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const data = await individualQuestionService.ListQuestions();
      setQuestions(data);
      setFilteredQuestions(data);
    } catch (err) {
      toast.error("Erro ao carregar perguntas.", {
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
    fetchQuestions();
  }, []);

  useEffect(() => {
    // Filter questions based on search query
    const filtered = questions.filter(q => 
      q.question.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Sort questions
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "points") {
        return sortOrder === "asc" ? a.points - b.points : b.points - a.points;
      } else {
        return sortOrder === "asc" 
          ? a.question.localeCompare(b.question) 
          : b.question.localeCompare(a.question);
      }
    });
    
    setFilteredQuestions(sorted);
  }, [questions, searchQuery, sortOrder, sortBy]);

  const handleOpenCreate = () => {
    setForm({ question: "", points: 0 });
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (q: Question) => {
    setSelectedQuestion(q);
    setForm({ question: q.question, points: q.points });
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (q: Question, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedQuestion(q);
    setIsDeleteModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "points" ? Number(value) : value,
    }));
  };

  const handleCreate = async () => {
    if (!form.question.trim()) {
      toast.error("A pergunta não pode estar vazia.", {
        position: 'bottom-right',
        icon: '❌',
        style: {
          backgroundColor: '#1F2937',
          color: '#F9FAFB',
          border: '1px solid #374151',
        },
      });
      return;
    }

    try {
      await individualQuestionService.createQuestion(form);
      toast.success("Questão criada com sucesso!", {
        position: 'bottom-right',
        icon: '✅',
        style: {
          backgroundColor: '#1F2937',
          color: '#F9FAFB',
          border: '1px solid #374151',
        },
      });
      setIsCreateModalOpen(false);
      await fetchQuestions();
    } catch (err) {
      toast.error("Erro ao criar questão.", {
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

  const handleEdit = async () => {
    if (!form.question.trim()) {
      toast.error("A pergunta não pode estar vazia.", {
        position: 'bottom-right',
        icon: '❌',
        style: {
          backgroundColor: '#1F2937',
          color: '#F9FAFB',
          border: '1px solid #374151',
        },
      });
      return;
    }

    if (selectedQuestion) {
      try {
        await individualQuestionService.updateQuestion(selectedQuestion.id, form);
        toast.success("Questão atualizada com sucesso!", {
          position: 'bottom-right',
          icon: '✅',
          style: {
            backgroundColor: '#1F2937',
            color: '#F9FAFB',
            border: '1px solid #374151',
          },
        });
        setIsEditModalOpen(false);
        await fetchQuestions();
      } catch (err) {
        toast.error("Erro ao atualizar questão.", {
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

  const handleDelete = async () => {
    if (selectedQuestion) {
      try {
        await individualQuestionService.deleteQuestion(selectedQuestion.id);
        toast.success("Questão excluída com sucesso!", {
          position: 'bottom-right',
          icon: '✅',
          style: {
            backgroundColor: '#1F2937',
            color: '#F9FAFB',
            border: '1px solid #374151',
          },
        });
        setIsDeleteModalOpen(false);
        await fetchQuestions();
      } catch (err) {
        toast.error("Erro ao excluir questão.", {
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

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
  };

  const changeSortBy = (field: "points" | "question") => {
    if (sortBy === field) {
      toggleSortOrder();
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05 
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Gerenciar Perguntas
            </h1>
            <p className="text-gray-400 mt-1">
              Crie, edite e gerencie suas perguntas de avaliação
            </p>
          </div>
          
          {(userRole === "admin" || userRole === "director") && (
              <Button onClick={handleOpenCreate} className="w-full md:w-auto">
              <Plus size={18} />
              Nova Pergunta
            </Button>
          )}
          
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-lg"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar perguntas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant={sortBy === "question" ? "primary" : "outline"} 
                className="text-sm py-1"
                onClick={() => changeSortBy("question")}
              >
                Texto
                {sortBy === "question" && (
                  sortOrder === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />
                )}
              </Button>
              
              <Button 
                variant={sortBy === "points" ? "primary" : "outline"} 
                className="text-sm py-1"
                onClick={() => changeSortBy("points")}
              >
                Pontos
                {sortBy === "points" && (
                  sortOrder === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Questions List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <Loader2 className="h-10 w-10 text-indigo-500" />
            </motion.div>
          </div>
        ) : (
          <Card className="p-0 overflow-hidden">
            <div className="p-4 bg-gray-750 border-b border-gray-700 flex justify-between items-center">
              <h3 className="font-medium text-lg flex items-center gap-2">
                <HelpCircle size={18} className="text-indigo-400" />
                Perguntas
              </h3>
              <span className="bg-gray-700 px-2 py-1 rounded-md text-sm">
                {filteredQuestions.length} {filteredQuestions.length === 1 ? 'pergunta' : 'perguntas'}
              </span>
            </div>
            
            {filteredQuestions.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                <HelpCircle className="h-12 w-12 mx-auto mb-3 text-gray-600" />
                <h3 className="text-lg font-medium">Nenhuma pergunta encontrada</h3>
                <p className="mt-1">Crie uma nova pergunta ou ajuste seus filtros de busca</p>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="divide-y divide-gray-700/40"
              >
                {filteredQuestions.map((q) => (
                  <motion.div
                    key={q.id}
                    variants={itemVariants}
                    whileHover={{ backgroundColor: "rgba(75, 85, 99, 0.3)" }}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors duration-200 cursor-pointer"
                    onClick={() => {
                      if (userRole === "admin" || userRole === "director") {
                        handleOpenEdit(q);
                      }
                    }}
                  >
                    <div className="flex-grow">
                      <div className="flex items-center gap-3">
                        <div className="hidden sm:flex h-10 w-10 rounded-full bg-indigo-600/20 items-center justify-center flex-shrink-0">
                          <HelpCircle size={18} className="text-indigo-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-base sm:text-lg line-clamp-2">{q.question}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1 bg-indigo-900/30 border border-indigo-800/50 text-indigo-300 rounded-md px-2 py-0.5 text-xs">
                              <Award size={12} />
                              <span>{q.points} {q.points === 1 ? 'ponto' : 'pontos'}</span>
                            </div>
                            <div className="flex items-center gap-1 bg-gray-800/80 border border-gray-700 rounded-md px-2 py-0.5 text-xs text-gray-400">
                              <Hash size={12} />
                              <span>{q.id.substring(0, 8)}...</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {(userRole === "admin" || userRole === "director") && (
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Button 
                          variant="outline" 
                          className="p-2 sm:p-2.5 flex-1 sm:flex-initial"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            handleOpenEdit(q);
                          }}
                        >
                          <Edit2 size={16} className="text-indigo-400" />
                          <span className="sm:hidden">Editar</span>
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          className="p-2 sm:p-2.5 flex-1 sm:flex-initial"
                          onClick={(e: React.MouseEvent) => handleOpenDelete(q, e)}
                        >
                          <Trash2 size={16} className="text-red-400" />
                          <span className="sm:hidden">Excluir</span>
                        </Button>
                      </div>
                    )}  
                  </motion.div>
                ))}
              </motion.div>
            )}
          </Card>
        )}
      </div>

      {/* Modal de Criação */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="p-6 space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Plus size={18} className="text-indigo-400" />
                  Nova Pergunta
                </h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Pergunta</label>
                  <Input 
                    name="question" 
                    placeholder="Digite a pergunta" 
                    value={form.question} 
                    onChange={handleChange} 
                    className="w-full bg-gray-700 text-white border-gray-600 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Pontos</label>
                  <Input 
                    type="number" 
                    name="points" 
                    placeholder="0" 
                    value={form.points} 
                    onChange={handleChange} 
                    className="w-full bg-gray-700 text-white border-gray-600 focus:border-indigo-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button onClick={() => setIsCreateModalOpen(false)} variant="outline">
                  Cancelar
                </Button>
                <Button onClick={handleCreate} variant="primary">
                  <Plus size={18} />
                  Criar
                </Button>
              </div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Modal de Edição */}
      <AnimatePresence>
        {isEditModalOpen && (
          <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="p-6 space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Edit2 size={18} className="text-indigo-400" />
                  Editar Pergunta
                </h3>
                <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Pergunta</label>
                  <Input
                    name="question"
                    placeholder="Digite a pergunta"
                    value={form.question}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-white border-gray-600 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Pontos</label>
                  <Input
                    type="number"
                    name="points"
                    placeholder="0"
                    value={form.points}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-white border-gray-600 focus:border-indigo-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button onClick={() => setIsEditModalOpen(false)} variant="outline">
                  Cancelar
                </Button>
                <Button onClick={handleEdit} variant="primary">
                  <Check size={18} />
                  Salvar
                </Button>
              </div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Modal de Exclusão */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="p-6 space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-red-500">
                  <AlertTriangle size={18} />
                  Confirmar Exclusão
                </h3>
                <button onClick={() => setIsDeleteModalOpen(false)} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              
              <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-4 text-red-100">
                <p>Tem certeza que deseja excluir a pergunta:</p>
                <p className="font-medium mt-2 break-words">{selectedQuestion?.question}</p>
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button onClick={() => setIsDeleteModalOpen(false)} variant="outline">
                  Cancelar
                </Button>
                <Button onClick={handleDelete} variant="danger">
                  <Trash2 size={18} />
                  Excluir
                </Button>
              </div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageQuestionsIndividualEvaluation;


