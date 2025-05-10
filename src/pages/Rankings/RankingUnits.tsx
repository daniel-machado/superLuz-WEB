import { useEffect, useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { Loader2, Award, List } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmDeleteEvaUnitModal from "../../components/EvaluationUnitComponents/ConfirmDeleteEvaUnitModal";
import { rankingUnitService } from "../../services/rankingUnitService";
import { RankUnitDetailModal } from "./components/RankUnitDetailModal";
import Podium from "./components/Podium";
import RankingList from "./components/RankingList";
import TableView from "./components/TableView";
import { AnimatedBackground, AnimatedBackgroundStars, AnimatedConfetti } from './components/animatedBackgroungGroup';
import AnimatedBackgroundOficial from "./components/AnimatedBackgroundOficial";
import AnimatedBackgroundStarsOficial from "./components/AnimatedBackgroundStarsOficial";
import AnimatedBrushesOficial from "./components/AnimatedBrusheOficial";

interface UnitRank {
  unitId: string;
  totalScore: string;
  correctAnswers: string;
  wrongAnswers: string;
  unitRank: {
    name: string;
    photo: string;
  };
}

export default function RankingUnits() {
  const [ranking, setRanking] = useState<UnitRank[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRanking, setSelectedRanking] = useState<UnitRank | null>(null);
  const [activeTab, setActiveTab] = useState("podium"); // "podium" or "table"
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [showSpotlight, setShowSpotlight] = useState(false);
  
  const rankingContainerRef = useRef<HTMLDivElement>(null);

  const fetchRanking = async () => {
    setIsLoading(true);
    try {
      const data = await rankingUnitService.listRanking();
      setRanking(data);
    } catch (err) {
      toast.error("Erro ao carregar ranking", {position: 'bottom-right'});
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRanking();
  }, []);

  // Get top 3 and rest
  const topThree = ranking.slice(0, 3);
  const restOfRanking = ranking.slice(3);

  // Handle opening unit details
  const handleOpenDetail = (unit: UnitRank) => {
    setSelectedRanking(unit);
    setIsDetailModalOpen(true);
  };

  // Animation variants for tab switch
  const tabVariants = {
    hidden: (direction: string) => ({
      x: direction === "right" ? 500 : -500,
      opacity: 0
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: (direction: string) => ({
      x: direction === "right" ? -500 : 500,
      opacity: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    })
  };

  // Tab swipe handler
  const handleSwipe = (direction: number) => {
    if (direction > 0 && activeTab === "podium") {
      setActiveTab("table");
      
    } else if (direction < 0 && activeTab === "table") {
      setActiveTab("podium");
    }
  };

  // Ativar os holofotes após um tempo para efeito dramático
  useEffect(() => {
    if (activeTab === "podium") {
      const timer = setTimeout(() => {
        setShowSpotlight(true);
      }, 1000);
      
      return () => {
        clearTimeout(timer);
        setShowSpotlight(false);
      };
    }
  }, [activeTab]);
  
  // Detectar primeira renderização para animação inicial
  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
    }
  }, []);

  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >    
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-4 flex flex-col sm:flex-row justify-between items-center"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-0">Ranking de Unidades</h1>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-4">
        <div className="bg-gray-800 bg-opacity-70 rounded-full p-1 flex shadow-lg">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("podium")}
            className={`flex items-center px-4 py-2 rounded-full transition-all ${
              activeTab === "podium" 
                ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white" 
                : "text-gray-300 hover:text-white"
            }`}
          >
            <Award className="w-5 h-5 mr-2" />
            Pódio
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("table")}
            className={`flex items-center px-4 py-2 rounded-full transition-all ${
              activeTab === "table" 
                ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white" 
                : "text-gray-300 hover:text-white"
            }`}
          >
            <List className="w-5 h-5 mr-2" />
            Tabela
          </motion.button>
        </div>
      </div>

      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center w-full h-64"
        >
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin dark:text-blue-400" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando ranking...</p>
        </motion.div>
      ) : (
        <motion.div 
          ref={rankingContainerRef}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (Math.abs(info.offset.x) > 100) {
              handleSwipe(info.offset.x);
            }
          }}
          className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl"
        >
          <AnimatePresence mode="wait" initial={isFirstRender}>
            {activeTab === "podium" ? (
              <motion.div
                key="podium-view"
                custom="right"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={tabVariants}
                className="overflow-hidden rounded-lg shadow-xl bg-gray-800"
              >
                {/* Podium Section */}
                <motion.div className="relative px-4 pt-5 pb-5 sm:pb-5 overflow-hidden bg-gradient-to-b">
                  <AnimatedBackground />
                  <AnimatedBackgroundStars />
                  <AnimatedConfetti />
                  <AnimatedBackgroundOficial/>
                  <AnimatedBackgroundStarsOficial />
                  <AnimatedBrushesOficial />

                  {/* Holofotes para efeito dramático */}
                  {showSpotlight && (
                    <>
                      <motion.div 
                        className="absolute left-1/4 -top-10 w-32 h-80 bg-yellow-400 opacity-10 blur-xl"
                        initial={{ opacity: 0 }}
                        animate={{ 
                          opacity: [0, 0.1, 0.08],
                          rotate: [-10, -5]
                        }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                      />
                      
                      <motion.div 
                        className="absolute right-1/4 -top-10 w-32 h-80 bg-yellow-400 opacity-10 blur-xl"
                        initial={{ opacity: 0 }}
                        animate={{ 
                          opacity: [0, 0.1, 0.08],
                          rotate: [10, 5]
                        }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
                      />
                    </>
                  )}
                
                  <Podium topThree={topThree} handleOpenDetail={handleOpenDetail} />
                  
                </motion.div>
              
                {/* List of other rankings */}
                <RankingList
                  rankings={restOfRanking}
                  handleOpenDetail={handleOpenDetail}
                />
              </motion.div>
            ) : (
              <motion.div
                key="table-view"
                custom="left"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={tabVariants}
                className="overflow-hidden rounded-lg shadow-xl bg-gray-800"
              >
                {/* Table View */}
                <div className="relative overflow-hidden">
                  <AnimatedBackground />
                  <AnimatedBackgroundStars />
                  <AnimatedConfetti />
                  <AnimatedBackgroundOficial/>
                  <AnimatedBackgroundStarsOficial />
                  
                  <div className="p-4 relative z-10">
                    <TableView 
                      ranking={ranking} 
                      handleOpenDetail={handleOpenDetail} 
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Swipe Indicator - only on mobile */}
      <div className="mt-4 text-center text-gray-400 text-sm md:hidden">
        <motion.div 
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Arraste para {activeTab === "podium" ? "ver tabela" : "ver pódio"}
        </motion.div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {isDetailModalOpen && selectedRanking && (
          <RankUnitDetailModal
            unit={selectedRanking}
            onClose={() => setIsDetailModalOpen(false)}
          />
        )}
      </AnimatePresence>
  
      {/* Delete Modal */}
      {isDeleteModalOpen && selectedRanking && (
        <ConfirmDeleteEvaUnitModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirmDelete={() => {}}
        />
      )}
    </motion.div>
  );
}
























































// import { useEffect, useState } from "react";
// import { toast } from "react-hot-toast";
// import { Loader2, Download } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import ConfirmDeleteEvaUnitModal from "../../components/EvaluationUnitComponents/ConfirmDeleteEvaUnitModal";
// import { rankingUnitService } from "../../services/rankingUnitService";
// import AnimatedBackground from '../Rankings/components/AnimatedBackground'
// import { RankUnitDetailModal } from "./components/RankUnitDetailModal";
// import { exportToImage } from "./Utils/ExportToImage";
// import Podium from "./components/Podium";
// import RankingList from "./components/RankingList";
// import AnimatedBackgroundStars from "./components/AnimatedBackgroundStars";

// interface UnitRank {
//   unitId: string;
//   totalScore: string;
//   correctAnswers: string;
//   wrongAnswers: string;
//   unitRank: {
//     name: string;
//     photo: string;
//   };
// }

// export default function RankingUnits() {
//   const [ranking, setRanking] = useState<UnitRank[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
//   const [isExportModalOpen, setIsExportModalOpen] = useState(false);
//   const [selectedRanking, setSelectedRanking] = useState<UnitRank | null>(null);
//   const [exportLoading, setExportLoading] = useState(false);

//   const fetchRanking = async () => {
//     setIsLoading(true);
//     try {
//       const data = await rankingUnitService.listRanking();
//       setRanking(data);
//     } catch (err) {
//       toast.error("Erro ao carregar ranking", {position: 'bottom-right'});
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRanking();
//   }, []);
  
  
//   // Get top 3 and rest
//   const topThree = ranking.slice(0, 3);
//   const restOfRanking = ranking.slice(3);
  
//   // Handle export image
//   const handleExportImage = async () => {
//     setExportLoading(true);
//     try {
//       await exportToImage();
//     } finally {
//       setExportLoading(false);
//     }
//   };
  
//   // Handle opening unit details
//   const handleOpenDetail = (unit: UnitRank) => {
//     setSelectedRanking(unit);
//     setIsDetailModalOpen(true);
//   };
  
//   return (
//     <motion.div className="w-full max-w-4xl mx-auto p-4">    
//       <motion.div
//         initial={{ y: -20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         className="mb-4 flex flex-col sm:flex-row justify-between items-center"
//       >
//         <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-0">Ranking de Unidades</h1>
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={handleExportImage}
//           disabled={isLoading || exportLoading}
//           className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 font-medium text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50 shadow-md shadow-blue-900/30"
//         >
//           {exportLoading ? (
//             <Loader2 className="w-4 sm:w-5 h-4 sm:h-5 mr-2 animate-spin" />
//           ) : (
//             <Download className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
//           )}
//           Exportar Imagem
//         </motion.button>
//       </motion.div>

//       {isLoading ? (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="flex flex-col items-center justify-center w-full h-64"
//         >
//           <Loader2 className="w-10 h-10 text-blue-600 animate-spin dark:text-blue-400" />
//           <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando ranking...</p>
//         </motion.div>
//       ) : (
//         <motion.div
//           id="ranking-container"
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.5 }}
//           className="overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800"
//         >
//           {/* Podium Section */}
//           <motion.div className="relative px-4 pt-5 pb-5 sm:pb-5 overflow-hidden bg-gradient-to-b">
//             <AnimatedBackground />
//             <AnimatedBackgroundStars />
            
