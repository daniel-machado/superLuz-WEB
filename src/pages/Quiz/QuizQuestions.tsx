import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { questionsService } from '../../services/questionsService';
import { answerService } from '../../services/answerService';
import Input from '../../components/form/input/InputField';
import Button from '../../components/ui/button/Button';
import Checkbox from '../../components/form/input/Checkbox';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Textarea from '../../components/form/input/TextArea';
import ComponentCard from '../../components/common/ComponentCard';
import { Trash2, Loader2, Edit, Plus, Save, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Modal } from '../../components/ui/modal';


interface Answer {
  id?: string;
  text: string;
  isCorrect: boolean;
}


interface Question {
  id: string;
  question: string;
  quizAnswers: {
    id: string;
    answer: string;
    isCorrect: boolean;
  }[];
}


export default function QuizQuestions() {
  const { id: quizId } = useParams();
  const [questionText, setQuestionText] = useState('');
  const [answers, setAnswers] = useState<Answer[]>(Array(4).fill({ text: '', isCorrect: false }));
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editAnswers, setEditAnswers] = useState<Answer[]>([]);
  const [editText, setEditText] = useState('');
  const [countQuestions, setCountQuestions] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;


  useEffect(() => {
    if (quizId) {
      fetchQuestions();
    }
  }, [quizId]);


  useEffect(() => {
    if (showEditModal || showDeleteModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }


    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showEditModal, showDeleteModal]);


  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const data = await questionsService.getAllByQuizId(quizId!);
      setCountQuestions(data.count);
      setQuestions(data.questions);
    } catch (error) {
      toast.error('Erro ao carregar perguntas', { position: 'bottom-right' });
    } finally {
      setIsLoading(false);
    }
  };


  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };


  const handleAnswerChange = (index: number, field: 'text' | 'isCorrect', value: any) => {
    const newAnswers = [...answers];


    if (field === 'isCorrect') {
      newAnswers.forEach((_a, i) => (newAnswers[i].isCorrect = false));
      
    }


    newAnswers[index] = {
      ...newAnswers[index],
      [field]: value,
    };
    setAnswers(newAnswers);
  };


  const handleEditAnswerChange = (index: number, field: 'text' | 'isCorrect', value: any) => {
    const newAnswers = [...editAnswers];
    if (field === 'isCorrect') {
      newAnswers.forEach((_a, i) => (newAnswers[i].isCorrect = false));
    }
    newAnswers[index] = {
      ...newAnswers[index],
      [field]: value,
    };
    setEditAnswers(newAnswers);
  };


  const handleCreateQuestion = async () => {
    if (!questionText.trim()) {
      toast.error('Digite a pergunta.', { position: 'bottom-right' });
      return;
    }


    const filledAnswers = answers.filter((a) => a.text.trim() !== '');
    if (filledAnswers.length < 2) {
      toast.error('Adicione pelo menos duas respostas.', { position: 'bottom-right' });
      return;
    }


    const hasCorrect = filledAnswers.some((a) => a.isCorrect);
    if (!hasCorrect) {
      toast.error('Marque ao menos uma resposta correta.', { position: 'bottom-right' });
      return;
    }


    setIsCreating(true);
    try {
      const question = await questionsService.createQuestion({
        question: questionText,
        quizId: quizId!,
      });


      for (const answer of filledAnswers) {
        await answerService.createAnswer({
          questionId: question.result.newQuestion.id,
          answer: answer.text,
          isCorrect: answer.isCorrect,
        });
      }


      toast.success('Pergunta criada com sucesso!', { position: 'bottom-right' });
      setQuestionText('');
      setAnswers(Array(4).fill({ text: '', isCorrect: false }));
      await fetchQuestions();
      scrollToTop();
    } catch (error) {
      toast.error('Erro ao salvar a pergunta.', { position: 'bottom-right' });
    } finally {
      setIsCreating(false);
    }
  };


  const handleUpdateQuestion = async () => {
    if (!editText.trim()) {
      toast.error('Digite a pergunta.', { position: 'bottom-right' });
      return;
    }


    const filledAnswers = editAnswers.filter((a) => a.text.trim() !== '');
    if (filledAnswers.length < 2) {
      toast.error('Adicione pelo menos duas respostas.', { position: 'bottom-right' });
      return;
    }


    const hasCorrect = filledAnswers.some((a) => a.isCorrect);
    if (!hasCorrect) {
      toast.error('Marque ao menos uma resposta correta.', { position: 'bottom-right' });
      return;
    }


    setIsUpdating(true);


    try {
      // Atualiza a pergunta
      await questionsService.updateQuestion(editingQuestion!.id, {
        question: editText,
      });


      const existingAnswers = editingQuestion!.quizAnswers; // Original do banco
      const updatedAnswerIds = [];
      for (const answer of filledAnswers) {
        if (answer.id) {
          // Se já tem ID, atualiza
          await answerService.updateAnswer(answer.id, {
            answer: answer.text,
            isCorrect: answer.isCorrect,
          });
          updatedAnswerIds.push(answer.id);
        } else {
          // Se não tem ID, é nova resposta
          const newAnswer = await answerService.createAnswer({
            questionId: editingQuestion!.id,
            answer: answer.text,
            isCorrect: answer.isCorrect,
          });
          updatedAnswerIds.push(newAnswer.id);
        }
      }


      // Deleta as respostas que não estão mais no formulário
      for (const oldAnswer of existingAnswers) {
        if (!updatedAnswerIds.includes(oldAnswer.id)) {
          await answerService.deleteAnswer(oldAnswer.id);
        }
      }


      toast.success('Pergunta atualizada com sucesso.', { position: 'bottom-right' });
      await fetchQuestions();
      scrollToTop();
    } catch (error) {
      toast.error('Erro ao atualizar a pergunta.', { position: 'bottom-right' });
    } finally {
      setIsUpdating(false);
      setShowEditModal(false);
    }
  };


  const openEditModal = (question: Question) => {
    setEditingQuestion(question);
    setEditText(question.question);


    const formattedAnswers = question.quizAnswers.map((a) => ({
      id: a.id,
      text: a.answer,
      isCorrect: a.isCorrect,
    }));


    setEditAnswers(
      formattedAnswers.length >= 4
        ? formattedAnswers
        : [
            ...formattedAnswers,
            ...Array(4 - formattedAnswers.length).fill({ text: '', isCorrect: false }),
          ]
    );


    setShowEditModal(true);
  };


  const openDeleteModal = (question: Question) => {
    setQuestionToDelete(question);
    setShowDeleteModal(true);
  };


  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await questionsService.deleteQuestion(questionToDelete!.id);
      toast.success('Pergunta excluída com sucesso.', { position: 'bottom-right' });
      await fetchQuestions();
      scrollToTop();
    } catch (error) {
      toast.error('Erro ao excluir a pergunta.', { position: 'bottom-right' });
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setQuestionToDelete(null);
    }
  };


  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingQuestion(null);
    setEditText('');
    setEditAnswers([]);
  };


  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setQuestionToDelete(null);
  };


  // Pagination handlers
  const indexOfLastQuestion = currentPage * itemsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - itemsPerPage;
  const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);
  const totalPages = Math.ceil(questions.length / itemsPerPage);


  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };


  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };


  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };


  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-950 text-gray-200">
      {/* Sidebar com perguntas já criadas - Visível apenas em telas grandes */}
      <aside className="hidden lg:block lg:w-80 xl:w-96 p-4 border-r border-gray-800 overflow-y-auto sticky top-0 h-screen bg-gray-900">
        <ComponentCard title={`Perguntas (${countQuestions})`} className="bg-gray-900 border-gray-800">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="animate-spin h-5 w-5 text-indigo-400" />
            </div>
          ) : (
            <>
              <motion.ul 
                className="space-y-3 mt-2"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                {questions.length === 0 ? (
                  <p className="text-sm text-gray-400">Nenhuma pergunta ainda.</p>
                ) : (
                  currentQuestions.map((q, index) => (
                    <motion.li
                      key={q.id}
                      className="border p-3 rounded-lg border-gray-800 bg-gray-850 hover:bg-gray-800 shadow-md flex justify-between items-start cursor-pointer transition-all duration-200 group"
                      variants={itemVariants}
                      onClick={() => openEditModal(q)}
                    >
                      <div className="w-full pr-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-indigo-900 text-indigo-200 text-xs font-semibold px-2 py-1 rounded-md">
                            {indexOfFirstQuestion + index + 1}
                          </span>
                          <h3 className="text-sm font-medium text-gray-200 truncate">
                            {q.question}
                          </h3>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {q.quizAnswers.map((answer, idx) => (
                            <span 
                              key={answer.id} 
                              className={`text-xs px-2 py-1 rounded ${
                                answer.isCorrect 
                                  ? 'bg-green-900 text-green-200' 
                                  : 'bg-gray-700 text-gray-300'
                              }`}
                            >
                              {String.fromCharCode(65 + idx)}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(q);
                          }}
                          className="text-indigo-400 hover:text-indigo-300 transition-colors p-1.5 bg-gray-800 rounded-full"
                          title="Editar"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal(q);
                          }}
                          className="text-red-400 hover:text-red-300 transition-colors p-1.5 bg-gray-800 rounded-full"
                          title="Excluir"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </motion.li>
                  ))
                )}
              </motion.ul>
              
              {/* Pagination for desktop */}
              {questions.length > 0 && (
                <div className="flex justify-center items-center gap-1 mt-4">
                  <button 
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-1 rounded-md text-gray-400 hover:text-gray-200 disabled:text-gray-700"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => paginate(i + 1)}
                      className={`w-7 h-7 rounded-md text-xs font-medium flex items-center justify-center transition-colors ${
                        currentPage === i + 1
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-400 hover:bg-gray-800'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button 
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1 rounded-md text-gray-400 hover:text-gray-200 disabled:text-gray-700"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </ComponentCard>
      </aside>


      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col">
        {/* Formulário de criação de pergunta */}
        <main className="flex-1 p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            <ComponentCard title="Criar Nova Pergunta" className="bg-gray-900 border-gray-800">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Pergunta</label>
                <Textarea
                  value={questionText}
                  onChange={(value: string) => setQuestionText(value)}
                  placeholder="Ex: Qual é o versículo mais curto da Bíblia?"
                  className="min-h-[100px] bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500 focus:border-indigo-600 focus:ring-indigo-600"
                />
              </div>


              {/* ALTERNATIVAS NOVAS */}
              <div className="space-y-3 mt-5">
                <h3 className="text-sm font-medium text-gray-300">Alternativas</h3>
                
                {answers.map((answer, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                      answer.isCorrect 
                        ? 'bg-green-900/20 border border-green-700/30' 
                        : 'bg-gray-800/50 border border-gray-700/30 hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-center mt-1">
                      <Checkbox
                        checked={answer.isCorrect}
                        onChange={(checked: boolean) => handleAnswerChange(index, 'isCorrect', checked)}
                        className={answer.isCorrect ? "text-green-500" : ""}
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <span className="text-xs font-medium text-gray-400 mr-2">
                          {String.fromCharCode(65 + index)}
                        </span>
                        {answer.isCorrect && (
                          <span className="text-xs bg-green-900 text-green-200 px-2 py-0.5 rounded-full">
                            Correta
                          </span>
                        )}
                      </div>
                      <Input
                        placeholder={`Alternativa ${index + 1}`}
                        value={answer.text}
                        onChange={(e) => handleAnswerChange(index, 'text', e.target.value)}
                        className="bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500 focus:border-indigo-600 focus:ring-indigo-600"
                      />
                    </div>
                  </div>
                ))}
              </div>


              <Button
                onClick={handleCreateQuestion}
                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Salvar Pergunta
                  </>
                )}
              </Button>
            </ComponentCard>
          </motion.div>
        </main>


        {/* Lista de perguntas para mobile */}
        <div className="lg:hidden p-4 border-t border-gray-800 bg-gray-900">
          <ComponentCard title={`Perguntas (${countQuestions})`} className="bg-gray-900 border-gray-800">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="animate-spin h-5 w-5 text-indigo-400" />
              </div>
            ) : (
              <div className="space-y-4">
                {questions.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">Nenhuma pergunta ainda.</p>
                ) : (
                  <AnimatePresence>
                    {currentQuestions.map((q, index) => (
                      <motion.div
                        key={q.id}
                        className="border p-4 rounded-lg border-gray-800 bg-gray-850 shadow-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <span className="bg-indigo-900 text-indigo-200 text-xs font-semibold px-2 py-1 rounded-md">
                            {indexOfFirstQuestion + index + 1}
                          </span>
                          <h3 className="text-sm font-medium text-gray-200">
                            {q.question}
                          </h3>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          {q.quizAnswers.map((answer, idx) => (
                            <div 
                              key={answer.id} 
                              className={`text-xs p-2 rounded flex items-center gap-1.5 ${
                                answer.isCorrect 
                                  ? 'bg-green-900/30 text-green-200 border border-green-700/30' 
                                  : 'bg-gray-800 text-gray-300 border border-gray-700/30'
                              }`}
                            >
                              <span className="font-medium">{String.fromCharCode(65 + idx)}</span>
                              <span className="truncate">{answer.answer}</span>
                              {answer.isCorrect && <Check size={12} className="ml-auto text-green-400" />}
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex justify-end gap-2 mt-2">
                          <Button
                            onClick={() => openEditModal(q)}
                            size="sm"
                            variant="outline"
                            className="border-gray-700 text-indigo-400 hover:text-indigo-300"
                          >
                            <Edit size={14} className="mr-1" />
                            Editar
                          </Button>
                          <Button
                            onClick={() => openDeleteModal(q)}
                            size="sm"
                            variant="outline"
                            className="border-gray-700 text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={14} className="mr-1" />
                            Excluir
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
                
                {/* Mobile pagination */}
                {questions.length > 0 && (
                  <div className="flex justify-center items-center gap-1 mt-4">
                    <button 
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-md text-gray-400 hover:text-gray-200 disabled:text-gray-700"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    
                    <span className="text-sm text-gray-400">
                      {currentPage} de {totalPages}
                    </span>
                    
                    <button 
                      onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-md text-gray-400 hover:text-gray-200 disabled:text-gray-700"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </ComponentCard>
        </div>
      </div>


      {/* Modal de Edição */}
      <Modal isOpen={showEditModal} onClose={closeEditModal}>
        <div className="bg-gray-900 p-5 rounded-lg border border-gray-800 shadow-lg text-gray-200 space-y-4">
          <h3 className="text-lg font-medium text-indigo-300 flex items-center gap-2">
            <Edit size={18} />
            Editar Pergunta
          </h3>
          
          <Textarea
            value={editText}
            onChange={(value: string) => setEditText(value)}
            className="min-h-[80px] bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500 focus:border-indigo-600 focus:ring-indigo-600"
            placeholder="Digite a pergunta"
          />


          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-300">Alternativas</h4>
            
            {editAnswers.map((answer, index) => (
              <div
                key={index}
                className={`flex gap-3 items-start p-3 rounded-lg transition-all ${
                  answer.isCorrect 
                    ? 'bg-green-900/20 border border-green-700/30' 
                    : 'bg-gray-800/50 border border-gray-700/30 hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center justify-center mt-1">
                  <Checkbox
                    checked={answer.isCorrect}
                    onChange={(checked: boolean) => handleEditAnswerChange(index, 'isCorrect', checked)}
                    className={answer.isCorrect ? "text-green-500" : ""}
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <span className="text-xs font-medium text-gray-400 mr-2">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {answer.isCorrect && (
                      <span className="text-xs bg-green-900 text-green-200 px-2 py-0.5 rounded-full">
                        Correta
                      </span>
                    )}
                  </div>
                  <Input
                    value={answer.text}
                    onChange={(e) => handleEditAnswerChange(index, 'text', e.target.value)}
                    placeholder={`Alternativa ${index + 1}`}
                    className="bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500 focus:border-indigo-600 focus:ring-indigo-600"
                  />
                </div>
              </div>
            ))}
          </div>


          <div className="flex justify-end gap-3 pt-4">
            <Button 
              onClick={closeEditModal} 
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <X size={16} className="mr-1" />
              Cancelar
            </Button>
            <Button 
              onClick={handleUpdateQuestion} 
              disabled={isUpdating}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-1" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>


      {/* Modal de Confirmação de Exclusão */}
      <Modal isOpen={showDeleteModal} onClose={closeDeleteModal}>
        <div className="bg-gray-900 p-5 rounded-lg border border-gray-800 shadow-lg text-gray-200 space-y-4">
          <h3 className="text-lg font-medium text-red-400 flex items-center gap-2">
            <Trash2 size={18} />
            Confirmar Exclusão
          </h3>
          
          {questionToDelete && (
            <div className="bg-gray-800 p-3 rounded border border-gray-700 mb-3">
              <p className="text-sm text-gray-300 font-medium">{questionToDelete.question}</p>
            </div>
          )}
          
          <p className="text-gray-300">Tem certeza que deseja excluir esta pergunta?</p>
          <p className="text-sm text-gray-400">Esta ação não pode ser desfeita.</p>
          
          <div className="flex justify-end gap-3 pt-2">
            <Button 
              variant="outline" 
              onClick={closeDeleteModal}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <X size={16} className="mr-1" />
              Cancelar
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                <>
                  <Trash2 size={16} className="mr-1" />
                  Confirmar Exclusão
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}



















