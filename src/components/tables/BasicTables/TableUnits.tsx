import { useState, useEffect } from "react";
import MembersModal from "../../UnitModais/ViewMemberModal";
import DeleteUnitModal from "../../UnitModais/confirmDeleteModal";
import { unitsService } from "../../../services/unitsService";
import toast from "react-hot-toast";
import { uploadImage } from "../../../services/uploadService";
import { motion, AnimatePresence } from "framer-motion";

//import { MoreDotIcon } from "../../../icons";
// Importing icons from a library like heroicons or your custom icons
// Replace these with your actual icon imports
import { 
  User2 as UserGroupIcon,
  Pencil as EditIcon,
  Trash as TrashIcon,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon
} from "lucide-react";
import { Unit } from "../../../dtos/UnitDTO";
import { useAuth } from "../../../context/AuthContext";
import EditUnitModal from "../../UnitModais/EditUnit";


export default function EnhancedUnitsDisplay() {
  const [unit, setUnit] = useState<Unit[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [expandedUnit, setExpandedUnit] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const { units, findUnits, userRole} = useAuth();
console.log(openDropdownId)
  useEffect(() => {
    if (units) {
      setUnit(units);
      setIsLoading(false);
    }
  }, [units]);


  const filteredUnits = unit.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  // function toggleDropdown(unitId: string) {
  //   setOpenDropdownId(openDropdownId === unitId ? null : unitId);
  // }


  function closeDropdown() {
    setOpenDropdownId(null);
  }


  function toggleExpand(unitId: string) {
    setExpandedUnit(expandedUnit === unitId ? null : unitId);
  }


  function openEditUnit(unit: Unit) {
    setSelectedUnit(unit);
    setIsEditModalOpen(true);
    closeDropdown();
  }


  function openViewMembers(unit: Unit) {
    setSelectedUnit(unit);
    setIsMembersModalOpen(true);
    closeDropdown();
  }


  function openDeleteUnit(unit: Unit) {
    setSelectedUnit(unit);
    setIsDeleteModalOpen(true);
    closeDropdown();
  }


  const handleSaveUnit = async (updatedUnit: any, photo?: File | null) => {
    try {
      setIsLoading(true);
      let uploadedImageUrl;
      if (photo) {
        uploadedImageUrl = await uploadImage(photo);
      }
      
      await unitsService.updateUnit(
        updatedUnit?.id,
        updatedUnit.name,
        uploadedImageUrl
      );
      
      await findUnits();
      toast.success("Unidade atualizada com sucesso", { position: 'bottom-right' });
    } catch (error: any) {
      toast.error(`Error: ${error.message}`, {position: 'bottom-right', duration: 5000,});
    } finally {
      setIsLoading(false);
      setIsEditModalOpen(false);
    }
  };


  const handleDeleteUnit = async () => {
    try {
      setIsLoading(true);
      await unitsService.deleteUnit(selectedUnit?.id as string);
      await findUnits();
      toast.success("Unidade excluída com sucesso", { position: 'bottom-right' });
    } catch (error: any) {
      toast.error(`Error: ${error.message}`, {position: 'bottom-right', duration: 5000,});
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
    }
  };


  const removeDbv = async (dbvId: string) => {
    try {
      setIsLoading(true);
      await unitsService.removeDbvFromUnit(selectedUnit?.id as string, dbvId);
      await findUnits();
      toast.success("Membro excluído da unidade", { position: 'bottom-right' });
    } catch (error: any) {
      toast.error(`Error: ${error.message}`, {position: 'bottom-right', duration: 5000,});
    } finally {
      setIsLoading(false);
      setIsMembersModalOpen(false);
    }
  };


  const removeCounselor = async (counselorId: string) => {
    try {
      setIsLoading(true);
      await unitsService.removeCounselorFromUnit(selectedUnit?.id as string, counselorId);
      await findUnits();
      toast.success("Conselheiro removido da unidade", { position: 'bottom-right' });
    } catch (error: any) {
      toast.error(`Error: ${error.message}`, {position: 'bottom-right', duration: 5000,});
    } finally {
      setIsLoading(false);
      setIsMembersModalOpen(false);
    }
  };

  return (
    <div className="w-full">
      {/* Search and filter header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Unidades</h2>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Buscar unidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 pl-10 text-sm transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          <svg
            className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>


      {isLoading ? (
        <div className="flex h-64 w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <>
          {/* Grid View for larger screens */}
          <div className="hidden sm:grid">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredUnits.map((unit) => (
                <motion.div
                  key={unit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="relative h-32 bg-gradient-to-r from-blue-400 to-purple-500 p-4">
                    {unit.photo && (
                      <img
                        src={unit.photo}
                        alt={`${unit.name} logo`}
                        className="absolute -bottom-10 left-1/2 h-20 w-20 -translate-x-1/2 transform rounded-full border-4 border-white object-cover shadow-lg dark:border-gray-800"
                      />
                    )}
                    {!unit.photo && (
                      <div className="absolute -bottom-10 left-1/2 flex h-20 w-20 -translate-x-1/2 transform items-center justify-center rounded-full border-4 border-white bg-gray-200 text-2xl font-bold text-gray-600 shadow-lg dark:border-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        {unit.name.charAt(0)}
                      </div>
                    )}
                  </div>


                  <div className="px-4 pb-4 pt-12 text-center">
                    <h3 className="mb-2 text-xl font-bold text-gray-800 dark:text-white">{unit.name}</h3>
                    
                    <div className="mb-4">
                      <h4 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Conselheiros</h4>
                      <div className="flex flex-wrap justify-center gap-2">
                        {unit.counselors && unit.counselors.length > 0 ? (
                          unit.counselors.map((counselor) => (
                            <div key={counselor.id} className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                              <div className="h-4 w-4 overflow-hidden rounded-full bg-gray-300 dark:bg-gray-600">
                                {counselor.counselor.photoUrl ? (
                                  <img
                                    src={counselor.counselor.photoUrl}
                                    alt={counselor.counselor.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-[8px] text-gray-600 dark:text-gray-400">
                                    {counselor.counselor.name.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <span>{counselor.counselor.name}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400">Nenhum conselheiro cadastrado</span>
                        )}
                      </div>
                    </div>


                    <div className="mb-4">
                      <h4 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Membros ({unit.dbvs?.length || 0})</h4>
                      <div className="flex -space-x-2 justify-center">
                        {unit.dbvs && unit.dbvs.length > 0 ? (
                          unit.dbvs.slice(0, 5).map((dbv) => (
                            <div
                              key={dbv.id}
                              className="h-8 w-8 overflow-hidden rounded-full border-2 border-white dark:border-gray-800"
                              title={dbv.dbv.name}
                            >
                              {dbv.dbv.photoUrl ? (
                                <img
                                  src={dbv.dbv.photoUrl}
                                  alt={dbv.dbv.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gray-200 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                  {dbv.dbv.name.charAt(0)}
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400">Nenhum membro cadastrado</span>
                        )}
                        {unit.dbvs && unit.dbvs.length > 5 && (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs font-medium text-gray-600 dark:border-gray-800 dark:bg-gray-700 dark:text-gray-300">
                            +{unit.dbvs.length - 5}
                          </div>
                        )}
                      </div>
                    </div>


                    <div className="mt-4 flex justify-center gap-2">
                      <button
                        onClick={() => openViewMembers(unit)}
                        className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                      >
                        <UserGroupIcon className="h-4 w-4" /> Ver Membros
                      </button>
                      
                      {(userRole === "admin" || userRole === "director") && (
                          <button
                          onClick={() => openEditUnit(unit)}
                          className="rounded-lg bg-gray-100 p-2 text-gray-600 transition hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                          title="Editar"
                        >
                          <EditIcon className="h-4 w-4" />
                        </button>
                      )}
                      
                      {(userRole === "admin" || userRole === "director") && (
                        <button
                        onClick={() => openDeleteUnit(unit)}
                        className="rounded-lg bg-gray-100 p-2 text-red-500 transition hover:bg-red-50 dark:bg-gray-700 dark:text-red-400 dark:hover:bg-red-900/20"
                        title="Excluir"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                      )}
                      
                      
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>


          {/* List View for mobile */}
          <div className="sm:hidden">
            <div className="space-y-4">
              {filteredUnits.map((unit) => (
                <motion.div
                  key={unit.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 overflow-hidden rounded-full border border-gray-200 dark:border-gray-700">
                        {unit.photo ? (
                          <img src={unit.photo} alt={unit.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gray-200 text-xl font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                            {unit.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 dark:text-white">{unit.name}</h3>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <UserGroupIcon className="mr-1 h-3 w-3" /> 
                          {unit.dbvs?.length || 0} membros
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleExpand(unit.id)}
                      className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                    >
                      {expandedUnit === unit.id ? (
                        <ChevronUpIcon className="h-5 w-5" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>


                  <AnimatePresence>
                    {expandedUnit === unit.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-gray-100 px-4 py-3 dark:border-gray-700"
                      >
                        <div className="mb-3">
                          <h4 className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">Conselheiros</h4>
                          <div className="space-y-1">
                            {unit.counselors && unit.counselors.length > 0 ? (
                              unit.counselors.map((counselor) => (
                                <div key={counselor.id} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                  <div className="h-5 w-5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                    {counselor.counselor.photoUrl ? (
                                      <img
                                        src={counselor.counselor.photoUrl}
                                        alt={counselor.counselor.name}
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-600 dark:text-gray-400">
                                        {counselor.counselor.name.charAt(0)}
                                      </div>
                                    )}
                                  </div>
                                  <span>{counselor.counselor.name}</span>
                                </div>
                              ))
                            ) : (
                              <span className="text-xs text-gray-500 dark:text-gray-400">Nenhum conselheiro cadastrado</span>
                            )}
                          </div>
                        </div>


                        <div className="mb-4">
                          <h4 className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">Membros</h4>
                          <div className="flex flex-wrap gap-1">
                            {unit.dbvs && unit.dbvs.length > 0 ? (
                              unit.dbvs.map((dbv) => (
                                <div key={dbv.id} className="flex items-center gap-1 rounded-full bg-gray-50 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                  <div className="h-4 w-4 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
                                    {dbv.dbv.photoUrl ? (
                                      <img
                                        src={dbv.dbv.photoUrl}
                                        alt={dbv.dbv.name}
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <div className="flex h-full w-full items-center justify-center text-[8px] text-gray-600 dark:text-gray-400">
                                        {dbv.dbv.name.charAt(0)}
                                      </div>
                                    )}
                                  </div>
                                  <span>{dbv.dbv.name}</span>
                                </div>
                              ))
                            ) : (
                              <span className="text-xs text-gray-500 dark:text-gray-400">Nenhum membro cadastrado</span>
                            )}
                          </div>
                        </div>


                        <div className="flex gap-2">
                          <button
                            onClick={() => openViewMembers(unit)}
                            className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                          >
                            <UserGroupIcon className="h-3.5 w-3.5" /> Ver Membros
                          </button>
                          
                            {(userRole === "admin" || userRole === "director") && (
                              <button
                                onClick={() => openEditUnit(unit)}
                                className="rounded-lg bg-gray-100 p-2 text-gray-600 transition hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                title="Editar"
                              >
                                <EditIcon className="h-4 w-4" />
                              </button>
                            )}
                              
                            {(userRole === "admin" || userRole === "director") && (
                                <button
                                onClick={() => openDeleteUnit(unit)}
                                className="rounded-lg bg-gray-100 p-2 text-red-500 transition hover:bg-red-50 dark:bg-gray-700 dark:text-red-400 dark:hover:bg-red-900/20"
                                title="Excluir"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            )}

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>


          {filteredUnits.length === 0 && (
            <div className="flex h-32 w-full flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
              <p className="mb-1 text-gray-500 dark:text-gray-400">Nenhuma unidade encontrada</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                {searchTerm ? `Tente outro termo de busca` : `Adicione uma nova unidade para começar`}
              </p>
            </div>
          )}
        </>
      )}


      {/* Modais */}
      {isEditModalOpen && selectedUnit && (
        <EditUnitModal
          isOpen={isEditModalOpen}
          unit={selectedUnit}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveUnit}
        />
      )}


      {isMembersModalOpen && selectedUnit && (
        <MembersModal
          isOpen={isMembersModalOpen}
          counselors={selectedUnit.counselors?.map((c) => (
            { id: c.counselor.id, name: c.counselor.name })) || []}
          dbvs={selectedUnit.dbvs?.map((d) => (
            { id: d.dbv.id, name: d.dbv.name, photoUrl: d.dbv.photoUrl })) || []}
          onClose={() => setIsMembersModalOpen(false)}
          onRemoveDbv={(dbvId) => removeDbv(dbvId)}
          onRemoveCounselor={(counselorId) => removeCounselor(counselorId)}
        />
      )}


      {isDeleteModalOpen && selectedUnit && (
        <DeleteUnitModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirmDelete={handleDeleteUnit}
        />
      )}
    </div>
  );
}
