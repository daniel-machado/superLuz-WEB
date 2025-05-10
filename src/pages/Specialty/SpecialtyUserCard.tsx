// import React from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Award, User, ChevronUp, ChevronDown, FileText, UserCheck, XCircle } from 'lucide-react';
// import { Button, Badge } from 'your-ui-library'; // Replace with your actual UI library import


// const SpecialtyCard = ({ 
//   item, 
//   expandedItems, 
//   handleToggleExpand, 
//   formatDate, 
//   getApprovalProgress, 
//   getStatusBadge, 
//   canSubmitReport, 
//   canApprove, 
//   onReportSend, 
//   onApprove, 
//   onRemove, 
//   userLogged,
//   index = 0 
// }) => {
//   // Card animation variants
//   const cardVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0 },
//     exit: { opacity: 0, y: -20 }
//   };


//   return (
//     <motion.div
//       layout
//       variants={cardVariants}
//       initial="hidden"
//       animate="visible"
//       exit="exit"
//       transition={{ delay: index * 0.05 }}
//       className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:border-indigo-500 transition-all duration-300 w-full"
//     >
//       {/* Card Header With Image Background - More responsive layout */}
//       <div
//         className="min-h-24 bg-gradient-to-r from-indigo-800 to-purple-700 relative p-2"
//         style={item.specialtyInfo?.emblem ? {
//           backgroundImage: `linear-gradient(rgba(49, 46, 129, 0.7), rgba(67, 56, 202, 0.7)), url(${item.specialtyInfo.emblem})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center'
//         } : {}}
//       >
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 relative">
//           {/* Left side with emblem and title - stacks on mobile */}
//           <div className="flex flex-col sm:flex-row items-start sm:items-center w-full">
//             <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full border-2 border-white bg-gray-900 flex items-center justify-center overflow-hidden flex-shrink-0">
//               {item.specialtyInfo?.emblem ? (
//                 <img
//                   src={item.specialtyInfo.emblem}
//                   alt={item.specialtyInfo?.name || "Especialidade"}
//                   className="h-full w-full object-cover"
//                 />
//               ) : (
//                 <Award size={20} className="text-white" />
//               )}
//             </div>
            
//             <div className="flex-1 mt-2 sm:mt-0 sm:ml-4">
//               <h3 className="text-base sm:text-lg font-bold text-white truncate">
//                 {item.specialtyInfo?.name || "Especialidade"}
//               </h3>
//               <div className="flex items-center mt-1">
//                 <Badge
//                   color="info"
//                   className="text-xs"
//                 >
//                   {item.specialtyInfo?.category || "Categoria"}
//                 </Badge>
//               </div>
//             </div>
//           </div>
          
//           {/* Status badge - positioned better for small screens */}
//           <div className="absolute top-2 right-2 sm:relative sm:top-auto sm:right-auto mt-1 sm:mt-0">
//             {getStatusBadge(item.approvalStatus)}
//           </div>
//         </div>
//       </div>
     
//       {/* Card Body */}
//       <div className="p-3 sm:p-4">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
//           <div className="flex items-center gap-2">
//             <User size={16} className="text-gray-400" />
//             <span className="text-xs sm:text-sm text-gray-300 truncate">
//               {item.specialtyUser?.name || "Desbravador"}
//             </span>
//           </div>
//           <div className="text-xs text-gray-500">
//             Associado em: {formatDate(item.createdAt)}
//           </div>
//         </div>
       
//         {/* Approval Progress Bar */}
//         <div className="mb-3">
//           <div className="flex justify-between items-center mb-1">
//             <span className="text-xs text-gray-400">Progresso da Aprovação</span>
//             <span className="text-xs font-semibold text-indigo-400">
//               {getApprovalProgress(item)}%
//             </span>
//           </div>
//           <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
//             <div
//               className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
//               style={{ width: `${getApprovalProgress(item)}%` }}
//             ></div>
//           </div>
//         </div>
       
//         {/* Expand/Collapse Section */}
//         <Button
//           variant="outline"
//           onClick={() => handleToggleExpand(item.id)}
//           className="w-full flex items-center justify-between py-1.5 sm:py-2 text-xs sm:text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
//         >
//           <span>Detalhes e Opções</span>
//           {expandedItems.includes(item.id) ? (
//             <ChevronUp size={16} />
//           ) : (
//             <ChevronDown size={16} />
//           )}
//         </Button>
       
