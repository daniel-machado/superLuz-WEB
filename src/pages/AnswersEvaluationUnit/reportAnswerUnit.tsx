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

// Types
import { Evaluation, Question, Answer } from './@types';

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
  const [allAnswers, setAllAnswers] = useState<Answer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<{ text: string; id?: string } | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  console.log("AllAndewes", allAnswers);
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
    } catch (error) {
      console.error("Erro ao carregar avaliações:", error);
      toast.error("Erro ao carregar avaliações da unidade", {position: 'bottom-right'});
      setIsLoading(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      const data = await unitQuestionService.ListQuestions();
      setQuestions(data);
    } catch (error) {
      console.error("Erro ao carregar perguntas:", error);
      toast.error("Erro ao carregar perguntas", {position: 'bottom-right'});
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
    } catch (error) {
      console.error("Erro ao carregar respostas:", error);
      toast.error("Erro ao carregar respostas anteriores", {position: 'bottom-right'});
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
    
      // For each question with an answer, send the answer
      const answersPromises = Object.keys(answers).map(questionId => {
        // Skip if empty answer
        if (!answers[questionId]?.text?.trim()) return Promise.resolve();
        
        const payload = {
          unitId,
          questionId,
          answer: answers[questionId].text,
          week: selectedEvaluation.week || 1
        };
        
        return unitAnswerService.createAnswer(payload);

      });
    
      await Promise.all(answersPromises.filter(Boolean));
    
      toast.success("Respostas enviadas com sucesso!", {position: 'bottom-right'});
      setModalOpen(false);
      setIsSubmitting(false);
      fetchEvaluations(); // Update evaluations list
    } catch (error) {
      console.error("Erro ao enviar respostas:", error);
      toast.error("Erro ao enviar respostas. Tente novamente.", {position: 'bottom-right'});
      setIsSubmitting(false);
    } finally{
      setModalOpen(false);
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
      } catch (err) {
        toast.error(`Erro ao excluir: ${err}`, { position: 'bottom-right' });
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
  );
};

export default reportAnswerUnit;
