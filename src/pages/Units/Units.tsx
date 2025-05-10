import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";

import TableUnits from "../../components/tables/BasicTables/TableUnits";

import Button from "../../components/ui/button/Button";
import { PlusIcon } from "../../icons";
import { useEffect, useState } from "react";
import CreateUnitModal from "../../components/UnitModais/CreateUnitModal";
import toast from "react-hot-toast";
import { uploadImage } from "../../services/uploadService";
import { unitsService } from "../../services/unitsService";
import { useAuth } from "../../context/AuthContext";

export default function Units() {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [role, setRole] = useState<string | undefined>('');

  const { findUnits, userRole } = useAuth();

  useEffect(() => {
    setRole(userRole)
  }, [userRole]);

  const handleCreateUnit = async (unitData: { nameUnit: string; compressedFile: File | null }) => {
    try {
      if (!unitData.nameUnit) {
        toast.error("Nome da unidade obrigatória", {position: 'bottom-right'});
        return;
      }
      setIsLoading(true);
  
      let uploadedImageUrl
      if (unitData.compressedFile) {
        uploadedImageUrl = await uploadImage(unitData.compressedFile); // 🔥 Faz o upload agora!
      } 

      const payload = {
        name: unitData.nameUnit,
        photoUrl: uploadedImageUrl, // Usa a URL do Cloudinary
      };
  
      await unitsService.createUnit(payload); // 🔥 Chama a API e autentica automaticamente
  
      toast.success("Unidade criada com sucesso!!", {position: 'bottom-right'});
      await findUnits()
      setIsOpenModal(false)
    } catch (error) {
      toast.error(`Erro: ${error}`, {position: 'bottom-right'});
    } finally {
      setIsOpenModal(false)
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Unidades do clube"
        description="Todas as unidades do clube para gerenciamento"
      />
      <PageBreadcrumb pageTitle="Unidades" />
      <div className="space-y-6">
        <ComponentCard title="Lista de Unidades">
          <div className="flex justify-end mb-3">
            {(role === "admin" || role === "director") && (
              <Button  
              size="sm" 
              variant="primary" 
              startIcon={<PlusIcon />}
              onClick={() => setIsOpenModal(true)}
            >
              {isLoading && "Criando unidade..."}
            </Button>
            )}  
          </div>

          <TableUnits />

        </ComponentCard>

        {isOpenModal && (
          <CreateUnitModal
            isOpen={isOpenModal}
            loading={isLoading}
            onClose={() => setIsOpenModal(false)}
            onSave={handleCreateUnit}
          />
        )}

      </div>
    </>
  );
}
