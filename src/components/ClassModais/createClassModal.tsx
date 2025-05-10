import React, { useState } from "react";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";

import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField"; 
import { PencilIcon } from "../../icons";
import Label from "../form/Label";

import specialtyDefault from '../../assets/specialtyDefault.jpg';
import Select from "../form/Select";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ClassData: any) => void;
  loading: boolean;
}

const CreateClassModal: React.FC<Props> = ({ isOpen, loading, onClose, onSave }) => {
  const [photoUrl, setPhotoUrl] = useState(specialtyDefault);
  const [nameClass, setNameClass] = useState('');
  const [typeClass, setTypeClass] = useState('');
  const [minAge, setMinAge] = useState('');
  const [compressedFile, setCompressedFile] = useState<File | null>(null); 

  const options = [
    { value: "regular", label: "Regular" },
    { value: "advanced", label: "Avançada" },
    { value: "leadership", label: "Liderança" },
  ];

  const handleSave = () => {
    const data = { nameClass, typeClass, minAge, compressedFile};
    onSave(data);
    onClose();
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const options = {
          maxSizeMB: 0.1,
          maxWidthOrHeight: 200,
          useWebWorker: true,
        };

        const compressed = await imageCompression(file, options);
        setCompressedFile(compressed); // Apenas armazena a imagem comprimida

        const previewUrl = URL.createObjectURL(compressed); // 🔥 Cria uma URL temporária
        setPhotoUrl(previewUrl); // Atualiza o preview

        toast.success("Imagem processada com sucesso!", {position: 'bottom-right'});
      } catch (error) {
        toast.error(`Erro ao processar a imagem. ${error}`, {position: 'bottom-right'});
      }
    }
  };
  
  const handleSelectChange = (value: string) => {
    setTypeClass(value)
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Criar Classe
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Crie uma nova Classe
          </p>
        </div>

        {/* Nome da especialidade */}
        <form className="flex flex-col">
          <div className="custom-scrollbar h-[500px] overflow-y-auto px-2 pb-3">
            
            {/* Foto da especialidade */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                {/* Imagem de perfil */}
                <img 
                  src={photoUrl || specialtyDefault} 
                  alt="Foto de perfil" 
                  className="object-cover w-full h-full pointer-events-none" 
                />
                
                {/* Ícone de edição */}
                <label 
                  className="absolute bottom-2 right-2 bg-gray-800 text-white p-1 rounded-full cursor-pointer hover:bg-gray-700 transition z-20 flex items-center justify-center"
                  htmlFor="photo-upload"
                >
                  <PencilIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                </label>

                {/* Input de arquivo escondido */}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handlePhotoUpload} 
                  id="photo-upload"
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-7">Clique no ícone para alterar</p>
            </div>

            {/* Nome da especialidade */}
            <div className="mb-5">
              <Label>Nome da Classe</Label>
              <Input
                type="text"
                onChange={(e) => setNameClass(e.target.value)}
                placeholder="Nome da classe"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 mb-5">
              <div>
                <Label>Código</Label>
                <Input
                  type="text"
                  onChange={(e) => setMinAge(e.target.value)}
                  placeholder="Idade"
                />
              </div>

              {/* Categoria da especialidade */}
              <div>
                <Label>Tipo</Label>
                <Select
                  options={options}
                  placeholder="Selecione a categoria"
                  onChange={handleSelectChange}
                  className="dark:bg-dark-900"
                />
              </div>

            </div>

          </div>
        </form>

        {/* Botões */}
        <div className="flex justify-end gap-3">
          <Button size="sm" variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button size="sm" onClick={handleSave}>
            {loading ? "Criando class..." : "Criar classe"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateClassModal;
