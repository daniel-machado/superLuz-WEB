import { motion } from "framer-motion";
import { Award } from "lucide-react";

interface Ranking {
  dbvId: string;  
  totalScore: string;
  individualRank:{
    name: string;
    photoUrl: string | null
  }
}


interface TableProps {
  ranking: Ranking[];
  handleOpenDetail: (ranking: Ranking) => void;
}

export default function TableView({ ranking, handleOpenDetail }: TableProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Desktop view (md and up) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-blue-900 bg-opacity-40 text-white border-b border-blue-700">
              <th className="py-3 px-4 text-left font-semibold w-16">#</th>
              <th className="py-3 px-4 text-left font-semibold">Dbv</th>
              <th className="py-3 px-4 text-right font-semibold">Pontuação</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((ranking, index) => (
              <motion.tr
                key={ranking.dbvId}
                whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                onClick={() => handleOpenDetail(ranking)}
                className="border-b border-gray-700 hover:bg-blue-900 hover:bg-opacity-10 cursor-pointer transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <td className="py-3 px-4 font-medium">
                  <div className="flex items-center">
                    {index < 3 ? (
                      <div className={`flex justify-center items-center rounded-full w-8 h-8
                        ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-300' : 'bg-amber-700'}
                        bg-opacity-90 shadow-lg`}
                      >
                        <Award
                          className={`w-5 h-5 ${index === 0 ? 'text-yellow-900' : index === 1 ? 'text-gray-700' : 'text-amber-300'}`}
                        />
                      </div>
                    ) : (
                      <div className="px-2 font-semibold text-gray-400">{index + 1}</div>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 mr-3">
                      {ranking.individualRank.photoUrl ? (
                        <img
                          src={ranking.individualRank.photoUrl}
                          alt={ranking.individualRank.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-800 text-white font-bold">
                          {ranking.individualRank.name?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="font-medium text-white">{ranking.individualRank.name}</div>
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="font-bold text-blue-400">{ranking.totalScore}</span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view (small screens) */}
      <div className="md:hidden">
        {ranking.map((ranking, index) => (
          <motion.div
            key={ranking.dbvId}
            whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
            onClick={() => handleOpenDetail(ranking)}
            className="border-b border-gray-700 hover:bg-blue-900 hover:bg-opacity-10 cursor-pointer transition-colors p-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                {/* Position/Rank indicator */}
                {index < 3 ? (
                  <div className={`flex justify-center items-center rounded-full w-8 h-8 mr-3
                    ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-300' : 'bg-amber-700'}
                    bg-opacity-90 shadow-lg`}
                  >
                    <Award
                      className={`w-5 h-5 ${index === 0 ? 'text-yellow-900' : index === 1 ? 'text-gray-700' : 'text-amber-300'}`}
                    />
                  </div>
                ) : (
                  <div className="flex justify-center items-center rounded-full w-8 h-8 mr-3 bg-gray-800 bg-opacity-50">
                    <span className="font-semibold text-gray-300">{index + 1}</span>
                  </div>
                )}

                {/* Unit photo and name */}
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 mr-3">
                    {ranking.individualRank.photoUrl ? (
                      <img
                        src={ranking.individualRank.photoUrl}
                        alt={ranking.individualRank.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-800 text-white font-bold">
                        {ranking.individualRank.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="font-medium text-white">{ranking.individualRank.name}</div>
                </div>
              </div>

              {/* Score */}
              <div className="text-right">
                <span className="font-bold text-blue-400 text-lg">{ranking.totalScore}</span>
              </div>
            </div>

          </motion.div>
        ))}
      </div>
    </div>
  );
}