// // src/Screens/QuizQuestions.tsx
// import { useParams } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import { questionsService } from '../../services/questionsService';
// import { answerService } from '../../services/answerService';
// import Input from '../../components/form/input/InputField';
// import Button from '../../components/ui/button/Button';
// import Checkbox from '../../components/form/input/Checkbox';
// import { toast } from 'react-hot-toast';
// import { motion } from 'framer-motion';
// import Textarea from '../../components/form/input/TextArea';
// import ComponentCard from '../../components/common/ComponentCard';
// import { Trash2, Loader2 } from 'lucide-react';
// import { Modal } from '../../components/ui/modal';

// interface Answer {
//   id: string;
//   text: string;
//   isCorrect: boolean;
// }

// export default function QuizQuestions() {
//   const { id: quizId } = useParams();
//   const [questionText, setQuestionText] = useState('');
//   const [answers, setAnswers] = useState<Answer[]>(Array(4).fill({ text: '', isCorrect: false }));
//   const [questions, setQuestions] = useState<any[]>([]);
//   const [editingQuestion, setEditingQuestion] = useState<any | null>(null);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [questionToDelete, setQuestionToDelete] = useState<any | null>(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [editAnswers, setEditAnswers] = useState<Answer[]>([]);
//   const [editText, setEditText] = useState('');
//   const [countQuestions, setCountQuestions] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isCreating, setIsCreating] = useState(false);
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);

