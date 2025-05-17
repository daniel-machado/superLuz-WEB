// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useParams, useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { unitEvaluationService } from '../../services/unitEvaluationService';
// import { unitQuestionService } from '../../services/unitQuestionService';
// import { unitAnswerService } from '../../services/unitAnswerService';
// import { useAuth } from '../../context/AuthContext';
// import { Unit } from '../../dtos/UnitDTO';
// import { 
//   ArrowLeft, 
//   Calendar, 
//   ChevronRight, 
//   Star, 
//   Clock, 
//   Trash2, 
//   AlertCircle,
//   CheckCircle,
//   XCircle,
//   BarChart,
//   FileText,
//   Users
// } from 'lucide-react';


// // Types
// import { Evaluation, Question, Answer } from './@types';

// // Componente principal
// const reportAnswerUnit = ({ }) => {
//   const [modalOpen, setModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [evaluations, setEvaluations] = useState<Evaluation[] | null>([]);
//   const [questions, setQuestions] = useState<Question[] | null>([]);
//   const [unit, setUnit] = useState<Unit | null>(null);
//   const [answers, setAnswers] = useState<{ [key: string]: { text: string; id?: string } }>({});
//   const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
//   const [selectedAnswer, setSelectedAnswer] = useState<{ text: string; id?: string } | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [currentAnswers, setCurrentAnswers] = useState({});
//   const [allAnswers, setAllAnswers] = useState<Answer[]>([]);
//   const [activeTab, setActiveTab] = useState('evaluations');
//   const [isLoading, setIsLoading] = useState(true);

//   const { unitId } = useParams();
//   const navigate = useNavigate();
//   const { units } = useAuth();

//   useEffect(() => {
//     if (units) {
//       const currentUnit = units.find(u => u.id === unitId);
//       setUnit(currentUnit || null);
//     }
  
//     fetchEvaluations();
//     fetchQuestions();
//   }, [unitId, units]);

//   const fetchEvaluations = async () => {
//     try {
//       setIsLoading(true);
//       const data = await unitEvaluationService.ListEvaluationFromUnit(unitId as string);
//       console.log("Avaliações:", data);
//       setEvaluations(data.evaluation);
//       setIsLoading(false);
//     } catch (error) {
//       console.error("Erro ao carregar avaliações:", error);
//       toast.error("Erro ao carregar avaliações da unidade", {position: 'bottom-right'});
//       setIsLoading(false);
//     }
//   };

//   const fetchQuestions = async () => {
//     setIsLoading(true);
//     try {
//       const data = await unitQuestionService.ListQuestions();
//       setQuestions(data);
//       setIsLoading(false);
//     } catch (error) {
//       console.error("Erro ao carregar perguntas:", error);
//       toast.error("Erro ao carregar perguntas", {position: 'bottom-right'});
//     } finally{
//       setIsLoading(false);
//     }
//   };

//   const fetchAnswers = async (evaluationId: string, week: number) => {
//     setIsLoading(true);
//     console.log("EvaluationId", evaluationId);
//     try {
//       const data = await unitAnswerService.ListUnitAnswer(unitId as string);
      
//       // Filter answers by week to get only answers for the selected evaluation
//       const weekAnswers: Answer[] = data.filter((answer: Answer) => answer.week === week);
//       setAllAnswers(weekAnswers);
      
//       // Create a map of questionId -> answer
//       const evaluationAnswers: { [key: string]: { text: string; id: string } } = {};
//       weekAnswers.forEach((answer) => {
//         evaluationAnswers[answer.questionId] = {
//           text: answer.answer,
//           id: answer.id
//         };
//       });
      
//       setAnswers(evaluationAnswers);
//       setIsLoading(false);
//       return evaluationAnswers;
//     } catch (error) {
//       console.error("Erro ao carregar respostas:", error);
//       toast.error("Erro ao carregar respostas anteriores", {position: 'bottom-right'});
//       return {};
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   // Handlers
//   const handleEvaluationClick = async (evaluation: Evaluation) => {
//     setSelectedEvaluation(evaluation);
//     if (evaluation.status === "open" || evaluation.status === "closed") {
//       await fetchAnswers(evaluation.id, evaluation.week);
//       setModalOpen(true);
//     }
//   };

//   const handleCloseModal = () => {
//     setModalOpen(false);
//     setSelectedEvaluation(null);
//     setAnswers({});
//   };


//   const handleInputChange = (questionId: string, value: string) => {
//     setCurrentAnswers(prev => ({
//       ...prev,
//       [questionId]: value
//     }));

//     // setAnswers(prev => ({
//     //   ...prev,
//     //   [questionId]: {
//     //     ...(prev[questionId] || {}),
//     //     text: value
//     //   }
//     // }));
//   };

//   const handleSubmitAnswers = async () => {
//     if (!selectedEvaluation) return;

//     try {
//       setIsSubmitting(true);
    
//       // For each question with an answer, send the answer
//       const answersPromises = Object.keys(answers).map(questionId => {
//         // Skip if empty answer
//         if (!answers[questionId]?.text?.trim()) return Promise.resolve();
        
//         const payload = {
//           unitId,
//           questionId,
//           answer: answers[questionId].text,
//           week: selectedEvaluation.week || 1
//         };
        
//         return unitAnswerService.createAnswer(payload);

//       });
    
//       await Promise.all(answersPromises.filter(Boolean));
    
//       toast.success("Respostas enviadas com sucesso!", {position: 'bottom-right'});
//       setModalOpen(false);
//       setIsSubmitting(false);
//       fetchEvaluations(); 
//     } catch (error) {
//       console.error("Erro ao enviar respostas:", error);
//       toast.error("Erro ao enviar respostas. Tente novamente.", {position: 'bottom-right'});
//       setIsSubmitting(false);
//     } finally{
//       setModalOpen(false);
//       setIsSubmitting(false);
//       fetchEvaluations();
//     }
//     // setIsSubmitting(true);
//     // // Simulação de envio
//     // await new Promise(resolve => setTimeout(resolve, 1000));
//     // setIsSubmitting(false);
//     // setModalOpen(false);
//   };

