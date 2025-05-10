import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronRight, ClipboardCopy, Download, Users, Calendar } from "lucide-react";
import { TrashBinIcon } from "../../icons";
import toast from "react-hot-toast";


interface ClassUser {
  id: string;
  userId: string;
  classId: string;
  assignedBy: string;
  createdAt: string;
  updatedAt: string;
  classUser: {
    name: string;
    photoUrl: string | null;
  };
  classInfo: {
    name: string;
    emblem: string;
    type: string;
  };
}


interface Props {
  classId: string;
  users: ClassUser[];
  selectedClassId: string | null;
  onToggle: (id: string) => void;
  onCopy: (users: ClassUser[], classId: string) => void;
  onDownload: (users: ClassUser[], className: string) => void;
  onRemoveClick: (user: ClassUser) => void;
  copiedClassId: string | null;
}


export const ClassCard = ({
  classId,
  users,
  selectedClassId,
  onToggle,
  onCopy,
  onDownload,
  onRemoveClick,
  //copiedClassId,
}: Props) => {
  const { name: className, emblem, type } = users[0].classInfo;
  const [hoveredUserId, setHoveredUserId] = useState<string | null>(null);
  
  const isOpen = selectedClassId === classId;


  // Get class type color
  const getClassTypeColor = () => {
    const typeLC = type.toLowerCase();
    if (typeLC === "regular") return "border-green-500 dark:border-green-600";
    if (typeLC === "advanced") return "border-purple-500 dark:border-purple-600";
    if (typeLC === "leadership") return "border-amber-500 dark:border-amber-600";
    return "border-blue-500 dark:border-blue-600";
  };


  const getClassTypeBadge = () => {
    const typeLC = type.toLowerCase();
    if (typeLC === "regular") {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-lg">
          Regular
        </span>
      );
    }
    if (typeLC === "advanced") {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-lg">
          Avançada
        </span>
      );
    }
    if (typeLC === "leadership") {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 rounded-lg">
          Liderança
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-lg">
        {type}
      </span>
    );
  };


  // Animation variants
  const listVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };


  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };


  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(date);
    } catch (error) {
      return dateString;
    }
  };


  const handleCopyClick = () => {
    onCopy(users, classId);
    toast.success(`Membros ${className} copiados!`);
  };


  const handleDownloadClick = () => {
    onDownload(users, className);
    toast.success(`Lista de membros da classe de ${className} será baixada!`);
  };


  return (
    <div
      className={`mb-4 rounded-lg border-l-4 ${getClassTypeColor()} bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200`}
    >
      <div 
        className="p-4 cursor-pointer flex items-center justify-between"
        onClick={() => onToggle(classId)}
      >
        <div className="flex items-center space-x-3">
          {/* <img className="flex-shrink-0 text-xl">{emblem}</img>*/}
          <img
            src={emblem}
            alt={className}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{className}</h3>
            <div className="flex items-center space-x-3 mt-1">
              {getClassTypeBadge()}
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                <Users size={16} className="mr-1" />
                <span>{users.length}</span>
              </div>
            </div>
          </div>
        </div>


        <div className="flex items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopyClick();
            }}
            className="p-2 mr-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Copiar lista de alunos"
          >
            <ClipboardCopy size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownloadClick();
            }}
            className="p-2 mr-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Baixar lista de alunos"
          >
            <Download size={18} />
          </button>
          <ChevronRight
            size={20}
            className={`text-gray-400 transition-transform duration-300 ${
              isOpen ? "transform rotate-90" : ""
            }`}
          />
        </div>
      </div>


      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <motion.ul
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="border-t border-gray-200 dark:border-gray-700 py-2 px-4 divide-y divide-gray-100 dark:divide-gray-700"
            >
              {users.map((user) => (
                <motion.li
                  key={user.id}
                  variants={itemVariants}
                  className="py-3 flex items-center justify-between"
                  onMouseEnter={() => setHoveredUserId(user.id)}
                  onMouseLeave={() => setHoveredUserId(null)}
                >
                  <div className="flex items-center space-x-3">
                    {user.classUser.photoUrl ? (
                      <img
                        src={user.classUser.photoUrl}
                        alt={user.classUser.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                        <span className="text-gray-600 dark:text-gray-300 text-xs font-medium">
                          {user.classUser.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        {user.classUser.name}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Calendar size={12} className="mr-1" />
                        <span>Adicionado em {formatDate(user.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {hoveredUserId === user.id && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      onClick={() => onRemoveClick(user)}
                      title="Remover aluno"
                    >
                      <TrashBinIcon className="w-5 h-5" />
                    </motion.button>
                  )}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
















// // src/pages/components/ClassCard.tsx
// import { motion, AnimatePresence } from "framer-motion";
// import { ChevronRight, ClipboardCopy, Download } from "lucide-react";
// import { TrashBinIcon } from "../../icons";

// interface ClassUser {
//   id: string;
//   userId: string;
//   classId: string;
//   assignedBy: string;
//   createdAt: string;
//   updatedAt: string;
//   classUser: {
//     name: string;
//     photoUrl: string | null;
//   };
//   classInfo: {
//     name: string;
//     emblem: string;
//     type: string;
//   };
// }

// interface Props {
//   classId: string;
//   users: ClassUser[];
//   selectedClassId: string | null;
//   onToggle: (id: string) => void;
//   onCopy: (users: ClassUser[], classId: string) => void;
//   onDownload: (users: ClassUser[], className: string) => void;
//   onRemoveClick: (user: ClassUser) => void;
//   copiedClassId: string | null;
// }

// export const ClassCard = ({
//   classId,
//   users,
//   selectedClassId,
//   onToggle,
//   onCopy,
//   onDownload,
//   onRemoveClick,
//   copiedClassId,
// }: Props) => {
//   const { name: className, emblem } = users[0].classInfo;

//   const isOpen = selectedClassId === classId;

//   return (
//     <motion.div
//       key={classId}
//       initial={{ opacity: 0, y: -10 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//       className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md"
//     >
//       <div className="w-full px-6 py-4 flex justify-between items-center">
//         <button
//           onClick={() => onToggle(classId)}
//           className="flex items-center gap-4 text-left text-lg font-semibold text-gray-800 dark:text-white focus:outline-none"
//         >
//           <motion.div
//             animate={{ rotate: isOpen ? 90 : 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             <ChevronRight className="w-5 h-5 text-gray-700 dark:text-white" />
//           </motion.div>
//           <img src={emblem} alt={className} className="w-10 h-10 rounded-full border" />
//           <span className="flex flex-col">
//             {className}
//             <span className="text-sm text-gray-500">({users.length} membros)</span>
//           </span>
//         </button>

//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => onCopy(users, classId)}
//             className="flex items-center text-sm text-blue-500 hover:text-blue-600"
//             title="Copiar lista"
//           >
//             <ClipboardCopy className="w-4 h-4 mr-1" />
//             {copiedClassId === classId ? "Copiado!" : "Copiar"}
//           </button>
//           <button
//             onClick={() => onDownload(users, className)}
//             className="flex items-center text-sm text-green-600 hover:text-green-700"
//             title="Baixar PDF"
//           >
//             <Download className="w-4 h-4 mr-1" />
//             PDF
//           </button>
//         </div>
//       </div>

//       <AnimatePresence>
//         {isOpen && (
//           <motion.ul
//             initial={{ height: 0, opacity: 0 }}
//             animate={{ height: "auto", opacity: 1 }}
//             exit={{ height: 0, opacity: 0 }}
//             transition={{ duration: 0.4 }}
//             className="px-6 pb-4 space-y-3 overflow-hidden"
//           >
//             {users.map((user) => (
//               <motion.li
//                 key={user.id}
//                 className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 rounded-xl p-3 shadow-sm"
//               >
//                 <div className="flex items-center gap-3">
//                   {user.classUser.photoUrl ? (
//                     <img
//                       src={user.classUser.photoUrl}
//                       alt={user.classUser.name}
//                       className="w-9 h-9 rounded-full object-cover border"
//                     />
//                   ) : (
//                     <div className="w-9 h-9 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-sm text-gray-600 dark:text-white">
//                       {user.classUser.name[0]}
//                     </div>
//                   )}
//                   <span className="text-gray-800 dark:text-white">{user.classUser.name}</span>
//                 </div>
//                 <button
//                   onClick={() => onRemoveClick(user)}
//                   className="text-red-500 hover:text-red-600 focus:outline-none"
//                   title="Remover da classe"
//                 >
//                   <TrashBinIcon className="w-5 h-5" />
//                 </button>
//               </motion.li>
//             ))}
//           </motion.ul>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// };
