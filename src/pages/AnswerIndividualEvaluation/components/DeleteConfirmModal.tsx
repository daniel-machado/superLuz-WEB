
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { Modal } from '../../../components/ui/modal';


interface DeleteConfirmModalProps {
  isOpen: boolean;
  answer?: { text: string; id?: string } | null
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ 
  isOpen, 
  answer, 
  onClose, 
  onConfirm }) => {
  if (!isOpen) return null;


  // Animation variants
  const backdrop = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };


  const modal = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { delay: 0.1 } }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-[400px] ">
    <AnimatePresence>
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <motion.div
            className="fixed inset-0 "
            variants={backdrop}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />
          
          <div className="flex items-center justify-center min-h-screen px-4 py-6 text-center">
            <motion.div
              className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
              variants={modal}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative p-6">
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>


                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-500 dark:text-red-400" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Confirmar exclusão
                  </h3>

                  <div className='flex items-center text-center'>
                    <h4 className="text-md font-bold text-gray-900 dark:text-white mb-2 mr-3">
                      Resposta:
                    </h4>
                    {answer && answer.text && (
                      <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 max-h-32 overflow-y-auto">
                        <p className="text-gray-700 dark:text-gray-300 text-sm italic">"{answer.text.substring(0, 150)}{answer.text.length > 150 ? '...' : ''}"</p>
                      </div>
                    )}

                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Tem certeza que deseja excluir esta resposta? Esta ação não pode ser desfeita.
                  </p>
                  
                  <div className="flex space-x-3 w-full">
                    <button
                      onClick={onClose}
                      className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={onConfirm}
                      className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors font-medium"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

    </AnimatePresence>
    </Modal>
  );
};
