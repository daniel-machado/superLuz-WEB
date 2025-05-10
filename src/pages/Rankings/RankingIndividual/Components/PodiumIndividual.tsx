import { motion } from "framer-motion";

interface IndividualRank {
  dbvId: string;
  totalScore: string;
  individualRank: {
    name: string;
    photoUrl: string | null;
  };
}

interface IndividualPodiumProps {
  topThree: IndividualRank[];
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


const IndividualPodium = ({ topThree }: IndividualPodiumProps) => {
  const podiumOrder = [1, 0, 2]; // 2nd, 1st, 3rd places
  
  return (
    <motion.div 
      className="flex justify-center items-end mt-10 mb-8 relative z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {podiumOrder.map((index, i) => {
        const person = topThree[index];
        if (!person) return null;
        
        const podiumPosition = index === 0 ? 1 : index === 1 ? 2 : 3;
        const heights = {
          0: "h-36",
          1: "h-48",
          2: "h-24"
        };
        
        const marginTop: Record<number, string> = {
          0: "mt-12",
          1: "mt-0",
          2: "mt-24"
        };
        
        return (
          <motion.div 
            key={person.dbvId}
            className={`relative flex flex-col items-center mx-2 ${marginTop[i as keyof typeof marginTop]} z-${10-i}`}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 100, 
              damping: 10, 
              delay: i * 0.2 
            }}
          >
            <motion.div 
              className="absolute -top-4 left-0 right-0 flex justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.6 + i * 0.1 }}
            >
              <div className="bg-white bg-opacity-90 rounded-full px-4 py-1 shadow-lg">
                <span className="font-bold text-lg text-indigo-900">#{podiumPosition}</span>
              </div>
            </motion.div>
            
            <ProfilePicture 
              photoUrl={person.individualRank.photoUrl} 
              name={person.individualRank.name} 
              size={index === 0 ? "xl" : "lg"} 
            />
            
            <motion.div 
              className="mt-2 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.2 }}
            >
              <h3 className="font-bold text-white text-md sm:text-lg whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[120px]">
                {person.individualRank.name}
              </h3>
              <motion.div 
                className="text-white font-bold text-xl sm:text-2xl flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.5 + i * 0.2 }}
              >
                <span>{person.totalScore}</span>
                <motion.span 
                  className="ml-1 text-xs text-purple-300"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  pts
                </motion.span>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className={`${heights[index as keyof typeof heights]} w-24 sm:w-32 rounded-t-lg bg-gradient-to-b from-indigo-600 to-indigo-800 mt-4 flex items-center justify-center relative overflow-hidden shadow-lg`}
              initial={{ height: 0 }}
              animate={{ height: parseInt(heights[index as keyof typeof heights].replace("h-", ""), 10) * 4 }}
              transition={{ 
                type: "spring", 
                stiffness: 100, 
                damping: 15, 
                delay: 0.4 + i * 0.2 
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-20"></div>
              <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white to-transparent opacity-30"></div>
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default IndividualPodium