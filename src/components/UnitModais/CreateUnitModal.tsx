import React, { useState } from "react";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";

import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField"; 
//import { Unit } from "../../dtos/UnitDTO";

import unitDefault from '../../assets/unitDefault.png';
import { PencilIcon } from "../../icons";
import Label from "../form/Label";


interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (unitData: any) => void;
  loading: boolean
}

const CreateUnitModal: React.FC<Props> = ({ isOpen, loading, onClose, onSave }) => {
  const [photoUrl, setPhotoUrl] = useState(unitDefault);
  const [nameUnit, setNameUnit] = useState('');
  const [compressedFile, setCompressedFile] = useState<File | null>(null); 

  const handleSave = () => {
    const unitData = { nameUnit, compressedFile };
    onSave(unitData);
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log(file)
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

      } catch(error) {
        toast.error(`Erro ao processar a imagem. ${error}`, {position: 'bottom-right'});
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[500px] m-4">
      <div className="no-scrollbar relative w-full max-w-[500px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Criar Unidade
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Crie uma nova unidade
          </p>
        </div>

        {/* Nome da unidade */}
        <form className="flex flex-col">
          <div className="custom-scrollbar h-[300px] overflow-y-auto px-2 pb-3">
              
            {/* Foto da unidade */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                {/* Imagem de perfil */}
                <img 
                  src={photoUrl || unitDefault} 
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Clique no ícone para alterar</p>
            </div>

            <div>
              <Label>Nome da Unidade</Label>
              <Input
                type="text"
                onChange={(e) => setNameUnit(e.target.value)}
                placeholder="Nome da unidade"
              />
            </div>
          </div>
        </form>
        {/* Botões */}
        <div className="flex justify-end gap-3">
          <Button size="sm" variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button size="sm" onClick={handleSave}>
            {loading ? "Criando unidade..." : "Criar unidade"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateUnitModal;