//   const handleOpenDelete = (questionId: string) => {
//     const answer = answers[questionId];
//     if (answer && answer.id) {
//       setSelectedAnswer(answer);
//       setIsDeleteModalOpen(true);
//     } else {
//       toast.error("Esta resposta ainda não foi salva", {position: 'bottom-right'});
//     }
//   };

//   const handleDelete = async () => {
//     if (selectedAnswer && selectedAnswer.id) {
//       try {
//         await unitAnswerService.deleteAnswer(selectedAnswer.id);
//         toast.success("Resposta excluída com sucesso!", {position: 'bottom-right'});
//         setIsDeleteModalOpen(false);
        
//         // Refresh answers for the current evaluation
//         if (selectedEvaluation) {
//           await fetchAnswers(selectedEvaluation.id, selectedEvaluation.week);
//         }
//       } catch (err) {
//         toast.error(`Erro ao excluir: ${err}`, { position: 'bottom-right' });
//       }
//     }
//   };


//   // Variantes de animação
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: { 
//       opacity: 1,
//       transition: { 
//         staggerChildren: 0.1
//       }
//     }
//   };


//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: { 
//       y: 0, 
//       opacity: 1,
//       transition: { 
//         type: "spring",
//         stiffness: 100
//       }
//     }
//   };


//   // Calcular estatísticas gerais
//   const stats = React.useMemo(() => {
//     if (!evaluations || evaluations.length === 0) {
//       return {
//         avgScore: 0,
//         totalEvaluations: 0,
//         pendingEvaluations: 0,
//         completedEvaluations: 0
//       };
//     }


//     const totalEvaluations = evaluations.length;
//     const completedEvaluations = evaluations.filter(e => e.status === 'completed').length;
//     const avgScore = evaluations.reduce((acc, curr) => acc + Number(curr.totalScore), 0) / totalEvaluations;

//     return {
//       avgScore: Math.round(avgScore * 10) / 10,
//       totalEvaluations,
//       pendingEvaluations: totalEvaluations - completedEvaluations,
//       completedEvaluations
//     };
//   }, [evaluations]);

//   return (
//     <div className="container mx-auto px-4 py-6 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200">
//       {/* Header Section */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="mb-6"
//       >
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-4 transition-colors group"
//         >
//           <ArrowLeft className="w-5 h-5 mr-1 group-hover:transform group-hover:-translate-x-1 transition-transform" />
//           <span className="font-medium">Voltar para unidades</span>
//         </button>
     
//         <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
//           <div className="flex items-center gap-4">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.8 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//               className="w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg flex-shrink-0 bg-gray-200 dark:bg-gray-700"
//             >
//               {unit?.photo ? (
//                 <img
//                   src={unit.photo}
//                   alt={unit?.name || 'Unidade'}
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <Users className="w-full h-full p-2 text-gray-400" />
//               )}
//             </motion.div>
//             <div>
//               <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
//                 {unit?.name || 'Unidade'}
//               </h1>
//               <p className="text-gray-600 dark:text-gray-400 mt-1">{unit?.id || 'Carregando informações...'}</p>
//             </div>
//           </div>
//           <motion.div 
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5, delay: 0.3 }}
//             className="flex flex-wrap gap-4"
//           >
//             <StatCard 
//               icon={<BarChart className="w-5 h-5 text-blue-500" />}
//               label="Média Geral"
//               value={`${stats.avgScore}`}
//             />
//             <StatCard 
//               icon={<CheckCircle className="w-5 h-5 text-green-500" />}
//               label="Avaliações"
//               value={stats.totalEvaluations}
//             />
//           </motion.div>
//         </div>
//       </motion.div>


//       {/* Tabs */}
//       <div className="mb-6">
//         <div className="flex border-b border-gray-200 dark:border-gray-700">
//           <TabButton 
//             isActive={activeTab === 'evaluations'} 
//             onClick={() => setActiveTab('evaluations')}
//             icon={<FileText className="w-4 h-4 mr-2" />}
//             label="Avaliações"
//           />
//           <TabButton 
//             isActive={activeTab === 'statistics'} 
//             onClick={() => setActiveTab('statistics')} 
//             icon={<BarChart className="w-4 h-4 mr-2" />}
//             label="Estatísticas"
//           />
//         </div>
//       </div>


//       {/* Main Content */}
//       <AnimatePresence mode="wait">
//         {activeTab === 'evaluations' && (
//           <motion.div
//             key="evaluations"
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             transition={{ duration: 0.3 }}
//             className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
//           >
//             <div className="p-6">
//               <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
//                 <FileText className="w-5 h-5 mr-2 text-blue-500" />
//                 Relatórios e Avaliações
//               </h2>
//             </div>
         
//             {!evaluations || evaluations.length === 0 ? (
//               <motion.div
//                 variants={itemVariants}
//                 initial="hidden"
//                 animate="visible"
//                 className="text-center py-10 px-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-100 dark:border-gray-700"
//               >
//                 <Calendar className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
//                 <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Nenhuma avaliação disponível</h3>
//                 <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-md mx-auto">
//                   Não há avaliações cadastradas para esta unidade. Quando disponíveis, elas aparecerão aqui.
//                 </p>
//               </motion.div>
//             ) : (
//               <motion.div 
//                 variants={containerVariants}
//                 initial="hidden"
//                 animate="visible"
//                 className="divide-y divide-gray-100 dark:divide-gray-700"
//               >
//                 {evaluations.map((evaluation) => (
//                   <EvaluationItem 
//                     key={evaluation.id}
//                     evaluation={evaluation}
//                     onClick={() => handleEvaluationClick(evaluation)}
//                   />
//                 ))}
//               </motion.div>
//             )}
//           </motion.div>
//         )}


//         {activeTab === 'statistics' && (
//           <motion.div
//             key="statistics"
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             transition={{ duration: 0.3 }}
//             className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
//           >
//             <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
//               <BarChart className="w-5 h-5 mr-2 text-blue-500" />
//               Estatísticas e Desempenho
//             </h2>
            
//             <motion.div 
//               variants={containerVariants}
//               initial="hidden"
//               animate="visible"
//               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
//             >
//               <StatisticsCard 
//                 title="Avaliações Completas"
//                 value={stats.completedEvaluations}
//                 icon={<CheckCircle className="w-6 h-6 text-green-500" />}
//                 color="bg-green-50 dark:bg-green-900/20"
//               />
              
