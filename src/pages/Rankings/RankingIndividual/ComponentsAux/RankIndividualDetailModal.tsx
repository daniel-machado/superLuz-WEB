import { useState, useEffect } from "react"; 
import { motion } from "framer-motion";
import { Trophy, Star, Award, Medal, User, ShieldCheck } from "lucide-react";
import { Modal } from "../../../../components/ui/modal";


// Interface for the unit data
interface Ranking {
  dbvId: string;
  totalScore: string;
  individualRank: {
    name: string;
    photoUrl: string | null;
  };
}


interface RankIndividualDetailModalProps {
  ranking: Ranking;
  isOpen: boolean;
  onClose: () => void;
}


const RankIndividualDetailModal = ({ ranking, isOpen, onClose }: RankIndividualDetailModalProps) => {
  const [isClosing, setIsClosing] = useState(false);


  // Close with escape key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);


  // Handle close with animation
  const handleClose = () => {
    setIsClosing(true);
    onClose();
  };


  // Format score with comma as decimal separator (e.g., "800.00" to "800,00")
  const formattedScore = ranking.totalScore.replace(".", ",");


  // Generate random stats for visualization
  const consistency = Math.floor(Math.random() * 30) + 70; // 70-100
  const progress = Math.floor(Math.random() * 40) + 60; // 60-100
  const performance = Math.floor(Math.random() * 30) + 70; // 70-100


  // Badge calculation based on score
  const getBadgeInfo = (score: string) => {
    const numScore = parseFloat(score);
    if (numScore >= 7000) return { name: "Diamante", color: "from-blue-400 to-indigo-600", icon: Trophy };
    if (numScore >= 4000) return { name: "Platina", color: "from-indigo-400 to-purple-600", icon: Star };
    if (numScore >= 2500) return { name: "Ouro", color: "from-yellow-400 to-amber-600", icon: Award };
    if (numScore >= 1000) return { name: "Prata", color: "from-gray-400 to-slate-500", icon: Medal };
    return { name: "Bronze", color: "from-orange-400 to-amber-700", icon: ShieldCheck };
  };


  const badge = getBadgeInfo(ranking.totalScore);
  const BadgeIcon = badge.icon;


  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[500px] m-4">
      <motion.div
        //className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: isClosing ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        //onClick={handleClose}
      >
        <motion.div
          className="relative w-full max-w-lg bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: isClosing ? 0.9 : 1, y: isClosing ? 20 : 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Purple decorative swoosh at the top */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-t-2xl">
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-wave-pattern"></div>
          </div>


          {/* Close button
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 rounded-full bg-gray-900 bg-opacity-50 text-white hover:bg-opacity-70 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button> */}


          <div className="pt-20 px-6 pb-6 relative z-10">
            {/* Profile section */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                {ranking.individualRank.photoUrl ? (
                  <img
                    src={ranking.individualRank.photoUrl}
                    alt={ranking.individualRank.name}
                    className="w-24 h-24 rounded-full border-4 border-purple-600 shadow-lg object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full border-4 border-purple-600 shadow-lg bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center">
                    <User className="w-12 h-12 text-white" />
                  </div>
                )}
                
                {/* Badge icon */}
                <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center shadow-lg border-2 border-gray-800`}>
                  <BadgeIcon className="w-5 h-5 text-white" />
                </div>
              </div>
              
              <motion.h2
                className="mt-4 text-2xl font-bold text-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {ranking.individualRank.name}
              </motion.h2>
              
              <motion.div
                className="mt-1 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white text-sm font-medium"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                Nível {badge.name}
              </motion.div>
            </div>


            {/* Score section */}
            <motion.div
              className="bg-gray-800 rounded-xl p-4 mb-6 shadow-inner border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-gray-400 font-medium">Pontuação Total</h3>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
                  {formattedScore}
                </div>
              </div>
            </motion.div>


            {/* Stats section */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-300">Consistência</span>
                  <span className="text-sm font-medium text-gray-300">{consistency}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${consistency}%` }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                  ></motion.div>
                </div>
              </div>


              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-300">Progresso</span>
                  <span className="text-sm font-medium text-gray-300">{progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                  ></motion.div>
                </div>
              </div>


              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-300">Performance</span>
                  <span className="text-sm font-medium text-gray-300">{performance}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${performance}%` }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                  ></motion.div>
                </div>
              </div>
            </motion.div>


            {/* ID Info (subtle) */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">ID: {ranking.dbvId.substring(0, 8)}...</p>
            </div>
          </div>


          {/* Animated particles in background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-purple-500 opacity-20"
                initial={{ 
                  x: Math.random() * 100, 
                  y: Math.random() * 100 
                }}
                animate={{ 
                  x: [
                    Math.random() * 400, 
                    Math.random() * 400, 
                    Math.random() * 400
                  ],
                  y: [
                    Math.random() * 500, 
                    Math.random() * 500, 
                    Math.random() * 500
                  ],
                  opacity: [0.2, 0.5, 0.2]
                }}
                transition={{ 
                  duration: 10 + Math.random() * 20, 
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </Modal>
  );
};


export default RankIndividualDetailModal;
