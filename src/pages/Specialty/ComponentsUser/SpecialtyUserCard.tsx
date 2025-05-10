import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  UserCheck,
  Award,
  Users
} from "lucide-react";
import Button from "../../../components/ui/button/Button";
import Badge from "../../../components/ui/badge/Badge";
import { UserResponseDTO } from "../../../context/AuthContext";


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
    imageUrl: string;
  };
}


export type SpecialtyAssociation = {
  userId: string;
  specialtyId: string;
};


interface SpecialtyUserCardProps {
  onRemoveClick: (specialty: SpecialtyUser) => void;
  userLogged: UserResponseDTO | null;
  data: SpecialtyUser[];
  search: string;
  isLoading: boolean;
  approve: (specialty: SpecialtyUser) => void;
  reportSend: (specialty: SpecialtyUser) => void;
}


export default function SpecialtyUserCard({
  onRemoveClick,
  userLogged,
  data,
  search,
  isLoading,
  approve,
  reportSend,
}: SpecialtyUserCardProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");


  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } }
  };


  // Content animation variants
  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 0.1, duration: 0.3 } }
  };


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


  // Filter data
  const filteredData = data.filter(item =>
    (item.specialtyUser?.name?.toLowerCase().includes(search.toLowerCase()) ||
    item.specialtyInfo?.name?.toLowerCase().includes(search.toLowerCase())) &&
    (activeTab === "all" || 
     (activeTab === "pending" && (item.approvalStatus.includes("waiting") || item.approvalStatus === StatusSpecialty.PENDING)) ||
     (activeTab === "approved" && item.approvalStatus === StatusSpecialty.APPROVED) ||
     (activeTab === "rejected" && item.approvalStatus.includes("rejected")))
  );


  // Get approval progress percentage
  const getApprovalProgress = (specialty: SpecialtyUser) => {
    let progress = 0;
    if (specialty.counselorApproval) progress += 33.33;
    if (specialty.leadApproval) progress += 33.33;
    if (specialty.directorApproval) progress += 33.34;
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
          {data.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2 justify-center sm:justify-start">
              <Button 
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${activeTab === "all" ? "bg-indigo-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
              >
                Todos
              </Button>
              <Button 
                onClick={() => setActiveTab("pending")}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${activeTab === "pending" ? "bg-yellow-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
              >
                <Clock size={14} className="mr-2" />
                Pendentes
              </Button>
              <Button 
                onClick={() => setActiveTab("approved")}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${activeTab === "approved" ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
              >
                <CheckCircle size={14} className="mr-2" />
                Aprovados
              </Button>
              <Button 
                onClick={() => setActiveTab("rejected")}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${activeTab === "rejected" ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
              >
                <XCircle size={14} className="mr-2" />
                Rejeitados
              </Button>
            </div>
          )}


          {filteredData.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center py-16 bg-gray-800 rounded-xl shadow-md"
            >
              <div className="flex flex-col items-center text-center px-4">
                <FileText className="w-20 h-20 text-gray-500 mb-6" />
                <h3 className="text-2xl font-semibold text-gray-300 mb-3">
                  Nenhuma especialidade encontrada
                </h3>
                <p className="text-gray-400 max-w-md">
                  {search ? 
                    "Nenhum resultado para sua busca. Tente outro termo ou filtro." : 
                    "Não há especialidades associadas ainda. Clique em 'Associar Especialidade' para começar."}
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredData.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ delay: index * 0.05 }}
                    className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:border-indigo-500 transition-all duration-300"
                  >
                    {/* Card Header With Image Background */}
                    <div 
                      className="h-24 bg-gradient-to-r from-indigo-800 to-purple-700 relative"
                      style={item.specialtyInfo?.imageUrl ? {
                        backgroundImage: `linear-gradient(rgba(49, 46, 129, 0.7), rgba(67, 56, 202, 0.7)), url(${item.specialtyInfo.imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      } : {}}
                    >
                      <div className="absolute inset-0 flex items-center justify-between px-4">
                        <div className="flex items-center">
                          <div className="h-16 w-16 rounded-full border-2 border-white bg-gray-900 flex items-center justify-center overflow-hidden">
                            {item.specialtyUser?.photoUrl ? (
                              <img 
                                src={item.specialtyUser.photoUrl} 
                                alt={item.specialtyUser.name} 
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Users className="h-8 w-8 text-gray-400" />
                            )}
                          </div>
                          <div className="ml-3">
                            <h3 className="text-lg font-semibold text-white truncate max-w-[160px]">
                              {item.specialtyUser?.name || "Usuário"}
                            </h3>
                            <div className="flex items-center">
                              <Badge 
                                  color="primary" 
                                  //className="mt-1 text-xs"
                                >
                                {item.specialtyInfo?.category || "Categoria"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div>
                          {getStatusBadge(item.approvalStatus)}
                        </div>
                      </div>
                      
                      {/* Progress bar for approval */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                          style={{ width: `${getApprovalProgress(item)}%` }}
                        ></div>
                      </div>
                    </div>
                  
                    <div className="p-4">
                      {/* Specialty Name */}
                      <div className="mb-4">
                        <h4 className="text-md font-medium text-gray-300">
                          <span className="text-xs text-gray-500">Especialidade: </span>
                          {item.specialtyInfo?.name || "Especialidade não especificada"}
                        </h4>
                        <p className="text-xs text-gray-500">
                          Registrado em: {formatDate(item.createdAt)}
                        </p>
                      </div>
                      
                      {/* Status Badges */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.isQuizApproved ? (
                          <Badge color="success" startIcon={<CheckCircle size={14} />}>Quiz Aprovado</Badge>
                        ) : (
                          <Badge color="warning" startIcon={<Clock size={14} />}>Quiz Pendente</Badge>
                        )}
                       
                        {item.report.length > 0 ? (
                          <Badge color="success" startIcon={<FileText size={14} />}>Relatório Enviado</Badge>
                        ) : (
                          <Badge color="warning" startIcon={<FileText size={14} />}>Relatório Pendente</Badge>
                        )}
                      </div>
                     
                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2">
                        {canSubmitReport(item) && (
                          <Button
                            //variant="success"
                            onClick={() => onReportSend(item)}
                            className="text-xs px-3 py-2 flex-1"
                          >
                            <FileText size={14} className="mr-1" />
                            Enviar Relatório
                          </Button>
                        )}
                       
                        {canApprove(item) && (
                          <Button
                            variant="primary"
                            onClick={() => onApprove(item)}
                            className="text-xs px-3 py-2 flex-1"
                          >
                            <CheckCircle size={14} className="mr-1" />
                            Avaliar
                          </Button>
                        )}
                       
                        {userLogged?.user.user.role === "admin" &&
                          <Button
                            variant="outline"
                            onClick={() => onRemove(item)}
                            className="text-xs px-3 py-2 flex items-center justify-center ml-auto"
                          >
                            <XCircle size={14} className="mr-1" />
                            Remover
                          </Button>
                        }
                        
                      </div>


                      {/* See more/less button */}
                      <button
                        onClick={() => handleToggleExpand(item.id)}
                        className="w-full mt-4 flex items-center justify-center text-gray-400 hover:text-white text-sm py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
                      >
                        {expandedItems.includes(item.id) ? (
                          <>
                            <ChevronUp className="w-4 h-4 mr-1" />
                            Ocultar Detalhes
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4 mr-1" />
                            Ver Detalhes
                          </>
                        )}
                      </button>


                      {/* Expanded Details */}
                      <AnimatePresence>
                        {expandedItems.includes(item.id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden mt-4"
                          >
                            <div className="space-y-4 pt-2 border-t border-gray-700">
                              {/* Approval Status */}
                              <div className="bg-gray-700 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-white mb-3">Fluxo de Aprovação:</h4>
                                <div className="space-y-3">
                                  <div className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${item.counselorApproval ? 'bg-green-500' : 'bg-gray-600'}`}>
                                      <UserCheck size={16} className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex justify-between">
                                        <span className="text-sm font-medium text-white">Conselheiro</span>
                                        <span className={`text-xs ${item.counselorApproval ? 'text-green-400' : 'text-gray-400'}`}>
                                          {item.counselorApproval ? 'Aprovado' : 'Pendente'}
                                        </span>
                                      </div>
                                      {item.counselorApprovalAt && (
                                        <span className="text-xs text-gray-400">
                                          {formatDate(item.counselorApprovalAt)}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="h-4 w-0.5 bg-gray-600 ml-4"></div>
                                  
                                  <div className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${item.leadApproval ? 'bg-green-500' : 'bg-gray-600'}`}>
                                      <Users size={16} className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex justify-between">
                                        <span className="text-sm font-medium text-white">Líder</span>
                                        <span className={`text-xs ${item.leadApproval ? 'text-green-400' : 'text-gray-400'}`}>
                                          {item.leadApproval ? 'Aprovado' : 'Pendente'}
                                        </span>
                                      </div>
                                      {item.leadApprovalAt && (
                                        <span className="text-xs text-gray-400">
                                          {formatDate(item.leadApprovalAt)}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="h-4 w-0.5 bg-gray-600 ml-4"></div>
                                  
                                  <div className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${item.directorApproval ? 'bg-green-500' : 'bg-gray-600'}`}>
                                      <Award size={16} className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex justify-between">
                                        <span className="text-sm font-medium text-white">Diretor</span>
                                        <span className={`text-xs ${item.directorApproval ? 'text-green-400' : 'text-gray-400'}`}>
                                          {item.directorApproval ? 'Aprovado' : 'Pendente'}
                                        </span>
                                      </div>
                                      {item.directorApprovalAt && (
                                        <span className="text-xs text-gray-400">
                                          {formatDate(item.directorApprovalAt)}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Reports */}
                              {item.report.length > 0 && (
                                <div className="bg-gray-700 rounded-lg p-4">
                                  <h4 className="text-sm font-medium text-white mb-3">
                                    <FileText size={16} className="inline mr-2" />
                                    Relatórios Enviados:
                                  </h4>
                                  <div className="space-y-3">
                                    {item.report.map((reportItem, i) => (
                                      <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="bg-gray-800 p-3 rounded-lg border-l-3 border-blue-500"
                                      >
                                        <p className="text-sm text-gray-300">{reportItem[0] || "Relatório enviado"}</p>
                                        <p className="text-xs text-gray-500 mt-2">
                                          {reportItem[1] ? formatDate(reportItem[1]) : 'Data não disponível'}
                                        </p>
                                      </motion.div>
                                    ))}
                                  </div>
                                </div>
                              )}


                              {/* Approval Comments */}
                              {item.approvalComments.length > 0 && (
                                <div className="bg-gray-700 rounded-lg p-4">
                                  <h4 className="text-sm font-medium text-white mb-3">
                                    <CheckCircle size={16} className="inline mr-2" />
                                    Comentários de Aprovação:
                                  </h4>
                                  <div className="space-y-3">
                                    {item.approvalComments.map((comment, i) => (
                                      <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="bg-gray-800 p-3 rounded-lg border-l-3 border-green-500"
                                      >
                                        <p className="text-sm text-gray-300">{comment[0]}</p>
                                        <div className="flex justify-between items-center mt-2">
                                          <p className="text-xs text-gray-500">
                                            {comment[1] ? formatDate(comment[1]) : 'Data não disponível'}
                                          </p>
                                          <p className="text-xs text-green-400">
                                            {comment[2]}
                                          </p>
                                        </div>
                                      </motion.div>
                                    ))}
                                  </div>
                                </div>
                              )}


                              {/* Rejection Comments */}
                              {item.rejectionComments.length > 0 && (
                                <div className="bg-gray-700 rounded-lg p-4">
                                  <h4 className="text-sm font-medium text-white mb-3">
                                    <XCircle size={16} className="inline mr-2" />
                                    Comentários de Rejeição:
                                  </h4>
                                  <div className="space-y-3">
                                    {item.rejectionComments.map((comment, i) => (
                                      <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="bg-gray-800 p-3 rounded-lg border-l-3 border-red-500"
                                      >
                                        <p className="text-sm text-gray-300">{comment[0]}</p>
                                        <div className="flex justify-between items-center mt-2">
                                          <p className="text-xs text-gray-500">
                                            {comment[1] ? formatDate(comment[1]) : 'Data não disponível'}
                                          </p>
                                          <p className="text-xs text-red-400">
                                            {comment[2]}
                                          </p>
                                        </div>
                                      </motion.div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
