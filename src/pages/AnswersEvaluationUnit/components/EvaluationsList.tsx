import { motion } from 'framer-motion';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Badge from '../../../components/ui/badge/Badge';
import { Evaluation } from '../@types';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';


interface EvaluationsListProps {
  evaluations: Evaluation[] | null;
  onEvaluationClick: (evaluation: Evaluation) => void;
}

export const EvaluationsList: React.FC<EvaluationsListProps> = ({ evaluations, onEvaluationClick }) => {
  const { userRole } = useAuth();
  // Animation variants
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const getEvaluationStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'closed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Data indisponível";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error: any) {toast.error(`Error: ${error.message}`, {
          position: 'bottom-right',
          icon: '🚫',
          className: 'dark:bg-gray-800 dark:text-white',
          duration: 5000,
        });
      return "Data inválida";
    }
  };

  return (
    <motion.div
      variants={listVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {evaluations?.map((evaluation) => (
        <motion.div
          key={evaluation.id}
          variants={itemVariants}
          whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
          className={`border dark:border-gray-700 rounded-lg p-4 cursor-pointer transition-all ${
            evaluation.status === "open"
              ? "hover:border-yellow-400 dark:hover:border-yellow-500"
              : evaluation.status === "closed"
                ? "hover:border-green-400 dark:hover:border-green-500"
                : "hover:border-gray-400 dark:hover:border-gray-500"
          } bg-white dark:bg-gray-800`}
          onClick={() => {
            if (userRole === "director" || userRole === "admin") {
              onEvaluationClick(evaluation);
            } else {
              toast.error("Você não tem permissão para acessar esta avaliação.", {position: "bottom-right", duration: 3000}); 
            }
          }}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center">
              {getEvaluationStatusIcon(evaluation.status)}
              <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">
                Rodada {evaluation.week || "N/A"}
              </span>
            </div>
            {evaluation.status === "open" ? (
              <Badge color="success">
                {evaluation.status}
              </Badge>
            ) : (
              <Badge color="error">
                {evaluation.status}
              </Badge>
            )}
          </div>
        
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
            {evaluation.totalScore 
            ? `Pontuação: ${Math.floor(Number(evaluation.totalScore)).toLocaleString('pt-BR')}` 
            : `Avaliação ${evaluation.id.substring(0, 8)}`}
          </h3>
        
          <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mt-3">
            <span>
              {formatDate(evaluation.createdAt)}
            </span>
          
            {evaluation.status === "open" ? (
              <span className="flex items-center text-blue-600 dark:text-blue-400">
                Responder
              </span>
            ) : (
              <span className="flex items-center text-gray-600 dark:text-gray-400">
                Visualizar
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
