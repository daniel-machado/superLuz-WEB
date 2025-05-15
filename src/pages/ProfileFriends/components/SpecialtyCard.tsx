import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { specialtyUserService } from "../../../services/specialtyUserService";
import Badge from "../../../components/ui/badge/Badge";


interface SpecialtyUser {
  id: string
  userId: string
  specialtyId: string
  approvalStatus: string
  report: string[]
  rejectionComments: string[]
  approvalComments: string[]
  isQuizApproved: boolean
  counselorApproval: boolean
  counselorApprovalAt: string | null
  leadApproval: boolean
  leadApprovalAt: string | null
  directorApproval: boolean
  directorApprovalAt: string | null
  createdAt: string
  updatedAt: string
  specialtyUser: {
    name: string
  },
  specialtyInfo: {
    name: string
    emblem: string
  }
}


type FilterStatus = "all" | "approved" | "pending" | "rejected";

interface UserMetaCardProps {
  userId: string | undefined;
}

// Specialty Card Component
export function SpecialtyCard({userId}: UserMetaCardProps) {
  const [specialties, setSpecialties] = useState<SpecialtyUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    fetchSpecialties();
  }, []);


  const fetchSpecialties = async () => {
    setLoading(true);
    try {
      const data = await specialtyUserService.getAllByUser(userId as string);
      setSpecialties(data.result.specialty || []);
    } catch (error: any) {
      console.error("Error fetching specialties:", error);
      toast.error("Falha ao carregar especialidades");
    } finally {
      setLoading(false);
    }
  };


  const filteredSpecialties = useMemo(() => {
    return specialties
      .filter(specialty => {
        // Filter by status
        if (filterStatus === "all") return true;
        return specialty.approvalStatus === filterStatus;
      })
      .filter(specialty => {
        // Filter by search term
        if (!searchTerm.trim()) return true;
        return specialty.specialtyInfo.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });
  }, [specialties, filterStatus, searchTerm]);


  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "success";
      case "pending": return "warning";
      case "rejected": return "error";
      default: return "warning";
    }
  };


  const getStatusText = (status: string) => {
    switch (status) {
      case "approved": return "Aprovada";
      case "pending": return "Pendente";
      case "rejected": return "Rejeitada";
      default: return "Pendente";
    }
  };


  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-white/90">
            Especialidades
          </h4>
          <Badge size="md" color="primary">
            {filteredSpecialties.length} especialidades
          </Badge>
        </div>


        {/* Search and Filter Controls */}
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
          {/* Search Input */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              type="text"
              className="w-full text-gray-500 dark:text-gray-400 py-2 pl-10 pr-3 text-xs bg-white border border-gray-100 rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              placeholder="Buscar especialidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>


          {/* Status Filter */}
          <div className="flex items-center space-x-1 text-xs">
            <span className="text-gray-500 dark:text-gray-400">Status:</span>
            <div className="flex p-1 bg-gray-100 rounded-lg dark:bg-gray-800">
              <button
                className={`px-2 py-1 rounded-md transition-colors ${filterStatus === "all" ? "bg-white dark:bg-gray-700 shadow-sm" : "text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
                onClick={() => setFilterStatus("all")}
              >
                Todos
              </button>
              <button
                className={`px-2 py-1 rounded-md transition-colors ${filterStatus === "approved" ? "bg-white dark:bg-gray-700 shadow-sm" : "text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
                onClick={() => setFilterStatus("approved")}
              >
                Aprovadas
              </button>
              <button
                className={`px-2 py-1 rounded-md transition-colors ${filterStatus === "pending" ? "bg-white dark:bg-gray-700 shadow-sm" : "text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
                onClick={() => setFilterStatus("pending")}
              >
                Pendentes
              </button>
            </div>
          </div>
        </div>


        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-10 h-10 border-4 border-gray-200 rounded-full animate-spin dark:border-gray-700 border-t-primary"></div>
          </div>
        ) : specialties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <svg
              className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <p className="text-gray-500 dark:text-gray-400">
              Você ainda não tem especialidades
            </p>
            <button
              className="px-4 py-2 mt-4 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary/90"
              onClick={() => toast.success("Em breve você poderá adicionar especialidades!", {position: "bottom-right"})}
            >
              Buscar especialidades
            </button>
          </div>
        ) : filteredSpecialties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <svg
              className="w-12 h-12 mb-3 text-gray-300 dark:text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-gray-500 dark:text-gray-400">
              Nenhuma especialidade encontrada para os filtros aplicados
            </p>
            <button
              className="px-4 py-1.5 mt-3 text-xs font-medium text-gray-500 dark:text-gray-400 bg-transparent border border-primary rounded-full hover:bg-primary/10"
              onClick={() => {
                setFilterStatus("all");
                setSearchTerm("");
              }}
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="relative">
            {/* Scrollable Container */}
            <div className="max-h-96 overflow-y-auto pr-1 custom-scrollbar">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
                {filteredSpecialties.map((specialty) => (
                  <div
                    key={specialty.id}
                    className="flex flex-col items-center p-3 transition-all bg-gray-50 border border-gray-100 rounded-lg hover:shadow-md dark:bg-gray-800/50 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/30"
                  >
                    {specialty.specialtyInfo.emblem && specialty.specialtyInfo.emblem !== "null" ? (
                      <img
                        src={specialty.specialtyInfo.emblem}
                        alt={specialty.specialtyInfo.name}
                        className="object-contain w-12 h-12 mb-2"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-12 h-12 mb-2 text-white bg-primary rounded-full">
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                    <p className="text-xs font-medium text-center text-gray-800 dark:text-white/90">
                      {specialty.specialtyInfo.name}
                    </p>
                    <Badge
                      color={getStatusColor(specialty.approvalStatus)}
                      //className="mt-1"
                    >
                      {getStatusText(specialty.approvalStatus)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


/* Add custom scrollbar styles - can be placed in your global CSS file */
/*
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}


.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}


.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 9999px;
}


.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af;
}


.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #4b5563;
}


.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #6b7280;
}
*/
