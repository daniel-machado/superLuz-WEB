import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash, X, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "../../components/ui/modal";
import Badge, { BadgeColor } from "../../components/ui/badge/Badge";
import { useAuth } from "../../context/AuthContext";
import EditClassModal from "../../components/ClassModais/EditClassModal";


interface IClass {
  id: string;
  name: string;
  type: "regular" | "advanced" | "leadership";
  emblem: any | null;
  minAge: number;
  maxAge: number;
  requirements?: any[] | undefined;
  createdAt?: string;
  updatedAt?: string;
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

interface ClassGridProps {
  classes: IClass[];
  onEdit: (classItem: IClass) => void;
  onDelete: (id: string) => void;
  onViewRequirements: (classItem: IClass) => void;
}

const ClassGrid = ({ classes, onEdit, onDelete }: ClassGridProps) => {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<IClass | null>(null);
  const [isRequirementsModalOpen, setRequirementsModalOpen] = useState(false);
  
  const { userRole } = useAuth();


  // Garantir que classes sempre seja um array antes de mapear
  if (!Array.isArray(classes)) {
    return <p className="text-center text-gray-500">Erro ao carregar classes.</p>;
  }


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


  // Animações para os cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
      },
    }),
    hover: {
      y: -5,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: { duration: 0.2 }
    }
  };


  return (
    <>
      {/* Grid responsivo de classes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        <AnimatePresence>
          {classes.map((classItem: IClass, index) => (
            <motion.div
              key={classItem.id}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              whileHover="hover"
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700 transition-all"
            >
              {/* Card header com imagem */}
              <div className="relative h-40 w-full overflow-hidden">
                <img
                  src={classItem.emblem ? classItem.emblem as string : undefined}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                  alt={classItem.name}
                  loading="lazy"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="solid" size="sm" color={typeColors[classItem.type]}>
                    {typeLabels[classItem.type]}
                  </Badge>
                </div>
              </div>
              
              {/* Card content */}
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800 dark:text-white/90 mb-1">
                  {classItem.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Idade mínima: {classItem.minAge} anos
                </p>
                
                {/* Card actions */}
                <div className="flex justify-between items-center mt-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
                    onClick={() => handleViewRequirements(classItem)}
                  >
                    Ver requisitos
                    <ChevronRight size={16} />
                  </motion.button>
                  
                  <div className="flex gap-2">
                    {(userRole === "admin" || userRole === "director" || userRole === "lead") && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.15, color: "#10b981" }}
                          whileTap={{ scale: 0.9 }}
                          className="text-gray-400 hover:text-green-500 transition-all p-1 rounded-full hover:bg-green-50 dark:hover:bg-green-900/20"
                          onClick={() => {
                            setSelectedClass(classItem);
                            setEditModalOpen(true);
                          }}
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
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {isEditModalOpen && (
          <EditClassModal
            isOpen={isEditModalOpen}
            onClose={() => setEditModalOpen(false)}
            onEdit={onEdit}
            classe={selectedClass!}
          />
        )}

      {/* Modal de Confirmação de Exclusão */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} className="max-w-[400px] m-4">
        <div className="p-6 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => setDeleteModalOpen(false)}
              >
                <X size={20} />
              </motion.button>
            </div> */}
            <div className="mt-3 text-center sm:mt-5">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                Confirmar exclusão
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tem sdsssdscerteza que deseja excluir <strong className="text-gray-700 dark:text-gray-300">{selectedClass?.name}</strong>?
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
              {selectedClass?.requirements?.length ?? 0 ? (
                (selectedClass?.requirements ?? []).map((req, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700"
                  >
                    <p className="text-gray-800 dark:text-gray-200">{req.description || req}</p>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                  Não há requisitos cadastrados para esta classe.
                </p>
              )}
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


export default ClassGrid;

























































// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Eye, Pencil, Trash, X } from "lucide-react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHeader,
//   TableRow,
// } from "../../ui/table";
// import Badge, { BadgeColor } from "../../ui/badge/Badge";
// import { Modal } from "../modal";
// import toast from "react-hot-toast";
// import specialtyDefault from "../../../assets/specialtyDefault.jpg";
// import { useAuth } from "../../../context/AuthContext";

// // // Componente animado para TableRow
// const MotionTableRow = motion(TableRow);


// interface IClass {
//   id: string;
//   name: string;
//   type: "regular" | "advanced" | "leadership";
//   emblem: string | null;
//   minAge: number;
//   maxAge: number;
//   requirements: any[];
//   createdAt?: string;
//   updatedAt?: string;
// }

// interface ClassTableProps {
//   classes: IClass[];
//   onEdit: (classItem: IClass) => void;
//   onDelete: (id: string) => void;
//   onViewRequirements: (classItem: IClass) => void;
// }

// const typeLabels: Record<IClass["type"], string> = {
//   regular: "Regular",
//   advanced: "Avançada",
//   leadership: "Liderança",
// };

// const typeColors: Record<IClass["type"], BadgeColor> = {
//   regular: "success",
//   advanced: "warning",
//   leadership: "error",
// };

// const ClassTable: React.FC<ClassTableProps> = ({
//   classes,
//   onEdit,
//   onDelete,
// //  onViewRequirements,
// }) => {
//   const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [selectedClass, setSelectedClass] = useState<IClass | null>(null);
//   const [isRequirementsModalOpen, setRequirementsModalOpen] = useState(false);


// const { userRole } = useAuth();

//   // Garantir que classes sempre seja um array antes de mapear
//   if (!Array.isArray(classes)) {
//     return <p className="text-center text-gray-500">Erro ao carregar classes.</p>;
//   }

//   // Handle view requirements
//   const handleViewRequirements = (classItem: IClass) => {
//     if (classItem.requirements && classItem.requirements.length > 0) {
//       setSelectedClass(classItem);
//       setRequirementsModalOpen(true);
//     } else {
//       toast.error('Não tem requisito cadastrado.', {
//         position: 'bottom-right',
//         className: 'dark:bg-gray-800 dark:text-white',
//         duration: duration: 5000,
//       });
//     }
//   };

//   // Animações para os itens da tabela
//   const tableRowVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: (i: number) => ({
//       opacity: 1,
//       y: 0,
//       transition: {
//         delay: i * 0.05,
//         duration: 0.3,
//       },
//     }),
//   };


//   return (
//     <>
//       <div className="overflow-x-auto">
//         <Table>
//           {/* Cabeçalho da Tabela */}
//           <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
//             <TableRow>
//               <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
//                 Classe
//               </TableCell>
//               <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 hidden sm:table-cell">
//                 Idade
//               </TableCell>
//               <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
//                 Tipo
//               </TableCell>
//               <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
//                 Ações
//               </TableCell>
//             </TableRow>
//           </TableHeader>


//           {/* Corpo da Tabela */}
//           <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
//             <AnimatePresence>
//               {classes.map((classItem: IClass, index) => (
//                 <MotionTableRow
//                   key={classItem.id}
//                   custom={index}
//                   initial="hidden"
//                   animate="visible"
//                   variants={tableRowVariants}
//                   whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
//                   whileTap={{ scale: 0.99 }}
//                   className="transition-all"
//                 >
//                   {/* Coluna da Imagem e Nome */}
//                   <TableCell className="py-3">
//                     <div className="flex items-center gap-3">
//                       <motion.div 
//                         className="h-[50px] w-[50px] overflow-hidden rounded-md"
//                         whileHover={{ scale: 1.1 }}
//                       >
//                         <img
//                           src={classItem.emblem ? classItem.emblem as string : specialtyDefault}
//                           className="h-[50px] w-[50px] object-cover"
//                           alt={classItem.name}
//                           loading="lazy"
//                         />
//                       </motion.div>
//                       <div>
//                         <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
//                           {classItem.name}
//                         </p>
//                         <p className="text-xs text-gray-500 dark:text-gray-400 sm:hidden">
//                           {/* Idade: {classItem.minAge}{classItem.maxAge !== 100 ? `-${classItem.maxAge}` : "+"} anos */}
//                           Idade: {classItem.minAge} anos
//                         </p>
//                       </div>
//                     </div>
//                   </TableCell>


//                   {/* Coluna de Idade - escondida em telas pequenas */}
//                   <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400 hidden sm:table-cell">
//                     {/* {classItem.minAge}{classItem.maxAge !== 100 ? `-${classItem.maxAge}` : "+"} anos */}
//                     {classItem.minAge} anos
//                   </TableCell>


//                   {/* Coluna do Tipo (Badge) */}
//                   <TableCell className="py-3">
//                     <Badge size="sm" color={typeColors[classItem.type]}>
//                       {typeLabels[classItem.type]}
//                     </Badge>
//                   </TableCell>


//                   {/* Coluna de Ações */}
//                   <TableCell className="py-3">
//                     <div className="flex gap-2 md:gap-3">
//                       <motion.button
//                         whileHover={{ scale: 1.15, color: "#3b82f6" }}
//                         whileTap={{ scale: 0.9 }}
//                         className="text-gray-400 hover:text-blue-500 transition-all p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20"
//                         onClick={() => handleViewRequirements(classItem)}
//                         title="Ver requisitos"
//                       >
//                         <Eye size={18} />
//                       </motion.button>
                      
//                       {( userRole === "admin" || userRole === "director" || userRole === "lead") && (
//                         <>
//                             <motion.button
//                         whileHover={{ scale: 1.15, color: "#10b981" }}
//                         whileTap={{ scale: 0.9 }}
//                         className="text-gray-400 hover:text-green-500 transition-all p-1 rounded-full hover:bg-green-50 dark:hover:bg-green-900/20"
//                         onClick={() => onEdit(classItem)}
//                         title="Editar"
//                       >
//                         <Pencil size={18} />
//                       </motion.button>
//                       <motion.button
//                         whileHover={{ scale: 1.15, color: "#ef4444" }}
//                         whileTap={{ scale: 0.9 }}
//                         className="text-gray-400 hover:text-red-500 transition-all p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
//                         onClick={() => {
//                           setSelectedClass(classItem);
//                           setDeleteModalOpen(true);
//                         }}
//                         title="Excluir"
//                       >
//                         <Trash size={18} />
//                       </motion.button>

//                         </>
//                       )}
                      
//                     </div>
//                   </TableCell>
//                 </MotionTableRow>
//               ))}
//             </AnimatePresence>
//           </TableBody>
//         </Table>
//       </div>

//       {/* Modal de Confirmação de Exclusão */}
//       <Modal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
//         <div className="p-6 text-center">
//           <motion.div
//             initial={{ scale: 0.8, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             transition={{ duration: 0.3 }}
//           >
//             <div className="flex justify-end">
//               <motion.button
//                 whileHover={{ scale: 1.1, rotate: 90 }}
//                 whileTap={{ scale: 0.9 }}
//                 className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
//                 onClick={() => setDeleteModalOpen(false)}
//               >
//                 <X size={20} />
//               </motion.button>
//             </div>
//             <div className="mt-3 text-center sm:mt-5">
//               <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
//                 Confirmar exclusão
//               </h3>
//               <div className="mt-2">
//                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                   Tem certeza que deseja excluir <strong className="text-gray-700 dark:text-gray-300">{selectedClass?.name}</strong>?
//                   <br />
//                   Esta ação não pode ser desfeita.
//                 </p>
//               </div>
//             </div>
//             <div className="mt-5 sm:mt-6 flex justify-center gap-4">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
//                 onClick={() => setDeleteModalOpen(false)}
//               >
//                 Cancelar
//               </motion.button>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
//                 onClick={() => {
//                   if (selectedClass) {
//                     onDelete(selectedClass.id);
//                     setDeleteModalOpen(false);
//                     setSelectedClass(null);
//                   }
//                 }}
//               >
//                 Excluir
//               </motion.button>
//             </div>
//           </motion.div>
//         </div>
//       </Modal>


//       {/* Modal de Visualização de Requisitos */}
//       <Modal isOpen={isRequirementsModalOpen} onClose={() => setRequirementsModalOpen(false)}>
//         <div className="p-6">
//           <motion.div
//             initial={{ y: -20, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ duration: 0.3 }}
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
//                 Requisitos - {selectedClass?.name}
//               </h3>
//               <motion.button
//                 whileHover={{ scale: 1.1, rotate: 90 }}
//                 whileTap={{ scale: 0.9 }}
//                 className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
//                 onClick={() => setRequirementsModalOpen(false)}
//               >
//                 <X size={20} />
//               </motion.button>
//             </div>
            
//             <div className="mt-2 max-h-[70vh] overflow-y-auto pr-2">
//               {selectedClass?.requirements.map((req, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.1 }}
//                   className="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700"
//                 >
//                   <p className="text-gray-800 dark:text-gray-200">{req.description || req}</p>
//                 </motion.div>
//               ))}
//             </div>


//             <div className="mt-5 flex justify-center">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
//                 onClick={() => setRequirementsModalOpen(false)}
//               >
//                 Fechar
//               </motion.button>
//             </div>
//           </motion.div>
//         </div>
//       </Modal>
//     </>
//   );
// };


// export default ClassTable;
