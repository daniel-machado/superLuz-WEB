import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { classUserService } from "../../../services/classUserService";
import Badge from "../../../components/ui/badge/Badge";

interface ClassUser {
  id: string;
  userId: string;
  classId: string;
  assignedBy: string;
  createdAt: string;
  updatedAt: string;
  classUser: {
    name: string;
  };
  classInfo: {
    name: string;
    type: 'regular' | 'advanced' | 'leadership';
    emblem?: string; // URL for the emblem image
  };
}

interface UserMetaCardProps {
  userId: string | undefined;
}
// Class Card Component
export function UserClassCardUser({userId}: UserMetaCardProps) {
  const [classes, setClasses] = useState<ClassUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");


  // Define class colors based on name
  const classColors: Record<string, string> = {
    // Regular classes
    "Amigo": "bg-blue-500 text-blue-500",
    "Companheiro": "bg-red-500 text-red-500",
    "Pesquisador": "bg-green-500 text-green-500",
    "Pioneiro": "bg-gray-500 text-gray-500",
    "Excursionista": "bg-purple-500 text-purple-500",
    "Guia": "bg-amber-500 text-amber-500",
    
    // Leadership classes
    "Líder": "bg-blue-800 text-blue-800",
    "Líder Máster": "bg-red-800 text-red-800",
    //"Líder Máster Avançado": "bg-gradient-to-r from-blue-700 to-amber-500 text-blue-700",
    "Líder Máster Avançado": "bg-gradient-to-r from-blue-700 to-amber-500 text-blue-700",
    
    // Default
    "default": "bg-primary text-primary"
  };


  useEffect(() => {
    fetchClass();
  }, []);


  const fetchClass = async () => {
    setLoading(true);
    try {
      const data = await classUserService.getAllByUserClass(userId as string);
      setClasses(data.result.classUser || []);
    } catch (error: any) {
      console.error("Error fetching classes:", error);
      toast.error("Falha ao carregar classes");
    } finally {
      setLoading(false);
    }
  };


  // Filter classes by search term
  const filteredClasses = classes.filter(classItem => 
    classItem.classInfo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  // Group classes by base name and type
  const groupClasses = () => {
    const groupedMap = new Map();
    
    // First pass: Add all regular classes
    filteredClasses.forEach(classItem => {
      const className = classItem.classInfo.name;
      const classType = classItem.classInfo.type;
      
      if (classType === 'regular') {
        if (!groupedMap.has(className)) {
          groupedMap.set(className, {
            regular: classItem,
            advanced: null,
            color: classColors[className as keyof typeof classColors] || classColors.default
          });
        }
      }
    });
    
    // Second pass: Add advanced classes to their regular counterparts
    filteredClasses.forEach(classItem => {
      const classType = classItem.classInfo.type;
      
      if (classType === 'advanced') {
        // Find the matching regular class
        let matchingRegularName = "";
        if (classItem.classInfo.name === "Amigo da Natureza") matchingRegularName = "Amigo";
        else if (classItem.classInfo.name === "Companheiro de Excursionismo") matchingRegularName = "Companheiro";
        else if (classItem.classInfo.name === "Pesquisador de Campo e Bosque") matchingRegularName = "Pesquisador";
        else if (classItem.classInfo.name === "Pioneiro de Novas Fronteiras") matchingRegularName = "Pioneiro";
        else if (classItem.classInfo.name === "Excursionista na Mata") matchingRegularName = "Excursionista";
        else if (classItem.classInfo.name === "Guia de Exploração") matchingRegularName = "Guia";
        
        if (matchingRegularName && groupedMap.has(matchingRegularName)) {
          const group = groupedMap.get(matchingRegularName);
          group.advanced = classItem;
        }
      }
    });
    
    // Third pass: Add leadership classes directly
    filteredClasses.forEach(classItem => {
      const className = classItem.classInfo.name;
      const classType = classItem.classInfo.type;
      
      if (classType === 'leadership') {
        if (!groupedMap.has(className)) {
          groupedMap.set(className, {
            regular: classItem,
            advanced: null,
            color: classColors[className] || classColors.default
          });
        }
      }
    });
    
    return Array.from(groupedMap.values());
  };


  const groupedClasses = groupClasses();


  return (
    <div className="p-4 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Classes
          </h4>
          <Badge size="sm" color="primary">
            {classes.length} classes
          </Badge>
        </div>


        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg 
              className="w-4 h-4 text-gray-400 dark:text-gray-500" 
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
          </div>
          <input
              type="text"
              className="w-full text-gray-500 dark:text-gray-400 py-2 pl-10 pr-3 text-xs bg-white border border-gray-100 rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              placeholder="Buscar Classe..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>


        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-10 h-10 border-4 border-gray-200 rounded-full animate-spin dark:border-gray-700 border-t-primary"></div>
          </div>
        ) : classes.length === 0 ? (
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
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <p className="text-gray-500 dark:text-gray-400">
              Você ainda não tem classes
            </p>
          </div>
        ) : filteredClasses.length === 0 ? (
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-gray-500 dark:text-gray-400">
              Nenhuma classe encontrada para "{searchTerm}"
            </p>
          </div>
        ) : (
          // <div className="overflow-y-auto max-h-[60vh] pr-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          <div className="max-h-96 overflow-y-auto pr-1 custom-scrollbar">
            <div className="grid gap-4">
              {groupedClasses.map((group, index) => {
                const classItem = group.regular;
                const advancedClassItem = group.advanced;
                const colorClass = group.color;
                const [bgColor, textColor] = colorClass.split(' ');
                
                const hasAdvanced = advancedClassItem !== null;
                const isLeadership = classItem.classInfo.type === 'leadership';
                
                return (
                  <div
                    key={index}
                    className="relative flex flex-col overflow-hidden transition-all bg-white border border-gray-100 rounded-lg shadow-sm dark:bg-gray-800/50 dark:border-gray-700 hover:shadow-md"
                  >
                    <div className={`absolute top-0 left-0 w-1 h-full ${bgColor}`}></div>
                    
                    {/* Regular class */}
                    <div className="flex items-center p-4">
                      <div className={`flex items-center justify-center w-14 h-14 mr-4 ${bgColor} bg-opacity-10 dark:bg-opacity-20 rounded-lg`}>
                        {classItem.classInfo.emblem ? (
                          <img
                            src={classItem.classInfo.emblem}
                            alt={classItem.classInfo.name}
                            className="object-contain w-8 h-8"
                          />
                        ) : (
                          <svg
                            className={`w-7 h-7 ${textColor}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center flex-wrap gap-2">
                          <h5 className="text-base md:text-lg font-semibold text-gray-800 dark:text-white/90">
                            {classItem.classInfo.name}
                          </h5>
                          <div>
                            <Badge
                              size="sm"
                              color={
                                isLeadership ? "warning" :
                                "info"
                              }
                            >
                              {isLeadership ? "Liderança" : "Regular"}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                          Adquirida em {new Date(classItem.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    
                    {/* Advanced class if exists */}
                    {hasAdvanced && (
                      <div className="flex items-center p-4 pl-8 mt-1 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                        <div className={`flex items-center justify-center w-12 h-12 mr-4 bg-gradient-to-br from-${bgColor.replace('bg-', '')} to-amber-500 bg-opacity-10 dark:bg-opacity-20 rounded-lg`}>
                          {advancedClassItem.classInfo.emblem ? (
                            <img
                              src={advancedClassItem.classInfo.emblem}
                              alt={advancedClassItem.classInfo.name}
                              className="object-contain w-7 h-7"
                            />
                          ) : (
                            <svg
                              className="w-6 h-6 text-amber-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-center flex-wrap gap-2">
                            <h5 className="text-sm md:text-base font-medium text-gray-700 dark:text-white/80">
                              {advancedClassItem.classInfo.name}
                            </h5>
                            <div>
                              <Badge
                                size="sm"
                                color="primary"
                              >
                                Avançada
                              </Badge>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Adquirida em {new Date(advancedClassItem.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
