import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { useEffect, useState } from "react";
import { userService } from "../../services/userService";
import { UserRound, VerifiedIcon } from "lucide-react";
import Badge from "../../components/ui/badge/Badge";
import { useAuth } from "../../context/AuthContext";
import ApproveUserModal from "../../components/UserModais/ApproveUserModal";
import toast from "react-hot-toast";

interface IUser {
  id: string;
  birthDate: string;
  email: string;
  name: string;
  photoUrl: string;
  role: string;
  status: string;
  isActive: boolean;
  isVerified: boolean;
}

// Traduzir status para português
const translateStatus = (status: string) => {
  switch(status) {
    case 'approved': return 'Aprovado';
    case 'pending': return 'Pendente';
    case 'rejected': return 'Rejeitado';
    default: return status;
  }
};


export default function UsersPending() {
  const [isLoading, setIsLoading] = useState(false);
  const [usersPending, setUsersPending] = useState<IUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const { findUnits } = useAuth(); 
  
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await userService.usersPending();
      setUsersPending(data);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserApproved = () => {
    fetchUsers(); // Atualiza a lista removendo o usuário aprovado
    findUnits();
  };


  useEffect(() => {
    fetchUsers();
  }, []);

  // Função para retornar a cor do card baseada no status
  const getCardBorderColor = (status: string) => {
    switch(status) {
      case 'approved': return 'border-green-100 dark:border-green-900/30';
      case 'pending': return 'border-yellow-100 dark:border-yellow-900/30';
      case 'rejected': return 'border-red-100 dark:border-red-900/30';
      default: return 'border-gray-200 dark:border-white/[0.05]';
    }
  };

  return (
    <>
      <PageMeta
        title="Membros pendentes de aprovação"
        description="Membros pendentes de aprovação"
      />
      <PageBreadcrumb pageTitle="Membros Pendentes" />
      
      <ComponentCard title="Membros Pendentes de aprovação">
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : usersPending.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {usersPending.map((user) => (
              <div
                key={user.id}
                onClick={() => {
                  if(user.isVerified){
                    setSelectedUser(user)
                  }else {
                    toast.error('O usuário precisa fazer a verificação da conta', { position: 'bottom-right' })
                  }
                }}
                className={`bg-white dark:bg-gray-800/50 border-2 ${getCardBorderColor(user.status)} rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer`}
              >
                <div className="p-4 flex items-start gap-4">
                  {/* Avatar do usuário */}
                  <div className="flex-shrink-0">
                    {user.photoUrl ? (
                      <img
                        src={user.photoUrl}
                        alt={user.name}
                        className="h-16 w-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <UserRound className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Informações do usuário */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {user.name}
                      </h3>
                      <Badge
                        size="sm"
                        color={
                          user.status === "approved"
                            ? "success"
                            : user.status === "pending"
                            ? "warning"
                            : "error"
                        }
                      >
                        {translateStatus(user.status)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user.role}
                      </p>  
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700/30 px-4 py-2 flex items-center justify-between">
                  <Badge size="sm" color={user.isVerified ? 'success' : 'error'}>
                    {user.isVerified ? "Conta verificada" : "Conta não verificada"}
                  </Badge>
                  <button 
                    className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-700 text-sm font-medium"
                  >
                    <VerifiedIcon className="h-4 w-4" color={user.isVerified ? 'blue' : 'red'} />
                    {
                      user.isVerified 
                      ?
                        <span>Aprovar</span>  
                      :
                        <span className="text-red-500 hover:text-red-700 text-sm">Não pode</span>
                    }
                    
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <UserRound className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Nenhum membro encontrado</h3>
          </div>
        )}
      </ComponentCard>
      
      {/* Modal de Aprovação */}
      {selectedUser && (
        <ApproveUserModal
          isOpen={!!selectedUser}
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onApproved={handleUserApproved}
        />
      )}
    </>
  );
}