//               <StatisticsCard 
//                 title="Avaliações Pendentes"
//                 value={stats.pendingEvaluations}
//                 icon={<Clock className="w-6 h-6 text-orange-500" />}
//                 color="bg-orange-50 dark:bg-orange-900/20"
//               />
              
//               <StatisticsCard 
//                 title="Média de Pontuação"
//                 value={`${stats.avgScore}`}
//                 icon={<Star className="w-6 h-6 text-yellow-500" />}
//                 color="bg-yellow-50 dark:bg-yellow-900/20"
//               />
              
//               <StatisticsCard 
//                 title="Total de Questões"
//                 value={questions?.length || 0}
//                 icon={<FileText className="w-6 h-6 text-blue-500" />}
//                 color="bg-blue-50 dark:bg-blue-900/20"
//               />
//             </motion.div>
            
//             {evaluations && evaluations.length > 0 && (
//               <motion.div
//                 variants={itemVariants}
//                 className="mt-8"
//               >
//                 <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Desempenho por Semana</h3>
//                 <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg h-64 flex items-center justify-center">
//                   <p className="text-gray-500 dark:text-gray-400 text-center">
//                     Gráfico de desempenho seria exibido aqui, utilizando os dados das avaliações semanais.
//                   </p>
//                 </div>
//               </motion.div>
//             )}
//           </motion.div>
//         )}
//       </AnimatePresence>


//       {/* Answer Modal */}
//       <AnimatePresence>
//         {modalOpen && (
//           <Modal
//             isOpen={modalOpen}
//             onClose={handleCloseModal}
//             title={`Avaliação Semana ${selectedEvaluation?.week || '-'}`}
//           >
//             <div className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <StatBox
//                   label="Pontuação Total"
//                   value={`${selectedEvaluation?.totalScore || 0}%`}
//                   icon={<Star className="text-yellow-500" />}
//                 />
//                 <StatBox
//                   label="Respostas Corretas"
//                   value={selectedEvaluation?.correctAnswers || 0}
//                   icon={<CheckCircle className="text-green-500" />}
//                 />
//                 <StatBox
//                   label="Respostas Incorretas"
//                   value={selectedEvaluation?.wrongAnswers || 0}
//                   icon={<XCircle className="text-red-500" />}
//                 />
//                 <StatBox
//                   label="Nota do Exame"
//                   value={selectedEvaluation?.examScore || 0}
//                   icon={<FileText className="text-blue-500" />}
//                 />
//               </div>


//               <div className="mt-6 space-y-6">
//                 <h3 className="text-lg font-medium text-gray-800 dark:text-white">Questões da Avaliação</h3>
                
//                 {questions && questions.length > 0 ? (
//                   <div className="space-y-4">
//                     {questions.map((question) => {
//                       const existingAnswer = answers[question.id] 
//                       return (
//                         <div key={question.id} className="p-4 border rounded-lg dark:border-gray-700">
//                           <div className="flex justify-between items-start">
//                             <div>
//                               <h4 className="font-medium text-gray-800 dark:text-gray-200">
//                                 {question.question} 
//                                 <span className="ml-2 text-sm text-gray-500">({question.points} pontos)</span>
//                               </h4>
//                               {question.description && (
//                                 <p className="text-sm text-gray-500 mt-1">{question.description}</p>
//                               )}
//                             </div>
//                             {existingAnswer && (
//                               <button 
//                                 onClick={() => handleOpenDelete(existingAnswer.id || '')}
//                                 className="text-red-500 hover:text-red-700"
//                               >
//                                 <Trash2 className="w-5 h-5" />
//                               </button>
//                             )}
//                           </div>


//                           <div className="mt-3">
//                             {question.typeQuestion === "text" && (
//                               <input
//                                 type="text"
//                                 defaultValue={existingAnswer?.text || ""}
//                                 onChange={(e) => handleInputChange(question.id, e.target.value)}
//                                 className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
//                                 placeholder="Digite sua resposta..."
//                               />
//                             )}


//                             {question.typeQuestion === "number" && (
//                               <input
//                                 type="number"
//                                 defaultValue={existingAnswer?.text || ""}
//                                 onChange={(e) => handleInputChange(question.id, e.target.value)}
//                                 className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
//                                 placeholder="Digite um número..."
//                               />
//                             )}


//                             {question.typeQuestion === "yes_no" && (
//                               <div className="flex space-x-4 mt-2">
//                                 <label className="inline-flex items-center">
//                                   <input
//                                     type="radio"
//                                     name={`question-${question.id}`}
//                                     value="sim"
//                                     checked={existingAnswer?.text === "sim"}
//                                     onChange={(e) => handleInputChange(question.id, e.target.value)}
//                                     className="h-4 w-4 text-blue-600"
//                                   />
//                                   <span className="ml-2 dark:text-gray-300">Sim</span>
//                                 </label>
//                                 <label className="inline-flex items-center">
//                                   <input
//                                     type="radio"
//                                     name={`question-${question.id}`}
//                                     value="não"
//                                     checked={existingAnswer?.text === "não"}
//                                     onChange={(e) => handleInputChange(question.id, e.target.value)}
//                                     className="h-4 w-4 text-blue-600"
//                                   />
//                                   <span className="ml-2 dark:text-gray-300">Não</span>
//                                 </label>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 ) : (
//                   <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
//                     <AlertCircle className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
//                     <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Sem questões</h3>
//                     <p className="text-gray-500 dark:text-gray-400 mt-1">Não há questões disponíveis para esta avaliação.</p>
//                   </div>
//                 )}
//               </div>


//               <div className="mt-8 flex justify-end space-x-3">
//                 <button
//                   onClick={handleCloseModal}
//                   className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//                 >
//                   Cancelar
//                 </button>
//                 <button
//                   onClick={handleSubmitAnswers}
//                   disabled={isSubmitting}
//                   className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center ${
//                     isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
//                   }`}
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <span className="animate-pulse mr-2">●</span>
//                       Enviando...
//                     </>
//                   ) : (
//                     'Salvar Respostas'
//                   )}
//                 </button>
//               </div>
//             </div>
//           </Modal>
//         )}
//       </AnimatePresence>



