import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Award, Star, BarChart2, Check, AlertCircle, Zap, TrendingUp, Target, Shield } from "lucide-react";
import confetti from "canvas-confetti";
import { Modal } from "../../../components/ui/modal";


// Badge component for gamification
interface AchievementBadgeProps {
  level: string;
  score: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ level, score, color, icon }) => {
  const Icon = icon;
  const isActive = true;
  
  return (
    <motion.div
      className={`relative flex flex-col items-center p-3 rounded-xl ${
        isActive 
          ? `bg-gradient-to-br ${color} shadow-lg` 
          : "bg-gray-800 opacity-50"
      }`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="p-2 rounded-full bg-gray-900 bg-opacity-30">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="mt-2 font-bold text-white text-sm">{level}</h3>
      <p className="text-gray-200 text-xs">{score}</p>
    </motion.div>
  );
};


// Progress circle for visual stats
interface ProgressCircleProps {
  value: string;
  color: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  maxValue?: number;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({ value, color, label, icon, maxValue = 100 }) => {
  const Icon = icon;
  const percentage = Math.min((Number(value) / Number(maxValue)) * 100, 100);
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;


  return (
    <motion.div 
      className="flex flex-col items-center my-2"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className="relative flex items-center justify-center">
        <svg width="90" height="90" viewBox="0 0 100 100" className="transform -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <Icon className="w-5 h-5 mb-1 text-white" />
          <span className="font-bold text-lg text-white">{value}</span>
        </div>
      </div>
      <p className="mt-2 text-sm text-center text-gray-300">{label}</p>
    </motion.div>
  );
};


// Main modal component
interface UnitRank {
  totalScore: string;
  correctAnswers: string;
  wrongAnswers: string;
  unitRank: {
    name: string;
    photo: string;
  };
}

interface RankUnitDetailModalProps {
  unit: UnitRank;
  isOpen: boolean;
  onClose: () => void;
}

const RankUnitDetailModal: React.FC<RankUnitDetailModalProps> = ({ unit, isOpen, onClose }) => {
  const [_showConfetti, setShowConfetti] = useState(false);


  // Trigger confetti animation when modal opens
  useEffect(() => {
    setTimeout(() => {
      setShowConfetti(true);
      const end = Date.now() + 1000;
      
      const colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"];
      
      (function frame() {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });
        
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }, 300);
  }, []);


  if (!unit) return null;
  
  // Calculate achievement level based on score
  const getAchievementLevel = (score: string) => {
    const numScore = parseFloat(score);
    if (numScore >= 150000) return { name: "Diamante", color: "from-blue-400 to-indigo-600", icon: Trophy };
    if (numScore >= 90000) return { name: "Platina", color: "from-indigo-400 to-purple-600", icon: Award };
    if (numScore >= 60000) return { name: "Ouro", color: "from-yellow-400 to-amber-600", icon: Star };
    if (numScore >= 25000) return { name: "Prata", color: "from-gray-300 to-gray-500", icon: Shield };
    return { name: "Bronze", color: "from-amber-600 to-yellow-800", icon: Shield };
  };
  
  // Calculate accuracy percentage
  const totalQuestions = parseInt(unit.correctAnswers) + parseInt(unit.wrongAnswers);
  const accuracyPercentage = totalQuestions > 0 
    ? Math.round((parseInt(unit.correctAnswers) / totalQuestions) * 100) 
    : 0;
  
  // Get level info for current unit
  //const levelInfo = getAchievementLevel(Math.floor(Number(unit.totalScore)).toLocaleString('pt-BR'));
  
  // Calculate mock progression to next level
  //const currentScore = parseFloat(Math.floor(Number(unit.totalScore)).toLocaleString('pt-BR'));
  
  const levelInfo = getAchievementLevel(unit.totalScore); // sem toLocaleString

  const currentScore = Number(unit.totalScore); // sem parseFloat e sem toLocaleString

  let nextLevelScore = 0;
  let nextLevelName = "";
  
  if (currentScore < 25000) {
    nextLevelScore = 25000;
    nextLevelName = "Prata";
  } else if (currentScore < 60000) {
    nextLevelScore = 60000;
    nextLevelName = "Ouro";
  } else if (currentScore < 90000) {
    nextLevelScore = 90000;
    nextLevelName = "Platina";
  } else if (currentScore < 150000) {
    nextLevelScore = 150000;
    nextLevelName = "Diamante";
  } else {
    // Already at highest level
    nextLevelScore = currentScore;
    nextLevelName = "Máximo";
  }
  
  const progressToNextLevel = Math.min(Math.round((currentScore / nextLevelScore) * 100), 100);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[400px] m-4">
      <motion.div
        //className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        //onClick={onClose}
      >
        <motion.div
          className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header with gradient & unit name */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900 via-indigo-800 to-purple-900"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
            
            {/* Close button
            <motion.button
              className="absolute top-4 right-4 p-1 rounded-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </motion.button> */}
            
            <div className="relative pt-12 pb-6 px-6 flex flex-col items-center">
              {/* Unit photo/avatar with pulse effect */}
              <motion.div 
                className="relative w-24 h-24 mb-3"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
              >
                <motion.div 
                  className="absolute inset-0 rounded-full bg-white opacity-20"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                />
                <img 
                  src={unit.unitRank.photo} 
                  alt={unit.unitRank.name}
                  className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg"
                />
                
                {/* Achievement badge */}
                <motion.div 
                  className={`absolute -bottom-2 -right-2 p-1 rounded-full bg-gradient-to-r ${levelInfo.color}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <levelInfo.icon className="w-5 h-5 text-white" />
                </motion.div>
              </motion.div>
              
              {/* Unit Name */}
              <motion.h2 
                className="text-2xl font-bold text-white mb-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Unidade {unit.unitRank.name}
              </motion.h2>
              
              {/* Level display */}
              <motion.div 
                className={`px-3 py-1 rounded-full bg-gradient-to-r ${levelInfo.color} text-white text-sm font-medium`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Nível {levelInfo.name}
              </motion.div>
              
              {/* Score display */}
              <motion.div 
                className="mt-4 relative flex flex-col items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <span className="text-gray-300 text-sm">Pontuação Total</span>
                <motion.span 
                  className="text-4xl font-bold text-white"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    delay: 0.5, 
                    type: "spring", 
                    stiffness: 200 
                  }}
                >
                  {/* {parseFloat(unit.totalScore).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} */}
                  {Math.floor(Number(unit.totalScore)).toLocaleString('pt-BR')}
                </motion.span>
                
                {/* Sparkles animation */}
                <motion.div 
                  className="absolute -right-6 -top-3 text-yellow-300"
                  animate={{ 
                    rotate: [0, 20, 0, -20, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                >
                  <Star className="w-6 h-6 fill-current" />
                </motion.div>
              </motion.div>
            </div>
          </div>
          
          {/* Stats & Detail Area */}
          <div className="bg-gray-900 p-6">
            {/* Progress to next level */}
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex justify-between mb-1 items-center">
                <span className="text-gray-300 text-sm">Progresso para {nextLevelName}</span>
                <span className="text-gray-300 text-sm font-medium">{progressToNextLevel}%</span>
              </div>
              <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${levelInfo.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNextLevel}%` }}
                  transition={{ duration: 1, delay: 0.7 }}
                />
              </div>
            </motion.div>
            
            {/* Achievement badges */}
            <motion.div 
              className="w-full grid grid-cols-3 gap-2 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <AchievementBadge 
                level="Performance" 
                score={`${accuracyPercentage}%`} 
                color="from-green-500 to-emerald-700"
                icon={Zap}
              />
              <AchievementBadge 
                level="Consistência" 
                score={parseInt(unit.correctAnswers) > 10 ? "Alta" : "Média"} 
                color="from-blue-500 to-cyan-700"
                icon={TrendingUp}
              />
              <AchievementBadge 
                level="Precisão"
                score={parseInt(unit.wrongAnswers) === 0 ? "Perfeita" : "Boa"} 
                color="from-purple-500 to-indigo-700"
                icon={Target}
              />
            </motion.div>
            
            {/* Statistics circles */}
            <motion.div 
              className="flex justify-between mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <ProgressCircle 
                value={unit.correctAnswers} 
                maxValue={totalQuestions} 
                color="#22c55e" 
                label="Respostas Corretas" 
                icon={Check} 
              />
              <ProgressCircle 
                value={unit.wrongAnswers} 
                maxValue={totalQuestions} 
                color="#ef4444" 
                label="Respostas Erradas" 
                icon={AlertCircle} 
              />
              <ProgressCircle 
                value={`${accuracyPercentage}%`} 
                maxValue={100} 
                color="#8b5cf6" 
                label="Taxa de Acerto" 
                icon={BarChart2} 
              />
            </motion.div>
            
            {/* Action button */}
            {/* <motion.button
              className={`w-full py-3 px-6 mt-2 rounded-xl font-bold text-white bg-gradient-to-r ${levelInfo.color} shadow-lg hover:shadow-xl transform transition`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              Ver Histórico Completo
            </motion.button> */}
          </div>
        </motion.div>
      </motion.div>
    </Modal>
  );
};