//             <Podium topThree={topThree} handleOpenDetail={handleOpenDetail} />

//           </motion.div>
          
//           {/* List of other rankings */}
//           <RankingList 
//             rankings={restOfRanking} 
//             handleOpenDetail={handleOpenDetail} 
//           />
//         </motion.div>
//       )}


//       {/* Detail Modal */}
//       <AnimatePresence>
//         {isDetailModalOpen && selectedRanking && (
//           <RankUnitDetailModal
//             unit={selectedRanking}
//             onClose={() => setIsDetailModalOpen(false)}
//           />
//         )}
//       </AnimatePresence>
          
//       {/* Delete Modal */}
//       {isDeleteModalOpen && selectedRanking && (
//         <ConfirmDeleteEvaUnitModal
//           isOpen={isDeleteModalOpen}
//           onClose={() => setIsDeleteModalOpen(false)}
//           //onConfirmDelete={handleDeleteRanking}
//           onConfirmDelete={() => {}}
//         />
//       )}
          
//       {/* Instagram Export Modal */}
//       {/* <AnimatePresence>
//         {isExportModalOpen && (
//           <ExportStoryModal
//             ranking={ranking.map(unit => ({
//               ...unit,
//               totalScore: parseFloat(unit.totalScore),
//             }))}
//             isOpen={isExportModalOpen}
//             onClose={() => setIsExportModalOpen(false)}
//           />
//         )}
//       </AnimatePresence> */}
//     </motion.div>
//   );
// }





























































































// import { useEffect, useState } from "react";
// import { toast } from "react-hot-toast";
// import { 
//   Loader2, 
//   Crown, 
//   ChevronDown, 
//   ChevronUp, 
//   TrendingUp, 
//   TrendingDown, 
//   Minus, 
//   Share2, 
//   Info, 
//   ChevronLeft, 
//   Instagram,
//   Trophy,
//   Medal,
//   Download,
//   ChevronRight,
//   X
// } from "lucide-react";

// import { motion, AnimatePresence } from "framer-motion";
// import ConfirmDeleteEvaUnitModal from "../../components/EvaluationUnitComponents/ConfirmDeleteEvaUnitModal";
// import { rankingUnitService } from "../../services/rankingUnitService";

// import AnimatedBackground from '../Rankings/components/AnimatedBackground'
// import AnimatedBackgroundNew from '../Rankings/components/AnimatedBackgroundNew'
// import ExportStoryModal from "./components/ExportStoryModal";
// import { RankUnitDetailModal } from "./components/RankUnitDetailModal";
// import { exportToImage } from "./Utils/ExportToImage";

// interface UnitRank {
//   unitId: string;
//   totalScore: string;
//   correctAnswers: string;
//   wrongAnswers: string;
//   unitRank: {
//     name: string;
//     photo: string;
//   };
// }

// export default function RankingUnits() {
//   const [ranking, setRanking] = useState<UnitRank[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
//   const [isExportModalOpen, setIsExportModalOpen] = useState(false);
//   const [selectedRanking, setSelectedRanking] = useState<UnitRank | null>(null);
//   //const [exportLoading, setExportLoading] = useState(false);

//   const fetchRanking = async () => {
//     setIsLoading(true);
//     try {
//       const data = await rankingUnitService.listRanking();
//       setRanking(data);
//     } catch (err) {
//       toast.error("Erro ao carregar ranking", {position: 'bottom-right'});
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRanking();
//   }, []);
  
//   const handleOpenDetail = (unit: UnitRank) => {
//     setSelectedRanking(unit);
//     setIsDetailModalOpen(true);
//   };

//   // Animação constante para o primeiro lugar
//   const pulseAnimation = {
//     scale: [1, 1.05, 1],
//     boxShadow: [
//       "0 10px 15px -3px rgba(2, 255, 171, 0.3)", // Verde com opacidade 0.3
//       "0 20px 25px -5px rgba(2, 255, 171, 0.4)", // Verde com opacidade 0.4
//       "0 10px 15px -3px rgba(2, 255, 171, 0.3)", // Verde com opacidade 0.3
//     ],
//     transition: {
//       duration: 2,
//       ease: "easeInOut",
//       repeat: Infinity,
//       repeatType: "loop" as const,
//     },
//   };
  
//   // Get top 3 and rest
//   const topThree = ranking.slice(0, 3);
//   const restOfRanking = ranking.slice(3);
  
//   const getTrendIcon = (index: number, position: number | null) => {
//     if (position === 0) return <TrendingUp className="text-green-400" size={16} />;
//     if (position === 1) return <Minus className="text-yellow-400" size={16} />;
//     if (position === 2) return <TrendingDown className="text-red-400" size={16} />;
    
//     // For rest of ranking, show a semi-random trend
//     const patterns = [
//       [0, 1, 2, 1, 0, 2, 1, 0],
//       [1, 0, 2, 0, 1, 2, 0, 1],
//       [2, 1, 0, 2, 1, 0, 2, 1]
//     ];
    
//     const patternIndex = index % patterns.length;
//     const positionInPattern = index % patterns[patternIndex].length;
//     const trend = patterns[patternIndex][positionInPattern];
    
//     if (trend === 0) return <TrendingUp className="text-green-400" size={16} />;
//     if (trend === 1) return <Minus className="text-yellow-400" size={16} />;
//     return <TrendingDown className="text-red-400" size={16} />;
//   };

//   // Cores para os pódios
//   const podiumColors = [
//     "bg-gradient-to-t from-yellow-600 to-yellow-400", // 1º lugar
//     "bg-gradient-to-t from-gray-400 to-gray-300",     // 2º lugar
//     "bg-gradient-to-t from-amber-700 to-amber-500"    // 3º lugar
//   ];
  
//   // Animações para o pódio
//   const podiumAnimations = [
//     {
//       height: "h-28",
//       initial: { height: 0, opacity: 0 },
//       animate: { height: "7rem", opacity: 1 },
//       transition: { duration: 0.8, delay: 0.3 },
//     },
//     {
//       height: "h-20",
//       initial: { height: 0, opacity: 0 },
//       animate: { height: "5rem", opacity: 1 },
//       transition: { duration: 0.8, delay: 0.5 },
//     },
//     {
//       height: "h-16",
//       initial: { height: 0, opacity: 0 },
//       animate: { height: "4rem", opacity: 1 },
//       transition: { duration: 0.8, delay: 0.7 },
//     },
//   ];
  
//   return (
//     <motion.div className="w-full max-w-3xl mx-auto p-4">
//       <motion.div 
//         initial={{ y: -20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         className="mb-4 flex justify-between items-center"
//       >
//         <h1 className="text-3xl font-bold text-white">Ranking de Unidades</h1>
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={exportToImage}
//           disabled={isLoading}
//           className="inline-flex items-center px-6 py-3 font-medium text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50 shadow-md shadow-blue-900/30"
//         >
//           {/* {exportLoading ? (
//             <Loader2 className="w-5 h-5 mr-2 animate-spin" />
//           ) : (
//             <Download className="w-5 h-5 mr-2" />
//           )} */}
//           <Download className="w-5 h-5 mr-2" />
//           Exportar Imagem
//         </motion.button>
//       </motion.div>

//       {isLoading ? (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }} 
//           className="flex flex-col items-center justify-center w-full h-64"
//         >
//           <Loader2 className="w-10 h-10 text-blue-600 animate-spin dark:text-blue-400" />
//           <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando ranking...</p>
//         </motion.div>
//       ) : (
//         <motion.div 
//           id="ranking-container" 
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.5 }}
//           className="overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
//           {/* Podium Section */}
//           <motion.div className="relative px-4 pt-8 pb-5 overflow-hidden bg-gradient-to-b">
//           {/* <div className="relative px-4 pt-8 pb-16 overflow-hidden bg-gradient-to-b from-blue-500 to-blue-700 dark:from-blue-700 dark:to-blue-900"> */}
//             {/* Animated background */}
//             <AnimatedBackground />
//             <AnimatedBackgroundNew />
            
//             <motion.h2 
//               className="relative z-10 mb-35 text-2xl font-bold text-center text-white"
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 }}
//             >
//               Pódio das unidades
//             </motion.h2>
            