//       {/* Delete Confirmation Modal */}
//       <AnimatePresence>
//         {isDeleteModalOpen && (
//           <Modal 
//             isOpen={isDeleteModalOpen} 
//             onClose={() => setIsDeleteModalOpen(false)}
//             title="Confirmar Exclusão"
//             size="sm"
//           >
//             <div className="text-center">
//               <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
//                 <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-500" />
//               </div>
//               <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
//                 Excluir resposta?
//               </h3>
//               <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
//                 Esta ação não pode ser desfeita. Esta resposta será permanentemente removida.
//               </p>
//               <div className="flex justify-center space-x-3">
//                 <button
//                   type="button"
//                   className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//                   onClick={() => setIsDeleteModalOpen(false)}
//                 >
//                   Cancelar
//                 </button>
//                 <button
//                   type="button"
//                   className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//                   onClick={handleDelete}
//                 >
//                   Excluir
//                 </button>
//               </div>
//             </div>
//           </Modal>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };


// // Componente de Modal reusável e animado
// const Modal: React.FC<{
//   isOpen: boolean;
//   onClose: () => void;
//   children: React.ReactNode;
//   title: string;
//   size?: "sm" | "lg";
// }> = ({ isOpen, onClose, children, title, size = "lg" }) => {
//   // Prevenir que o clique dentro do modal feche o modal
//   const stopPropagation = (e: React.MouseEvent) => {
//     e.stopPropagation();
//   };


//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{ duration: 0.2 }}
//           className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
//           onClick={onClose}
//         >
//           <motion.div
//             initial={{ scale: 0.95, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.95, opacity: 0 }}
//             transition={{ 
//               type: "spring", 
//               stiffness: 300, 
//               damping: 30 
//             }}
//             className={`bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden ${
//               size === "sm" ? "max-w-md" : "max-w-4xl"
//             } w-full`}
//             onClick={stopPropagation}
//           >
//             <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
//               <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h2>
//               <button
//                 onClick={onClose}
//                 className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
//               >
//                 <XCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
//               </button>
//             </div>
//             <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };


// // Item de Avaliação
// const EvaluationItem: React.FC<{ evaluation: Evaluation; onClick: () => void }> = ({ evaluation, onClick }) => {
//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'completed': return 'bg-green-500';
//       case 'pending': return 'bg-yellow-500';
//       case 'failed': return 'bg-red-500';
//       default: return 'bg-gray-500';
//     }
//   };


