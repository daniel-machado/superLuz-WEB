import { motion } from "framer-motion";
import { Medal, TrendingUp } from "lucide-react";

interface IndividualRank {
  dbvId: string;
  totalScore: string;
  individualRank: {
    name: string;
    photoUrl: string | null;
  };
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

// Medal Component
const MedalIcon = ({ position }: { position: number }) => {
  let color, icon;
  
  switch (position) {
    case 1:
      color = "text-yellow-400";
      icon = <Medal className="w-6 h-6" />;
      break;
    case 2:
      color = "text-gray-300";
      icon = <Medal className="w-6 h-6" />;
      break;
    case 3:
      color = "text-amber-700";
      icon = <Medal className="w-6 h-6" />;
      break;
    default:
      color = "text-blue-400";
      icon = <TrendingUp className="w-5 h-5" />;
  }

  return (
    <motion.div
      className={`${color} flex items-center justify-center`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 + position * 0.1 }}
    >
      {icon}
    </motion.div>
  );
};



const TableView = ({ ranking }: { ranking: IndividualRank[] }) => {
  return (
    <motion.div 
      className="relative z-10 overflow-x-auto rounded-lg shadow-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <table className="w-full text-sm text-left text-gray-300">
        <thead className="text-xs uppercase bg-indigo-900 bg-opacity-80 text-gray-100">
          <tr>
            <th scope="col" className="px-6 py-3 text-center">Posição</th>
            <th scope="col" className="px-6 py-3">Participante</th>
            <th scope="col" className="px-6 py-3 text-right">Pontuação</th>
          </tr>
        </thead>
        <motion.tbody>
          {ranking.map((person, index) => (
            <motion.tr 
              key={person.dbvId}
              className={`${
                index % 2 === 0 ? 'bg-gray-800 bg-opacity-80' : 'bg-gray-900 bg-opacity-80'
              } hover:bg-indigo-900 hover:bg-opacity-50 transition-all border-b border-gray-700 border-opacity-50`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ backgroundColor: 'rgba(79, 70, 229, 0.2)' }}
            >
              <td className="px-6 py-4 text-center">
                {index < 3 ? (
                  <span className="flex justify-center">
                    <MedalIcon position={index + 1} />
                  </span>
                ) : (
                  <span className="font-medium">{index + 1}</span>
                )}
              </td>
              <td className="px-6 py-4 flex items-center">
                <div className="mr-3">
                  <ProfilePicture 
                    photoUrl={person.individualRank.photoUrl} 
                    name={person.individualRank.name}
                    size="sm" 
                  />
                </div>
                <span className="font-medium truncate max-w-[150px] sm:max-w-[200px] md:max-w-[300px]">
                  {person.individualRank.name}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <motion.span 
                  className="font-bold text-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.3 + index * 0.05 }}
                >
                  {person.totalScore}
                  <span className="ml-1 text-xs text-purple-300">pts</span>
                </motion.span>
              </td>
            </motion.tr>
          ))}
        </motion.tbody>
      </table>
    </motion.div>
  );
};

export default TableView;