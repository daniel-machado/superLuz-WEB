import React, { useState } from "react";
import { motion } from "framer-motion";
import { Modal } from '../../../components/ui/modal';
import Button from '../../../components/ui/button/Button';
//import Input from '../../../components/form/input/InputField';
import Label from "../../../components/form/Label";
import Select from '../../../components/form/Select';

interface IndividualEvaluation {
  id: string;
  userId: string;
  counselorId: string | null;
  evaluationDate: string | null;
  totalScore: number | string;
  status: string;
  week: number;
  createdAt: string;
  updatedAt: string;
  usersEvaluation: {
    id: string;
    name: string;
    photoUrl: string | null;
  };
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  evaluation: IndividualEvaluation;
}

const EditIndividualEvaluationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  evaluation,
}) => {
  const [formData, setFormData] = useState({
    //totalScore: evaluation.totalScore || 0,
    status: evaluation.status || "open",
    //week: evaluation.week || 1,
    //evaluationDate: evaluation.evaluationDate || null,
  });

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  const statusOptions = [
    { value: "open", label: "Aberta" },
    { value: "closed", label: "Fechada" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="no-scrollbar relative w-full max-w-[600px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
            Editar Avaliação Individual
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {evaluation.usersEvaluation.name} - Rodada {evaluation.week}
          </p>
        </motion.div>

        <div className="flex flex-col">
          <div className="custom-scrollbar overflow-y-auto px-2">
            {/* <div className="mb-5">
              <Label>Pontuação Total</Label>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Input
                  type="number"
                  name="totalScore"
                  value={String(formData.totalScore)}
                  placeholder="Pontuação Total"
                  className="dark:bg-dark-900"
                  onChange={handleChange}
                />
              </motion.div>
            </div> */}

            {/* <div className="mb-5">
              <Label>Rodada (Week)</Label>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Input
                  type="number"
                  name="week"
                  value={String(formData.week)}
                  placeholder="Rodada (Week)"
                  className="dark:bg-dark-900"
                  onChange={handleChange}
                />
              </motion.div>
            </div> */}

            <div className="mb-5">
              <Label>Status da avaliação</Label>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Select
                  options={statusOptions}
                  placeholder="Selecione o status"
                  className="dark:bg-dark-900"
                  onChange={(value) => handleSelectChange("status", value)}
                  defaultValue={evaluation.status}
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
          <Button onClick={handleSubmit}>
            Salvar Alterações
          </Button>
        </motion.div>
      </motion.div>
    </Modal>
  );
};

export default EditIndividualEvaluationModal;