//   useEffect(() => {
//     if (quizId) {
//       fetchQuestions();
//     }
//   }, [quizId]);

//   useEffect(() => {
//     if (showEditModal || showDeleteModal) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'auto';
//     }

//     return () => {
//       document.body.style.overflow = 'auto';
//     };
//   }, [showEditModal, showDeleteModal]);

//   const fetchQuestions = async () => {
//     setIsLoading(true);
//     try {
//       const data = await questionsService.getAllByQuizId(quizId!);
//       setCountQuestions(data.count);
//       setQuestions(data.questions);
//     } catch (error) {
//       toast.error('Erro ao carregar perguntas', {position: 'bottom-right'});
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const scrollToTop = () => {
//     window.scrollTo({
//       top: 0,
//       behavior: 'smooth'
//     });
//   };

//   const handleAnswerChange = (index: number, field: 'text' | 'isCorrect', value: any) => {
//     const newAnswers = [...answers];

//     if (field === 'isCorrect') {
//       newAnswers.forEach((a, i) => (newAnswers[i].isCorrect = false));
//     }

//     newAnswers[index] = {
//       ...newAnswers[index],
//       [field]: value,
//     };
//     setAnswers(newAnswers);
//   };

//   const handleEditAnswerChange = (index: number, field: 'text' | 'isCorrect', value: any) => {
//     const newAnswers = [...editAnswers];
//     if (field === 'isCorrect') {
//       newAnswers.forEach((a, i) => (newAnswers[i].isCorrect = false));
//     }
//     newAnswers[index] = {
//       ...newAnswers[index],
//       [field]: value,
//     };
//     setEditAnswers(newAnswers);
//   };

//   const handleCreateQuestion = async () => {
//     if (!questionText.trim()) {
//       toast.error('Digite a pergunta.', {position: 'bottom-right'});
//       return;
//     }

//     const filledAnswers = answers.filter((a) => a.text.trim() !== '');
//     if (filledAnswers.length < 2) {
//       toast.error('Adicione pelo menos duas respostas.', {position: 'bottom-right'});
//       return;
//     }

//     const hasCorrect = filledAnswers.some((a) => a.isCorrect);
//     if (!hasCorrect) {
//       toast.error('Marque ao menos uma resposta correta.', {position: 'bottom-right'});
//       return;
//     }

//     setIsCreating(true);
//     try {
//       const question = await questionsService.createQuestion({
//         question: questionText,
//         quizId: quizId!,
//       });

//       for (const answer of filledAnswers) {
//         await answerService.createAnswer({
//           questionId: question.result.newQuestion.id,
//           answer: answer.text,
//           isCorrect: answer.isCorrect,
//         });
//       }

//       toast.success('Pergunta criada com sucesso!', {position: 'bottom-right'});
//       setQuestionText('');
//       setAnswers(Array(4).fill({ text: '', isCorrect: false }));
//       await fetchQuestions();
//       scrollToTop();
//     } catch (error) {
//       toast.error('Erro ao salvar a pergunta.', {position: 'bottom-right'});
//     } finally {
//       setIsCreating(false);
//     }
//   };

//   // const handleUpdateQuestion = async () => {
//   //   if (!editText.trim()) {
//   //     toast.error('Digite a pergunta.');
//   //     return;
//   //   }

//   //   const filledAnswers = editAnswers.filter((a) => a.text.trim() !== '');
//   //   if (filledAnswers.length < 2) {
//   //     toast.error('Adicione pelo menos duas respostas.');
//   //     return;
//   //   }

//   //   const hasCorrect = filledAnswers.some((a) => a.isCorrect);
//   //   if (!hasCorrect) {
//   //     toast.error('Marque ao menos uma resposta correta.');
//   //     return;
//   //   }

//   //   setIsUpdating(true);
//   //   try {
//   //     await questionsService.updateQuestion(editingQuestion.id, {
//   //       question: editText,
//   //     });

//   //     await answerService.deleteAnswer(editingQuestion.id);

//   //     for (const answer of filledAnswers) {
//   //       await answerService.createAnswer({
//   //         questionId: editingQuestion.id,
//   //         answer: answer.text,
//   //         isCorrect: answer.isCorrect,
//   //       });
//   //     }

//   //     toast.success('Pergunta atualizada com sucesso.');
//   //     await fetchQuestions();
//   //     scrollToTop();
//   //   } catch (error) {
//   //     toast.error('Erro ao atualizar a pergunta.');
//   //   } finally {
//   //     setIsUpdating(false);
//   //     setShowEditModal(false);
//   //   }
//   // };

//   const handleUpdateQuestion = async () => {
//     if (!editText.trim()) {
//       toast.error('Digite a pergunta.', {position: 'bottom-right'});
//       return;
//     }
  
//     const filledAnswers = editAnswers.filter((a) => a.text.trim() !== '');
//     if (filledAnswers.length < 2) {
//       toast.error('Adicione pelo menos duas respostas.', {position: 'bottom-right'});
//       return;
//     }
  
//     const hasCorrect = filledAnswers.some((a) => a.isCorrect);
//     if (!hasCorrect) {
//       toast.error('Marque ao menos uma resposta correta.', {position: 'bottom-right'});
//       return;
//     }
  
//     setIsUpdating(true);
  
//     try {
//       // Atualiza a pergunta
//       await questionsService.updateQuestion(editingQuestion.id, {
//         question: editText,
//       });
  
//       const existingAnswers = editingQuestion.quizAnswers; // Original do banco
//       const updatedAnswerIds = [];
//       for (const answer of filledAnswers) {
//         if (answer.id) {
//           // Se já tem ID, atualiza
//           await answerService.updateAnswer(answer.id, {
//             answer: answer.text,
//             isCorrect: answer.isCorrect,
//           });
//           updatedAnswerIds.push(answer.id);
//         } else {
//           // Se não tem ID, é nova resposta
//           const newAnswer = await answerService.createAnswer({
//             questionId: editingQuestion.id,
//             answer: answer.text,
//             isCorrect: answer.isCorrect,
//           });
//           updatedAnswerIds.push(newAnswer.id);
//         }
//       }
  
//       // Deleta as respostas que não estão mais no formulário
//       for (const oldAnswer of existingAnswers) {
//         if (!updatedAnswerIds.includes(oldAnswer.id)) {
//           await answerService.deleteAnswer(oldAnswer.id);
//         }
//       }
  
//       toast.success('Pergunta atualizada com sucesso.', {position: 'bottom-right'});
//       await fetchQuestions();
//       scrollToTop();
//     } catch (error) {
//       toast.error('Erro ao atualizar a pergunta.', {position: 'bottom-right'});
//     } finally {
//       setIsUpdating(false);
//       setShowEditModal(false);
//     }
//   };
  

//   const openEditModal = (question: any) => {
//     setEditingQuestion(question);
//     setEditText(question.question);
  
//     const formattedAnswers = question.quizAnswers.map((a: any) => ({
//       id: a.id, 
//       text: a.answer,
//       isCorrect: a.isCorrect,
//     }));
    
//     setEditAnswers(
//       formattedAnswers.length >= 4
//         ? formattedAnswers
//         : [
//             ...formattedAnswers,
//             ...Array(4 - formattedAnswers.length).fill({ text: '', isCorrect: false }),
//           ]
//     );
  
//     setShowEditModal(true);
//   };
  
  

//   const openDeleteModal = (question: any) => {
//     setQuestionToDelete(question);
//     setShowDeleteModal(true);
//   };

//   const handleDelete = async () => {
//     setIsDeleting(true);
//     try {
//       await questionsService.deleteQuestion(questionToDelete.id);
//       toast.success('Pergunta excluída com sucesso.', {position: 'bottom-right'});
//       await fetchQuestions();
//       scrollToTop();
//     } catch (error) {
//       toast.error('Erro ao excluir a pergunta.', {position: 'bottom-right'});
//     } finally {
//       setIsDeleting(false);
//       setShowDeleteModal(false);
//       setQuestionToDelete(null);
//     }
//   };

//   const closeEditModal = () => {
//     setShowEditModal(false);
//     setEditingQuestion(null);
//     setEditText('');
//     setEditAnswers([]);
//   };

//   const closeDeleteModal = () => {
//     setShowDeleteModal(false);
//     setQuestionToDelete(null);
//   };

//   return (
//     <div className="flex flex-col lg:flex-row min-h-screen">
//       {/* Sidebar com perguntas já criadas - Visível apenas em telas grandes */}
//       <aside className="hidden lg:block lg:w-64 p-4 border-r overflow-y-auto sticky top-0 h-screen">
//         <ComponentCard title={`Perguntas (${countQuestions})`}>
//           {isLoading ? (
//             <div className="flex justify-center py-4">
//               <Loader2 className="animate-spin h-5 w-5" />
//             </div>
//           ) : (
//             <ul className="space-y-2">
//               {questions.length === 0 ? (
//                 <p className="text-sm text-muted-foreground">Nenhuma pergunta ainda.</p>
//               ) : (
//                 questions.map((q, index) => (
//                   <motion.li
//                     key={q.id}
//                     className="border p-2 rounded-md border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-sm flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     onClick={() => openEditModal(q)}
//                   >
//                     <span className="w-full pr-2 text-left text-sm font-medium text-gray-600 truncate">
//                       {index + 1}° - {q.question}
//                     </span>
//                     <button 
//                       onClick={(e) => { 
//                         e.stopPropagation(); 
//                         openDeleteModal(q); 
//                       }}
//                       className="text-red-500 hover:text-red-700 transition-colors"
//                     >
//                       <Trash2 size={16} />
//                     </button>
//                   </motion.li>
//                 ))
//               )}
//             </ul>
//           )}
//         </ComponentCard>
//       </aside>

//       {/* Conteúdo principal */}
//       <div className="flex-1 flex flex-col">
//         {/* Formulário de criação de pergunta */}
//         <main className="flex-1 p-6">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3 }}
//             className="max-w-3xl mx-auto"
//           >
//             <ComponentCard title="Criar Nova Pergunta">
//               <div>
//                 <label className="block text-sm font-medium mb-1 text-muted-foreground">Pergunta</label>
//                 <Textarea
//                   value={questionText}
//                   onChange={(value: string) => setQuestionText(value)}
//                   placeholder="Ex: Qual é o versículo mais curto da Bíblia?"
//                   className="min-h-[100px]"
//                 />
//               </div>

//               {/* ALTERNATIVAS NOVAS */}
//               <div className="space-y-4 mt-4">
//                 {answers.map((answer, index) => (
//                   <div
//                     key={index}
//                     className="flex items-start gap-3 p-3 rounded-lg  transition-all hover:shadow-sm"
//                   >
//                     <Checkbox
//                       checked={answer.isCorrect}
//                       onChange={(checked: boolean) => handleAnswerChange(index, 'isCorrect', checked)}
//                       className="mt-1"
//                     />
//                     <Input
//                       placeholder={`Alternativa ${index + 1}`}
//                       value={answer.text}
//                       onChange={(e) => handleAnswerChange(index, 'text', e.target.value)}
//                       className="flex-1"
//                     />
//                   </div>
//                 ))}
//               </div>

//               <Button 
//                 onClick={handleCreateQuestion} 
//                 className="w-full mt-6"
//                 disabled={isCreating}
//               >
//                 {isCreating ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Salvando...
//                   </>
//                 ) : (
//                   'Salvar Pergunta'
//                 )}
//               </Button>
//             </ComponentCard>
//           </motion.div>
//         </main>

//         {/* Lista de perguntas para mobile */}
//         <div className="lg:hidden p-4 border-t">
//           <ComponentCard title={`Perguntas (${countQuestions})`}>
//             {isLoading ? (
//               <div className="flex justify-center py-4">
//                 <Loader2 className="animate-spin h-5 w-5" />
//               </div>
//             ) : (
//               <div className="overflow-x-auto pb-4">
//                 <div className="flex space-x-4 w-max min-w-full py-2">
//                   {questions.length === 0 ? (
//                     <p className="text-sm text-muted-foreground">Nenhuma pergunta ainda.</p>
//                   ) : (
//                     questions.map((q, index) => (
//                       <motion.div
//                         key={q.id}
//                         className="border p-3 rounded-md border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-sm flex flex-col w-64 flex-shrink-0"
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                       >
//                         <div 
//                           className="flex-1 cursor-pointer mb-2"
//                           onClick={() => openEditModal(q)}
//                         >
//                           <p className="text-sm font-medium text-gray-600 line-clamp-3">
//                             {index + 1}° - {q.question}
//                           </p>
//                         </div>
//                         <div className="flex justify-end">
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               openDeleteModal(q);
//                             }}
//                             className="text-red-500 hover:text-red-700 transition-colors"
//                           >
//                             <Trash2 size={16} />
//                           </button>
//                         </div>
//                       </motion.div>
//                     ))
//                   )}
//                 </div>
//               </div>
//             )}
//           </ComponentCard>
//         </div>
//       </div>

//       {/* Modal de Edição */}
//       <Modal isOpen={showEditModal} onClose={closeEditModal}>
//         <div className="space-y-4">
//           <h3 className="text-lg font-medium">Editar Pergunta</h3>
//           <Textarea
//             value={editText}
//             onChange={(value: string) => setEditText(value)}
//             className="min-h-[80px]"
//             placeholder="Digite a pergunta"
//           />

//           <div className="space-y-2">
//             {editAnswers.map((answer, index) => (
//               <div 
//                 key={index} 
//                 className="flex gap-3 items-start p-2 rounded-md hover:bg-gray-100 transition-colors"
//               >
//                 <Checkbox
//                   checked={answer.isCorrect}
//                   onChange={(checked: boolean) => handleEditAnswerChange(index, 'isCorrect', checked)}
//                   className="mt-1"
//                 />
//                 <Input
//                   value={answer.text}
//                   onChange={(e) => handleEditAnswerChange(index, 'text', e.target.value)}
//                   placeholder={`Alternativa ${index + 1}`}
//                   className="flex-1"
//                 />
//               </div>
//             ))}
//           </div>

//           <div className="flex justify-end gap-2 pt-4">
//             <Button onClick={closeEditModal} variant="outline">
//               Cancelar
//             </Button>
//             <Button onClick={handleUpdateQuestion} disabled={isUpdating}>
//               {isUpdating ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Salvando...
//                 </>
//               ) : (
//                 'Salvar Alterações'
//               )}
//             </Button>
//           </div>
//         </div>
//       </Modal>

//       {/* Modal de Confirmação de Exclusão */}
//       <Modal isOpen={showDeleteModal} onClose={closeDeleteModal}>
//         <div className="space-y-4">
//           <h3 className="text-lg font-medium">Confirmar Exclusão</h3>
//           <p>Tem certeza que deseja excluir esta pergunta?</p>
//           <div className="flex justify-end gap-2 pt-2">
//             <Button variant="outline" onClick={closeDeleteModal}>
//               Cancelar
//             </Button>
//             <Button 
//               onClick={handleDelete} 
//               disabled={isDeleting} 
//               //variant="destructive"
//             >
//               {isDeleting ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Excluindo...
//                 </>
//               ) : (
//                 'Confirmar Exclusão'
//               )}
//             </Button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// }