import React from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
}

const DeleteUnitModal: React.FC<Props> = ({ isOpen, onClose, onConfirmDelete }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="p-4 space-y-4">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-red-500">
            Confirmar Exclusão
          </h4>
          <p className="mb-10 mt-10 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Tem certeza de que deseja excluir esta unidade? Essa ação não pode ser desfeita.
          </p>
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={onConfirmDelete}>
            Excluir
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteUnitModal;
