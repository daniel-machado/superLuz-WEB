// import React from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { X, Calendar, Trash2, Save, AlertCircle } from 'lucide-react';


// interface Evaluation {
//   week: number;
//   createdAt?: string;
// }

// interface DBVAnswerModalProps {
//   isOpen: boolean;
//   evaluation: Evaluation;
//   questions: { id: string; question: string }[];
//   answers: Record<string, { id?: string; text: string }>;
//   isSubmitting: boolean;
//   onClose: () => void;
//   onSubmit: () => void;
//   onInputChange: (id: string, value: string) => void;
//   onDeleteClick: (id: string) => void;
//   dbvName?: string;
//   isReadOnly: boolean;
// }

// export const AnswerModal: React.FC<DBVAnswerModalProps> = ({
//   isOpen,
//   evaluation,
//   questions,
//   answers,
//   isSubmitting,
//   onClose,
//   onSubmit,
//   onInputChange,
//   onDeleteClick,
//   dbvName,
//   isReadOnly
// }) => {
//   if (!isOpen || !evaluation) return null;


//   // Animation variants
//   const backdrop = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1 }
//   };


//   const modal = {
//     hidden: { opacity: 0, y: 20, scale: 0.95 },
//     visible: { opacity: 1, y: 0, scale: 1, transition: { delay: 0.1 } }
//   };


//   const item = {
//     hidden: { opacity: 0, y: 10 },
//     visible: { opacity: 1, y: 0 }
//   };


//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <div className="fixed inset-0 z-50 overflow-y-auto">
//           <motion.div
//             className="fixed inset-0 bg-black bg-opacity-50  backdrop-blur-sm"
//             variants={backdrop}
//             initial="hidden"
//             animate="visible"
//             exit="hidden"
//             onClick={onClose}
//           />
          
//           <div className="min-h-screen px-4 text-center flex items-center justify-center">
//             <motion.div
//               className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
//               variants={modal}
//               initial="hidden"
//               animate="visible"
//               exit="hidden"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="relative">
//                 {/* Header */}
//                 <div className="bg-gradient-to-r from-yellow-500 to-red-600 p-6">
//                   <div className="flex justify-between items-center">
//                     <div className="flex items-center">
//                       <Calendar className="w-6 h-6 text-white mr-2" />
//                       <h2 className="text-xl font-bold text-white">
//                         Avaliação - Semana {evaluation.week}
//                       </h2>
//                     </div>
//                     <button
//                       onClick={onClose}
//                       className="text-white/80 hover:text-white transition-colors"
//                     >
//                       <X className="w-6 h-6" />
//                     </button>
//                   </div>
                  
//                   <div className="mt-2 text-white/90 text-sm">
//                     {dbvName && <p>Desbravador: {dbvName}</p>}
//                     <p className="mt-1">
//                       {evaluation.createdAt
//                         ? `Data: ${new Date(evaluation.createdAt).toLocaleDateString('pt-BR')}`
//                         : 'Data não disponível'}
//                     </p>
//                   </div>
//                 </div>
                
//                 {/* Status banner */}
//                 {isReadOnly && (
//                   <div className="bg-blue-100 dark:bg-blue-900/40 border-l-4 border-blue-500 p-4">
//                     <div className="flex">
//                       <AlertCircle className="w-5 h-5 text-blue-500 mr-2" />
//                       <p className="text-sm text-blue-700 dark:text-blue-300">
//                         Esta avaliação está fechada. As respostas não podem ser modificadas.
//                       </p>
//                     </div>
//                   </div>
//                 )}
                
