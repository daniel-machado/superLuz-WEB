import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Pencil, Trash, BookOpen } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import { Modal } from "../../components/ui/modal";
import specialtyDefault from "../../assets/specialtyDefault.jpg";

interface ISpecialty {
  id: string;
  category: string;
  codeSpe?: string;
  numberSpe?: string;
  levelSpe?: number;
  yearSpe?: string;
  name: string;
  emblem?: string;
  hasQuiz?: boolean;
}

interface Props {
  groupedByCategory: Record<string, ISpecialty[]>;
  openCategory: string | null;
  setOpenCategory: (cat: string | null) => void;
  onEdit: (spec: ISpecialty) => void;
  onDelete: (id: string) => void;
  onStartQuiz: (spec: ISpecialty) => void;
}

const MotionTableRow = motion.create(TableRow);

export default function SpecialtyTable({
  groupedByCategory,
  openCategory,
  setOpenCategory,
  onEdit,
  onDelete,
  onStartQuiz,
}: Props) {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSpec, setSelectedSpec] = useState<ISpecialty | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(false);

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const updateShadows = () => {
      const { scrollLeft, scrollWidth, clientWidth } = scrollEl;
      setShowLeftShadow(scrollLeft > 0);
      setShowRightShadow(scrollLeft + clientWidth < scrollWidth);
    };

    updateShadows();
    scrollEl.addEventListener("scroll", updateShadows);
    window.addEventListener("resize", updateShadows);

    return () => {
      scrollEl.removeEventListener("scroll", updateShadows);
      window.removeEventListener("resize", updateShadows);
    };
  }, []);

  return (
    <div className="space-y-4">
      {Object.entries(groupedByCategory).map(([category, specs]) => (
        <div
          key={category}
          className="border border-gray-200 dark:border-gray-700 rounded-lg"
        >
          <button
            onClick={() =>
              setOpenCategory(openCategory === category ? null : category)
            }
            className={`w-full px-4 py-2 flex justify-between items-center text-left font-semibold capitalize transition-all
              ${
                openCategory === category
                  ? "bg-gray-200 dark:bg-gray-800"
                  : "bg-gray-100 dark:bg-gray-900"
              }
              text-gray-900 dark:text-white
            `}
          >
            {category}
            {openCategory === category ? <ChevronUp /> : <ChevronDown />}
          </button>

          <AnimatePresence>
            {openCategory === category && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 relative"
              >
                {showLeftShadow && (
                  <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-gray-100 dark:from-gray-900 to-transparent pointer-events-none z-10" />
                )}
                {showRightShadow && (
                  <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-gray-100 dark:from-gray-900 to-transparent pointer-events-none z-10" />
                )}

                <div
                  ref={scrollRef}
                  className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
                >
                  <Table className="min-w-[700px]">
                    <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
                      <TableRow>
                        <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Especialidade
                        </TableCell>
                        <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Código
                        </TableCell>
                        <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Nível
                        </TableCell>
                        <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Ano
                        </TableCell>
                        <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Ações
                        </TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {specs.map((spec) => (
                        <MotionTableRow
                          key={spec.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="transition-all"
                        >
                          <TableCell className="py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                                <img
                                  src={spec.emblem || specialtyDefault}
                                  className="h-[50px] w-[50px] object-cover"
                                  alt={spec.name}
                                />
                              </div>
                              <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                {spec.name}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                            {spec.codeSpe || "-"}
                          </TableCell>
                          <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                            {spec.levelSpe || "-"}
                          </TableCell>
                          <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                            {spec.yearSpe || "-"}
                          </TableCell>
                          <TableCell className="py-3 flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              className="text-gray-400 hover:text-gray-200 transition-all"
                              onClick={() => onEdit(spec)}
                            >
                              <Pencil size={18} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              className="text-gray-400 hover:text-red-500 transition-all"
                              onClick={() => {
                                setSelectedSpec(spec);
                                setDeleteModalOpen(true);
                              }}
                            >
                              <Trash size={18} />
                            </motion.button>
                            {spec.hasQuiz && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                className="text-gray-400 hover:text-green-500 transition-all"
                                onClick={() => onStartQuiz(spec)}
                              >
                                <BookOpen size={18} />
                              </motion.button>
                            )}
                          </TableCell>
                        </MotionTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      >
        <div className="p-6 text-white text-center">
          <p className="text-lg mb-4">
            Tem certeza que deseja excluir{" "}
            <strong>{selectedSpec?.name}</strong>?
          </p>
          <div className="flex justify-center gap-4">
            <button
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancelar
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
              onClick={() => {
                if (selectedSpec) {
                  onDelete(selectedSpec.id);
                  setDeleteModalOpen(false);
                  setSelectedSpec(null);
                }
              }}
            >
              Excluir
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