//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return new Intl.DateTimeFormat('pt-BR', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     }).format(date);
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: { 
//       y: 0, 
//       opacity: 1,
//       transition: { 
//         type: "spring",
//         stiffness: 100
//       }
//     }
//   };


//   return (
//     <motion.div
//       variants={itemVariants}
//       className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer"
//       onClick={onClick}
//     >
//       <div className="flex items-center justify-between">
//         <div className="flex items-center">
//           <div className={`w-3 h-3 rounded-full ${getStatusColor(evaluation.status)} mr-3`}></div>
//           <div>
//             <h3 className="font-medium text-gray-800 dark:text-white text-lg">
//               Semana {evaluation.week}
//             </h3>
//             <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
//               <Clock className="w-4 h-4 mr-1" />
//               <span>{formatDate(evaluation.createdAt)}</span>
//             </div>
//           </div>
//         </div>
        
//         <div className="flex items-center">
//           <div className="mr-6 text-right">
//             <div className="font-medium text-gray-900 dark:text-gray-100">
//               {evaluation.totalScore}%
//             </div>
//             <div className="text-sm text-gray-500 dark:text-gray-400">
//               pontuação
//             </div>
//           </div>
//           <ChevronRight className="w-5 h-5 text-gray-400" />
//         </div>
//       </div>
//     </motion.div>
//   );
// };


// // Item de Questão
// const QuestionItem: React.FC<{
//   question: Question;
//   answer?: Answer;
//   onInputChange: (value: string) => void;
//   onDeleteClick?: () => void;
// }> = ({ question, answer, onInputChange, onDeleteClick }) => {
//   const [value, setValue] = useState(answer?.answer || '');


//   useEffect(() => {
//     setValue(answer?.answer || '');
//   }, [answer]);


//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setValue(e.target.value);
//     onInputChange(e.target.value);
//   };


//   // Definir o tipo de input com base no tipo de questão
//   const renderInput = () => {
//     switch (question.typeQuestion) {
//       case 'number':
//         return (
//           <input
//             type="number"
//             className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={value}
//             onChange={handleChange}
//             placeholder="Digite um número"
//           />
//         );
//       case 'yes_no':
//         return (
//           <div className="flex space-x-4">
//             <label className="flex items-center space-x-2 cursor-pointer">
//               <input
//                 type="radio"
//                 className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
//                 checked={value === 'Sim'}
//                 onChange={() => {
//                   setValue('Sim');
//                   onInputChange('Sim');
//                 }}
//               />
//               <span className="text-gray-700 dark:text-gray-300">Sim</span>
//             </label>
//             <label className="flex items-center space-x-2 cursor-pointer">
//               <input
//                 type="radio"
//                 className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
//                 checked={value === 'Não'}
//                 onChange={() => {
//                   setValue('Não');
//                   onInputChange('Não');
//                 }}
//               />
//               <span className="text-gray-700 dark:text-gray-300">Não</span>
//             </label>
//           </div>
//         );
//       default: // text
//         return (
//           <textarea
//             className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
//             value={value}
//             onChange={handleChange}
//             placeholder="Digite sua resposta"
//           />
//         );
//     }
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: { 
//       y: 0, 
//       opacity: 1,
//       transition: { 
//         type: "spring",
//         stiffness: 100
//       }
//     }
//   };

//   return (
//     <motion.div
//       variants={itemVariants}
//       className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
//     >
//       <div className="flex justify-between">
//         <div className="flex items-start">
//           <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium px-2 py-1 rounded text-xs mr-3">
//             {question.points} pts
//           </div>
//           <div>
//             <h4 className="font-medium text-gray-800 dark:text-white">
//               {question.question}
//             </h4>
//             {question.description && (
//               <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
//                 {question.description}
//               </p>
//             )}
//           </div>
//         </div>
//         {answer && onDeleteClick && (
//           <button
//             onClick={onDeleteClick}
//             className="p-1 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
//           >
//             <Trash2 className="w-4 h-4" />
//           </button>
//         )}
//       </div>
      
//       <div className="mt-4">
//         {renderInput()}
//       </div>
      
//       {answer && (
//         <div className="mt-2 flex justify-between">
//           <div className="text-sm text-gray-500 dark:text-gray-400">
//             Pontuação: <span className="font-medium">{answer.score || 0}</span>
//           </div>
//           {answer.observation && (
//             <div className="text-sm italic text-gray-500 dark:text-gray-400">
//               "{answer.observation}"
//             </div>
//           )}
//         </div>
//       )}
//     </motion.div>
//   );
// };


// // Componentes auxiliares
// const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
//   <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-lg flex items-center">
//     {icon}
//     <div className="ml-3">
//       <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
//       <div className="font-semibold text-gray-900 dark:text-gray-100">{value}</div>
//     </div>
//   </div>
// );


// const StatBox: React.FC<{ label: string; value: string | number; icon: React.ReactNode }> = ({ label, value, icon }) => (
//   <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex items-center justify-between">
//     <div>
//       <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
//       <div className="font-bold text-xl text-gray-900 dark:text-gray-100">{value}</div>
//     </div>
//     <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
//       {icon}
//     </div>
//   </div>
// );


// const TabButton: React.FC<{ isActive: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ isActive, onClick, icon, label }) => (
//   <button
//     onClick={onClick}
//     className={`flex items-center py-3 px-6 border-b-2 font-medium text-sm transition-colors ${
//       isActive
//         ? 'border-blue-500 text-blue-600 dark:text-blue-400'
//         : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
//     }`}
//   >
//     {icon}
//     {label}
//   </button>
// );

// const itemVariants = {
//   hidden: { y: 20, opacity: 0 },
//   visible: { 
//     y: 0, 
//     opacity: 1,
//     transition: { 
//       type: "spring",
//       stiffness: 100
//     }
//   }
// };

// const StatisticsCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  
//   <motion.div
//     variants={itemVariants}
//     className={`p-4 rounded-lg ${color}`}
//   >
//     <div className="flex justify-between items-center mb-2">
//       <h3 className="font-medium text-gray-800 dark:text-gray-200">{title}</h3>
//       {icon}
//     </div>
//     <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
//   </motion.div>
// );


// export default reportAnswerUnit;












































// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { ArrowLeft, Calendar, Book, AlertCircle, CheckCircle, XCircle, ClipboardList, Edit, Trash2, ChevronRight } from 'lucide-react';
// import toast from 'react-hot-toast';
// import { unitEvaluationService } from '../../services/unitEvaluationService';
// import { unitQuestionService } from '../../services/unitQuestionService';
// import { unitAnswerService } from '../../services/unitAnswerService';
// import { useAuth } from '../../context/AuthContext';
// import { Unit } from '../../dtos/UnitDTO';


// // Import components
// import { EvaluationsList } from './components/EvaluationsList';
// import { AnswerModal } from './components/AnswerModal';
// import { DeleteConfirmModal } from './components/DeleteConfirmModal';
// import { LoadingSpinner } from '../../components/ui/loading/loading';


// // Types
// export interface Evaluation {
//   id: string;
//   week: number;
//   examScore: number;
//   unitId: string;
//   evaluatedBy: string;
//   correctAnswers: number;
//   wrongAnswers: number;
//   totalScore: number;
//   status: string;
//   createdAt: string;  
//   updatedAt: string;
// }


// export interface Question {
//   id: string;
//   question: string;
//   points: number;
//   typeQuestion: 'text' | 'number' | 'yes_no';
//   description?: string | null;
//   createdAt: string;
//   updatedAt: string;
// }


// export interface Answer {
//   id: string;
//   unitId: string;
//   unitEvaluationId: string;
//   questionId: string;
//   answer: string;
//   score: number;
//   week: number;
//   observation: string | null;
//   createdAt: string;
//   updatedAt: string;
//   unitAnswers?: {
//     id: string;
//     question: string;
//     points: number;
//   };
// }


// const ReportAnswerUnit = () => {
//   const { unitId } = useParams();
//   const navigate = useNavigate();
//   const { units } = useAuth();
 
//   const [evaluations, setEvaluations] = useState<Evaluation[] | null>([]);
//   const [questions, setQuestions] = useState<Question[] | null>([]);
//   const [unit, setUnit] = useState<Unit | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [answers, setAnswers] = useState<{ [key: string]: { text: string; id?: string } }>({});
//   const [allAnswers, setAllAnswers] = useState<Answer[]>([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [selectedAnswer, setSelectedAnswer] = useState<{ text: string; id?: string } | null>(null);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState<'open' | 'closed' | 'all'>('all');


//   useEffect(() => {
//     if (units) {
//       const currentUnit = units.find(u => u.id === unitId);
//       setUnit(currentUnit || null);
//     }
 
//     fetchEvaluations();
//     fetchQuestions();
//   }, [unitId, units]);


//   const fetchEvaluations = async () => {
//     try {
//       setIsLoading(true);
//       const data = await unitEvaluationService.ListEvaluationFromUnit(unitId as string);
//       setEvaluations(data.evaluation);
//       setIsLoading(false);
//     } catch (error) {
//       console.error("Erro ao carregar avaliações:", error);
//       toast.error("Erro ao carregar avaliações da unidade", {position: 'bottom-right'});
//       setIsLoading(false);
//     }
//   };


//   const fetchQuestions = async () => {
//     try {
//       const data = await unitQuestionService.ListQuestions();
//       setQuestions(data);
//     } catch (error) {
//       console.error("Erro ao carregar perguntas:", error);
//       toast.error("Erro ao carregar perguntas", {position: 'bottom-right'});
//     }
//   };


//   const fetchAnswers = async (evaluationId: string, week: number) => {
//     try {
//       const data = await unitAnswerService.ListUnitAnswer(unitId as string);
     
//       // Filter answers by week to get only answers for the selected evaluation
//       const weekAnswers: Answer[] = data.filter((answer: Answer) => answer.week === week);
//       setAllAnswers(weekAnswers);
     
//       // Create a map of questionId -> answer
//       const evaluationAnswers: { [key: string]: { text: string; id: string } } = {};
//       weekAnswers.forEach((answer) => {
//         evaluationAnswers[answer.questionId] = {
//           text: answer.answer,
//           id: answer.id
//         };
//       });
     
//       setAnswers(evaluationAnswers);
//       return evaluationAnswers;
//     } catch (error) {
//       console.error("Erro ao carregar respostas:", error);
//       toast.error("Erro ao carregar respostas anteriores", {position: 'bottom-right'});
//       return {};
//     }
//   };


//   const handleEvaluationClick = async (evaluation: Evaluation) => {
//     setSelectedEvaluation(evaluation);


//     if (evaluation.status === "open" || evaluation.status === "closed") {
//       await fetchAnswers(evaluation.id, evaluation.week);
//       setModalOpen(true);
//     }
//   };


//   const handleInputChange = (questionId: string, value: string) => {
//     setAnswers(prev => ({
//       ...prev,
//       [questionId]: {
//         ...(prev[questionId] || {}),
//         text: value
//       }
//     }));
//   };


//   const handleSubmitAnswers = async () => {
//     if (!selectedEvaluation) return;
 
//     try {
//       setIsSubmitting(true);
   
//       // For each question with an answer, send the answer
//       const answersPromises = Object.keys(answers).map(questionId => {
//         // Skip if empty answer
//         if (!answers[questionId]?.text?.trim()) return Promise.resolve();
       
//         const payload = {
//           unitId,
//           questionId,
//           answer: answers[questionId].text,
//           week: selectedEvaluation.week || 1
//         };
       
//         return unitAnswerService.createAnswer(payload);
//       });
   
//       await Promise.all(answersPromises.filter(Boolean));
   
//       toast.success("Respostas enviadas com sucesso!", {position: 'bottom-right'});
//       setModalOpen(false);
//       setIsSubmitting(false);
//       fetchEvaluations(); // Update evaluations list
//     } catch (error) {
//       console.error("Erro ao enviar respostas:", error);
//       toast.error("Erro ao enviar respostas. Tente novamente.", {position: 'bottom-right'});
//       setIsSubmitting(false);
//     } finally{
//       setModalOpen(false);
//       setIsSubmitting(false);
//       fetchEvaluations();
//     }
//   };


//   const handleCloseModal = () => {
//     setModalOpen(false);
//     setSelectedEvaluation(null);
//     setAnswers({});
//   };


//   const handleOpenDelete = (questionId: string) => {
//     const answer = answers[questionId];
//     if (answer && answer.id) {
//       setSelectedAnswer(answer);
//       setIsDeleteModalOpen(true);
//     } else {
//       toast.error("Esta resposta ainda não foi salva", {position: 'bottom-right'});
//     }
//   };


//   const handleDelete = async () => {
//     if (selectedAnswer && selectedAnswer.id) {
//       try {
//         await unitAnswerService.deleteAnswer(selectedAnswer.id);
//         toast.success("Resposta excluída com sucesso!", {position: 'bottom-right'});
//         setIsDeleteModalOpen(false);
       
//         // Refresh answers for the current evaluation
//         if (selectedEvaluation) {
//           await fetchAnswers(selectedEvaluation.id, selectedEvaluation.week);
//         }
//       } catch (err) {
//         toast.error(`Erro ao excluir: ${err}`, { position: 'bottom-right' });
//       }
//     }
//   };


//   // Filter evaluations based on active tab
//   const filteredEvaluations = evaluations?.filter(evaluation => {
//     if (activeTab === 'all') return true;
//     return evaluation.status === activeTab;
//   });


//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'open':
//         return <Edit className="w-5 h-5 text-green-500" />;
//       case 'closed':
//         return <CheckCircle className="w-5 h-5 text-blue-500" />;
//       default:
//         return <AlertCircle className="w-5 h-5 text-gray-500" />;
//     }
//   };


//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return new Intl.DateTimeFormat('pt-BR', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//     }).format(date);
//   };


//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
//         <LoadingSpinner />
//       </div>
//     );
//   }


//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
//       {/* Header */}
//       <div className="bg-white dark:bg-gray-800 shadow-sm">
//         <div className="container mx-auto px-4 py-6">
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-4 transition-colors"
//           >
//             <ArrowLeft className="w-5 h-5 mr-1" />
//             <span className="text-sm font-medium">Voltar para unidades</span>
//           </button>
          
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//             <div className="flex items-center">
//               {unit?.photo ? (
//                 <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg mr-4 flex-shrink-0">
//                   <img
//                     src={unit.photo}
//                     alt={unit.name}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//               ) : (
//                 <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg mr-4 flex-shrink-0">
//                   {unit?.name?.charAt(0) || 'U'}
//                 </div>
//               )}
              
//               <div>
//                 <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
//                   {unit?.name || 'Unidade'}
//                 </h1>
//                 <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
//                   <Book className="w-4 h-4 mr-1" />
//                   <span className="truncate max-w-xs md:max-w-md">{unit?.id || 'Carregando informações...'}</span>
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg px-4 py-2 flex items-center self-start md:self-center">
//               <ClipboardList className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
//               <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
//                 {evaluations?.length || 0} {evaluations?.length === 1 ? 'Avaliação' : 'Avaliações'}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>


//       {/* Main Content */}
//       <div className="container mx-auto px-4 py-8">
//         {/* Tabs */}
//         <div className="bg-white dark:bg-gray-800 rounded-t-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-1">
//           <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700">
//             <button
//               onClick={() => setActiveTab('all')}
//               className={`px-6 py-3 text-sm font-medium focus:outline-none ${
//                 activeTab === 'all'
//                 ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
//                 : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
//               }`}
//             >
//               Todas
//             </button>
//             <button
//               onClick={() => setActiveTab('open')}
//               className={`px-6 py-3 text-sm font-medium focus:outline-none ${
//                 activeTab === 'open'
//                 ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
//                 : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
//               }`}
//             >
//               Abertas
//             </button>
//             <button
//               onClick={() => setActiveTab('closed')}
//               className={`px-6 py-3 text-sm font-medium focus:outline-none ${
//                 activeTab === 'closed'
//                 ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
//                 : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
//               }`}
//             >
//               Fechadas
//             </button>
//           </div>
//         </div>


//         {/* Evaluations List */}
//         <div className="bg-white dark:bg-gray-800 rounded-b-lg shadow-md">
//           {filteredEvaluations && filteredEvaluations.length > 0 ? (
//             <div className="divide-y divide-gray-200 dark:divide-gray-700">
//               {filteredEvaluations.map((evaluation) => (
//                 <button
//                   key={evaluation.id}
//                   onClick={() => handleEvaluationClick(evaluation)}
//                   className="w-full px-6 py-4 flex flex-col md:flex-row md:items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-750"
//                 >
//                   <div className="flex items-start mb-2 md:mb-0">
//                     <div className={`flex-shrink-0 p-2 rounded-lg mr-4 ${
//                       evaluation.status === 'open' ? 'bg-green-50 dark:bg-green-900/20' : 
//                       evaluation.status === 'closed' ? 'bg-blue-50 dark:bg-blue-900/20' : 
//                       'bg-gray-100 dark:bg-gray-700'
//                     }`}>
//                       {getStatusIcon(evaluation.status)}
//                     </div>
                    
//                     <div className="text-left">
//                       <h3 className="font-medium text-gray-900 dark:text-white text-lg">
//                         Semana {evaluation.week}
//                       </h3>
//                       <div className="flex flex-wrap gap-x-6 gap-y-1 mt-1">
//                         <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
//                           <Calendar className="w-4 h-4 mr-1" />
//                           Criada em: {formatDate(evaluation.createdAt)}
//                         </span>
//                         <span className={`text-sm flex items-center ${
//                           evaluation.status === 'open' ? 'text-green-600 dark:text-green-400' : 
//                           evaluation.status === 'closed' ? 'text-blue-600 dark:text-blue-400' : 
//                           'text-gray-500 dark:text-gray-400'
//                         }`}>
//                           {evaluation.status === 'open' ? 'Aberta' : 
//                            evaluation.status === 'closed' ? 'Fechada' : 
//                            'Status desconhecido'}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center ml-10 md:ml-0">
//                     {evaluation.status === 'closed' && (
//                       <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-1 mr-4">
//                         <div className="flex items-center">
//                           <span className="font-medium mr-1">Nota:</span>
//                           <span className={`${
//                             evaluation.examScore >= 7 ? 'text-green-600 dark:text-green-400' :
//                             evaluation.examScore >= 5 ? 'text-yellow-600 dark:text-yellow-400' :
//                             'text-red-600 dark:text-red-400'
//                           }`}>
//                             {evaluation.examScore.toFixed(1)}
//                           </span>
//                         </div>
//                         <div className="flex text-xs text-gray-500 dark:text-gray-400 mt-1">
//                           <span className="flex items-center mr-2">
//                             <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
//                             {evaluation.correctAnswers}
//                           </span>
//                           <span className="flex items-center">
//                             <XCircle className="w-3 h-3 text-red-500 mr-1" />
//                             {evaluation.wrongAnswers}
//                           </span>
//                         </div>
//                       </div>
//                     )}
//                     <ChevronRight className="text-gray-400 w-5 h-5" />
//                   </div>
//                 </button>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-16 px-4">
//               <div className="bg-gray-50 dark:bg-gray-750 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
//                 <Calendar className="w-8 h-8 text-gray-400 dark:text-gray-500" />
//               </div>
//               <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
//                 {activeTab === 'all' 
//                   ? 'Nenhuma avaliação disponível' 
//                   : activeTab === 'open' 
//                     ? 'Nenhuma avaliação aberta'
//                     : 'Nenhuma avaliação fechada'}
//               </h3>
//               <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-md mx-auto">
//                 {activeTab === 'all'
//                   ? 'Não há avaliações cadastradas para esta unidade.'
//                   : `Não há avaliações com status "${activeTab}" disponíveis atualmente.`}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>


//       {/* Answer Modal */}
//       <AnswerModal
//         isOpen={modalOpen}
//         evaluation={selectedEvaluation}
//         questions={questions}
//         answers={answers}
//         isSubmitting={isSubmitting}
//         onClose={handleCloseModal}
//         onSubmit={handleSubmitAnswers}
//         onInputChange={handleInputChange}
//         onDeleteClick={handleOpenDelete}
//       />


//       {/* Delete Confirmation Modal */}
//       <DeleteConfirmModal
//         isOpen={isDeleteModalOpen}
//         answer={selectedAnswer}
//         onClose={() => setIsDeleteModalOpen(false)}
//         onConfirm={handleDelete}
//       />
//     </div>
//   );
// };


// export default ReportAnswerUnit;


















































import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { unitEvaluationService } from '../../services/unitEvaluationService';
import { unitQuestionService } from '../../services/unitQuestionService';
import { unitAnswerService } from '../../services/unitAnswerService';
import { useAuth } from '../../context/AuthContext';
import { Unit } from '../../dtos/UnitDTO';

// Import components
import { EvaluationsList } from './components/EvaluationsList';
import { AnswerModal } from './components/AnswerModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { LoadingSpinner } from '../../components/ui/loading/loading';
import PageMeta from '../../components/common/PageMeta';

// Types
//import { Evaluation, Question, Answer } from './@types';
export interface Evaluation {
  id: string;
  week: number;
  examScore: number;
  unitId: string;
  evaluatedBy: string;
  correctAnswers: number;
  wrongAnswers: number;
  totalScore: number;
  status: string;
  createdAt: string;  
  updatedAt: string;
}

export interface Question {
  id: string;
  question: string;
  points: number;
  typeQuestion: 'text' | 'number' | 'yes_no';
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Answer {
  id: string;
  unitId: string;
  unitEvaluationId: string;
  questionId: string;
  answer: string;
  score: number;
  week: number;
  observation: string | null;
  createdAt: string;
  updatedAt: string;
  unitAnswers?: {
    id: string;
    question: string;
    points: number;
  };
}


const reportAnswerUnit = () => {
  const { unitId } = useParams();
  const navigate = useNavigate();
  const { units } = useAuth();
 
  const [evaluations, setEvaluations] = useState<Evaluation[] | null>([]);
  const [questions, setQuestions] = useState<Question[] | null>([]);
  const [unit, setUnit] = useState<Unit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [answers, setAnswers] = useState<{ [key: string]: { text: string; id?: string } }>({});
  const [_allAnswers, setAllAnswers] = useState<Answer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<{ text: string; id?: string } | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (units) {
      const currentUnit = units.find(u => u.id === unitId);
      setUnit(currentUnit || null);
    }
  
    fetchEvaluations();
    fetchQuestions();
  }, [unitId, units]);

  const fetchEvaluations = async () => {
    try {
      setIsLoading(true);
      const data = await unitEvaluationService.ListEvaluationFromUnit(unitId as string);
      setEvaluations(data.evaluation);
      setIsLoading(false);
    } catch (error: any) {
      console.error("Erro ao carregar avaliações:", error);
      toast.error(`Error: ${error.message}`, {
          position: 'bottom-right',
          icon: '🚫',
          className: 'dark:bg-gray-800 dark:text-white',
          duration: 5000,
        });
      setIsLoading(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      const data = await unitQuestionService.ListQuestions();
      setQuestions(data);
    } catch (error: any) {
      console.error("Erro ao carregar perguntas:", error);
      toast.error(`Error: ${error.message}`, {
          position: 'bottom-right',
          icon: '🚫',
          className: 'dark:bg-gray-800 dark:text-white',
          duration: 5000,
        });
    }
  };

  const fetchAnswers = async (evaluationId: string, week: number) => {
    console.log("EvaluationId", evaluationId);
    try {
      const data = await unitAnswerService.ListUnitAnswer(unitId as string);
      
      // Filter answers by week to get only answers for the selected evaluation
      const weekAnswers: Answer[] = data.filter((answer: Answer) => answer.week === week);
      setAllAnswers(weekAnswers);
      
      // Create a map of questionId -> answer
      const evaluationAnswers: { [key: string]: { text: string; id: string } } = {};
      weekAnswers.forEach((answer) => {
        evaluationAnswers[answer.questionId] = {
          text: answer.answer,
          id: answer.id
        };
      });
      
      setAnswers(evaluationAnswers);
      return evaluationAnswers;
    } catch (error: any) {
      console.error("Erro ao carregar respostas:", error);
      toast.error(`Error: ${error.message}`, {
          position: 'bottom-right',
          icon: '🚫',
          className: 'dark:bg-gray-800 dark:text-white',
          duration: 5000,
        });
      return {};
    }
  };

  const handleEvaluationClick = async (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation);

    if (evaluation.status === "open" || evaluation.status === "closed") {
      await fetchAnswers(evaluation.id, evaluation.week);
      setModalOpen(true);
    }
  };

  const handleInputChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] || {}),
        text: value
      }
    }));
  };

  const handleSubmitAnswers = async () => {
    if (!selectedEvaluation) return;
  
  
    try {
      setIsSubmitting(true);
  
  
      // Filtra as respostas para enviar apenas:
      // 1. Respostas que não possuem ID (não foram salvas anteriormente)
      // 2. E que têm texto não vazio
      const answersToSubmit = Object.keys(answers).reduce((acc, questionId) => {
        const answer = answers[questionId];
        if (!answer.id && answer.text?.trim()) {
          acc[questionId] = answer;
        }
        return acc;
      }, {} as Record<string, any>);
  
  
      // Se não houver respostas para enviar
      if (Object.keys(answersToSubmit).length === 0) {
        toast.success("Nenhuma resposta nova para enviar", { position: 'bottom-right' });
        setModalOpen(false);
        return;
      }
  
  
      // Envia apenas as respostas filtradas
      const answersPromises = Object.keys(answersToSubmit).map(questionId => {
        const payload = {
          unitId,
          questionId,
          answer: answersToSubmit[questionId].text,
          week: selectedEvaluation.week || 1
        };
        return unitAnswerService.createAnswer(payload);
      });
  
  
      await Promise.all(answersPromises);
  
  
      toast.success("Respostas enviadas com sucesso!", { position: 'bottom-right' });
      setModalOpen(false);
      fetchEvaluations(); // Update evaluations list
    } catch (error: any) {
      console.error("Erro ao enviar respostas:", error);
      toast.error(`Error: ${error.message}`, {
          position: 'bottom-right',
          icon: '🚫',
          className: 'dark:bg-gray-800 dark:text-white',
          duration: 5000,
        });
    } finally {
      setIsSubmitting(false);
      fetchEvaluations();
    }
  };
  
  const handleCloseModal = () => {
    setModalOpen(false);
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
        await unitAnswerService.deleteAnswer(selectedAnswer.id);
        toast.success("Resposta excluída com sucesso!", {position: 'bottom-right'});
        setIsDeleteModalOpen(false);
        
        // Refresh answers for the current evaluation
        if (selectedEvaluation) {
          await fetchAnswers(selectedEvaluation.id, selectedEvaluation.week);
        }
      } catch (error: any) {
        toast.error(`Error: ${error.message}`, {
          position: 'bottom-right',
          icon: '🚫',
          className: 'dark:bg-gray-800 dark:text-white',
          duration: 5000,
        });
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

  return (
    <>
      <PageMeta
        title="Responder avaliações das unidades | Luzeiros do Norte"
        description="Clube de Desbravadores - Responder avaliações das unidades "
      />
      <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Voltar para unidades
        </button>
      
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              {unit?.name || 'Unidade'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{unit?.id || 'Carregando informações...'}</p>
          </div>
          {unit?.photo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-20 h-20 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg"
            >
              <img
                src={unit.photo}
                alt={unit.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}
        </div>
      </motion.div>

      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8"
      >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Relatórios e Avaliações</h2>
      
        {evaluations && evaluations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-10 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <Calendar className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Nenhuma avaliação disponível</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Não há avaliações cadastradas para esta unidade.</p>
          </motion.div>
        ) : (
          <EvaluationsList 
            evaluations={evaluations} 
            onEvaluationClick={handleEvaluationClick} 
          />
        )}
      </motion.div>

      {/* Answer Modal */}
      <AnswerModal
        isOpen={modalOpen}
        evaluation={selectedEvaluation}
        questions={questions}
        answers={answers}
        isSubmitting={isSubmitting}
        onClose={handleCloseModal}
        onSubmit={handleSubmitAnswers}
        onInputChange={handleInputChange}
        onDeleteClick={handleOpenDelete}
      />

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

export default reportAnswerUnit;
