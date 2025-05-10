import React, { useState } from "react";
//import toast from "react-hot-toast";
//import imageCompression from "browser-image-compression";

import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
//import Input from "../form/input/InputField"; 
//import { PencilIcon } from "../../icons";
//import Label from "../form/Label";

//import specialtyDefault from '../../assets/specialtyDefault.jpg';
//import Select from "../form/Select";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (specialtyData: any) => void;
  loading: boolean;
}

const CreateSpecialtyModal: React.FC<Props> = ({ isOpen, loading, onClose, onSave }) => {
  //const [
    //photoUrl, 
    //setPhotoUrl] = useState(specialtyDefault);
  const [
    nameSpecialty, 
    //setNameSpecialty
  ] = useState('');
  const [category, 
    //setCategory
  ] = useState('');
  const [codigo, 
    //setCodigo
  ] = useState('');
  const [numero, 
    //setNumero
  ] = useState('');
  const [level, 
    
    //setLevel
    ] = useState('');
  const [year, 
    //setYear
  ] = useState('');
  const [compressedFile, 
    //setCompressedFile
  ] = useState<File | null>(null); 

  // const options = [
  //   { value: "manuais", label: "manuais" },
  //   { value: "agricolas", label: "agricolas" },
  //   { value: "missionarias", label: "missionarias" },
  //   { value: "profissionais", label: "profissionais" },
  //   { value: "recreativas", label: "recreativas" },
  //   { value: "saude", label: "saude" },
  //   { value: "natureza", label: "natureza" },
  //   { value: "domesticas", label: "domesticas" },
  //   { value: "adra", label: "adra" },
  //   { value: "mestrado", label: "mestrado" },

  // ];

  const handleSave = () => {
    const data = { nameSpecialty, category, compressedFile, codigo, numero, level, year };
    onSave(data);
    onClose();
  };

  // const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     try {
  //       const options = {
  //         maxSizeMB: 0.1,
  //         maxWidthOrHeight: 200,
  //         useWebWorker: true,
  //       };

  //       const compressed = await imageCompression(file, options);
  //       setCompressedFile(compressed); // Apenas armazena a imagem comprimida

  //       const previewUrl = URL.createObjectURL(compressed); // 🔥 Cria uma URL temporária
  //       setPhotoUrl(previewUrl); // Atualiza o preview

  //       toast.success("Imagem processada com sucesso!", {position: 'bottom-right'});
  //     } catch (error) {
  //       toast.error(`Erro ao processar a imagem. ${error}`, {position: 'bottom-right'});
  //     }
  //   }
  // };
  
  // const handleSelectChange = (value: string) => {
  //   setCategory(value)
  // };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Criar Especialidade
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Crie uma nova especialidade
          </p>
        </div>

        {/* Nome da especialidade */}
        <form className="flex flex-col">
          <div className="custom-scrollbar h-[500px] overflow-y-auto px-2 pb-3">
            
            

          

          </div>
        </form>

        {/* Botões */}
        <div className="flex justify-end gap-3">
          <Button size="sm" variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button size="sm" onClick={handleSave}>
            {loading ? "Criando especialidade..." : "Criar especialidade"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateSpecialtyModal;
