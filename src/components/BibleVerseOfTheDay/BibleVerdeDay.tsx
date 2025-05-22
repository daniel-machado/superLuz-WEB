import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { biblicalService } from "../../services/biblicalService";
import {
  Book,
  ChevronRight,
  Calendar,
  Star,
  X,
  Flame,
  Award,
  Sparkles,
  CheckCircle,
  CloudLightning,
} from "lucide-react";
import { Modal } from "../ui/modal";
import Confetti from 'react-confetti';
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { DailyReadingService } from "../../services/dailyVerseBiblicalService";




// Tipos
interface BibleVerse {
  numero: number;
  texto: string;
}


interface BibleChapter {
  dia: number;
  livro: string;
  capitulo: number;
  verses: BibleVerse[]
}


// Props para o componente principal
interface BibleVerseOfTheDayProps {
  onRegisterReading: (data: { book: string, chapter: number, verse: number }) => Promise<void>;
  onStreakChange?: (streak: number) => void;
  refreshTrigger?: number; // Prop para forçar atualização do componente
}


// Componente Modal
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}


// Componentes de efeitos
const ParticleEffect = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 8 + 2,
            height: Math.random() * 8 + 2,
            backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.random() * 0.4 + 0.1})`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -(Math.random() * 50 + 20)],
            x: [0, (Math.random() * 30 - 15)],
            opacity: [0.4, 0],
            scale: [1, Math.random() * 0.8 + 0.5],
          }}
          transition={{
            duration: Math.random() * 5 + 2,
            repeat: Infinity,
            ease: "easeOut",
            repeatDelay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};


// Componente Modal melhorado
const ModalNew = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;


  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 15 }}
          className="relative w-full max-w-3xl max-h-[80vh] overflow-hidden rounded-xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 overflow-hidden">
            {/* Padrão geométrico de fundo */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
                    <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="0.5" />
                  </pattern>
                  <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                    <rect width="80" height="80" fill="url(#smallGrid)" />
                    <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
           
            {/* Círculos decorativos */}
            <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-pink-600/5 rounded-full filter blur-3xl opacity-30 -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute left-0 bottom-0 w-80 h-80 bg-gradient-to-tr from-blue-500/20 to-emerald-600/5 rounded-full filter blur-3xl opacity-30 translate-y-1/2 -translate-x-1/3"></div>
          </div>
         
          {/* Conteúdo real */}
          <div className="relative flex flex-col h-[80vh]">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </Modal>
  );
};


// Componente de recompensa
const ReadingReward = ({ 
  streak, 
  onClose, 
  lives, 
  milestone 
}: { 
  streak: number, 
  onClose: () => void, 
  lives: number, 
  milestone: number 
}) => {
  const [showConfetti, setShowConfetti] = useState(true);
 
  // Desativar confetti após alguns segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 9000);
   
    return () => clearTimeout(timer);
  }, []);


  const messages = [
    "Nossa! Você está em chamas! 🔥",
    "Mantenha essa chama acesa! 💪",
    "Impressionante! Continue assim! ✨",
    "Você está brilhando a cada dia! ⭐",
    "Sua luz está mais forte! ☀️",
    "Seu esforço está valendo a pena! 🙌"
  ];


  // Selecionar mensagem baseada no streak ou aleatoriamente
  const getMessage = () => {
    if (streak <= 0) return messages[0];
    return messages[streak % messages.length];
  };


  return (
    <div className="relative">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
     
      <div className="p-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 12, delay: 0.2 }}
          className="w-30 h-30 mx-auto mb-4 relative"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 to-orange-600 opacity-25 animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            {streak >= 50 ? (
              <Award className="w-16 h-16 text-amber-400" />
            ) : streak >= 30 ? (
              <CloudLightning className="w-16 h-16 text-orange-400" />
            ) : streak >= 10 ? (
              <Flame className="w-16 h-16 text-red-500" />
            ) : (
              <Sparkles className="w-16 h-16 text-yellow-400" />
            )}
          </div>
        </motion.div>
       
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-bold text-white mb-2"
        >
          Leitura Registrada!
        </motion.h2>
       
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-lg mb-2 text-brand-300">{getMessage()}</p>
         
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-400">{streak} 🔥</div>
              <div className="text-xs uppercase text-gray-400">
                { 
                streak === 1 ? 'dia' : 'dias' 
              }
              </div>
            </div>

            {streak > 0 && streak % 10 === 0 && (
              <div className="px-3 py-1.5 rounded-full bg-brand-900/50 border border-brand-700">
                <span className="text-sm font-medium text-brand-400">+1 Nível</span>
              </div>
            )}
          </div>

          <div className="text-center">
              <div className="text-3xl font-bold text-brand-400">{lives} ❤️</div>
              <div className="text-xs uppercase text-gray-400">
                { 
                lives === 1 ? 'vida' : 'vidas' 
              }
              </div>
            </div>

          <p className="text-md mb-2 text-brand-300">
            Faltam <strong>{milestone}</strong> dias para ganhar mais uma vida
          </p>
        
          <div className="flex justify-center mt-6">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-gradient-to-r from-brand-600 to-brand-700 hover:to-brand-600 rounded-lg text-white font-medium transform transition hover:scale-105 active:scale-95"
            >
              Continuar
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};


// Componente principal
const BibleVerseOfTheDay: React.FC<BibleVerseOfTheDayProps> = ({ 
  onRegisterReading,  
  refreshTrigger = 0,
  onStreakChange, 
}) => {
  const [verseData, setVerseData] = useState<BibleChapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [_activeTab, _setActiveTab] = useState('verses');
  const [streak, setStreak] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [hasReadToday, setHasReadToday] = useState(false);
  const [highlightedVerse, setHighlightedVerse] = useState<number | null>(null);
  const [lives, setLives] = useState(0);
  const [milestone, setMilestone] = useState(0);

  // Referência para scroll automático
  const selectedVerseRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();


  useEffect(() => {
    const fetchVerseOfTheDay = async () => {
      try {
        const response = await biblicalService.bibleChapterDay();
        setVerseData(response);

      } catch (erro: any) {
        setError(erro instanceof Error ? erro.message : "Erro desconhecido");
        toast.error(`Error: ${erro.message}`, {
          position: 'bottom-right',
          icon: '🚫',
          duration: 5000,
        });
      } finally {
        setLoading(false);
      }
    };


    fetchVerseOfTheDay();
  }, []);


  // Efeito para carregar os dados do streak quando o componente montar ou atualizar
  useEffect(() => {
    const fetchStreakInfo = async () => {
      if (user && user.user.user.id) {
        try {
          setLoading(true);
          const response = await DailyReadingService.getStreakInfo(user.user.user.id);
          
          if( response && response.streakInfo ){
            setStreak(response.streakInfo.currentStreak);
            setLives(response.streakInfo.lives);
            setHasReadToday(response.streakInfo.hasReadToday);
            setMilestone(response.streakInfo.nextMilestone - response.streakInfo.currentStreak)
          }

          // Notificar componente pai sobre mudança no streak se necessário
          if (onStreakChange) {
            onStreakChange(response.streakInfo.currentStreak);
          }
        } catch (error: any) {
          console.error('Erro ao buscar informações do streak:', error.message);
          toast.error(`Error: ${error.message}`, {
          position: 'bottom-right',
          icon: '🚫',
          duration: 5000,
        });
        } finally {
          setLoading(false);
        }
      }
    };


    fetchStreakInfo();
  }, [user, refreshTrigger]); // Adiciona refreshTrigger como dependência


  // Efeito para scroll quando um versículo é destacado
  useEffect(() => {
    if (highlightedVerse !== null && selectedVerseRef.current) {
      selectedVerseRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [highlightedVerse]);


  const handleClose = () => {
    if (showReward) {
      setShowReward(false);
    } else {
      setIsModalOpen(false);
      setHighlightedVerse(null);
    }
  };


  const handleRegisterReading = async () => {
    if (!verseData) return;
  
    try {
      await onRegisterReading({
        book: verseData.livro,
        chapter: verseData.capitulo,
        verse: verseData.verses[0].numero
      });

      setShowReward(true);
    } catch (error: any) {
      console.error("Erro ao registrar leitura:", error.message);
      toast.error(`Error ao registrar leitura: ${error.message}`, {
          position: 'bottom-right',
          icon: '🚫',
          duration: 5000,
        });
    }
    // setIsModalOpen(false);
    // toast.success(`Parabéns pela leitura (FOGO EM MANUTENÇÃO)`, {
    //   position: 'bottom-right',
    //   icon: '🚀',
    //   duration: 8000,
      
    // });
    
  };

  // Fechar modal de recompensa
  const handleCloseReward = () => {
    setShowReward(false);
    setIsModalOpen(false);
  };

  // Destacar um versículo específico
  const handleVerseHighlight = (numero: number) => {
    setHighlightedVerse(numero);
  };


  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-t-4 border-b-4 border-brand-500 rounded-full animate-spin"></div>
          <Book className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-brand-400" />
        </div>
        <p className="text-brand-400 animate-pulse font-medium">Carregando versículo do dia...</p>
      </div>
    );
  }


  if (error) {
    return (
      <div className="p-6 rounded-xl bg-red-900/20 border border-red-800">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-900/40 flex items-center justify-center">
            <X className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-400">Ops! Algo deu errado</h3>
            <p className="text-red-300/80">{error}</p>
          </div>
        </div>
        <button
          className="mt-4 w-full py-2 bg-red-900/40 hover:bg-red-800/60 text-red-400 rounded-lg transition-colors"
          onClick={() => window.location.reload()}
        >
          Tentar novamente
        </button>
      </div>
    );
  }


  if (!verseData) return null;


  const firstVerse = verseData.verses[0];
  const bgPatterns = [
    "linear-gradient(to right, rgb(29, 78, 216), rgb(30, 64, 175), rgb(17, 24, 39))",
    "linear-gradient(109.6deg, rgb(36, 45, 57) 11.2%, rgb(16, 37, 60) 51.2%, rgb(0, 0, 0) 98.6%)",
    "linear-gradient(to right, rgb(15, 23, 42), rgb(88, 28, 135), rgb(15, 23, 42))"
  ];
 
  const randomBg = bgPatterns[Math.floor(Math.random() * bgPatterns.length)];


  const messages = [
    'Nos lembra que a fé pode mover montanhas e transformar vidas.',
    'Nos ensina a confiar em Deus em todas as circunstâncias.',
    'Nos mostra que o amor de Deus é incondicional e eterno.',
    'Nos inspira a sermos fortes e corajosos, pois Deus está conosco.',
    'Nos lembra que a oração é uma poderosa ferramenta de conexão com Deus.',
    'Nos ensina a importância do perdão e da reconciliação.',
    'Nos mostra que a esperança em Deus nunca falha.',
    'Nos inspira a viver uma vida de gratidão e louvor.',
    'Nos lembra que Deus é nosso refúgio e fortaleza.',
    'Nos ensina a amar ao próximo como a nós mesmos.',
    'Nos mostra que a fé sem obras é morta.',
    'Nos inspira a buscar a justiça e a verdade.',
    'Nos lembra que Deus é fiel e cumpre suas promessas.',
    'Nos ensina a importância da humildade e do serviço.',
    'Nos mostra que Deus é a fonte de toda sabedoria.',
    'Nos inspira a viver em paz e harmonia com os outros.',
    'Nos lembra que Deus é nosso pastor e nada nos faltará.',
    'Nos ensina a importância da paciência e da perseverança.',
    'Nos mostra que Deus é nosso guia e protetor.',
    'Nos inspira a confiar no plano de Deus para nossas vidas.',
    'Nos lembra que Deus é amor e quem permanece no amor permanece em Deus.',
    'Nos ensina a importância da fé e da confiança em Deus.',
    'Nos mostra que Deus é nossa luz e salvação.',
    'Nos inspira a viver uma vida de integridade e honestidade.',
    'Nos lembra que Deus é nosso consolo em tempos de aflição.',
    'Nos ensina a importância da obediência à palavra de Deus.',
    'Nos mostra que Deus é nosso ajudador e amigo.',
    'Nos inspira a viver uma vida de fé e confiança em Deus.',
    'Nos lembra que Deus é nosso protetor e defensor.',
    'Nos ensina a importância da esperança e da fé em Deus.',
  ];


  const getRandomMessage = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    return messages[dayOfYear % messages.length];
  };


  const randomMessage = getRandomMessage();


  return (
    <>
      {/* Card do Versículo do Dia - Redesenhado para Adolescentes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-xl border border-gray-800 hover:shadow-2xl transition-all duration-300 relative">
          {/* Efeito de partículas */}
          <ParticleEffect />
         
          {/* Banner de fundo */}
          <div
            className="h-24 relative overflow-hidden"
            style={{ background: randomBg }}
          >
            {/* Padrão de ondas sobrepostas */}
            <svg className="absolute bottom-0 left-0 w-full opacity-30" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="rgba(255, 255, 255, 0.1)"></path>
            </svg>
            <svg className="absolute bottom-0 left-0 w-full opacity-20" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="rgba(255, 255, 255, 0.1)"></path>
            </svg>
           
            {/* Título flutuante */}
            <div className="absolute bottom-4 left-6 z-10">
              <h3 className="text-xl font-bold text-white tracking-wide flex items-center">
                <Book className="w-5 h-5 mr-2" />
                Versículo do Dia
              </h3>
            </div>
           
            {/* Badge com informação do livro */}
            <div className="absolute top-4 right-6 px-3 py-1 bg-black/30 backdrop-blur-sm rounded-full">
              <div className="flex items-center text-white/90 text-sm">
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                <span>{verseData.livro} {verseData.capitulo}</span>
              </div>
            </div>
          </div>
         
          {/* Conteúdo */}
          <div className="p-6">
            <div className="flex items-center text-sm text-gray-400 mb-3">
              <div className="flex items-center">
                <Book className="inline-block w-4 h-4 mr-1.5" />
                <span className="font-medium">{verseData.livro}</span>
              </div>
              <ChevronRight className="w-4 h-4 mx-2 text-gray-600" />
              <span>Capítulo {verseData.capitulo}</span>
              <ChevronRight className="w-4 h-4 mx-2 text-gray-600" />
              <span>Versículo {firstVerse.numero}</span>
            </div>
           
            {/* Versículo principal com efeito de digitação */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative"
            >
              <div className="absolute -left-2 -top-2 text-5xl text-brand-700/30 font-serif">"</div>
              <p className="text-xl text-gray-300 pl-6 pr-2 leading-relaxed italic">
                {firstVerse.texto}
              </p>
              <div className="absolute -right-2 -bottom-2 text-5xl text-brand-700/30 font-serif">"</div>
            </motion.div>
           
            <motion.div
              className="mt-8 flex flex-wrap justify-between items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {/* Tag do tema do dia */}
              <div className="mb-4 sm:mb-0">
                <div className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-800/70 text-brand-400 border border-brand-800/50 inline-flex items-center">
                  <Star className="w-3.5 h-3.5 mr-1.5" />
                  Tema: Inspiração Diária
                </div>
              </div>
             
              {/* Botão principal animado */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-brand-600 to-brand-700 hover:to-brand-600 text-white rounded-lg font-medium text-sm flex items-center shadow-lg shadow-brand-900/30 transition-all"
              >
                Ler capítulo completo
                <ChevronRight className="w-4 h-4 ml-1" />
              </motion.button>
            </motion.div>
           
            {/* Indicador de leitura feita */}
            {hasReadToday && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 pt-4 border-t border-gray-800 flex items-center text-green-400"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                <span className="text-sm">Leitura de hoje já registrada! 🔥</span>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>


      {/* Modal para recompensa após marcar como lido */}
      <AnimatePresence>
        {isModalOpen && showReward && (
          <ModalNew isOpen={isModalOpen} onClose={handleCloseReward}>
            <ReadingReward 
              streak={streak} 
              onClose={handleCloseReward} 
              lives={lives}
              milestone={milestone}
              />
          </ModalNew>
        )}
      </AnimatePresence>


      {/* Modal para leitura do capítulo completo */}
      <AnimatePresence>
        {isModalOpen && !showReward && (
          <ModalNew isOpen={isModalOpen} onClose={handleClose}>
            <div className="flex flex-col h-full">
              {/* Header - fixado no topo */}
              <div className="sticky top-0 z-10 px-6 py-4 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-lg bg-brand-900/50 border border-brand-800/50 flex items-center justify-center mr-3">
                    <Book className="h-5 w-5 text-brand-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{verseData.livro} {verseData.capitulo}</h3>
                    <p className="text-sm text-gray-400">Capítulo completo • {verseData.verses.length} versículos</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>


              {/* Conteúdo principal com scroll */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-6">
                  {/* Cabeçalho com tema do capítulo */}
                  <div className="mb-8 p-4 bg-gradient-to-r from-brand-900/40 to-gray-900 rounded-lg border border-gray-800">
                    <h4 className="text-lg font-bold text-white mb-2 flex items-center">
                      <Star className="w-5 h-5 mr-2 text-yellow-500" />
                      Tema do Capítulo
                    </h4>
                    <p className="text-gray-300">{verseData.livro} {verseData.capitulo} {randomMessage}</p>
                  </div>
                 
                  {/* Navegação rápida */}
                  <div className="mb-6 overflow-auto">
                    <div className="flex space-x-2 pb-2">
                      {[1, 5, 10, 15, 20, 25].filter(num => num <= verseData.verses.length).map((num) => (
                        <button
                          key={`nav-${num}`}
                          onClick={() => handleVerseHighlight(num)}
                          className="flex-shrink-0 w-8 h-8 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 flex items-center justify-center text-sm transition-colors"
                        >
                          {num}
                        </button>
                      ))}
                      {verseData.verses.length > 25 && (
                        <button className="flex-shrink-0 h-8 px-2 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 flex items-center justify-center text-sm transition-colors">
                          <span>+ Ver todos</span>
                        </button>
                      )}
                    </div>
                  </div>
                 
                  {/* Versículos com animação e interação */}
                  <div className="space-y-6 pb-32">
                    {verseData.verses.map((verse) => (
                      <motion.div
                        key={verse.numero}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: verse.numero * 0.03 }}
                        className={`group rounded-lg p-2 -mx-2 ${highlightedVerse === verse.numero ? 'bg-brand-900/30 border border-brand-800/50' : 'hover:bg-gray-800/50'}`}
                        ref={highlightedVerse === verse.numero ? selectedVerseRef : null}
                      >
                        <div className="flex">
                          <div className="flex-shrink-0 mr-4 pt-1 flex items-center justify-center">
                            <span className={`inline-block w-8 h-8 rounded-lg ${
                              highlightedVerse === verse.numero
                                ? 'bg-brand-800 text-brand-400'
                                : 'bg-gray-800 text-gray-400 group-hover:bg-gray-700 group-hover:text-gray-300'
                              } font-medium text-sm flex items-center justify-center transition-colors`}
                            >
                              {verse.numero}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors">
                            {verse.texto}
                          </p>
                          
                          {/* Ações do versículo - Aparecem apenas no hover */}
                          <div className="mt-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* <button className="p-1.5 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
                              <Heart className="h-3.5 w-3.5" />
                            </button>
                            <button className="p-1.5 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
                              <Share2 className="h-3.5 w-3.5" />
                            </button> */}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Barra de ações fixada na parte inferior */}
              <div className="sticky bottom-0 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 p-4 flex justify-center items-center">
                {/* <div className="text-sm text-gray-400 flex items-center">
                  <Compass className="h-4 w-4 mr-2 text-brand-500" />
                  <span>Navegando: {verseData.livro} {verseData.capitulo}</span>
                </div> */}
                
                <div className="flex space-x-2">
                  {hasReadToday === false && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleRegisterReading}
                      className="px-4 py-2 bg-gradient-to-r from-brand-600 to-brand-700 hover:to-brand-600 text-white rounded-lg font-medium text-sm flex items-center shadow-lg shadow-brand-900/30 transition-all"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Marcar como lido
                    </motion.button>
                  )}
                  
                  {hasReadToday === true && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled
                      className="px-4 py-2 bg-green-900/40 text-green-400 rounded-lg font-medium text-sm flex items-center cursor-not-allowed"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Leitura registrada
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </ModalNew>
        )}
      </AnimatePresence>
    </>
  );
};


export default BibleVerseOfTheDay;
                      