//             <motion.div className="relative z-10 flex items-end justify-center gap-4 h-52 mb-8">
//               {/* Second Place */}
//               {topThree[1] ? (
//                 <motion.div
//                   initial={{ opacity: 0, y: 50 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.4 }}
//                   className="flex flex-col items-center"
//                   onClick={() => handleOpenDetail(topThree[1])}
//                 >
//                   <div className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white rounded-full">2</div>
//                   {/* <div className="flex items-center justify-center w-6 h-6 mb-2 text-xs font-bold text-white bg-blue-400 rounded-full">2</div> */}
//                   <motion.div>
//                     <ChevronUp className="w-8 h-8" strokeWidth={1.5} fill="rgb(2, 255, 171)" color="rgb(2, 255, 171)"/>
//                   </motion.div>
//                   <motion.div className="relative w-16 h-16 mb-2 overflow-hidden rounded-full ring-2 ring-green-300">
//                     {topThree[1].unitRank.photo ? (
//                       <img 
//                         src={topThree[1].unitRank.photo} 
//                         alt={topThree[1].unitRank.name} 
//                         className="object-cover w-full h-full"
//                       />
//                     ) : (
//                       <motion.div className="flex items-center justify-center w-full h-full text-xl font-bold text-white bg-blue-500">
//                         {topThree[1].unitRank.name.charAt(0)}
//                       </motion.div>
//                     )}
//                     {/* <motion.div className="absolute bottom-0 left-0 flex items-center justify-center w-4 h-4 text-white rounded-full -mb-1 -ml-1 bg-blue-600 shadow-md">
//                       <TrendingUp size={12} /> 
//                       {getTrendIcon(1, 1)}
//                     </motion.div> */}
//                   </motion.div>
//                   <p className="text-xs font-medium text-center text-white truncate w-20">{topThree[1].unitRank.name}</p>
//                   <motion.div className="flex items-center px-3 py-1 mt-1 text-xs font-bold text-blue-800 bg-white rounded-full">
//                     {topThree[1].totalScore}
//                   </motion.div>

//                   {/* <div className="w-20 h-16 mt-2 rounded-t-md bg-blue-600/80"></div> */}
//                      {/* Podium */}
//                   <motion.div 
//                     className={`w-24 rounded-t-lg ${podiumColors[1]} shadow-lg`}
//                     {...podiumAnimations[1]}
//                   ></motion.div>
//                 </motion.div>
//               ) : null}
              
//               {/* First Place */}
//               {topThree[0] ? (
//                 <motion.div
//                   initial={{ opacity: 0, y: 50 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   whileHover={{ scale: 1.05 }}
//                   transition={{ delay: 0.3 }}
//                   className="flex flex-col items-center z-10"
//                   onClick={() => handleOpenDetail(topThree[0])}
//                 >

//                   {/* <div className="flex items-center justify-center w-8 h-8 mb-2 text-sm font-bold text-white bg-yellow-500 rounded-full">1</div> */}
//                   <div className="flex items-center justify-center w-8 h-8 mb-2 text-sm font-bold text-white">1</div>
//                   <motion.div>
//                         {/* <motion.div animate={pulseAnimation}> */}
//                     <Crown className="w-8 h-8 text-yellow-400" strokeWidth={1.5} fill="rgba(250, 204, 21, 0.5)" />
//                   </motion.div>
                  
//                   <motion.div
//                     //className="relative w-24 h-24 mb-2 overflow-hidden rounded-full ring-10 ring-green-300"
//                     className="relative"
//                     whileHover={{ scale: 1.05 }}
//                     // animate={{
//                     //   scale: [1, 1.05, 1],
//                     //   boxShadow: [
//                     //     '0 0 0 0 rgba(2, 255, 171, 0.4)', // Verde com opacidade 0.4
//                     //     '0 0 0 10px rgba(2, 255, 171, 0.2)', // Verde com opacidade 0.2
//                     //     '0 0 0 20px rgba(2, 255, 171, 0.1)', // Verde com opacidade 0.1
//                     //     '0 0 0 0 rgba(2, 255, 171, 0)' // Verde com opacidade 0
//                     //   ],
//                     // }}
//                     transition={{
//                       duration: 2,
//                       ease: "easeInOut",
//                       repeat: Infinity,
//                       repeatType: "loop",
//                     }}
//                     style={{ borderColor: 'green' }}
//                   >

//                     {/* <motion.div
//                       className="absolute inset-0 -z-10 rounded-full bg-yellow-400/30 blur-md"
//                       animate={{
//                         scale: [1, 1.2, 1],
//                         opacity: [0.3, 0.6, 0.3],
//                       }}
//                       transition={{
//                         duration: 3,
//                         repeat: Infinity,
//                         repeatType: "loop",
//                       }}
//                     /> */}
//                     {topThree[0].unitRank.photo ? (
//                       <img 
//                         src={topThree[0].unitRank.photo} 
//                         alt={topThree[0].unitRank.name} 
//                         className="object-cover w-full h-full"
//                       />
//                     ) : (
//                       <motion.div className="flex items-center justify-center w-full h-full text-3xl font-bold text-white bg-blue-600">
//                         {topThree[0].unitRank.name.charAt(0)}
//                       </motion.div>
//                     )}
//                   </motion.div>
//                   <p className="text-sm font-medium text-center text-white truncate w-24">{topThree[0].unitRank.name}</p>
//                   <motion.div className="flex items-center px-4 py-1 mt-1 text-sm font-bold text-blue-800 bg-white rounded-full">
//                     {topThree[0].totalScore}
//                   </motion.div>
          
//                     {/* Glow effect behind avatar */}
//                     {/* <motion.div
//                       className="absolute inset-0 -z-10 rounded-full bg-yellow-400/30 blur-md"
//                       animate={{
//                         scale: [1, 1.2, 1],
//                         opacity: [0.3, 0.6, 0.3],
//                       }}
//                       transition={{
//                         duration: 3,
//                         repeat: Infinity,
//                         repeatType: "loop",
//                       }}
//                     /> */}

//                      {/* Podium */}
//                   <motion.div 
//                   className={`w-28 rounded-t-lg ${podiumColors[0]} shadow-lg`}
//                   {...podiumAnimations[0]}
//                 ></motion.div>
//                 </motion.div>
//               ) : null}
              
//               {/* Third Place */}
//               {topThree[2] ? (
//                 <motion.div
//                   initial={{ opacity: 0, y: 50 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.5 }}
//                   className="flex flex-col items-center"
//                   onClick={() => handleOpenDetail(topThree[2])}
//                 >
//                   {/* <div className="flex items-center justify-center w-6 h-6 mb-2 text-xs font-bold text-white bg-orange-400 rounded-full">3</div> */}
//                   <motion.div className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white rounded-full">3</motion.div>
//                   <motion.div>
//                     <ChevronDown className="w-8 h-8" strokeWidth={1.5} fill="rgb(255, 255, 255)" color="rgb(255, 255, 255)" />
//                   </motion.div>
//                   <motion.div className="relative w-16 h-16 mb-2 overflow-hidden rounded-full ring-2 ring-green-300">
//                     {topThree[2].unitRank.photo ? (
//                       <img 
//                         src={topThree[2].unitRank.photo} 
//                         alt={topThree[2].unitRank.name} 
//                         className="object-cover w-full h-full"
//                       />
//                     ) : (
//                       <motion.div className="flex items-center justify-center w-full h-full text-xl font-bold text-white bg-blue-500">
//                         {topThree[2].unitRank.name.charAt(0)}
//                       </motion.div>
//                     )}
//                     <motion.div className="absolute -bottom-1 -right-1 flex items-center justify-center w-6 h-6 text-white rounded-full bg-red-600 shadow-md">
//                         {getTrendIcon(2, 2)}
//                       </motion.div>
//                   </motion.div>
//                   <p className="text-xs font-medium text-center text-white truncate w-20">{topThree[2].unitRank.name}</p>
//                   <motion.div className="flex items-center px-3 py-1 mt-1 text-xs font-bold text-blue-800 bg-white rounded-full">
//                     {topThree[2].totalScore}
//                   </motion.div>
                
//                      {/* Podium */}
//                   <motion.div 
//                   className={`w-22 rounded-t-lg ${podiumColors[2]} shadow-lg`}
//                   {...podiumAnimations[2]}
//                 ></motion.div>
//                   </motion.div>
//               ) : null}
//             </motion.div>
//           </motion.div>
          
//           {/* List of other rankings */}
//           <motion.div className="p-4">
//             {/* <h3 className="mb-4 text-lg font-medium text-gray-700 dark:text-gray-300">Outras Posições</h3> */}
            
//             <motion.div className="space-y-3">
//               <AnimatePresence>
//                 {restOfRanking.map((unit, index) => (
//                   <motion.div
//                     key={unit.unitId}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     exit={{ opacity: 0, x: 20 }}
//                     transition={{ delay: index * 0.1 }}
//                     whileHover={{ scale: 1.02 }}
//                     className="flex items-center p-3 transition-colors bg-white border rounded-lg cursor-pointer dark:border-gray-700 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-700/50"
//                     onClick={() => handleOpenDetail(unit)}
//                   >
//                     <motion.div className="flex items-center justify-center w-8 h-8 mr-3 text-sm font-bold text-gray-700 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300">
//                       {index + 4}
//                     </motion.div>
                    
//                     <motion.div className="relative w-10 h-10 mr-3 overflow-hidden rounded-full">
//                       {unit.unitRank.photo ? (
//                         <img 
//                           src={unit.unitRank.photo} 
//                           alt={unit.unitRank.name} 
//                           className="object-cover w-full h-full"
//                         />
//                       ) : (
//                         <motion.div className="flex items-center justify-center w-full h-full text-sm font-bold text-white bg-blue-600">
//                           {unit.unitRank.name.charAt(0)}
//                         </motion.div>
//                       )}
//                     </motion.div>
                    
//                     <motion.div className="flex-1 min-w-0">
//                       <p className="font-medium text-gray-800 truncate dark:text-white">{unit.unitRank.name}</p>
//                     </motion.div>
                    
