import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SearchIcon,
  PlusIcon,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Users,
  UserCheck,
  Award,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Layers,
  User,
  AlertTriangle
} from 'lucide-react';
import Input from '../../components/form/input/InputField';
import Button from '../../components/ui/button/Button';
import Badge from '../../components/ui/badge/Badge';
import { useAuth, UserResponseDTO } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { specialtyUserService } from '../../services/specialtyUserService';
import { unitsService } from '../../services/unitsService';
import { userService } from '../../services/userService';
import { specialtyService } from '../../services/specialtyService';
import { Unit } from '../../dtos/UnitDTO';
import { Tabs, TabsList, TabsTrigger } from './ComponentsUser/TabsContexts';

enum StatusSpecialty {
  PENDING = 'pending',
  WAITING_BY_COUNSELOR = 'waiting_by_counselor',
  WAITING_BY_LEAD = 'waiting_by_lead',
  WAITING_BY_DIRECTOR = 'waiting_by_director',
  REJECTED_BY_COUNSELOR = 'rejected_by_counselor',
  REJECTED_BY_LEAD = 'rejected_by_lead',
  REJECTED_BY_DIRECTOR = 'rejected_by_director',
  APRROVED_BY_COUNSELOR = 'aprroved_by_counselor',
  APRROVED_BY_LEAD = 'aprroved_by_lead',
  APRROVED_BY_DIRECTOR = 'aprroved_by_director',
  APPROVED = 'approved',
}


type SpecialtyInfo = {
  id: string;
  name: string;
  description?: string;
  category?: string;
  imageUrl?: string;
};


type UserInfo = {
  id: string;
  name: string;
  role: string;
};

interface SpecialtyUser {
  id: string;
  userId: string;
  specialtyId: string;
  approvalStatus: StatusSpecialty;
  report: string[];
  rejectionComments: string[];
  approvalComments: string[];
  isQuizApproved: boolean;
  counselorApproval: boolean;
  counselorApprovalAt: string | null;
  leadApproval: boolean;
  leadApprovalAt: string | null;
  directorApproval: boolean;
  directorApprovalAt: string | null;
  createdAt: string;
  updatedAt: string;
  specialtyUser: {
    name: string;
    photoUrl?: string;
  };
  specialtyInfo?: {
    name: string;
    category: string;
    emblem: string;
  };
}

interface CounselorUnit {
  id: string;
  unitId: string;
  userId: string;
}

export type SpecialtyAssociation = {
  userId: string;
  specialtyId: string;
};

