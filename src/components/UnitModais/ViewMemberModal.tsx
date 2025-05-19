import React, { useState } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import avatarDefault from "../../assets/avatarDefault.png";
import { Search, X, UserPlus, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";


interface Member {
  id: string;
  name: string;
  photoUrl?: string;
  role?: string; // Opcional: cargo ou função na unidade
}


interface Props {
  isOpen: boolean;
  counselors: Member[];
  dbvs: Member[];
  onClose: () => void;
  onRemoveDbv: (dbvId: string) => void;
  onRemoveCounselor: (counselorId: string) => void;
  onAddMember?: () => void; // Adicionado para permitir abrir modal de adição
}


const MembersModal: React.FC<Props> = ({
  isOpen,
  counselors,
  dbvs,
  onClose,
  onRemoveDbv,
  onRemoveCounselor,
  onAddMember,
}) => {
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<{ id: string; type: "dbv" | "counselor"; name: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedSection, setExpandedSection] = useState<"both" | "counselors" | "dbvs">("both");

  const { userRole } = useAuth();

  // Filtrar membros com base no termo de pesquisa
  const filteredCounselors = counselors.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredDbvs = dbvs.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleRemoveClick = (id: string, type: "dbv" | "counselor", name: string) => {
    setSelectedMember({ id, type, name });
    setConfirmModal(true);
  };


  const handleConfirmRemove = () => {
    if (selectedMember) {
      if (selectedMember.type === "dbv") {
        onRemoveDbv(selectedMember.id); 
      } else {
        onRemoveCounselor(selectedMember.id); 
      }
      setConfirmModal(false);
      setSelectedMember(null);
    }
  };


  const toggleSection = (section: "counselors" | "dbvs") => {
    if (expandedSection === "both") {
      setExpandedSection(section);
    } else if (expandedSection === section) {
      setExpandedSection("both");
    } else {
      setExpandedSection(section);
    }
  };


  const showCounselors = expandedSection === "both" || expandedSection === "counselors";
  const showDbvs = expandedSection === "both" || expandedSection === "dbvs";


  return (
    <>
      {/* Modal Principal */}
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-3xl m-4">
        <div className="no-scrollbar relative w-full max-w-3xl rounded-2xl bg-white p-4 shadow-xl dark:bg-gray-800 lg:p-6">
          {/* Cabeçalho */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-700">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                Membros da Unidade
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Gerencie os conselheiros e desbravadores da sua unidade
              </p>
            </div>
            <button 
              onClick={onClose}
              className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Fechar"
            >
              <X size={20} />
            </button>
          </div>


          {/* Barra de pesquisa e botão de adicionar */}
          <div className="my-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar membro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            {onAddMember && (
              <Button 
                variant="primary" 
                className="flex items-center gap-2"
                onClick={onAddMember}
              >
                <UserPlus size={16} />
                <span>Adicionar Membro</span>
              </Button>
            )}
          </div>


          <div className="custom-scrollbar mt-2 max-h-[60vh] overflow-y-auto px-1">
            {/* Seção de Conselheiros */}
            <div className="mb-4 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
              <div 
                className="flex cursor-pointer items-center justify-between bg-gray-100 px-4 py-3 dark:bg-gray-700"
                onClick={() => toggleSection("counselors")}
              >
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-700 dark:text-gray-200">
                    Conselheiros
                  </h4>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {counselors.length}
                  </span>
                </div>
                {showCounselors ? (
                  <ChevronUp size={18} className="text-gray-500 dark:text-gray-400" />
                ) : (
                  <ChevronDown size={18} className="text-gray-500 dark:text-gray-400" />
                )}
              </div>
              
              {showCounselors && (
                <div className="p-3">
                  {filteredCounselors.length > 0 ? (
                    <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                      {filteredCounselors.map((counselor) => (
                        <li
                          key={counselor.id}
                          className="flex items-center justify-between px-2 py-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-blue-500 bg-blue-100 dark:border-blue-600 dark:bg-blue-900">
                              <img
                                src={counselor.photoUrl || avatarDefault}
                                alt={counselor.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = avatarDefault;
                                }}
                              />
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-700 dark:text-white">{counselor.name}</h5>
                              {counselor.role && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">{counselor.role}</p>
                              )}
                            </div>
                          </div>
                          {(userRole === "admin" || userRole === "director") && (
                            <Button 
                            variant="outline" 
                            className="border-red-200 px-3 py-1 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/30"
                            onClick={() => handleRemoveClick(counselor.id, "counselor", counselor.name)}
                          >
                            Remover
                          </Button>
                          )}
                          
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <p className="text-gray-500 dark:text-gray-400">Nenhum conselheiro encontrado</p>
                    </div>
                  )}
                </div>
              )}
            </div>


            {/* Seção de Desbravadores */}
            <div className="mb-4 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
              <div 
                className="flex cursor-pointer items-center justify-between bg-gray-100 px-4 py-3 dark:bg-gray-700"
                onClick={() => toggleSection("dbvs")}
              >
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-700 dark:text-gray-200">
                    Desbravadores
                  </h4>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                    {dbvs.length}
                  </span>
                </div>
                {showDbvs ? (
                  <ChevronUp size={18} className="text-gray-500 dark:text-gray-400" />
                ) : (
                  <ChevronDown size={18} className="text-gray-500 dark:text-gray-400" />
                )}
              </div>
              
              {showDbvs && (
                <div className="p-3">
                  {filteredDbvs.length > 0 ? (
                    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {filteredDbvs.map((dbv) => (
                        <li
                          key={dbv.id}
                          className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-green-500 bg-green-100 dark:border-green-600 dark:bg-green-900">
                              <img
                                src={dbv.photoUrl || avatarDefault}
                                alt={dbv.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = avatarDefault;
                                }}
                              />
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-700 dark:text-white">{dbv.name}</h5>
                              {dbv.role && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">{dbv.role}</p>
                              )}
                            </div>
                          </div>
                          {(userRole === "admin" || userRole === "director") && (
                              <Button 
                                variant="outline" 
                                className="border-red-200 px-3 py-1 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/30"
                                onClick={() => handleRemoveClick(dbv.id, "dbv", dbv.name)}
                              >
                                Remover
                              </Button>
                            )}
                          
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <p className="text-gray-500 dark:text-gray-400">Nenhum desbravador encontrado</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>


          {/* Rodapé */}
          <div className="mt-4 flex justify-end border-t border-gray-100 pt-4 dark:border-gray-700">
            <Button variant="primary" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </Modal>


      {/* Modal de Confirmação */}
      <Modal isOpen={confirmModal} onClose={() => setConfirmModal(false)} className="max-w-md m-4">
        <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
              <AlertTriangle size={32} className="text-red-600 dark:text-red-300" />
            </div>
          </div>
          <h4 className="mb-2 text-center text-xl font-bold text-gray-800 dark:text-white">Confirmar Remoção</h4>
          <p className="mb-6 text-center text-gray-600 dark:text-gray-300">
            Tem certeza que deseja remover <strong>{selectedMember?.name}</strong> da unidade?
            Esta ação não pode ser desfeita.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button 
              variant="outline" 
              className="flex-1 sm:flex-none"
              onClick={() => setConfirmModal(false)}
            >
              Cancelar
            </Button>
            <Button 
              className="flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 sm:flex-none"
              onClick={handleConfirmRemove}
            >
              Sim, remover
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};


export default MembersModal;
















































// import React, { useState } from "react";
// import { Modal } from "../ui/modal";
// import Button from "../ui/button/Button";
// import avatarDefault from "../../assets/avatarDefault.png";

// interface Member {
//   id: string;
//   name: string;
//   photoUrl?: string;
// }

// interface Props {
//   isOpen: boolean;
//   counselors: Member[];
//   dbvs: Member[];
//   onClose: () => void;
//   onRemoveDbv: (dbvId: string) => void;
//   onRemoveCounselor: (counselorId: string) => void;
// }

// const MembersModal: React.FC<Props> = ({
//   isOpen,
//   counselors,
//   dbvs,
//   onClose,
//   onRemoveDbv,
//   onRemoveCounselor,
// }) => {
//   const [confirmModal, setConfirmModal] = useState(false);
//   const [selectedMember, setSelectedMember] = useState<{ id: string; type: "dbv" | "counselor" } | null>(null);

//   const handleRemoveClick = (id: string, type: "dbv" | "counselor") => {
//     setSelectedMember({ id, type });
//     setConfirmModal(true);
//   };

//   const handleConfirmRemove = () => {
//     if (selectedMember) {
//       if (selectedMember.type === "dbv") {
//         onRemoveDbv(selectedMember.id);
//       } else {
//         onRemoveCounselor(selectedMember.id);
//       }
//       setConfirmModal(false);
//       setSelectedMember(null);
//     }
//   };

//   return (
//     <>
//       {/* Modal Principal */}
//       <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
//         <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
//           <div className="px-2 pr-14">
//             <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
//               Ver membros da unidade
//             </h4>
//             <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
//               Adicionar ou remover membros da unidade
//             </p>
//           </div>

//           <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
//             {/* Conselheiros */}
//             <div className="border-b border-gray-100 dark:border-white/[0.05]">
//               <p className="mb-1 text-sm text-gray-500 dark:text-gray-400 lg:mb-1">Conselheiros</p>
//               <ul className="space-y-2">
//                 {counselors.map((counselor) => (
//                   <li
//                     key={counselor.id}
//                     className="flex justify-between items-center rounded-md p-2 text-gray-500 text-start text-theme-md dark:text-gray-400 border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]"
//                   >
//                     <div className="flex items-center gap-3">
//                       <img
//                         src={counselor.photoUrl || avatarDefault}
//                         alt={counselor.name}
//                         className="w-8 h-8 rounded-full"
//                       />
//                       <span>{counselor.name}</span>
//                     </div>
//                     <Button variant="outline" onClick={() => handleRemoveClick(counselor.id, "counselor")}>Remover</Button>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Desbravadores */}
//             <div className="mt-7 border-b border-gray-100 dark:border-white/[0.05]">
//               <p className="mb-1 text-sm text-gray-500 dark:text-gray-400 lg:mb-1">Desbravadores</p>
//               <ul className="space-y-2">
//                 {dbvs.map((dbv) => (
//                   <li
//                     key={dbv.id}
//                     className="flex justify-between items-center rounded-md p-2 text-gray-500 text-start text-theme-md dark:text-gray-400 border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]"
//                   >
//                     <div className="flex items-center gap-3">
//                       <img
//                         src={dbv.photoUrl || avatarDefault}
//                         alt={dbv.name}
//                         className="w-8 h-8 rounded-full"
//                       />
//                       <span>{dbv.name}</span>
//                     </div>
//                     <Button variant="outline" onClick={() => handleRemoveClick(dbv.id, "dbv")}>Remover</Button>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>

//           {/* Botões */}
//           <div className="flex justify-end gap-3">
//             <Button variant="primary" onClick={onClose}>Fechar</Button>
//           </div>
//         </div>
//       </Modal>

//       {/* Modal de Confirmação */}
//       <Modal isOpen={confirmModal} onClose={() => setConfirmModal(false)} className="max-w-md m-4">
//         <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-900">
//           <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Confirmar Remoção</h4>
//           <p className="mb-4 text-gray-500 dark:text-gray-400">
//             Tem certeza que deseja remover este membro?
//           </p>
//           <div className="flex justify-end gap-3">
//             <Button variant="outline" onClick={() => setConfirmModal(false)}>Cancelar</Button>
//             <Button onClick={handleConfirmRemove}>Remover</Button>
//           </div>
//         </div>
//       </Modal>
//     </>
//   );
// };

// export default MembersModal;