//                     <motion.div className="flex items-center">
//                       <motion.div className="mr-2">{getTrendIcon(index, null)}</motion.div>
//                       <motion.div className="px-3 py-1 text-sm font-bold text-white bg-blue-600 rounded-full dark:bg-blue-700">
//                         {unit.totalScore}
//                       </motion.div>
//                     </motion.div>
//                   </motion.div>
//                 ))}
//               </AnimatePresence>
              
//               {restOfRanking.length === 0 && (
//                 <motion.div className="flex flex-col items-center justify-center p-8 text-gray-500 dark:text-gray-400">
//                   <p>Nenhuma outra unidade no ranking</p>
//                 </motion.div>
//               )}
//             </motion.div>
//           </motion.div>
//         </motion.div>
//       )}
      
//       {/* Detail Modal */}
//       <AnimatePresence>
//         {isDetailModalOpen && selectedRanking && (
//           <RankUnitDetailModal
//             unit={selectedRanking}
//             onClose={() => setIsDetailModalOpen(false)}
//           />
//         )}
//       </AnimatePresence>
      
//       {/* Delete Modal */}
//       {isDeleteModalOpen && selectedRanking && (
//         <ConfirmDeleteEvaUnitModal
//           isOpen={isDeleteModalOpen}
//           onClose={() => setIsDeleteModalOpen(false)}
//           //onConfirmDelete={handleDeleteRanking}
//           onConfirmDelete={() => {}}
//         />
//       )}
      
//       {/* Instagram Export Modal */}
//       <AnimatePresence>
//         {isExportModalOpen && (
//           <ExportStoryModal
//             ranking={ranking.map(unit => ({
//               ...unit,
//               totalScore: parseFloat(unit.totalScore),
//             }))}
//             isOpen={isExportModalOpen}
//             onClose={() => setIsExportModalOpen(false)}
//           />
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// }


















































// import { useEffect, useState } from "react";
// import { toast } from "react-hot-toast";
// import { 
//   Loader2, 
//   Crown, 
//   ChevronDown, 
//   ChevronUp, 
//   TrendingUp, 
//   TrendingDown, 
//   Minus, 
//   Share2, 
//   Info, 
//   ChevronLeft, 
//   Trophy,
//   Medal,
//   Download,
//   ChevronRight,
//   X
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import html2canvas from 'html2canvas';
// import { rankingUnitService } from "../../services/rankingUnitService";
// import { Unit } from "../../dtos/UnitDTO";



// // Componente para o detalhe de uma unidade
// interface RankUnitDetailModalProps {
//   unit: Ranking | null;
//   onClose: () => void;
// }

// const RankUnitDetailModal = ({ unit, onClose }: RankUnitDetailModalProps) => {
//   if (!unit) return null;
  
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         exit={{ opacity: 0, scale: 0.9 }}
//         className="relative w-full max-w-md p-6 mx-4 rounded-xl shadow-xl bg-gray-900 border border-gray-700"
//       >
//         <button
//           onClick={onClose}
//           className="absolute p-2 rounded-full top-4 right-4 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
//         >
//           <ChevronLeft size={20} />
//         </button>
      
//         <div className="flex flex-col items-center">
//           <div className="relative mb-6">
//             <div className="w-24 h-24 overflow-hidden rounded-full ring-4 ring-indigo-600 shadow-lg shadow-indigo-500/50">
//               {unit.unitRank.photo ? (
//                 <img
//                   src={unit.unitRank.photo}
//                   alt={unit.unitRank.name}
//                   className="object-cover w-full h-full"
//                 />
//               ) : (
//                 <div className="flex items-center justify-center w-full h-full text-3xl font-bold text-white bg-gradient-to-br from-blue-600 to-indigo-700">
//                   {unit.unitRank.name.charAt(0)}
//                 </div>
//               )}
//             </div>
            
//             <motion.div 
//               className="absolute -top-4 -right-4 bg-gradient-to-r from-amber-500 to-yellow-400 p-2 rounded-full shadow-lg"
//               animate={{ rotate: [0, 10, -10, 0] }}
//               transition={{ duration: 2, repeat: Infinity }}
//             >
//               <Trophy size={24} className="text-white" />
//             </motion.div>
//           </div>
        
//           <h3 className="mb-3 text-2xl font-bold text-white">{unit.unitRank.name}</h3>
        
//           <div className="w-full mt-6 space-y-5">
//             <motion.div 
//               initial={{ x: -20, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ delay: 0.1 }}
//               className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-900/40 to-blue-700/40 border border-blue-600/50"
//             >
//               <span className="font-medium text-gray-200">Pontuação Total</span>
//               <span className="text-xl font-bold text-blue-400">{unit.totalScore}</span>
//             </motion.div>
          
//             <motion.div 
//               initial={{ x: -20, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ delay: 0.2 }}
//               className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-green-900/40 to-green-700/40 border border-green-600/50"
//             >
//               <span className="font-medium text-gray-200">Respostas Corretas</span>
//               <span className="text-xl font-bold text-green-400">{unit.correctAnswers}</span>
//             </motion.div>
          
//             <motion.div 
//               initial={{ x: -20, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ delay: 0.3 }}
//               className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-red-900/40 to-red-700/40 border border-red-600/50"
//             >
//               <span className="font-medium text-gray-200">Respostas Incorretas</span>
//               <span className="text-xl font-bold text-red-400">{unit.wrongAnswers}</span>
//             </motion.div>
//           </div>
        
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={onClose}
//             className="w-full py-3 mt-8 font-medium text-white transition-colors rounded-lg bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 shadow-md shadow-blue-700/30"
//           >
//             Fechar
//           </motion.button>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// interface Ranking {
//   unitId: string;
//   totalScore: string;
//   correctAnswers: string;
//   wrongAnswers: string;
//   unitRank: {
//     name: string;
//     photo?: string;
//   };
// }

// export default function RankingUnits() {
//   const [ranking, setRanking] = useState<Ranking[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
//   const [selectedRanking, setSelectedRanking] = useState<Ranking | null>(null);
//   const [exportLoading, setExportLoading] = useState(false);

//   const fetchRanking = async () => {
//     setIsLoading(true);
//     try {
//       const data = await rankingUnitService.listRanking();
//       setRanking(data);
//     } catch (err) {
//       toast.error("Erro ao carregar ranking", {position: 'bottom-right'});
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRanking();
//   }, []);

//   const handleOpenDetail = (unit: any) => {
//     setSelectedRanking(unit);
//     setIsDetailModalOpen(true);
//   };

//   const exportToImage = async () => {
//     setExportLoading(true);
//     try {
//       const element = document.getElementById('ranking-container');
//       if (element) {
//         // Primeiro, criar uma cópia do elemento com dimensões específicas
//         const container = document.createElement('div');
//         container.style.width = '1920px';
//         container.style.height = '1080px';
//         container.style.position = 'absolute';
//         container.style.left = '-9999px';
//         container.style.top = '-9999px';
//         container.style.overflow = 'hidden';
//         container.style.background = 'linear-gradient(to right bottom, #1d4ed8, #4338ca, #6d28d9)';
//         container.style.display = 'flex';
//         container.style.flexDirection = 'column';
//         container.style.padding = '40px';
        
//         // Adicionar título ao container
//         const title = document.createElement('div');
//         title.style.textAlign = 'center';
//         title.style.color = 'white';
//         title.style.fontSize = '48px';
//         title.style.fontWeight = 'bold';
//         title.style.marginBottom = '30px';
//         title.textContent = 'Ranking de Unidades';
//         container.appendChild(title);
        
//         // Adicionar logo ou marca d'água
//         const watermark = document.createElement('div');
//         watermark.style.position = 'absolute';
//         watermark.style.bottom = '20px';
//         watermark.style.right = '20px';
//         watermark.style.color = 'rgba(255,255,255,0.7)';
//         watermark.style.fontSize = '24px';
//         watermark.textContent = 'Superluz';
//         container.appendChild(watermark);
        
//         // Clonar o conteúdo original
//         const clone = element.cloneNode(true) as HTMLElement;
//         clone.style.width = '100%';
//         clone.style.height = 'auto';
//         clone.style.background = 'transparent';
//         clone.style.boxShadow = 'none';
//         clone.style.borderRadius = '20px';
//         clone.style.overflow = 'hidden';
//         container.appendChild(clone);
        
//         document.body.appendChild(container);
        
//         const canvas = await html2canvas(container, {
//           scale: 1,
//           useCORS: true,
//           allowTaint: true,
//           backgroundColor: null,
//           width: 1920,
//           height: 1080
//         });
        
//         document.body.removeChild(container);
        
//         const dataUrl = canvas.toDataURL('image/png');
//         const link = document.createElement('a');
//         link.download = 'ranking-superluz.png';
//         link.href = dataUrl;
//         link.click();
        
//         toast.success('Imagem exportada com sucesso!', {position: 'bottom-right'});
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error('Erro ao exportar imagem', {position: 'bottom-right'});
//     } finally {
//       setExportLoading(false);
//     }
//   };

//   // Animação para o primeiro lugar
//   const pulseAnimation = {
//     scale: [1, 1.05, 1],
//     boxShadow: [
//       "0 10px 15px -3px rgba(255, 215, 0, 0.3)", 
//       "0 20px 25px -5px rgba(255, 215, 0, 0.4)", 
//       "0 10px 15px -3px rgba(255, 215, 0, 0.3)",
//     ],
//     transition: {
//       duration: 2,
//       ease: "easeInOut",
//       repeat: Infinity,
//       repeatType: "loop",
//     },
//   };

//   // Get top 3 and rest
//   const topThree = ranking.slice(0, 3);
//   const restOfRanking = ranking.slice(3);

