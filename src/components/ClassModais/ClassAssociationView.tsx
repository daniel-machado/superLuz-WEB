// src/components/ClassModais/ClassAssociationView.tsx
import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ClassCard } from "./ClassCard";
import { FilterIcon } from "lucide-react";


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
  data: ClassUser[];
  search: string;
  onRemoveClick: (user: ClassUser) => void;
}


export const ClassAssociationView = ({ data, search, onRemoveClick }: Props) => {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [copiedClassId, setCopiedClassId] = useState<string | null>(null);
  const [classTypeFilter, setClassTypeFilter] = useState<string>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [classCounts, setClassCounts] = useState({ total: 0, regular: 0, advanced: 0, leadership: 0 });


  // Animation variants
  const filterVariants: Variants = {
    hidden: { opacity: 0, height: 0, marginBottom: 0 },
    visible: { opacity: 1, height: "auto", marginBottom: 16, transition: { duration: 0.3 } }
  };


  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };


  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };


  useEffect(() => {
    // Calculate class type counts
    const counts = {
      total: 0,
      regular: 0,
      advanced: 0,
      leadership: 0
    };


    const uniqueClasses = new Set();
    
    data.forEach(item => {
      if (!uniqueClasses.has(item.classId)) {
        uniqueClasses.add(item.classId);
        
        counts.total++;
        
        const type = item.classInfo.type.toLowerCase();
        if (type === "regular") counts.regular++;
        else if (type === "advanced") counts.advanced++;
        else if (type === "leadership") counts.leadership++;
      }
    });


    setClassCounts(counts);
  }, [data]);


  const groupedByClassId = data.reduce((acc: Record<string, ClassUser[]>, item) => {
    const classId = item.classId;
    if (!acc[classId]) acc[classId] = [];
    acc[classId].push(item);
    return acc;
  }, {});


  const filteredGrouped = Object.entries(groupedByClassId).filter(([_, users]) => {
    const nameMatch = users[0]?.classInfo?.name?.toLowerCase().includes(search.toLowerCase());
    const typeMatch =
      classTypeFilter === "all" || users[0]?.classInfo?.type?.toLowerCase() === classTypeFilter;
    return nameMatch && typeMatch;
  });


  const handleCopy = (users: ClassUser[], classId: string) => {
    const names = users.map((u) => `- ${u.classUser.name}`).join("\n");
    navigator.clipboard.writeText(names);
    setCopiedClassId(classId);
    setTimeout(() => setCopiedClassId(null), 2000);
  };


  const handleDownloadPDF = (users: ClassUser[], className: string) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(44, 62, 80);
    doc.text(`Lista de Membros - ${className}`, 15, 20);
    
    // Add date
    const today = new Date();
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Gerado em: ${today.toLocaleDateString('pt-BR')}`, 15, 28);
    
    // Add table headers
    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    doc.setDrawColor(41, 128, 185);
    doc.setLineWidth(0.1);
    doc.line(15, 35, 195, 35);
    
    doc.setFont("helvetica", "bold");
    doc.text("Nº", 15, 40);
    doc.text("Nome", 30, 40);
    doc.line(15, 42, 195, 42);
    doc.setFont("helvetica", "normal");
    
    // Add table content
    users.forEach((user, index) => {
      const y = 48 + index * 8;
      doc.text(`${index + 1}`, 15, y);
      doc.text(user.classUser.name, 30, y);
      
      // Add light horizontal line between rows
      if (index < users.length - 1) {
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.05);
        doc.line(15, y + 2, 195, y + 2);
      }
    });
    
    // Add footer
    const pageCount = doc.getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Página 1 de ${pageCount}`, 15, 285);
    doc.text(`Total de membros: ${users.length}`, 170, 285);
    
    doc.save(`classe-${className.replace(/\s+/g, "-").toLowerCase()}.pdf`);
  };


  const handleToggle = (id: string) => {
    setSelectedClassId((prev) => (prev === id ? null : id));
  };


  return (
    <div className="space-y-4">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex flex-wrap items-center justify-between gap-4 mb-6"
      >
        <div className="flex flex-wrap gap-2">
          <motion.div 
            className="bg-white dark:bg-gray-800 py-1 px-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total:</span>
            <span className="ml-1 text-sm font-bold text-blue-600 dark:text-blue-400">{classCounts.total}</span>
          </motion.div>
          
          <motion.div 
            className="bg-white dark:bg-gray-800 py-1 px-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Regulares:</span>
            <span className="ml-1 text-sm font-bold text-green-600 dark:text-green-400">{classCounts.regular}</span>
          </motion.div>
          
          <motion.div 
            className="bg-white dark:bg-gray-800 py-1 px-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Avançadas:</span>
            <span className="ml-1 text-sm font-bold text-purple-600 dark:text-purple-400">{classCounts.advanced}</span>
          </motion.div>
          
          <motion.div 
            className="bg-white dark:bg-gray-800 py-1 px-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Liderança:</span>
            <span className="ml-1 text-sm font-bold text-amber-600 dark:text-amber-400">{classCounts.leadership}</span>
          </motion.div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <FilterIcon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtrar</span>
        </motion.button>
      </motion.div>


      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            variants={filterVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Filtrar por tipo de classe:</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setClassTypeFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  classTypeFilter === "all"
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 shadow-sm"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setClassTypeFilter("regular")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  classTypeFilter === "regular"
                    ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 shadow-sm"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                Regulares
              </button>
              <button
                onClick={() => setClassTypeFilter("advanced")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  classTypeFilter === "advanced"
                    ? "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 shadow-sm"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                Avançadas
              </button>
              <button
                onClick={() => setClassTypeFilter("leadership")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  classTypeFilter === "leadership"
                    ? "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 shadow-sm"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                Liderança
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {filteredGrouped.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center my-16 py-12 px-4 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="inline-flex justify-center items-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Nenhuma classe encontrada</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Tente ajustar os critérios de busca ou filtros para encontrar as classes desejadas.
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-5"
        >
          {filteredGrouped.map(([classId, users]) => (
            <motion.div key={classId} variants={itemVariants}>
              <ClassCard
                classId={classId}
                users={users}
                selectedClassId={selectedClassId}
                onToggle={handleToggle}
                onCopy={handleCopy}
                onDownload={handleDownloadPDF}
                onRemoveClick={onRemoveClick}
                copiedClassId={copiedClassId}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};















// // src/pages/components/ClassAssociationView.tsx
// import { useState } from "react";
// import { jsPDF } from "jspdf";
// import { ClassCard } from "./ClassCard";
// import { motion } from "framer-motion";

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
//   data: ClassUser[];
//   search: string;
//   onRemoveClick: (user: ClassUser) => void;
// }

// export const ClassAssociationView = ({ data, search, onRemoveClick }: Props) => {
//   const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
//   const [copiedClassId, setCopiedClassId] = useState<string | null>(null);
//   const [classTypeFilter, setClassTypeFilter] = useState<string>("all");

//   const groupedByClassId = data.reduce((acc: Record<string, ClassUser[]>, item) => {
//     const classId = item.classId;
//     if (!acc[classId]) acc[classId] = [];
//     acc[classId].push(item);
//     return acc;
//   }, {});

//   const filteredGrouped = Object.entries(groupedByClassId).filter(([_, users]) => {
//     const nameMatch = users[0]?.classInfo?.name?.toLowerCase().includes(search.toLowerCase());
//     const typeMatch =
//       classTypeFilter === "all" || users[0]?.classInfo?.type?.toLowerCase() === classTypeFilter;
//     return nameMatch && typeMatch;
//   });

//   const handleCopy = (users: ClassUser[], classId: string) => {
//     const names = users.map((u) => `- ${u.classUser.name}`).join("\n");
//     navigator.clipboard.writeText(names);
//     setCopiedClassId(classId);
//     setTimeout(() => setCopiedClassId(null), 2000);
//   };

//   const handleDownloadPDF = (users: ClassUser[], className: string) => {
//     const doc = new jsPDF();
//     doc.setFontSize(16);
//     doc.text(`Lista de Membros - ${className}`, 10, 20);
//     doc.setFontSize(12);
//     users.forEach((user, index) => {
//       doc.text(`${index + 1}. ${user.classUser.name}`, 10, 30 + index * 8);
//     });
//     doc.save(`classe-${className.replace(/\s+/g, "-").toLowerCase()}.pdf`);
//   };

//   const handleToggle = (id: string) => {
//     setSelectedClassId((prev) => (prev === id ? null : id));
//   };

//   return (
//     <div className="space-y-4">
//       <motion.div
//         initial={{ opacity: 0, y: -10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4 }}
//         className="mb-4 flex justify-end"
//       >
//         <select
//           className="p-2 rounded-xl border dark:bg-gray-800 dark:text-white"
//           value={classTypeFilter}
//           onChange={(e) => setClassTypeFilter(e.target.value)}
//         >
//           <option value="all">Todas</option>
//           <option value="regular">Regulares</option>
//           <option value="advanced">Avançadas</option>
//           <option value="leadership">Liderança</option>
//         </select>
//       </motion.div>

//       {filteredGrouped.length === 0 ? (
//         <p className="text-center mt-8 text-gray-500">Nenhuma classe encontrada.</p>
//       ) : (
//         filteredGrouped.map(([classId, users]) => (
//           <ClassCard
//             key={classId}
//             classId={classId}
//             users={users}
//             selectedClassId={selectedClassId}
//             onToggle={handleToggle}
//             onCopy={handleCopy}
//             onDownload={handleDownloadPDF}
//             onRemoveClick={onRemoveClick}
//             copiedClassId={copiedClassId}
//           />
//         ))
//       )}
//     </div>
//   );
// };
