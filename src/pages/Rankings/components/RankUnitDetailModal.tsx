
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

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

interface DetailModalProps {
  unit: UnitRank;
  onClose: () => void;
}

export const RankUnitDetailModal = ({ unit, onClose }: DetailModalProps) => {
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-md p-6 mx-4 rounded-xl shadow-xl bg-white dark:bg-gray-800"
      >
        <button
          onClick={onClose}
          className="absolute p-1 rounded-full top-4 right-4 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ChevronLeft size={20} />
        </button>
        
        <motion.div className="flex flex-col items-center">
          <motion.div className="relative mb-4">
            <motion.div className="w-24 h-24 overflow-hidden rounded-full ring-4 ring-blue-500">
              {unit.unitRank.photo ? (
                <img 
                  src={unit.unitRank.photo} 
                  alt={unit.unitRank.name} 
                  className="object-cover w-full h-full"
                />
              ) : (
                <motion.div className="flex items-center justify-center w-full h-full text-3xl font-bold text-white bg-blue-600">
                  {unit.unitRank.name.charAt(0)}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
          
          <h3 className="mb-2 text-xl font-bold text-center">{unit.unitRank.name}</h3>
          
          <motion.div className="w-full mt-6 space-y-4">
            <motion.div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30">
              <span className="font-medium text-gray-700 dark:text-gray-300">Pontuação Total</span>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{unit.totalScore}</span>
            </motion.div>
            
            <motion.div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/30">
              <span className="font-medium text-gray-700 dark:text-gray-300">Respostas Corretas</span>
              <span className="text-lg font-bold text-green-600 dark:text-green-400">{unit.correctAnswers}</span>
            </motion.div>
            
            <motion.div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/30">
              <span className="font-medium text-gray-700 dark:text-gray-300">Respostas Incorretas</span>
              <span className="text-lg font-bold text-red-600 dark:text-red-400">{unit.wrongAnswers}</span>
            </motion.div>
          </motion.div>
          
          <button
            onClick={onClose}
            className="w-full py-3 mt-8 font-medium text-white transition-colors rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            Fechar
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