//   const getTrendIcon = (index: number, position: number | null) => {
//     if (position === 0) return <TrendingUp className="text-green-400" size={16} />;
//     if (position === 1) return <Minus className="text-yellow-400" size={16} />;
//     if (position === 2) return <TrendingDown className="text-red-400" size={16} />;
    
//     // For rest of ranking, show a semi-random trend
//     const patterns = [
//       [0, 1, 2, 1, 0, 2, 1, 0],
//       [1, 0, 2, 0, 1, 2, 0, 1],
//       [2, 1, 0, 2, 1, 0, 2, 1]
//     ];
    
//     const patternIndex = index % patterns.length;
//     const positionInPattern = index % patterns[patternIndex].length;
//     const trend = patterns[patternIndex][positionInPattern];
    
//     if (trend === 0) return <TrendingUp className="text-green-400" size={16} />;
//     if (trend === 1) return <Minus className="text-yellow-400" size={16} />;
//     return <TrendingDown className="text-red-400" size={16} />;
//   };

//   // Cores para os pódios
//   const podiumColors = [
//     "bg-gradient-to-t from-yellow-600 to-yellow-400", // 1º lugar
//     "bg-gradient-to-t from-gray-400 to-gray-300",     // 2º lugar
//     "bg-gradient-to-t from-amber-700 to-amber-500"    // 3º lugar
//   ];

//   // Animações para o pódio
//   const podiumAnimations = [
//     {
//       height: "h-28",
//       initial: { height: 0, opacity: 0 },
//       animate: { height: "7rem", opacity: 1 },
//       transition: { duration: 0.8, delay: 0.3 },
//     },
//     {
//       height: "h-20",
//       initial: { height: 0, opacity: 0 },
//       animate: { height: "5rem", opacity: 1 },
//       transition: { duration: 0.8, delay: 0.5 },
//     },
//     {
//       height: "h-16",
//       initial: { height: 0, opacity: 0 },
//       animate: { height: "4rem", opacity: 1 },
//       transition: { duration: 0.8, delay: 0.7 },
//     },
//   ];

//   return (
//     <div className="w-full max-w-4xl mx-auto p-4">
//       <motion.div 
//         initial={{ y: -20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         className="mb-6 flex justify-between items-center"
//       >
//         <h1 className="text-3xl font-bold text-white">Ranking de Unidades</h1>
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={exportToImage}
//           disabled={exportLoading || isLoading}
//           className="inline-flex items-center px-6 py-3 font-medium text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50 shadow-md shadow-blue-900/30"
//         >
//           {exportLoading ? (
//             <Loader2 className="w-5 h-5 mr-2 animate-spin" />
//           ) : (
//             <Download className="w-5 h-5 mr-2" />
//           )}
//           Exportar Imagem
//         </motion.button>
//       </motion.div>

//       {isLoading ? (
//         <motion.div 
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="flex flex-col items-center justify-center w-full h-80 bg-gray-900/50 rounded-2xl border border-gray-800"
//         >
//           <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
//           <p className="mt-4 text-lg text-gray-300">Carregando ranking...</p>
//         </motion.div>
//       ) : (
//         <motion.div 
//           id="ranking-container" 
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.5 }}
//           className="overflow-hidden bg-gray-900 rounded-2xl shadow-xl border border-gray-800"
//         >
//           {/* Podium Section */}
//           <div className="relative px-4 pt-10 pb-20 overflow-hidden">
//             {/* Animated background */}
//             <AnimatedBackground />
          
//             <motion.h2
//               className="relative z-10 mb-10 text-3xl font-bold text-center text-white"
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 }}
//             >
//               Pódio das Unidades
//             </motion.h2>
          
//             <div className="relative z-10 flex items-end justify-center gap-4 h-64 mb-8">
//               {/* Second Place */}
//               {topThree[1] ? (
//                 <motion.div
//                   initial={{ opacity: 0, y: 50 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.4 }}
//                   className="flex flex-col items-center"
//                   onClick={() => handleOpenDetail(topThree[1])}
//                 >
//                   <div className="flex items-center justify-center w-8 h-8 mb-2 text-xs font-bold text-white bg-gray-400 rounded-full shadow-md">2</div>
                  
//                   <motion.div className="relative" whileHover={{ scale: 1.05 }}>
//                     <div className="w-20 h-20 mb-2 overflow-hidden rounded-full border-4 border-gray-300 shadow-lg shadow-gray-500/30">
//                       {topThree[1].unitRank.photo ? (
//                         <img
//                           src={topThree[1].unitRank.photo}
//                           alt={topThree[1].unitRank.name}
//                           className="object-cover w-full h-full"
//                         />
//                       ) : (
//                         <div className="flex items-center justify-center w-full h-full text-xl font-bold text-white bg-gradient-to-br from-blue-600 to-indigo-700">
//                           {topThree[1].unitRank.name.charAt(0)}
//                         </div>
//                       )}
//                       <div className="absolute -bottom-1 -right-1 flex items-center justify-center w-6 h-6 text-white rounded-full bg-gray-500 shadow-md">
//                         {getTrendIcon(1, 1)}
//                       </div>
//                     </div>
//                   </motion.div>
                  
//                   <p className="text-sm font-medium text-center text-white truncate w-24 mb-1">{topThree[1].unitRank.name}</p>
//                   <div className="flex items-center px-4 py-1 mb-3 text-sm font-bold text-gray-700 bg-gray-200 rounded-full shadow-inner">
//                     {topThree[1].totalScore}
//                   </div>
                  
//                   {/* Podium */}
//                   <motion.div 
//                     className={`w-24 rounded-t-lg ${podiumColors[1]} shadow-lg`}
//                     {...podiumAnimations[1]}
//                   ></motion.div>
//                 </motion.div>
//               ) : null}
            
//               {/* First Place */}
//               {topThree[0] ? (
//                 <motion.div
//                   initial={{ opacity: 0, y: 50 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.3 }}
//                   className="flex flex-col items-center z-20"
//                   onClick={() => handleOpenDetail(topThree[0])}
//                 >
//                   <motion.div
//                     animate={{
//                       y: [0, -5, 0],
//                       transition: {
//                         duration: 2,
//                         repeat: Infinity,
//                         ease: "easeInOut"
//                       }
//                     }}
//                   >
//                     <Crown className="w-10 h-10 mb-2 text-yellow-400" strokeWidth={1.5} fill="rgba(250, 204, 21, 0.5)" />
//                   </motion.div>
                  
//                   <div className="flex items-center justify-center w-9 h-9 mb-3 text-sm font-bold text-yellow-900 bg-yellow-400 rounded-full shadow-md shadow-yellow-500/50">1</div>
                
//                   <motion.div
//                     className="relative"
//                     whileHover={{ scale: 1.05 }}
//                     animate={{
//                       scale: [1, 1.05, 1],
//                       boxShadow: [
//                         '0 0 0 0 rgba(2, 255, 171, 0.4)', // Verde com opacidade 0.4
//                         '0 0 0 10px rgba(2, 255, 171, 0.2)', // Verde com opacidade 0.2
//                         '0 0 0 20px rgba(2, 255, 171, 0.1)', // Verde com opacidade 0.1
//                         '0 0 0 0 rgba(2, 255, 171, 0)' // Verde com opacidade 0
//                       ],
//                       transition: {
//                         duration: 2,
//                         ease: "easeInOut",
//                         repeat: Infinity,
//                         repeatType: "loop",
//                       },
//                     }}
//                   >
//                     <div className="w-28 h-28 mb-3 overflow-hidden rounded-full border-4 border-yellow-400 shadow-xl shadow-yellow-500/30">
//                       {topThree[0].unitRank.photo ? (
//                         <img
//                           src={topThree[0].unitRank.photo}
//                           alt={topThree[0].unitRank.name}
//                           className="object-cover w-full h-full"
//                         />
//                       ) : (
//                         <div className="flex items-center justify-center w-full h-full text-3xl font-bold text-white bg-gradient-to-br from-blue-600 to-indigo-700">
//                           {topThree[0].unitRank.name.charAt(0)}
//                         </div>
//                       )}
//                       <div className="absolute -bottom-1 -right-1 flex items-center justify-center w-7 h-7 text-white rounded-full bg-green-600 shadow-md">
//                         {getTrendIcon(0, 0)}
//                       </div>
//                     </div>
                    
//                     {/* Glow effect behind avatar */}
//                     <motion.div
//                       className="absolute inset-0 -z-10 rounded-full bg-yellow-400/30 blur-md"
//                       animate={{
//                         scale: [1, 1.2, 1],
//                         opacity: [0.3, 0.6, 0.3],
//                       }}
//                       transition={{
//                         duration: 3,
//                         repeat: Infinity,
//                         repeatType: "loop",
//                       }}
//                     />
//                   </motion.div>
                  
//                   <p className="text-base font-bold text-center text-white truncate w-28 mb-1">{topThree[0].unitRank.name}</p>
//                   <div className="flex items-center px-5 py-1.5 mb-4 text-base font-bold text-yellow-900 bg-yellow-300 rounded-full shadow-inner">
//                     {topThree[0].totalScore}
//                   </div>
                  
//                   {/* Podium */}
//                   <motion.div 
//                     className={`w-28 rounded-t-lg ${podiumColors[0]} shadow-lg`}
//                     {...podiumAnimations[0]}
//                   ></motion.div>
//                 </motion.div>
//               ) : null}
            