export default RankUnitDetailModal;
























// import { motion } from "framer-motion";
// import { ChevronLeft } from "lucide-react";

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

// interface DetailModalProps {
//   unit: UnitRank;
//   onClose: () => void;
// }

// export const RankUnitDetailModal = ({ unit, onClose }: DetailModalProps) => {
//   return (
//     <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         exit={{ opacity: 0, scale: 0.9 }}
//         className="relative w-full max-w-md p-6 mx-4 rounded-xl shadow-xl bg-white dark:bg-gray-800"
//       >
//         <button
//           onClick={onClose}
//           className="absolute p-1 rounded-full top-4 right-4 hover:bg-gray-100 dark:hover:bg-gray-700"
//         >
//           <ChevronLeft size={20} />
//         </button>
        
//         <motion.div className="flex flex-col items-center">
//           <motion.div className="relative mb-4">
//             <motion.div className="w-24 h-24 overflow-hidden rounded-full ring-4 ring-blue-500">
//               {unit.unitRank.photo ? (
//                 <img 
//                   src={unit.unitRank.photo} 
//                   alt={unit.unitRank.name} 
//                   className="object-cover w-full h-full"
//                 />
//               ) : (
//                 <motion.div className="flex items-center justify-center w-full h-full text-3xl font-bold text-white bg-blue-600">
//                   {unit.unitRank.name.charAt(0)}
//                 </motion.div>
//               )}
//             </motion.div>
//           </motion.div>
          
//           <h3 className="mb-2 text-xl font-bold text-center">{unit.unitRank.name}</h3>
          
//           <motion.div className="w-full mt-6 space-y-4">
//             <motion.div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30">
//               <span className="font-medium text-gray-700 dark:text-gray-300">Pontuação Total</span>
//               <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{unit.totalScore}</span>
//             </motion.div>
            
//             <motion.div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/30">
//               <span className="font-medium text-gray-700 dark:text-gray-300">Respostas Corretas</span>
//               <span className="text-lg font-bold text-green-600 dark:text-green-400">{unit.correctAnswers}</span>
//             </motion.div>
            
//             <motion.div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/30">
//               <span className="font-medium text-gray-700 dark:text-gray-300">Respostas Incorretas</span>
//               <span className="text-lg font-bold text-red-600 dark:text-red-400">{unit.wrongAnswers}</span>
//             </motion.div>
//           </motion.div>
          
//           <button
//             onClick={onClose}
//             className="w-full py-3 mt-8 font-medium text-white transition-colors rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
//           >
//             Fechar
//           </button>
//         </motion.div>
//       </motion.div>
//     </motion.div>
//   );
// };
