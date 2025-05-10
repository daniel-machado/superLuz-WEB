import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Modal } from '../../../components/ui/modal';
import Button from '../../../components/ui/button/Button';
import Select from '../../../components/form/Select';
import Label from '../../../components/form/Label';
import Input from '../../../components/form/input/InputField';
import { useAuth } from '../../../context/AuthContext'
import { userService } from '../../../services/userService'
import { unitsService } from "../../../services/unitsService";

interface User {
  id: string;
  name: string;
  email: string;
  birthDate: string;
  role: string;
  photoUrl: string | null;
  status: string;
}

// interface CounselorUnit {
//   id: string;
//   unitId: string;
//   userId: string;
// }

interface Unit {
  dbv: any;
  id: string;
  name: string;
  dbvs: {
    id: string;
    name: string;
  }
}

interface IndividualEvaluationInput {
  userId: string;
  week: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (evaluation: IndividualEvaluationInput) => void;
}

const CreateIndividualEvaluationModal: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [week, setWeek] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Verificar o papel do usuário logado
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      //const role = (user as unknown as User).role;
      const role = user.user.user.role;
      
      if (role === "admin" || role === "director") {
        // Buscar todos os usuários com papel "dbv"
        const response = await userService.getAllUsers();
        const allUsers = response || [];
        const dbvUsers = allUsers.filter((u: User) => u.role === "dbv");
        setUsers(dbvUsers.map((u: User) => ({ id: u.id, name: u.name })));
      } 
      else if (role === "counselor") {
        // Verificar se o counselor está associado a uma unidade
        const counselorUnitResponse = await unitsService.existCounselorUnit(user.user.user.id);
        
        if (!counselorUnitResponse.success || !counselorUnitResponse.result || !counselorUnitResponse.result.existingInOtherUnit) {
          setError("Você não tem permissão para realizar avaliações pois não está associado a nenhuma unidade.");
          setUsers([]);
          return;
        }
        
        const unitId = counselorUnitResponse.result.existingInOtherUnit.unitId;
        
        // Buscar os DBVs da unidade do counselor
        const unitResponse = await unitsService.getUnitById(unitId);
        
        if (!unitResponse.success || !unitResponse.unit || !unitResponse.unit.unit) {
          throw new Error("Falha ao carregar os dados da unidade");
        }
        
        const unitData = unitResponse.unit.unit;
        const dbvUsers = unitData.dbvs.map((dbvItem: Unit) => ({
          id: dbvItem.dbv.id,
          name: dbvItem.dbv.name
        }));
        
        setUsers(dbvUsers);
      } 
      else {
        setError("Você não tem permissão para criar avaliações individuais.");
        setUsers([]);
      }
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      setError("Ocorreu um erro ao carregar os usuários. Tente novamente.");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    const data = {
      userId: selectedUser,
      week
    };
  
    onSave(data);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="no-scrollbar relative w-full max-w-[600px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
      >
        <motion.h4
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-2xl font-semibold text-gray-800 dark:text-white/90"
        >
          Criar nova avaliação individual
        </motion.h4>

        <div className="flex flex-col">
          <div className="custom-scrollbar overflow-y-auto px-2">
            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-5 p-4 text-red-500 bg-red-100 dark:bg-red-900/20 dark:text-red-300 rounded-lg"
              >
                {error}
              </motion.div>
            )}
            
            <div className="mb-5">
              <Label>Selecione um usuário</Label>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <Select
                  options={users.map((user) => ({ value: user.id, label: user.name }))}
                  placeholder={isLoading ? "Carregando usuários..." : "Selecione um DBV"}
                  onChange={setSelectedUser}
                  className="dark:bg-dark-900"
                  // disabled={isLoading || !!error}
                />
                {isLoading && (
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Carregando usuários...
                  </div>
                )}
              </motion.div>
            </div>

            <div className="mb-5">
              <Label>Rodada (Week)</Label>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Input
                  type="text"
                  placeholder="Rodada (Week)"
                  className="dark:bg-dark-900"
                  onChange={(e) => setWeek(e.target.value)}
                  disabled={!!error}
                />
              </motion.div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-end mt-6"
        >
          <Button variant="outline" onClick={onClose} className="mr-2">
            Cancelar
          </Button>
          <Button
            disabled={!selectedUser || !week || isLoading || !!error}
            onClick={handleSubmit}
          >
            Criar Avaliação
          </Button>
        </motion.div>
      </motion.div>
    </Modal>
  );
};

export default CreateIndividualEvaluationModal;
