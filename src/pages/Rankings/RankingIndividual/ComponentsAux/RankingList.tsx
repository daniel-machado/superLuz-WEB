import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Minus } from 'lucide-react';

interface Ranking {
  dbvId: string;  
  totalScore: string;
  individualRank:{
    name: string;
    photoUrl: string | null
  }
}

interface RankingProps {
  rankings: Ranking[];
  handleOpenDetail: (ranking: Ranking) => void;
}

const RankingList = ({ rankings, handleOpenDetail }: RankingProps) => {

  // Helper function to get trend icon (up, down, stable)
  const getTrendIcon = (index: number, previousPosition: number | null) => {
    console.log("INDEX", index, "PREVIOUS POSITION", previousPosition);
    // This is a mock implementation - replace with your actual logic
    const trend = Math.floor(Math.random() * 3); // 0: up, 1: down, 2: stable
    
    if (trend === 0) {
      return (
        <motion.div className="flex items-center text-green-500">
          <ChevronUp className="w-4 h-4 mr-1" />
          <span className="text-xs">2</span>
        </motion.div>
      );
    } else if (trend === 1) {
      return (
        <motion.div className="flex items-center text-red-500">
          <ChevronDown className="w-4 h-4 mr-1" />
          <span className="text-xs">1</span>
        </motion.div>
      );
    } else {
      return (
        <motion.div className="flex items-center text-gray-500">
          <Minus className="w-4 h-4" />
        </motion.div>
      );
    }
  };

  return (
    <motion.div className="p-4">
      <motion.div className="space-y-3">
        <AnimatePresence>
          {rankings.map((ranking, index) => (
            <motion.div
              key={ranking.dbvId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="flex items-center p-3 transition-colors bg-white border rounded-lg cursor-pointer dark:border-gray-700 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              onClick={() => handleOpenDetail(ranking)}
            >
              <motion.div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 mr-3 text-sm font-bold text-gray-700 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300">
                {index + 4}
              </motion.div>
              
              <motion.div className="relative w-8 h-8 sm:w-10 sm:h-10 mr-3 overflow-hidden rounded-full">
                {ranking.individualRank.photoUrl ? (
                  <img
                    src={ranking.individualRank.photoUrl}
                    alt={ranking.individualRank.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <motion.div className="flex items-center justify-center w-full h-full text-sm font-bold text-white bg-blue-600">
                    {ranking.individualRank.name.charAt(0)}
                  </motion.div>
                )}
              </motion.div>
              
              <motion.div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate dark:text-white">{ranking.individualRank.name}</p>
              </motion.div>
              
              <motion.div className="flex items-center">
                <motion.div className="mr-2 hidden sm:block">{getTrendIcon(index, null)}</motion.div>
                <motion.div className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-bold text-white bg-blue-600 rounded-full dark:bg-blue-700">
                  {ranking.totalScore}
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {rankings.length === 0 && (
          <motion.div className="flex flex-col items-center justify-center p-8 text-gray-500 dark:text-gray-400">
            <p>Nenhuma outra unidade no ranking</p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default RankingList;
