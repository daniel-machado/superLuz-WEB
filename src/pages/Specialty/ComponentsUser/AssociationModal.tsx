import { useState } from "react";
import { motion,  } from "framer-motion";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/form/input/InputField";


type SpecialtyInfo = {
  id: string;
  name: string;
  description?: string;
  category?: string;
  imageUrl?: string;
};


type UserInfo = {
  id: string;
  name: string;
  role: string;
};

export type SpecialtyAssociation = {
  userId: string;
  specialtyId: string;
};

interface AssociationModalProps {
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (assoc: SpecialtyAssociation) => void; 
  users: UserInfo[]; 
  specialties: SpecialtyInfo[]; 
}


export default function AssociationModal({ 
  //isOpen, 
  onClose, 
  onSave, 
  users = [], 
  specialties = [] 
}: AssociationModalProps) {
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [searchSpecialty, setSearchSpecialty] = useState("");
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchUser.toLowerCase())
  );
  
  const filteredSpecialties = specialties.filter(specialty => 
    specialty.name.toLowerCase().includes(searchSpecialty.toLowerCase())
  );
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser && selectedSpecialty) {
      onSave({
        userId: selectedUser,
        specialtyId: selectedSpecialty
      });
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800 rounded-xl p-6 w-full max-w-md"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Associar Especialidade</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Desbravador
            </label>
            <div className="relative">
              <Input
                placeholder="Buscar desbravador..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="mb-2"
              />
              <div className="max-h-40 overflow-y-auto bg-gray-700 rounded-md">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <div
                      key={user.id}
                      onClick={() => setSelectedUser(user.id)}
                      className={`p-2 cursor-pointer hover:bg-gray-600 ${
                        selectedUser === user.id ? 'bg-indigo-600' : ''
                      }`}
                    >
                      {user.name}
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-gray-400">
                    Nenhum desbravador encontrado
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Especialidade
            </label>
            <div className="relative">
              <Input
                placeholder="Buscar especialidade..."
                value={searchSpecialty}
                onChange={(e) => setSearchSpecialty(e.target.value)}
                className="mb-2"
              />
              <div className="max-h-40 overflow-y-auto bg-gray-700 rounded-md">
                {filteredSpecialties.length > 0 ? (
                  filteredSpecialties.map(specialty => (
                    <div
                      key={specialty.id}
                      onClick={() => setSelectedSpecialty(specialty.id)}
                      className={`p-2 cursor-pointer hover:bg-gray-600 ${
                        selectedSpecialty === specialty.id ? 'bg-indigo-600' : ''
                      }`}
                    >
                      <div className="flex items-center">
                        {specialty.imageUrl && (
                          <img 
                            src={specialty.imageUrl} 
                            alt={specialty.name} 
                            className="w-8 h-8 mr-2 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <div>{specialty.name}</div>
                          {specialty.category && (
                            <div className="text-xs text-gray-400">{specialty.category}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-gray-400">
                    Nenhuma especialidade encontrada
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button 
            //  variant="secondary" 
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              //type="submit"
              variant="primary"
              disabled={!selectedUser || !selectedSpecialty}
            >
              Associar
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}