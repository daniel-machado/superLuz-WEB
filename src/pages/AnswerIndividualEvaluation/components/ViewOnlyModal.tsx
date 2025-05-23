

import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import Button from '../../../components/ui/button/Button';

// Utils
import { getEvaluationStatusIcon } from "./getEvaluationStatusIcon"
import { Modal } from '../../../components/ui/modal';
import TextArea from '../../../components/form/input/TextArea';
import Radio from '../../../components/form/input/Radio';
import RangeSlider from './RangeSlider';
import Label from '../../../components/form/Label';

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
  onClose: () => void;
}


export const ViewOnlyModal: React.FC<AnswerModalProps> = ({ 
  isOpen, 
  evaluation, 
  questions, 
  answers, 
  onClose, 
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

  //const isEditable = false

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
                  "Visualizando respostas
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
                      </div>
                  
                      {answers[question.id] && answers[question.id].id ? (
                        <>
                          {question.typeQuestion === "text" && (
                            // <textarea
                            //   value={answers[question.id]?.text || ''}
                            //   onChange={(e) => onInputChange(question.id, e.target.value)}
                            //   placeholder="Digite sua resposta aqui..."
                            //   className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-all"
                            //   rows={3}
                            // />
                            <>
                            <TextArea
                            value={answers[question.id]?.text || ''}
                            //onChange={(value: string) => onInputChange(question.id, value)}
                            placeholder="Digite sua resposta aqui..."
                            rows={3}
                            disabled
                          />
                            <Label>Observação</Label>
                            <div className={`dark:text-gray-400 bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-md min-h-[50px]`} >
                              {answers[question.id]?.observation || 'Sem observação'}
                            </div>
                          </>
                          )}
                           
                            {
                              question.typeQuestion === "number" && (
                                <>
                                <RangeSlider
                                  questionId={question.id}
                                  value={Number(answers[question.id]?.text) || 0}
                                  //onChange={(e) => onInputChange(question.id, String(e.target.value))}
                                  disabled
                                />
                                  <Label>Observação</Label>
                                  <div className={`dark:text-gray-400bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-md min-h-[50px]`} >
                                    {answers[question.id]?.observation || 'Sem observação'}
                                  </div>
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
                                  id="radio1"
                                  name={`yes_no_${question.id}`}
                                  value="option1"
                                  checked={answers[question.id]?.text === 'sim'}
                                  onChange={() => {}}
                                  label="Sim"
                                  disabled
                                  
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
                                  onChange={() => {}}
                                  label="Não"
                                  disabled
                                  
                                />  

                            </div>
                              <Label>Observação</Label>
                              <div className={`dark:text-gray-400 bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-md min-h-[50px]`} >
                                {answers[question.id]?.observation || 'Sem observação'}
                              </div>
                            </>
                          )}
                        </>
                      ) : (
                        <div className={`${answers[question.id]?.text ? 'dark:text-gray-400' : 'dark:text-red-400 text-sm'}  bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-md min-h-[50px]`} >
                          {answers[question.id]?.text || 'Sem resposta meu patrão....'}
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
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </Modal>
  );
  
};
