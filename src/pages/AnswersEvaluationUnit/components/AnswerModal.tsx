// import { Dialog, Transition } from '@headlessui/react';
// import { Fragment, useState } from 'react';
// import { X, Trash2, Save, AlertCircle, CheckCircle } from 'lucide-react';
// import { AnimatePresence, motion } from 'framer-motion';

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


// interface AnswerModalProps {
//   isOpen: boolean;
//   evaluation: Evaluation | null;
//   questions: Question[] | null;
//   answers: { [key: string]: { text: string; id?: string } };
//   isSubmitting: boolean;
//   onClose: () => void;
//   onSubmit: () => Promise<void>;
//   onInputChange: (questionId: string, value: string) => void;
//   onDeleteClick: (questionId: string) => void;
// }

// export const AnswerModal: React.FC<AnswerModalProps> = ({
//   isOpen,
//   evaluation,
//   questions,
//   answers,
//   isSubmitting,
//   onClose,
//   onSubmit,
//   onInputChange,
//   onDeleteClick,
// }) => {
//   const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
//   const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());


//   const toggleQuestion = (questionId: string) => {
//     const newExpanded = new Set(expandedQuestions);
//     if (newExpanded.has(questionId)) {
//       newExpanded.delete(questionId);
//     } else {
//       newExpanded.add(questionId);
//     }
//     setExpandedQuestions(newExpanded);
//   };


//   const renderQuestionField = (question: Question) => {
//     const isExpanded = expandedQuestions.has(question.id);
//     const answer = answers[question.id]?.text || '';
//     const hasAnswer = answer.trim().length > 0;


//     return (
//       <div 
//         key={question.id}
//         className={`bg-white dark:bg-gray-800 rounded-lg border ${
//           activeQuestionId === question.id 
//             ? 'border-blue-500 dark:border-blue-400 shadow-md' 
//             : hasAnswer 
//               ? 'border-green-200 dark:border-green-900/40' 
//               : 'border-gray-200 dark:border-gray-700'
//         } mb-4 overflow-hidden transition-all duration-200`}
//       >
//         <div 
//           className={`flex justify-between items-start p-4 cursor-pointer ${
//             hasAnswer ? 'bg-green-50 dark:bg-green-900/10' : ''
//           }`}
//           onClick={() => toggleQuestion(question.id)}
//         >
//           <div className="flex-1">
//             <div className="flex items-center">
//               <h3 className="font-medium text-gray-900 dark:text-white flex-1">
//                 {question.question}
//               </h3>
//               {hasAnswer && (
//                 <CheckCircle className="w-5 h-5 text-green-500 ml-2 flex-shrink-0" />
//               )}
//             </div>
//             {!isExpanded && hasAnswer && (
//               <div className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
//                 {answer}
//               </div>
//             )}
//             <div className="flex items-center mt-1">
//               <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
//                 {question.points} pontos
//               </span>
//               {question.typeQuestion && (
//                 <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 ml-2">
//                   {question.typeQuestion === 'text' ? 'Texto' : 
//                    question.typeQuestion === 'number' ? 'Número' : 
//                    question.typeQuestion === 'yes_no' ? 'Sim/Não' : 
//                    question.typeQuestion}
//                 </span>
//               )}
//             </div>
//           </div>
//           <div className="ml-2 text-gray-500 dark:text-gray-400">
//             <svg 
//               className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
//               fill="none" 
//               stroke="currentColor" 
//               viewBox="0 0 24 24" 
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//             </svg>
//           </div>
//         </div>


//         {isExpanded && (
//           <div className="p-4 border-t border-gray-200 dark:border-gray-700">
//             {question.description && (
//               <div className="text-sm text-gray-600 dark:text-gray-400 mb-3 bg-gray-50 dark:bg-gray-750 p-3 rounded-md">
//                 {question.description}
//               </div>
//             )}
            
//             <div className="mt-2">
//               {question.typeQuestion === 'yes_no' ? (
//                 <div className="flex space-x-4">
//                   <label className="inline-flex items-center">
//                     <input
//                       type="radio"
//                       className="form-radio h-5 w-5 text-blue-600"
//                       checked={answers[question.id]?.text === 'Sim'}
//                       onChange={() => onInputChange(question.id, 'Sim')}
//                     />
//                     <span className="ml-2 text-gray-700 dark:text-gray-300">Sim</span>
//                   </label>
//                   <label className="inline-flex items-center">
//                     <input
//                       type="radio"
//                       className="form-radio h-5 w-5 text-blue-600"
//                       checked={answers[question.id]?.text === 'Não'}
//                       onChange={() => onInputChange(question.id, 'Não')}
//                     />
//                     <span className="ml-2 text-gray-700 dark:text-gray-300">Não</span>
//                   </label>
//                 </div>
//               ) : question.typeQuestion === 'number' ? (
//                 <input
//                   type="number"
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
//                   value={answers[question.id]?.text || ''}
//                   onChange={(e) => onInputChange(question.id, e.target.value)}
//                   onFocus={() => setActiveQuestionId(question.id)}
//                   onBlur={() => setActiveQuestionId(null)}
//                 />
//               ) : (
//                 <textarea
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white min-h-[100px]"
//                   value={answers[question.id]?.text || ''}
//                   onChange={(e) => onInputChange(question.id, e.target.value)}
//                   onFocus={() => setActiveQuestionId(question.id)}
//                   onBlur={() => setActiveQuestionId(null)}
//                 />
//               )}
//             </div>
            
