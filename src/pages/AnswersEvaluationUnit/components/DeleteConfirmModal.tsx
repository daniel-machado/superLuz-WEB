import { Modal } from '../../../components/ui/modal';
import Button from '../../../components/ui/button/Button';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  answer?: { text: string; id?: string } | null
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ isOpen, answer, onClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-[400px] ">
      <div className="p-6 space-y-4 no-scrollbar">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Confirmar Exclusão</h3>
        <p className="text-gray-600 dark:text-gray-300">
          Tem certeza que deseja excluir esta resposta?
        </p>
        {answer && answer.text && (
          <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 max-h-32 overflow-y-auto">
            <p className="text-gray-700 dark:text-gray-300 text-sm italic">"{answer.text.substring(0, 150)}{answer.text.length > 150 ? '...' : ''}"</p>
          </div>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <Button onClick={onClose} variant="outline">Cancelar</Button>
          <Button onClick={onConfirm} >Excluir</Button>
        </div>
      </div>
    </Modal>
  );
};