//         {/* Expanded Content */}
//         <AnimatePresence>
//           {expandedItems.includes(item.id) && (
//             <motion.div
//               initial={{ height: 0, opacity: 0 }}
//               animate={{ height: 'auto', opacity: 1 }}
//               exit={{ height: 0, opacity: 0 }}
//               transition={{ duration: 0.3 }}
//               className="overflow-hidden"
//             >
//               <div className="pt-3 space-y-3 border-t border-gray-700 mt-3">
//                 {/* Status Information - Adjusted for better mobile display */}
//                 <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-2 text-xs">
//                   <div className="flex items-center gap-1.5">
//                     <div className={`w-2 h-2 rounded-full ${item.isQuizApproved ? 'bg-green-500' : 'bg-gray-500'}`} />
//                     <span className={item.isQuizApproved ? 'text-green-400' : 'text-gray-500'}>
//                       Quiz Aprovado
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-1.5">
//                     <div className={`w-2 h-2 rounded-full ${item.report.length > 0 ? 'bg-green-500' : 'bg-gray-500'}`} />
//                     <span className={item.report.length > 0 ? 'text-green-400' : 'text-gray-500'}>
//                       Relatório Enviado
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-1.5">
//                     <div className={`w-2 h-2 rounded-full ${item.counselorApproval ? 'bg-green-500' : 'bg-gray-500'}`} />
//                     <span className={item.counselorApproval ? 'text-green-400' : 'text-gray-500'}>
//                       Conselheiro
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-1.5">
//                     <div className={`w-2 h-2 rounded-full ${item.leadApproval ? 'bg-green-500' : 'bg-gray-500'}`} />
//                     <span className={item.leadApproval ? 'text-green-400' : 'text-gray-500'}>
//                       Líder
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-1.5">
//                     <div className={`w-2 h-2 rounded-full ${item.directorApproval ? 'bg-green-500' : 'bg-gray-500'}`} />
//                     <span className={item.directorApproval ? 'text-green-400' : 'text-gray-500'}>
//                       Diretor
//                     </span>
//                   </div>
//                 </div>
               
//                 {/* Report Preview (if exists) */}
//                 {item.report && item.report.length > 0 && (
//                   <div className="p-2 sm:p-3 bg-gray-750 rounded-lg text-xs text-gray-300 mt-2">
//                     <div className="flex items-center mb-1.5">
//                       <FileText size={14} className="text-indigo-400 mr-2" />
//                       <span className="font-semibold text-indigo-400">Relatório Enviado:</span>
//                     </div>
//                     <p className="line-clamp-3 text-xs sm:text-sm">
//                       {item.report}
//                     </p>
//                   </div>
//                 )}
               
//                 {/* Action Buttons - More responsive layout */}
//                 <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 pt-2">
//                   {/* Send Report Button */}
//                   {canSubmitReport(item) && (
//                     <Button
//                       size="sm"
//                       variant="primary"
//                       className="text-xs flex items-center justify-center gap-1 w-full"
//                       onClick={() => onReportSend(item)}
//                     >
//                       <FileText size={14} />
//                       <span>Enviar Relatórioo</span>
//                     </Button>
//                   )}
                 
//                   {/* Approve Button */}
//                   {canApprove(item) && (
//                     <Button
//                       size="sm"
//                       className="text-xs flex items-center justify-center gap-1 w-full"
//                       onClick={() => onApprove(item)}
//                     >
//                       <UserCheck size={14} />
//                       <span>Aprovar / Rejeitar</span>
//                     </Button>
//                   )}
                 
//                   {/* Remove Button */}
//                   {(userLogged?.user.user.role === 'admin' ||
//                     (userLogged?.user.user.id === item.userId && item.approvalStatus !== 'approved')) && (
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       className="text-xs flex items-center justify-center gap-1 w-full col-span-1 xs:col-span-2"
//                       onClick={() => onRemove(item)}
//                     >
//                       <XCircle size={14} />
//                       <span>Remover</span>
//                     </Button>
//                   )}
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </motion.div>
//   );
// };


// export default SpecialtyCard;
