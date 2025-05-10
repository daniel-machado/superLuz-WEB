import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Building2, FileText, Loader2, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Unit } from '../../dtos/UnitDTO';

const ManageAnswerUnit = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [filteredUnits, setFilteredUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { units: contextUnits } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (contextUnits && contextUnits.length > 0) {
      setUnits(contextUnits);
      setFilteredUnits(contextUnits);
    }
    setIsLoading(false);
  }, [contextUnits]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUnits(units);
    } else {
      const filtered = units.filter((unit) =>
        unit.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUnits(filtered);
    }
  }, [searchTerm, units]);

  const handleReportClick = (unitId: string) => {
    navigate(`/unit-reports/${unitId}`);
    toast.success('Carregando relatório da unidade', {
      position: 'bottom-right',
      className: 'dark:bg-gray-800 dark:text-white',
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
          <p className="text-lg font-medium">Carregando unidades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">  
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                Gerenciamento de Unidades
              </h1>
              <p className="text-gray-400 mt-1">
                Visualize e gerencie respostas de todas as unidades
              </p>
            </div>

            <div className="relative mt-4 md:mt-0 w-full md:w-64">
              <input
                type="text"
                placeholder="Buscar unidades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-400">
              {filteredUnits.length}{' '}
              {filteredUnits.length === 1 ? 'unidade encontrada' : 'unidades encontradas'}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                toast.dismiss();
                toast.loading('Recarregando unidades...', {
                  position: 'bottom-right',
                  className: 'dark:bg-gray-800 dark:text-white',
                });
                setUnits(contextUnits || []);
                setFilteredUnits(contextUnits || []);
                toast.dismiss();
                toast.success('Unidades atualizadas', {
                  position: 'bottom-right',
                  className: 'dark:bg-gray-800 dark:text-white',
                });
              }}
              className="flex items-center text-sm px-3 py-1.5 bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700 transition-colors"
            >
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate" /> Atualizar
            </motion.button>
          </div>
        </motion.div>

        {filteredUnits.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredUnits.map((unit) => (
              <motion.div
                key={unit.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, boxShadow: '0 8px 20px -4px rgba(0, 0, 0, 0.3)' }}
                className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 transition-all duration-300 hover:border-blue-500/50"
              >
                <div className="h-44 overflow-hidden bg-gray-700 relative">
                  {unit.photo ? (
                    <img
                      src={unit.photo}
                      alt={unit.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-700">
                      <Building2 className="w-12 h-12 text-gray-500" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-3">
                    <h2 className="text-xl font-semibold text-white truncate">{unit.name}</h2>
                  </div>
                </div>

                <div className="p-5">
                  {unit.counselors && unit.counselors.length > 0 && (
                    <div className="mb-3 text-sm text-gray-400">
                      Conselheiros:{' '}
                      <span className="bg-gray-700 px-2 py-0.5 rounded-full">
                        {unit.counselors.length}
                      </span>
                    </div>
                  )}
                  {unit.dbvs && unit.dbvs.length > 0 && (
                    <div className="mb-3 text-sm text-gray-400">
                      DBVs:{' '}
                      <span className="bg-gray-700 px-2 py-0.5 rounded-full">
                        {unit.dbvs.length}
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() => handleReportClick(unit.id)}
                    className="mt-2 flex items-center justify-center text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all w-full"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Ver Relatório
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-center text-gray-500 mt-8">Nenhuma unidade encontrada.</p>
        )}
      </div>
    </div>
  );
};

export default ManageAnswerUnit;






















// import { useEffect, useState } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { Clipboard, FileText, Building2, Loader2, Search } from 'lucide-react';
// import { motion } from 'framer-motion';
// import toast from 'react-hot-toast';
// import { Unit } from '../../dtos/UnitDTO';

// const ManageAnswerUnit = () => {
//   const [unitsData, setUnitsData] = useState<Unit[]>([]);
//   const [filteredUnits, setFilteredUnits] = useState<Unit[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');

//   const { units } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchUnits();
//   }, []);

//   useEffect(() => {
//     if (searchTerm.trim() === '') {
//       setFilteredUnits(unitsData);
//     } else {
//       const filtered = unitsData.filter(unit => 
//         unit.name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredUnits(filtered);
//     }
//   }, [searchTerm, unitsData]);

//   const fetchUnits = async () => {
//     try {
//       setIsLoading(true);
//       setUnitsData(units);
//       setFilteredUnits(units);
//       setIsLoading(false);
//       toast.success("Unidades carregadas com sucesso", {
//         position: 'bottom-right',
//         className: 'dark:bg-gray-800 dark:text-white'
//       });
//     } catch (error) {
//       console.error("Erro ao carregar unidades:", error);
//       toast.error("Erro ao carregar unidades. Tente novamente.", {
//         position: 'bottom-right',
//         className: 'dark:bg-gray-800 dark:text-white'
//       });
//       setIsLoading(false);
//     }
//   };

//   const handleReportClick = (unitId: string) => {
//     navigate(`/unit-reports/${unitId}`);
//     toast.success("Carregando relatório da unidade", {
//       position: 'bottom-right',
//       className: 'dark:bg-gray-800 dark:text-white'
//     });
//   };

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.08
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         type: "spring",
//         stiffness: 100
//       }
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
//         <div className="flex flex-col items-center">
//           <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
//           <p className="text-lg font-medium">Carregando unidades...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-900 text-white">
//       <div className="container mx-auto px-4 py-8">
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="mb-8"
//         >
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//             <div>
//               <h1 className="text-3xl font-bold text-white mb-2">Gerenciamento de Unidades</h1>
//               <p className="text-gray-400">Visualize e gerencie respostas de todas as unidades</p>
//             </div>
            
//             <div className="relative mt-4 md:mt-0 w-full md:w-64">
//               <input
//                 type="text"
//                 placeholder="Buscar unidades..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//               <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
//             </div>
//           </div>

//           <div className="flex items-center justify-between mb-4">
//             <div className="text-sm text-gray-400">
//               {filteredUnits.length} {filteredUnits.length === 1 ? 'unidade encontrada' : 'unidades encontradas'}
//             </div>
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={fetchUnits}
//               className="flex items-center text-sm px-3 py-1.5 bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700 transition-colors"
//             >
//               <Loader2 className="w-3.5 h-3.5 mr-1.5" /> Atualizar
//             </motion.button>
//           </div>
//         </motion.div>

//         {filteredUnits.length > 0 ? (
//           <motion.div
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
//           >
//             {filteredUnits.map((unit) => (
//               <motion.div
//                 key={unit.id}
//                 variants={itemVariants}
//                 whileHover={{ 
//                   scale: 1.02, 
//                   boxShadow: "0 8px 20px -4px rgba(0, 0, 0, 0.3)" 
//                 }}
//                 className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 transition-all duration-300 hover:border-blue-500/50"
//               >
//                 <div className="h-44 overflow-hidden bg-gray-700 relative">
//                   {unit.photo ? (
//                     <img
//                       src={unit.photo}
//                       alt={unit.name}
//                       className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
//                     />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center bg-gray-700">
//                       <Building2 className="w-12 h-12 text-gray-500" />
//                     </div>
//                   )}
//                   <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-3">
//                     <h2 className="text-xl font-semibold text-white truncate">{unit.name}</h2>
//                   </div>
//                 </div>
                
//                 <div className="p-5">
//                   <div className="mb-4">
//                     {unit.counselors && unit.counselors.length > 0 && (
//                       <div className="flex flex-wrap gap-1 mb-3">
//                         <span className="text-xs font-medium text-gray-400 mr-2">Conselheiros:</span>
//                         <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
//                           {unit.counselors.length}
//                         </span>
//                       </div>
//                     )}
                    
//                     {unit.dbvs && unit.dbvs.length > 0 && (
//                       <div className="flex flex-wrap gap-1">
//                         <span className="text-xs font-medium text-gray-400 mr-2">DBVs:</span>
//                         <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
//                           {unit.dbvs.length}
//                         </span>
//                       </div>
//                     )}
//                   </div>
        
//                   <div className="mt-4">
//                     <motion.button
//                       whileHover={{ scale: 1.03 }}
//                       whileTap={{ scale: 0.97 }}
//                       onClick={() => handleReportClick(unit.id)}
//                       className="w-full flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
//                     >
//                       <FileText className="w-4 h-4 mr-2" />
//                       Ver Relatório
//                     </motion.button>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </motion.div>
//         ) : (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.3 }}
//             className="text-center py-16"
//           >
//             <div className="bg-gray-800 p-8 rounded-xl inline-block border border-gray-700 shadow-lg">
//               <Clipboard className="w-16 h-16 text-gray-500 mx-auto mb-4" />
//               <h3 className="text-xl font-medium text-gray-200">Nenhuma unidade encontrada</h3>
//               <p className="text-gray-400 mt-2">
//                 {searchTerm ? 'Nenhuma unidade corresponde à sua busca.' : 'Não há unidades disponíveis para visualização.'}
//               </p>
//               {searchTerm && (
//                 <button 
//                   onClick={() => setSearchTerm('')}
//                   className="mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium"
//                 >
//                   Limpar busca
//                 </button>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ManageAnswerUnit;

























// import { useEffect, useState } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { Clipboard, FileText } from 'lucide-react';
// import { motion } from 'framer-motion';
// import toast from 'react-hot-toast';
// import { Unit } from '../../dtos/UnitDTO';

// const ManageAnswerUnit = () => {
//   const [unitsData, setUnitsData] = useState<Unit[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   const { units } = useAuth();

//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchUnits();
//   }, []);

//   const fetchUnits = async () => {
//     try {
//       setIsLoading(true);
//       setUnitsData(units);
//       setIsLoading(false);
//     } catch (error) {
//       console.error("Erro ao carregar unidades:", error);
//       toast.error("Erro ao carregar unidades. Tente novamente.", {position: 'bottom-right'});
//       setIsLoading(false);
//     }
//   };

//   const handleReportClick = (unitId: any) => {
//     navigate(`/unit-reports/${unitId}`);
//     toast.success("Carregando relatório da unidade", {position: 'bottom-right'});
//   };

//   // Variants para animações
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         type: "spring",
//         stiffness: 100
//       }
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="mb-8"
//       >
//         <h1 className="text-3xl font-bold text-gray-800">Gerenciamento de Unidades</h1>
//         <p className="text-gray-600 mt-2">Visualize e gerencie respostas de todas as unidades</p>
//       </motion.div>

//       <motion.div 
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//         className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
//       >
//         {unitsData.map((unit) => (
//           <motion.div
//             key={unit.id}
//             variants={itemVariants}
//             whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
//             className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100"
//           >
//             <div className="h-48 overflow-hidden bg-gray-200">
//               {unit.photo ? (
//                 <img 
//                   src={unit.photo} 
//                   alt={unit.name} 
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center bg-gray-100">
//                   <Clipboard className="w-16 h-16 text-gray-400" />
//                 </div>
//               )}
//             </div>
//             <div className="p-6">
//               <h2 className="text-xl font-semibold text-gray-800 mb-2">{unit.name}</h2>
          
//               <div className="flex justify-between items-center mt-4">
              
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => handleReportClick(unit.id)}
//                   className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//                 >
//                   <FileText className="w-4 h-4 mr-2" />
//                   Relatório
//                 </motion.button>
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </motion.div>

//       {unitsData.length === 0 && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.3 }}
//           className="text-center py-16"
//         >
//           <div className="bg-gray-100 p-8 rounded-lg inline-block">
//             <Clipboard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-xl font-medium text-gray-700">Nenhuma unidade encontrada</h3>
//             <p className="text-gray-500 mt-2">Não há unidades disponíveis para visualização.</p>
//           </div>
//         </motion.div>
//       )}
//     </div>
//   );
// };

// export default ManageAnswerUnit;
