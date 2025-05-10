import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Pencil, Trash, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge, { BadgeColor } from "../../ui/badge/Badge";
import { Modal } from "../modal";
import toast from "react-hot-toast";
import specialtyDefault from "../../../assets/specialtyDefault.jpg";
import { useAuth } from "../../../context/AuthContext";

// // Componente animado para TableRow
const MotionTableRow = motion(TableRow);

// const MotionTableRow = motion(
//   forwardRef<HTMLTableRowElement, React.ComponentPropsWithoutRef<typeof TableRow>>((props, ref) => (
//     <TableRow ref={ref} {...props} />
//   ))
// );
  

interface IClass {
  id: string;
  name: string;
  type: "regular" | "advanced" | "leadership";
  emblem: string | null;
  minAge: number;
  maxAge: number;
  requirements: any[];
  createdAt?: string;
  updatedAt?: string;
}

interface ClassTableProps {
  classes: IClass[];
  onEdit: (classItem: IClass) => void;
  onDelete: (id: string) => void;
  onViewRequirements: (classItem: IClass) => void;
}

const typeLabels: Record<IClass["type"], string> = {
  regular: "Regular",
  advanced: "Avançada",
  leadership: "Liderança",
};

const typeColors: Record<IClass["type"], BadgeColor> = {
  regular: "success",
  advanced: "warning",
  leadership: "error",
};