//               {/* Third Place */}
//               {topThree[2] ? (
//                 <motion.div
//                   initial={{ opacity: 0, y: 50 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.5 }}
//                   className="flex flex-col items-center"
//                   onClick={() => handleOpenDetail(topThree[2])}
//                 >
//                   <div className="flex items-center justify-center w-8 h-8 mb-2 text-xs font-bold text-white bg-amber-600 rounded-full shadow-md">3</div>
                  
//                   <motion.div className="relative" whileHover={{ scale: 1.05 }}>
//                     <div className="w-18 h-18 mb-2 overflow-hidden rounded-full border-4 border-amber-500 shadow-lg shadow-amber-600/30">
//                       {topThree[2].unitRank.photo ? (
//                         <img
//                           src={topThree[2].unitRank.photo}
//                           alt={topThree[2].unitRank.name}
//                           className="object-cover w-full h-full"
//                         />
//                       ) : (
//                         <div className="flex items-center justify-center w-full h-full text-xl font-bold text-white bg-gradient-to-br from-blue-600 to-indigo-700">
//                           {topThree[2].unitRank.name.charAt(0)}
//                         </div>
//                       )}
//                       <div className="absolute -bottom-1 -right-1 flex items-center justify-center w-6 h-6 text-white rounded-full bg-red-600 shadow-md">
//                         {getTrendIcon(2, 2)}
//                       </div>
//                     </div>
//                   </motion.div>
                  
//                   <p className="text-sm font-medium text-center text-white truncate w-22 mb-1">{topThree[2].unitRank.name}</p>
//                   <div className="flex items-center px-3 py-1 mb-2 text-sm font-bold text-amber-900 bg-amber-200 rounded-full shadow-inner">
//                     {topThree[2].totalScore}
//                   </div>
                  
//                   {/* Podium */}
//                   <motion.div 
//                     className={`w-22 rounded-t-lg ${podiumColors[2]} shadow-lg`}
//                     {...podiumAnimations[2]}
//                   ></motion.div>
//                 </motion.div>
//               ) : null}
//             </div>
//           </div>
        
//           {/* List of other rankings */}
//           <div className="p-6 bg-gray-900/80 border-t border-gray-800">
//             <motion.h3
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.6 }}
//               className="mb-5 text-xl font-medium text-gray-200"
//             >
//               Demais Colocações
//             </motion.h3>
          
//             <div className="space-y-3">
//               <AnimatePresence>
//                 {restOfRanking.map((unit, index) => (
//                   <motion.div
//                     key={unit.unitId}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     exit={{ opacity: 0, x: 20 }}
//                     transition={{ delay: index * 0.1 + 0.7 }}
//                     whileHover={{ scale: 1.02, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
//                     className="flex items-center p-4 transition-all border rounded-xl cursor-pointer border-gray-700/50 bg-gray-800/30 hover:border-blue-700/50 group"
//                     onClick={() => handleOpenDetail(unit)}
//                   >
//                     <div className="flex items-center justify-center w-8 h-8 mr-4 text-sm font-medium text-gray-300 bg-gray-700 rounded-full shadow-inner group-hover:bg-blue-900 group-hover:text-white transition-colors">
//                       {index + 4}
//                     </div>
                  
//                     <div className="relative w-12 h-12 mr-4 overflow-hidden rounded-full border-2 border-gray-700 group-hover:border-blue-600 transition-colors">
//                       {unit.unitRank.photo ? (
//                         <img
//                           src={unit.unitRank.photo}
//                           alt={unit.unitRank.name}
//                           className="object-cover w-full h-full"
//                         />
//                       ) : (
//                         <div className="flex items-center justify-center w-full h-full text-sm font-bold text-white bg-gradient-to-br from-blue-600 to-indigo-700">
//                           {unit.unitRank.name.charAt(0)}
//                         </div>
//                       )}
                      
//                       <div className="absolute -bottom-1 -right-1 flex items-center justify-center w-5 h-5 text-white rounded-full bg-gray-700 shadow-md">
//                         {getTrendIcon(index, null)}
                      
//                     </div>
//                   </div>
                    
//                     <div className="flex-1 min-w-0">
//                       <h4 className="text-base font-medium text-white truncate">{unit.unitRank.name}</h4>
//                     </div>
                    
//                     <div className="flex items-center ml-2">
//                       <div className="px-4 py-1.5 font-semibold rounded-lg bg-gray-700 text-gray-200 group-hover:bg-blue-600 group-hover:text-white transition-colors">
//                         {unit.totalScore}
//                       </div>
//                       <ChevronRight className="w-5 h-5 ml-3 text-gray-500 group-hover:text-blue-400 transition-colors" />
//                     </div>
//                   </motion.div>
//                 ))}
//               </AnimatePresence>
//             </div>
//           </div>
//         </motion.div>
//       )}

//       {/* Unit Details Modal */}
//       <AnimatePresence>
//         {selectedRanking && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
//             onClick={() => setSelectedRanking(null)}
//           >
//             <motion.div
//               initial={{ scale: 0.95, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.95, y: 20 }}
//               className="w-full max-w-md p-6 m-4 overflow-hidden bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex items-center justify-between mb-5">
//                 <h3 className="text-xl font-bold text-white">Detalhes da Unidade</h3>
//                 <button
//                   onClick={() => setSelectedRanking(null)}
//                   className="p-1 text-gray-400 transition-colors rounded-full hover:bg-gray-800 hover:text-white"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>

//               <div className="flex items-center mb-6">
//                 <div className="relative w-16 h-16 mr-4 overflow-hidden rounded-full border-2 border-blue-600">
//                   {selectedRanking.unitRank.photo ? (
//                     <img
//                       src={selectedRanking.unitRank.photo}
//                       alt={selectedRanking.unitRank.name}
//                       className="object-cover w-full h-full"
//                     />
//                   ) : (
//                     <div className="flex items-center justify-center w-full h-full text-xl font-bold text-white bg-gradient-to-br from-blue-600 to-indigo-700">
//                       {selectedRanking.unitRank.name.charAt(0)}
//                     </div>
//                   )}
//                 </div>
                
//                 <div>
//                   <h4 className="text-lg font-bold text-white">{selectedRanking.unitRank.name}</h4>
//                   <div className="flex items-center mt-1">
//                     {/* <div className="px-3 py-1 mr-3 text-sm font-semibold text-white bg-blue-700 rounded-full">
//                       #{selectedRanking.}º Lugar
//                     </div> */}
//                     <div className="flex items-center text-sm text-gray-300">
//                       <Trophy className="w-4 h-4 mr-1 text-yellow-500" />
//                       {selectedRanking.totalScore} pts
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* <div className="p-4 mb-5 rounded-xl bg-gray-800/50 border border-gray-700">
//                 <h5 className="mb-3 font-medium text-gray-200">Pontuação por Categoria</h5>
//                 <div className="space-y-3">
//                   {selectedRanking.categoryScores && Object.entries(selectedRanking.categoryScores).map(([category, score], index) => (
//                     <div key={category} className="flex items-center">
//                       <div className="w-32 text-sm text-gray-300 whitespace-nowrap overflow-hidden text-ellipsis">
//                         {category}
//                       </div>
//                       <div className="flex-1 ml-2">
//                         <div className="w-full h-2 overflow-hidden bg-gray-700 rounded-full">
//                           <motion.div
//                             initial={{ width: 0 }}
//                             animate={{ width: `${(score / selectedUnit.totalScore) * 100}%` }}
//                             transition={{ delay: 0.2 + index * 0.1, duration: 0.8 }}
//                             className={`h-full ${categoryColors[index % categoryColors.length]}`}
//                           />
//                         </div>
//                       </div>
//                       <div className="w-12 ml-3 text-right text-sm font-medium text-white">
//                         {score}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div> */}

//               {/* <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
//                 <h5 className="mb-3 font-medium text-gray-200">Evolução Histórica</h5>
//                 <div className="h-32">
//                   {selectedUnit.history ? (
//                     <ResponsiveContainer width="100%" height="100%">
//                       <LineChart data={selectedUnit.history}>
//                         <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                         <XAxis 
//                           dataKey="month" 
//                           tick={{ fill: '#9CA3AF', fontSize: 10 }}
//                           axisLine={{ stroke: '#4B5563' }}
//                         />
//                         <YAxis
//                           tick={{ fill: '#9CA3AF', fontSize: 10 }}
//                           axisLine={{ stroke: '#4B5563' }}
//                         />
//                         <Tooltip
//                           contentStyle={{
//                             backgroundColor: '#1F2937',
//                             border: '1px solid #374151',
//                             borderRadius: '8px',
//                             color: '#F3F4F6'
//                           }}
//                         />
//                         <Line 
//                           type="monotone" 
//                           dataKey="score" 
//                           stroke="#3B82F6" 
//                           strokeWidth={2}
//                           dot={{ fill: '#2563EB', r: 4 }}
//                           activeDot={{ fill: '#1D4ED8', r: 6, stroke: '#BFDBFE', strokeWidth: 2 }}
//                         />
//                       </LineChart>
//                     </ResponsiveContainer>
//                   ) : (
//                     <div className="flex items-center justify-center h-full text-gray-400">
//                       <ChartBarOff className="w-6 h-6 mr-2" />
//                       Dados históricos não disponíveis
//                     </div>
//                   )}
//                 </div>
//               </div> */}
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }


































































// import { useEffect, useState, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Loader2, Crown, ArrowUp, ArrowDown, Minus, X, Award, Download, Share2, Info } from "lucide-react";
// import { toast } from "react-hot-toast";
// import { rankingUnitService } from "../../services/rankingUnitService";
// import ConfirmDeleteEvaUnitModal from "../../components/EvaluationUnitComponents/ConfirmDeleteEvaUnitModal";
// import AnimatedBrushes from '../Rankings/components/AnimatedBrushes'
// import InstagramStoryTemplate from '../Rankings/components/InstagramStoryTemplate'
// import { generateInstaStory } from '../Rankings/components/story-generator-util'

