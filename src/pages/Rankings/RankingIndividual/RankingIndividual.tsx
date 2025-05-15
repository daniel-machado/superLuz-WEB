import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, List, User, Loader2 } from "lucide-react";
import { AnimatedBackground, AnimatedBackgroundStars, AnimatedConfetti } from "../components/animatedBackgroungGroup";
import AnimatedBackgroundOficial from "../components/AnimatedBackgroundOficial";
import AnimatedBackgroundStarsOficial from "../components/AnimatedBackgroundStarsOficial";
import AnimatedBrushesOficial from "../components/AnimatedBrusheOficial";
import PodiumIndividual from "./ComponentsAux/PodiumIndividual";
import RankingList from "./ComponentsAux/RankingList";
import TableView from './ComponentsAux/TableView'
import { rankingIndividualService } from "../../../services/rankingIndividualService";
import toast from "react-hot-toast";
import RankIndividualDetailModal from "./ComponentsAux/RankIndividualDetailModal";
import PageMeta from "../../../components/common/PageMeta";

interface User {
  rank: number;
  name: string;
  score: number;
  avatar: string | null;
}
interface Ranking {
  dbvId: string;  
  totalScore: string;
  individualRank:{
    name: string;
    photoUrl: string | null
  }
}

// Componente principal
const RankingIndividual = () => {
  const [activeTab, setActiveTab] = useState("podium");
  const [isLoading, setIsLoading] = useState(false);
  const rankingContainerRef = useRef(null);
  const [ranking, setRanking] = useState<Ranking[]>([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRanking, setSelectedRanking] = useState<Ranking | null>(null);

  const fetchRanking = async () => {
    setIsLoading(true);
    try {
      const data = await rankingIndividualService.listRanking();
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

  // Handle opening unit details
  const handleOpenDetail = (ranking: Ranking) => {
    setSelectedRanking(ranking);
    setIsDetailModalOpen(true);
  };

  //Get top 3 and rest
  const topThree = ranking.slice(0, 3);
  const restOfRanking = ranking.slice(3);
  
  // Manipulador de swipe para dispositivos móveis
  const handleSwipe = (offsetX: number) => {
    if (offsetX > 0) {
      setActiveTab("table");
    } else {
      setActiveTab("podium");
    }
  };
  
  // Variantes para animação de tabs
  const tabVariants = {
    hidden: (direction: "left" | "right") => ({
      x: direction === "right" ? -20 : 20,
      opacity: 0,
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
    exit: (direction: "left" | "right") => ({
      x: direction === "right" ? 20 : -20,
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    }),
  };


  return (
    <>
    <PageMeta
        title="Ranking Individual | Luzeiros do Norte"
        description="Clube de Desbravadores - Ranking Individual"
      />
      <motion.div
        className="w-full max-w-4xl mx-auto p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >    
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-4 flex flex-col sm:flex-row justify-between items-center"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-0 flex items-center">
            <User className="w-8 h-8 mr-2 text-purple-400" />
            Ranking Individual
          </h1>
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
                  ? "bg-gradient-to-r from-purple-600 to-indigo-700 text-white"
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
                  ? "bg-gradient-to-r from-purple-600 to-indigo-700 text-white"
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
            <Loader2 className="w-10 h-10 text-purple-600 animate-spin dark:text-purple-400" />
            <p className="mt-4 text-gray-400">Carregando ranking...</p>
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
            <AnimatePresence mode="wait" initial={false}>
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
                    
                    <PodiumIndividual topThree={topThree} handleOpenDetail={handleOpenDetail}/>
                  </motion.div>
                  
                  {/* List of other rankings */}
                  <RankingList rankings={restOfRanking} handleOpenDetail={handleOpenDetail}/>
                  
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
                      <AnimatedBrushesOficial />
                    
                    <div className="p-4 relative z-10">
                      <TableView ranking={ranking} handleOpenDetail={handleOpenDetail}/>
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
              <RankIndividualDetailModal
                isOpen={isDetailModalOpen}
                ranking={selectedRanking}
                onClose={() => setIsDetailModalOpen(false)}
              />
            )}
          </AnimatePresence>
      </motion.div>
    </>
    
  );
};


export default RankingIndividual;