//             {answers[question.id]?.id && (
//               <div className="flex justify-end mt-3">
//                 <button
//                   type="button"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     onDeleteClick(question.id);
//                   }}
//                   className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                 >
//                   <Trash2 className="w-4 h-4 mr-1" />
//                   Excluir resposta
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     );
//   };

//   const modalVariants = {
//     hidden: { opacity: 0, scale: 0.8 },
//     visible: {
//       opacity: 1,
//       scale: 1,
//       transition: { type: "spring", stiffness: 300, damping: 25 }
//     },
//     exit: {
//       opacity: 0,
//       scale: 0.8,
//       transition: { duration: 0.2 }
//     }
//   };


//   return (
//     <AnimatePresence>
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50"
//       >
//         <motion.div
//           variants={modalVariants}
//           initial="hidden"
//           animate="visible"
//           exit="exit"
//           className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
//         >

//         <div className="fixed inset-0 overflow-y-auto">
//           <div className="flex min-h-full items-center justify-center p-4 text-center">
//             <motion.div
             
//             >
//               <motion.div className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-850 p-6 text-left align-middle shadow-xl transition-all">
//                 <div className="flex justify-between items-start mb-4">
//                   <motion.p className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
//                     {evaluation?.totalScore || 'Responder Avaliação'}
//                   </motion.p>
//                   {evaluation?.status !== 'closed' && (
//                     <button
//                       type="button"
//                       className="text-gray-400 hover:text-gray-500 focus:outline-none"
//                       onClick={onClose}
//                     >
//                       <span className="sr-only">Fechar</span>
//                       <X className="h-6 w-6" aria-hidden="true" />
//                     </button>
//                   )}
//                 </div>


//                 {evaluation?.week && (
//                   <div className="mb-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
//                     <div className="text-sm text-gray-600 dark:text-gray-300">
//                       {evaluation.week}
//                     </div>
//                   </div>
//                 )}


//                 {evaluation?.status === 'closed' ? (
//                   <div className="flex items-center p-4 mb-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-yellow-800 dark:text-yellow-200">
//                     <AlertCircle className="h-5 w-5 mr-2" />
//                     <p>Esta avaliação está fechada e não aceita mais respostas.</p>
//                   </div>
//                 ) : null}


//                 <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
//                   {questions?.map(renderQuestionField)}
//                 </div>


//                 <div className="mt-6 flex justify-end space-x-3">
//                   {evaluation?.status !== 'closed' && (
//                     <>
//                       <button
//                         type="button"
//                         className="inline-flex justify-center rounded-md border border-transparent bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
//                         onClick={onClose}
//                       >
//                         Cancelar
//                       </button>
//                       <button
//                         type="button"
//                         className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                         onClick={onSubmit}
//                         disabled={isSubmitting}
//                       >
//                         {isSubmitting ? (
//                           <>
//                             <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                             </svg>
//                             Salvando...
//                           </>
//                         ) : (
//                           <>
//                             <Save className="w-4 h-4 mr-2" />
//                             Salvar respostas
//                           </>
//                         )}
//                       </button>
//                     </>
//                   )}
//                   {evaluation?.status === 'closed' && (
//                     <button
//                       type="button"
//                       className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                       onClick={onClose}
//                     >
//                       Fechar
//                     </button>
//                   )}
//                 </div>
//               </motion.div>
//             </motion.div>
//           </div>
//         </div>
//         </motion.div>
//       </motion.div>
//     </AnimatePresence>
//   );
// };



































import { motion, AnimatePresence } from 'framer-motion';
import { Save, HelpCircle, Trash2 } from 'lucide-react';
import Button from '../../../components/ui/button/Button';

// Utils
import { getEvaluationStatusIcon } from '../utils/getEvaluationStatusIcon'
import { Evaluation, Question } from '../@types';
import { Modal } from '../../../components/ui/modal';
import TextArea from '../../../components/form/input/TextArea';
import Radio from '../../../components/form/input/Radio';
import Input from '../../../components/form/input/InputField';
import { useAuth } from '../../../context/AuthContext';

interface AnswerModalProps {
  isOpen: boolean;
  evaluation: Evaluation | null;
  questions: Question[] | null
  answers: Record<string, { id?: string; text?: string }>;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onInputChange: (id: string, value: string) => void;
  onDeleteClick: (id: string) => void;
}

