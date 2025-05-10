import React, { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash } from "lucide-react";
import { Modal } from "../modal";
import specialtyDefault from "../../../assets/specialtyDefault.jpg";

interface ISpecialty {
  id: string;
  category: string;
  codeSpe?: string;
  numberSpe?: string;
  levelSpe?: number;
  yearSpe?: string;
  name: string;
  emblem?: string;
}

interface SpecialtyCardProps {
  specialty: ISpecialty;
  onEdit: (specialty: ISpecialty) => void;
  onDelete: (id: string) => void;
}

const categoryColors: { [key: string]: string } = {
  manuais: "border-[#ADD8E6] shadow-[#ADD8E6]/50", // azul claro
  agricola: "border-[#8B4513] shadow-[#8B4513]/50", // marrom
  missionarias: "border-[#003366] shadow-[#003366]/50", // azul escuro
  profissionais: "border-red-500 shadow-red-500/50",
  recreativas: "border-green-500 shadow-green-500/50",
  saude: "border-purple-500 shadow-purple-500/50",
  natureza: "border-white shadow-white/50",
  domesticas: "border-yellow-500 shadow-yellow-500/50",
  adra: "border-[#C9A0DC] shadow-[#C9A0DC]/50",
  mestrado: "border-black shadow-black/50",
};

const SpecialtyCard: React.FC<SpecialtyCardProps> = ({
  specialty,
  onEdit,
  onDelete,
}) => {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const borderColor =
    categoryColors[specialty.category.toLowerCase()] ||
    "border-gray-500 shadow-gray-500/50";

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`relative flex items-center bg-gray-900 text-white rounded-lg shadow-md overflow-hidden transition-all border ${borderColor}`}
      >
        <div className={`absolute left-0 top-0 h-full w-3 ${borderColor}`}></div>

        <div className="w-28 h-28 flex-shrink-0">
          <img
            src={specialty.emblem || specialtyDefault}
            alt={specialty.name}
            className="w-full h-full object-cover rounded-l-lg"
          />
        </div>

        <div className="flex-1 p-4 flex flex-col">
          <div className="flex justify-between items-start">
            <h2 className="text-md font-bold">{specialty.name}</h2>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.2 }}
                className="text-gray-400 hover:text-gray-200"
                onClick={() => onEdit(specialty)}
              >
                <Pencil size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.2 }}
                className="text-gray-400 hover:text-red-500"
                onClick={() => setDeleteModalOpen(true)}
              >
                <Trash size={18} />
              </motion.button>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap text-xs text-gray-300 gap-2">
            {specialty.codeSpe && <p>Código {specialty.codeSpe}{specialty.numberSpe}</p>}
            {specialty.levelSpe && <p className="border-l pl-2 border-gray-600">Nível {specialty.levelSpe}</p>}
            {specialty.yearSpe && <p className="border-l pl-2 border-gray-600">Ano {specialty.yearSpe}</p>}
          </div>

          <div className="mt-3">
            <button
              onClick={() => alert("Abrir quiz futuramente")}
              className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 rounded-md transition"
            >
              Fazer
            </button>
          </div>
        </div>
      </motion.div>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <div className="p-6 text-white text-center">
          <p className="text-lg mb-4">
            Tem certeza que deseja excluir <strong>{specialty.name}</strong>?
          </p>
          <div className="flex justify-center gap-4">
            <button
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancelar
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              onClick={() => {
                onDelete(specialty.id);
                setDeleteModalOpen(false);
              }}
            >
              Excluir
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SpecialtyCard;
