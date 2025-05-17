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
import AddDbvFromUnitModal from "../../components/UnitModais/AddDbvFromUnitModal";
import AddCounselorFromUnitModal from "../../components/UnitModais/AddCounselorFromUnitModal";

type Association = {
  userId: string;
  unitId: string;
};

export default function Units() {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [role, setRole] = useState<string | undefined>('');
  const [isOpenModalDbv, setIsOpenModalDbv] = useState(false)
  const [isOpenModalCounselor, setIsOpenModalCounselor] = useState(false)

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
    } catch (error: any) {
      toast.error(`Error: ${error.message}`, {
                position: 'bottom-right',
                icon: '🚫',
                className: 'dark:bg-gray-800 dark:text-white',
                duration: 5000,
              });
    } finally {
      setIsOpenModal(false)
      setIsLoading(false);
    }
  };

  
  const AdicionarCounselor = async (unitId: string, counselorId: string) => {
    try {
      setIsLoading(true);
      await unitsService.addCounselorFromUnit(unitId as string, counselorId);
      await findUnits();
      toast.success("Conselheiro adicionado na unidade", { position: 'bottom-right' });
    } catch (error: any) {
      toast.error(`Error: ${error.message}`, {
          position: 'bottom-right',
          icon: '🚫',
          className: 'dark:bg-gray-800 dark:text-white',
          duration: 5000,
        });
    } finally {
      setIsLoading(false);
      setIsOpenModalCounselor(false);
    }
  };

    const AdicionarDbv = async (unitId: string, dbvId: string) => {
    try {
      setIsLoading(true);
      await unitsService.addDbvFromUnit(unitId as string, dbvId);
      await findUnits();
      toast.success("Desbravador adicionado na unidade", { position: 'bottom-right' });
    } catch (error: any) {
     toast.error(`Error: ${error.message}`, {
          position: 'bottom-right',
          icon: '🚫',
          className: 'dark:bg-gray-800 dark:text-white',
          duration: 5000,
        });
    } finally {
      setIsLoading(false);
      setIsOpenModalDbv(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Unidades do clube | Luzeiros do Norte"
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
              className="mr-3"
            >
              {isLoading ? "Criando unidade..." : "Unit"}
            </Button>
            )}  
            {(role === "admin" || role === "director") && (
              <Button  
              size="sm" 
              variant="outline" 
              startIcon={<PlusIcon />}
              onClick={() => setIsOpenModalCounselor(true)}
              className="mr-3"
            >
              {isLoading ? "Adicionando" : "Conselheiro"}
            </Button>
            )}
            {(role === "admin" || role === "director") && (
              <Button  
              size="sm" 
              variant="outline" 
              startIcon={<PlusIcon />}
              onClick={() => setIsOpenModalDbv(true)}
              className="mr-3"
            >
              {isLoading ? "Adicionando" : "Dbv"}
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

        {isOpenModalDbv && (
          <AddDbvFromUnitModal
            isOpen={isOpenModalDbv}
            loading={isLoading}
            onClose={() => setIsOpenModalDbv(false)}
            onSave={(unitData: Association) => AdicionarDbv(unitData.unitId, unitData.userId)}
          />
        )}

        {isOpenModalCounselor && (
          <AddCounselorFromUnitModal
            isOpen={isOpenModalCounselor}
            loading={isLoading}
            onClose={() => setIsOpenModalCounselor(false)}
            onSave={(unitData: Association) => AdicionarCounselor(unitData.unitId, unitData.userId)}
          />
        )}

      </div>
    </>
  );
}
