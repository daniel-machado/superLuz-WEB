// Quiz.tsx
import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { PlusIcon } from "../../icons";
import toast from "react-hot-toast";
import { quizService } from '../../services/quizService';
import Input from "../../components/form/input/InputField";
import QuizTable from '../../components/QuizComponents/QuizTable';
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import CreateQuizModal from "../../components/QuizComponents/CreateQuizModal";


interface ISpecialty {
  id: string;
  name: string;
}


interface IQuiz {
  id: string;
  title: string;
  specialtyId: string;
  specialtyName?: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}


export default function Quiz() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quizzes, setQuizzes] = useState<IQuiz[]>([]);
  const [specialties, setSpecialties] = useState<ISpecialty[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [_selectedQuiz, setSelectedQuiz] = useState<IQuiz | null>(null);
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null);

  const { specialtys, userRole } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    loadData();
    setSpecialties(specialtys);
  }, [specialtys]);


  const loadData = async () => {
    try {
      setIsLoading(true);
      const response = await quizService.ListAllQuiz();
      setQuizzes(response);
    } catch (error: any) {
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

  const handleCreateQuiz = async (specialtyId: string) => {
    const specialty = specialties.find((s) => s.id === specialtyId);
    if (!specialty) return;


    try {
      setIsLoading(true);
      const title = `${specialty.name} (Quiz)`;


      await quizService.createQuiz({ title, specialtyId });
      toast.success("Quiz criado com sucesso!", {position: 'bottom-right'});
      await loadData();
    } catch (error: any) {
     toast.error(`Error: ${error.message}`, {
          position: 'bottom-right',
          icon: '🚫',
          className: 'dark:bg-gray-800 dark:text-white',
          duration: 5000,
        });
    } finally {
      setIsLoading(false);
      setIsOpenModal(false);
    }
  };


  // const handleUpdateQuiz = async (quiz: IQuiz) => {
  //   try {
  //     setIsLoading(true);
  //     await quizService.updateQuiz(quiz.id, {
  //       title: quiz.title,
  //       specialtyId: quiz.specialtyId,
  //       is_active: quiz.is_active
  //     });
  //     toast.success("Quiz atualizado com sucesso!", {position: 'bottom-right'});
  //     await loadData();
  //   } catch (error) {
  //     toast.error("Erro ao atualizar quiz", {position: 'bottom-right'});
  //   } finally {
  //     setIsLoading(false);
  //     setIsOpenModal(false);
  //   }
  // };


  const handleToggleActive = async (quiz: IQuiz) => {
    try {
      setIsLoading(true);
      await quizService.updateQuiz(quiz.id, {
        ...quiz,
        is_active: !quiz.is_active
      });
      toast.success(`Quiz ${!quiz.is_active ? 'ativado' : 'desativado'} com sucesso!`, {position: 'bottom-right'});
      await loadData();
    } catch (error: any) {
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


  const confirmDeleteQuiz = (id: string) => {
    setQuizToDelete(id);
    setIsDeleteModalOpen(true);
  };


  const handleDeleteQuiz = async () => {
    if (!quizToDelete) return;
    
    try {
      setIsLoading(true);
      await quizService.deleteQuiz(quizToDelete);
      toast.success("Quiz deletado com sucesso!", {position: 'bottom-right'});
      await loadData();
    } catch (error: any) {
      toast.error(`Error: ${error.message}`, {
          position: 'bottom-right',
          icon: '🚫',
          className: 'dark:bg-gray-800 dark:text-white',
          duration: 5000,
        });
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
      setQuizToDelete(null);
    }
  };

  const handleViewQuestions = (quiz: IQuiz) => {
    navigate(`/quiz/${quiz.id}/questions`);
  };


  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <>
      <PageMeta title="Quizzes das especialidades" description="Listagem de quizzes por especialidade" />
      <PageBreadcrumb pageTitle="Quizzes" />
      { userRole === "admin" || userRole === "director" 
        ?
          <div className="space-y-6">
        <ComponentCard title="Quizzes cadastrados">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <div className="relative w-full sm:w-64">
              <Input
                type="text"
                placeholder="Buscar quiz..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <Button
              size="sm"
              variant="primary"
              startIcon={<PlusIcon />}
              onClick={() => {
                setSelectedQuiz(null);
                setIsOpenModal(true);
              }}
              className="whitespace-nowrap"
            >
              Criar Quiz
            </Button>
          </div>


          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">

              <div className="max-w-full overflow-x-auto">
                {filteredQuizzes.length > 0 ? (
                  <QuizTable
                    quizzes={filteredQuizzes}
                    onDelete={confirmDeleteQuiz}
                    onToggleActive={handleToggleActive}
                    onViewQuestions={handleViewQuestions}
                  />
                ) : (
                  <div className="flex justify-center items-center h-40">
                    <p className="text-center text-gray-500 dark:text-gray-400">Nenhum quiz encontrado.</p>
                  </div>
                )}
              </div>

            </div>
          )}
        </ComponentCard>


        {isOpenModal && (
          <CreateQuizModal
            isOpen={isOpenModal}
            onClose={() => setIsOpenModal(false)}
            onSubmit={handleCreateQuiz}
            isLoading={isLoading}
            specialties={specialties}
            //quiz={selectedQuiz}
          />
        )}


        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteQuiz}
          isLoading={isLoading}
          title="Deletar Quiz"
          message="Tem certeza que deseja deletar este quiz? Esta ação não pode ser desfeita."
        />
          </div>
       :
          <p className="flex justify-center text-xl items-center font-medium text-red-500 mb-2">Tu num pode acessar aqui não doido</p>
      }
    </>
  );
}















