import { useEffect, useState } from 'react';
import { Modal } from '../../components/ui/modal';
import Select from '../../components/form/Select';
import Button from '../../components/ui/button/Button';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

type UserInfo = {
  id: string;
  name: string;
  role: string;
};

type ClassInfo = {
  id: string;
  name: string;
};

type Association = {
  userId: string;
  classId: string;
  assignedBy: string;
};

interface Props {
  isOpen: boolean;
  users: UserInfo[];
  classes: ClassInfo[];
  onClose: () => void;
  onSave: (assoc: Association) => void;
}

const Spinner = () => (
  <div className="flex justify-center items-center h-40">
    <motion.div
      className={twMerge(
        "w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"
      )}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    />
  </div>
);

export const AssociationModal = ({
  isOpen,
  users,
  classes,
  onClose,
  onSave,
}: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [newAssociation, setNewAssociation] = useState<Association>({
    userId: '',
    classId: '',
    assignedBy: '',
  });

  // Resetar associação ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      setNewAssociation({ userId: '', classId: '', assignedBy: '' });
    }
  }, [isOpen]);

  // Quando dados estiverem disponíveis, parar o loading
  useEffect(() => {
    if (Array.isArray(users) && Array.isArray(classes)) {
      setIsLoading(false);
    }
  }, [users, classes]);

  const handleSave = () => {
    if (newAssociation.userId && newAssociation.classId && newAssociation.assignedBy) {
      onSave(newAssociation);
      onClose();
    } else {
      alert('Preencha todos os campos.');
    }
  };

  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <Spinner />
      </Modal>
    );
  }

  const userOptions = users.map((user) => ({
    label: user.name,
    value: user.id,
  }));

  const classOptions = classes.map((cls) => ({
    label: cls.name,
    value: cls.id,
  }));

  const responsibleOptions = users
    .filter((user) => user.role === 'admin' || user.role === 'director')
    .map((user) => ({
      label: user.name,
      value: user.id,
    }));

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <h3 className="text-lg font-semibold mb-4">Associar Usuário à Classe</h3>
        <div className="space-y-4">
          <div>
            <Select
              options={userOptions}
              placeholder="Selecione um usuário"
              onChange={(value) =>
                setNewAssociation((prev) => ({ ...prev, userId: value }))
              }
              defaultValue={newAssociation.userId}
            />
          </div>

          <div>
            <Select
              options={classOptions}
              placeholder="Selecione uma classe"
              onChange={(value) =>
                setNewAssociation((prev) => ({ ...prev, classId: value }))
              }
              defaultValue={newAssociation.classId}
            />
          </div>

          <div>
            <Select
              options={responsibleOptions}
              placeholder="Nome do responsável"
              onChange={(value) =>
                setNewAssociation((prev) => ({ ...prev, assignedBy: value }))
              }
              defaultValue={newAssociation.assignedBy}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="primary" onClick={handleSave}>Salvar</Button>
        </div>
      </div>
    </Modal>
  );
};
