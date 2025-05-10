import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Trash2, Save, AlertCircle } from 'lucide-react';


interface Evaluation {
  week: number;
  createdAt?: string;
}

interface DBVAnswerModalProps {
  isOpen: boolean;
  evaluation: Evaluation;
  questions: { id: string; question: string }[];
  answers: Record<string, { id?: string; text: string }>;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onInputChange: (id: string, value: string) => void;
  onDeleteClick: (id: string) => void;
  dbvName?: string;
  isReadOnly: boolean;
}

export const AnswerModal: React.FC<DBVAnswerModalProps> = ({
  isOpen,
  evaluation,
  questions,
  answers,
  isSubmitting,
  onClose,
  onSubmit,
  onInputChange,
  onDeleteClick,
  dbvName,
  isReadOnly
}) => {
  if (!isOpen || !evaluation) return null;


  // Animation variants
  const backdrop = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };


  const modal = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { delay: 0.1 } }
  };


  const item = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50  backdrop-blur-sm"
            variants={backdrop}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />
          
          <div className="min-h-screen px-4 text-center flex items-center justify-center">
            <motion.div
              className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
              variants={modal}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                {/* Header */}
                <div className="bg-gradient-to-r from-yellow-500 to-red-600 p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Calendar className="w-6 h-6 text-white mr-2" />
                      <h2 className="text-xl font-bold text-white">
                        Avaliação - Semana {evaluation.week}
                      </h2>
                    </div>
                    <button
                      onClick={onClose}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div className="mt-2 text-white/90 text-sm">
                    {dbvName && <p>Desbravador: {dbvName}</p>}
                    <p className="mt-1">
                      {evaluation.createdAt
                        ? `Data: ${new Date(evaluation.createdAt).toLocaleDateString('pt-BR')}`
                        : 'Data não disponível'}
                    </p>
                  </div>
                </div>
                
                {/* Status banner */}
                {isReadOnly && (
                  <div className="bg-blue-100 dark:bg-blue-900/40 border-l-4 border-blue-500 p-4">
                    <div className="flex">
                      <AlertCircle className="w-5 h-5 text-blue-500 mr-2" />
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Esta avaliação está fechada. As respostas não podem ser modificadas.
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Questions & Answers */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: {
                        transition: {
                          staggerChildren: 0.1
                        }
                      }
                    }}
                  >
                    {questions.length === 0 ? (
                      <div className="text-center py-10">
                        <p className="text-gray-500 dark:text-gray-400">
                          Nenhuma pergunta disponível para esta avaliação.
                        </p>
                      </div>
                    ) : (
                      questions.map((question, index) => (
                        <motion.div
                          key={question.id}
                          variants={item}
                          className="mb-6 last:mb-0 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg"
                        >
                          <div className="flex justify-between items-start">
                            <h3 className="text-gray-800 dark:text-white font-medium mb-2">
                              {index + 1}. {question.question}
                            </h3>
                            {!isReadOnly && answers[question.id]?.id && (
                              <button
                                onClick={() => onDeleteClick(question.id)}
                                className="right-3 bottom-3 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                disabled={isSubmitting}
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                          
                          <div className="mt-3 relative">
                            <textarea
                              className={`w-full border ${
                                isReadOnly 
                                  ? 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600' 
                                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                              } rounded-md px-4 py-3 text-gray-800 dark:text-gray-200 min-h-[100px] focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all`}
                              placeholder={isReadOnly ? "Sem resposta" : "Digite sua resposta aqui..."}
                              value={answers[question.id]?.text || ''}
                              onChange={(e) => onInputChange(question.id, e.target.value)}
                              disabled={isReadOnly || isSubmitting}
                            />
                          </div>
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                </div>
                
                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                  <div className="flex gap-3">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium flex items-center"
                      disabled={isSubmitting}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Fechar
                    </button>
                    
                    {!isReadOnly && (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onSubmit}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors font-medium flex items-center"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                            />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Salvar Respostas
                          </>
                        )}
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
