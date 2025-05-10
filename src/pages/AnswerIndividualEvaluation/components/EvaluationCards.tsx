import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle, AlertCircle, Clock } from 'lucide-react';


interface Evaluation {
  id: string;
  week: number;
  status: 'open' | 'closed' | 'pending';
  createdAt?: string;
}

interface EvaluationCardsProps {
  evaluations: Evaluation[];
  onEvaluationClick: (evaluation: Evaluation) => void;
}

export const EvaluationCards: React.FC<EvaluationCardsProps> = ({ evaluations, onEvaluationClick }) => {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };


  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };


  const getStatusColor = (status: 'open' | 'closed' | 'pending') => {
    switch (status) {
      case 'open': return 'text-green-400';
      case 'closed': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };


  const getStatusIcon = (status: 'open' | 'closed' | 'pending') => {
    switch (status) {
      case 'open': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'closed': return <AlertCircle className="w-5 h-5 text-red-400" />;
      default: return <Clock className="w-5 h-5 text-yellow-400" />;
    }
  };


  if (evaluations.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-md"
      >
        <Calendar className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Nenhuma avaliação disponível</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
          Não há avaliações cadastradas para este desbravador no momento.
        </p>
      </motion.div>
    );
  }


  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <AnimatePresence>
        {evaluations.map((evaluation) => (
          <motion.div 
            key={evaluation.id}
            variants={item}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700 cursor-pointer"
            onClick={() => onEvaluationClick(evaluation)}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-yellow-500 mr-2" />
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    Semana {evaluation.week}
                  </h3>
                </div>
                <div className={`flex items-center ${getStatusColor(evaluation.status)}`}>
                  {getStatusIcon(evaluation.status)}
                  <span className="text-sm ml-1 capitalize">
                    {evaluation.status === 'open' ? 'Aberta' : 'Fechada'}
                  </span>
                </div>
              </div>
              
              <div className="mt-2">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {evaluation.createdAt 
                    ? new Date(evaluation.createdAt).toLocaleDateString('pt-BR') 
                    : 'Data não disponível'}
                </p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-colors text-sm font-medium">
                  {evaluation.status === 'open' ? 'Responder Avaliação' : 'Visualizar Respostas'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};
