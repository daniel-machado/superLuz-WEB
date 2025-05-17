import { motion } from "framer-motion";

interface IndividualRank {
  dbvId: string;
  totalScore: string;
  individualRank: {
    name: string;
    photoUrl: string | null;
  };
}

interface IndividualRankingListProps {
  rankings: IndividualRank[];
  startIndex?: number;
}

// Profile Picture Component
interface ProfilePictureProps {
  photoUrl: string | null;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const ProfilePicture = ({ photoUrl, name, size = "md" }: ProfilePictureProps) => {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-32 h-32"
  };

  const fontSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl"
  };

  const initials = name
    ? name
        .split(" ")
        .map(part => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return photoUrl ? (
    <motion.div
      className={`${sizeClasses[size]} rounded-full overflow-hidden border-4 border-white shadow-lg`}
      whileHover={{ scale: 1.05 }}
    >
      <img 
        src={photoUrl} 
        alt={name} 
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "https://via.placeholder.com/150?text=" + initials;
        }} 
      />
    </motion.div>
  ) : (
    <motion.div
      className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center border-4 border-white shadow-lg`}
      whileHover={{ scale: 1.05 }}
    >
      <span className={`${fontSizeClasses[size]} font-bold text-white`}>{initials}</span>
    </motion.div>
  );
};


const IndividualRankingList = ({ rankings, startIndex = 4 }: IndividualRankingListProps) => {
  return (
    <motion.div 
      className="bg-gray-900 bg-opacity-95 rounded-lg shadow-inner py-2 px-4 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-gray-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      {rankings.length === 0 ? (
        <p className="text-center text-gray-400 py-4">Nenhum participante encontrado</p>
      ) : (
        <ul className="space-y-2">
          {rankings.map((person, index) => (
            <motion.li 
              key={person.dbvId}
              className="flex items-center p-2 rounded-lg bg-gray-800 bg-opacity-60 hover:bg-opacity-90 transition-all"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              whileHover={{ scale: 1.02, x: 5 }}
            >
              <div className="flex items-center justify-center w-8">
                <span className="font-bold text-gray-400 text-sm">#{startIndex + index}</span>
              </div>
              
              <div className="ml-2">
                <ProfilePicture 
                  photoUrl={person.individualRank.photoUrl} 
                  name={person.individualRank.name}
                  size="sm" 
                />
              </div>
              
              <div className="ml-3 flex-1 overflow-hidden">
                <h4 className="font-medium text-white truncate">{person.individualRank.name}</h4>
              </div>
              
              <div className="flex items-center">
                <motion.div 
                  className="font-bold text-lg text-white bg-indigo-700 bg-opacity-50 px-3 py-1 rounded-full"
                  whileHover={{ scale: 1.1 }}
                >
                  {/* {person.totalScore} */}
                  {Math.floor(Number(person.totalScore)).toLocaleString('pt-BR')}
                  <span className="ml-1 text-xs opacity-70">pts</span>
                </motion.div>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};

export default IndividualRankingList