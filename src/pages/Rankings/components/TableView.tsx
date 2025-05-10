import { motion } from "framer-motion";
import { Award } from "lucide-react";

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

interface TableProps {
  ranking: UnitRank[];
  handleOpenDetail: (unitRank: any) => void;
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
              <th className="py-3 px-4 text-left font-semibold">Unidade</th>
              <th className="py-3 px-4 text-right font-semibold">Acertos</th>
              <th className="py-3 px-4 text-right font-semibold">Erros</th>
              <th className="py-3 px-4 text-right font-semibold">Pontuação</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((unit, index) => (
              <motion.tr
                key={unit.unitId}
                whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                onClick={() => handleOpenDetail(unit)}
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
                      {unit.unitRank.photo ? (
                        <img
                          src={unit.unitRank.photo}
                          alt={unit.unitRank.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-800 text-white font-bold">
                          {unit.unitRank.name?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="font-medium text-white">{unit.unitRank.name}</div>
                  </div>
                </td>
                <td className="py-3 px-4 text-right font-medium text-green-400">
                  {unit.correctAnswers}
                </td>
                <td className="py-3 px-4 text-right font-medium text-red-400">
                  {unit.wrongAnswers}
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="font-bold text-blue-400">{unit.totalScore}</span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view (small screens) */}
      <div className="md:hidden">
        {ranking.map((unit, index) => (
          <motion.div
            key={unit.unitId}
            whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
            onClick={() => handleOpenDetail(unit)}
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
                    {unit.unitRank.photo ? (
                      <img
                        src={unit.unitRank.photo}
                        alt={unit.unitRank.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-800 text-white font-bold">
                        {unit.unitRank.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="font-medium text-white">{unit.unitRank.name}</div>
                </div>
              </div>

              {/* Score */}
              <div className="text-right">
                <span className="font-bold text-blue-400 text-lg">{unit.totalScore}</span>
              </div>
            </div>

            {/* Stats row */}
            <div className="flex justify-between text-sm mt-1 px-11">
              <div className="flex space-x-2">
                <span className="text-green-400 font-medium">{unit.correctAnswers} acertos</span>
                <span className="text-gray-500">|</span>
                <span className="text-red-400 font-medium">{unit.wrongAnswers} erros</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
