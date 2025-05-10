import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";

//import TableUnits from "../../components/tables/BasicTables/TableUnits";

//import Button from "../../components/ui/button/Button";
//import { PlusIcon } from "../../icons";
import { useEffect, useState } from "react";
//import toast from "react-hot-toast";
//import { uploadImage } from "../../services/uploadService";
//import { useAuth } from "../../context/AuthContext";
//import CardSpecialty from "../../components/ui/Card/CardSpecialty";
import CreateSpecialtyModal from "../../components/SpecialtyModais/createSpecialtyModal";
//import { specialtyService } from "../../services/specialtyService";
import { userService } from "../../services/userService";
import UserTable from "../../components/ui/table/usersTable";


export default function Users() {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState<any[]>([]);
  
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);
    
  return (
    <>
      <PageMeta
        title="Membros do clube de desbravadores"
        description="Lista com com todos os membros do clube de desbravadores"
      />
      <PageBreadcrumb pageTitle="Membros" />
      <div className="space-y-6">
        <ComponentCard title="Membros do clube">
          <div className="flex justify-end mb-3">
            {/* <Button  
              size="sm" 
              variant="primary" 
              startIcon={<PlusIcon />}
              onClick={() => setIsOpenModal(true)}
            >
              {isLoading ? "Criando..." : "Criar Especialidade"}
            </Button> */}
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
            <div className="max-w-full overflow-x-auto">
              {users.length > 0 ? (
                  <UserTable
                    users={users} 
                    //onEdit={(clas) => console.log("Editar", clas)} 
                    //onDelete={(id) => console.log("Excluir", id)} 
                    //onViewRequirements={(id) => console.log("Ver requisitos", id)}
                  />
              ) : (
                <p className="text-center text-gray-500">Nenhum membro cadastrado no sistema</p>
              )}
            </div>
          </div>
          
        
        </ComponentCard>

        {isOpenModal && (
          <CreateSpecialtyModal
            isOpen={isOpenModal}
            loading={isLoading}
            onClose={() => setIsOpenModal(false)}
            onSave={() => {}}
          />
        )}

      </div>
    </>
  );
}
