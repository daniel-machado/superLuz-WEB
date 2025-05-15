// src/pages/modals/RemoveUserModal.tsx
import { Modal } from '../../components/ui/modal'
import Button from '../../components/ui/button/Button'

interface ClassUser {
  id: string;
  userId: string;
  classId: string;
  assignedBy: string;
  createdAt: string;
  updatedAt: string;
  classUser: {
    name: string;
    photoUrl: string | null;
  };
  classInfo: {
    name: string;
    emblem: string;
    type: string;
  };
}

interface Props {
  isOpen: boolean;
  user: ClassUser | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const RemoveUserModal = ({ isOpen, user, onClose, onConfirm }: Props) => {
  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[500px] m-4">
      <div className="no-scrollbar relative w-full overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-lg font-bold text-red-500">
            Remover usuário
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Tem certeza que deseja remover o usuário{" "}
            <strong>{user.classUser.name}</strong> da classe de 
            <strong className='text-green-500 font-bold'> {user.classInfo.name} </strong>😱
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={onConfirm}>Remover</Button>
        </div>
      </div>
    </Modal>
  );
};