// // Quiz.tsx
// import { useEffect, useState } from "react";
// import PageBreadcrumb from "../../components/common/PageBreadCrumb";
// import ComponentCard from "../../components/common/ComponentCard";
// import PageMeta from "../../components/common/PageMeta";
// import Button from "../../components/ui/button/Button";
// import { PlusIcon } from "../../icons";
// import toast from "react-hot-toast";
// import { quizService } from '../../services/quizService'
// import Input from "../../components/form/input/InputField";
// import CreateQuizModal from '../../components/QuizComponents/CreateQuizModal';
// import QuizTable from '../../components/QuizComponents/QuizTable';
// import { useAuth } from "../../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// interface ISpecialty {
//   id: string;
//   name: string;
// }

// interface IQuiz {
//   id: string;
//   title: string;
//   specialtyId: string;
//   specialtyName?: string;
// }

// export default function Quiz() {
//   const [isOpenModal, setIsOpenModal] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [quizzes, setQuizzes] = useState<IQuiz[]>([]);
//   const [specialties, setSpecialties] = useState<ISpecialty[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedQuiz, setSelectedQuiz] = useState<IQuiz | null>(null);

//   const { specialtys } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     loadData();
//     setSpecialties(specialtys);
//   }, [specialtys]);

//   const loadData = async () => {
//     try {
//       const quizzesData = await quizService.ListAllQuiz();
//       setQuizzes(quizzesData);
//     } catch (error) {
//       toast.error("Erro ao carregar dados dos quizzes", {position: 'bottom-right'});
//     }
//   };

//   const handleCreateQuiz = async (specialtyId: string) => {
//     const specialty = specialties.find((s) => s.id === specialtyId);
//     if (!specialty) return;

//     try {
//       setIsLoading(true);
//       const title = `${specialty.name} (Quiz)`;

//       await quizService.createQuiz({ title, specialtyId });
//       toast.success("Quiz criado com sucesso!", {position: 'bottom-right'});
//       await loadData();
//     } catch (error) {
//       toast.error("Erro ao criar quiz", {position: 'bottom-right'});
//     } finally {
//       setIsLoading(false);
//       setIsOpenModal(false);
//     }
//   };

//   const handleDeleteQuiz = async (id: string) => {
//     toast.promise(
//       quizService.deleteQuiz(id).then(() => loadData()),
//       {
//         loading: "Deletando quiz...",
//         success: "Quiz deletado com sucesso!",
//         error: "Erro ao deletar quiz"
//       }, {position: 'bottom-right'}
//     );
//   };

//   const handleEditQuiz = (quiz: IQuiz) => {
//     setSelectedQuiz(quiz);
//     setIsOpenModal(true);
//   };

//   const handleViewQuestions = (quiz: IQuiz) => {
//     navigate(`/quiz/${quiz.id}/questions`);
//   };

//   const filteredQuizzes = quizzes.filter((quiz) =>
//     quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <>
//       <PageMeta title="Quizzes das especialidades" description="Listagem de quizzes por especialidade" />
//       <PageBreadcrumb pageTitle="Quizzes" />
//       <div className="space-y-6">
//         <ComponentCard title="Quizzes cadastrados">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
//             <Input
//               type="text"
//               placeholder="Buscar quiz..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <Button
//               size="sm"
//               variant="primary"
//               startIcon={<PlusIcon />}
//               onClick={() => {
//                 setSelectedQuiz(null);
//                 setIsOpenModal(true);
//               }}
//             >
//               Criar Quiz
//             </Button>
//           </div>

//           <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
//             <div className="max-w-full overflow-x-auto">
//               {filteredQuizzes.length > 0 ? (
//                 <QuizTable
//                   quizzes={filteredQuizzes}
//                   onDelete={handleDeleteQuiz}
//                   onEdit={handleEditQuiz}
//                   onViewQuestions={handleViewQuestions}
//                 />
//               ) : (
//                 <p className="text-center text-gray-500">Nenhum quiz encontrado.</p>
//               )}
//             </div>
//           </div>
//         </ComponentCard>

//         {isOpenModal && (
//           <CreateQuizModal
//             isOpen={isOpenModal}
//             onClose={() => setIsOpenModal(false)}
//             onSubmit={handleCreateQuiz}
//             isLoading={isLoading}
//             specialties={specialties}
//           />
//         )}
//       </div>
//     </>
//   );
// }
