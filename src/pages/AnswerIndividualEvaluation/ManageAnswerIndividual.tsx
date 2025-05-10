import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Building2, UserCircle, Loader2, Search, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { unitsService } from '../../services/unitsService';


const ManageAnswerIndividual = () => {
  const [units, setUnits] = useState<any[]>([]);
  const [filteredUnits, setFilteredUnits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    fetchUnits();
  }, []);


  const fetchUnits = async () => {
    setIsLoading(true);
    try {
      // Check user role to determine what data to fetch
      if (user?.user?.user?.role === 'counselor') {
        // Counselor sees only their unit's DBVs
        const counselorId = user.user.user.id;
        const counselorUnitResponse = await unitsService.existCounselorUnit(counselorId);
        
        if (!counselorUnitResponse.success || !counselorUnitResponse.result?.existingInOtherUnit) {
          toast.error('Você não está associado a nenhuma unidade', {
            position: 'bottom-right',
            className: 'dark:bg-gray-800 dark:text-white',
            duration: 3000,
          });
          setUnits([]);
          setFilteredUnits([]);
          setIsLoading(false);
          return;
        }
        
        const unitId = counselorUnitResponse.result.existingInOtherUnit.unitId;
        const unitResponse = await unitsService.getUnitById(unitId);
        
        if (unitResponse.success && unitResponse.unit?.unit) {
          const unitData = [unitResponse.unit.unit];
          setUnits(unitData);
          setFilteredUnits(unitData);
          toast.success('Unidade carregada com sucesso', {
            position: 'bottom-right',
            className: 'dark:bg-gray-800 dark:text-white',
            duration: 3000,
          });
        }
      } else if (user?.user?.user?.role === 'admin' || user?.user?.user?.role === 'director') {
        // Admin and director see all units
        const response = await unitsService.ListAllUnits();
        if (response.success && response.units?.units) {
          setUnits(response.units.units);
          setFilteredUnits(response.units.units);
          toast.success(`${response.units.units.length} unidades carregadas com sucesso`, {
            position: 'bottom-right',
            className: 'dark:bg-gray-800 dark:text-white',
            duration: 3000,
          });
        }
      } else {
        toast.error('Você não tem permissão para visualizar avaliações de desbravadores', {
          position: 'bottom-right',
          className: 'dark:bg-gray-800 dark:text-white',
          duration: 3000,
        });
        setUnits([]);
        setFilteredUnits([]);
      }
    } catch (error) {
      console.error("Erro ao carregar unidades:", error);
      toast.error('Não foi possível carregar as unidades', {
        position: 'bottom-right',
        className: 'dark:bg-gray-800 dark:text-white',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUnits(units);
    } else {
      const filtered = units.filter((unit) =>
        unit.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        unit.dbvs.some((dbv: { dbv: { name: string } }) => dbv.dbv.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredUnits(filtered);
    }
  }, [searchTerm, units]);


  const handleDBVClick = (unitId: string, dbvId: string, dbvName: string): void => {
    navigate(`/individual-reports/${unitId}/${dbvId}`);
    toast.success(`Carregando avaliações de ${dbvName}`, {
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


  const dbvItemVariants = {
    hidden: { x: -10, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 120,
      },
    },
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
          <p className="text-lg font-medium">Carregando unidades e desbravadores...</p>
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
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
                Avaliações Individuais
              </h1>
              <p className="text-gray-400 mt-1">
                Gerencie as avaliações individuais dos desbravadores
              </p>
            </div>


            <div className="relative mt-4 md:mt-0 w-full md:w-64">
              <input
                type="text"
                placeholder="Buscar unidades ou desbravadores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>


          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-400">
              {filteredUnits.length}{' '}
              {filteredUnits.length === 1 ? 'unidade encontrada' : 'unidades encontradas'}
            </div>
            {/* <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                toast.dismiss();
                toast.loading('Recarregando dados...', {
                  position: 'bottom-right',
                  className: 'dark:bg-gray-800 dark:text-white',
                });
                fetchUnits();
              }}
              className="flex items-center text-sm px-3 py-1.5 bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700 transition-colors"
            >
              <Loader2 className="w-3.5 h-3.5 mr-1.5" /> Atualizar
            </motion.button> */}
          </div>
        </motion.div>


        {filteredUnits.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-8"
          >
            {filteredUnits.map((unit) => (
              <motion.div
                key={unit.id}
                variants={itemVariants}
                className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg"
              >
                <div className="flex items-center p-4 bg-gray-750 border-b border-gray-700">
                  <div className="flex items-center">
                    {unit.photo ? (
                      <img
                        src={unit.photo}
                        alt={unit.name}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                    ) : (
                      <Building2 className="w-10 h-10 p-2 bg-gray-700 rounded-full text-yellow-400 mr-3" />
                    )}
                    <div>
                      <h2 className="text-xl font-bold text-white">{unit.name}</h2>
                      <div className="flex items-center text-sm text-gray-400">
                        <Users className="w-4 h-4 mr-1" /> 
                        {unit.dbvs.length} {unit.dbvs.length === 1 ? 'desbravador' : 'desbravadores'}
                      </div>
                    </div>
                  </div>
                </div>


                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-300 mb-3">Desbravadores</h3>
                  
                  {unit.dbvs.length > 0 ? (
                    <motion.div 
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                      {unit.dbvs.map((dbvItem: { id: string; dbv: { id: string; name: string; photoUrl?: string } }) => (
                        <motion.div
                          key={dbvItem.id}
                          variants={dbvItemVariants}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleDBVClick(unit.id, dbvItem.dbv.id, dbvItem.dbv.name)}
                          className="bg-gray-750 rounded-lg p-4 flex items-center cursor-pointer transition-all border border-gray-700 hover:border-yellow-500/70"
                        >
                          {dbvItem.dbv.photoUrl ? (
                            <img
                              src={dbvItem.dbv.photoUrl}
                              alt={dbvItem.dbv.name}
                              className="w-12 h-12 rounded-full object-cover mr-3"
                            />
                          ) : (
                            <UserCircle className="w-12 h-12 text-gray-500 mr-3" />
                          )}
                          <div>
                            <h4 className="font-medium text-white">{dbvItem.dbv.name}</h4>
                            <p className="text-sm text-gray-400">Ver avaliações</p>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <p className="text-center text-gray-500 py-4">Nenhum desbravador encontrado nesta unidade.</p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center bg-gray-800 rounded-xl p-10 text-center">
            <Users className="w-16 h-16 text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-300">Nenhuma unidade encontrada</h3>
            <p className="text-gray-500 mt-2 max-w-md">
              Não foi possível encontrar unidades ou desbravadores correspondentes à sua pesquisa.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};


export default ManageAnswerIndividual;

























// import { useEffect, useState } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { Users, Loader2, Search, Filter, User, ChevronDown } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import toast from 'react-hot-toast';
// import { Unit } from '../../dtos/UnitDTO';


// // Components
// import { DesbravadorCard } from './components/DesbravadorCard';
// import { LoadingSpinner } from '../../components/ui/loading/loading';


// // Types
// type Desbravador = {
//   id: string;
//   name: string;
//   photoUrl: string | null;
//   unitId: string;
//   unitName: string;
// };


// type UnitWithDbvs = {
//   id: string;
//   name: string;
//   photo: string | null;
//   dbvs: {
//     id: string;
//     dbv: {
//       id: string;
//       name: string;
//       photoUrl: string | null;
//     };
//   }[];
// };


// const ManageAnswerIndividual = () => {
//   const [units, setUnits] = useState<UnitWithDbvs[]>([]);
//   const [allDesbravadores, setAllDesbravadores] = useState<Desbravador[]>([]);
//   const [filteredDesbravadores, setFilteredDesbravadores] = useState<Desbravador[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterByUnit, setFilterByUnit] = useState<string>('all');
//   const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
//   const { user, units: contextUnits } = useAuth();
//   const navigate = useNavigate();


//   useEffect(() => {
//     loadDesbravadores();
//   }, [contextUnits, user]);


//   const loadDesbravadores = async () => {
//     setIsLoading(true);
//     try {
//       const role = user?.user?.user?.role;
      
//       if (role === 'admin' || role === 'director') {
//         // Admin ou diretor vê todos os desbravadores de todas as unidades
//         const response = await fetch('/api/units/all'); // Substitua pelo endpoint real
//         const data = await response.json();
        
//         if (data.success && data.units && data.units.units) {
//           setUnits(data.units.units);
          
//           // Extrair todos os desbravadores de todas as unidades
//           const dbvList: Desbravador[] = [];
//           data.units.units.forEach((unit: UnitWithDbvs) => {
//             unit.dbvs.forEach(dbvItem => {
//               dbvList.push({
//                 id: dbvItem.dbv.id,
//                 name: dbvItem.dbv.name,
//                 photoUrl: dbvItem.dbv.photoUrl,
//                 unitId: unit.id,
//                 unitName: unit.name
//               });
//             });
//           });
          
//           setAllDesbravadores(dbvList);
//           setFilteredDesbravadores(dbvList);
          
//           toast.success(`${dbvList.length} desbravadores carregados com sucesso`, {
//             position: 'bottom-right',
//             className: 'dark:bg-gray-800 dark:text-white',
//             duration: 3000,
//           });
//         }
//       } else if (role === 'counselor') {
//         // Conselheiro vê apenas os desbravadores da sua unidade
//         const counselorId = user?.user?.user?.id;
        
//         // Encontrar a unidade do conselheiro
//         if (contextUnits && contextUnits.length > 0) {
//           const counselorUnit = contextUnits.find((unit: any) => 
//             unit.counselors && unit.counselors.some((c: any) => c.counselor?.id === counselorId)
//           );
          
//           if (counselorUnit) {
//             setUnits([{
//               ...counselorUnit,
//               photo: counselorUnit.photo ?? null, // Ensure photo is either string or null
//               dbvs: counselorUnit.dbvs?.map(dbvItem => ({
//                 id: dbvItem.id,
//                 dbv: {
//                   id: dbvItem.dbv.id,
//                   name: dbvItem.dbv.name,
//                   photoUrl: dbvItem.dbv.photoUrl ?? null,
//                 },
//               })) || [], // Provide a default empty array if undefined
//             }]);
            
//             // Extrair desbravadores da unidade do conselheiro
//             const dbvList: Desbravador[] = [];
//             counselorUnit.dbvs?.forEach((dbvItem: any) => {
//               dbvList.push({
//                 id: dbvItem.dbv.id,
//                 name: dbvItem.dbv.name,
//                 photoUrl: dbvItem.dbv.photoUrl,
//                 unitId: counselorUnit.id,
//                 unitName: counselorUnit.name
//               });
//             });
            
//             setAllDesbravadores(dbvList);
//             setFilteredDesbravadores(dbvList);
            
//             toast.success(`${dbvList.length} desbravadores carregados com sucesso`, {
//               position: 'bottom-right',
//               className: 'dark:bg-gray-800 dark:text-white',
//               duration: 3000,
//             });
//           } else {
//             toast.error('Você não está associado a nenhuma unidade', {
//               position: 'bottom-right',
//               className: 'dark:bg-gray-800 dark:text-white',
//               duration: 3000,
//             });
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Erro ao carregar desbravadores:', error);
//       toast.error('Erro ao carregar desbravadores', {
//         position: 'bottom-right',
//         className: 'dark:bg-gray-800 dark:text-white',
//         duration: 3000,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   useEffect(() => {
//     applyFilters();
//   }, [searchTerm, filterByUnit, allDesbravadores]);


//   const applyFilters = () => {
//     let filtered = [...allDesbravadores];
    
//     // Filtrar por termo de busca
//     if (searchTerm.trim() !== '') {
//       filtered = filtered.filter(dbv => 
//         dbv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         dbv.unitName.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }
    
//     // Filtrar por unidade
//     if (filterByUnit !== 'all') {
//       filtered = filtered.filter(dbv => dbv.unitId === filterByUnit);
//     }
    
//     setFilteredDesbravadores(filtered);
//   };


//   const handleReportClick = (desbravadorId: string) => {
//     navigate(`/dbv-reports/${desbravadorId}`);
//     toast.success('Carregando avaliações do desbravador', {
//       position: 'bottom-right',
//       className: 'dark:bg-gray-800 dark:text-white',
//     });
//   };


//   // Agrupar desbravadores por unidade para exibição
//   const groupedDesbravadores = filteredDesbravadores.reduce((acc: Record<string, Desbravador[]>, dbv) => {
//     if (!acc[dbv.unitId]) {
//       acc[dbv.unitId] = [];
//     }
//     acc[dbv.unitId].push(dbv);
//     return acc;
//   }, {});


//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   };


//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         type: 'spring',
//         stiffness: 100,
//       },
//     },
//   };


//   const unitVariants = {
//     hidden: { opacity: 0, y: -10 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.4,
//       },
//     },
//   };


//   if (isLoading) {
//     return <LoadingSpinner />;
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
//               <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
//                 Gerenciamento de Desbravadores
//               </h1>
//               <p className="text-gray-400 mt-1">
//                 Visualize e gerencie avaliações individuais de todos os desbravadores
//               </p>
//             </div>


//             <div className="mt-4 md:mt-0 w-full md:w-auto flex flex-col md:flex-row gap-3">
//               <div className="relative w-full md:w-64">
//                 <input
//                   type="text"
//                   placeholder="Buscar desbravadores..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//                 <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
//               </div>
              
//               <div className="relative">
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
//                   className="flex items-center justify-between w-full md:w-auto bg-gray-800 text-white border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <div className="flex items-center">
//                     <Filter className="h-4 w-4 text-gray-400 mr-2" />
//                     <span>{filterByUnit === 'all' ? 'Todas as unidades' : units.find(u => u.id === filterByUnit)?.name || 'Filtrar'}</span>
//                   </div>
//                   <ChevronDown className="h-4 w-4 text-gray-400 ml-2" />
//                 </motion.button>
                
//                 <AnimatePresence>
//                   {isFilterMenuOpen && (
//                     <motion.div
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: 10 }}
//                       className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden"
//                     >
//                       <div className="py-1">
//                         <button
//                           onClick={() => {
//                             setFilterByUnit('all');
//                             setIsFilterMenuOpen(false);
//                           }}
//                           className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors ${filterByUnit === 'all' ? 'bg-blue-600' : ''}`}
//                         >
//                           Todas as unidades
//                         </button>
//                         {units.map(unit => (
//                           <button
//                             key={unit.id}
//                             onClick={() => {
//                               setFilterByUnit(unit.id);
//                               setIsFilterMenuOpen(false);
//                             }}
//                             className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors ${filterByUnit === unit.id ? 'bg-blue-600' : ''}`}
//                           >
//                             {unit.name}
//                           </button>
//                         ))}
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             </div>
//           </div>


//           <div className="flex items-center justify-between mb-4">
//             <div className="text-sm text-gray-400">
//               {filteredDesbravadores.length}{' '}
//               {filteredDesbravadores.length === 1 ? 'desbravador encontrado' : 'desbravadores encontrados'}
//             </div>
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => {
//                 toast.dismiss();
//                 toast.loading('Recarregando desbravadores...', {
//                   position: 'bottom-right',
//                   className: 'dark:bg-gray-800 dark:text-white',
//                 });
//                 loadDesbravadores();
//               }}
//               className="flex items-center text-sm px-3 py-1.5 bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700 transition-colors"
//             >
//               <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Atualizar
//             </motion.button>
//           </div>
//         </motion.div>


//         {filteredDesbravadores.length > 0 ? (
//           <motion.div
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="space-y-8"
//           >
//             {Object.entries(groupedDesbravadores).map(([unitId, desbravadores]) => {
//               const unit = units.find(u => u.id === unitId);
//               return (
//                 <motion.div key={unitId} variants={unitVariants} className="mb-8">
//                   <div className="flex items-center mb-4 bg-gray-800 p-3 rounded-lg">
//                     {unit?.photo ? (
//                       <img 
//                         src={unit.photo} 
//                         alt={unit.name} 
//                         className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-indigo-500"
//                       />
//                     ) : (
//                       <div className="w-10 h-10 rounded-full bg-indigo-700 flex items-center justify-center mr-3">
//                         <Users className="w-5 h-5 text-white" />
//                       </div>
//                     )}
//                     <h2 className="text-xl font-semibold text-white">{unit?.name || 'Unidade'}</h2>
//                     <div className="ml-3 px-2 py-1 bg-indigo-800 rounded-full text-xs font-medium">
//                       {desbravadores.length} {desbravadores.length === 1 ? 'desbravador' : 'desbravadores'}
//                     </div>
//                   </div>
                  
//                   <motion.div
//                     variants={containerVariants}
//                     className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
//                   >
//                     {desbravadores.map((dbv) => (
//                       <DesbravadorCard 
//                         key={dbv.id}
//                         desbravador={dbv}
//                         onReportClick={() => handleReportClick(dbv.id)}
//                       />
//                     ))}
//                   </motion.div>
//                 </motion.div>
//               );
//             })}
//           </motion.div>
//         ) : (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="flex flex-col items-center justify-center p-12 bg-gray-800 rounded-xl text-center"
//           >
//             <User className="w-16 h-16 text-gray-600 mb-4" />
//             <h3 className="text-xl font-medium text-gray-300 mb-2">Nenhum desbravador encontrado</h3>
//             <p className="text-gray-500 max-w-md">
//               Não foram encontrados desbravadores com os filtros selecionados.
//               Tente ajustar os filtros ou verifique se há desbravadores cadastrados.
//             </p>
//           </motion.div>
//         )}
//       </div>
//     </div>
//   );
// };


// export default ManageAnswerIndividual;

























// import { useEffect, useState } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { User, Loader2, Search, Shield, UsersRound, ChevronRight } from 'lucide-react';
// import { motion } from 'framer-motion';
// import toast from 'react-hot-toast';
// import { unitsService } from '../../services/unitsService';
// import { userService } from '../../services/userService';

// interface Unit {
//   id: string;
//   name: string;
//   photo?: string;
//   dbvs: { id: string; dbv: { name: string; photoUrl?: string } }[];
// }

// const ManageAnswerIndividual = () => {
  
//   const [units, setUnits] = useState<Unit[]>([]);
//   const [filteredUnits, setFilteredUnits] = useState<Unit[]>([]);
//   const [dbvUsers, setDbvUsers] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const { user } = useAuth();
//   const navigate = useNavigate();


//   useEffect(() => {
//     fetchData();
//   }, []);


//   const fetchData = async () => {
//     setIsLoading(true);
//     try {
//       if (!user) {
//         toast.error('Usuário não autenticado', {
//           position: 'bottom-right',
//           className: 'dark:bg-gray-800 dark:text-white',
//         });
//         return;
//       }

//       const role = user.user.user.role;

//       if (role === 'admin' || role === 'director') {
//         // Admin or director sees all units with all DBVs
//         const response = await unitsService.ListAllUnits();
//         if (response.success && response.units && response.units.units) {
//           setUnits(response.units.units);
//           setFilteredUnits(response.units.units);
//           toast.success(`${response.units.units.length} unidades carregadas com sucesso`, {
//             position: 'bottom-right',
//             className: 'dark:bg-gray-800 dark:text-white',
//             duration: 3000,
//           });
//         }
//       } else if (role === 'counselor') {
//         // Counselor only sees their own unit
//         const counselorUnitResponse = await unitsService.existCounselorUnit(user.user.user.id);
        
//         if (!counselorUnitResponse.success || !counselorUnitResponse.result || !counselorUnitResponse.result.existingInOtherUnit) {
//           toast.error('Você não está associado a nenhuma unidade', {
//             position: 'bottom-right',
//             className: 'dark:bg-gray-800 dark:text-white',
//             duration: 3000,
//           });
//           return;
//         }
        
//         const unitId = counselorUnitResponse.result.existingInOtherUnit.unitId;
//         const unitResponse = await unitsService.getUnitById(unitId);
        
//         if (unitResponse.success && unitResponse.unit && unitResponse.unit.unit) {
//           const unitData = [unitResponse.unit.unit]; // Put in array to match format
//           setUnits(unitData);
//           setFilteredUnits(unitData);
//           toast.success(`Unidade ${unitResponse.unit.unit.name} carregada com sucesso`, {
//             position: 'bottom-right',
//             className: 'dark:bg-gray-800 dark:text-white',
//             duration: 3000,
//           });
//         }
//       }
//     } catch (error) {
//       console.error("Erro ao carregar dados:", error);
//       toast.error('Não foi possível carregar os dados', {
//         position: 'bottom-right',
//         className: 'dark:bg-gray-800 dark:text-white',
//         duration: 3000,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   useEffect(() => {
//     if (searchTerm.trim() === '') {
//       setFilteredUnits(units);
//     } else {
//       const filtered = units.filter((unit) =>
//         unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         unit.dbvs.some(dbv => dbv.dbv.name.toLowerCase().includes(searchTerm.toLowerCase()))
//       );
//       setFilteredUnits(filtered);
//     }
//   }, [searchTerm, units]);


//   const handleUnitClick = (unitId: string) => {
//     navigate(`/dbv-evaluations/${unitId}`);
//     toast.success('Carregando desbravadores da unidade', {
//       position: 'bottom-right',
//       className: 'dark:bg-gray-800 dark:text-white',
//     });
//   };

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.08,
//       },
//     },
//   };


//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         type: 'spring',
//         stiffness: 100,
//       },
//     },
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
//         <div className="flex flex-col items-center">
//           <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
//           <p className="text-lg font-medium">Carregando dados...</p>
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
//               <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
//                 Avaliações de Desbravadores
//               </h1>
//               <p className="text-gray-400 mt-1">
//                 Gerencie as avaliações individuais dos desbravadores
//               </p>
//             </div>


//             <div className="relative mt-4 md:mt-0 w-full md:w-64">
//               <input
//                 type="text"
//                 placeholder="Buscar unidades ou desbravadores..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//               />
//               <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
//             </div>
//           </div>


//           <div className="flex items-center justify-between mb-4">
//             <div className="text-sm text-gray-400">
//               {filteredUnits.length}{' '}
//               {filteredUnits.length === 1 ? 'unidade encontrada' : 'unidades encontradas'}
//             </div>
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => {
//                 toast.dismiss();
//                 toast.loading('Recarregando dados...', {
//                   position: 'bottom-right',
//                   className: 'dark:bg-gray-800 dark:text-white',
//                 });
//                 fetchData();
//               }}
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
//             className="space-y-6"
//           >
//             {filteredUnits.map((unit) => (
//               <motion.div
//                 key={unit.id}
//                 variants={itemVariants}
//                 className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 transition-all duration-300 hover:border-purple-500/50"
//               >
//                 <div className="flex items-center justify-between p-4 border-b border-gray-700">
//                   <div className="flex items-center space-x-4">
//                     <div className="h-12 w-12 rounded-full bg-purple-900 flex items-center justify-center">
//                       {unit.photo ? (
//                         <img
//                           src={unit.photo}
//                           alt={unit.name}
//                           className="h-12 w-12 rounded-full object-cover"
//                         />
//                       ) : (
//                         <Shield className="h-6 w-6 text-purple-300" />
//                       )}
//                     </div>
//                     <div>
//                       <h2 className="text-lg font-semibold">{unit.name}</h2>
//                       <div className="flex items-center text-gray-400 text-sm">
//                         <UsersRound className="w-4 h-4 mr-1" />
//                         {unit.dbvs.length} desbravadores
//                       </div>
//                     </div>
//                   </div>
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => handleUnitClick(unit.id)}
//                     className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
//                   >
//                     Ver Desbravadores <ChevronRight className="h-4 w-4 ml-1" />
//                   </motion.button>
//                 </div>
                
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
//                   {unit.dbvs.map((dbvItem) => (
//                     <motion.div
//                       key={dbvItem.id}
//                       whileHover={{ scale: 1.02 }}
//                       className="flex items-center space-x-3 bg-gray-700 p-3 rounded-lg"
//                     >
//                       <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
//                         {dbvItem.dbv.photoUrl ? (
//                           <img
//                             src={dbvItem.dbv.photoUrl}
//                             alt={dbvItem.dbv.name}
//                             className="h-10 w-10 rounded-full object-cover"
//                           />
//                         ) : (
//                           <User className="h-5 w-5 text-gray-400" />
//                         )}
//                       </div>
//                       <span className="text-sm font-medium text-gray-200">{dbvItem.dbv.name}</span>
//                     </motion.div>
//                   ))}
//                 </div>
//               </motion.div>
//             ))}
//           </motion.div>
//         ) : (
//           <div className="flex flex-col items-center justify-center h-64 bg-gray-800 rounded-xl border border-gray-700 p-6">
//             <UsersRound className="h-16 w-16 text-gray-600 mb-4" />
//             <p className="text-gray-400 text-lg">Nenhuma unidade encontrada</p>
//             <p className="text-gray-500 mt-2">Tente ajustar o termo de busca ou atualize a página</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };


// export default ManageAnswerIndividual;