//                 {/* Questions & Answers */}
//                 <div className="p-6 max-h-[70vh] overflow-y-auto">
//                   <motion.div
//                     initial="hidden"
//                     animate="visible"
//                     variants={{
//                       visible: {
//                         transition: {
//                           staggerChildren: 0.1
//                         }
//                       }
//                     }}
//                   >
//                     {questions.length === 0 ? (
//                       <div className="text-center py-10">
//                         <p className="text-gray-500 dark:text-gray-400">
//                           Nenhuma pergunta disponível para esta avaliação.
//                         </p>
//                       </div>
//                     ) : (
//                       questions.map((question, index) => (
//                         <motion.div
//                           key={question.id}
//                           variants={item}
//                           className="mb-6 last:mb-0 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg"
//                         >
//                           <div className="flex justify-between items-start">
//                             <h3 className="text-gray-800 dark:text-white font-medium mb-2">
//                               {index + 1}. {question.question}
//                             </h3>
//                             {!isReadOnly && answers[question.id]?.id && (
//                               <button
//                                 onClick={() => onDeleteClick(question.id)}
//                                 className="right-3 bottom-3 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
//                                 disabled={isSubmitting}
//                               >
//                                 <Trash2 className="w-5 h-5" />
//                               </button>
//                             )}
//                           </div>
                          
//                           <div className="mt-3 relative">
//                             <textarea
//                               className={`w-full border ${
//                                 isReadOnly 
//                                   ? 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600' 
//                                   : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
//                               } rounded-md px-4 py-3 text-gray-800 dark:text-gray-200 min-h-[100px] focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all`}
//                               placeholder={isReadOnly ? "Sem resposta" : "Digite sua resposta aqui..."}
//                               value={answers[question.id]?.text || ''}
//                               onChange={(e) => onInputChange(question.id, e.target.value)}
//                               disabled={isReadOnly || isSubmitting}
//                             />
//                           </div>
//                         </motion.div>
//                       ))
//                     )}
//                   </motion.div>
//                 </div>
                
//                 {/* Footer */}
//                 <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex justify-end">
//                   <div className="flex gap-3">
//                     <button
//                       onClick={onClose}
//                       className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium flex items-center"
//                       disabled={isSubmitting}
//                     >
//                       <X className="w-4 h-4 mr-2" />
//                       Fechar
//                     </button>
                    
//                     {!isReadOnly && (
//                       <motion.button
//                         whileHover={{ scale: 1.03 }}
//                         whileTap={{ scale: 0.98 }}
//                         onClick={onSubmit}
//                         className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors font-medium flex items-center"
//                         disabled={isSubmitting}
//                       >
//                         {isSubmitting ? (
//                           <>
//                             <motion.div
//                               animate={{ rotate: 360 }}
//                               transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                               className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
//                             />
//                             Salvando...
//                           </>
//                         ) : (
//                           <>
//                             <Save className="w-4 h-4 mr-2" />
//                             Salvar Respostas
//                           </>
//                         )}
//                       </motion.button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       )}
//     </AnimatePresence>
//   );
// };





import { motion, AnimatePresence } from 'framer-motion';
import { Save, HelpCircle, Trash2 } from 'lucide-react';
import Button from '../../../components/ui/button/Button';

// Utils
import { getEvaluationStatusIcon } from "./getEvaluationStatusIcon"

import { Modal } from '../../../components/ui/modal';
import TextArea from '../../../components/form/input/TextArea';
import Radio from '../../../components/form/input/Radio';
import Input from '../../../components/form/input/InputField';
import { useAuth } from '../../../context/AuthContext';
import Label from '../../../components/form/Label';
import RangeSlider from './RangeSlider'