export const AnswerModal: React.FC<AnswerModalProps> = ({ 
  isOpen, 
  evaluation, 
  questions, 
  answers, 
  isSubmitting, 
  onClose, 
  onSubmit, 
  onInputChange, 
  onDeleteClick 
}) => {
  if (!isOpen || !evaluation) return null;

  const { userRole } = useAuth() 
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 25 }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  };

  const isEditable = evaluation.status === "open";

  return (
    <Modal isOpen={isOpen} onClose={onClose} className='w-full max-w-[700px] bg-black bg-opacity-50 dark:bg-opacity-50'>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="inset-0 bg-black rounded-3xl bg-opacity-50 dark:bg-opacity-50 flex items-center justify-center p-4 z-50"

          //className="no-scrollbar relative w-full max-w-[600px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"

        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
          >
            <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
              <div>
                <div className="flex items-center">
                  {getEvaluationStatusIcon(evaluation.status)}
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white ml-2">
                    Avaliação Semana {evaluation.week || "N/A"}
                  </h2>
                </div>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  {isEditable ? "Responda as perguntas abaixo" : "Visualizando respostas"}
                </p>
              </div>
            </div>
        
            <div className="p-6 custom-scrollbar overflow-y-auto max-h-[60vh]">
              {!questions || questions.length === 0 ? (
                <div className="text-center py-8">
                  <HelpCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">Nenhuma pergunta disponível</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {questions.map((question, index) => (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg"
                    >
                      <div className='flex justify-between items-center mb-2'>
                        <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                          {index + 1}. {question.question}
                          {question.points && (
                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                              ({question.points} pontos)
                            </span>
                          )}
                        </label>
                        {(answers[question.id] && answers[question.id].id && isEditable) && (userRole === 'admin' || userRole === "director") && (
                            <button
                            onClick={() => onDeleteClick(question.id)}
                            className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                            aria-label="Excluir resposta"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                  
                      {isEditable ? (
                        <>
                          {question.typeQuestion === "text" && (
                            // <textarea
                            //   value={answers[question.id]?.text || ''}
                            //   onChange={(e) => onInputChange(question.id, e.target.value)}
                            //   placeholder="Digite sua resposta aqui..."
                            //   className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-all"
                            //   rows={3}
                            // />
                            <TextArea
                            value={answers[question.id]?.text || ''}
                            onChange={(value: string) => onInputChange(question.id, value)}
                            placeholder="Digite sua resposta aqui..."
                            rows={3}
                            disabled={!!(answers[question.id] && answers[question.id].id && isEditable)}
                          />
                          )}
                          
                          {question.typeQuestion === "number" && (
                            <Input
                              type="number"
                              value={answers[question.id]?.text || ''}
                              onChange={(e) => onInputChange(question.id, e.target.value)}
                              placeholder="Digite um número"
                              min={0}
                              disabled={!!(answers[question.id] && answers[question.id].id && isEditable)}
                            />
                          )}
                          
                          {question.typeQuestion === "yes_no" && (
                            <div className="flex flex-wrap items-center gap-8">
                              
                                {/* <input
                                  type="radio"
                                  name={`yes_no_${question.id}`}
                                  checked={answers[question.id]?.text === 'sim'}
                                  onChange={() => onInputChange(question.id, 'sim')}
                                  className="form-radio h-4 w-4 text-blue-600 dark:text-blue-400"
                                /> */}
                                <Radio
                                  id="radio1"
                                  name={`yes_no_${question.id}`}
                                  value="option1"
                                  checked={answers[question.id]?.text === 'sim'}
                                  onChange={() => onInputChange(question.id, 'sim')}
                                  label="Sim"
                                  disabled={!!(answers[question.id] && answers[question.id].id && isEditable)}
                                  
                                />
                              
                                {/* <input
                                  type="radio"
                                  name={`yes_no_${question.id}`}
                                  checked={answers[question.id]?.text === 'não'}
                                  onChange={() => onInputChange(question.id, 'não')}
                                  className="form-radio h-4 w-4 text-blue-600 dark:text-blue-400"
                                /> */}
                                <Radio
                                  id="radio2"
                                  name={`yes_no_${question.id}`}
                                  value="option2"
                                  checked={answers[question.id]?.text === 'não'}
                                  onChange={() => onInputChange(question.id, 'não')}
                                  label="Não"
                                  disabled={!!(answers[question.id] && answers[question.id].id && isEditable)}
                                  
                                />                     
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-md dark:text-gray-200 min-h-[80px]">
                          {answers[question.id]?.text || 'Sem resposta'}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
        
            <div className="p-6 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-end">
              <Button
                onClick={onClose}
                variant="outline"
                className="mr-3"
              >
                Fechar
              </Button>
          
              {isEditable && (
                <Button
                  onClick={onSubmit}
                  disabled={isSubmitting}
                  variant="primary"
                  className="flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Respostas
                    </>
                  )}
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </Modal>
  );
  
};