const ClassTable: React.FC<ClassTableProps> = ({
  classes,
  onEdit,
  onDelete,
//  onViewRequirements,
}) => {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<IClass | null>(null);
  const [isRequirementsModalOpen, setRequirementsModalOpen] = useState(false);
//  const [currentPage, setCurrentPage] = useState(1);
//  const [itemsPerPage, setItemsPerPage] = useState(5);

const { userRole } = useAuth();

  // Garantir que classes sempre seja um array antes de mapear
  if (!Array.isArray(classes)) {
    return <p className="text-center text-gray-500">Erro ao carregar classes.</p>;
  }

  // // Ordenar as classes pelo tipo
  // const sortedClasses = [...classes].sort((a, b) => {
  //   const order = ["regular", "advanced", "leadership"];
  //   return order.indexOf(a.type) - order.indexOf(b.type);
  // });


  // // Paginação
  // const totalPages = Math.ceil(sortedClasses.length / itemsPerPage);
  // const start = (currentPage - 1) * itemsPerPage;
  // const end = start + itemsPerPage;
  // const currentClasses = sortedClasses.slice(start, end);


  // Handle view requirements
  const handleViewRequirements = (classItem: IClass) => {
    if (classItem.requirements && classItem.requirements.length > 0) {
      setSelectedClass(classItem);
      setRequirementsModalOpen(true);
    } else {
      toast.error('Não tem requisito cadastrado.', {
        position: 'bottom-right',
        className: 'dark:bg-gray-800 dark:text-white',
        duration: 5000,
      });
    }
  };

  // Animações para os itens da tabela
  const tableRowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
      },
    }),
  };


  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          {/* Cabeçalho da Tabela */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Classe
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 hidden sm:table-cell">
                Idade
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Tipo
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Ações
              </TableCell>
            </TableRow>
          </TableHeader>


          {/* Corpo da Tabela */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            <AnimatePresence>
              {classes.map((classItem: IClass, index) => (
                <MotionTableRow
                  key={classItem.id}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={tableRowVariants}
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                  whileTap={{ scale: 0.99 }}
                  className="transition-all"
                >
                  {/* Coluna da Imagem e Nome */}
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <motion.div 
                        className="h-[50px] w-[50px] overflow-hidden rounded-md"
                        whileHover={{ scale: 1.1 }}
                      >
                        <img
                          src={classItem.emblem ? classItem.emblem as string : specialtyDefault}
                          className="h-[50px] w-[50px] object-cover"
                          alt={classItem.name}
                          loading="lazy"
                        />
                      </motion.div>
                      <div>
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {classItem.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 sm:hidden">
                          {/* Idade: {classItem.minAge}{classItem.maxAge !== 100 ? `-${classItem.maxAge}` : "+"} anos */}
                          Idade: {classItem.minAge} anos
                        </p>
                      </div>
                    </div>
                  </TableCell>


                  {/* Coluna de Idade - escondida em telas pequenas */}
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400 hidden sm:table-cell">
                    {/* {classItem.minAge}{classItem.maxAge !== 100 ? `-${classItem.maxAge}` : "+"} anos */}
                    {classItem.minAge} anos
                  </TableCell>


                  {/* Coluna do Tipo (Badge) */}
                  <TableCell className="py-3">
                    <Badge size="sm" color={typeColors[classItem.type]}>
                      {typeLabels[classItem.type]}
                    </Badge>
                  </TableCell>


                  {/* Coluna de Ações */}
                  <TableCell className="py-3">
                    <div className="flex gap-2 md:gap-3">
                      <motion.button
                        whileHover={{ scale: 1.15, color: "#3b82f6" }}
                        whileTap={{ scale: 0.9 }}
                        className="text-gray-400 hover:text-blue-500 transition-all p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        onClick={() => handleViewRequirements(classItem)}
                        title="Ver requisitos"
                      >
                        <Eye size={18} />
                      </motion.button>
                      
                      {( userRole === "admin" || userRole === "director" || userRole === "lead") && (
                        <>
                            <motion.button
                        whileHover={{ scale: 1.15, color: "#10b981" }}
                        whileTap={{ scale: 0.9 }}
                        className="text-gray-400 hover:text-green-500 transition-all p-1 rounded-full hover:bg-green-50 dark:hover:bg-green-900/20"
                        onClick={() => onEdit(classItem)}
                        title="Editar"
                      >
                        <Pencil size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.15, color: "#ef4444" }}
                        whileTap={{ scale: 0.9 }}
                        className="text-gray-400 hover:text-red-500 transition-all p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => {
                          setSelectedClass(classItem);
                          setDeleteModalOpen(true);
                        }}
                        title="Excluir"
                      >
                        <Trash size={18} />
                      </motion.button>

                        </>
                      )}
                      
                    </div>
                  </TableCell>
                </MotionTableRow>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>


      {/* Paginação
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 px-2">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Mostrando {start + 1}-{Math.min(end, sortedClasses.length)} de {sortedClasses.length} classes
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center justify-center h-8 w-8 rounded-md ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={18} />
            </motion.button>
            {Array.from({ length: totalPages }, (_, i) => (
              <motion.button
                key={i + 1}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center justify-center h-8 w-8 rounded-md ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </motion.button>
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center justify-center h-8 w-8 rounded-md ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={18} />
            </motion.button>
          </div>
        </div>
      )} */}


      {/* Modal de Confirmação de Exclusão */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <div className="p-6 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => setDeleteModalOpen(false)}
              >
                <X size={20} />
              </motion.button>
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                Confirmar exclusão
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tem certeza que deseja excluir <strong className="text-gray-700 dark:text-gray-300">{selectedClass?.name}</strong>?
                  <br />
                  Esta ação não pode ser desfeita.
                </p>
              </div>
            </div>
            <div className="mt-5 sm:mt-6 flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancelar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                onClick={() => {
                  if (selectedClass) {
                    onDelete(selectedClass.id);
                    setDeleteModalOpen(false);
                    setSelectedClass(null);
                  }
                }}
              >
                Excluir
              </motion.button>
            </div>
          </motion.div>
        </div>
      </Modal>


      {/* Modal de Visualização de Requisitos */}
      <Modal isOpen={isRequirementsModalOpen} onClose={() => setRequirementsModalOpen(false)}>
        <div className="p-6">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Requisitos - {selectedClass?.name}
              </h3>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => setRequirementsModalOpen(false)}
              >
                <X size={20} />
              </motion.button>
            </div>
            
            <div className="mt-2 max-h-[70vh] overflow-y-auto pr-2">
              {selectedClass?.requirements.map((req, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700"
                >
                  <p className="text-gray-800 dark:text-gray-200">{req.description || req}</p>
                </motion.div>
              ))}
            </div>


            <div className="mt-5 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                onClick={() => setRequirementsModalOpen(false)}
              >
                Fechar
              </motion.button>
            </div>
          </motion.div>
        </div>
      </Modal>
    </>
  );
};


export default ClassTable;





// import { useState } from "react";
// import { motion } from "framer-motion";
// import { Eye, Pencil, Trash } from "lucide-react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHeader,
//   TableRow,
// } from "../../ui/table";
// import Badge, { BadgeColor } from "../../ui/badge/Badge";

// import { Modal } from "../modal";

// import specialtyDefault from "../../../assets/specialtyDefault.jpg";

// // Criando um componente animado para TableRow
// const MotionTableRow = motion.create(TableRow);