interface Question {
  id: string;
  question: string;
  points: number;
  typeQuestion: 'text' | 'number' | 'yes_no';
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Evaluation {
  id: string;
  week: number;
  status: 'open' | 'closed';
  createdAt?: string;
}
interface AnswerModalAnswer {
  id?: string;
  text?: string;
  observation?: string;
}

interface AnswerModalProps {
  isOpen: boolean;
  evaluation: Evaluation | null;
  questions: Question[] | null
  answers: Record<string, AnswerModalAnswer>;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: () => void;
  progress: number;
  onInputChange: (questionId: string, value: string, field: "text" | "observation") => void;
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
  progress,
  onInputChange, 
  onDeleteClick 
}) => {
  if (!isOpen || !evaluation) return null;

  console.log("sds", answers)
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
                            <>
                              <TextArea
                                value={answers[question.id]?.text || ''}
                                onChange={(value: string) => onInputChange(question.id, value, 'text')}
                                placeholder="Digite sua resposta aqui..."
                                rows={3}
                                disabled={!!(answers[question.id]?.id && isEditable)}
                              />

                              <Label>Observação</Label>
                              <Input
                                type="text"
                                placeholder="Opcional"
                                className="dark:bg-dark-900"
                                value={answers[question.id]?.observation || ''}
                                onChange={(e) => onInputChange(question.id, e.target.value, 'observation')}
                                disabled={!!(answers[question.id]?.id && isEditable)}
                              />

                            </>
                          )}
                          
                          {/* {question.typeQuestion === "number" && (
                            <Input
                              type="number"
                              value={answers[question.id]?.text || ''}
                              onChange={(e) => onInputChange(question.id, e.target.value)}
                              placeholder="Digite um número"
                              min={0}
                              disabled={!!(answers[question.id] && answers[question.id].id && isEditable)}
                            />
                          )} */}
                            {question.typeQuestion === "number" && (
                              <>
                                <RangeSlider
                                  questionId={question.id}
                                  value={Number(answers[question.id]?.text) || 0}
                                  onChange={(e) => onInputChange(question.id, String(e.target.value), 'text')}
                                  disabled={!!(answers[question.id] && answers[question.id].id && isEditable)}
                                />
                                <Label>Observação</Label>
                                  <Input
                                    type="text"
                                    placeholder="Opcional"
                                    className="dark:bg-dark-900"
                                    value={answers[question.id]?.observation || ''}
                                    onChange={(e) => onInputChange(question.id, e.target.value, 'observation')}
                                    disabled={!!(answers[question.id]?.id && isEditable)}
                                  />
                            </>
                          )}

                          {question.typeQuestion === "yes_no" && (
                            <>
                            <div className="flex flex-wrap items-center gap-8">
                              
                                {/* <input
                                  type="radio"
                                  name={`yes_no_${question.id}`}
                                  checked={answers[question.id]?.text === 'sim'}
                                  onChange={() => onInputChange(question.id, 'sim')}
                                  className="form-radio h-4 w-4 text-blue-600 dark:text-blue-400"
                                /> */}
                                <Radio
                                  id={`sim_${question.id}`}
                                  name={`yes_no_${question.id}`}
                                  value="sim"
                                  checked={answers[question.id]?.text === 'sim'}
                                  onChange={() => onInputChange(question.id, 'sim', 'text')}
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
                                  id={`nao_${question.id}`}
                                  name={`yes_no_${question.id}`}
                                  value="não"
                                  checked={answers[question.id]?.text === 'não'}
                                  onChange={() => onInputChange(question.id, 'não', 'text')}
                                  label="Não"
                                  disabled={!!(answers[question.id] && answers[question.id].id && isEditable)}
                                  
                                />                     
                            </div>
                              <Label>Observação</Label>
                                <Input
                                  type="text"
                                  placeholder="Opcional"
                                  className="dark:bg-dark-900"
                                  value={answers[question.id]?.observation || ''}
                                  onChange={(e) => onInputChange(question.id, e.target.value, 'observation')}
                                  disabled={!!(answers[question.id]?.id && isEditable)}
                                />
                            </>

                          )}
                        </>
                      ) : (
                        <div className={`${answers[question.id]?.text ? 'dark:text-gray-400' : 'dark:text-red-400 text-sm'}  bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-md min-h-[80px]`} >
                          {answers[question.id]?.text || 'Sem resposta meu patrão....'}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {isSubmitting && (
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ height: '10px', background: '#eee', borderRadius: '5px' }}>
                  <div
                    style={{
                      width: `${progress}%`,
                      height: '100%',
                      background: '#4caf50',
                      borderRadius: '5px',
                      transition: 'width 0.3s ease-in-out'
                    }}
                  />
                </div>
                <p>{Math.round(progress)}% concluído</p>
              </div>
            )}

        
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
                      Salvar Resposta
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

