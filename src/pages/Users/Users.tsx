import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { useEffect, useState } from "react";
import { userService } from "../../services/userService";
import { Eye, Search, UserRound } from "lucide-react";
import Badge from "../../components/ui/badge/Badge";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";


interface IUser {
  id: string;
  birthDate: string;
  email: string;
  name: string;
  photoUrl: string;
  role: string;
  status: string;
}



const calculateAge = (birthDate: string) => {
  // Divide a string no formato DD/MM/YYYY
  const [day, month, year] = birthDate.split('/').map(Number);

  // Cria um objeto Date com os valores extraídos
  const birth = new Date(year, month - 1, day); // mês começa do zero (0 = janeiro)
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}



// Função para formatar data brasileira (DD/MM/YYYY)
// const formatBrazilianDate = (dateString: string) => {
//   const date = new Date(dateString);
//   return date.toLocaleDateString('pt-BR');
// };


// Traduzir status para português
const translateStatus = (status: string) => {
  switch(status) {
    case 'approved': return 'Aprovado';
    case 'pending': return 'Pendente';
    case 'rejected': return 'Rejeitado';
    default: return status;
  }
};


// Traduzir função/cargo para português
const translateRole = (role: string) => {
  switch(role) {
    case 'admin': return 'Administrador';
    case 'director': return 'Diretor';
    case 'dbv': return 'Desbravador';
    case 'lead': return 'Líder';
    case 'secretary': return 'Liderança';
    case 'counselor': return 'Conselheiro';
    default: return role;
  }
};


export default function Users() {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  

  const { userRole } = useAuth(); 
    const navigate = useNavigate();


  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
      applyFilters(data, searchTerm, statusFilter);
    } catch (error: any) {
     toast.error(`Error: ${error.message}`, {
          position: 'bottom-right',
          icon: '🚫',
          className: 'dark:bg-gray-800 dark:text-white',
          duration: 5000,
        });
    } finally {
      setIsLoading(false);
    }
  };


  // Função para aplicar filtros (busca e status)
  const applyFilters = (userList: IUser[], search: string, status: string | null) => {
    let result = [...userList];
    
    // Aplicar filtro de pesquisa
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(user => 
        user.name.toLowerCase().includes(searchLower) || 
        user.email.toLowerCase().includes(searchLower)
      );
    }
    
    // Aplicar filtro de status
    if (status) {
      result = result.filter(user => user.status === status);
    }
    
    // Filtrar por permissão de visualização baseado no papel do usuário
    result = result.filter(user => {
      if (user.status === 'approved') return true;
      if (userRole === 'admin' || userRole === 'director') return true;
      return false;
    });
    
    setFilteredUsers(result);
  };


  const handleUserClick = (userId: string) => {
    navigate(`/profile-user/${userId}`); 
  };


  useEffect(() => {
    fetchUsers();
  }, []);


  useEffect(() => {
    applyFilters(users, searchTerm, statusFilter);
  }, [searchTerm, statusFilter]);


  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter(null);
    applyFilters(users, "", null);
  };


  // Função para retornar a cor do card baseada no status
  const getCardBorderColor = (status: string) => {
    switch(status) {
      case 'approved': return 'border-green-100 dark:border-green-900/30';
      case 'pending': return 'border-yellow-100 dark:border-yellow-900/30';
      case 'rejected': return 'border-red-100 dark:border-red-900/30';
      default: return 'border-gray-200 dark:border-white/[0.05]';
    }
  };


  // Determinar quais status podem ser exibidos com base no papel do usuário
  const statusOptions = [
    { value: 'approved', label: 'Aprovados' },
    ...(userRole === 'admin' || userRole === 'director' 
      ? [
          { value: 'pending', label: 'Pendentes' },
          { value: 'rejected', label: 'Rejeitados' }
        ] 
      : [])
  ];


  return (
    <>
      <PageMeta
        title="Membros do clube de desbravadores"
        description="Lista com todos os membros do clube de desbravadores"
      />
      <PageBreadcrumb pageTitle="Membros" />
      
      <ComponentCard title="Membros do clube">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Barra de pesquisa */}
          <div className="relative flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          
          {/* Filtros nativos */}
          { (userRole === "admin" || userRole === "director") && (
            <div className="flex flex-wrap gap-2">
              <select
                value={statusFilter || ""}
                onChange={(e) => setStatusFilter(e.target.value || null)}
                className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="">Todos os status</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              {(searchTerm || statusFilter) && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          )}
          
          
        </div>


        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => handleUserClick(user.id)}
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
                        {translateRole(user.role)}
                      </p>
                      {
                        (userRole === "admin" || userRole === "director" || userRole === "lead") &&
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </p>
                      }
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>{user.birthDate}</span>
                        <span>{calculateAge(user.birthDate)} anos</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700/30 px-4 py-2 text-right">
                  <button 
                    className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-700 text-sm font-medium"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Ver perfil</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <UserRound className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Nenhum membro encontrado</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm || statusFilter 
                ? "Tente ajustar seus filtros de busca." 
                : "Nenhum membro cadastrado no sistema."}
            </p>
            {(searchTerm || statusFilter) && (
              <button 
                onClick={clearFilters} 
                className="mt-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Limpar filtros
              </button>
            )}
          </div>
        )}
      </ComponentCard>
    </>
  );
}
