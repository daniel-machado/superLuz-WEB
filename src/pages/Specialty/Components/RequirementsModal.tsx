import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../../../components/ui/button/Button";
import { CheckCircleIcon, DoorClosed } from 'lucide-react'


interface ISpecialty {
  id: string;
  category: string;
  codeSpe?: string;
  numberSpe?: string;
  levelSpe?: number;
  yearSpe?: string;
  name: string;
  emblem?: string;
  requirements: string[];
  createdAt: string;
  updatedAt: string;
  hasQuiz?: boolean;
}


interface RequirementsModalProps {
  isOpen: boolean;
  specialty: ISpecialty;
  onClose: () => void;
}


const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};


const modalVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring", 
      damping: 25, 
      stiffness: 300 
    }
  },
  exit: { 
    opacity: 0, 
    y: 50, 
    scale: 0.95,
    transition: { 
      duration: 0.2 
    }
  }
};


const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3
    }
  }),
  hover: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    transition: { duration: 0.2 }
  }
};


const RequirementsModal: React.FC<RequirementsModalProps> = ({
  isOpen,
  specialty,
  onClose
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          >
            <motion.div
              className="bg-white dark:bg-dark-800 rounded-lg shadow-xl max-w-2xl w-full overflow-hidden"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  {specialty.emblem ? (
                    <img
                      src={specialty.emblem}
                      alt={specialty.name}
                      className="w-10 h-10 rounded-full object-cover bg-white dark:bg-gray-800 p-1 border border-gray-200 dark:border-gray-600"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-400 font-medium text-lg">
                        {specialty.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Requisitos da Especialidade
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {specialty.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <DoorClosed className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="space-y-1">
                  {specialty.requirements.map((requirement, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700"
                      custom={index}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                    >
                      <CheckCircleIcon className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5 mr-3" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {requirement}
                      </span>
                    </motion.div>
                  ))}
                </div>
                
                {specialty.requirements.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
                    <svg
                      className="w-16 h-16 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      ></path>
                    </svg>
                    <p className="text-lg">Nenhum requisito cadastrado</p>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <Button
                  variant="primary"
                  onClick={onClose}
                >
                  Fechar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};


export default RequirementsModal;
