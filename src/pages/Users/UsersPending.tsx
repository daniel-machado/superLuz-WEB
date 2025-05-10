import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";

//import TableUnits from "../../components/tables/BasicTables/TableUnits";

//import Button from "../../components/ui/button/Button";
//import { PlusIcon } from "../../icons";
import { useEffect, useState } from "react";
//import toast from "react-hot-toast";
//import { uploadImage } from "../../services/uploadService";
import { useAuth } from "../../context/AuthContext";
//import CardSpecialty from "../../components/ui/Card/CardSpecialty";
//import CreateSpecialtyModal from "../../components/SpecialtyModais/createSpecialtyModal";
//import { specialtyService } from "../../services/specialtyService";
import { userService } from "../../services/userService";
//import UserTable from "../../components/ui/table/usersTable";
import UserPendingTable from "../../components/ui/table/usersPendingTable";
import ApproveUserModal from "../../components/UserModais/ApproveUserModal";


export default function UsersPending() {
  const [isLoading, setIsLoading] = useState(false);
  const [usersPending, setUsersPending] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  console.log("LOADING", isLoading);
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
    
  return (
    <>
      <PageMeta
        title="Membros do clube de desbravadores pendentes"
        description="Lista com com todos os membros do clube de desbravadores que estão pendentes"
      />
      <PageBreadcrumb pageTitle="Membros Pendentes" />
      <div className="space-y-6">
        <ComponentCard title="Membros do clube pendentes">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
          <div className="max-w-full overflow-x-auto">
              {usersPending.length > 0 ? (
                <UserPendingTable users={usersPending} onApprove={(user) => setSelectedUser(user)} />
              ) : (
                <p className="text-center text-gray-500">Nenhum membro pendente</p>
              )}
            </div>
          </div>
        </ComponentCard>
      </div>
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
