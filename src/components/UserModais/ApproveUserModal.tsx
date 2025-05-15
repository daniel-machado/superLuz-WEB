import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Select from "../form/Select";
import { useAuth } from "../../context/AuthContext";
import Label from "../form/Label";
import { userService } from "../../services/userService";

interface Props {
  isOpen: boolean;
  user: any;
  onClose: () => void;
  onApproved: () => void;
}

const ApproveUserModal: React.FC<Props> = ({ isOpen, user, onClose, onApproved }) => {
  const [selectedRole, setSelectedRole] = useState("");
  const [unitsData, setUnitsData] = useState<any[]>([]);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const optionsRole = [
    { value: "pending", label: "Pendente" },
    { value: "dbv", label: "Desbravador" },
    { value: "counselor", label: "Conselheiro" },
    { value: "director", label: "Diretor" },
    { value: "lead", label: "Líder" },
    { value: "secretary", label: "Liderança" },
    { value: "admin", label: "Admin" },
  ];

  const { units } = useAuth();

  useEffect(() => {
    if (selectedRole === "dbv") {
      fetchUnits();
    }
  }, [selectedRole]);

  const fetchUnits = async () => {
    try {
      setUnitsData(units);
    } catch (error) {
      console.error("Erro ao carregar unidades:", error);
    }
  };

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      await userService.approveUser(
        user.id, 
        { 
          role: selectedRole, 
          unitId: selectedUnit 
        });
      onApproved();
      onClose();
    } catch (error) {
      console.error("Erro ao aprovar usuário:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="no-scrollbar relative w-full max-w-[500px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
      >
        <motion.h4
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90"
        >
          Aprovar Usuário
        </motion.h4>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7"
        >
          {user?.name}
        </motion.p>

        <div className="flex flex-col">
          <div className="custom-scrollbar h-[300px] overflow-y-auto px-2 pb-3">
            <div>
              <Label>Selecione um papel:</Label>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Select
                  options={optionsRole}
                  placeholder="Selecione um cargo"
                  onChange={setSelectedRole}
                  className="dark:bg-dark-900"
                />
              </motion.div>
            </div>

            {selectedRole === "dbv" && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <Label>Selecione uma unidade</Label>
                <Select
                  options={unitsData.map((unit) => ({ value: unit.id, label: unit.name }))}
                  placeholder="Selecione uma unidade"
                  onChange={setSelectedUnit}
                  className="dark:bg-dark-900"
                />
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-4 flex justify-end"
            >
              <Button variant="outline" onClick={onClose} className="mr-2">
                Cancelar
              </Button>
              <Button
                disabled={!selectedRole || (selectedRole === "dbv" && !selectedUnit)}
                onClick={handleApprove}
              >
                {isLoading ? "Aprovando..." : "Aprovar"}
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Modal>
  );
};

export default ApproveUserModal;