const SpecialtyManager = () => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [specialtyToRemove, setSpecialtyToRemove] = useState<SpecialtyUser | null>(null);
  const [currentSpecialty, setCurrentSpecialty] = useState<SpecialtyUser | null>(null);
  //const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [activeView, setActiveView] = useState('personal');
  const [selectedUnit, setSelectedUnit] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [data, setData] = useState<SpecialtyUser[]>([]);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [specialties, setSpecialties] = useState<SpecialtyInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get all units data from the API (mock for now)
  const [units, setUnits] = useState<Unit[]>([]);
  const [counselorUnit, setCounselorUnit] = useState<CounselorUnit | null>(null);


    // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };


  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } }
  };

  const { user, userRole } = useAuth();


  useEffect(() => {
    fetchInitialData();
  }, []);


  const fetchInitialData = async () => {
    setIsLoading(true);
    const loadingToast = toast.loading("Carregando dados...", { position: 'bottom-center' });
  
    try {
      await Promise.all([fetchSpecialtyUsers(), fetchUsers(), fetchSpecialties()]);
      toast.dismiss(loadingToast);
      toast.success("Dados carregados com sucesso", {
        position: 'bottom-center',
        duration: 2000,
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
        iconTheme: {
          primary: '#10B981',
          secondary: '#FFFFFF',
        }
      });
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Erro ao carregar alguns dados", { position: 'bottom-center' });
    } finally {
      setIsLoading(false);
    }
  };


  const fetchSpecialtyUsers = async () => {
    try {
      const response = await specialtyUserService.getAllSpecialtyAssociation();
      setData(response || []);
      return response;
    } catch (error) {
      toast.error("Erro ao carregar associações de especialidades", {
        position: 'bottom-right',
        icon: '🚫',
      });
      return [];
    }
  };


  const fetchUsers = async () => {
    try {
      const response = await userService.getAllUsers();
      setUsers(response);
      return response;
    } catch (error) {
      toast.error("Erro ao carregar os usuários", {
        position: 'bottom-right',
        icon: '🚫',
      });
      return [];
    }
  };


  const fetchSpecialties = async () => {
    try {
      const response = await specialtyService.ListAllSpecialty();
      setSpecialties(response.result.specialty);
      return response.result.specialty;
    } catch (error) {
      toast.error("Erro ao carregar as especialidades", {
        position: 'bottom-right',
        icon: '🚫',
      });
      return [];
    }
  };


  const confirmRemove = async () => {
    if (!specialtyToRemove) return;
  
    const loadingToast = toast.loading("Removendo associação...", { position: 'bottom-center' });
  
    try {
      await specialtyUserService.deleteSpecialtyAssociation(specialtyToRemove.id);
      toast.dismiss(loadingToast);
      toast.success(`Associação removida com sucesso`, {
        position: 'bottom-right',
        duration: 3000,
        icon: '✅',
      });
      await fetchSpecialtyUsers();
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Erro ao remover associação", {
        position: 'bottom-right',
        icon: '❌',
      });
    } finally {
      setSpecialtyToRemove(null);
    }
  };


  const handleSaveAssociation = async (assoc: SpecialtyAssociation) => {
    const loadingToast = toast.loading("Criando associação...", { position: 'bottom-center' });
  
    try {
      await specialtyUserService.createAssociation(assoc);
      toast.dismiss(loadingToast);
      toast.success("Associação criada com sucesso", {
        position: 'bottom-right',
        icon: '🎉',
        duration: 3000,
      });
      await fetchSpecialtyUsers();
      setIsModalOpen(false);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Erro ao criar associação", {
        position: 'bottom-right',
        icon: '❌',
      });
    }
  };


  const handleSubmitReport = async (reportText: string) => {
    if (!currentSpecialty || !reportText.trim()) return;
    
    const loadingToast = toast.loading("Enviando relatório...", { position: 'bottom-center' });
    const dateNow = new Date()
    try {
      specialtyUserService
      .sendReport(
        currentSpecialty.id,
        currentSpecialty?.userId ?? '',
        currentSpecialty?.specialtyId ?? '',
        [reportText, dateNow.toISOString()]
      )
      toast.dismiss(loadingToast);
      toast.success("Relatório enviado com sucesso", {
        position: 'bottom-right',
        icon: '📝',
        duration: 3000,
      });
      fetchSpecialtyUsers();
      fetchInitialData();
      setIsReportModalOpen(false);
      
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Erro ao enviar relatório", {
        position: 'bottom-right',
        icon: '❌',
      });
    }
  };

  const handleApprove = async (specialty: SpecialtyUser, approvalComment: string) => {
      if (!specialty || !user?.user.user.id) return;
    
    const loadingToast = toast.loading("Processando aprovação...", { position: 'bottom-center' });
    const dateNow = new Date()
    try {
      await specialtyUserService.approve(
        currentSpecialty?.userId ?? '',
        currentSpecialty?.specialtyId ?? '',
        user?.user.user.id,
        [approvalComment, dateNow.toISOString(), user.user.user.name]
      );
      toast.dismiss(loadingToast);
      toast.success("Aprovação realizada com sucesso", {
        position: 'bottom-right',
        icon: '✅',
        duration: 3000,
      });
      //await fetchSpecialtyUsers();
      fetchInitialData()
      setIsApprovalModalOpen(false);

    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Erro ao processar aprovação", {
        position: 'bottom-right',
        icon: '❌',
      });
    }
  };


  const handleReject = async (specialty: SpecialtyUser, approvalComment: string) => {
    console.log("ESPECIALTY", specialty)
    if (!currentSpecialty || !user?.user.user.id) return;
    
    const loadingToast = toast.loading("Processando rejeição...", { position: 'bottom-center' });
    const dateNow = new Date()
    try {
      await specialtyUserService.reject(
        currentSpecialty.userId,
        currentSpecialty.specialtyId,
        user?.user.user.id,
        [approvalComment, dateNow.toISOString(), user.user.user.name]
      );

      toast.dismiss(loadingToast);
      toast.success("Rejeição processada com sucesso", {
        position: 'bottom-right',
        icon: '✅',
        duration: 3000,
      });
      fetchInitialData()
      setIsApprovalModalOpen(false);

    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Erro ao processar rejeição", {
        position: 'bottom-right',
        icon: '❌',
      });
    }
  };

  // const handleRemoveClick = (specialty: SpecialtyUser) => {
  //   setSpecialtyToRemove(specialty);
  // };

  // const sendReport = (specialty: SpecialtyUser) => {
  //   setCurrentSpecialty(specialty);
  //   setIsReportModalOpen(true);
  // };

  // const evaluateBySpecialty = (specialty: SpecialtyUser) => {
  //   setCurrentSpecialty(specialty);
  //   setIsApprovalModalOpen(true);
  // };

  
  // Fetch units data on component mount
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        // This would be your actual API call
        const response = await unitsService.ListAllUnits();
        if (response.success) {
          setUnits(response.units.units);
        }
      } catch (error) {
        console.error("Failed to fetch units:", error);
      }
    };
    
    const fetchCounselorUnit = async () => {
      // Only fetch if user is counselor
      if (user?.user?.user?.role === 'counselor') {
        try {
          const response = await unitsService.existCounselorUnit(user.user.user.id);
          if (response.success) {
            setCounselorUnit(response.result.existingInOtherUnit);
          }
        } catch (error) {
          console.error("Failed to fetch counselor unit:", error);
        }
      }
    };
    
    fetchUnits();
    fetchCounselorUnit();
  }, [user]);


  // Derived categories from specialties
  const categories: string[] = useMemo(() => {
        if (!data) return [];
        const categorySet = new Set<string>();
        data.forEach(item => {
          if (item.specialtyInfo?.category) {
            categorySet.add(item.specialtyInfo.category);
          }
        });
        return Array.from(categorySet);
      }, [data]);


  // // Toggle expanded item
  // const handleToggleExpand = (id: any) => {
  //   setExpandedItems((prev) => 
  //         prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
  //       );
  // };


  // // Format date helper
  // const formatDate = (dateString: string) => {
  //   if (!dateString) return 'Data não disponível';
  //   const date = new Date(dateString);
  //   return new Intl.DateTimeFormat('pt-BR', {
  //     day: '2-digit',
  //     month: '2-digit',
  //     year: 'numeric',
  //     hour: '2-digit',
  //     minute: '2-digit'
  //   }).format(date);
  // };


  // Get approval progress percentage
  // const getApprovalProgress = (item: SpecialtyUser) => {
  //   let progress = 0;
  //   if (item.isQuizApproved) progress += 20;
  //   if (item.report.length > 0) progress += 20;
  //   if (item.counselorApproval) progress += 20;
  //   if (item.leadApproval) progress += 20;
  //   if (item.directorApproval) progress += 20;
  //   return progress;
  // };


  // // Get status badge component
  // const getStatusBadge = (status: string) => {
  //   switch (status) {
  //     case 'approved':
  //       return <Badge color="success" startIcon={<CheckCircle size={14} />}>Aprovado</Badge>;
  //     case 'rejected':
  //       return <Badge color="error" startIcon={<XCircle size={14} />}>Rejeitado</Badge>;
  //     default:
  //       return <Badge color="warning" startIcon={<Clock size={14} />}>Pendente</Badge>;
  //   }
  // };


  // // Check if user can submit report
  // const canSubmitReport = (item: SpecialtyUser) => {
  //   // Only the dbv user can submit their own report
  //   return user?.user?.user?.id === item.userId && item.report.length === 0;
  // };


  // Check if user can approve
  // const canApprove = (item: SpecialtyUser) => {
  //   const userRole = user?.user?.user?.role;
    
  //   // Admin can approve anything
  //   if (userRole === 'admin') return true;
    
  //   // Director can approve if lead has approved
  //   if (userRole === 'director' && item.leadApproval) return true;
    
  //   // Lead can approve if counselor has approved
  //   if (userRole === 'lead' && item.counselorApproval) return true;
    
  //   // Counselor can approve if the dbv is in their unit and items are ready
  //   if (userRole === 'counselor') {
  //     const isDbvInCounselorUnit = counselorUnit && 
  //       units?.find((unit) => unit.id === counselorUnit?.unitId)?.dbvs || []
  //         .some((dbv: { dbvs: { id: string } }) => dbv.dbvs.id === item.userId);      
  //     return isDbvInCounselorUnit && item.isQuizApproved && item.report.length > 0;
  //   }
    
  //   return false;
  // };


  // Filter data based on search, tabs, units, and categories
  const filteredData = useMemo(() => {
    if (!data) return [];
    
    return data.filter(item => {
      // Filter by search term
      const searchMatch = 
        search === '' || 
        item.specialtyUser?.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.specialtyInfo?.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.specialtyInfo?.category?.toLowerCase().includes(search.toLowerCase());
      
      // Filter by tab status
      let statusMatch = true;
      if (activeTab === 'pending') {
        statusMatch = item.approvalStatus === 'pending';
      } else if (activeTab === 'approved') {
        statusMatch = item.approvalStatus === 'approved';
      } else if (activeTab === 'waiting_by_counselor') {
        statusMatch = item.approvalStatus === 'waiting_by_counselor';
      } else if (activeTab === 'waiting_by_lead') {
        statusMatch = item.approvalStatus === 'waiting_by_lead';
      } else if (activeTab === 'waiting_by_director') {
        statusMatch = item.approvalStatus === 'waiting_by_director';
      } else if (activeTab === 'rejected_by_counselor') {
        statusMatch = item.approvalStatus === 'rejected_by_counselor';
      } else if (activeTab === 'rejected_by_lead') {
        statusMatch = item.approvalStatus === 'rejected_by_lead';
      } else if (activeTab === 'rejected_by_director') {
        statusMatch = item.approvalStatus === 'rejected_by_director';
      } else if (activeTab === 'aprroved_by_counselor') {
        statusMatch = item.approvalStatus === 'aprroved_by_counselor';
      } else if (activeTab === 'aprroved_by_lead') {
        statusMatch = item.approvalStatus === 'aprroved_by_lead';
      } else if (activeTab === 'aprroved_by_director') {
        statusMatch = item.approvalStatus === 'aprroved_by_director';
      }
      
      // Filter by user role specific views
      let roleMatch = true;
      const userRole = user?.user?.user?.role;
      
      if (userRole === 'dbv') {
        // DBV only sees their own specialties
        roleMatch = !!(user?.user?.user?.id && item.userId === user.user.user.id);
      } else if (activeView === 'personal') {
        // Personal tab shows user's own specialties
        roleMatch = !!(user?.user?.user?.id && item.userId === user.user.user.id);
      } else if (userRole === 'counselor' && activeView === 'unit') {
        // Counselor in unit view sees only DBVs from their unit
        if (!counselorUnit) return false;
        
        const counselorUnitData = units.find(unit => unit.id === counselorUnit.unitId);
        const unitDbvIds = (counselorUnitData?.dbvs ?? []).map(dbv => dbv.dbv.id);
        roleMatch = unitDbvIds.includes(item.userId);
      }
      
      // Filter by selected unit (for admin, director, lead in group view)
      let unitMatch = true;
      if (activeView === 'group' && selectedUnit !== 'all') {
        const unitData = units.find(unit => unit.id === selectedUnit);
        const unitDbvIds = (unitData?.dbvs ?? []).map(dbv => dbv.dbv.id);
        unitMatch = unitDbvIds.includes(item.userId);
      }
      
      // Filter by category
      let categoryMatch = true;
      if (selectedCategory !== 'all') {
        categoryMatch = item.specialtyInfo?.category === selectedCategory;
      }
      
      return searchMatch && statusMatch && roleMatch && unitMatch && categoryMatch;
    });
  }, [data, search, activeTab, activeView, selectedUnit, selectedCategory, user, units, counselorUnit]);


  // Group data by unit for the group view
  const groupedByUnit = useMemo(() => {
    if (!units || !data) return [];
    
    return units.map(unit => {
      const unitDbvIds = (unit.dbvs ?? []).map(dbv => dbv.dbv.id);
      const unitSpecialties = data.filter(item => 
        unitDbvIds.includes(item.userId) &&
        (selectedCategory === 'all' || item.specialtyInfo?.category === selectedCategory) &&
        (activeTab === 'all' || item.approvalStatus === activeTab) &&
        (search === '' || 
          item.specialtyUser?.name?.toLowerCase().includes(search.toLowerCase()) ||
          item.specialtyInfo?.name?.toLowerCase().includes(search.toLowerCase()))
      );
      
      return {
        unit,
        specialties: unitSpecialties
      };
    }).filter(group => group.specialties.length > 0);
  }, [units, data, selectedCategory, activeTab, search]);


  // Determine which view tabs to show based on user role
  const getViewTabs = () => {
    const userRole = user?.user?.user?.role;
    
    if (userRole === 'dbv') {
      return null; // DBVs only see their own specialties
    }
    
    const tabs = [
      { id: 'personal', label: 'Minhas Especialidades', icon: <User size={16} /> }
    ];
    
    if (userRole === 'counselor') {
      tabs.push({ id: 'unit', label: 'Minha Unidade', icon: <Users size={16} /> });
    }
    
    if (userRole && ['admin', 'director', 'lead'].includes(userRole)) {
      tabs.push({ id: 'group', label: 'Todas Unidades', icon: <Layers size={16} /> });
    }
    
    return tabs;
  };


  // // Handler for status tab click
  // const handleStatusTabChange = (value: string) => {
  //   setActiveTab(value);
  // };


  // Handler for view tab click
  const handleViewTabChange = (value: string) => {
    setActiveView(value);
    // Reset unit and category filters when changing views
    setSelectedUnit('all');
    setSelectedCategory('all');
  };


  const viewTabs = getViewTabs();


  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="min-h-screen"
    >
      <div className="space-y-6 pb-10">
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
          <div className="p-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-xl font-semibold text-white">Especialidades dos Desbravadores</h2>
              
              {(userRole === 'admin' || userRole === 'director' || userRole === 'lead') && (
                  <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    size="sm"
                    variant="primary"
                    startIcon={<PlusIcon />}
                    onClick={() => {
                      setSpecialtyToRemove(null);
                      setIsModalOpen(true);
                    }}
                    className="rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-purple-500 to-indigo-600"
                  >
                    Associar Especialidade
                  </Button>
                </motion.div>
              )}
              
            </div>
                        
                        {/* View Tabs - Only shown if user is not a 'dbv' */}
            {viewTabs && (
              <Tabs value={activeView} onValueChange={handleViewTabChange} className="mb-4 md:mb-6 overflow-x-auto">
                <TabsList className="bg-gray-700 p-1 rounded-lg min-w-max">
                  {viewTabs.map(tab => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-gray-300 rounded-md px-3 py-1.5 text-sm whitespace-nowrap"
                    >
                      {tab.icon && <span className="mr-1.5">{tab.icon}</span>}
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            )}


            {/* Search and Filters Row - Stacked on small screens, side by side on larger screens */}
            <div className="flex flex-col gap-3 mb-4 md:mb-6">
              {/* Search Bar - Full width on all screens */}
              <div className="relative w-full">
                <Input
                  placeholder="Buscar por nome do desbravador ou especialidade"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 rounded-xl focus:ring-2 focus:ring-blue-500 w-full"
                />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              
              {/* Filters - Responsive container that allows horizontal scrolling on small screens */}
              <div className="w-full overflow-x-auto pb-2">
                <div className="flex gap-2 min-w-max">
                  {/* Status filter - Made more compact for small screens */}
                  <div className="flex items-center bg-gray-700 rounded-lg overflow-hidden">
                    <Button
                      onClick={() => setActiveTab('all')}
                      className={`px-2 sm:px-3 py-1.5 text-xs sm:text-sm transition-all duration-300 rounded-none ${activeTab === 'all' ? 'bg-indigo-600 text-white' : 'bg-transparent text-gray-300 hover:bg-gray-600'}`}
                    >
                      Todos
                    </Button>
                    <Button
                      onClick={() => setActiveTab('pending')}
                      className={`px-2 sm:px-3 py-1.5 text-xs sm:text-sm transition-all duration-300 rounded-none flex items-center ${activeTab === 'pending' ? 'bg-yellow-600 text-white' : 'bg-transparent text-gray-300 hover:bg-gray-600'}`}
                    >
                      <Clock size={12} className="mr-1 sm:mr-2" />
                      <span className="whitespace-nowrap">Pendentes</span>
                    </Button>
                    <Button
                      onClick={() => setActiveTab('approved')}
                      className={`px-2 sm:px-3 py-1.5 text-xs sm:text-sm transition-all duration-300 rounded-none flex items-center ${activeTab === 'approved' ? 'bg-green-600 text-white' : 'bg-transparent text-gray-300 hover:bg-gray-600'}`}
                    >
                      <CheckCircle size={12} className="mr-1 sm:mr-2" />
                      <span className="whitespace-nowrap">Aprovados</span>
                    </Button>
                    <Button
                      onClick={() => setActiveTab('rejected')}
                      className={`px-2 sm:px-3 py-1.5 text-xs sm:text-sm transition-all duration-300 rounded-none flex items-center ${activeTab === 'rejected' ? 'bg-red-600 text-white' : 'bg-transparent text-gray-300 hover:bg-gray-600'}`}
                    >
                      <XCircle size={12} className="mr-1 sm:mr-2" />
                      <span className="whitespace-nowrap">Rejeitados</span>
                    </Button>
                  </div>
                  
                  {/* Show Unit filter for group view */}
                  {activeView === 'group' && (
                    <select
                      value={selectedUnit}
                      onChange={(e) => setSelectedUnit(e.target.value)}
                      className="bg-gray-700 border border-gray-600 text-white rounded-lg px-2 py-1.5 text-xs sm:text-sm whitespace-nowrap"
                    >
                      <option value="all">Todas Unidades</option>
                      {units.map(unit => (
                        <option key={unit.id} value={unit.id}>{unit.name}</option>
                      ))}
                    </select>
                  )}
                  
                  {/* Categories filter */}
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-gray-700 border border-gray-600 text-white rounded-lg px-2 py-1.5 text-xs sm:text-sm whitespace-nowrap"
                  >
                    <option value="all">Todas Categorias</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>



            {/* Main Content Area */}
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center items-center py-16"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-6 text-gray-400 text-lg">Carregando especialidades...</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="content"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Group View - For admin, director, lead */}
                  {activeView === 'group' && (
                    <>
                      {groupedByUnit.length === 0 ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex justify-center items-center py-16 bg-gray-800 rounded-xl shadow-md"
                        >
                          <div className="flex flex-col items-center text-center px-4">
                            <Layers className="w-20 h-20 text-gray-500 mb-6" />
                            <h3 className="text-2xl font-semibold text-gray-300 mb-3">
                              Nenhuma unidade com especialidades encontrada
                            </h3>
                            <p className="text-gray-400 max-w-md">
                              {search ? 
                                "Nenhum resultado para sua busca. Tente outro termo ou filtro." : 
                                "Não há especialidades associadas a nenhuma unidade com os filtros selecionados."}
                            </p>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="space-y-8">
                          {groupedByUnit.map((groupData) => (
                            <div key={groupData.unit.id} className="bg-gray-750 rounded-xl p-4 shadow-md border border-gray-700">
                              <div className="flex items-center mb-4 gap-3">
                                {groupData.unit.photo ? (
                                  <img 
                                    src={groupData.unit.photo} 
                                    alt={groupData.unit.name}
                                    className="w-10 h-10 rounded-full object-cover border border-indigo-500"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-indigo-800 flex items-center justify-center">
                                    <Users size={16} className="text-white" />
                                  </div>
                                )}
                                <h3 className="text-lg font-semibold text-white">{groupData.unit.name}</h3>
                                <Badge 
                                  color="primary" 
                                  //className="ml-auto"
                                >
                                  {groupData.specialties.length} especialidade{groupData.specialties.length !== 1 ? 's' : ''}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {groupData.specialties.map((item, index) => (
                                  <SpecialtyCard 
                                  key={item.id}
                                  item={item}
                                  userLogged={user}
                                  isLoading={isLoading}
                                  reportSend={() => {}}
                                  approve={() => {}}
                                  onRemoveClick={() => {}}
                                  index={index}
  
                                />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                  
                  {/* Unit View - For counselors */}
                  {activeView === 'unit' && user?.user?.user?.role === 'counselor' && (
                    <>
                      {filteredData.length === 0 ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex justify-center items-center py-16 bg-gray-800 rounded-xl shadow-md"
                        >
                          <div className="flex flex-col items-center text-center px-4">
                            <Users className="w-20 h-20 text-gray-500 mb-6" />
                            <h3 className="text-2xl font-semibold text-gray-300 mb-3">
                              Nenhuma especialidade encontrada na sua unidade
                            </h3>
                            <p className="text-gray-400 max-w-md">
                              {search ?
                                "Nenhum resultado para sua busca. Tente outro termo ou filtro." :
                                "Os desbravadores da sua unidade ainda não têm especialidades associadas."}
                            </p>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <AnimatePresence>
                            {filteredData.map((item, index) => (
                              <SpecialtyCard 
                              key={item.id}
                              item={item}
                              userLogged={user}
                              isLoading={isLoading}
                              reportSend={() => {}}
                              approve={() => {}}
                              onRemoveClick={() => {}}
                              index={index}

                            />
                            ))}
                          </AnimatePresence>
                        </div>
                      )}
                    </>
                  )}
                  
                  {/* Personal View - For all users */}
                  {(activeView === 'personal' || user?.user?.user?.role === 'dbv') && (
                    <>
                      {filteredData.length === 0 ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex justify-center items-center py-16 bg-gray-800 rounded-xl shadow-md"
                        >
                          <div className="flex flex-col items-center text-center px-4">
                            <BookOpen className="w-20 h-20 text-gray-500 mb-6" />
                            <h3 className="text-2xl font-semibold text-gray-300 mb-3">
                              Nenhuma especialidade encontrada
                            </h3>
                            <p className="text-gray-400 max-w-md">
                              {search ?
                                "Nenhum resultado para sua busca. Tente outro termo ou filtro." :
                                "Você não tem especialidades associadas ainda. Clique em 'Associar Especialidade' para começar."}
                            </p>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <AnimatePresence>
                            {filteredData.map((item, index) => (
                              <SpecialtyCard 
                                key={item.id}
                                item={item}
                                userLogged={user}
                                isLoading={isLoading}
                                reportSend={() => {}}
                                approve={() => {}}
                                onRemoveClick={() => {}}
                                index={index}

                              />
                            ))}
                          </AnimatePresence>
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>


      {/* Modals (same as in your code) */}
      {/* Report Modal */}
      <AnimatePresence>
        {isReportModalOpen && currentSpecialty && (
          <ReportModal
            isOpen={isReportModalOpen}
            onClose={() => {
              setIsReportModalOpen(false)
              setCurrentSpecialty(null)
            }}
            onReport={(reportText: string) => handleSubmitReport(reportText)}
            currentSpecialty={currentSpecialty}
          />
        )}
      </AnimatePresence>


      {/* Approval Modal */}
      <AnimatePresence>
        {isApprovalModalOpen && currentSpecialty && (
          <EvaluateApproveRejectModal
            isOpen={isApprovalModalOpen}
            onClose={() => setIsApprovalModalOpen(false)}
            specialty={currentSpecialty}
            approve={(specialty, approvalComment) => handleApprove(specialty, approvalComment)}
            reject={(specialty, approvalComment) => handleReject(specialty, approvalComment)}
          />
        )}
      </AnimatePresence>


      {/* Remove Confirmation Modal */}
      <AnimatePresence>
        {specialtyToRemove && (
          <AssociationRemoveModal
            onClose={() => setSpecialtyToRemove(null)}
            onRemove={confirmRemove}
            specialtyToRemove={specialtyToRemove}
          />
        )}
      </AnimatePresence>


      {/* Create Association Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <AssociationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveAssociation}
            users={users}
            specialties={specialties}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};


interface SpecialtyUserCardProps {
  item: SpecialtyUser;
  userLogged: UserResponseDTO | null;
  isLoading: boolean;
  approve: (specialty: SpecialtyUser) => void;
  reportSend: (specialty: SpecialtyUser) => void;
  onRemoveClick: (specialty: SpecialtyUser) => void;
  index: number;
}

// Separate Specialty Card Component for reusability
const SpecialtyCard = ({ 
  item, 
  userLogged,  
  onRemoveClick,
  reportSend,
  approve,
  index = 0
}: SpecialtyUserCardProps) => {

// Card animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } }
};


// // Content animation variants
// const contentVariants = {
//   hidden: { opacity: 0 },
//   visible: { opacity: 1, transition: { delay: 0.1, duration: 0.3 } }
// };
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

// Functions
const onApprove = (specialty: SpecialtyUser) => {
  approve(specialty);
};


const onReportSend = (specialty: SpecialtyUser) => {
  reportSend(specialty);
};


const onRemove = (specialty: SpecialtyUser) => {
  onRemoveClick(specialty);
};


const handleToggleExpand = (id: string) => {
  if (expandedItems.includes(id)) {
    setExpandedItems(expandedItems.filter(item => item !== id));
  } else {
    setExpandedItems([...expandedItems, id]);
  }
};


// Helper functions
const canSubmitReport = (specialty: SpecialtyUser) => {
  return specialty.isQuizApproved && specialty.report.length === 0;
};


const canApprove = (specialty: SpecialtyUser) => {
  if (!userLogged || specialty.report.length === 0) return false;
 
  if (userLogged.user.user.role === 'counselor' && !specialty.counselorApproval && specialty.approvalStatus === StatusSpecialty.WAITING_BY_COUNSELOR) {
    return true;
  }
 
  if (userLogged.user.user.role === 'lead' && specialty.counselorApproval && !specialty.leadApproval && specialty.approvalStatus === StatusSpecialty.WAITING_BY_LEAD) {
    return true;
  }
 
  if ((userLogged.user.user.role === 'director' || userLogged.user.user.role === 'admin') && specialty.counselorApproval && specialty.leadApproval && !specialty.directorApproval && specialty.approvalStatus === StatusSpecialty.WAITING_BY_DIRECTOR) {
    return true;
  }
 
  return false;
};


const getStatusBadge = (status: StatusSpecialty) => {
  switch (status) {
    case StatusSpecialty.PENDING:
      return <Badge color="warning" startIcon={<Clock size={14} />}>Pendente</Badge>;
    case StatusSpecialty.WAITING_BY_COUNSELOR:
      return <Badge color="info" startIcon={<UserCheck size={14} />}>Aguardando Conselheiro</Badge>;
    case StatusSpecialty.WAITING_BY_LEAD:
      return <Badge color="info" startIcon={<Users size={14} />}>Aguardando Líder</Badge>;
    case StatusSpecialty.WAITING_BY_DIRECTOR:
      return <Badge color="info" startIcon={<Award size={14} />}>Aguardando Diretor</Badge>;
    case StatusSpecialty.REJECTED_BY_COUNSELOR:
    case StatusSpecialty.REJECTED_BY_LEAD:
    case StatusSpecialty.REJECTED_BY_DIRECTOR:
      return <Badge color="error" startIcon={<XCircle size={14} />}>Rejeitado</Badge>;
    case StatusSpecialty.APRROVED_BY_COUNSELOR:
    case StatusSpecialty.APRROVED_BY_LEAD:
    case StatusSpecialty.APRROVED_BY_DIRECTOR:
      return <Badge color="success" startIcon={<CheckCircle size={14} />}>Aprovado Parcialmente</Badge>;
    case StatusSpecialty.APPROVED:
      return <Badge color="success" startIcon={<CheckCircle size={14} />}>Aprovado</Badge>;
    default:
      return <Badge color="primary" startIcon={<AlertTriangle size={14} />}>Desconhecido</Badge>;
  }
};


// // Filter data
// const filteredData = data.filter(item =>
//   (item.specialtyUser?.name?.toLowerCase().includes(search.toLowerCase()) ||
//   item.specialtyInfo?.name?.toLowerCase().includes(search.toLowerCase())) &&
//   (activeTab === "all" || 
//    (activeTab === "pending" && (item.approvalStatus.includes("waiting") || item.approvalStatus === StatusSpecialty.PENDING)) ||
//    (activeTab === "approved" && item.approvalStatus === StatusSpecialty.APPROVED) ||
//    (activeTab === "rejected" && item.approvalStatus.includes("rejected")))
// );


// Get approval progress percentage
const getApprovalProgress = (specialty: SpecialtyUser) => {
  let progress = 0;
  if (specialty.isQuizApproved) progress += 10;
  if (specialty.report ! === null) progress += 30;
  if (specialty.counselorApproval) progress += 20;
  if (specialty.leadApproval) progress += 10;
  if (specialty.directorApproval) progress += 30;
  return progress;
};


// Format date
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

  return (
    <div className="grid grid-cols-1">
      <motion.div
            layout
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ delay: index * 0.05 }}
            className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:border-indigo-500 transition-all duration-300 w-full"
          >
            {/* Card Header With Image Background - More responsive layout */}
            <div
              className="min-h-24 bg-gradient-to-r from-indigo-800 to-purple-700 relative p-2"
              style={item.specialtyInfo?.emblem ? {
                backgroundImage: `linear-gradient(rgba(49, 46, 129, 0.7), rgba(67, 56, 202, 0.7)), url(${item.specialtyInfo.emblem})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              } : {}}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 relative">
                {/* Left side with emblem and title - stacks on mobile */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center w-full">
                  <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full border-2 border-white bg-gray-900 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {item.specialtyInfo?.emblem ? (
                      <img
                        src={item.specialtyInfo.emblem}
                        alt={item.specialtyInfo?.name || "Especialidade"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Award size={20} className="text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1 mt-2 sm:mt-0 sm:ml-4">
                    <h3 className="text-base sm:text-lg font-bold text-white truncate">
                      {item.specialtyInfo?.name || "Especialidade"}
                    </h3>
                    <div className="flex items-center mt-1">
                      <Badge
                        color="info"
                        //className="text-xs"
                      >
                        {item.specialtyInfo?.category || "Categoria"}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {/* Status badge - positioned better for small screens */}
                <div className="absolute top-2 right-2 sm:relative sm:top-auto sm:right-auto mt-1 sm:mt-0">
                  {getStatusBadge(item.approvalStatus)}
                </div>
              </div>
            </div>
           
            {/* Card Body */}
            <div className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray-400" />
                  <span className="text-xs sm:text-sm text-gray-300 truncate">
                    {item.specialtyUser?.name || "Desbravador"}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Associado em: {formatDate(item.createdAt)}
                </div>
              </div>
             
              {/* Approval Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-400">Progresso da Aprovação</span>
                  <span className="text-xs font-semibold text-indigo-400">
                    {getApprovalProgress(item)}%
                  </span>
                </div>
                <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    style={{ width: `${getApprovalProgress(item)}%` }}
                  ></div>
                </div>
              </div>
             
              {/* Expand/Collapse Section */}
              <Button
                variant="outline"
                onClick={() => handleToggleExpand(item.id)}
                className="w-full flex items-center justify-between py-1.5 sm:py-2 text-xs sm:text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <span>Detalhes e Opções</span>
                {expandedItems.includes(item.id) ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </Button>
             
              {/* Expanded Content */}
              <AnimatePresence>
                {expandedItems.includes(item.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 space-y-3 border-t border-gray-700 mt-3">
                      {/* Status Information - Adjusted for better mobile display */}
                      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-2 text-xs">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full ${item.isQuizApproved ? 'bg-green-500' : 'bg-gray-500'}`} />
                          <span className={item.isQuizApproved ? 'text-green-400' : 'text-gray-500'}>
                            Quiz Aprovado
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full ${item.report.length > 0 ? 'bg-green-500' : 'bg-gray-500'}`} />
                          <span className={item.report.length > 0 ? 'text-green-400' : 'text-gray-500'}>
                            Relatório Enviado
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full ${item.counselorApproval ? 'bg-green-500' : 'bg-gray-500'}`} />
                          <span className={item.counselorApproval ? 'text-green-400' : 'text-gray-500'}>
                            Conselheiro
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full ${item.leadApproval ? 'bg-green-500' : 'bg-gray-500'}`} />
                          <span className={item.leadApproval ? 'text-green-400' : 'text-gray-500'}>
                            Líder
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full ${item.directorApproval ? 'bg-green-500' : 'bg-gray-500'}`} />
                          <span className={item.directorApproval ? 'text-green-400' : 'text-gray-500'}>
                            Diretor
                          </span>
                        </div>
                      </div>
                     
                      {/* Report Preview (if exists) */}
                      {item.report && item.report.length > 0 && (
                        <div className="p-2 sm:p-3 bg-gray-750 rounded-lg text-xs text-gray-300 mt-2">
                          <div className="flex items-center mb-1.5">
                            <FileText size={14} className="text-indigo-400 mr-2" />
                            <span className="font-semibold text-indigo-400">Relatório Enviado:</span>
                          </div>
                          <p className="line-clamp-3 text-xs sm:text-sm">
                            {item.report}
                          </p>
                        </div>
                      )}
                     
                      {/* Action Buttons - More responsive layout */}
                      <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 pt-2">
                        {/* Send Report Button */}
                        {canSubmitReport(item) && (
                          <Button
                            size="sm"
                            variant="primary"
                            className="text-xs flex items-center justify-center gap-1 w-full"
                            onClick={() => onReportSend(item)}
                          >
                            <FileText size={14} />
                            <span>Enviar Relatório</span>
                          </Button>
                        )}
                       
                        {/* Approve Button */}
                        {canApprove(item) && (
                          <Button
                            size="sm"
                            className="text-xs flex items-center justify-center gap-1 w-full"
                            onClick={() => onApprove(item)}
                          >
                            <UserCheck size={14} />
                            <span>Aprovar / Rejeitar</span>
                          </Button>
                        )}
                       
                        {/* Remove Button */}
                        {(userLogged?.user.user.role === 'admin' ||
                          (userLogged?.user.user.id === item.userId && item.approvalStatus !== 'approved')) && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs flex items-center justify-center gap-1 w-full col-span-1 xs:col-span-2"
                            onClick={() => onRemove(item)}
                          >
                            <XCircle size={14} />
                            <span>Remover</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

    </div>
  );
};

interface ReportModalProps {
  isOpen: boolean; 
  onClose: () => void; 
  onReport: (reportText: string) => void;
  currentSpecialty: SpecialtyUser
}

// Modal Components
const ReportModal = ({ 
  //isOpen, 
  onClose, 
  onReport, 
  currentSpecialty }: ReportModalProps) => {
  const [reportText, setReportText] = useState("");
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (reportText.trim().length < 50) {
      // Show error
      return;
    }
    onReport(reportText);
    onClose();
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800 rounded-xl shadow-lg p-6 max-w-lg w-full"
      >
        <h3 className="text-xl font-semibold text-white mb-4">
          Enviar Relatório de Especialidade
        </h3>
        
        <div className="mb-4 p-3 bg-gray-700 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-indigo-700 flex items-center justify-center">
              <Award size={16} className="text-white" />
            </div>
            <div>
              <h4 className="text-md font-semibold text-white">
                {currentSpecialty?.specialtyInfo?.name || "Especialidade"}
              </h4>
              <p className="text-sm text-gray-400">
                {currentSpecialty?.specialtyInfo?.category || "Categoria"}
              </p>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Seu Relatório (mínimo 50 caracteres)
            </label>
            <textarea
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              rows={8}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white resize-none focus:ring focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Descreva detalhadamente todas as atividades realizadas para completar esta especialidade..."
            />
            <div className="text-xs text-gray-400 mt-2 flex justify-between">
              <span>{reportText.length} caracteres</span>
              <span className={reportText.length < 50 ? "text-red-400" : "text-green-400"}>
                {reportText.length < 50 ? `Mínimo: 50 caracteres (faltam ${50 - reportText.length})` : "✓ Tamanho mínimo atingido"}
              </span>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-4 py-2"
            >
              Cancelar
            </Button>
            <Button
              //type="submit"
              variant="primary"
              className="px-4 py-2"
              disabled={reportText.trim().length < 50}
            >
              Enviar Relatório
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};


interface EvaluateApproveRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  specialty: SpecialtyUser;
  approve: (specialty: SpecialtyUser, approvalComment: string) => void;
  reject: (specialty: SpecialtyUser, approvalComment: string) => void
}

const EvaluateApproveRejectModal = ({ 
  //isOpen, 
  onClose, 
  specialty, 
  approve, reject }: EvaluateApproveRejectModalProps) => {
  const [comment, setComment] = useState("");
  const [decision, setDecision] = useState<'approve' | 'reject' | null>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decision) return;
    
    if (decision === 'approve') {
      approve(specialty, comment);
    } else {
      reject(specialty, comment);
    }
    
    onClose();
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800 rounded-xl shadow-lg p-6 max-w-lg w-full"
      >
        <h3 className="text-xl font-semibold text-white mb-4">
          Avaliação de Especialidade
        </h3>
        
        <div className="mb-6 p-4 bg-gray-700 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-indigo-700 flex items-center justify-center flex-shrink-0">
              <Award size={20} className="text-white" />
            </div>
            <div className="flex-grow">
              <h4 className="text-lg font-semibold text-white">
                {specialty?.specialtyInfo?.name || "Especialidade"}
              </h4>
              <p className="text-sm text-gray-400 mb-2">
                {specialty?.specialtyInfo?.category || "Categoria"}
              </p>
              <div className="flex items-center text-sm text-gray-300">
                <User size={14} className="mr-2" />
                <span>{specialty?.specialtyUser?.name || "Desbravador"}</span>
              </div>
            </div>
          </div>
          
          {specialty?.report && (
            <div className="mt-4 p-3 bg-gray-750 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Relatório do Desbravador:</div>
              <p className="text-sm text-gray-300">{specialty.report}</p>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Sua Decisão
            </label>
            <div className="flex gap-4">
              <Button
                //type="button"
                variant={decision === 'approve' ? 'primary' : 'outline'}
                onClick={() => setDecision('approve')}
                className={`flex-1 flex items-center justify-center p-4 ${
                  decision === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'
                } rounded-lg transition-colors duration-200`}
              >
                <CheckCircle className="mr-2" size={18} />
                Aprovar
              </Button>
              
              <Button
                //type="button"
                variant={decision === 'reject' ? 'outline' : 'primary'}
                onClick={() => setDecision('reject')}
                className={`flex-1 flex items-center justify-center p-4 ${
                  decision === 'reject' ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
                } rounded-lg transition-colors duration-200`}
              >
                <XCircle className="mr-2" size={18} />
                Rejeitar
              </Button>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Comentário (opcional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white resize-none focus:ring focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Adicione um comentário ou feedback para o desbravador..."
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-4 py-2"
            >
              Cancelar
            </Button>
            <Button
              //type="submit"
              variant="primary"
              className="px-4 py-2"
              disabled={!decision}
            >
              Confirmar
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};




interface AssociationRemoveModalProps {
  //isOpen: boolean; 
  onClose: () => void; 
  onRemove: (specialtyToRemoveId: string) => void; 
  specialtyToRemove: SpecialtyUser; 
}

const AssociationRemoveModal = ({ onClose, onRemove, specialtyToRemove }: AssociationRemoveModalProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800 rounded-xl shadow-lg p-6 max-w-md w-full"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <XCircle size={32} className="text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Remover Especialidade
          </h3>
          <p className="text-gray-400">
            Tem certeza que deseja remover a especialidade <span className="font-semibold text-white">{specialtyToRemove?.specialtyInfo?.name}</span>?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Esta ação não pode ser desfeita.
          </p>
        </div>
        
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6 py-2"
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onRemove(specialtyToRemove.id);
              onClose();
            }}
            className="px-6 py-2"
          >
            Remover
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};






// type SpecialtyInfo = {
//   id: string;
//   name: string;
//   description?: string;
//   category?: string;
//   imageUrl?: string;
// };


// type UserInfo = {
//   id: string;
//   name: string;
//   role: string;
// };

// type SpecialtyAssociation = {
//   userId: string;
//   specialtyId: string;
// };

interface AssociationModalProps {
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (assoc: SpecialtyAssociation) => void; 
  users: UserInfo[]; 
  specialties: SpecialtyInfo[]; 
}

const AssociationModal = ({ 
  
  //isOpen, 
  onClose, onSave, users, specialties }: AssociationModalProps) => {
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Get unique categories
  const categories: string[] = useMemo(() => {
      if (!specialties) return [];
      const categorySet = new Set<string>();
      specialties.forEach((specialty: SpecialtyInfo) => {
        if (specialty.category) {
          categorySet.add(specialty.category);
        }
      });
      return Array.from(categorySet);
    }, [specialties]);
  
  // Filter specialties based on search and category
  const filteredSpecialties = useMemo(() => {
    if (!specialties) return [];
    
    return specialties.filter((specialty: SpecialtyInfo) => {
      const searchMatch = 
        search === '' || 
        specialty.name.toLowerCase().includes(search.toLowerCase()) ||
        (specialty.description ?? '').toLowerCase().includes(search.toLowerCase());
      
      const categoryMatch = 
        categoryFilter === 'all' || 
        specialty.category === categoryFilter;
      
      return searchMatch && categoryMatch;
    });
  }, [specialties, search, categoryFilter]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !selectedSpecialty) return;
    
    onSave({
      userId: selectedUser,
      specialtyId: selectedSpecialty
    });
    
    onClose();
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800 rounded-xl shadow-lg p-6 max-w-xl w-full max-h-[90vh] flex flex-col"
      >
        <h3 className="text-xl font-semibold text-white mb-6">
          Associar Nova Especialidade
        </h3>
        
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Desbravador
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Selecione um desbravador</option>
              {users?.map((user: UserInfo) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Especialidade
            </label>
            
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <Input
                    placeholder="Buscar especialidade..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 w-full"
                  />
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">Todas Categorias</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="bg-gray-750 rounded-lg border border-gray-700 overflow-hidden max-h-64 overflow-y-auto">
                {filteredSpecialties.length === 0 ? (
                  <div className="p-4 text-center text-gray-400">
                    Nenhuma especialidade encontrada
                  </div>
                ) : (
                  <div className="divide-y divide-gray-700">
                    {filteredSpecialties.map((specialty: SpecialtyInfo) => (
                      <div
                        key={specialty.id}
                        onClick={() => setSelectedSpecialty(specialty.id)}
                        className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-700 transition-colors ${
                          selectedSpecialty === specialty.id ? 'bg-indigo-900 bg-opacity-50' : ''
                        }`}
                      >
                        <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center overflow-hidden">
                          {specialty.imageUrl ? (
                            <img 
                              src={specialty.imageUrl} 
                              alt={specialty.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Award size={16} className="text-indigo-400" />
                          )}
                        </div>
                        <div className="flex-grow">
                          <h4 className="text-sm font-medium text-white">
                            {specialty.name}
                          </h4>
                          <div className="flex items-center gap-2">
                            <Badge 
                              color="info" 
                              //className="text-xs"
                            >
                              {specialty.category}
                            </Badge>
                          </div>
                        </div>
                        {selectedSpecialty === specialty.id && (
                          <CheckCircle size={20} className="text-indigo-400" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-auto pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-4 py-2"
            >
              Cancelar
            </Button>
            <Button
              //type="submit"
              variant="primary"
              className="px-4 py-2"
              disabled={!selectedUser || !selectedSpecialty}
            >
              Associar Especialidade
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};


export default SpecialtyManager;




































// <motion.div
// layout
// variants={cardVariants}
// initial="hidden"
// animate="visible"
// exit="exit"
// transition={{ delay: index * 0.05 }}
// className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:border-indigo-500 transition-all duration-300"
// >
// {/* Card Header With Image Background */}
// <div
//   className="h-24 bg-gradient-to-r from-indigo-800 to-purple-700 relative"
//   style={item.specialtyInfo?.emblem ? {
//     backgroundImage: `linear-gradient(rgba(49, 46, 129, 0.7), rgba(67, 56, 202, 0.7)), url(${item.specialtyInfo.emblem})`,
//     backgroundSize: 'cover',
//     backgroundPosition: 'center'
//   } : {}}
// >
//   <div className="absolute inset-0 flex items-center justify-between px-4">
//     <div className="flex items-center">
//       <div className="h-16 w-16 rounded-full border-2 border-white bg-gray-900 flex items-center justify-center overflow-hidden">
//         {item.specialtyInfo?.emblem ? (
//           <img 
//             src={item.specialtyInfo.emblem} 
//             alt={item.specialtyInfo?.name || "Especialidade"} 
//             className="h-full w-full object-cover"
//           />
//         ) : (
//           <Award size={24} className="text-white" />
//         )}
//       </div>
//     </div>
//     <div className="flex-1 ml-4">
//       <h3 className="text-lg font-bold text-white truncate">
//         {item.specialtyInfo?.name || "Especialidade"}
//       </h3>
//       <div className="flex items-center">
//         <Badge 
//           color="info" 
//           //className="text-xs mt-1"
//         >
//           {item.specialtyInfo?.category || "Categoria"}
//         </Badge>
//       </div>
//     </div>
//     {getStatusBadge(item.approvalStatus)}
//   </div>
// </div>

// {/* Card Body */}
// <div className="p-4">
//   <div className="flex items-center justify-between mb-3">
//     <div className="flex items-center gap-2">
//       <User size={16} className="text-gray-400" />
//       <span className="text-sm text-gray-300">
//         {item.specialtyUser?.name || "Desbravador"}
//       </span>
//     </div>
//     <div className="text-xs text-gray-500">
//       Associado em: {formatDate(item.createdAt)}
//     </div>
//   </div>
  
//   {/* Approval Progress Bar */}
//   <div className="mb-3">
//     <div className="flex justify-between items-center mb-1">
//       <span className="text-xs text-gray-400">Progresso da Aprovação</span>
//       <span className="text-xs font-semibold text-indigo-400">
//         {getApprovalProgress(item)}%
//       </span>
//     </div>
//     <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
//       <div 
//         className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" 
//         style={{ width: `${getApprovalProgress(item)}%` }}
//       ></div>
//     </div>
//   </div>
  
//   {/* Expand/Collapse Section */}
//   <Button
//     variant="outline"
//     onClick={() => handleToggleExpand(item.id)}
//     className="w-full flex items-center justify-between py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
//   >
//     <span>Detalhes e Opções</span>
//     {expandedItems.includes(item.id) ? (
//       <ChevronUp size={16} />
//     ) : (
//       <ChevronDown size={16} />
//     )}
//   </Button>
  
//   {/* Expanded Content */}
//   <AnimatePresence>
//     {expandedItems.includes(item.id) && (
//       <motion.div
//         initial={{ height: 0, opacity: 0 }}
//         animate={{ height: 'auto', opacity: 1 }}
//         exit={{ height: 0, opacity: 0 }}
//         transition={{ duration: 0.3 }}
//         className="overflow-hidden"
//       >
//         <div className="pt-3 space-y-3 border-t border-gray-700 mt-3">
//           {/* Status Information */}
//           <div className="grid grid-cols-2 gap-2 text-xs">
//             <div className="flex items-center gap-1.5">
//               <div className={`w-2 h-2 rounded-full ${item.isQuizApproved ? 'bg-green-500' : 'bg-gray-500'}`} />
//               <span className={item.isQuizApproved ? 'text-green-400' : 'text-gray-500'}>
//                 Quiz Aprovado
//               </span>
//             </div>
//             <div className="flex items-center gap-1.5">
//               <div className={`w-2 h-2 rounded-full ${item.report.length > 0 ? 'bg-green-500' : 'bg-gray-500'}`} />
//               <span className={item.report.length > 0 ? 'text-green-400' : 'text-gray-500'}>
//                 Relatório Enviado
//               </span>
//             </div>
//             <div className="flex items-center gap-1.5">
//               <div className={`w-2 h-2 rounded-full ${item.counselorApproval ? 'bg-green-500' : 'bg-gray-500'}`} />
//               <span className={item.counselorApproval ? 'text-green-400' : 'text-gray-500'}>
//                 Conselheiro
//               </span>
//             </div>
//             <div className="flex items-center gap-1.5">
//               <div className={`w-2 h-2 rounded-full ${item.leadApproval ? 'bg-green-500' : 'bg-gray-500'}`} />
//               <span className={item.leadApproval ? 'text-green-400' : 'text-gray-500'}>
//                 Líder
//               </span>
//             </div>
//             <div className="flex items-center gap-1.5">
//               <div className={`w-2 h-2 rounded-full ${item.directorApproval ? 'bg-green-500' : 'bg-gray-500'}`} />
//               <span className={item.directorApproval ? 'text-green-400' : 'text-gray-500'}>
//                 Diretor
//               </span>
//             </div>
//           </div>
          
//           {/* Report Preview (if exists) */}
//           {item.report && item.report.length > 0 && (
//             <div className="p-3 bg-gray-750 rounded-lg text-xs text-gray-300 mt-2">
//               <div className="flex items-center mb-1.5">
//                 <FileText size={14} className="text-indigo-400 mr-2" />
//                 <span className="font-semibold text-indigo-400">Relatório Enviado:</span>
//               </div>
//               <p className="line-clamp-3">
//                 {item.report}
//               </p>
//             </div>
//           )}
          
//           {/* Action Buttons */}
//           <div className="flex flex-wrap gap-2 pt-2">
//             {/* Send Report Button */}
//             {canSubmitReport(item) && (
//               <Button
//                 size="sm"
//                 variant="primary"
//                 startIcon={<FileText size={14} />}
//                 onClick={() => onReportSend(item)}
//                 className="text-xs flex-grow"
//               >
//                 Enviar Relatório
//               </Button>
//             )}
            
//             {/* Approve Button */}
//             {canApprove(item) && (
//               <Button
//                 size="sm"
//                 //variant="success"
//                 startIcon={<UserCheck size={14} />}
//                 onClick={() => onApprove(item)}
//                 className="text-xs flex-grow"
//               >
//                 Aprovar / Rejeitar
//               </Button>
//             )}
            
//             {/* Remove Button */}
//             {(userLogged?.user.user.role === 'admin' || 
//               (userLogged?.user.user.id === item.userId && item.approvalStatus !== 'approved')) && (
//               <Button
//                 size="sm"
//                 variant="outline"
//                 startIcon={<XCircle size={14} />}
//                 onClick={() => onRemove(item)}
//                 className="text-xs flex-grow"
//               >
//                 Remover
//               </Button>
//             )}
//           </div>
//         </div>
//       </motion.div>
//     )}
//   </AnimatePresence>
// </div>
// </motion.div>








// import { useEffect, useState } from "react";
// import toast, { Toaster } from "react-hot-toast";
// import { motion, AnimatePresence } from "framer-motion";
// import { specialtyUserService } from "../../services/specialtyUserService";
// import { userService } from "../../services/userService";
// import { specialtyService } from "../../services/specialtyService";
// import { PlusIcon,  } from "../../icons";
// import { SearchIcon } from "lucide-react";
// import Button from "../../components/ui/button/Button";
// import PageBreadcrumb from "../../components/common/PageBreadCrumb";
// import ComponentCard from "../../components/common/ComponentCard";
// import PageMeta from "../../components/common/PageMeta";
// import Input from "../../components/form/input/InputField";
// import { useAuth } from '../../context/AuthContext'
// import AssociationModal from "./ComponentsUser/AssociationModal";
// import AssociationRemoveModal from "./ComponentsUser/AssociationRemoveModal";
// import ReportModal from "./ComponentsUser/ReportModal";
// import SpecialtyUserCard from "./ComponentsUser/SpecialtyUserCard";
// import EvaluateApproveRejectModal from "./ComponentsUser/EvaluateApproveRejectModal";
// import { unitsService } from "../../services/unitsService";


// enum StatusSpecialty {
//   PENDING = 'pending',
//   WAITING_BY_COUNSELOR = 'waiting_by_counselor',
//   WAITING_BY_LEAD = 'waiting_by_lead',
//   WAITING_BY_DIRECTOR = 'waiting_by_director',
//   REJECTED_BY_COUNSELOR = 'rejected_by_counselor',
//   REJECTED_BY_LEAD = 'rejected_by_lead',
//   REJECTED_BY_DIRECTOR = 'rejected_by_director',
//   APRROVED_BY_COUNSELOR = 'aprroved_by_counselor',
//   APRROVED_BY_LEAD = 'aprroved_by_lead',
//   APRROVED_BY_DIRECTOR = 'aprroved_by_director',
//   APPROVED = 'approved',
// }


// type SpecialtyInfo = {
//   id: string;
//   name: string;
//   description?: string;
//   category?: string;
//   imageUrl?: string;
// };


// type UserInfo = {
//   id: string;
//   name: string;
//   role: string;
// };

// interface SpecialtyUser {
//   id: string;
//   userId: string;
//   specialtyId: string;
//   approvalStatus: StatusSpecialty;
//   report: string[];
//   rejectionComments: string[];
//   approvalComments: string[];
//   isQuizApproved: boolean;
//   counselorApproval: boolean;
//   counselorApprovalAt: string | null;
//   leadApproval: boolean;
//   leadApprovalAt: string | null;
//   directorApproval: boolean;
//   directorApprovalAt: string | null;
//   createdAt: string;
//   updatedAt: string;
//   specialtyUser: {
//     name: string;
//     photoUrl?: string;
//   };
//   specialtyInfo?: {
//     name: string;
//     category: string;
//     imageUrl: string;
//   };
// }


// export type SpecialtyAssociation = {
//   userId: string;
//   specialtyId: string;
// };


// export default function SpecialtyUser() {
//   const [data, setData] = useState<SpecialtyUser[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isReportModalOpen, setIsReportModalOpen] = useState(false);
//   const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
//   const [specialtyToRemove, setSpecialtyToRemove] = useState<SpecialtyUser | null>(null);
//   const [currentSpecialty, setCurrentSpecialty] = useState<SpecialtyUser | null>(null);
//   const [search, setSearch] = useState("");
//   const [users, setUsers] = useState<UserInfo[]>([]);
//   const [specialties, setSpecialties] = useState<SpecialtyInfo[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   const { user } = useAuth();


//   // Page animation variants
//   const pageVariants = {
//     initial: { opacity: 0 },
//     animate: { opacity: 1, transition: { duration: 0.5 } },
//     exit: { opacity: 0, transition: { duration: 0.3 } }
//   };

//   useEffect(() => {
//     fetchInitialData();
//   }, []);


//   const fetchInitialData = async () => {
//     setIsLoading(true);
//     const loadingToast = toast.loading("Carregando dados...", { position: 'bottom-center' });
  
//     try {
//       await Promise.all([fetchSpecialtyUsers(), fetchUsers(), fetchSpecialties()]);
//       toast.dismiss(loadingToast);
//       toast.success("Dados carregados com sucesso", {
//         position: 'bottom-center',
//         duration: 2000,
//         style: {
//           borderRadius: '10px',
//           background: '#333',
//           color: '#fff',
//         },
//         iconTheme: {
//           primary: '#10B981',
//           secondary: '#FFFFFF',
//         }
//       });
//     } catch (error) {
//       toast.dismiss(loadingToast);
//       toast.error("Erro ao carregar alguns dados", { position: 'bottom-center' });
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   const fetchSpecialtyUsers = async () => {
//     try {
//       const response = await specialtyUserService.getAllSpecialtyAssociation();
//       setData(response || []);


//       const test = await unitsService.existCounselorUnit("9121716a-601f-4d51-920c-e5e1938c21c7")
//       console.log("PAYLOAD", test)

//       return response;
//     } catch (error) {
//       toast.error("Erro ao carregar associações de especialidades", {
//         position: 'bottom-right',
//         icon: '🚫',
//       });
//       return [];
//     }
//   };


//   const fetchUsers = async () => {
//     try {
//       const response = await userService.getAllUsers();
//       setUsers(response);
//       return response;
//     } catch (error) {
//       toast.error("Erro ao carregar os usuários", {
//         position: 'bottom-right',
//         icon: '🚫',
//       });
//       return [];
//     }
//   };


//   const fetchSpecialties = async () => {
//     try {
//       const response = await specialtyService.ListAllSpecialty();
//       setSpecialties(response.result.specialty);
//       return response.result.specialty;
//     } catch (error) {
//       toast.error("Erro ao carregar as especialidades", {
//         position: 'bottom-right',
//         icon: '🚫',
//       });
//       return [];
//     }
//   };


//   const confirmRemove = async () => {
//     if (!specialtyToRemove) return;
  
//     const loadingToast = toast.loading("Removendo associação...", { position: 'bottom-center' });
  
//     try {
//       await specialtyUserService.deleteSpecialtyAssociation(specialtyToRemove.id);
//       toast.dismiss(loadingToast);
//       toast.success(`Associação removida com sucesso`, {
//         position: 'bottom-right',
//         duration: 3000,
//         icon: '✅',
//       });
//       await fetchSpecialtyUsers();
//     } catch (err) {
//       toast.dismiss(loadingToast);
//       toast.error("Erro ao remover associação", {
//         position: 'bottom-right',
//         icon: '❌',
//       });
//     } finally {
//       setSpecialtyToRemove(null);
//     }
//   };


//   const handleSaveAssociation = async (assoc: SpecialtyAssociation) => {
//     const loadingToast = toast.loading("Criando associação...", { position: 'bottom-center' });
  
//     try {
//       await specialtyUserService.createAssociation(assoc);
//       toast.dismiss(loadingToast);
//       toast.success("Associação criada com sucesso", {
//         position: 'bottom-right',
//         icon: '🎉',
//         duration: 3000,
//       });
//       await fetchSpecialtyUsers();
//       setIsModalOpen(false);
//     } catch (error) {
//       toast.dismiss(loadingToast);
//       toast.error("Erro ao criar associação", {
//         position: 'bottom-right',
//         icon: '❌',
//       });
//     }
//   };


//   const handleSubmitReport = async (reportText: string) => {
//     if (!currentSpecialty || !reportText.trim()) return;
    
//     const loadingToast = toast.loading("Enviando relatório...", { position: 'bottom-center' });
//     const dateNow = new Date()
//     try {
//       specialtyUserService
//       .sendReport(
//         currentSpecialty.id,
//         currentSpecialty.userId,
//         currentSpecialty.specialtyId,
//         [reportText, dateNow.toISOString()]
//       )
//       toast.dismiss(loadingToast);
//       toast.success("Relatório enviado com sucesso", {
//         position: 'bottom-right',
//         icon: '📝',
//         duration: 3000,
//       });
//       fetchSpecialtyUsers();
//       fetchInitialData();
//       setIsReportModalOpen(false);
      
//     } catch (error) {
//       toast.dismiss(loadingToast);
//       toast.error("Erro ao enviar relatório", {
//         position: 'bottom-right',
//         icon: '❌',
//       });
//     }
//   };


//   const handleApprove = async (approvalComment: string) => {
//     if (!currentSpecialty || !user?.user.user.id) return;
    
//     const loadingToast = toast.loading("Processando aprovação...", { position: 'bottom-center' });
//     const dateNow = new Date()
//     try {
//       await specialtyUserService.approve(
//         currentSpecialty.userId,
//         currentSpecialty.specialtyId,
//         user?.user.user.id,
//         [approvalComment, dateNow.toISOString(), user.user.user.name]
//       );
//       toast.dismiss(loadingToast);
//       toast.success("Aprovação realizada com sucesso", {
//         position: 'bottom-right',
//         icon: '✅',
//         duration: 3000,
//       });
//       //await fetchSpecialtyUsers();
//       fetchInitialData()
//       setIsApprovalModalOpen(false);

//     } catch (error) {
//       toast.dismiss(loadingToast);
//       toast.error("Erro ao processar aprovação", {
//         position: 'bottom-right',
//         icon: '❌',
//       });
//     }
//   };


//   const handleReject = async (approvalComment: string) => {
//     if (!currentSpecialty || !user?.user.user.id) return;
    
//     const loadingToast = toast.loading("Processando rejeição...", { position: 'bottom-center' });
//     const dateNow = new Date()
//     try {
//       await specialtyUserService.reject(
//         currentSpecialty.userId,
//         currentSpecialty.specialtyId,
//         user?.user.user.id,
//         [approvalComment, dateNow.toISOString(), user.user.user.name]
//       );

//       toast.dismiss(loadingToast);
//       toast.success("Rejeição processada com sucesso", {
//         position: 'bottom-right',
//         icon: '✅',
//         duration: 3000,
//       });
//       fetchInitialData()
//       setIsApprovalModalOpen(false);

//     } catch (error) {
//       toast.dismiss(loadingToast);
//       toast.error("Erro ao processar rejeição", {
//         position: 'bottom-right',
//         icon: '❌',
//       });
//     }
//   };

//   const handleRemoveClick = (specialty: SpecialtyUser) => {
//     setSpecialtyToRemove(specialty);
//   };

//   const sendReport = (specialty: SpecialtyUser) => {
//     setCurrentSpecialty(specialty);
//     setIsReportModalOpen(true);
//   };

//   const evaluateBySpecialty = (specialty: SpecialtyUser) => {
//     setCurrentSpecialty(specialty);
//     setIsApprovalModalOpen(true);
//   };

//   return (
//     <motion.div
//       initial="initial"
//       animate="animate"
//       exit="exit"
//       variants={pageVariants}
//       className="min-h-screen"
//     >
//       <Toaster />
//       <PageMeta
//         title="Especialidades dos Desbravadores"
//         description="Gerenciamento de todas as especialidades associadas aos usuários desbravadores"
//       />
//       <PageBreadcrumb pageTitle="Especialidades" />


//       <div className="space-y-6 pb-10">
//         <ComponentCard title="Especialidades dos Desbravadores">
//           <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
//             <div className="relative flex-grow max-w-md">
//               <Input
//                 placeholder="Buscar por nome do desbravador ou especialidade"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="pl-10 rounded-xl focus:ring-2 focus:ring-blue-500"
//               />
//               <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//             </div>
//             <motion.div
//               whileHover={{ scale: 1.03 }}
//               whileTap={{ scale: 0.97 }}
//             >
//               <Button
//                 size="sm"
//                 variant="primary"
//                 startIcon={<PlusIcon />}
//                 onClick={() => {
//                   setSpecialtyToRemove(null);
//                   setIsModalOpen(true);
//                 }}
//                 className="rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-purple-500 to-indigo-600"
//               >
//                 Associar Especialidade
//               </Button>
//             </motion.div>
//           </div>

//           <SpecialtyUserCard
//             onRemoveClick={handleRemoveClick}
//             userLogged={user}
//             data={data}
//             search={search}
//             isLoading={isLoading}
//             approve={evaluateBySpecialty}
//             reportSend={sendReport}
//           />
//         </ComponentCard>
//       </div>


//       {/* Report Modal */}
//       <AnimatePresence>
//         {isReportModalOpen && currentSpecialty && (
//           <ReportModal
//             isOpen={isReportModalOpen}
//             onClose={() => {
//               setIsReportModalOpen(false)
//               setCurrentSpecialty(null)
//             }} 
//             onReport={(reportText: string) => handleSubmitReport(reportText)}
//             currentSpecialty= {currentSpecialty}
//           />
//         )}

//       </AnimatePresence>

//       {/* Approval Modal */}
//       <AnimatePresence>
//         {isApprovalModalOpen && currentSpecialty && (
//           <EvaluateApproveRejectModal
//             isOpen={isApprovalModalOpen}
//             onClose={() => setIsApprovalModalOpen(false)}
//             specialty={currentSpecialty}
//             approve={handleApprove}
//             reject={handleReject}
//           />
//         )}
//       </AnimatePresence>


//       {/* Remove Confirmation Modal */}
//       <AnimatePresence>
//         {specialtyToRemove && (
//           <AssociationRemoveModal
//           //isOpen={() => {}}
//           onClose={() => setSpecialtyToRemove(null)}
//           onRemove={confirmRemove}
//           specialtyToRemove={specialtyToRemove}
//           />
//         )}
//       </AnimatePresence>


//       {/* Create Association Modal */}
//       <AnimatePresence>
//         {isModalOpen && (
//           <AssociationModal
//             isOpen={isModalOpen}
//             onClose={() => setIsModalOpen(false)}
//             onSave={handleSaveAssociation}
//             users={users}
//             specialties={specialties}
//           />
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// }