// interface UnitRank {
//   unitId: string;
//   totalScore: string;
//   correctAnswers: string;
//   wrongAnswers: string;
//   unitRank: {
//     name: string;
//     photo: string;
//   };
// }

// interface UnitDetailsModalProps {
//   unit: UnitRank;
//   onClose: () => void; 
// }

// const UnitDetailsModal = ({ unit, onClose }: UnitDetailsModalProps) => {
//   return (
//     <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
//       <motion.div 
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         exit={{ opacity: 0, scale: 0.9 }}
//         className="bg-emerald-900 rounded-2xl p-6 max-w-md w-full mx-4 border-2 border-emerald-500 shadow-lg"
//       >
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-xl font-bold text-white">Detalhes da Unidade</h3>
//           <button 
//             onClick={onClose}
//             className="text-emerald-300 hover:text-white transition-colors"
//           >
//             <X size={24} />
//           </button>
//         </div>
        
//         <div className="flex items-center space-x-4 mb-6">
//           <div className="relative">
//             <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-emerald-400">
//               <img 
//                 src={unit.unitRank.photo || "/placeholder-avatar.png"} 
//                 alt={unit.unitRank.name}
//                 className="w-full h-full object-cover"
//                 onError={(e) => {
//                   e.currentTarget.src = "/placeholder-avatar.png";
//                 }}
//               />
//             </div>
//           </div>
          
//           <div>
//             <h4 className="text-lg font-bold text-white">{unit.unitRank.name}</h4>
//             <p className="text-emerald-300 text-sm">ID: {unit.unitId.substring(0, 8)}...</p>
//           </div>
//         </div>
        
//         <div className="bg-emerald-800/50 rounded-lg p-4 mb-4">
//           <div className="grid grid-cols-3 gap-4 text-center">
//             <div>
//               <p className="text-emerald-300 text-xs uppercase font-medium">Pontuação</p>
//               <p className="text-2xl font-bold text-white">{unit.totalScore}</p>
//             </div>
//             <div>
//               <p className="text-emerald-300 text-xs uppercase font-medium">Acertos</p>
//               <p className="text-2xl font-bold text-emerald-400">{unit.correctAnswers}</p>
//             </div>
//             <div>
//               <p className="text-emerald-300 text-xs uppercase font-medium">Erros</p>
//               <p className="text-2xl font-bold text-red-400">{unit.wrongAnswers}</p>
//             </div>
//           </div>
//         </div>
        
//         <div className="text-center">
//           <p className="text-emerald-300 mb-3">
//             Taxa de acerto: {
//               Math.round((parseInt(unit.correctAnswers) / (parseInt(unit.correctAnswers) + parseInt(unit.wrongAnswers))) * 100) || 0
//             }%
//           </p>
//           <button 
//             className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-colors w-full"
//           >
//             Ver histórico completo
//           </button>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// const getPositionIndicator = (previousRank: number | undefined, currentIndex: number) => {
//   if (previousRank === undefined) return null;
  
//   if (previousRank < currentIndex) {
//     return <ArrowDown className="text-red-400 w-4 h-4" />;
//   } else if (previousRank > currentIndex) {
//     return <ArrowUp className="text-emerald-400 w-4 h-4" />;
//   } else {
//     return <Minus className="text-gray-400 w-4 h-4" />;
//   }
// };

// export default function RankingUnits() {
//   const [ranking, setRanking] = useState<UnitRank[]>([]);
//   const [previousRanking, setPreviousRanking] = useState<{[key: string]: number}>({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [selectedRanking, setSelectedRanking] = useState<UnitRank | null>(null);
//   const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month'>('week');
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [showStoryPreview, setShowStoryPreview] = useState(false);
//   const leaderboardRef = useRef<HTMLDivElement>(null);
//   const storyTemplateRef = useRef<HTMLDivElement>(null);
  
//   const fetchRanking = async () => {
//     setIsLoading(true);
//     try {
//       // Store previous ranking positions for animation effects
//       const previousPositions: { [key: string]: number } = {};
//       ranking.forEach((unit, index) => {
//         previousPositions[unit.unitId] = index;
//       });
//       setPreviousRanking(previousPositions);
      
//       const data = await rankingUnitService.listRanking();
//       setRanking(data);
//     } catch (err) {
//       toast.error("Erro ao carregar ranking");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRanking();
    
//     // Refresh ranking data every 5 minutes
//     const intervalId = setInterval(fetchRanking, 5 * 60 * 1000);
    
//     return () => clearInterval(intervalId);
//   }, [timeFilter]);

//   const handleOpenDelete = (unit: UnitRank) => {
//     setSelectedRanking(unit);
//     setIsDeleteModalOpen(true);
//   };

//   const handleDeleteRanking = async () => {
//     if (selectedRanking) {
//       try {
//         //await rankingUnitService.deleteRanking(selectedRanking.id);
//         toast.success('Avaliação excluída com sucesso!', {
//           position: 'bottom-right',
//         });
//         setIsDeleteModalOpen(false);
//         await fetchRanking();
//       } catch (err) {
//         toast.error(`Erro ao excluir avaliação ${err}`, {
//           position: 'bottom-right',
//         });
//       }
//     }
//   };

//   const handleUnitClick = (unit: UnitRank) => {
//     setSelectedRanking(unit);
//     setShowDetailsModal(true);
//   };

//   const handleGenerateStory = async () => {
//     setShowStoryPreview(true);
//   };
  
//   const exportStoryImage = async () => {
//     if (storyTemplateRef.current) {
//       await generateInstaStory(storyTemplateRef, 'superluz-ranking');
//     }
//   };

//   const getTopThree = () => ranking.slice(0, 3);
//   const getRemainingRanking = () => ranking.slice(3);

//   const brushPatterns = [
//     "M15.5,5.5c0,0-9,0-16.5,0S-7.5,13-7.5,20s9,12,15,12s13-3,13-10S15.5,5.5,15.5,5.5z",
//     "M37.5,25.3c0,0-17.3-4.4-20.8-6.8s-7.1-6.2-12.8-6.2S-9.5,18.7-9.5,26.5s9.9,13.4,16.9,13.4s14.9-3.4,16.4-12.1C25.3,18.7,37.5,25.3,37.5,25.3z",
//     "M32.5,27.5c-3.8,1.2-12.5,1.1-19.5-0.9S1.5,13.5-5.5,13.5s-18,9-18,17s9,14,16,14s14-4,15.5-12.5C9.5,23.5,32.5,27.5,32.5,27.5z"
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-emerald-900 to-emerald-800 p-4 pb-24">
//       <div className="max-w-md mx-auto">
//         <div className="mb-6 text-center">
//           <h1 className="text-3xl font-bold text-white relative inline-block">
//             Ranking
//             <motion.div 
//               className="absolute -bottom-2 left-0 right-0 h-1 bg-emerald-400 rounded-full"
//               initial={{ width: 0 }}
//               animate={{ width: '100%' }}
//               transition={{ duration: 0.6, delay: 0.2 }}
//             />
//           </h1>
//         </div>

//         <div className="bg-emerald-800/40 backdrop-blur-sm rounded-2xl p-4 shadow-lg mb-6">
//           <div className="flex justify-center mb-6">
//             <div className="bg-emerald-900/80 inline-flex rounded-full p-1">
//               {(['today', 'week', 'month'] as const).map((filter) => (
//                 <button
//                   key={filter}
//                   onClick={() => setTimeFilter(filter)}
//                   className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
//                     timeFilter === filter
//                       ? 'bg-emerald-600 text-white shadow-md'
//                       : 'text-emerald-200 hover:text-white'
//                   }`}
//                 >
//                   {filter === 'today' ? 'Hoje' : filter === 'week' ? 'Semana' : 'Mês'}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {isLoading ? (
//             <div className="flex justify-center items-center p-16">
//               <motion.div
//                 animate={{
//                   rotate: 360,
//                 }}
//                 transition={{
//                   duration: 1,
//                   repeat: Infinity,
//                   ease: "linear",
//                 }}
//               >
//                 <Loader2 className="w-12 h-12 text-emerald-400" />
//               </motion.div>
//             </div>
//           ) : (
//             <div ref={leaderboardRef}>
//               {/* Top 3 Podium */}
//               {getTopThree().length > 0 && (
//                 <div className="relative pt-12 pb-6">
//                 <AnimatedBrushes />
                  
//                   {/* Place numbers */}
//                   <div className="flex justify-around -mb-4">
//                     <div className="font-bold text-emerald-300 text-xl">2</div>
//                     <div className="font-bold text-emerald-300 text-xl">1</div>
//                     <div className="font-bold text-emerald-300 text-xl">3</div>
//                   </div>
                  
