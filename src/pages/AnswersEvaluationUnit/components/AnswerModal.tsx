import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, HelpCircle, Trash2 } from 'lucide-react';
import Button from '../../../components/ui/button/Button';

// Utils
import { getEvaluationStatusIcon } from '../utils/getEvaluationStatusIcon'
import { Evaluation, Question } from '../@types';

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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50"
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
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        
          <div className="p-6 overflow-y-auto max-h-[60vh]">
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
                    className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                  >
                    <div className='flex justify-between items-center mb-2'>
                      <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                        {index + 1}. {question.question}
                      </label>
                      {answers[question.id] && answers[question.id].id && isEditable && (
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
                      <textarea
                        value={answers[question.id]?.text || ''}
                        onChange={(e) => onInputChange(question.id, e.target.value)}
                        placeholder="Digite sua resposta aqui..."
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-all"
                        rows={3}
                        disabled={answers[question.id]?.id !== undefined}
                      />
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
  );
};
