import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";

import Button from "../../components/ui/button/Button";
import { PlusIcon } from "../../icons";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { uploadImage } from "../../services/uploadService";
import { useAuth } from "../../context/AuthContext";
import { classService } from "../../services/classService";
import CreateClassModal from "../../components/ClassModais/createClassModal";
import ClassGrid from "./ClassGrid";


export default function Class() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [classData, setClassData] = useState<any[]>([]);

  const { findClass, classe, userRole } = useAuth();

  useEffect(() => {
    // Atualizar classData apenas se a variável classe mudar
    if (classe && classe.length > 0) {
      setClassData(classe);
    }
  }, [classe]);

  const handleCreateClass = async (data: { 
    nameClass: string; 
    typeClass: string; 
    compressedFile?: File; 
    minAge: number; 
  }) => {
    try {
      if (!data.nameClass) {
        toast.error("Nome da classe é obrigatório", {position: 'bottom-right'});
        return;
      }
      if (!data.typeClass) {
        toast.error("Tipo de classe é obrigatório", {position: 'bottom-right'});
        return;
      }
      if (!data.compressedFile) {
        toast.error("Emblema de classe é obrigatório", {position: 'bottom-right'});
        return;
      }
      if (!data.minAge) {
        toast.error("Idade de classe é obrigatório", {position: 'bottom-right'});
        return;
      }

      setIsLoading(true);

      let uploadedImageUrl = "";
      if (data.compressedFile) {
        uploadedImageUrl = await uploadImage(data.compressedFile);
      } 

      const payload = {
        name: data.nameClass,
        type: data.typeClass,
        emblem: uploadedImageUrl,
        minAge: Number(data.minAge),
      };

      await classService.createClass(payload);
      toast.success('Classe criada com sucesso!', {
        position: 'bottom-right',
      });
      await findClass();  // Certifique-se de que findClass está trazendo os dados atualizados
      setIsOpenModal(false);
    } catch (error) {
      toast.error(`Erro: ${error}`, {
        position: 'bottom-right',
      });
    } finally {
      setIsOpenModal(false);
      setIsLoading(false);
    }
  };

  const handleDeleteClass = async (classId: string) => {
    try {
      await classService.deleteClass(classId)
      toast.success('Classe deletada com sucesso!', {
        position: 'bottom-right',
      });
      await findClass();  
    } catch (error) {
      toast.error(`Erro ao deletar: ${error}`, {
        position: 'bottom-right',
      });
    } 
  };

  
  const handleEditClass = async (data: { 
      id: string;
      name?: string; 
      type?: string; 
      minAge?: number; 
      maxAge?: number;
      emblem?: File | null;
    }) => {

      try {
        setIsLoading(true);

      let uploadedImageUrl = data.emblem;
      if (data.emblem) {
        uploadedImageUrl = await uploadImage(data.emblem);
      } 

      const payload: any = {};
      if (data.name) payload.name = data.name;
      if (data.type) payload.type = data.type;
      if (uploadedImageUrl) payload.emblem = uploadedImageUrl;
      if (data.minAge) payload.minAge = Number(data.minAge);

    
      await classService.updateClass(data.id, payload);
        toast.success('Classe editada com sucesso!', {
        position: 'bottom-right',
      });
      await findClass();
    } catch (error) {
      toast.error(`Erro: ${error}`, {
        position: 'bottom-right',
      });
    }
  };


  return (
    <>
      <PageMeta
        title="Classes do clube de desbravadores"
        description="Registro de todas as classes do clube de desbravadores"
      />
      <PageBreadcrumb pageTitle="Classes" />
      <div className="space-y-6">
        <ComponentCard title="Classes">
          <div className="flex justify-end mb-3">

            {( userRole === "admin" || userRole === "director" || userRole === "lead") &&( 
                <Button  
                size="sm" 
                variant="primary" 
                startIcon={<PlusIcon />}
                onClick={() => setIsOpenModal(true)}
              >
                {isLoading ? "Criando..." : "Criar Classe"}
              </Button>
            )}
            
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
            <div className="max-w-full overflow-x-auto">
              {classData.length > 0 ? (
                  <ClassGrid
                    classes={classData} 
                    onEdit={(clas) => handleEditClass(clas)} 
                    onDelete={(id) => handleDeleteClass(id)} 
                    onViewRequirements={(id) => console.log("Ver requisitos", id)}
                  />
              ) : (
                <p className="text-center text-gray-500">Nenhuma classe cadastrada.</p>
              )}
            </div>
          </div>
        </ComponentCard>

        {isOpenModal && (
          <CreateClassModal
            isOpen={isOpenModal}
            loading={isLoading}
            onClose={() => setIsOpenModal(false)}
            onSave={handleCreateClass}
          />
        )}
      </div>
    </>
  );
}