//                   <div className="flex items-end justify-center space-x-4 mb-6">
//                     {/* Second Place */}
//                     {getTopThree()[1] && (
//                       <motion.div
//                         initial={{ y: 100, opacity: 0 }}
//                         animate={{ y: 0, opacity: 1 }}
//                         transition={{ duration: 0.5, delay: 0.2 }}
//                         className="flex flex-col items-center"
//                         onClick={() => handleUnitClick(getTopThree()[1])}
//                       >
//                         <div className="relative mb-2">
//                           <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-emerald-300 shadow-lg transform hover:scale-105 transition-transform cursor-pointer">
//                             <img 
//                               src={getTopThree()[1].unitRank.photo || "/placeholder-avatar.png"} 
//                               alt={getTopThree()[1].unitRank.name} 
//                               className="w-full h-full object-cover"
//                               onError={(e) => {
//                                 e.currentTarget.src = "/placeholder-avatar.png";
//                               }}
//                             />
//                           </div>
//                           <motion.div 
//                             initial={{ y: 5, opacity: 0 }}
//                             animate={{ y: 0, opacity: 1 }}
//                             transition={{ delay: 1, duration: 0.3 }}
//                             className="absolute -top-1 -left-1 bg-emerald-800 rounded-full p-1"
//                           >
//                             <ArrowUp className="text-emerald-400 w-4 h-4" />
//                           </motion.div>
//                         </div>
//                         <p className="text-emerald-100 text-xs truncate w-20 text-center">
//                           {getTopThree()[1].unitRank.name}
//                         </p>
//                         <motion.p 
//                           className="font-bold text-emerald-300"
//                           initial={{ opacity: 0, scale: 0.5 }}
//                           animate={{ opacity: 1, scale: 1 }}
//                           transition={{ delay: 0.7, duration: 0.3 }}
//                         >
//                           {parseInt(getTopThree()[1].totalScore).toLocaleString()}
//                         </motion.p>
//                       </motion.div>
//                     )}
                    
//                     {/* First Place */}
//                     {getTopThree()[0] && (
//                       <motion.div
//                         initial={{ y: 100, opacity: 0 }}
//                         animate={{ y: 0, opacity: 1 }}
//                         transition={{ duration: 0.5 }}
//                         className="flex flex-col items-center z-10"
//                         onClick={() => handleUnitClick(getTopThree()[0])}
//                       >
//                         <motion.div
//                           initial={{ y: -20, opacity: 0 }}
//                           animate={{ y: 0, opacity: 1 }}
//                           transition={{ delay: 0.5, duration: 0.3 }}
//                           className="mb-1"
//                         >
//                           <Crown className="w-10 h-10 text-yellow-400 filter drop-shadow-md" />
//                         </motion.div>
//                         <div className="relative mb-2">
//                           <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-yellow-400 shadow-xl transform hover:scale-105 transition-transform cursor-pointer">
//                             <img 
//                               src={getTopThree()[0].unitRank.photo || "/placeholder-avatar.png"} 
//                               alt={getTopThree()[0].unitRank.name} 
//                               className="w-full h-full object-cover"
//                               onError={(e) => {
//                                 e.currentTarget.src = "/placeholder-avatar.png";
//                               }}
//                             />
//                           </div>
//                         </div>
//                         <p className="text-white text-sm font-medium truncate w-24 text-center">
//                           {getTopThree()[0].unitRank.name}
//                         </p>
//                         <motion.p 
//                           className="font-bold text-xl text-yellow-400"
//                           initial={{ opacity: 0, scale: 0.5 }}
//                           animate={{ opacity: 1, scale: 1 }}
//                           transition={{ delay: 0.6, duration: 0.3 }}
//                         >
//                           {parseInt(getTopThree()[0].totalScore).toLocaleString()}
//                         </motion.p>
//                       </motion.div>
//                     )}
                    
//                     {/* Third Place */}
//                     {getTopThree()[2] && (
//                       <motion.div
//                         initial={{ y: 100, opacity: 0 }}
//                         animate={{ y: 0, opacity: 1 }}
//                         transition={{ duration: 0.5, delay: 0.4 }}
//                         className="flex flex-col items-center"
//                         onClick={() => handleUnitClick(getTopThree()[2])}
//                       >
//                         <div className="relative mb-2">
//                           <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-orange-300 shadow-lg transform hover:scale-105 transition-transform cursor-pointer">
//                             <img 
//                               src={getTopThree()[2].unitRank.photo || "/placeholder-avatar.png"} 
//                               alt={getTopThree()[2].unitRank.name} 
//                               className="w-full h-full object-cover"
//                               onError={(e) => {
//                                 e.currentTarget.src = "/placeholder-avatar.png";
//                               }}
//                             />
//                           </div>
//                           <motion.div 
//                             initial={{ y: 5, opacity: 0 }}
//                             animate={{ y: 0, opacity: 1 }}
//                             transition={{ delay: 1, duration: 0.3 }}
//                             className="absolute -top-1 -right-1 bg-emerald-800 rounded-full p-1"
//                           >
//                             <ArrowDown className="text-red-400 w-4 h-4" />
//                           </motion.div>
//                         </div>
//                         <p className="text-emerald-100 text-xs truncate w-20 text-center">
//                           {getTopThree()[2].unitRank.name}
//                         </p>
//                         <motion.p 
//                           className="font-bold text-orange-300"
//                           initial={{ opacity: 0, scale: 0.5 }}
//                           animate={{ opacity: 1, scale: 1 }}
//                           transition={{ delay: 0.8, duration: 0.3 }}
//                         >
//                           {parseInt(getTopThree()[2].totalScore).toLocaleString()}
//                         </motion.p>
//                       </motion.div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Remaining rankings */}
//               <div className="space-y-3 mt-6">
//                 <AnimatePresence>
//                   {getRemainingRanking().map((unit, index) => (
//                     <motion.div 
//                       key={unit.unitId}
//                       layout
//                       initial={{ opacity: 0, x: -20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       exit={{ opacity: 0, x: 20 }}
//                       transition={{ duration: 0.3, delay: index * 0.05 }}
//                       className="bg-emerald-700/50 rounded-xl p-3 flex items-center cursor-pointer hover:bg-emerald-700/70 transition-colors"
//                       onClick={() => handleUnitClick(unit)}
//                     >
//                       <div className="flex items-center flex-1">
//                         <div className="w-8 h-8 flex items-center justify-center mr-3 font-bold text-emerald-200">
//                           {index + 4}
//                         </div>
//                         <div className="flex items-center space-x-3">
//                           <div className="relative">
//                             <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-400">
//                               <img 
//                                 src={unit.unitRank.photo || "/placeholder-avatar.png"} 
//                                 alt={unit.unitRank.name} 
//                                 className="w-full h-full object-cover"
//                                 onError={(e) => {
//                                   e.currentTarget.src = "/placeholder-avatar.png";
//                                 }}
//                               />
//                             </div>
//                             {getPositionIndicator(previousRanking[unit.unitId], index + 3) && (
//                               <div className="absolute -top-1 -right-1 bg-emerald-800 rounded-full p-1">
//                                 {getPositionIndicator(previousRanking[unit.unitId], index + 3)}
//                               </div>
//                             )}
//                           </div>
//                           <div>
//                             <p className="text-white font-medium text-sm">{unit.unitRank.name}</p>
//                             <motion.p 
//                               className="text-emerald-300 text-xs"
//                               initial={{ opacity: 0 }}
//                               animate={{ opacity: 1 }}
//                               transition={{ delay: 0.3 + index * 0.05 }}
//                             >
//                               {`${unit.correctAnswers} acertos / ${unit.wrongAnswers} erros`}
//                             </motion.p>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="text-lg font-bold text-emerald-300">
//                         {parseInt(unit.totalScore).toLocaleString()}
//                       </div>
//                     </motion.div>
//                   ))}
//                 </AnimatePresence>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Export Instagram Story button */}
//         <motion.button
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 1 }}
//           onClick={handleGenerateStory}
//           className="fixed bottom-6 right-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-4 shadow-lg flex items-center space-x-2 z-20"
//         >
//           <Share2 size={20} />
//           <span className="mr-1">Exportar Story</span>
//         </motion.button>
        
//         {/* Refresh button */}
//         <motion.button
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 1.2 }}
//           onClick={fetchRanking}
//           className="fixed bottom-6 left-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-4 shadow-lg z-20"
//         >
//           <motion.div
//             animate={isLoading ? { rotate: 360 } : {}}
//             transition={{ duration: 1, repeat: isLoading ? Infinity : 0, ease: "linear" }}
//           >
//             <Loader2 size={20} />
//           </motion.div>
//         </motion.button>
//       </div>

//       {/* Delete Confirmation Modal */}
//       {isDeleteModalOpen && selectedRanking && (
//         <ConfirmDeleteEvaUnitModal
//           isOpen={isDeleteModalOpen}
//           onClose={() => setIsDeleteModalOpen(false)}
//           onConfirmDelete={handleDeleteRanking}
//         />
//       )}

//       {/* Details Modal */}
//       <AnimatePresence>
//         {showDetailsModal && selectedRanking && (
//           <UnitDetailsModal 
//             unit={selectedRanking} 
//             onClose={() => setShowDetailsModal(false)}
//           />
//         )}
//       </AnimatePresence>
      
//       {/* Instagram Story Preview Modal */}
//       <AnimatePresence>
//         {showStoryPreview && (
//           <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.9 }}
//               className="relative max-w-md w-full mx-4 rounded-lg"
//             >
//               <button 
//                 onClick={() => setShowStoryPreview(false)}
//                 className="absolute -top-10 right-0 text-white hover:text-emerald-300 transition-colors"
//               >
//                 <X size={24} />
//               </button>
              
//               <div className="relative">
//                 <InstagramStoryTemplate 
//                   ref={storyTemplateRef}
//                   ranking={ranking}
//                   appName="SuperLuz"
//                 />
                
//                 <button
//                   onClick={exportStoryImage}
//                   className="absolute bottom-6 right-1/2 transform translate-x-1/2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6 py-3 shadow-lg flex items-center space-x-2"
//                 >
//                   <Download size={20} />
//                   <span>Baixar Story</span>
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }
