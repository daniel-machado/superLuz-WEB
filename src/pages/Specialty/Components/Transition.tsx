import { EyeIcon, TrashIcon, PencilIcon } from "lucide-react";
import { motion } from "framer-motion";

interface Specialty {
  id: string;
  category: string;
  codeSpe: string
  numberSpe: string
  levelSpe: string
  yearSpe: string
  name: string
  emblem: string
  requirements: string
  createdAt: string
  updatedAt: string
}

interface SpecialtyCardProps {
  specialty: Specialty;
  categoryColor: string;
  onEdit: () => void;
  onDelete: () => void;
  onViewRequirements: () => void;
}


const SpecialtyCard: React.FC<SpecialtyCardProps> = ({
  specialty,
  categoryColor,
  onEdit,
  onDelete,
  onViewRequirements,
}) => {
  const levelText = specialty.levelSpe 
    ? `Nível ${specialty.levelSpe}` 
    : "Sem nível";


  // Extrair a cor principal da string de classe
  const colorClass = categoryColor.split(' ')[0];
  
  // Criar classes de hover com base na cor da categoria
  const hoverColorMap: Record<string, string> = {
    "bg-blue-500": "hover:bg-blue-600",
    "bg-yellow-500": "hover:bg-yellow-600",
    "bg-green-500": "hover:bg-green-600",
    "bg-purple-500": "hover:bg-purple-600",
    "bg-red-500": "hover:bg-red-600",
    "bg-pink-500": "hover:bg-pink-600",
    "bg-emerald-500": "hover:bg-emerald-600",
    "bg-orange-500": "hover:bg-orange-600",
    "bg-indigo-500": "hover:bg-indigo-600",
    "bg-gray-700": "hover:bg-gray-800",
  };
  
  const hoverClass = hoverColorMap[colorClass] || "hover:bg-gray-600";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col h-full border border-gray-200 dark:border-gray-700"
    >
      <div className={`${categoryColor} px-4 py-2`}>
        <h3 className="font-medium truncate" title={specialty.name}>
          {specialty.name}
        </h3>
        <div className="text-xs opacity-90">{levelText}</div>
      </div>
      
      <div className="flex-grow p-3 text-sm text-gray-600 dark:text-gray-300">
        <p className="line-clamp-2" title={specialty.name || "Sem descrição"}>
          {specialty.name || "Sem descrição"}
        </p>
      </div>
      
      <div className="flex justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onViewRequirements}
          className={`text-white ${colorClass} ${hoverClass} p-1.5 rounded-md flex items-center justify-center transition-colors duration-200`}
          title="Ver requisitos"
        >
          <EyeIcon className="h-4 w-4" />
        </button>
        
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white p-1.5 rounded-md flex items-center justify-center transition-colors duration-200"
            title="Editar"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1.5 rounded-md flex items-center justify-center transition-colors duration-200"
            title="Excluir"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};


export default SpecialtyCard;
