// src/pages/ClassUserList.tsx
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { classUserService } from "../../services/classUserService";
import { userService } from "../../services/userService";
import { classService } from "../../services/classService";
import { PlusIcon } from "../../icons";
import { SearchIcon } from "lucide-react";
import Button from "../../components/ui/button/Button";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Input from "../../components/form/input/InputField";
import { AssociationModal } from "../../components/ClassModais/AssociationModal";
import { RemoveUserModal } from "../../components/ClassModais/RemoveUserModal";
import { ClassAssociationView } from "../../components/ClassModais/ClassAssociationView";
import { useAuth } from "../../context/AuthContext";


type ClassInfo = {
  id: string;
  name: string;
};


type UserInfo = {
  id: string;
  name: string;
  role: string;
};


interface ClassUser {
  id: string;
  userId: string;
  classId: string;
  assignedBy: string;
  createdAt: string;
  updatedAt: string;
  classUser: {
    name: string;
    photoUrl: string | null;
  };
  classInfo: {
    name: string;
    emblem: string;
    type: string;
  };
}


export type Association = {
  userId: string;
  classId: string;
  assignedBy: string;
};


export default function ClassUser() {
  const [data, setData] = useState<ClassUser[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToRemove, setUserToRemove] = useState<ClassUser | null>(null);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { userRole } = useAuth();


  // Page animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };


  useEffect(() => {
    fetchInitialData();
  }, []);


  const fetchInitialData = async () => {
    setIsLoading(true);
    const loadingToast = toast.loading("Carregando dados...", { position: 'bottom-center' });
    
    try {
      await Promise.all([fetchClassUsers(), fetchUsers(), fetchClasses()]);
      toast.dismiss(loadingToast);
      toast.success("Dados carregados com sucesso", { 
        position: 'bottom-center',
        duration: 2000,
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
        iconTheme: {
          primary: '#10B981',
          secondary: '#FFFFFF',
        }
      });
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(`Error: ${error.message}`, {
          position: 'bottom-right',
          icon: '🚫',
          className: 'dark:bg-gray-800 dark:text-white',
          duration: 5000,
        });
    } finally {
      setIsLoading(false);
    }
  };


  const fetchClassUsers = async () => {
    try {
      const response = await classUserService.getAll();
      const allClasses: ClassUser[] = response?.result?.classes || [];
      setData(allClasses);
      return allClasses;
    } catch (error: any) {
     toast.error(`Error: ${error.message}`, {
          position: 'bottom-right',
          icon: '🚫',
          className: 'dark:bg-gray-800 dark:text-white',
          duration: 5000,
        });
      return [];
    }
  };


  const fetchUsers = async () => {
    try {
      const response = await userService.getAllUsers();
      setUsers(response);
      return response;
    } catch (error: any) {
     toast.error(`Error: ${error.message}`, {
          position: 'bottom-right',
          icon: '🚫',
          className: 'dark:bg-gray-800 dark:text-white',
          duration: 5000,
        });
      return [];
    }
  };


  const fetchClasses = async () => {
    try {
      const response = await classService.ListAllClass();
      setClasses(response.result.classAll);
      return response.result.classAll;
    } catch (error: any) {
      toast.error(`Error: ${error.message}`, {
          position: 'bottom-right',
          icon: '🚫',
          className: 'dark:bg-gray-800 dark:text-white',
          duration: 5000,
        });
      return [];
    }
  };


  const handleRemoveClick = (user: ClassUser) => {
    setUserToRemove(user);
  };


  const confirmRemove = async () => {
    if (!userToRemove) return;
    
    const loadingToast = toast.loading("Removendo usuário...", { position: 'bottom-center' });
    
    try {
      // await classUserService.delete(userToRemove.id);
      toast.dismiss(loadingToast);
      toast.success(`${userToRemove.classUser.name} removido da classe ${userToRemove.classInfo.name}`, {
        position: 'bottom-right',
        duration: 3000,
        icon: '✅',
      });
      await fetchClassUsers();
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(`Error: ${error.message}`, {
          position: 'bottom-right',
          icon: '🚫',
          className: 'dark:bg-gray-800 dark:text-white',
          duration: 5000,
        });
    } finally {
      setUserToRemove(null);
    }
  };


  const handleSaveAssociation = async (assoc: Association) => {
    const loadingToast = toast.loading("Criando associação...", { position: 'bottom-center' });
    
    try {
      await classUserService.createAssociation(assoc);
      toast.dismiss(loadingToast);
      toast.success("Associação criada com sucesso", {
        position: 'bottom-right',
        icon: '🎉',
        duration: 3000,
      });
      await fetchClassUsers();
      setIsModalOpen(false);
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(`Error: ${error.message}`, {
          position: 'bottom-right',
          icon: '🚫',
          className: 'dark:bg-gray-800 dark:text-white',
          duration: 5000,
        });
    }
  };

  return (
    <>
      <PageMeta
        title="Classes associadas a membros do clube | Luzeiros do Norte"
        description="Clube de Desbravadores - Classes associadas a membros do clube"
      />
      <motion.div 
        initial="initial" 
        animate="animate" 
        exit="exit" 
        variants={pageVariants}
        className="min-h-screen"
      >
        <Toaster />
        <PageBreadcrumb pageTitle="Classes" />


        <div className="space-y-6 pb-10">
          <ComponentCard title="Associação de usuários às classes">
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <div className="relative flex-grow max-w-md">
                <Input
                  placeholder="Buscar por nome da classe"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              <motion.div 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center"
              >
                {( userRole === "admin" || userRole === "director" || userRole === "lead") && (
                      <Button
                      size="sm"
                      variant="primary"
                      startIcon={<PlusIcon />}
                      onClick={() => {
                        setUserToRemove(null);
                        setIsModalOpen(true);
                      }}
                      className="rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-600"
                    >
                      Associar Usuário à Classe
                    </Button>
                )}
                
              </motion.div>
            </div>


            <AnimatePresence>
              {isLoading ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center items-center py-20"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-500 dark:text-gray-400">Carregando classes...</p>
                  </div>
                </motion.div>
              ) : (
                <ClassAssociationView
                  data={data}
                  search={search}
                  onRemoveClick={handleRemoveClick}
                />
              )}
            </AnimatePresence>
          </ComponentCard>
        </div>


        <AnimatePresence>
          {userToRemove && (
            <RemoveUserModal
              isOpen={!!userToRemove}
              user={userToRemove}
              onClose={() => setUserToRemove(null)}
              onConfirm={confirmRemove}
            />
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {!userToRemove && isModalOpen && (
            <AssociationModal
              isOpen={!userToRemove && isModalOpen}
              users={users || []}
              classes={classes || []}
              onClose={() => setIsModalOpen(false)}
              onSave={handleSaveAssociation}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}





// // src/pages/ClassUserList.tsx
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { classUserService } from "../../services/classUserService";
// import { userService } from "../../services/userService";
// import { classService } from "../../services/classService";
// import { PlusIcon } from "../../icons";
// import Button from "../../components/ui/button/Button";
// import PageBreadcrumb from "../../components/common/PageBreadCrumb";
// import ComponentCard from "../../components/common/ComponentCard";
// import PageMeta from "../../components/common/PageMeta";
// import Input from "../../components/form/input/InputField";
// import { AssociationModal } from "../../components/ClassModais/AssociationModal";
// import { RemoveUserModal } from "../../components/ClassModais/RemoveUserModal";
// import { ClassAssociationView } from "../../components/ClassModais/ClassAssociationView";

// type ClassInfo = {
//   id: string;
//   name: string;
// };

// type UserInfo = {
//   id: string;
//   name: string;
//   role: string;
// };

// interface ClassUser {
//   id: string;
//   userId: string;
//   classId: string;
//   assignedBy: string;
//   createdAt: string;
//   updatedAt: string;
//   classUser: {
//     name: string;
//     photoUrl: string | null;
//   };
//   classInfo: {
//     name: string;
//     emblem: string;
//     type: string;
//   };
// }

// export type Association = {
//   userId: string;
//   classId: string;
//   assignedBy: string;
// };

// export default function ClassUser() {
//   const [data, setData] = useState<ClassUser[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [userToRemove, setUserToRemove] = useState<ClassUser | null>(null);
//   const [search, setSearch] = useState("");
//   const [users, setUsers] = useState<UserInfo[]>([]);
//   const [classes, setClasses] = useState<ClassInfo[]>([]);

//   useEffect(() => {
//     fetchInitialData();
//   }, []);

//   const fetchInitialData = async () => {
//     await Promise.all([fetchClassUsers(), fetchUsers(), fetchClasses()]);
//   };

//   const fetchClassUsers = async () => {
//     try {
//       const response = await classUserService.getAll();
//       const allClasses: ClassUser[] = response?.result?.classes || [];
//       setData(allClasses);
//     } catch (error) {
//       toast.error("Erro ao carregar as classes de usuários", {position: 'bottom-right'});
//     }
//   };

//   const fetchUsers = async () => {
//     try {
//       const response = await userService.getAllUsers();
//       setUsers(response);
//     } catch (error) {
//       toast.error("Erro ao carregar os usuários", {position: 'bottom-right'});
//     }
//   };

//   const fetchClasses = async () => {
//     try {
//       const response = await classService.ListAllClass();
//       setClasses(response.result.classAll);
//     } catch (error) {
//       toast.error("Erro ao carregar as classes", {position: 'bottom-right'});
//     }
//   };

//   const handleRemoveClick = (user: ClassUser) => {
//     setUserToRemove(user);
//   };

//   const confirmRemove = async () => {
//     if (!userToRemove) return;
//     try {
//       //await classUserService.delete(userToRemove.id);
//       toast.success("Usuário removido da classe", {position: 'bottom-right'});
//       fetchClassUsers();
//     } catch (err) {
//       toast.error("Erro ao remover usuário", {position: 'bottom-right'});
//     } finally {
//       setIsModalOpen(false);
//       setUserToRemove(null);
//     }
//   };

//   const handleSaveAssociation = async (assoc: Association) => {
//     try {
//       await classUserService.createAssociation(assoc);
//       toast.success("Associação criada com sucesso", {position: 'bottom-right'});
//       fetchClassUsers();
//       setIsModalOpen(false);
//     } catch (error) {
//       toast.error("Erro ao criar associação", {position: 'bottom-right'});
//     }
//   };

//   return (
//     <>
//       <PageMeta
//         title="Classes do clube de desbravadores"
//         description="Registro de todas as classes do clube de desbravadores associadas aos usuários"
//       />
//       <PageBreadcrumb pageTitle="Classes" />

//       <div className="space-y-6">
//         <ComponentCard title="Associação de usuários às classes">
//           <div className="flex flex-col sm:flex-row justify-between gap-4 mb-3">
//             <Input
//               placeholder="Buscar por nome da classe"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//             <Button
//               size="sm"
//               variant="primary"
//               startIcon={<PlusIcon />}
//               onClick={() => {
//                 setUserToRemove(null);
//                 setIsModalOpen(true);
//               }}
//             >
//               Associar Usuário à Classe
//             </Button>
//           </div>

//           <ClassAssociationView
//             data={data}
//             search={search}
//             onRemoveClick={handleRemoveClick}
//           />
//         </ComponentCard>
//       </div>

//       <RemoveUserModal
//         isOpen={!!userToRemove}
//         user={userToRemove}
//         onClose={() => setUserToRemove(null)}
//         onConfirm={confirmRemove}
//       />
      
//       <AssociationModal
//         isOpen={!userToRemove && isModalOpen}
//         users={users || []}
//         classes={classes || []}
//         onClose={() => setIsModalOpen(false)}
//         onSave={handleSaveAssociation}
//       />

//       {/* <AssociationModal
//         isOpen={!userToRemove && isModalOpen}
//         users={users || []}
//         classes={classes || []}
//         newAssociation={newAssociation}
//         onClose={() => setIsModalOpen(false)}
//         onChange={setNewAssociation}
//         onSave={handleSaveAssociation}
//       /> */}
//     </>
//   );
// }
