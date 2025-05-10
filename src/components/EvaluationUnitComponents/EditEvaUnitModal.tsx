import { useState } from "react";
import { motion } from "framer-motion";
import { Modal } from '../../components/ui/modal'
import Button from '../../components/ui/button/Button'
import Input from '../../components/form/input/InputField'
import Label from "../form/Label";
import Select from "../form/Select";

interface Evaluation {
  id: string;
  week: number;
  examScore: number;
  correctAnswers: number;
  wrongAnswers: number;
  totalScore: number;
  status: string;
  unit: {
    id: string;
    name: string;
  };
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  evaluation: Evaluation;
};

const EditEvaUnitModal: React.FC<Props> = ({   
  isOpen,
  onClose,
  onSave,
  evaluation,
  }: Props) => {

  const [formData, setFormData] = useState({
    examScore: evaluation.examScore || 0,
    correctAnswers: evaluation.correctAnswers || 0,
    wrongAnswers: evaluation.wrongAnswers || 0,
    status: evaluation.status || "closed",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose
  };

  const optionsStatus = [
    { value: "open", label: "Aberto" },
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
        <motion.h4
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="text-lg font-semibold"
        >
          Editar Avaliação
        </motion.h4>

        <div className="flex flex-col">
          <div className="custom-scrollbar h-[450px] overflow-y-auto px-2">

            <div className="mb-5">
              <Label>Acertos</Label>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Input
                  type="text"
                  name="correctAnswers"
                  value={String(formData.correctAnswers)}
                  placeholder="Acertos"
                  className="dark:bg-dark-900"
                  onChange={handleChange}
                  //required
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
                  name="wrongAnswers"
                  value={String(formData.wrongAnswers)}
                  placeholder="Erros"
                  className="dark:bg-dark-900"
                  onChange={handleChange}
                  //required
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
                  name="examScore"
                  value={String(formData.examScore)}
                  placeholder="Nota do Quiz"
                  className="dark:bg-dark-900"
                  onChange={handleChange}
                  //required
                />
              </motion.div>
            </div>

            <div className="mb-5">
              <Label>Status da avaliação</Label>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >

                <Select
                  options={optionsStatus}
                  placeholder="Selecione o status"
                  className="p-2 rounded-xl border dark:bg-gray-800 dark:text-white"
                  onChange={(e) => handleChange(
                    { target: 
                      { name: "status", value: e } } as React.ChangeEvent<HTMLInputElement>)}
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
          className=" flex justify-end"
        >
          <Button variant="outline" onClick={onClose} className="mr-2">
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
          >
            Criar Avaliação
          </Button>
        </motion.div>
      </motion.div>
    </Modal>
  );
}

export default EditEvaUnitModal
