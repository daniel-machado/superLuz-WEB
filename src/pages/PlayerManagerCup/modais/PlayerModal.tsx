import { useState, useEffect, FormEvent } from 'react';
import imageCompression from "browser-image-compression";
import { toast } from "react-hot-toast";
import avatarDefault from '../../../assets/avatarDefault.png'
import { uploadImage } from '../../../services/uploadService';
import { PencilIcon } from 'lucide-react';

interface PlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (player: any) => void;
  player?: any | null;
  groups: any[];
}

const PlayerModal = ({ isOpen, onClose, onSubmit, player, groups }: PlayerModalProps) => {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [groupId, setGroupId] = useState<string | number | ''>('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (player) {
      setName(player.name || '');
      setBirthDate(player.birthDate || '');
      setGender(player.gender || '');
      setGroupId(player.groupId ?? '');
      setPhotoUrl(player.photo || '');
      setCompressedFile(null);
    } else {
      setName('');
      setBirthDate('');
      setGender('');
      setGroupId('');
      setPhotoUrl('');
      setCompressedFile(null);
    }
  }, [player, isOpen]);

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
        setCompressedFile(compressed);

        const previewUrl = URL.createObjectURL(compressed);
        setPhotoUrl(previewUrl);

        toast.success("Imagem processada com sucesso!", { position: 'bottom-right' });
      } catch (error: any) {
        toast.error(`Erro ao processar a imagem. ${error.message}`, {
          position: 'bottom-right',
          duration: 5000,
        });
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let uploadedImageUrl = photoUrl;

      // Se há uma nova imagem comprimida, faz o upload
      if (compressedFile) {
        uploadedImageUrl = await uploadImage(compressedFile);
        toast.success("Upload da foto concluído!", { position: 'bottom-right' });
      }

      const playerData = {
        name: name.trim(),
        birthDate: birthDate || undefined,
        gender: gender || undefined,
        groupId: groupId || undefined,
        photo: uploadedImageUrl || undefined,
      };

      await onSubmit(playerData);
    } catch (error: any) {
      toast.error(`Erro ao salvar jogador: ${error.message}`, {
        position: 'bottom-right',
        duration: 5000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 my-8">
        <h2 className="text-xl font-bold text-white mb-6">
          {player ? 'Editar Jogador' : 'Criar Jogador'}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Upload de Foto */}
          <div className="flex flex-col items-center gap-3 mb-6">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-600">
              <img
                src={photoUrl || avatarDefault}
                alt="Foto do jogador"
                className="object-cover w-full h-full pointer-events-none"
              />

              <label
                className="absolute bottom-2 right-2 bg-gray-900 text-white p-2 rounded-full cursor-pointer hover:bg-gray-700 transition z-20 flex items-center justify-center shadow-lg"
                htmlFor="player-photo-upload"
              >
                <PencilIcon className="fill-gray-300 size-4" />
              </label>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
                id="player-photo-upload"
              />
            </div>
            <p className="text-xs text-gray-400 text-center">
              Clique no ícone para alterar a foto
            </p>
          </div>

          {/* Nome */}
          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-2">
              Nome<span className="text-red-500">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o nome do jogador"
            />
          </div>

          {/* Data de Nascimento */}
          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-2">
              Data de Nascimento
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Gênero */}
          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-2">Gênero</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
            </select>
          </div>

          {/* Grupo */}
          <div className="mb-6">
            <label className="block text-sm text-gray-300 mb-2">Grupo</label>
            <select
              value={groupId as any}
              onChange={(e) => setGroupId(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Nenhum grupo</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 text-sm text-gray-300 hover:text-white transition disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Salvando...' : player ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlayerModal;