import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Select from "../form/Select";
import { useAuth } from "../../context/AuthContext";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import toast from "react-hot-toast";

interface evaluationUnitInput {
  selectedUnit: string;
  correct: string;
  wrong: string;
  examScore: string;
  week: string
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (evaluationUnit: evaluationUnitInput) => void;
}

const CreateEvaUnitModal: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const [unitsData, setUnitsData] = useState<any[]>([]);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [correct, setCorrect] = useState("");
  const [wrong, setWrong] = useState("");
  const [examScore, setExamScore] = useState("");
  const [week, setWeek] = useState("");

  const { units } = useAuth();

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      setUnitsData(units);
    } catch (error: any) {
      console.error("Erro ao carregar unidades:", error);
      toast.error(`Error: ${error.message}`, {position: 'bottom-right', duration: 5000,});
    }
  };

  const handleApprove = async () => {
    const data = { selectedUnit, correct, wrong, examScore, week };
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
          Criar nova avaliação
        </motion.h4>

        <div className="flex flex-col">
          <div className="custom-scrollbar h-[450px] overflow-y-auto px-2">

            <div className="mb-5">
              <Label>Selecione uma unidade</Label>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <Select
                  options={unitsData.map((unit) => ({ value: unit.id, label: unit.name }))}
                  placeholder="Selecione uma unidade"
                  onChange={setSelectedUnit}
                  className="dark:bg-dark-900"
                />
              </motion.div>
            </div>

            <div className="mb-5">
              <Label>Acertos</Label>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Input
                  type="text"
                  placeholder="Acertos"
                  className="dark:bg-dark-900"
                  onChange={(e) => setCorrect(e.target.value)}
                />
              </motion.div>
            </div>

            <div className="mb-5">
              <Label>Erros</Label>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Input
                  type="text"
                  placeholder="Erros"
                  className="dark:bg-dark-900"
                  onChange={(e) => setWrong(e.target.value)}
                />
              </motion.div>
            </div>

            <div className="mb-5">
              <Label>Nota do Quiz</Label>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Input
                  type="text"
                  placeholder="Pontuação"
                  className="dark:bg-dark-900"
                  onChange={(e) => setExamScore(e.target.value)}
                />
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
                  placeholder="Rodada(Week)"
                  className="dark:bg-dark-900"
                  onChange={(e) => setWeek(e.target.value)}
                />
              </motion.div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className=" flex justify-end"
        >
          <Button variant="outline" onClick={onClose} className="mr-2">
            Cancelar
          </Button>
          <Button
            disabled={!selectedUnit}
            onClick={handleApprove}
          >
            Criar Avaliação
          </Button>
        </motion.div>

      </motion.div>
      </Modal>
  );
};

export default CreateEvaUnitModal;
