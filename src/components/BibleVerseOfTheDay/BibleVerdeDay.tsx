import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { biblicalService } from "../../services/biblicalService";
import { Book, ChevronRight, Calendar, Star, Heart, Share2, X } from "lucide-react";
import { Modal } from "../ui/modal";


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


// Componente Modal
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const ModalNew = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;


  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 15 }}
          className="relative w-full max-w-3xl max-h-[80vh] overflow-y-auto bg-gray-900 rounded-xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </motion.div>
      </motion.div>
    </Modal>
  );
};


// Componente principal
const BibleVerseOfTheDay = () => {
  const [verseData, setVerseData] = useState<BibleChapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, _setActiveTab] = useState('verses');
//  const [isFavorited, setIsFavorited] = useState(false);
//  const [isBookmarked, setIsBookmarked] = useState(false);


  useEffect(() => {
    const fetchVerseOfTheDay = async () => {
      try {
        const response = await biblicalService.bibleChapterDay();
        setVerseData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };


    fetchVerseOfTheDay();
  }, []);


  const handleClose = () => {
    setIsModalOpen(false);
  };


  // // Agrupar versículos em pares para layout visual no modal
  // const getGroupedVerses = () => {
  //   if (!verseData?.verses) return [];
  //   const grouped = [];
  //   for (let i = 0; i < verseData.verses.length; i += 2) {
  //     grouped.push(verseData.verses.slice(i, i + 2));
  //   }
  //   return grouped;
  // };


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
    "radial-gradient(circle at 10% 20%, rgb(69, 86, 102) 0%, rgb(34, 34, 34) 90%)",
    "linear-gradient(109.6deg, rgb(36, 45, 57) 11.2%, rgb(16, 37, 60) 51.2%, rgb(0, 0, 0) 98.6%)",
    "linear-gradient(to right, rgb(29, 78, 216), rgb(30, 64, 175), rgb(17, 24, 39))"
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
      {/* Card do Versículo do Dia - Redesenhado */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="overflow-hidden rounded-2xl bg-gray-900 shadow-lg border border-gray-800 hover:shadow-xl transition-all duration-300">
          {/* Header com gradiente */}
          <div 
            className="p-6 relative" 
            style={{ background: randomBg }}
          >
            {/* Efeito de partículas (simulado com elementos absolutos) */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-white/10"
                  style={{
                    width: Math.random() * 8 + 2,
                    height: Math.random() * 8 + 2,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
            
            <div className="relative z-10 flex justify-between items-start">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-500/30 flex items-center justify-center mr-4">
                  <Book className="h-6 w-6 text-brand-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Versículo do Dia</h3>
                  <div className="flex items-center text-brand-300 text-sm">
                    <Calendar className="w-4 h-4 mr-1.5" />
                    <span>{verseData.livro} {verseData.capitulo}</span>
                  </div>
                </div>
              </div>
              
              {/* <div className="flex space-x-2">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isFavorited ? 'bg-pink-500/30 text-pink-400' : 'bg-gray-800/40 text-gray-400 hover:text-pink-400'}`}
                  onClick={() => setIsFavorited(!isFavorited)}
                >
                  <Heart className="w-4 h-4" fill={isFavorited ? "currentColor" : "none"} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isBookmarked ? 'bg-brand-500/30 text-brand-400' : 'bg-gray-800/40 text-gray-400 hover:text-brand-400'}`}
                  onClick={() => setIsBookmarked(!isBookmarked)}
                >
                  <Bookmark className="w-4 h-4" fill={isBookmarked ? "currentColor" : "none"} />
                </motion.button>
              </div> */}
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
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative"
            >
              <div className="absolute -left-2 top-0 text-4xl text-brand-700/30 font-serif">"</div>
              <p className="text-xl text-gray-300 pl-6 leading-relaxed italic">
                {firstVerse.texto}
              </p>
              <div className="absolute -right-2 bottom-0 text-4xl text-brand-700/30 font-serif">"</div>
            </motion.div>
            
            <motion.div 
              className="mt-8 flex flex-wrap justify-end items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {/* <div className="flex space-x-2 mb-4 sm:mb-0">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-800 text-gray-400 hover:bg-gray-700 transition-colors flex items-center"
                >
                  <Share2 className="w-3.5 h-3.5 mr-1.5" />
                  Compartilhar
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-800 text-gray-400 hover:bg-gray-700 transition-colors flex items-center"
                >
                  <Star className="w-3.5 h-3.5 mr-1.5" />
                  Reflexão
                </motion.button>
              </div> */}
              
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
          </div>
        </div>
      </motion.div>


      {/* Modal Completo */}
      <AnimatePresence>
        {isModalOpen && (
          <ModalNew isOpen={isModalOpen} onClose={handleClose}>
            <div className="relative">
              {/* Header */}
              <div className="sticky top-0 z-10 px-6 py-4 bg-gray-900 border-b border-gray-800 flex justify-between items-center">
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
              
{/*  
              <div className="px-6 pt-4 pb-2 flex border-b border-gray-800/80">
                           
                <button
                  onClick={() => setActiveTab('verses')}
                  className={`mr-4 pb-2 font-medium text-sm flex items-center ${
                    activeTab === 'verses' 
                      ? 'text-brand-400 border-b-2 border-brand-500' 
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <Book className="w-4 h-4 mr-1.5" />
                  Versículos
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`mr-4 pb-2 font-medium text-sm flex items-center ${
                    activeTab === 'notes' 
                      ? 'text-brand-400 border-b-2 border-brand-500' 
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <Star className="w-4 h-4 mr-1.5" />
                  Comentários
                </button>
              </div>
             */}

              {/* Conteúdo da Tab */}
              <div className="p-6">
                {activeTab === 'verses' && (
                  <div className="space-y-6">
                    {/* Cabeçalho com tema do capítulo */}
                    <div className="mb-8 p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg border border-gray-800">
                      <h4 className="text-lg font-bold text-white mb-2 flex items-center">
                        <Star className="w-5 h-5 mr-2 text-yellow-500" />
                        Tema do Capítulo
                      </h4>
                      {/* <p className="text-gray-300">{verseData.livro} {verseData.capitulo} nos ensina sobre a importância da fé e como Deus está sempre conosco, mesmo nos momentos mais difíceis.</p> */}
                        <p className="text-gray-300">{verseData.livro} {verseData.capitulo} {randomMessage}</p>
                    </div>
                    
                    {/* Versículos */}
                    <div className="space-y-6">
                      {verseData.verses.map((verse) => (
                        <motion.div
                          key={verse.numero}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: verse.numero * 0.03 }}
                          className="group"
                        >
                          <div className="flex">
                            <div className="flex-shrink-0 mr-4 pt-1 flex items-center justify-center">
                              <span className="inline-block w-8 h-8 rounded-lg bg-gray-800 text-gray-400 flex items-center justify-center text-sm font-mono group-hover:bg-brand-900/40 group-hover:text-brand-400 transition-colors">
                                {verse.numero}
                              </span>
                            </div>



                            <div className="flex-grow">
                              <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors">
                                {verse.texto}
                              </p>
                              <div className="mt-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="text-xs text-gray-500 hover:text-gray-300 flex items-center">
                                  <Heart className="w-3 h-3 mr-1" />
                                  Favoritar
                                </button>
                                <button className="text-xs text-gray-500 hover:text-gray-300 flex items-center">
                                  <Share2 className="w-3 h-3 mr-1" />
                                  Compartilhar
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab === 'notes' && (
                  <div className="space-y-6">
                    <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                      <h4 className="text-md font-semibold text-white mb-3">Comentários do Pastor</h4>
                      <p className="text-gray-300">Este capítulo nos ensina sobre perseverança e fé. A história mostra como devemos confiar em Deus mesmo quando enfrentamos desafios que parecem impossíveis.</p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-brand-900/20 border border-brand-800/50">
                      <h4 className="text-md font-semibold text-white mb-3">Para Refletir</h4>
                      <ul className="space-y-3">
                        <li className="flex">
                          <div className="flex-shrink-0 mr-2 mt-1">
                            <div className="w-4 h-4 rounded-full bg-brand-900 border border-brand-700"></div>
                          </div>
                          <p className="text-gray-300 text-sm">Como você pode aplicar esta passagem na sua vida diária?</p>
                        </li>
                        <li className="flex">
                          <div className="flex-shrink-0 mr-2 mt-1">
                            <div className="w-4 h-4 rounded-full bg-brand-900 border border-brand-700"></div>
                          </div>
                          <p className="text-gray-300 text-sm">Qual versículo mais chamou sua atenção e por quê?</p>
                        </li>
                        <li className="flex">
                          <div className="flex-shrink-0 mr-2 mt-1">
                            <div className="w-4 h-4 rounded-full bg-brand-900 border border-brand-700"></div>
                          </div>
                          <p className="text-gray-300 text-sm">Compartilhe com seus amigos o que você aprendeu!</p>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="text-md font-semibold text-white mb-3">Adicione sua anotação</h4>
                      <textarea
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:border-brand-500 focus:ring focus:ring-brand-500/20 outline-none transition-all"
                        rows={3}
                        placeholder="Escreva suas reflexões sobre este capítulo..."
                      ></textarea>
                      <div className="mt-2 flex justify-end">
                        <button className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-sm transition-colors">
                          Salvar anotação
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Footer */}
              <div className="sticky bottom-0 bg-gray-900 border-t border-gray-800 p-4 flex justify-end">
                {/* <div className="flex space-x-2">
                  <button className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white">
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div> */}
                
                <div className="flex space-x-3">
                  <button 
                    className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700 transition-colors"
                    onClick={handleClose}
                  >
                    Fechar
                  </button>
                  <button onClick={handleClose} className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-sm transition-colors">
                    Marcar como Lido
                  </button>
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

































// import { useState, useEffect } from "react";
// import Card from "../../components/ui/Card/Card";
// import Button from "../../components/ui/button/Button";
// import { motion, AnimatePresence } from "framer-motion";
// import { biblicalService } from "../../services/biblicalService";
// import { Modal } from "../ui/modal";


// interface BibleVerse {
//   numero: number;
//   texto: string;
// }

// interface BibleChapter {
//   dia: number;
//   livro: string;
//   capitulo: number;
//   verses: BibleVerse[]
// }

// const BibleVerseOfTheDay = () => {
//   const [verseData, setVerseData] = useState<BibleChapter | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);


//   useEffect(() => {
//     const fetchVerseOfTheDay = async () => {
//       try {
//         const response = await biblicalService.bibleChapterDay();
//         setVerseData(response);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Erro desconhecido");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVerseOfTheDay();
//   }, []);

//   const handleClose = () => {
//     setIsModalOpen(false)
//   }


//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
//       </div>
//     );
//   }


//   if (error) {
//     return (
//       <Card color="error" variant="light">
//         <p className="text-center">{error}</p>
//       </Card>
//     );
//   }


//   if (!verseData) {
//     return null;
//   }


//   const firstVerse = verseData.verses[0];

//   return (
//     <>
//       {/* Card do Versículo do Dia */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="mb-8"
//       >
//         <Card variant="light" color="primary" size="md">
//           <div className="flex flex-col md:flex-row gap-6">
//             <div className="flex-shrink-0">
//               <svg
//                 className="w-16 h-16 text-brand-500"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={1.5}
//                   d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
//                 />
//               </svg>
//             </div>
//             <div className="flex-grow">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h3 className="text-xl font-bold text-gray-800 dark:text-white/90 mb-2">
//                     Versículo do Dia
//                   </h3>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">
//                     {verseData.livro} {verseData.capitulo}:{firstVerse.numero}
//                   </p>
//                 </div>
//                 <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-brand-100 text-brand-800 dark:bg-brand-900/30 dark:text-brand-400">
//                   Dia {verseData.dia}
//                 </span>
//               </div>
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.3, duration: 0.5 }}
//                 className="mt-4"
//               >
//                 <p className="text-lg italic text-gray-700 dark:text-gray-300">
//                   "{firstVerse.texto}"
//                 </p>
//               </motion.div>
//               <div className="mt-6 text-right">
//                 <Button
//                   size="sm"
//                   onClick={() => setIsModalOpen(true)}
//                   className="bg-brand-500 hover:bg-brand-600"
//                 >
//                   Ler capítulo completo
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </Card>
//       </motion.div>


//       {/* Modal */}
//       <AnimatePresence>
//         {isModalOpen && (
//            <Modal isOpen={isModalOpen} onClose={handleClose} className="max-w-[700px] m-4">
//               <p></p>                
//             </Modal>
//         )}
//       </AnimatePresence>
//     </>
//   );
// };


// export default BibleVerseOfTheDay;
