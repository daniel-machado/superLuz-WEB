
import { useParams, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { questionsService } from '../../services/questionsService';
import { quizAttemptService } from '../../services/quizAttemptService';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiClock, FiLoader, FiArrowRight, FiAward, FiStar, FiThumbsUp } from 'react-icons/fi';
import confetti from 'canvas-confetti';


interface IQuestions {
  count: number;
  questions: {
    id: string;
    quizId: string;
    question: string;
    createdAt: string;
    updatedAt: string;
    quizAnswers: {
      id: string;
      questionId: string
      answer: string;
      isCorrect: boolean;
      createdAt: string;
      updatedAt: string;
    }[]
  }[]
}


interface ISelectedAnswers {
  [key: string]: string;
}


interface IQuizResult {
  newAttempt: {
    id: string;
    userId: string;
    quizId: string;
    score: number;
    status: string;
    failedQuizzes: number;
    attemptDate: string;
    failedAttempts: number;
    lastAttempt: string;
  }
}


export default function QuizScreen() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const LoggerUser = user?.user.user;


  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<IQuestions | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1); // -1 means intro screen
  const [selectedAnswers, setSelectedAnswers] = useState<ISelectedAnswers>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [_error, setError] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<IQuizResult | null>(null);
  const [timer, setTimer] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [showCountdown, setShowCountdown] = useState(false);
  // New state for animations
  const [showScoreAnimation, setShowScoreAnimation] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    fetchQuestionsQuiz();
  }, [quizId]);


  // Countdown timer logic
  useEffect(() => {
    if (showCountdown && countdown > 0) {
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
     
      return () => clearInterval(countdownInterval);
    } else if (showCountdown && countdown === 0) {
      setShowCountdown(false);
      setCurrentQuestionIndex(0);
      setTimerActive(true);
    }
  }, [showCountdown, countdown]);


  // Question timer logic
  useEffect(() => {
    if (timerActive && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
     
      return () => clearInterval(interval);
    } else if (timerActive && timer === 0) {
      // Time's up for this question, move to next
      handleTimeUp();
    }
  }, [timerActive, timer]);


  // Reset timer when moving to a new question
  useEffect(() => {
    if (currentQuestionIndex >= 0) {
      setTimer(30);
      setTimerActive(true);
    }
  }, [currentQuestionIndex]);


  // Animation sequence for quiz results
  useEffect(() => {
    if (quizResult) {
      if (quizResult.newAttempt.status === 'approved') {
        // For approved quiz, trigger celebratory animations
        setTimeout(() => {
          setShowScoreAnimation(true);
          
          // First confetti burst
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
          
          setTimeout(() => {
            setShowCelebration(true);
            
            // Second confetti burst with different colors
            confetti({
              particleCount: 150,
              angle: 60,
              spread: 55,
              origin: { x: 0, y: 0.6 },
              colors: ['#26ccff', '#a25afd']
            });
            
            setTimeout(() => {
              // Final confetti burst from opposite side
              confetti({
                particleCount: 150,
                angle: 120,
                spread: 55,
                origin: { x: 1, y: 0.6 },
                colors: ['#f39c12', '#2ecc71']
              });
            }, 500);
          }, 1000);
        }, 500);
      } else {
        // For failed quiz, just show score without celebration
        setShowScoreAnimation(true);
      }
    }
  }, [quizResult]);


  const fetchQuestionsQuiz = async () => {
    setIsLoading(true);
    try {
      if (!quizId) {
        throw new Error('Quiz ID is required.');
      }
      const data = await questionsService.getRandomQuestions(quizId);
      setQuestions(data.questions);
    } catch (err) {
      toast.error("Erro ao carregar Questions", { position: 'bottom-right' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartQuiz = () => {
    setShowCountdown(true);
    setCountdown(3);
  };


  const handleSelectAnswer = (questionId: string, answerId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerId
    }));
    setShowConfirmation(true);
  };


  const handleConfirmAnswer = () => {
    setShowConfirmation(false);
    setTimerActive(false);
   
    // Move to next question
    if (questions && currentQuestionIndex < questions.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // This was the last question, submit quiz
      submitQuizAnswers();
    }
  };


  const handleTimeUp = () => {
    setTimerActive(false);
    // Skip this question (no answer selected)
    if (questions && currentQuestionIndex < questions.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // This was the last question, submit quiz
      submitQuizAnswers();
    }
  };


  const submitQuizAnswers = useCallback(async () => {
    if (submitting || !questions || !quizId || !LoggerUser) return;


    try {
        setSubmitting(true);


        // Format the answers as expected by the service
        const formattedAnswers = Object.entries(selectedAnswers).map(([questionId, answerId]) => ({
            questionId,
            answerId,
        }));


        const requestBody = {
            userId: LoggerUser.id,
            quizId: quizId,
            answers: formattedAnswers
        };


        const result = await quizAttemptService.submitQuiz(requestBody);
        setQuizResult(result.result);
    } catch (err) {
        setError('Erro ao enviar o quiz. Tente novamente.');
    } finally {
        setSubmitting(false);
    }
  }, [questions, selectedAnswers, LoggerUser, quizId, submitting]);


  // const handleRetakeQuiz = () => {
  //   // Reset quiz state
  //   setQuizResult(null);
  //   setSelectedAnswers({});
  //   setCurrentQuestionIndex(-1);
  //   setShowScoreAnimation(false);
  //   setShowCelebration(false);
  //   // Refetch questions
  //   fetchQuestionsQuiz();
  // };


  // Calculate progress percentage
  const progressPercentage = questions && currentQuestionIndex >= 0
    ? ((currentQuestionIndex + 1) / questions.questions.length) * 100
    : 0;


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-xl">Carregando o quiz...</p>
      </div>
    );
  }


  // If we have quiz results, show the enhanced results screen
  if (quizResult) {
    const { score, status } = quizResult.newAttempt;
    const isPassing = status === 'approved';
    const totalQuestions = questions?.questions.length || 10;
    const scorePercentage = (score / totalQuestions) * 100;
    
    // Star ratings based on score percentage
    const stars = Math.ceil((scorePercentage / 100) * 5);
   
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 overflow-hidden">
        {/* Floating elements for approved quizzes */}
        {isPassing && showCelebration && (
          <>
            <motion.div 
              className="absolute"
              initial={{ y: -100, x: '10vw', opacity: 0 }}
              animate={{ y: '110vh', opacity: 1 }}
              transition={{ duration: 15, delay: 0.2, repeat: Infinity, repeatDelay: 5 }}
            >
              <FiStar className="text-yellow-400 text-4xl" />
            </motion.div>
            <motion.div 
              className="absolute"
              initial={{ y: -100, x: '30vw', opacity: 0 }}
              animate={{ y: '110vh', opacity: 1 }}
              transition={{ duration: 12, delay: 1.5, repeat: Infinity, repeatDelay: 7 }}
            >
              <FiAward className="text-blue-400 text-3xl" />
            </motion.div>
            <motion.div 
              className="absolute"
              initial={{ y: -100, x: '70vw', opacity: 0 }}
              animate={{ y: '110vh', opacity: 1 }}
              transition={{ duration: 17, delay: 3, repeat: Infinity, repeatDelay: 4 }}
            >
              <FiStar className="text-purple-400 text-5xl" />
            </motion.div>
            <motion.div 
              className="absolute"
              initial={{ y: -100, x: '85vw', opacity: 0 }}
              animate={{ y: '110vh', opacity: 1 }}
              transition={{ duration: 14, delay: 4.5, repeat: Infinity, repeatDelay: 6 }}
            >
              <FiThumbsUp className="text-green-400 text-3xl" />
            </motion.div>
          </>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 w-full max-w-md relative z-10"
        >
          {/* Background glow effect for passing */}
          {isPassing && showCelebration && (
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl -z-10"
              animate={{ 
                boxShadow: ['0 0 20px 10px rgba(59, 130, 246, 0.3)', '0 0 30px 15px rgba(59, 130, 246, 0.5)', '0 0 20px 10px rgba(59, 130, 246, 0.3)']
              }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            />
          )}
          
          <motion.h1 
            className={`text-2xl md:text-3xl font-bold text-center mb-6 ${isPassing ? 'text-gradient rounded-md bg-gradient-to-r from-blue-400 to-purple-500' : ''}`}
            animate={isPassing && showCelebration ? { 
              scale: [1, 1.05, 1],
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {isPassing ? "Parabéns! 🎉" : "Quiz Concluído"}
          </motion.h1>
          
          {/* Score circle with animated filling */}
          <div className="flex justify-center mb-8">
            <motion.div 
              className={`w-40 h-40 rounded-full flex items-center justify-center relative ${
                isPassing ? 'border-4 border-blue-500' : 'border-4 border-gray-600'
              }`}
              initial={{ borderColor: 'rgba(59, 130, 246, 0.2)' }}
              animate={isPassing && showCelebration ? { 
                borderColor: ['rgba(59, 130, 246, 0.8)', 'rgba(168, 85, 247, 0.8)', 'rgba(59, 130, 246, 0.8)'],
                boxShadow: ['0 0 10px rgba(59, 130, 246, 0.4)', '0 0 15px rgba(168, 85, 247, 0.4)', '0 0 10px rgba(59, 130, 246, 0.4)']
              } : {}}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {/* Circular progress indicator */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <motion.circle
                  cx="80"
                  cy="80"
                  r="68"
                  stroke={isPassing ? "#3b82f6" : "#4b5563"}
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: 427, strokeDashoffset: 427 }}
                  animate={showScoreAnimation ? { 
                    strokeDashoffset: 427 - (427 * (score / totalQuestions)) 
                  } : {}}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              
              <div className="text-center z-10">
                <motion.p 
                  className="text-4xl font-bold"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={showScoreAnimation ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  {score}
                </motion.p>
                <motion.p 
                  className="text-sm"
                  initial={{ opacity: 0 }}
                  animate={showScoreAnimation ? { opacity: 1 } : {}}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  de {totalQuestions}
                </motion.p>
              </div>
            </motion.div>
          </div>
          
          {/* Star rating for passing scores */}
          {isPassing && (
            <motion.div 
              className="flex justify-center mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={showCelebration ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.8, duration: 0.5 }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.span 
                  key={i}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={showCelebration ? { 
                    scale: i < stars ? 1 : 0.7, 
                    opacity: 1 
                  } : {}}
                  transition={{ delay: 1.8 + (i * 0.15), duration: 0.3 }}
                >
                  <FiStar 
                    className={`text-2xl ${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                  />
                </motion.span>
              ))}
            </motion.div>
          )}
          
          {/* Quiz details */}
          <motion.div 
            className="space-y-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={showScoreAnimation ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <div className="flex justify-between items-center">
              <span>Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                isPassing ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {isPassing ? 'Aprovado' : 'Reprovado'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Tentativas anteriores:</span>
              <span>{quizResult.newAttempt.failedAttempts}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Data da tentativa:</span>
              <span>{new Date(quizResult.newAttempt.attemptDate).toLocaleDateString()}</span>
            </div>
            
            {isPassing && (
              <motion.div 
                className="mt-4 py-3 px-4 bg-blue-500/10 rounded-lg border border-blue-500/30 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={showCelebration ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 2, duration: 0.5 }}
              >
                <span className="font-medium">Excelente trabalho!</span> 
                <p className="text-sm text-blue-300 mt-1">Você dominou esta especialidade!</p>
              </motion.div>
            )}
          </motion.div>
          
          {/* Action buttons */}
          <motion.div 
            className="flex flex-col gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={showScoreAnimation ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 2, duration: 0.5 }}
          >
            <button
              onClick={() => navigate('/specialty')}
              className={`w-full py-3 px-4 rounded-lg font-medium transition duration-200 flex items-center justify-center ${
                isPassing ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <FiAward className="mr-2" /> Voltar para especialidades
            </button>
            
            {/* <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleRetakeQuiz}
                className="py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition duration-200 flex items-center justify-center"
              >
                <FiRepeat className="mr-2" /> Refazer
              </button>
              
              <button
                onClick={() => navigate('/quizzes')}
                className="py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition duration-200 flex items-center justify-center"
              >
                <FiArrowRight className="mr-2" /> Quizzes
              </button>
            </div> */}
          </motion.div> 
        </motion.div>
      </div>
    );
  }


  // If we're showing the countdown
  if (showCountdown) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <motion.div
          key={countdown}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="text-8xl font-bold"
        >
          {countdown === 0 ? "Vamos lá!" : countdown}
        </motion.div>
      </div>
    );
  }


  // If we haven't started the quiz yet, show the intro screen
  if (currentQuestionIndex === -1) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 w-full max-w-md"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
            Pronto para o Quiz?
          </h1>
         
          <div className="space-y-4 mb-8 text-gray-300">
            <p>Este quiz contém {questions?.count || 10} perguntas.</p>
            <p>Você terá 30 segundos para responder cada pergunta.</p>
            <p>Respostas não selecionadas serão consideradas inválidas.</p>
            <p>Boa sorte!</p>
          </div>
         
          <button
            onClick={handleStartQuiz}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition duration-200 flex items-center justify-center"
          >
            Iniciar Quiz <FiArrowRight className="ml-2" />
          </button>
        </motion.div>
      </div>
    );
  }


  // If we don't have questions yet or they're not loaded
  if (!questions || !questions.questions || questions.questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">
            Nenhuma pergunta disponível
          </h1>
          <button
            onClick={() => navigate('/quizzes')}
            className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition duration-200"
          >
            Voltar para os Quizzes
          </button>
        </div>
      </div>
    );
  }


  const currentQuestion = questions.questions[currentQuestionIndex];


  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white p-4">
      {/* Progress bar */}
      <div className="w-full bg-gray-700 rounded-full h-2.5 mb-6">
        <motion.div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${progressPercentage}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
     
      <div className="flex-1 flex flex-col">
        {/* Timer */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-400">
            Pergunta {currentQuestionIndex + 1} de {questions.questions.length}
          </div>
          <div className={`flex items-center gap-1 ${
            timer <= 10 ? 'text-red-500' : 'text-gray-300'
          }`}>
            <FiClock className={`${timer <= 10 ? 'animate-pulse' : ''}`} />
            <span className="font-mono">{timer}s</span>
          </div>
        </div>


        {/* Question card */}
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-gray-800 rounded-xl shadow-lg p-6 flex-1 flex flex-col"
        >
          <h2 className="text-xl md:text-2xl font-semibold mb-6">
            {currentQuestion.question}
          </h2>
         
          <div className="space-y-3 flex-1">
            {currentQuestion.quizAnswers.map((answer) => (
              <button
                key={answer.id}
                onClick={() => handleSelectAnswer(currentQuestion.id, answer.id)}
                className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                  selectedAnswers[currentQuestion.id] === answer.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
                disabled={showConfirmation}
              >
                {answer.answer}
              </button>
            ))}
          </div>
        </motion.div>
      </div>


      {/* Confirmation dialog */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-gray-800 rounded-xl p-6 max-w-sm w-full"
            >
              <h3 className="text-xl font-semibold mb-4">Confirmar resposta?</h3>
              <p className="text-gray-300 mb-6">
                Tem certeza que deseja confirmar esta resposta? Você não poderá alterá-la depois.
              </p>
             
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                >
                  Voltar
                </button>
                <button
                  onClick={handleConfirmAnswer}
                  className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition flex items-center justify-center"
                >
                  Confirmar <FiCheck className="ml-2" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Submitting overlay */}
      <AnimatePresence>
        {submitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center p-4 z-50"
          >
            <FiLoader className="animate-spin text-4xl mb-4" />
            <p className="text-xl">Enviando respostas...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}






































// import { useParams, useNavigate } from 'react-router-dom';
// import { useCallback, useEffect, useState } from 'react';
// import toast from 'react-hot-toast';
// import { questionsService } from '../../services/questionsService';
// import { quizAttemptService } from '../../services/quizAttemptService';
// import { useAuth } from '../../context/AuthContext';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FiCheck, FiClock, FiLoader, FiArrowRight, FiAward, FiEdit, FiRepeat } from 'react-icons/fi';
// //import CircularProgress from '../../components/CircularProgress';
// import confetti from 'canvas-confetti';


// interface IQuestions {
//   count: number;
//   questions: {
//     id: string;
//     quizId: string;
//     question: string;
//     createdAt: string;
//     updatedAt: string;
//     quizAnswers: {
//       id: string;
//       questionId: string
//       answer: string;
//       isCorrect: boolean;
//       createdAt: string;
//       updatedAt: string;
//     }[]
//   }[]
// }


// interface ISelectedAnswers {
//   [key: string]: string;
// }


// interface IQuizResult {
//   newAttempt: {
//     id: string;
//     userId: string;
//     quizId: string;
//     score: number;
//     status: string;
//     failedQuizzes: number;
//     attemptDate: string;
//     failedAttempts: number;
//     lastAttempt: string;
//   }
// }


// export default function QuizScreen() {
//   const { quizId } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const LoggerUser = user?.user.user;


//   const [isLoading, setIsLoading] = useState(false);
//   const [questions, setQuestions] = useState<IQuestions | null>(null);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1); // -1 means intro screen
//   const [selectedAnswers, setSelectedAnswers] = useState<ISelectedAnswers>({});
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [quizResult, setQuizResult] = useState<IQuizResult | null>(null);
//   const [timer, setTimer] = useState(30);
//   const [timerActive, setTimerActive] = useState(false);
//   const [countdown, setCountdown] = useState(3);
//   const [showCountdown, setShowCountdown] = useState(false);


//   useEffect(() => {
//     fetchQuestionsQuiz();
//   }, [quizId]);


//   // Countdown timer logic
//   useEffect(() => {
//     if (showCountdown && countdown > 0) {
//       const countdownInterval = setInterval(() => {
//         setCountdown((prev) => prev - 1);
//       }, 1000);
      
//       return () => clearInterval(countdownInterval);
//     } else if (showCountdown && countdown === 0) {
//       setShowCountdown(false);
//       setCurrentQuestionIndex(0);
//       setTimerActive(true);
//     }
//   }, [showCountdown, countdown]);


//   // Question timer logic
//   useEffect(() => {
//     if (timerActive && timer > 0) {
//       const interval = setInterval(() => {
//         setTimer((prev) => prev - 1);
//       }, 1000);
      
//       return () => clearInterval(interval);
//     } else if (timerActive && timer === 0) {
//       // Time's up for this question, move to next
//       handleTimeUp();
//     }
//   }, [timerActive, timer]);


//   // Reset timer when moving to a new question
//   useEffect(() => {
//     if (currentQuestionIndex >= 0) {
//       setTimer(30);
//       setTimerActive(true);
//     }
//   }, [currentQuestionIndex]);


//   const fetchQuestionsQuiz = async () => {
//     setIsLoading(true);
//     try {
//       if (!quizId) {
//         throw new Error('Quiz ID is required.');
//       }
//       const data = await questionsService.getRandomQuestions(quizId);
//       setQuestions(data.questions);
//     } catch (err) {
//       toast.error("Erro ao carregar Questions", { position: 'bottom-right' });
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   const handleStartQuiz = () => {
//     setShowCountdown(true);
//     setCountdown(3);
//   };


//   const handleSelectAnswer = (questionId: string, answerId: string) => {
//     setSelectedAnswers((prev) => ({
//       ...prev,
//       [questionId]: answerId
//     }));
//     setShowConfirmation(true);
//   };


//   const handleConfirmAnswer = () => {
//     setShowConfirmation(false);
//     setTimerActive(false);
    
//     // Move to next question
//     if (questions && currentQuestionIndex < questions.questions.length - 1) {
//       setCurrentQuestionIndex((prev) => prev + 1);
//     } else {
//       // This was the last question, submit quiz
//       submitQuizAnswers();
//     }
//   };


//   const handleTimeUp = () => {
//     setTimerActive(false);
//     // Skip this question (no answer selected)
//     if (questions && currentQuestionIndex < questions.questions.length - 1) {
//       setCurrentQuestionIndex((prev) => prev + 1);
//     } else {
//       // This was the last question, submit quiz
//       submitQuizAnswers();
//     }
//   };


//   const submitQuizAnswers = useCallback(async () => {
//     if (submitting || !questions || !quizId || !LoggerUser) return;

//     try {
//         setSubmitting(true);

//         // Format the answers as expected by the service
//         const formattedAnswers = Object.entries(selectedAnswers).map(([questionId, answerId]) => ({
//             questionId,
//             answerId,
//         }));

//         const requestBody = {
//             userId: LoggerUser.id,
//             quizId: quizId,
//             answers: formattedAnswers
//         };

//         const result = await quizAttemptService.submitQuiz(requestBody);
//         setQuizResult(result);

//         // Trigger confetti if score is good
//         if (result.newAttempt.score >= 6) {
//             confetti({
//                 particleCount: 100,
//                 spread: 70,
//                 origin: { y: 0.6 }
//             });
//         }

//     } catch (err) {
//         setError('Erro ao enviar o quiz. Tente novamente.');
//     } finally {
//         setSubmitting(false);
//     }
// }, [questions, selectedAnswers, LoggerUser, quizId, submitting]);


//   // Calculate progress percentage
//   const progressPercentage = questions && currentQuestionIndex >= 0 
//     ? ((currentQuestionIndex + 1) / questions.questions.length) * 100
//     : 0;


//   if (isLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
//         <p className="text-xl">Carregando o quiz...</p>
//       </div>
//     );
//   }


//   // If we have quiz results, show the results screen
//   if (quizResult) {
//     const { score, status } = quizResult.newAttempt;
//     const isPassing = status === 'approved';
    
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 w-full max-w-md"
//         >
//           <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
//             {isPassing ? "Parabéns! 🎉" : "Quiz Concluído"}
//           </h1>
          
//           <div className="flex justify-center mb-8">
//             <div className="w-36 h-36 rounded-full flex items-center justify-center border-4 border-blue-500 bg-gray-700">
//               <div className="text-center">
//                 <p className="text-4xl font-bold">{score}</p>
//                 <p className="text-sm">de {questions?.questions.length || 10}</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="space-y-4 mb-8">
//             <div className="flex justify-between items-center">
//               <span>Status:</span>
//               <span className={`px-3 py-1 rounded-full text-sm ${
//                 isPassing ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
//               }`}>
//                 {isPassing ? 'Aprovado' : 'Reprovado'}
//               </span>
//             </div>
            
//             <div className="flex justify-between items-center">
//               <span>Tentativas anteriores:</span>
//               <span>{quizResult.newAttempt.failedAttempts}</span>
//             </div>
            
//             <div className="flex justify-between items-center">
//               <span>Data da tentativa:</span>
//               <span>{new Date(quizResult.newAttempt.attemptDate).toLocaleDateString()}</span>
//             </div>
//           </div>
          
//           <div className="flex flex-col gap-3">
//             <button
//               onClick={() => navigate(`/quizzes/${quizId}`)}
//               className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition duration-200"
//             >
//               Ver detalhes do Quiz
//             </button>
            
//             <button
//               onClick={() => navigate('/quizzes')}
//               className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition duration-200"
//             >
//               Voltar para os Quizzes
//             </button>
//           </div>
//         </motion.div>
//       </div>
//     );
//   }


//   // If we're showing the countdown
//   if (showCountdown) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
//         <motion.div
//           key={countdown}
//           initial={{ scale: 0.5, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           exit={{ scale: 1.5, opacity: 0 }}
//           transition={{ duration: 0.5 }}
//           className="text-8xl font-bold"
//         >
//           {countdown === 0 ? "Vamos lá!" : countdown}
//         </motion.div>
//       </div>
//     );
//   }


//   // If we haven't started the quiz yet, show the intro screen
//   if (currentQuestionIndex === -1) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 w-full max-w-md"
//         >
//           <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
//             Pronto para o Quiz?
//           </h1>
          
//           <div className="space-y-4 mb-8 text-gray-300">
//             <p>Este quiz contém {questions?.count || 10} perguntas.</p>
//             <p>Você terá 30 segundos para responder cada pergunta.</p>
//             <p>Respostas não selecionadas serão consideradas inválidas.</p>
//             <p>Boa sorte!</p>
//           </div>
          
//           <button
//             onClick={handleStartQuiz}
//             className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition duration-200 flex items-center justify-center"
//           >
//             Iniciar Quiz <FiArrowRight className="ml-2" />
//           </button>
//         </motion.div>
//       </div>
//     );
//   }


//   // If we don't have questions yet or they're not loaded
//   if (!questions || !questions.questions || questions.questions.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
//         <div className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 w-full max-w-md">
//           <h1 className="text-2xl font-bold text-center mb-6">
//             Nenhuma pergunta disponível
//           </h1>
//           <button
//             onClick={() => navigate('/quizzes')}
//             className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition duration-200"
//           >
//             Voltar para os Quizzes
//           </button>
//         </div>
//       </div>
//     );
//   }


//   const currentQuestion = questions.questions[currentQuestionIndex];

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-900 text-white p-4">
//       {/* Progress bar */}
//       <div className="w-full bg-gray-700 rounded-full h-2.5 mb-6">
//         <motion.div 
//           className="bg-blue-600 h-2.5 rounded-full" 
//           style={{ width: `${progressPercentage}%` }}
//           initial={{ width: 0 }}
//           animate={{ width: `${progressPercentage}%` }}
//           transition={{ duration: 0.3 }}
//         />
//       </div>
      
//       <div className="flex-1 flex flex-col">
//         {/* Timer */}
//         <div className="flex justify-between items-center mb-4">
//           <div className="text-sm text-gray-400">
//             Pergunta {currentQuestionIndex + 1} de {questions.questions.length}
//           </div>
//           <div className={`flex items-center gap-1 ${
//             timer <= 10 ? 'text-red-500' : 'text-gray-300'
//           }`}>
//             <FiClock className={`${timer <= 10 ? 'animate-pulse' : ''}`} />
//             <span className="font-mono">{timer}s</span>
//           </div>
//         </div>


//         {/* Question card */}
//         <motion.div 
//           key={currentQuestion.id}
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           exit={{ opacity: 0, x: -20 }}
//           className="bg-gray-800 rounded-xl shadow-lg p-6 flex-1 flex flex-col"
//         >
//           <h2 className="text-xl md:text-2xl font-semibold mb-6">
//             {currentQuestion.question}
//           </h2>
          
//           <div className="space-y-3 flex-1">
//             {currentQuestion.quizAnswers.map((answer) => (
//               <button
//                 key={answer.id}
//                 onClick={() => handleSelectAnswer(currentQuestion.id, answer.id)}
//                 className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
//                   selectedAnswers[currentQuestion.id] === answer.id
//                     ? 'bg-blue-600 text-white'
//                     : 'bg-gray-700 hover:bg-gray-600'
//                 }`}
//                 disabled={showConfirmation}
//               >
//                 {answer.answer}
//               </button>
//             ))}
//           </div>
//         </motion.div>
//       </div>


//       {/* Confirmation dialog */}
//       <AnimatePresence>
//         {showConfirmation && (
//           <motion.div 
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
//           >
//             <motion.div 
//               initial={{ scale: 0.9 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.9 }}
//               className="bg-gray-800 rounded-xl p-6 max-w-sm w-full"
//             >
//               <h3 className="text-xl font-semibold mb-4">Confirmar resposta?</h3>
//               <p className="text-gray-300 mb-6">
//                 Tem certeza que deseja confirmar esta resposta? Você não poderá alterá-la depois.
//               </p>
              
//               <div className="flex gap-3">
//                 <button
//                   onClick={() => setShowConfirmation(false)}
//                   className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
//                 >
//                   Voltar
//                 </button>
//                 <button
//                   onClick={handleConfirmAnswer}
//                   className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition flex items-center justify-center"
//                 >
//                   Confirmar <FiCheck className="ml-2" />
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>


//       {/* Submitting overlay */}
//       <AnimatePresence>
//         {submitting && (
//           <motion.div 
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center p-4 z-50"
//           >
//             <FiLoader className="animate-spin text-4xl mb-4" />
//             <p className="text-xl">Enviando respostas...</p>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }




























// import { useParams, useNavigate } from 'react-router-dom';
// import { useCallback, useEffect, useState } from 'react';
// import toast from 'react-hot-toast';
// import { questionsService } from '../../services/questionsService';
// import { quizAttemptService } from '../../services/quizAttemptService';
// import { useAuth } from '../../context/AuthContext';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FiClock, FiCheckCircle, FiXCircle, FiArrowRight } from 'react-icons/fi';
// import Confetti from 'react-confetti';


// // Interface for the questions data structure
// interface IQuestions {
//   count: number;
//   questions: {
//     id: string;
//     quizId: string;
//     question: string;
//     createdAt: string;
//     updatedAt: string;
//     quizAnswers: {
//       id: string;
//       questionId: string
//       answer: string;
//       isCorrect: boolean;
//       createdAt: string;
//       updatedAt: string;
//     }[]
//   }[]
// }


// // Interface for quiz results
// interface IQuizResult {
//   success: boolean;
//   message: string;
//   result: {
//     newAttempt: {
//       id: string;
//       userId: string;
//       quizId: string;
//       score: number;
//       status: string;
//       failedQuizzes: number;
//       attemptDate: string;
//       failedAttempts: number;
//       lastAttempt: string;
//       createdAt: string;
//       updatedAt: string;
//     }
//   }
// }


// export default function QuizScreen() {
//   const { quizId } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const LoggerUser = user?.user.user;


//   // States
//   const [isLoading, setIsLoading] = useState(false);
//   const [questions, setQuestions] = useState<IQuestions | null>(null);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
//   const [remainingTime, setRemainingTime] = useState(30);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [quizFinished, setQuizFinished] = useState(false);
//   const [quizResult, setQuizResult] = useState<IQuizResult | null>(null);
//   const [showConfetti, setShowConfetti] = useState(false);


//   // Load questions on component mount
//   useEffect(() => {
//     fetchQuestionsQuiz();
//   }, [quizId]);


//   // Timer logic
//   useEffect(() => {
//     if (!questions || quizFinished) return;
    
//     // Reset timer when changing questions
//     setRemainingTime(30);
    
//     const timer = setInterval(() => {
//       setRemainingTime((prevTime) => {
//         if (prevTime <= 1) {
//           // Time's up for this question, move to next
//           clearInterval(timer);
//           handleNextQuestion();
//           return 30;
//         }
//         return prevTime - 1;
//       });
//     }, 1000);


//     return () => clearInterval(timer);
//   }, [currentQuestionIndex, questions, quizFinished]);


//   // Fetch questions from API
//   const fetchQuestionsQuiz = async () => {
//     setIsLoading(true);
//     try {
//       if (!quizId) {
//         throw new Error('Quiz ID is required.');
//       }
//       const data = await questionsService.getRandomQuestions(quizId);
//       setQuestions(data);
//     } catch (err) {
//       toast.error("Erro ao carregar Questions", { position: 'bottom-right' });
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   // Handle answer selection
//   const handleAnswerSelect = (questionId: string, answerId: string) => {
//     setSelectedAnswers(prev => ({
//       ...prev,
//       [questionId]: answerId
//     }));
//   };


//   // Move to next question
//   const handleNextQuestion = () => {
//     if (!questions) return;
    
//     if (currentQuestionIndex < questions.questions.length - 1) {
//       setCurrentQuestionIndex(prev => prev + 1);
//     } else {
//       // Last question reached, submit quiz
//       submitQuizAnswers();
//     }
//   };


//   // Submit quiz answers
//   const submitQuizAnswers = useCallback(async () => {
//     if (submitting || !questions) return;
      
//     try {
//       setSubmitting(true);
        
//       // Format answers for the service
//       const formattedAnswers = Object.entries(selectedAnswers).map(([questionId, answerId]) => ({
//         questionId,
//         answerId,
//       }));
  
//       // Submit quiz
//       const result = await quizAttemptService.submitQuiz(LoggerUser?.id as string, quizId as string, formattedAnswers);
//       setQuizResult(result);
//       setQuizFinished(true);
      
//       // Show confetti if score is good
//       if (result.result.newAttempt.score >= (questions.count / 2)) {
//         setShowConfetti(true);
//       }
      
//     } catch (err) {
//       setError('Erro ao enviar o quiz. Tente novamente.');
//       toast.error("Erro ao enviar quiz", { position: 'bottom-right' });
//     } finally {
//       setSubmitting(false);
//     }
//   }, [questions, selectedAnswers, LoggerUser, quizId, submitting]);


//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-900">
//         <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
//       </div>
//     );
//   }


//   // Error state
//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
//         <div className="bg-red-600 p-6 rounded-lg shadow-lg max-w-md w-full">
//           <h2 className="text-xl font-bold mb-4">Erro</h2>
//           <p>{error}</p>
//           <button 
//             onClick={() => navigate('/quizzes')} 
//             className="mt-4 px-4 py-2 bg-white text-red-600 font-bold rounded-md hover:bg-gray-200 transition-colors"
//           >
//             Voltar aos Quizzes
//           </button>
//         </div>
//       </div>
//     );
//   }


//   // Results screen
//   if (quizFinished && quizResult) {
//     return (
//       <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
//         {showConfetti && <Confetti recycle={false} numberOfPieces={400} />}
        
//         <motion.div 
//           initial={{ scale: 0.8, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full p-6 relative overflow-hidden"
//         >
//           <div className={`absolute top-0 left-0 h-2 w-full ${quizResult.result.newAttempt.status === 'approved' ? 'bg-green-500' : 'bg-red-500'}`}></div>
          
//           <h1 className="text-2xl font-bold mb-6 text-center">Resultado do Quiz</h1>
          
//           <div className="flex justify-center mb-8">
//             <div className="relative">
//               <svg className="w-32 h-32" viewBox="0 0 36 36">
//                 <path
//                   d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
//                   fill="none"
//                   stroke="#444"
//                   strokeWidth="1"
//                 />
//                 <path
//                   d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
//                   fill="none"
//                   stroke={quizResult.result.newAttempt.status === 'approved' ? "#10B981" : "#EF4444"}
//                   strokeWidth="2"
//                   strokeDasharray={`${(quizResult.result.newAttempt.score / questions!.count) * 100}, 100`}
//                 />
//                 <text x="18" y="20.5" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">
//                   {quizResult.result.newAttempt.score}/{questions!.count}
//                 </text>
//               </svg>
//             </div>
//           </div>


//           <div className="space-y-4">
//             <div className="flex items-center justify-between bg-gray-700 p-3 rounded-md">
//               <span>Status</span>
//               <span className={`font-semibold ${quizResult.result.newAttempt.status === 'approved' ? 'text-green-400' : 'text-red-400'}`}>
//                 {quizResult.result.newAttempt.status === 'approved' ? 'Aprovado' : 'Reprovado'}
//               </span>
//             </div>
            
//             <div className="flex items-center justify-between bg-gray-700 p-3 rounded-md">
//               <span>Pontuação</span>
//               <span className="font-semibold">{quizResult.result.newAttempt.score} de {questions!.count}</span>
//             </div>


//             <div className="flex items-center justify-between bg-gray-700 p-3 rounded-md">
//               <span>Tentativas anteriores</span>
//               <span className="font-semibold">{quizResult.result.newAttempt.failedAttempts}</span>
//             </div>
            
//             <div className="flex items-center justify-between bg-gray-700 p-3 rounded-md">
//               <span>Data da tentativa</span>
//               <span className="font-semibold">
//                 {new Date(quizResult.result.newAttempt.attemptDate).toLocaleDateString()}
//               </span>
//             </div>
//           </div>
          
//           <div className="mt-8 flex justify-center">
//             <button 
//               onClick={() => navigate('/quizzes')}
//               className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-md font-semibold transition-colors"
//             >
//               Voltar para Quizzes
//             </button>
//           </div>
//         </motion.div>
//       </div>
//     );
//   }


//   // Quiz questions screen
//   if (!questions || !questions.questions.length) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
//         <p>Nenhuma pergunta disponível.</p>
//       </div>
//     );
//   }


//   const currentQuestion = questions.questions[currentQuestionIndex];
//   const isLastQuestion = currentQuestionIndex === questions.questions.length - 1;
//   const isAnswerSelected = selectedAnswers[currentQuestion.id] !== undefined;


//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col">
//       {/* Progress bar */}
//       <div className="container mx-auto mb-6 max-w-3xl">
//         <div className="w-full bg-gray-700 rounded-full h-2.5">
//           <div 
//             className="bg-purple-600 h-2.5 rounded-full transition-all duration-300" 
//             style={{ width: `${((currentQuestionIndex + 1) / questions.questions.length) * 100}%` }}
//           ></div>
//         </div>
//         <div className="flex justify-between mt-2 text-sm text-gray-400">
//           <span>Questão {currentQuestionIndex + 1} de {questions.questions.length}</span>
//           <div className="flex items-center">
//             <FiClock className="mr-1" />
//             <span className={remainingTime <= 10 ? 'text-red-500 font-bold' : ''}>
//               {remainingTime}s
//             </span>
//           </div>
//         </div>
//       </div>


//       {/* Question card */}
//       <div className="flex-grow flex items-center justify-center">
//         <motion.div 
//           key={currentQuestion.id}
//           initial={{ x: 50, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           exit={{ x: -50, opacity: 0 }}
//           transition={{ duration: 0.3 }}
//           className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-3xl"
//         >
//           <h2 className="text-xl md:text-2xl font-bold mb-6">{currentQuestion.question}</h2>
          
//           <div className="space-y-3">
//             <AnimatePresence>
//               {currentQuestion.quizAnswers.map((answer) => (
//                 <motion.button
//                   key={answer.id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.3 }}
//                   className={`w-full text-left p-4 rounded-lg transition-all duration-200 flex items-center 
//                     ${selectedAnswers[currentQuestion.id] === answer.id 
//                       ? 'bg-purple-700 border-purple-500' 
//                       : 'bg-gray-700 hover:bg-gray-600 border-gray-600'} 
//                     border-2`}
//                   onClick={() => handleAnswerSelect(currentQuestion.id, answer.id)}
//                   disabled={submitting}
//                 >
//                   <span className="flex-grow">{answer.answer}</span>
//                   {selectedAnswers[currentQuestion.id] === answer.id && (
//                     <FiCheckCircle className="text-white text-xl" />
//                   )}
//                 </motion.button>
//               ))}
//             </AnimatePresence>
//           </div>
          
//           <div className="mt-8 flex justify-end">
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className={`px-6 py-3 rounded-md font-semibold flex items-center
//                 ${isAnswerSelected 
//                   ? 'bg-purple-600 hover:bg-purple-700 text-white' 
//                   : 'bg-gray-600 text-gray-300 cursor-not-allowed'}`}
//               onClick={handleNextQuestion}
//               disabled={!isAnswerSelected || submitting}
//             >
//               {isLastQuestion ? 'Finalizar' : 'Próxima'}
//               <FiArrowRight className="ml-2" />
//             </motion.button>
//           </div>
//         </motion.div>
//       </div>


//       {/* Timer indicator */}
//       <div className="fixed bottom-4 right-4">
//         <div className="w-12 h-12 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center">
//           <div 
//             className="rounded-full bg-purple-600" 
//             style={{ 
//               width: '100%', 
//               height: '100%', 
//               clipPath: `circle(${(remainingTime / 30) * 100}% at center)`,
//               transition: 'clip-path 1s linear'
//             }}
//           ></div>
//           <div className="absolute text-white font-bold">{remainingTime}</div>
//         </div>
//       </div>
//     </div>
//   );
// }
























// import { useParams, useNavigate } from 'react-router-dom';
// import { useCallback, useEffect, useState } from 'react';
// import toast from 'react-hot-toast';
// import { questionsService } from '../../services/questionsService';
// import { useAuth } from '../../context/AuthContext';
// import { motion, AnimatePresence } from 'framer-motion';
// import { quizAttemptService } from '../../services/quizAttemptService';


// // Icons
// import { CheckCircle, XCircle, Clock, ArrowRight, AlertTriangle } from 'lucide-react';


// // Interface for Questions
// interface IQuestions {
//   count: number;
//   questions: {
//     id: string;
//     quizId: string;
//     question: string;
//     createdAt: string;
//     updatedAt: string;
//     quizAnswers: {
//       id: string;
//       questionId: string
//       answer: string;
//       isCorrect: boolean;
//       createdAt: string;
//       updatedAt: string;
//     }[]
//   }[]
// }


// interface QuizResult {
//   success: boolean;
//   message: string;
//   result: {
//     newAttempt: {
//       id: string;
//       userId: string;
//       quizId: string;
//       score: number;
//       status: string;
//       failedQuizzes: number;
//       attemptDate: string;
//       failedAttempts: number;
//       lastAttempt: string;
//       createdAt: string;
//       updatedAt: string;
//     }
//   }
// }


// export default function QuizScreen() {
//   const { quizId } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const LoggerUser = user?.user.user;


//   // States
//   const [isLoading, setIsLoading] = useState(true);
//   const [questions, setQuestions] = useState<IQuestions | null>(null);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [timeRemaining, setTimeRemaining] = useState(30);
//   const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
//   const [quizCompleted, setQuizCompleted] = useState(false);


//   // Fetch questions on component mount
//   useEffect(() => {
//     fetchQuestionsQuiz();
//   }, [quizId]);


//   // Timer effect
//   useEffect(() => {
//     if (isLoading || quizCompleted) return;
    
//     if (timeRemaining <= 0) {
//       // Time's up for this question, move to next
//       handleNextQuestion();
//       return;
//     }
    
//     const timer = setTimeout(() => {
//       setTimeRemaining(prev => prev - 1);
//     }, 1000);
    
//     return () => clearTimeout(timer);
//   }, [timeRemaining, isLoading, quizCompleted]);


//   // Reset timer when moving to a new question
//   useEffect(() => {
//     setTimeRemaining(30);
//   }, [currentQuestionIndex]);


//   const fetchQuestionsQuiz = async () => {
//     setIsLoading(true);
//     try {
//       if (!quizId) {
//         throw new Error('Quiz ID is required.');
//       }
//       const data = await questionsService.getRandomQuestions(quizId);
//       setQuestions(data);
//       setIsLoading(false);
//     } catch (err) {
//       toast.error("Error loading questions", { position: 'bottom-right' });
//       setIsLoading(false);
//     }
//   };


//   const handleSelectAnswer = (questionId: string, answerId: string) => {
//     setSelectedAnswers(prev => ({
//       ...prev,
//       [questionId]: answerId
//     }));
    
//     // Small delay before moving to next question
//     setTimeout(handleNextQuestion, 500);
//   };


//   const handleNextQuestion = () => {
//     if (!questions) return;
    
//     if (currentQuestionIndex < questions.questions.length - 1) {
//       setCurrentQuestionIndex(prev => prev + 1);
//     } else {
//       // All questions answered, submit the quiz
//       submitQuizAnswers();
//     }
//   };


//   const submitQuizAnswers = useCallback(async () => {
//     if (submitting || !questions) return;
    
//     try {
//       setSubmitting(true);
      
//       // Format answers for the expected service format
//       const formattedAnswers = Object.entries(selectedAnswers).map(([questionId, answerId]) => ({
//         questionId,
//         answerId,
//       }));
      
//       const result = await quizAttemptService.submitQuiz(LoggerUser?.id as string, quizId as string, formattedAnswers);
//       setQuizResult(result);
//       setQuizCompleted(true);
//       toast.success("Quiz submitted successfully!");
//     } catch (err) {
//       setError('Error submitting the quiz. Please try again.');
//       toast.error("Error submitting quiz", { position: 'bottom-right' });
//     } finally {
//       setSubmitting(false);
//     }
//   }, [questions, selectedAnswers, LoggerUser, quizId, submitting]);


//   // Calculate progress percentage
//   const progressPercentage = questions ? 
//     ((currentQuestionIndex + 1) / questions.questions.length) * 100 : 0;


//   // Format time remaining
//   const formatTime = (seconds: number) => {
//     return `${String(seconds).padStart(2, "0")}`;
//   };


//   // Show loading state
//   if (isLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
//         <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//         <p className="mt-4 text-xl font-medium">Loading Quiz...</p>
//       </div>
//     );
//   }


//   // Show error state
//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
//         <AlertTriangle size={64} className="text-red-500 mb-4" />
//         <h2 className="text-2xl font-bold mb-2">Error</h2>
//         <p className="text-gray-300 mb-4">{error}</p>
//         <button 
//           onClick={() => navigate(-1)}
//           className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
//         >
//           Go Back
//         </button>
//       </div>
//     );
//   }


//   // Show quiz result screen
//   if (quizCompleted && quizResult) {
//     const { score, status } = quizResult.result.newAttempt;
//     const totalQuestions = questions?.questions.length || 0;
//     const scorePercentage = (score / totalQuestions) * 100;
    
//     return (
//       <motion.div 
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4"
//       >
//         <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-xl p-6 md:p-8">
//           <div className="text-center mb-8">
//             <motion.div 
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ type: "spring", stiffness: 260, damping: 20 }}
//               className="inline-block mb-4"
//             >
//               {status === 'approved' ? (
//                 <CheckCircle size={80} className="text-green-500 mx-auto" />
//               ) : (
//                 <XCircle size={80} className="text-red-500 mx-auto" />
//               )}
//             </motion.div>
            
//             <h1 className="text-3xl font-bold mb-2">
//               Quiz {status === 'approved' ? 'Passed!' : 'Failed'}
//             </h1>
//             <p className="text-gray-400">
//               {quizResult.message}
//             </p>
//           </div>
          
//           <div className="space-y-6">
//             <div>
//               <p className="text-lg font-medium mb-2">Your Score</p>
//               <div className="w-full bg-gray-700 rounded-full h-4">
//                 <motion.div 
//                   initial={{ width: 0 }}
//                   animate={{ width: `${scorePercentage}%` }}
//                   transition={{ duration: 1 }}
//                   className={`h-4 rounded-full ${
//                     scorePercentage >= 70 ? 'bg-green-500' : 
//                     scorePercentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'
//                   }`}
//                 ></motion.div>
//               </div>
//               <div className="flex justify-between mt-1 text-sm">
//                 <span>{score} correct</span>
//                 <span>{totalQuestions} questions</span>
//               </div>
//             </div>
            
//             <div className="grid grid-cols-2 gap-4 text-center">
//               <div className="bg-gray-700 p-4 rounded-lg">
//                 <p className="text-sm text-gray-400">Status</p>
//                 <p className={`text-lg font-medium ${
//                   status === 'approved' ? 'text-green-500' : 'text-red-500'
//                 }`}>
//                   {status.charAt(0).toUpperCase() + status.slice(1)}
//                 </p>
//               </div>
              
//               <div className="bg-gray-700 p-4 rounded-lg">
//                 <p className="text-sm text-gray-400">Failed Attempts</p>
//                 <p className="text-lg font-medium">
//                   {quizResult.result.newAttempt.failedAttempts}
//                 </p>
//               </div>
//             </div>
            
//             <button
//               onClick={() => navigate('/dashboard')}
//               className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
//             >
//               Return to Dashboard
//             </button>
//           </div>
//         </div>
//       </motion.div>
//     );
//   }


//   // Show quiz questions
//   if (!questions || questions.questions.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
//         <AlertTriangle size={64} className="text-yellow-500 mb-4" />
//         <h2 className="text-2xl font-bold mb-2">No Questions Found</h2>
//         <p className="text-gray-300 mb-4">This quiz doesn't have any questions.</p>
//         <button 
//           onClick={() => navigate(-1)}
//           className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
//         >
//           Go Back
//         </button>
//       </div>
//     );
//   }


//   const currentQuestion = questions.questions[currentQuestionIndex];


//   return (
//     <div className="flex flex-col min-h-screen bg-gray-900 text-white">
//       {/* Header with progress */}
//       <header className="bg-gray-800 p-4 shadow-md">
//         <div className="container mx-auto">
//           <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
//             <motion.div 
//               initial={{ width: 0 }}
//               animate={{ width: `${progressPercentage}%` }}
//               className="h-full bg-blue-500"
//             ></motion.div>
//           </div>
//           <div className="flex justify-between mt-2 text-sm text-gray-400">
//             <span>Question {currentQuestionIndex + 1} of {questions.questions.length}</span>
//             <div className="flex items-center">
//               <Clock size={16} className="mr-1" />
//               <span className={`font-mono ${timeRemaining <= 5 ? 'text-red-500 animate-pulse' : ''}`}>
//                 {formatTime(timeRemaining)}s
//               </span>
//             </div>
//           </div>
//         </div>
//       </header>


//       {/* Main quiz content */}
//       <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
//         <div className="w-full max-w-2xl">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={currentQuestion.id}
//               initial={{ opacity: 0, x: 50 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -50 }}
//               transition={{ duration: 0.3 }}
//               className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-8"
//             >
//               {/* Question */}
//               <h2 className="text-xl md:text-2xl font-bold mb-6">{currentQuestion.question}</h2>
              
//               {/* Timer indicator */}
//               <div className="w-full bg-gray-700 h-2 rounded-full mb-6">
//                 <motion.div 
//                   initial={{ width: '100%' }}
//                   animate={{ width: `${(timeRemaining / 30) * 100}%` }}
//                   className={`h-full rounded-full ${
//                     timeRemaining > 15 ? 'bg-green-500' : 
//                     timeRemaining > 5 ? 'bg-yellow-500' : 'bg-red-500'
//                   }`}
//                 ></motion.div>
//               </div>
              
//               {/* Answer options */}
//               <div className="space-y-3">
//                 {currentQuestion.quizAnswers.map((answer) => {
//                   const isSelected = selectedAnswers[currentQuestion.id] === answer.id;
                  
//                   return (
//                     <motion.button
//                       key={answer.id}
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                       onClick={() => handleSelectAnswer(currentQuestion.id, answer.id)}
//                       className={`w-full text-left p-4 rounded-lg transition-all ${
//                         isSelected 
//                           ? 'bg-blue-600 border-2 border-blue-400'
//                           : 'bg-gray-700 hover:bg-gray-600 border-2 border-transparent'
//                       }`}
//                     >
//                       <div className="flex items-center">
//                         <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
//                           isSelected ? 'bg-blue-400' : 'bg-gray-600'
//                         }`}>
//                           {isSelected && <CheckCircle size={16} />}
//                         </div>
//                         <span>{answer.answer}</span>
//                       </div>
//                     </motion.button>
//                   );
//                 })}
//               </div>
              
//               {/* Skip/Next button */}
//               <div className="mt-6 flex justify-end">
//                 <button
//                   onClick={handleNextQuestion}
//                   className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
//                 >
//                   {currentQuestionIndex < questions.questions.length - 1 ? 'Skip' : 'Finish'}
//                   <ArrowRight size={16} className="ml-2" />
//                 </button>
//               </div>
//             </motion.div>
//           </AnimatePresence>
//         </div>
//       </main>
//     </div>
//   );
// }










































// import { useParams, useNavigate } from 'react-router-dom';
// import { useCallback, useEffect, useState } from 'react';
// import toast from 'react-hot-toast';
// import { questionsService } from '../../services/questionsService';
// import { useAuth } from '../../context/AuthContext';


// interface IQuestions {
//   count: number;
//   questions: {
//     id: string;
//     quizId: string;
//     question: string;
//     createdAt: string;
//     updatedAt: string;
//     quizAnswers: {
//       id: string;
//       questionId: string
//       answer: string;
//       isCorrect: boolean;
//       createdAt: string;
//       updatedAt: string;
//     }
//   }
// }
// export default function QuizScreen() {
//   const { quizId } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const LoggerUser = user?.user.user;

//   const [isLoading, setIsLoading] = useState(false);
//   const [questions, setQuestions] = useState<IQuestions | null>(null);
  
//   useEffect(() => {
//     fetchQuestionsQuiz()
//   }, [quizId]);

//   const fetchQuestionsQuiz = async () => {
//     setIsLoading(true);
//     try {
//       if (!quizId) {
//         throw new Error('Quiz ID is required.');
//       }
//       const data = await questionsService.getRandomQuestions(quizId);
//       setQuestions(data.questions);
//     } catch (err) {
//       toast.error("Erro ao carregar Questions", { position: 'bottom-right' });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const submitQuizAnswers = useCallback(async () => {
//     if (submitting) return;
        
//     try {
//       setSubmitting(true);
          
//       // Formata as respostas para o formato esperado pelo serviço
//       const formattedAnswers = Object.entries(selectedAnswers).map(([questionId, answerId]) => ({
//         questionId,
//         answerId,
//       }));
    
//       const result = await quizAttemptService.submitQuiz(LoggerUser, quizId, formattedAnswers);
          
         
//       } catch (err) {
//         setError('Erro ao enviar o quiz. Tente novamente.');
//         setSubmitting(false);
//       }
//   }, [questions, selectedAnswers, LoggerUser, quizId, submitting]);
    

//   console.log(questions)
// //   "{
// //     "count": 10,
// //     "questions": [
// //         {
// //             "id": "325a00f3-f5ff-467d-8506-08d44964fd6d",
// //             "quizId": "97b8aaba-6699-44fb-8e0d-eddd5300717a",
// //             "question": "1 + 1",
// //             "createdAt": "2025-05-06T21:20:02.417Z",
// //             "updatedAt": "2025-05-06T21:20:02.417Z",
// //             "quizAnswers": [
// //                 {
// //                     "id": "4f64459a-2a43-4b86-98b0-0d5046b01dad",
// //                     "questionId": "325a00f3-f5ff-467d-8506-08d44964fd6d",
// //                     "answer": "2",
// //                     "isCorrect": true,
// //                     "createdAt": "2025-05-06T21:20:04.123Z",
// //                     "updatedAt": "2025-05-06T21:20:04.123Z"
// //                 },
// //                 {
// //                     "id": "9b458abe-f0a9-4297-ac49-cdf12180536d",
// //                     "questionId": "325a00f3-f5ff-467d-8506-08d44964fd6d",
// //                     "answer": "7",
// //                     "isCorrect": false,
// //                     "createdAt": "2025-05-06T21:20:05.287Z",
// //                     "updatedAt": "2025-05-06T21:20:05.287Z"
// //                 },
// //                 {
// //                     "id": "8eef1f2a-53a4-466b-8beb-ecd86dac90f0",
// //                     "questionId": "325a00f3-f5ff-467d-8506-08d44964fd6d",
// //                     "answer": "5",
// //                     "isCorrect": false,
// //                     "createdAt": "2025-05-06T21:20:04.893Z",
// //                     "updatedAt": "2025-05-06T21:20:04.893Z"
// //                 },
// //                 {
// //                     "id": "7c67cc7d-93da-41c7-9b45-907790932817",
// //                     "questionId": "325a00f3-f5ff-467d-8506-08d44964fd6d",
// //                     "answer": "4",
// //                     "isCorrect": false,
// //                     "createdAt": "2025-05-06T21:20:04.509Z",
// //                     "updatedAt": "2025-05-06T21:20:04.509Z"
// //                 }
// //             ]
// //         },
// //         {
// //             "id": "a2c16f1f-2606-4920-924f-411e177ecc50",
// //             "quizId": "97b8aaba-6699-44fb-8e0d-eddd5300717a",
// //             "question": "QUal desses não é um tipo de microfone?",
// //             "createdAt": "2025-05-06T21:19:36.354Z",
// //             "updatedAt": "2025-05-06T21:19:36.354Z",
// //             "quizAnswers": [
// //                 {
// //                     "id": "3a1419a2-0882-4e8c-9d6f-fc140007110c",
// //                     "questionId": "a2c16f1f-2606-4920-924f-411e177ecc50",
// //                     "answer": "cardioide",
// //                     "isCorrect": true,
// //                     "createdAt": "2025-05-06T21:19:38.031Z",
// //                     "updatedAt": "2025-05-06T21:19:38.031Z"
// //                 },
// //                 {
// //                     "id": "6185dc44-a2b3-4eb3-b1d2-218461692cbe",
// //                     "questionId": "a2c16f1f-2606-4920-924f-411e177ecc50",
// //                     "answer": "Mongoloide",
// //                     "isCorrect": false,
// //                     "createdAt": "2025-05-06T21:19:38.399Z",
// //                     "updatedAt": "2025-05-06T21:19:38.399Z"
// //                 },
// //                 {
// //                     "id": "a8dc790c-0497-4db3-ae6c-48a9dfe70dda",
// //                     "questionId": "a2c16f1f-2606-4920-924f-411e177ecc50",
// //                     "answer": "Estereo",
// //                     "isCorrect": false,
// //                     "createdAt": "2025-05-06T21:19:38.775Z",
// //                     "updatedAt": "2025-05-06T21:19:38.775Z"
// //                 },
// //                 {
// //                     "id": "26ca92d8-28a5-412d-b4ef-5235a0000316",
// //                     "questionId": "a2c16f1f-2606-4920-924f-411e177ecc50",
// //                     "answer": "Anomalia",
// //                     "isCorrect": false,
// //                     "createdAt": "2025-05-06T21:19:39.151Z",
// //                     "updatedAt": "2025-05-06T21:19:39.151Z"
// //                 }
// //             ]
// //         },
// //         {
// //             "id": "899dc113-a341-46c1-b1be-5760121ef18e",
// //             "quizId": "97b8aaba-6699-44fb-8e0d-eddd5300717a",
// //             "question": "10 + 10",
// //             "createdAt": "2025-05-06T21:22:37.209Z",
// //             "updatedAt": "2025-05-06T21:22:37.209Z",
// //             "quizAnswers": [
// //                 {
// //                     "id": "5b70cd4c-9726-4f49-bd52-2311a24239a8",
// //                     "questionId": "899dc113-a341-46c1-b1be-5760121ef18e",
// //                     "answer": "50",
// //                     "isCorrect": false,
// //                     "createdAt": "2025-05-06T21:22:39.902Z",
// //                     "updatedAt": "2025-05-06T21:22:39.902Z"
// //                 },
// //                 {
// //                     "id": "70941d49-5788-495c-9190-5de285307637",
// //                     "questionId": "899dc113-a341-46c1-b1be-5760121ef18e",
// //                     "answer": "30",
// //                     "isCorrect": false,
// //                     "createdAt": "2025-05-06T21:22:39.165Z",
// //                     "updatedAt": "2025-05-06T21:22:39.165Z"
// //                 },
// //                 {
// //                     "id": "f8e3475b-c646-492b-bbd3-e0eeda3c461d",
// //                     "questionId": "899dc113-a341-46c1-b1be-5760121ef18e",
// //                     "answer": "40",
// //                     "isCorrect": false,
// //                     "createdAt": "2025-05-06T21:22:39.531Z",
// //                     "updatedAt": "2025-05-06T21:22:39.531Z"
// //                 },
// //                 {
// //                     "id": "b3880a54-681e-4dd9-82ca-01b81801ff8d",
// //                     "questionId": "899dc113-a341-46c1-b1be-5760121ef18e",
// //                     "answer": "20",
// //                     "isCorrect": true,
// //                     "createdAt": "2025-05-06T21:22:38.794Z",
// //                     "updatedAt": "2025-05-06T21:22:38.795Z"
// //                 }
// //             ]
// //         },
// //         {
// //             "id": "eda8a7b3-df1b-4425-94fc-a944e9603669",
// //             "quizId": "97b8aaba-6699-44fb-8e0d-eddd5300717a",
// //             "question": "4 + 4 ",
// //             "createdAt": "2025-05-06T21:22:15.913Z",
// //             "updatedAt": "2025-05-06T21:22:15.913Z",
// //             "quizAnswers": [
// //                 {
// //                     "id": "6d6e7bf8-2224-442c-a124-8281b4d4aa07",
// //                     "questionId": "eda8a7b3-df1b-4425-94fc-a944e9603669",
// //                     "answer": "1",
// //                     "isCorrect": false,
// //                     "createdAt": "2025-05-06T21:22:17.991Z",
// //                     "updatedAt": "2025-05-06T21:22:17.991Z"
// //                 },
// //                 {
// //                     "id": "f7d77fd1-9ae3-4b72-927f-9df7b04068d3",
// //                     "questionId": "eda8a7b3-df1b-4425-94fc-a944e9603669",
// //                     "answer": "8",
// //                     "isCorrect": true,
// //                     "createdAt": "2025-05-06T21:22:17.622Z",
// //                     "updatedAt": "2025-05-06T21:22:17.622Z"
// //                 },
// //                 {
// //                     "id": "03a1db14-87e7-4edb-adfc-a44551a32022",
// //                     "questionId": "eda8a7b3-df1b-4425-94fc-a944e9603669",
// //                     "answer": "2",
// //                     "isCorrect": false,
// //                     "createdAt": "2025-05-06T21:22:18.363Z",
// //                     "updatedAt": "2025-05-06T21:22:18.363Z"
// //                 },
// //                 {
// //                     "id": "c690f2dc-4efa-4e4d-a49f-ac17195f17a8",
// //                     "questionId": "eda8a7b3-df1b-4425-94fc-a944e9603669",
// //                     "answer": "3",
// //                     "isCorrect": false,
// //                     "createdAt": "2025-05-06T21:22:18.734Z",
// //                     "updatedAt": "2025-05-06T21:22:18.734Z"
// //                 }
// //             ]
// //         },
// //         {
// //             "id": "1ffecc82-e892-447e-8354-5d0786f26fb8",
// //             "quizId": "97b8aaba-6699-44fb-8e0d-eddd5300717a",
// //             "question": "letra a",
// //             "createdAt": "2025-05-06T21:20:31.430Z",
// //             "updatedAt": "2025-05-06T21:20:31.431Z",
// //             "quizAnswers": [
// //                 {
// //                     "id": "340394cb-4766-4081-892c-39306e66d0b3",
// //                     "questionId": "1ffecc82-e892-447e-8354-5d0786f26fb8",
// //                     "answer": "kls",
// //                     "isCorrect": false,
// //                     "createdAt": "2025-05-06T21:20:34.158Z",
// //                     "updatedAt": "2025-05-06T21:20:34.158Z"
// //                 },
// //                 {
// //                     "id": "b3c4ea86-be02-4a79-80f1-446bf07ce20c",
// //                     "questionId": "1ffecc82-e892-447e-8354-5d0786f26fb8",
// //                     "answer": "a",
// //                     "isCorrect": true,
// //                     "createdAt": "2025-05-06T21:20:33.398Z",
// //                     "updatedAt": "2025-05-06T21:20:33.398Z"
// //                 },
// //                 {
// //                     "id": "854e14d5-05e8-49dd-883a-2f0044d4061d",
// //                     "questionId": "1ffecc82-e892-447e-8354-5d0786f26fb8",
// //                     "answer": "sdks",
// //                     "isCorrect": false,
// //                     "createdAt": "2025-05-06T21:20:33.777Z",
// //                     "updatedAt": "2025-05-06T21:20:33.777Z"
// //                 },
// //                 {
// //                     "id": "5073b9c0-0e02-4d07-bab1-498b028b424b",
// //                     "questionId": "1ffecc82-e892-447e-8354-5d0786f26fb8",
// //                     "answer": "fgf",
// //                     "isCorrect": false,
// //                     "createdAt": "2025-05-06T21:20:33.021Z",
// //                     "updatedAt": "2025-05-06T21:20:33.021Z"
// //                 }
// //             ]
// //         },
// //         {
// //             "id": "5a53a52f-f710-49d0-a478-cf435617060c",
// //             "quizId": "97b8aaba-6699-44fb-8e0d-eddd5300717a",
// //             "question": "50 + 50",
// //             "createdAt": "2025-05-06T21:22:54.533Z",
// //             "updatedAt": "2025-05-06T21:22:54.533Z",
// //             "quizAnswers": [
// //                 {
// //                     "id": "618a0aa1-6c63-4115-91ca-e888d2bf7844",
// //                     "questionId": "5a53a52f-f710-49d0-a478-cf435617060c",
// //                     "answer": "400",
// //                     "isCorrect": false,
// //                     "createdAt": "2025-05-06T21:22:57.216Z",
// //                     "updatedAt": "2025-05-06T21:22:57.216Z"
// //                 },
// //                 {
// //                     "id": "f76cbcda-9944-44b5-93b8-c81cbe48cd21",
// //                     "questionId": "5a53a52f-f710-49d0-a478-cf435617060c",
// //                     "answer": "300",
// //                     "isCorrect": false,
// //                     "createdAt": "2025-05-06T21:22:56.844Z",
// //                     "updatedAt": "2025-05-06T21:22:56.844Z"
// //                 },
// //                 {
// //                     "id": "7dc70294-6554-4924-a247-b30639d13aeb",
// //                     "questionId": "5a53a52f-f710-49d0-a478-cf435617060c",
// //                     "answer": "200",
// //                     "isCorrect": false,
// //                     "createdAt": "2025-05-06T21:22:56.474Z",
// //                     "updatedAt": "2025-05-06T21:22:56.474Z"
// //                 },
// //                 {
// //                     "id": "e181a1f1-77a6-4b13-a318-a86bb6635f53",
// //                     "questionId": "5a53a52f-f710-49d0-a478-cf435617060c",
// //                     "answer": "100",
// //                     "isCorrect": true,
// //                     "createdAt": "2025-05-06T21:22:56.102Z",
// //                     "updatedAt": "2025-05-06T21:22:56.102Z"
// //                 }
// //             ]
// //         },
// //         {
// //             "id": "374e59e4-6469-49ee-b249-009c30eb3f42",
// //             "quizId": "97b8aaba-6699-44fb-8e0d-eddd5300717a",
// //             "question": "100 + 100",
// //             "createdAt": "2025-05-06T21:23:16.758Z",
// //             "updatedAt": "2025-05-06T21:23:16.758Z",
// //             "quizAnswers": [
// //                 {
// //                     "id": "aa96b2d4-c60e-442a-b644-9467ed6fd17c",
// //                     "questionId": "374e59e4-6469-49ee-b249-009c30eb3f42",
// //                     "answer": "200",
// //                     "isCorrect": true,
// //                     "createdAt": "2025-05-06T21:23:18.439Z",
// //                     "updatedAt": "2025-05-06T21:23:18.439Z"
// //                 },
// //                 {
// //                     "id": "cc198a9b-36a8-4fbd-ad46-34a8614fa6cc",
// //                     "questionId": "374e59e4-6469-49ee-b249-009c30eb3f42",
// //                     "answer": "30",
// //                     "isCorrect": false,
// //                     "createdAt": "2025-05-06T21:23:18.809Z",
// //                     "updatedAt": "2025-05-06T21:23:18.809Z"
// //                 },
// //                 {
// //                     "id": "35103726-600a-4aa9-8ede-aa63b385e623",
// //                     "questionId": "374e59e4-6469-49ee-b249-009c30eb3f42",
// //                     "answer": "500",
// //                     "isCorrect": false,
// //                     "createdAt": "2025-05-06T21:23:19.179Z",
// //                     "updatedAt": "2025-05-06T21:23:19.179Z"
// //                 },
// //                 {
// //                     "id": "7d7f8fac-5aa3-4478-b44e-1dcd9555cb39",
// //                     "questionId": "374e59e4-6469-49ee-b249-009c30eb3f42",
// //                     "answer": "50000",
// //                     "isCorrect": false,
// //                     "createdAt": "2025-05-06T21:23:19.549Z",
// //                     "updatedAt": "2025-05-06T21:23:19.549Z"
// //                 }
// //             ]
// //         },
// //         {
// //             "id": "4efc1b8f-3c11-4b74-a931-78213cb5a71b",
// //             "quizId": "97b8aaba-6699-44fb-8e0d-eddd5300717a",
// //             "question": "QUem matou coisinha",
// //             "createdAt": "2025-05-06T23:14:21.010Z",
// //             "updatedAt": "2025-05-06T23:14:21.010Z",
// //             "quizAnswers": [
// //                 {
// //                     "id": "9a6fe9fc-9598-40d2-a694-fc07f2ed4df1",
// //                     "questionId": "4efc1b8f-3c11-4b74-a931-78213cb5a71b",
// //                     "answer": "Coisão",
// //                     "isCorrect": true,
// //                     "createdAt": "2025-05-06T23:14:22.824Z",
// //                     "updatedAt": "2025-05-06T23:14:22.824Z"
// //                 },
// //                 {
// //                     "id": "2713f5b5-2e45-4365-a077-127fd745536f",
// //                     "questionId": "4efc1b8f-3c11-4b74-a931-78213cb5a71b",
// //                     "answer": "nirode",
// //                     "isCorrect": false,
// //                     "createdAt": "2025-05-06T23:14:23.745Z",
// //                     "updatedAt": "2025-05-06T23:14:23.745Z"
// //                 },
// //                 {
// //                     "id": "5b6bcad2-410b-4172-beb5-a5867320b458",
// //                     "questionId": "4efc1b8f-3c11-4b74-a931-78213cb5a71b",
// //                     "answer": "norede",
// //                     "isCorrect": false,
// //                     "createdAt": "2025-05-06T23:14:23.232Z",
// //                     "updatedAt": "2025-05-06T23:14:23.232Z"
// //                 },
// //                 {
// //                     "id": "2fd3c479-3d2f-453c-985a-517debda45a2",
// //                     "questionId": "4efc1b8f-3c11-4b74-a931-78213cb5a71b",
// //                     "answer": "espeto",
// //                     "isCorrect": false,
// //                     "createdAt": "2025-05-06T23:14:24.155Z",
// //                     "updatedAt": "2025-05-06T23:14:24.155Z"
// //                 }
// //             ]
// //         },
// //         {
// //             "id": "c308eda0-6f82-49ee-a803-f0211782fc62",
// //             "quizId": "97b8aaba-6699-44fb-8e0d-eddd5300717a",
// //             "question": "5 + 5",
// //             "createdAt": "2025-05-06T21:21:26.471Z",
// //             "updatedAt": "2025-05-06T21:21:26.471Z",
// //             "quizAnswers": [
// //                 {
// //                     "id": "46b0fbfb-6fe9-42fb-b2e2-29ba55406bf4",
// //                     "questionId": "c308eda0-6f82-49ee-a803-f0211782fc62",
// //                     "answer": "15",
// //                     "isCorrect": false,
// //                     "createdAt": "2025-05-06T21:21:28.468Z",
// //                     "updatedAt": "2025-05-06T21:21:28.468Z"
// //                 },
// //                 {
// //                     "id": "c32a5e50-024e-4353-9318-f183fe81ac6e",
// //                     "questionId": "c308eda0-6f82-49ee-a803-f0211782fc62",
// //                     "answer": "54",
// //                     "isCorrect": false,
// //                     "createdAt": "2025-05-06T21:21:29.234Z",
// //                     "updatedAt": "2025-05-06T21:21:29.235Z"
// //                 },
// //                 {
// //                     "id": "44cb1d05-a43a-4d11-9933-7bf8013f854b",
// //                     "questionId": "c308eda0-6f82-49ee-a803-f0211782fc62",
// //                     "answer": "16",
// //                     "isCorrect": false,
// //                     "createdAt": "2025-05-06T21:21:28.848Z",
// //                     "updatedAt": "2025-05-06T21:21:28.849Z"
// //                 },
// //                 {
// //                     "id": "7d333f32-8f22-4683-bda1-5c8aa76cce52",
// //                     "questionId": "c308eda0-6f82-49ee-a803-f0211782fc62",
// //                     "answer": "10",
// //                     "isCorrect": true,
// //                     "createdAt": "2025-05-06T21:21:28.089Z",
// //                     "updatedAt": "2025-05-06T21:21:28.089Z"
// //                 }
// //             ]
// //         },
// //         {
// //             "id": "e4979a1e-1abf-4cde-a9dc-0583ee31795d",
// //             "quizId": "97b8aaba-6699-44fb-8e0d-eddd5300717a",
// //             "question": "Oque é sonoplastia",
// //             "createdAt": "2025-05-06T21:23:48.931Z",
// //             "updatedAt": "2025-05-06T21:23:48.931Z",
// //             "quizAnswers": [
// //                 {
// //                     "id": "1b000d75-6877-4133-899d-4304d7664ae7",
// //                     "questionId": "e4979a1e-1abf-4cde-a9dc-0583ee31795d",
// //                     "answer": "COisa",
// //                     "isCorrect": false,
// //                     "createdAt": "2025-05-06T21:23:51.597Z",
// //                     "updatedAt": "2025-05-06T21:23:51.597Z"
// //                 },
// //                 {
// //                     "id": "f793b6d6-3ecf-4b3f-a18e-f2750855d055",
// //                     "questionId": "e4979a1e-1abf-4cde-a9dc-0583ee31795d",
// //                     "answer": "Um som",
// //                     "isCorrect": true,
// //                     "createdAt": "2025-05-06T21:23:50.485Z",
// //                     "updatedAt": "2025-05-06T21:23:50.485Z"
// //                 },
// //                 {
// //                     "id": "8d0067e8-ce52-4860-8cbb-49e7dae86ad5",
// //                     "questionId": "e4979a1e-1abf-4cde-a9dc-0583ee31795d",
// //                     "answer": "Mesa",
// //                     "isCorrect": false,
// //                     "createdAt": "2025-05-06T21:23:50.852Z",
// //                     "updatedAt": "2025-05-06T21:23:50.852Z"
// //                 },
// //                 {
// //                     "id": "8c110235-fd8c-4fa7-84f2-ddf032c0e5d8",
// //                     "questionId": "e4979a1e-1abf-4cde-a9dc-0583ee31795d",
// //                     "answer": "Microfone",
// //                     "isCorrect": false,
// //                     "createdAt": "2025-05-06T21:23:51.227Z",
// //                     "updatedAt": "2025-05-06T21:23:51.227Z"
// //                 }
// //             ]
// //         }
// //     ]
// // }"
  
//   return (
//     <div>
//       <p></p>
//     </div>
//   )
// }





























// import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ArrowRight, ArrowLeft, Clock, Check, X, Award } from 'lucide-react';
// import confetti from 'canvas-confetti';
// import { questionsService } from '../../services/questionsService';
// import { quizAttemptService } from '../../services/quizAttemptService';

// const Quiz = () => {
//   const navigate = useNavigate();
//   const { quizId } = useParams();
//   const userId = "3ffe808c-c627-45d8-8cc5-1e9dc1f2d894"; // Idealmente, pegaria do contexto de autenticação
  
//   const [questions, setQuestions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [currentStep, setCurrentStep] = useState(0);
//   const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
//   const [timeLeft, setTimeLeft] = useState(30);
//   const [quizComplete, setQuizComplete] = useState(false);
//   interface Score {
//     total: number;
//     correct: number;
//     percentage: number;
//   }

//   const [score, setScore] = useState<Score | null>(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [direction, setDirection] = useState(1); // 1 para avançar, -1 para voltar


//   // Carrega as questões quando o componente monta
//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         setLoading(true);
//         if (!quizId) {
//           throw new Error('Quiz ID não encontrado.');
//         }
//         const data = await questionsService.getRandomQuestions(quizId);
//         setQuestions(data.questions);
//         setLoading(false);
//       } catch (err) {
//         setError('Falha ao carregar as questões. Tente novamente mais tarde.');
//         setLoading(false);
//       }
//     };


//     fetchQuestions();
//   }, [quizId]);


//   // Timer para cada pergunta
//   useEffect(() => {
//     if (loading || quizComplete) return;


//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           // Avança para a próxima pergunta quando o tempo acaba
//           if (currentStep < questions.length - 1) {
//             setDirection(1);
//             setCurrentStep((prev) => prev + 1);
//             return 30;
//           } else {
//             // Finaliza o quiz se estiver na última pergunta
//             submitQuizAnswers();
//             clearInterval(timer);
//             return 0;
//           }
//         }
//         return prev - 1;
//       });
//     }, 1000);


//     return () => clearInterval(timer);
//   }, [loading, currentStep, questions.length, quizComplete]);


//   // Reset do timer quando muda a pergunta
//   useEffect(() => {
//     setTimeLeft(30);
//   }, [currentStep]);


//   // Função para selecionar uma resposta
//   const selectAnswer = (questionId: string, answerId: string) => {
//     setSelectedAnswers((prev) => ({
//       ...prev,
//       [questionId]: answerId,
//     }));
//   };


//   // Função para enviar as respostas
//   const submitQuizAnswers = useCallback(async () => {
//     if (submitting) return;
    
//     try {
//       setSubmitting(true);
      
//       // Formata as respostas para o formato esperado pelo serviço
//       const formattedAnswers = Object.entries(selectedAnswers).map(([questionId, answerId]) => ({
//         questionId,
//         answerId,
//       }));


//       // Verifica se todas as perguntas foram respondidas
//       if (formattedAnswers.length < questions.length) {
//         // Preenche respostas não selecionadas com uma resposta aleatória
//         questions.forEach((question: { id: string; quizAnswers: { id: string }[] }) => {
//           if (!selectedAnswers[question.id]) {
//             // Pega uma resposta aleatória
//             const randomIndex = Math.floor(Math.random() * question.quizAnswers.length);
//             formattedAnswers.push({
//               questionId: question.id,
//               answerId: question.quizAnswers[randomIndex].id
//             });
//           }
//         });
//       }


//       // Envia as respostas
//       if (!quizId) {
//         throw new Error('Quiz ID não encontrado.');
//       }
//       const result = await quizAttemptService.submitQuiz(userId, quizId, formattedAnswers);
      
//       // Calcula o score temporário (na versão real viria do backend)
//       const correctAnswers = questions.filter((question: { id: string; quizAnswers: { id: string; isCorrect: boolean }[] }) => {
//         const selectedAnswerId = selectedAnswers[question.id];
//         const correctAnswer = question.quizAnswers.find(answer => answer.isCorrect);
//         return selectedAnswerId === correctAnswer?.id;
//       }).length;
      
//       setScore({
//         total: questions.length,
//         correct: correctAnswers,
//         percentage: Math.round((correctAnswers / questions.length) * 100)
//       });
      
//       setQuizComplete(true);
      
//       // Efeito de confete para celebrar o fim do quiz
//       if (correctAnswers > questions.length / 2) {
//         confetti({
//           particleCount: 100,
//           spread: 70,
//           origin: { y: 0.6 }
//         });
//       }
      
//       setSubmitting(false);
//     } catch (err) {
//       setError('Erro ao enviar o quiz. Tente novamente.');
//       setSubmitting(false);
//     }
//   }, [questions, selectedAnswers, userId, quizId, submitting]);


//   // Avança para a próxima pergunta
//   const nextQuestion = () => {
//     if (currentStep < questions.length - 1) {
//       setDirection(1);
//       setCurrentStep((prev) => prev + 1);
//     } else {
//       submitQuizAnswers();
//     }
//   };


//   // Volta para a pergunta anterior
//   const prevQuestion = () => {
//     if (currentStep > 0) {
//       setDirection(-1);
//       setCurrentStep((prev) => prev - 1);
//     }
//   };


//   // Reinicia o quiz
//   const restartQuiz = () => {
//     setSelectedAnswers({});
//     setCurrentStep(0);
//     setTimeLeft(30);
//     setQuizComplete(false);
//     setScore(null);
//     setDirection(1);
//   };


//   // Retorna para o menu principal
//   const goToHome = () => {
//     navigate('/');
//   };


//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
//         <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
//         <p className="mt-4 text-xl">Carregando quiz...</p>
//       </div>
//     );
//   }


//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
//         <div className="p-6 bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
//           <h2 className="text-2xl font-bold text-red-500 mb-4">Erro</h2>
//           <p className="mb-6">{error}</p>
//           <button 
//             onClick={goToHome}
//             className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
//           >
//             Voltar para o início
//           </button>
//         </div>
//       </div>
//     );
//   }


//   if (quizComplete) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="p-8 bg-gray-800 rounded-lg shadow-lg max-w-md w-full"
//         >
//           <div className="flex justify-center mb-6">
//             <Award size={80} className={`${
//               score.percentage >= 70 ? 'text-yellow-500' : 
//               score.percentage >= 50 ? 'text-blue-500' : 'text-gray-500'
//             }`} />
//           </div>
          
//           <h2 className="text-3xl font-bold text-center mb-2">Quiz Completado!</h2>
          
//           {score && (
//             <div className="text-center mb-8">
//               <p className="text-xl mb-2">Sua pontuação:</p>
//               <p className="text-4xl font-bold mb-2">
//                 {score.correct} / {score.total}
//               </p>
//               <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
//                 <div 
//                   className={`h-4 rounded-full ${
//                     score.percentage >= 70 ? 'bg-green-500' : 
//                     score.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
//                   }`}
//                   style={{ width: `${score.percentage}%` }}
//                 ></div>
//               </div>
//               <p className="text-2xl font-semibold">
//                 {score.percentage}%
//               </p>
              
//               <p className="mt-4">
//                 {score.percentage >= 70 ? 'Excelente trabalho!' : 
//                  score.percentage >= 50 ? 'Bom trabalho!' : 'Continue praticando!'}
//               </p>
//             </div>
//           )}
          
//           <div className="flex flex-col sm:flex-row gap-4">
//             <button 
//               onClick={restartQuiz}
//               className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
//             >
//               Tentar Novamente
//             </button>
//             <button 
//               onClick={goToHome}
//               className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors"
//             >
//               Menu Principal
//             </button>
//           </div>
//         </motion.div>
//       </div>
//     );
//   }


//   const currentQuestion = questions[currentStep];


//   if (!currentQuestion) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
//         <p className="text-xl">Nenhuma pergunta disponível</p>
//         <button 
//           onClick={goToHome}
//           className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
//         >
//           Voltar para o início
//         </button>
//       </div>
//     );
//   }


//   // Calcula a cor do timer baseada no tempo restante
//   const getTimerColor = () => {
//     if (timeLeft > 20) return 'text-green-500';
//     if (timeLeft > 10) return 'text-yellow-500';
//     return 'text-red-500';
//   };


//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
//       {/* Progresso */}
//       <div className="w-full max-w-3xl mb-8">
//         <div className="flex justify-between mb-2">
//           <span>Pergunta {currentStep + 1} de {questions.length}</span>
//           <div className={`flex items-center ${getTimerColor()}`}>
//             <Clock size={20} className="mr-1" />
//             <span>{timeLeft}s</span>
//           </div>
//         </div>
//         <div className="w-full bg-gray-700 rounded-full h-2">
//           <div 
//             className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//             style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
//           ></div>
//         </div>
//       </div>
      
//       {/* Conteúdo da pergunta */}
//       <div className="w-full max-w-3xl bg-gray-800 rounded-lg shadow-lg overflow-hidden">
//         <AnimatePresence mode="wait" initial={false}>
//           <motion.div
//             key={currentStep}
//             initial={{ opacity: 0, x: direction * 50 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: direction * -50 }}
//             transition={{ duration: 0.3 }}
//             className="p-6"
//           >
//             <h2 className="text-xl sm:text-2xl font-semibold mb-6">
//               {currentQuestion.question}
//             </h2>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {currentQuestion.quizAnswers.map((answer) => (
//                 <button
//                   key={answer.id}
//                   onClick={() => selectAnswer(currentQuestion.id, answer.id)}
//                   className={`p-4 rounded-lg text-left transition-all duration-200 flex items-center ${
//                     selectedAnswers[currentQuestion.id] === answer.id
//                       ? 'bg-blue-600 text-white'
//                       : 'bg-gray-700 hover:bg-gray-600'
//                   }`}
//                 >
//                   <div className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 ${
//                     selectedAnswers[currentQuestion.id] === answer.id
//                       ? 'bg-white text-blue-600'
//                       : 'bg-gray-600'
//                   }`}>
//                     {selectedAnswers[currentQuestion.id] === answer.id ? (
//                       <Check size={16} />
//                     ) : null}
//                   </div>
//                   <span>{answer.answer}</span>
//                 </button>
//               ))}
//             </div>
//           </motion.div>
//         </AnimatePresence>
        
//         {/* Navegação */}
//         <div className="flex justify-between items-center bg-gray-700 p-4">
//           <button
//             onClick={prevQuestion}
//             disabled={currentStep === 0}
//             className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
//               currentStep === 0
//                 ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
//                 : 'bg-gray-800 hover:bg-gray-600 text-white'
//             }`}
//           >
//             <ArrowLeft size={16} className="mr-2" />
//             Anterior
//           </button>
          
//           <div className="flex-1 flex justify-center">
//             {Array.from({ length: Math.min(questions.length, 5) }).map((_, idx) => {
//               // Mostrar no máximo 5 pontos, com o atual no centro
//               const startIdx = Math.max(
//                 0,
//                 Math.min(
//                   currentStep - 2,
//                   questions.length - 5
//                 )
//               );
//               const dotIdx = startIdx + idx;
              
//               // Determinar se o ponto está no alcance visível
//               if (dotIdx >= questions.length) return null;
              
//               return (
//                 <div
//                   key={dotIdx}
//                   className={`w-2 h-2 mx-1 rounded-full ${
//                     dotIdx === currentStep ? 'bg-blue-500' : 'bg-gray-500'
//                   }`}
//                 ></div>
//               );
//             })}
//           </div>
          
//           <button
//             onClick={nextQuestion}
//             className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
//           >
//             {currentStep === questions.length - 1 ? 'Finalizar' : 'Próxima'}
//             <ArrowRight size={16} className="ml-2" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };


// export default Quiz;
