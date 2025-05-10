// src/pages/modals/RemoveUserModal.tsx
import { Modal } from '../../components/ui/modal'
import Button from '../../components/ui/button/Button'

interface Props {
  isOpen: boolean;
  user: any | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const RemoveUserModal = ({ isOpen, user, onClose, onConfirm }: Props) => {
  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <h3 className="text-lg font-semibold mb-4">Remover Usuário</h3>
        <p className="mb-4">
          Tem certeza que deseja remover o usuário{" "}
          <strong>{user.userInfo.name}</strong> da classe?
        </p>
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={onConfirm}>Remover</Button>
        </div>
      </div>
    </Modal>
  );
};
