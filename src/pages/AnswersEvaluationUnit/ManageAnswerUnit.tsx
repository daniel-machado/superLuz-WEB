import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Loader2, 
  Search, 
  BarChart3, 
  Users, 
  RefreshCcw, 
  ChevronUp,
  Filter,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Unit } from '../../dtos/UnitDTO';
import PageMeta from '../../components/common/PageMeta';


const ManageAnswerUnit = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [filteredUnits, setFilteredUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [filterByMembers, setFilterByMembers] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const { units: contextUnits, userRole } = useAuth();
  const navigate = useNavigate();


  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  // Load units
  useEffect(() => {
    if (contextUnits && contextUnits.length > 0) {
      setUnits(contextUnits);
      setFilteredUnits(contextUnits);
    }
    setIsLoading(false);
  }, [contextUnits]);


  // Apply search and filters
  useEffect(() => {
    let filtered = [...units];
    
    // Apply search term
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter((unit) =>
        unit.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply member filter
    if (filterByMembers > 0) {
      filtered = filtered.filter((unit) => {
        const totalMembers = (unit.counselors?.length || 0) + (unit.dbvs?.length || 0);
        return totalMembers >= filterByMembers;
      });
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'counselors':
        filtered.sort((a, b) => (b.counselors?.length || 0) - (a.counselors?.length || 0));
        break;
      case 'dbvs':
        filtered.sort((a, b) => (b.dbvs?.length || 0) - (a.dbvs?.length || 0));
        break;
      case 'total':
        filtered.sort((a, b) => {
          const totalA = (a.counselors?.length || 0) + (a.dbvs?.length || 0);
          const totalB = (b.counselors?.length || 0) + (b.dbvs?.length || 0);
          return totalB - totalA;
        });
        break;
      default:
        break;
    }
    
    setFilteredUnits(filtered);
  }, [searchTerm, units, sortBy, filterByMembers]);


  const handleReportClick = (unitId: string) => {
    navigate(`/unit-reports/${unitId}`);
    toast.success('Carregando relatório da unidade', {
      position: 'bottom-right',
      className: 'dark:bg-gray-800 dark:text-white',
      icon: '📊',
    });
  };


  const refreshUnits = () => {
    toast.dismiss();
    toast.loading('Recarregando unidades...', {
      position: 'bottom-right',
      className: 'dark:bg-gray-800 dark:text-white',
    });
    
    // Simulating a refresh with animation
    setIsLoading(true);
    setTimeout(() => {
      setUnits(contextUnits || []);
      setFilteredUnits(contextUnits || []);
      setIsLoading(false);
      toast.dismiss();
      toast.success('Unidades atualizadas com sucesso!', {
        position: 'bottom-right',
        className: 'dark:bg-gray-800 dark:text-white',
        icon: '✅',
      });
    }, 800);
  };


  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };


  const openUnitDetails = (unit: Unit) => {
    setSelectedUnit(unit);
  };


  const closeUnitDetails = () => {
    setSelectedUnit(null);
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="flex flex-col items-center">
          <div className="relative">
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-xl font-medium mt-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Carregando unidades...
          </p>
          <div className="mt-3 h-1 w-48 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" style={{width: '75%'}}></div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <>
    <PageMeta
      title="Gerenciamento de respostas da avaliação de unidades | Luzeiros do Norte"
      description="Clube de Desbravadores - Gerenciamento de respostas da avaliação de unidades"
    />
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white">
      {/* Header - Fixed when scrolled */}
      <div className={`sticky top-0 z-10 backdrop-blur-lg transition-all duration-300 ${
        scrolled ? 'bg-gray-900/90 shadow-lg shadow-blue-500/10' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent pb-1">
                Gerenciamento de Unidades
              </h1>
              <p className="text-gray-400">
                Visualize e gerencie respostas de todas as unidades
              </p>
            </div>


            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <input
                  type="text"
                  placeholder="Buscar unidades..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-800/70 text-white border border-gray-700 rounded-xl py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-blue-400" />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-xl border ${
                  showFilters 
                    ? 'bg-blue-600 border-blue-500 text-white' 
                    : 'bg-gray-800/70 border-gray-700 text-gray-300 hover:bg-gray-700'
                } transition-all`}
                title="Filtros"
              >
                <Filter size={18} />
              </button>
              
              <button
                onClick={refreshUnits}
                className="p-2 rounded-xl bg-gray-800/70 border border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white transition-all"
                title="Atualizar unidades"
              >
                <RefreshCcw size={18} />
              </button>
            </div>
          </div>
          
          {/* Filters section */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-800/70 border border-gray-700 rounded-xl animate-fadeIn">
              <div className="flex flex-wrap gap-4 items-center">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Ordenar por:</label>
                  <div className="flex gap-2">
                    {[
                      { value: 'name', label: 'Nome' },
                      { value: 'counselors', label: 'Conselheiros' },
                      { value: 'dbvs', label: 'DBVs' },
                      { value: 'total', label: 'Total Membros' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                        className={`px-3 py-1 text-sm rounded-lg transition-all ${
                          sortBy === option.value
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Mínimo de membros:</label>
                  <select
                    value={filterByMembers}
                    onChange={(e) => setFilterByMembers(Number(e.target.value))}
                    className="bg-gray-700 border border-gray-600 text-white rounded-lg py-1 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="0">Todos</option>
                    <option value="1">Pelo menos 1</option>
                    <option value="2">Pelo menos 2</option>
                    <option value="3">Pelo menos 3</option>
                    <option value="4">Pelo menos 4</option>
                    <option value="5">Pelo menos 5</option>
                    <option value="6">Pelo menos 5</option>
                    <option value="7">Pelo menos 5</option>
                    <option value="8">Pelo menos 5</option>
                    <option value="9">Pelo menos 5</option>
                    <option value="10">Pelo menos 5</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          
          {/* Summary stats */}
          <div className="flex flex-wrap items-center justify-between mt-4">
            <div className="text-sm text-gray-400 flex items-center">
              <span className="text-lg mr-1 font-medium text-blue-400">{filteredUnits.length}</span>
              {filteredUnits.length === 1 ? 'unidade encontrada' : 'unidades encontradas'}
              {searchTerm && (
                <span className="ml-2">
                  para "<span className="text-white">{searchTerm}</span>"
                </span>
              )}
            </div>
          </div>
        </div>
      </div>


      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        {filteredUnits.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fadeIn">
            {filteredUnits.map((unit, index) => {
              const totalMembers = (unit.counselors?.length || 0) + (unit.dbvs?.length || 0);
              const hasManyMembers = totalMembers >= 9;
              
              return (
                <div
                  key={unit.id}
                  className="group bg-gray-800/60 rounded-xl overflow-hidden border border-gray-700 transition-all duration-300 hover:border-blue-500/70 hover:shadow-lg hover:shadow-blue-500/10 relative"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: 'fadeIn 0.5s ease-out forwards',
                    opacity: 0,
                  }}
                >
                  <div className="h-48 overflow-hidden bg-gray-700 relative">
                    {unit.photo ? (
                      <img
                        src={unit.photo}
                        alt={unit.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                        <Building2 className="w-12 h-12 text-gray-500" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 pt-8">
                      <h2 className="text-xl font-bold text-white truncate">{unit.name}</h2>
                    </div>
                    
                    {/* Badge for units with many members */}
                    {hasManyMembers && (
                      <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                        Equipe Completa
                      </div>
                    )}
                  </div>


                  <div className="p-5">
                    {/* Members count */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-3">
                        {unit.counselors && unit.counselors.length > 0 && (
                          <div className="flex items-center text-sm text-gray-300">
                            <div className="bg-indigo-600/20 p-1.5 rounded-lg mr-2">
                              <Users size={14} className="text-indigo-400" />
                            </div>
                            <span className="bg-indigo-600/20 text-indigo-300 px-2 py-0.5 rounded-md">
                              {unit.counselors.length} {unit.counselors.length === 1 ? 'Conselheiro' : 'Conselheiros'}
                            </span>
                          </div>
                        )}
                        
                        {!unit.counselors?.length && (
                          <div className="flex items-center text-sm text-gray-500">
                            <div className="bg-gray-700/50 p-1.5 rounded-lg mr-2">
                              <Users size={14} className="text-gray-500" />
                            </div>
                            <span className="bg-gray-700/50 text-gray-500 px-2 py-0.5 rounded-md">
                              Sem Conselheiros
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      {unit.dbvs && unit.dbvs.length > 0 && (
                        <div className="flex items-center text-sm text-gray-300">
                          <div className="bg-purple-600/20 p-1.5 rounded-lg mr-2">
                            <Users size={14} className="text-purple-400" />
                          </div>
                          <span className="bg-purple-600/20 text-purple-300 px-2 py-0.5 rounded-md">
                            {unit.dbvs.length} {unit.dbvs.length === 1 ? 'DBV' : 'DBVs'}
                          </span>
                        </div>
                      )}
                      
                      {!unit.dbvs?.length && (
                        <div className="flex items-center text-sm text-gray-500">
                          <div className="bg-gray-700/50 p-1.5 rounded-lg mr-2">
                            <Users size={14} className="text-gray-500" />
                          </div>
                          <span className="bg-gray-700/50 text-gray-500 px-2 py-0.5 rounded-md">
                            Sem DBVs
                          </span>
                        </div>
                      )}
                    </div>


                    {/* Action buttons */}
                    <div className="flex gap-2 mt-4">
                      { userRole === 'admin' || userRole === 'director' ? (
                          <button
                            onClick={() => handleReportClick(unit.id)}
                            className="flex-1 flex items-center justify-center text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition-all"
                          >
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Relatório
                        </button>
                      ) : (
                        <div>
                          <p className="text-sm text-gray-400">
                            Você não tem permissão para avaliar unidade
                          </p>
                        </div>
                      )
                    
                    }
                      
                      
                      <button
                        onClick={() => openUnitDetails(unit)}
                        className="flex items-center justify-center text-sm bg-gray-700 hover:bg-gray-600 text-white px-4 py-2.5 rounded-lg transition-all"
                      >
                        Detalhes
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 animate-fadeIn">
            <div className="bg-gray-800/50 p-6 rounded-full mb-4">
              <Building2 className="w-16 h-16 text-gray-600" />
            </div>
            <p className="text-xl font-medium text-gray-400 mb-2">Nenhuma unidade encontrada.</p>
            <p className="text-gray-500 mb-6 text-center max-w-md">
              Tente ajustar seus filtros de busca ou recarregue a página.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterByMembers(0);
                setSortBy('name');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>


      {/* Unit details modal */}
      {selectedUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-fadeIn">
          <div className="bg-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-auto border border-gray-700 shadow-2xl">
            <div className="relative h-40">
              {selectedUnit.photo ? (
                <img
                  src={selectedUnit.photo}
                  alt={selectedUnit.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                  <Building2 className="w-16 h-16 text-gray-600" />
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 pt-16">
                <h2 className="text-2xl font-bold text-white">{selectedUnit.name}</h2>
              </div>
              <button
                onClick={closeUnitDetails}
                className="absolute top-4 right-4 bg-black/40 text-white p-1.5 rounded-full hover:bg-black/60 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium text-blue-400 mb-3 flex items-center">
                    <Users className="mr-2 h-5 w-5" /> Conselheiros
                  </h3>
                  {selectedUnit.counselors && selectedUnit.counselors.length > 0 ? (
                    <ul className="space-y-2">
                      {selectedUnit.counselors.map(counselor => (
                        <li key={counselor.id} className="flex items-center bg-gray-700/50 p-2 rounded-lg">
                          <div className="h-8 w-8 rounded-full bg-indigo-600/20 flex items-center justify-center mr-3">
                            {counselor.counselor.photoUrl ? (
                              <img
                                src={counselor.counselor.photoUrl}
                                alt={counselor.counselor.name}
                                className="h-8 w-8 rounded-full object-cover"
                              />
                            ) : (
                              <Users size={16} className="text-indigo-400" />
                            )}
                          </div>
                          <span>{counselor.counselor.name}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">Nenhum conselheiro registrado</p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-purple-400 mb-3 flex items-center">
                    <Users className="mr-2 h-5 w-5" /> DBVs
                  </h3>
                  {selectedUnit.dbvs && selectedUnit.dbvs.length > 0 ? (
                    <ul className="space-y-2">
                      {selectedUnit.dbvs.map(dbv => (
                        <li key={dbv.id} className="flex items-center bg-gray-700/50 p-2 rounded-lg">
                          <div className="h-8 w-8 rounded-full bg-purple-600/20 flex items-center justify-center mr-3">
                            {dbv.dbv.photoUrl ? (
                              <img
                                src={dbv.dbv.photoUrl}
                                alt={dbv.dbv.name}
                                className="h-8 w-8 rounded-full object-cover"
                              />
                            ) : (
                              <Users size={16} className="text-purple-400" />
                            )}
                          </div>
                          <span>{dbv.dbv.name}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">Nenhum DBV registrado</p>
                  )}
                </div>
              </div>
              
              {/* <div className="pt-4 border-t border-gray-700">
                <div className="text-sm text-gray-400 mb-2">
                  Unidade criada em: {new Date(selectedUnit.createdAt ?? '').toLocaleDateString('pt-BR')}
                </div>
                <div className="text-sm text-gray-400">
                  Última atualização: {selectedUnit.updatedAt ? new Date(selectedUnit.updatedAt).toLocaleDateString('pt-BR') : 'Data não disponível'}
                </div>
              </div> */}
              
              <div className="flex gap-3 mt-6 justify-center">
                { userRole === 'admin' || userRole === 'director' ? (
                    <button
                    onClick={() => {
                      closeUnitDetails();
                      handleReportClick(selectedUnit.id);
                    }}
                    className="flex-1 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition-colors"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" /> Ver Relatório
                  </button>
                ) : (
                  <div className="text-sm text-gray-400">
                    <p>Você não tem permissão para avaliar unidade</p>  
                  </div>
                )
              
              }
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Scroll to top button */}
      {scrolled && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all animate-bounce"
        >
          <ChevronUp size={20} />
        </button>
      )}


      {/* Add global styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-bounce {
          animation: bounce 2s infinite;
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
    </>
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
