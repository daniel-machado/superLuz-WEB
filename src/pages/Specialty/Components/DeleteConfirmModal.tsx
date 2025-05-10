import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../../../components/ui/button/Button";
import { AlertTriangleIcon } from 'lucide-react'
import Spinner from "./Spinner";


interface DeleteConfirmModalProps {
  isOpen: boolean;
  loading: boolean;
  specialtyName: string;
  onClose: () => void;
  onConfirm: () => void;
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


const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  loading,
  specialtyName,
  onClose,
  onConfirm
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
              className="bg-white dark:bg-dark-800 rounded-lg shadow-xl max-w-md w-full overflow-hidden"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full mr-4">
                    <AlertTriangleIcon className="w-6 h-6 text-red-500 dark:text-red-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Confirmar exclusão
                  </h3>
                </div>
                
                <div className="mt-3 text-gray-600 dark:text-gray-300">
                  <p>
                    Tem certeza que deseja excluir a especialidade <span className="font-medium text-gray-900 dark:text-white">{specialtyName}</span>?
                  </p>
                  <p className="mt-2 text-sm text-red-500 dark:text-red-400">
                    Esta ação não poderá ser desfeita e todos os dados relacionados serão perdidos.
                  </p>
                </div>
                
                <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={loading}
                    className="mt-3 sm:mt-0"
                  >
                    Cancelar
                  </Button>
                  <Button
                    //variant="danger"
                    onClick={onConfirm}
                    disabled={loading}
                  >
                    {loading ? <Spinner size="sm" /> : "Excluir"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};


export default DeleteConfirmModal;
