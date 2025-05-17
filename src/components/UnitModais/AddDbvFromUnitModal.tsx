import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";

import Label from "../form/Label";
import Select from "../form/Select";
import { userService } from "../../services/userService";
import { unitsService } from "../../services/unitsService";

type UserInfo = {
  id: string;
  name: string;
  role: string;
};

type Association = {
  userId: string;
  unitId: string;
};

interface UnitWithDbvs {
  id: string;
  name: string;
  photo: string;
  dbvs: Array<{
    dbv: {
      id: string;
      name: string;
      photoUrl?: string | null;
    }
  }>;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (unitData: any) => void;
  loading: boolean
}

const AddDbvFromUnitModal: React.FC<Props> = ({ isOpen, loading, onClose, onSave }) => {

  const [users, setUsers] = useState<UserInfo[]>([]);
  const [units, setUnits] = useState<UnitWithDbvs[]>([]);
  const [_isLoading, setIsLoading] = useState(true);
  const [newAssociation, setNewAssociation] = useState<Association>({
    userId: '',
    unitId: ''
  });


    useEffect(() => {
      fetchUsers();
      fetchUnits();
    }, []);

    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await userService.getAllUsers();
        const filteredUsers = response.filter((user: UserInfo) => user.role === "dbv");
        setUsers(filteredUsers);
        return filteredUsers;
      } catch (error: any) {
        toast.error(`Error: ${error.message}`, {
          position: 'bottom-right',
          icon: '🚫',
          duration: 5000,
        });
        return [];
      } finally {
        setIsLoading(false);
      }
    };


    const fetchUnits = async () => {
      setIsLoading(true)
    try {
      const response = await unitsService.ListAllUnits();
      setUnits(response.units.units);
      setIsLoading(false)
      return response.units.units
    } catch (error: any) {
      toast.error(`Error: ${error.message}`, {
          position: 'bottom-right',
          icon: '🚫',
          duration: 5000,
        });
      return [];
    }finally {
      setIsLoading(false)
    }
  };

   // Quando dados estiverem disponíveis, parar o loading
  useEffect(() => {
    if (Array.isArray(users) && Array.isArray(units)) {
      setIsLoading(false);
    }
  }, [users, units]);

    // Resetar associação ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      setNewAssociation({ userId: '', unitId: '' });
    }
  }, [isOpen]);

  const handleSave = () => {
    if (newAssociation.userId && newAssociation.unitId) {
        onSave(newAssociation);
        onClose();
    } else {
      alert('Preencha todos os campos.');
    }
  };

    const userOptions = users.map((user) => ({
    label: user.name,
    value: user.id,
  }));

    const unitOptions = units.map((cls) => ({
    label: cls.name,
    value: cls.id,
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[500px] m-4">
      <div className="no-scrollbar relative w-full max-w-[500px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Adicionar Desbravador
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Selecione o desbravador e a unidade para associar ele a uma unidade
          </p>
        </div>

        {/* Nome da unidade */}
        <form className="flex flex-col">
          <div className="custom-scrollbar h-[300px] overflow-y-auto px-2 pb-3">
              
            <div className="mt-5">
              <Label>Selecione o Desbravador</Label>
               <Select
                  options={userOptions}
                  placeholder="Selecione um dbv"
                  onChange={(value) =>
                    setNewAssociation((prev) => ({ ...prev, userId: value }))
                  }
                  defaultValue={newAssociation.userId}
                />
            </div>

            
              <div className="mt-5">
                <Label>Selecione a Unidade</Label>
                <Select
                  options={unitOptions}
                  placeholder="Selecione uma unidade"
                  onChange={(value) =>
                    setNewAssociation((prev) => ({ ...prev, unitId: value }))
                  }
                  defaultValue={newAssociation.unitId}
                />
              </div>
          
          </div>
        </form>
        {/* Botões */}
        <div className="flex justify-end gap-3">
          <Button size="sm" variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button size="sm" onClick={handleSave}>
            {loading ? "Adicionando dbv..." : "Adicionar dbv"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddDbvFromUnitModal;