// interface IClass {
//   id: string;
//   name: string;
//   type: "regular" | "advanced" | "leadership";
//   emblem: string | null;
//   minAge: number;
//   maxAge: number;
//   requirements: any[]; // No caso, requisitos podem ser um array vazio
// }

// interface ClassTableProps {
//   classes: IClass[];
//   onEdit: (classItem: IClass) => void;
//   onDelete: (id: string) => void;
//   onViewRequirements: (classItem: IClass) => void;
// }

// const typeColors: Record<IClass["type"], BadgeColor> = {
//   regular: "success",
//   advanced: "warning",
//   leadership: "error",
// };


// const ClassTable: React.FC<ClassTableProps> = ({classes, onEdit, onDelete, onViewRequirements}) => {
//   const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [selectedClass, setSelectedClass] = useState<IClass | null>(null);

//   // console.log("classes", classes)

//   // // Garantir que classes sempre seja um array antes de mapear
//   // if (!Array.isArray(classes)) {
//   //   return <p className="text-center text-gray-500">Erro ao carregar classes.</p>;
//   // }

//   // // Ordenar as classes pelo type
//   // const sortedClasses = [...classes].sort((a, b) => {
//   //   const order = ["regular", "advanced", "leadership"];
//   //   return order.indexOf(a.type) - order.indexOf(b.type);
//   // });

//   // console.log("SORTED", sortedClasses)

//   return (
//     <>
//       <Table>
//         {/* Cabeçalho da Tabela */}
//         <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
//           <TableRow>
//             <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
//               Classe
//             </TableCell>
//             <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
//               Idade
//             </TableCell>
//             <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
//               Tipo
//             </TableCell>
//             <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
//               Ações
//             </TableCell>
//           </TableRow>
//         </TableHeader>

//         {/* Corpo da Tabela */}
//         <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
//           {classes.map((classItem: IClass) => (
//             <MotionTableRow
//               key={classItem.id}
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               className="transition-all"
//             >
//               {/* Coluna da Imagem e Nome */}
//               <TableCell className="py-3">
//                 <div className="flex items-center gap-3">
//                   <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
//                     <img
//                       src={classItem.emblem ? classItem.emblem as string : specialtyDefault}
//                       className="h-[50px] w-[50px] object-cover"
//                       alt={classItem.name}
//                     />
//                   </div>
//                   <div>
//                     <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
//                       {classItem.name}
//                     </p>
//                   </div>
//                 </div>
//               </TableCell>

//               {/* Coluna de Idade */}
//               <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
//                 {classItem.minAge}
//               </TableCell>

//               {/* Coluna do Tipo (Badge) */}
//               <TableCell className="py-3">
//                 <Badge size="sm" color={typeColors[classItem.type]}>
//                   {classItem.type}
//                 </Badge>
//               </TableCell>

//               {/* Coluna de Ações */}
//               <TableCell className="py-3 flex gap-2">
//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   className="text-gray-400 hover:text-blue-500 transition-all"
//                   onClick={() => onViewRequirements(classItem)}
//                 >
//                   <Eye size={18} />
//                 </motion.button>
//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   className="text-gray-400 hover:text-gray-200 transition-all"
//                   onClick={() => onEdit(classItem)}
//                 >
//                   <Pencil size={18} />
//                 </motion.button>
//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   className="text-gray-400 hover:text-red-500 transition-all"
//                   onClick={() => {
//                     setSelectedClass(classItem);
//                     setDeleteModalOpen(true);
//                   }}
//                 >
//                   <Trash size={18} />
//                 </motion.button>
//               </TableCell>
//             </MotionTableRow>
//           ))}
//         </TableBody>

//       </Table>

//       {/* Modal de Confirmação de Exclusão */}
//       <Modal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
//         <div className="p-6 text-white text-center">
//           <p className="text-lg mb-4">
//             Tem certeza que deseja excluir <strong>{selectedClass?.name}</strong>?
//           </p>
//           <div className="flex justify-center gap-4">
//             <button
//               className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
//               onClick={() => setDeleteModalOpen(false)}
//             >
//               Cancelar
//             </button>
//             <button
//               className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
//               onClick={() => {
//                 if (selectedClass) {
//                   onDelete(selectedClass.id);
//                   setDeleteModalOpen(false);
//                   setSelectedClass(null);
//                 }
//               }}
//             >
//               Excluir
//             </button>
//           </div>
//         </div>
//       </Modal>
//     </>
//   );
// };

// export default ClassTable;
