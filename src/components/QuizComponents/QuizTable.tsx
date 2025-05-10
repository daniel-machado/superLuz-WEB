import { motion, AnimatePresence } from "framer-motion";
//import { TrashBinIcon, PencilIcon, EyeIcon } from "../../icons";

import Switch from "../form/switch/Switch";
import Badge from "../ui/badge/Badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Button from "../ui/button/Button";


interface Quiz {
  id: string;
  title: string;
  specialtyId: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}


interface Props {
  quizzes: Quiz[];
  onDelete: (id: string) => void;
  onToggleActive: (quiz: Quiz) => void;
  onViewQuestions: (quiz: Quiz) => void;
}


export default function QuizList({ quizzes, onDelete, onToggleActive, onViewQuestions }: Props) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };


  return (
    <div className="w-full">
      {/* Desktop Header - Hidden on Small Screens */}
      <div className="hidden md:grid md:grid-cols-12 bg-gray-50 dark:bg-gray-700 rounded-t-lg p-4 font-medium text-xs uppercase text-gray-500 dark:text-gray-300">
        <div className="col-span-5">Título do Quiz</div>
        <div className="col-span-2">Criado em</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-3 text-right">Ações</div>
      </div>


      {/* Quiz Cards */}
      <AnimatePresence initial={false}>
        <div className="space-y-3 mt-2">
          {quizzes.length > 0 ? (
            quizzes.map((quiz) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                {/* Mobile Layout */}
                <div className="md:hidden p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium text-gray-900 dark:text-white">{quiz.title}</h3>
                    <Badge color={quiz.is_active ? "success" : "warning"}>
                      {quiz.is_active ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    Criado em: {formatDate(quiz.createdAt)}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Switch
                        label="status"
                        defaultChecked={quiz.is_active}
                        onChange={() => onToggleActive(quiz)}
                      />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {quiz.is_active ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => onViewQuestions(quiz)}
                        size="sm"
                        //startIcon={<EyeIcon className="w-4 h-4" />}
                      >
                        Ver
                      </Button>
                      <Button
                        onClick={() => onDelete(quiz.id)}
                        size="sm"
                        //startIcon={<TrashBinIcon className="w-4 h-4" />}
                      >
                        Deletar
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Desktop Layout */}
                <div className="hidden md:grid md:grid-cols-12 items-center p-4">
                  <div className="col-span-5 text-sm font-medium text-gray-900 dark:text-white">
                    {quiz.title}
                  </div>
                  <div className="col-span-2 text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(quiz.createdAt)}
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center space-x-3">
                      <Switch
                        label="status"
                        defaultChecked={quiz.is_active}
                        onChange={() => onToggleActive(quiz)}
                      />
                      <Badge color={quiz.is_active ? "success" : "warning"}>
                        {quiz.is_active ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  </div>
                  <div className="ml-10 col-span-3 flex justify-end space-x-2">
                    <Button
                      onClick={() => onViewQuestions(quiz)}
                      size="sm"
                      //startIcon={<EyeIcon className="w-4 h-4" />}
                    >
                      <span>Ver Questões</span>
                    </Button>
                    <Button
                      onClick={() => onDelete(quiz.id)}
                      size="sm"
                      //startIcon={<TrashBinIcon className="w-4 h-4" />}
                    >
                      <span>Deletar</span>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhum quiz encontrado.</p>
            </motion.div>
          )}
        </div>
      </AnimatePresence>
    </div>
  );
}






















// import { motion, AnimatePresence } from "framer-motion";
// import { TrashBinIcon, PencilIcon, EyeIcon } from "../../icons";
// import Button from "../ui/button/Button";
// import Switch from "../form/switch/Switch";
// import Badge from "../ui/badge/Badge";
// import { format } from "date-fns";
// import { ptBR } from "date-fns/locale";


// interface Quiz {
//   id: string;
//   title: string;
//   specialtyId: string;
//   is_active: boolean;
//   createdAt: string;
//   updatedAt: string;
// }


// interface Props {
//   quizzes: Quiz[];
//   onEdit: (quiz: Quiz) => void;
//   onDelete: (id: string) => void;
//   onToggleActive: (quiz: Quiz) => void;
//   onViewQuestions: (quiz: Quiz) => void;
// }


// export default function QuizTable({ quizzes, onEdit, onDelete, onToggleActive, onViewQuestions }: Props) {
//   console.log(quizzes)
//   const formatDate = (dateString: string) => {
//     try {
//       return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
//     } catch (error) {
//       return "Data inválida";
//     }
//   };


//   return (
//     <div className="overflow-x-auto">
//       <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//         <thead className="bg-gray-50 dark:bg-gray-700">
//           <tr>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//               Título do Quiz
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
//               Criado em
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//               Status
//             </th>
//             <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//               Ações
//             </th>
//           </tr>
//         </thead>
//         <AnimatePresence initial={false}>
//           <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
//             {quizzes.map((quiz) => (
//               <motion.tr
//                 key={quiz.id}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 transition={{ duration: 0.2 }}
//                 className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
//               >
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm font-medium text-gray-900 dark:text-white">
//                     {quiz.title}
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
//                   <div className="text-sm text-gray-500 dark:text-gray-300">
//                     {formatDate(quiz.createdAt)}
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="flex items-center space-x-3">
//                     <Switch
//                       label={`status`}
//                       defaultChecked={quiz.is_active}
//                       onChange={() => onToggleActive(quiz)}
//                     />
//                     <Badge 
//                       color={quiz.is_active ? "success" : "warning"}
//                     >
//                       {quiz.is_active ? "Ativo" : "Inativo"}
//                     </Badge>
                    
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2 flex flex-col sm:flex-row items-end sm:items-center justify-end gap-2">
//                   <Button
//                     onClick={() => onViewQuestions(quiz)}
//                     //variant="secondary"
//                     size="sm"
//                     startIcon={<EyeIcon className="w-4 h-4" />}
//                     className="sm:inline-flex"
//                   >
//                     <span className="hidden sm:inline">Ver Questões</span>
//                     <span className="sm:hidden">Ver</span>
//                   </Button>
//                   <Button
//                     onClick={() => onEdit(quiz)}
//                     //variant="info"
//                     size="sm"
//                     startIcon={<PencilIcon className="w-4 h-4" />}
//                     className="sm:inline-flex"
//                   >
//                     <span className="hidden sm:inline">Editar</span>
//                     <span className="sm:hidden">Edit</span>
//                   </Button>
//                   <Button
//                     onClick={() => onDelete(quiz.id)}
//                     //variant="danger"
//                     size="sm"
//                     startIcon={<TrashBinIcon className="w-4 h-4" />}
//                     className="sm:inline-flex"
//                   >
//                     <span className="hidden sm:inline">Deletar</span>
//                     <span className="sm:hidden">Del</span>
//                   </Button>
//                 </td>
//               </motion.tr>
//             ))}
//             {quizzes.length === 0 && (
//               <tr>
//                 <td colSpan={4} className="px-6 py-10 text-center text-gray-400 dark:text-gray-500">
//                   <div className="flex flex-col items-center justify-center">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     <p>Nenhum quiz cadastrado.</p>
//                   </div>
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </AnimatePresence>
//       </table>
//     </div>
//   );
// }






















// import { motion, AnimatePresence } from "framer-motion";
// import { TrashBinIcon, PencilIcon, EyeIcon } from "../../icons";
// import Button from "../ui/button/Button";

// interface Quiz {
//   id: string;
//   title: string;
//   specialtyId: string;
// }

// interface Props {
//   quizzes: Quiz[];
//   onEdit: (quiz: Quiz) => void;
//   onDelete: (id: string) => void;
//   onViewQuestions: (quiz: Quiz) => void;
// }

// export default function QuizTable({ quizzes, onEdit, onDelete, onViewQuestions }: Props) {
//   return (
//     <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//           <thead>
//             <tr>
//               <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Título do Quiz</th>
//               <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Ações</th>
//             </tr>
//           </thead>
//           <AnimatePresence initial={false}>
//             <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//               {quizzes.map((quiz) => (
//                 <motion.tr
//                   key={quiz.id}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   transition={{ duration: 0.2 }}
//                   className="hover:bg-gray-100 dark:hover:bg-dark-800 transition"
//                 >
//                   <td className="px-6 py-4 text-sm text-gray-800 dark:text-white">
//                     {quiz.title}
//                   </td>
//                   <td className="px-6 py-4 text-right space-x-2">
//                     <Button
//                       onClick={() => onViewQuestions(quiz)}
//                       startIcon={<EyeIcon className="w-4 h-4" />}
//                     >
//                       Ver
//                     </Button>
//                     <Button
//                       onClick={() => onEdit(quiz)}
//                       startIcon={<PencilIcon className="w-4 h-4" />}
//                     >
//                       Editar
//                     </Button>
//                     <Button
//                       onClick={() => onDelete(quiz.id)}
//                       startIcon={<TrashBinIcon className="w-4 h-4" />}
//                     >
//                       Deletar
//                     </Button>
//                   </td>
//                 </motion.tr>
//               ))}
//               {quizzes.length === 0 && (
//                 <tr>
//                   <td colSpan={2} className="px-6 py-4 text-center text-gray-400">
//                     Nenhum quiz cadastrado.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </AnimatePresence>
//         </table>
//       </div>
//     </div>
//   );
// }
