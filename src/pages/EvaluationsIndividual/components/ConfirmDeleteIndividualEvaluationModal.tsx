import React from "react";
import { motion } from "framer-motion";
import { Modal } from '../../../components/ui/modal';
import Button from '../../../components/ui/button/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
  userName?: string; 
}

const ConfirmDeleteIndividualEvaluationModal: React.FC<Props> = ({ 
  isOpen, 
  onClose, 
  onConfirmDelete,
  userName
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="p-6"
      >
        <motion.h4
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-2xl font-semibold text-red-500"
        >
          Confirmar Exclusão
        </motion.h4>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 text-gray-500 dark:text-gray-400"
        >
          {userName 
            ? `Tem certeza de que deseja excluir a avaliação de ${userName}?` 
            : "Tem certeza de que deseja excluir esta avaliação individual?"} 
          Esta ação não pode ser desfeita.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-end gap-3"
        >
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={onConfirmDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Excluir
          </Button>
        </motion.div>
      </motion.div>
    </Modal>
  );
};

export default ConfirmDeleteIndividualEvaluationModal;
