import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Award, AlertCircle, CheckCircle, Clock, User, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { unitsService } from '../../services/unitsService';
import { individualEvaluationService } from '../../services/individualEvaluationService';
import { individualQuestionService } from '../../services/individualQuestionService';
import { individualAnswerService } from '../../services/individualAnswerService';


// Import components
//import { EvaluationCards } from './components/EvaluationCards'
import { AnswerModal } from './components/AnswerModal'
import { DeleteConfirmModal } from './components/DeleteConfirmModal'
import { LoadingSpinner } from '../../components/ui/loading/loading';
import { useAuth } from '../../context/AuthContext';
import PageMeta from '../../components/common/PageMeta';
import { ViewOnlyModal } from './components/ViewOnlyModal';


const ReportAnswerIndividual = () => {
  const { unitId, dbvId } = useParams();
  const navigate = useNavigate();

  const { user, userRole } = useAuth();
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [questions, setQuestions] = useState([]);
  interface DbvInfo {
    photoUrl?: string;
    name?: string;
  }

  const [dbvInfo, setDbvInfo] = useState<DbvInfo | null>(null);
  interface UnitInfo {
    name: string;
  }

  const [unitInfo, setUnitInfo] = useState<UnitInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenView, setModalOpenView] = useState(false);
  const [answers, setAnswers] = useState<Record<string, { text: string; observation?: string; id?: string }>>({});
  const [_allAnswers, setAllAnswers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<{ text: string; id?: string } | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    fetchData();
  }, [unitId, dbvId]);


  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch unit information
      if (!unitId) {
        throw new Error("unitId is undefined");
      }
      const unitResponse = await unitsService.getUnitById(unitId);
      if (unitResponse.success && unitResponse.unit?.unit) {
        setUnitInfo(unitResponse.unit.unit);
        
        // Find DBV information
        const dbvData = unitResponse.unit.unit.dbvs.find((item: { dbv: { id: string } }) => item.dbv.id === dbvId)?.dbv;
        if (dbvData) {
          setDbvInfo(dbvData);
        } else {
          toast.error("Desbravador não encontrado nesta unidade", {position: 'bottom-right'});
          setTimeout(() => navigate(-1), 3000);
          return;
        }
      }


      // Fetch evaluations
      await fetchEvaluations();
      
      // Fetch questions
      await fetchQuestions();
      
    } catch (error: any) {
      toast.error(`Error: ${error.message}`, {
          position: 'bottom-right',
          icon: '🚫',
          className: 'dark:bg-gray-800 dark:text-white',
          duration: 5000,
        });
      console.error("Erro: ", error);
    } finally {
      setIsLoading(false);
    }
  };


  const fetchEvaluations = async () => {
    try {
      if (!dbvId) {
        throw new Error("dbvId is undefined");
      }
      const data = await individualEvaluationService.ListEvaluationFromUser(dbvId);
      setEvaluations(data.evaluation || []);
    } catch (error: any) {
      console.error("Erro ao carregar avaliações:", error);
      toast.error(`Error: ${error.message}`, {
          position: 'bottom-right',
          icon: '🚫',
          className: 'dark:bg-gray-800 dark:text-white',
          duration: 5000,
        });
    }
  };


  const fetchQuestions = async () => {
    try {
      const data = await individualQuestionService.ListQuestions();
      setQuestions(data || []);
    } catch (error: any) {
      toast.error(`Error: ${error.message}`, {
          position: 'bottom-right',
          icon: '🚫',
          className: 'dark:bg-gray-800 dark:text-white',
          duration: 5000,
        });
      console.error("Erro: ", error);
    }
  };


  const fetchAnswers = async (week: number) => {
    try {
      if (!dbvId) {
        throw new Error("dbvId is undefined");
      }
      const data = await individualAnswerService.ListUserAnswer(dbvId);
      
      // Filter answers by week to get only answers for the selected evaluation
      const weekAnswers = data.filter((answer: { week: number; questionId: string; answer: string; id: string, observation: string }) => answer.week === week);
      setAllAnswers(weekAnswers);
      console.log("f", weekAnswers)
      
      // Create a map of questionId -> answer
      const evaluationAnswers: Record<string, { text: string; observation?: string; id: string }> = {};
      weekAnswers.forEach((answer: { week: number; questionId: string; answer: string; id: string, observation?: string }) => {
        evaluationAnswers[answer.questionId] = {
          text: answer.answer,
          id: answer.id,
          observation: answer.observation
        };
      });
      
      setAnswers(evaluationAnswers);
      return evaluationAnswers;
    } catch (error: any) {
      toast.error(`Error: ${error.message}`, {
          position: 'bottom-right',
          icon: '🚫',
          className: 'dark:bg-gray-800 dark:text-white',
          duration: 5000,
        });
      console.error("Erro: ", error);
    }
  };


  interface Evaluation {
    id: string;
    week: number;
    status: 'open' | 'closed';
    createdAt?: string;
  }

  const handleEvaluationClick = async (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation);


    if (evaluation.status === "open" || evaluation.status === "closed") {
      await fetchAnswers(evaluation.week);
      setModalOpen(true);
    }
  };

  const handleEvaluationClickView = async (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation);


    if (evaluation.status === "open" || evaluation.status === "closed") {
      await fetchAnswers(evaluation.week);
      setModalOpenView(true);
    }
  };

  const handleInputChange = (questionId: string, value: string, field: 'text' | 'observation') => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] || {}),
        [field]: value
      }
    }));
  };


  // const handleSubmitAnswers = async () => {
  //   if (!selectedEvaluation) return;
    
  //   try {
  //     setIsSubmitting(true);

  //     const answersToSubmit = Object.keys(answers).reduce((acc, questionId) => {
  //       const answer = answers[questionId];
  //       if (!answer.id && answer.text?.trim()) {
  //         acc[questionId] = answer;
  //       }
  //       return acc;
  //     }, {} as Record<string, any>);

  //      // Se não houver respostas para enviar
  //     if (Object.keys(answersToSubmit).length === 0) {
  //       toast.success("Nenhuma resposta nova para enviar", { position: 'bottom-right' });
  //       setModalOpen(false);
  //       return;
  //     }
    
  //     // For each question with an answer, send the answer
  //     const answersPromises = Object.keys(answersToSubmit).map(questionId => {
  //       const payload = {
  //         userId: dbvId,
  //         questionId,
  //         counselorId: user?.user.user.id,
  //         evaluationDate: new Date().toISOString(),
  //         answer: answers[questionId].text,
  //         week: selectedEvaluation.week || 1
  //       };

  //       return individualAnswerService.createAnswer(payload);
  //     });
    
  //     await Promise.all(answersPromises);
    
  //     toast.success("Respostas enviadas com sucesso!", {position: 'bottom-right'});
  //     setModalOpen(false);
  //     setIsSubmitting(false);
  //     fetchEvaluations(); // Update evaluations list
  //   } catch (error) {
  //     console.error("Erro ao enviar respostas:", error);
  //     toast.error("Erro ao enviar respostas. Tente novamente.", {position: 'bottom-right'});
  //     setIsSubmitting(false);
  //   } finally {
  //     setModalOpen(false);
  //     setIsSubmitting(false);
  //     fetchEvaluations();
  //   }
  // };

    const handleSubmitAnswers = async () => {
    if (!selectedEvaluation) return;

    try {
      setIsSubmitting(true);

      const answersToSubmit = Object.keys(answers).reduce((acc, questionId) => {
        const answer = answers[questionId];
        if (!answer.id && answer.text?.trim()) {
          acc[questionId] = answer;
        }
        return acc;
      }, {} as Record<string, any>);

      const totalAnswers = Object.keys(answersToSubmit).length;

      if (totalAnswers === 0) {
        toast.success("Nenhuma resposta nova para enviar", { position: 'bottom-right' });
        setModalOpen(false);
        return;
      }

      let current = 0;

      for (const questionId of Object.keys(answersToSubmit)) {
        const payload = {
          userId: dbvId,
          questionId,
          counselorId: user?.user.user.id,          
          observation: answers[questionId].observation || null,
          evaluationDate: new Date().toISOString(),
          answer: answers[questionId].text,
          week: selectedEvaluation.week || 1
        };

        await individualAnswerService.createAnswer(payload);

        current++;
        const progress = (current / totalAnswers) * 100;
        setProgress(progress); // Atualiza a barra de progresso
      }

      toast.success("Respostas enviadas com sucesso!", { position: 'bottom-right' });
      setModalOpen(false);
      fetchEvaluations();

    } catch (error: any) {
      toast.error(`Error: ${error.message}`, {
          position: 'bottom-right',
          icon: '🚫',
          className: 'dark:bg-gray-800 dark:text-white',
          duration: 5000,
        });
      console.error("Erro: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };



  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEvaluation(null);
    setAnswers({});
  };

    const handleCloseModalView = () => {
    setModalOpenView(false);
    setSelectedEvaluation(null);
    setAnswers({});
  };


  const handleOpenDelete = (questionId: string) => {
    const answer = answers[questionId];
    if (answer && answer.id) {
      setSelectedAnswer(answer);
      setIsDeleteModalOpen(true);
    } else {
      toast.error("Esta resposta ainda não foi salva", {position: 'bottom-right'});
    }
  };


  const handleDelete = async () => {
    if (selectedAnswer && selectedAnswer.id) {
      try {
        await individualAnswerService.deleteAnswer(selectedAnswer.id);
        toast.success("Resposta excluída com sucesso!", {position: 'bottom-right'});
        setIsDeleteModalOpen(false);
        
        // Refresh answers for the current evaluation
        if (selectedEvaluation) {
          await fetchAnswers(selectedEvaluation.week);
        }
      } catch (error: any) {
      toast.error(`Error: ${error.message}`, {
          position: 'bottom-right',
          icon: '🚫',
          className: 'dark:bg-gray-800 dark:text-white',
          duration: 5000,
        });
      console.error("Erro: ", error);
      }
    }
  };


  if (isLoading) {
    return <LoadingSpinner />;
  }


  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };


  const getStatusColor = (status: 'open' | 'closed' | 'pending') => {
    switch (status) {
      case 'open': return 'text-green-400';
      case 'closed': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };


  const getStatusIcon = (status: 'open' | 'closed' | 'pending') => {
    switch (status) {
      case 'open': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'closed': return <AlertCircle className="w-5 h-5 text-red-400" />;
      default: return <Clock className="w-5 h-5 text-yellow-400" />;
    }
  };


  return (
    <>
      <PageMeta
        title="Avaliações individuais dos desbravadores | Luzeiros do Norte"
        description="Clube de Desbravadores - Avaliação individual"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Voltar para lista de desbravadores
            </button>
          
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:flex-shrink-0 bg-gradient-to-br from-yellow-500 to-red-600 p-6 flex justify-center items-center">
                  {dbvInfo?.photoUrl ? (
                    <img
                      src={dbvInfo.photoUrl}
                      alt={dbvInfo.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white"
                    />
                  ) : (
                    <User className="w-24 h-24 text-white p-4 bg-yellow-600/50 rounded-full" />
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <Award className="w-5 h-5 text-yellow-500 mr-2" />
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                      {dbvInfo?.name || 'Desbravador'}
                    </h2>
                  </div>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-4">
                    <Building2 className="w-4 h-4 mr-1" />
                    <span>{unitInfo?.name || 'Unidade'}</span>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-3">
                    <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
                      <span className="font-medium">ID: </span>
                      <span className="text-gray-600 dark:text-gray-400">{(dbvId ?? '').substring(0, 8)}...</span>
                    </div>
                    
                    {evaluations.length > 0 && (
                      <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1.5" />
                        <span>{evaluations.length} avaliações</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>


          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-500" />
              Avaliações Individuais
            </h2>
          
            {evaluations.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-md"
              >
                <Calendar className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Nenhuma avaliação disponível</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
                  Não há avaliações cadastradas para este desbravador no momento.
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {evaluations.map((evaluation: Evaluation) => (
                    <motion.div 
                      key={evaluation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700 cursor-pointer"
                      onClick={() => {
                        if (userRole === "admin" || userRole === "director" || userRole === "counselor"){
                          handleEvaluationClick(evaluation)
                        } else {
                          handleEvaluationClickView(evaluation)
                        }
                      }}
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <Calendar className="w-5 h-5 text-yellow-500 mr-2" />
                            <h3 className="font-semibold text-gray-800 dark:text-white">
                              Rodada {evaluation.week}
                            </h3>
                          </div>
                          <div className={`flex items-center ${getStatusColor(evaluation.status)}`}>
                            {getStatusIcon(evaluation.status)}
                            <span className="text-sm ml-1 capitalize">
                              {evaluation.status === 'open' ? 'Aberta' : 'Fechada'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {evaluation.createdAt ? new Date(evaluation.createdAt).toLocaleDateString('pt-BR') : 'Data não disponível'}
                          </p>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                          { userRole === "admin" || userRole === "director" || userRole === "counselor" ?
                            <button className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-colors text-sm font-medium">
                              {evaluation.status === 'open' ? 'Responder Avaliação' : 'Visualizar Respostas'}
                            </button>
                          :
                            <button className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-colors text-sm font-medium">
                              Visualizar Respostas
                            </button>
                          }
                        
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>


        {/* Answer Modal */}
        {modalOpen && ( userRole === "admin" || userRole === "director" || userRole === "counselor") && (
            <AnswerModal
              isOpen={modalOpen}
              evaluation={selectedEvaluation}
              questions={questions}
              answers={answers}
              isSubmitting={isSubmitting}
              onClose={handleCloseModal}
              progress={progress}
              onSubmit={handleSubmitAnswers}
              onInputChange={handleInputChange}
              onDeleteClick={handleOpenDelete}
            />
          )}

          {modalOpenView && (
            <ViewOnlyModal
            isOpen={modalOpenView}
            evaluation={selectedEvaluation}
            questions={questions}
            answers={answers}
            onClose={handleCloseModalView}
            />
          )}
          
        

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          answer={selectedAnswer}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
        />
      </div>
    </>
  );
};


export default ReportAnswerIndividual;
