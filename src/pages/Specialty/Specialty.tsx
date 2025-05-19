import { useEffect, useState, useMemo } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { useNavigate } from 'react-router-dom';
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { PlusIcon, EyeIcon, TrashIcon, PencilIcon, CheckIcon, FilterIcon, SearchIcon } from 'lucide-react'
import toast from "react-hot-toast";
import { uploadImage } from "../../services/uploadService";
import { useAuth } from "../../context/AuthContext";
import { specialtyService } from "../../services/specialtyService";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import { quizService } from "../../services/quizService";
import { Transition } from "@headlessui/react";
import { Modal } from "../../components/ui/modal";
import TextArea from "../../components/form/input/TextArea";
import { CategoryIcons } from "./Components/CategoryIcons";
import { CategoryColors } from "./Components/CategoryColors";
import { specialtyUserService } from "../../services/specialtyUserService";
import Label from "../../components/form/Label";


interface ISpecialty {
  id: string;
  category: string;
  codeSpe?: string;
  numberSpe?: string;
  levelSpe?: number | null;
  yearSpe?: string | null;
  name: string;
  emblem?: string;
  requirements: string[];
  createdAt: string;
  updatedAt: string;
}


interface IQuiz {
  id: string;
  specialtyId: string;
  title: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}



interface AssociationSpecialty{
  id: string;
  userId: string;
  specialtyId: string;
  approvalStatus: string;
  report: [];
  rejectionComments: [];
  approvalComments: [];
  isQuizApproved: boolean;
  counselorApproval: boolean;
  counselorApprovalAt: string;
  leadApproval: boolean;
  leadApprovalAt: string;
  directorApproval: boolean;
  directorApprovalAt: string;
  createdAt: string;
  updatedAt: string;
  specialtyUser: {
      name: string;
      photoUrl: string
  },
  specialtyInfo: {
      name: string;
      category: string;
      emblem: string;
  }
}


export default function Specialty() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRequirementsModalOpen, setIsRequirementsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [specialtysData, setSpecialtysData] = useState<ISpecialty[]>([]);
  const [quizzes, setQuizzes] = useState<IQuiz[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<ISpecialty | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "withQuiz">("all");
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const [quizMake, setQuizMake] = useState<AssociationSpecialty[]>([])

  const { findSpecialtys, specialtys, user, userRole } = useAuth();


  const userLogger = user?.user.user
  const navigate = useNavigate();

  // Form states
  const [nameSpecialty, setNameSpecialty] = useState("");
  const [category, setCategory] = useState("");
  const [codigo, setCodigo] = useState("");
  const [numero, setNumero] = useState("");
  const [level, setLevel] = useState<number | null>(null);
  const [year, setYear] = useState("");
  const [requirements, setRequirements] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");


  useEffect(() => {
    fetchQuizzes();
    setSpecialtysData(specialtys);
    fetchQuizMake();
  }, [specialtys]);


  const fetchQuizzes = async () => {
    setIsLoading(true);
    try {
      const data = await quizService.ListAllQuiz();
      setQuizzes(data);
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

  const fetchQuizMake = async () => {
    setIsLoading(true);
    try {
      const data = await specialtyUserService.getAllSpecialtyAssociation()
      setQuizMake(data);
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

  const handleCreateSpecialty = async () => {
    try {
      if (!nameSpecialty || !category) {
        toast.error("Nome e categoria são obrigatórios", { position: 'bottom-right' });
        return;
      }


      setIsLoading(true);


      let uploadedImageUrl;
      if (imageFile) {
        uploadedImageUrl = await uploadImage(imageFile);
      }


      const payload = {
        name: nameSpecialty,
        category,
        emblem: uploadedImageUrl,
        codeSpe: codigo,
        numberSpe: numero,
        levelSpe: level,
        yearSpe: year,
        requirements: requirements ? requirements.split('\n').filter(req => req.trim() !== '') : [],
      };


      await specialtyService.createSpecialty(payload);
      toast.success("Especialidade criada com sucesso!", { position: 'bottom-right' });
      await findSpecialtys();
      resetForm();
      setIsCreateModalOpen(false);
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


  const handleEditSpecialty = async () => {
    if (!selectedSpecialty) return;


    try {
      setIsLoading(true);


      let uploadedImageUrl;
      if (imageFile) {
        uploadedImageUrl = await uploadImage(imageFile);
      }


      const payload = {
        name: nameSpecialty,
        category,
        emblem: uploadedImageUrl || selectedSpecialty.emblem,
        codeSpe: codigo,
        numberSpe: numero,
        levelSpe: level,
        yearSpe: year,
        requirements: requirements ? requirements.split('\n').filter(req => req.trim() !== '') : [],
      };


      await specialtyService.updateSpecialty(selectedSpecialty.id, payload);
      toast.success("Especialidade atualizada com sucesso!", { position: 'bottom-right' });
      await findSpecialtys();
      resetForm();
      setIsEditModalOpen(false);
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


  const handleDeleteSpecialty = async () => {
    if (!selectedSpecialty) return;


    try {
      setIsLoading(true);
      await specialtyService.deleteSpecialty(selectedSpecialty.id);
      toast.success("Especialidade excluída com sucesso!", { position: 'bottom-right' });
      await findSpecialtys();
      setIsDeleteModalOpen(false);
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


  const resetForm = () => {
    setNameSpecialty("");
    setCategory("");
    setCodigo("");
    setNumero("");
    setLevel(null);
    setYear("");
    setRequirements("");
    setImageFile(null);
    setPreviewImage("");
  };


  const prepareEditForm = (specialty: ISpecialty) => {
    setSelectedSpecialty(specialty);
    setNameSpecialty(specialty.name);
    setCategory(specialty.category);
    setCodigo(specialty.codeSpe || "");
    setNumero(specialty.numberSpe || "");
    setLevel(specialty.levelSpe || null);
    setYear(specialty.yearSpe || "");
    setRequirements(specialty.requirements.join('\n'));
    setPreviewImage(specialty.emblem || "");
    setIsEditModalOpen(true);
  };


  const prepareDeleteForm = (specialty: ISpecialty) => {
    setSelectedSpecialty(specialty);
    setIsDeleteModalOpen(true);
  };


  const showRequirements = (specialty: ISpecialty) => {
    setSelectedSpecialty(specialty);
    if (specialty.requirements.length === 0) {
      toast("Esta especialidade não possui requisitos", { icon: 'ℹ️', position: 'bottom-right' });
    } else {
      setIsRequirementsModalOpen(true);
    }
  };


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };


  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };


  // // Process and filter data
  // const filteredSpecialties = useMemo(() => {
  //   let result = specialtysData;


  //   // Filter by search term
  //   if (searchTerm) {
  //     const term = searchTerm.toLowerCase();
  //     result = result.filter(spec => 
  //       spec.name.toLowerCase().includes(term) || 
  //       spec.category.toLowerCase().includes(term) ||
  //       (spec.codeSpe && spec.codeSpe.toLowerCase().includes(term)) ||
  //       (spec.numberSpe && spec.numberSpe.toLowerCase().includes(term))
  //     )
  //   }


  //   // Filter by quiz presence
  //   if (filter === "withQuiz") {
  //     const specialtyIdsWithQuiz = new Set(quizzes.map(quiz => quiz.specialtyId));
  //     result = result.filter(spec => specialtyIdsWithQuiz.has(spec.id));
  //   }


  //   return result;
  // }, [specialtysData, searchTerm, filter, quizzes]);

  // Atualize a parte do filteredSpecialties para incluir a verificação de is_active:


  const filteredSpecialties = useMemo(() => {
    let result = specialtysData;


    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(spec =>
        spec.name.toLowerCase().includes(term) ||
        spec.category.toLowerCase().includes(term) ||
        (spec.codeSpe && spec.codeSpe.toLowerCase().includes(term)) ||
        (spec.numberSpe && spec.numberSpe.toLowerCase().includes(term))
      )
    }


    // Filter by quiz presence with is_active check
    if (filter === "withQuiz") {
      // Cria um Set com os IDs das especialidades que têm quiz ativo
      const specialtyIdsWithActiveQuiz = new Set(
        quizzes
          .filter(quiz => quiz.is_active === true)
          .map(quiz => quiz.specialtyId)
      );
      
      // Filtra as especialidades para incluir apenas aquelas que têm quiz ativo
      result = result.filter(spec => specialtyIdsWithActiveQuiz.has(spec.id));
    }


    return result;
  }, [specialtysData, searchTerm, filter, quizzes]);



  // Group by category
  const groupedByCategory = useMemo(() => {
    const groups: Record<string, ISpecialty[]> = {};


    filteredSpecialties.forEach(specialty => {
      if (!groups[specialty.category]) {
        groups[specialty.category] = [];
      }
      groups[specialty.category].push(specialty);
    });


    return groups;
  }, [filteredSpecialties]);


  // Check if specialty has quiz
  const hasQuiz = (specialtyId: string) => {
    return quizzes.some(quiz => quiz.specialtyId === specialtyId && quiz.is_active === true);
  };

  // Change from async function to regular function that returns boolean
  const hasCompletedQuiz = (userId: string, specialtyId: string) => {
    return quizMake.some(quiz => 
      quiz.userId === userId && 
      quiz.specialtyId === specialtyId && 
      quiz.isQuizApproved
    );
  };


  const handleQuizMake = async (specialtyId: string) => {
    const data = quizzes.filter(quiz => quiz.specialtyId === specialtyId);
    data.forEach(quiz => navigate(`/quiz-attempt/${quiz.id}`));
  };

  // Available categories for select
  const categories = [
    "profissionais",
    "manuais",
    "agricolas",
    "missionarias",
    "recreativas",
    "saude",
    "natureza",
    "domesticas",
    "adra",
    "mestrado"
  ];


  return (
    <>
      <PageMeta
        title="Especialidades do clube de desbravadores"
        description="Registro de todas as especialidades do clube de desbravadores"
      />
        <PageBreadcrumb pageTitle="Especialidades" />
        <div className="space-y-8">
          <ComponentCard title="Especialidades cadastradas">
            {/* Header with search and filters */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div className="relative flex-1 max-w-md w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  className="pl-10 w-full"
                  placeholder="Buscar especialidades..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full sm:w-auto">
                  <Select
                    onChange={(e) => setFilter(e as "all" | "withQuiz")}
                    className="pl-10 w-full sm:w-auto min-w-[180px]"
                    options={[
                      { value: "all", label: "Todas" },
                      { value: "withQuiz", label: "Com Quiz" },
                    ]}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FilterIcon className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                {( userRole === "admin" || userRole === "director" ) && (
                    <Button
                    size="sm"
                    variant="primary"
                    startIcon={<PlusIcon />}
                    className="w-full sm:w-auto"
                    onClick={() => {
                      resetForm();
                      setIsCreateModalOpen(true);
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? "Processando..." : "Nova Especialidade"}
                  </Button>
                )}
                
              </div>
            </div>


            {/* Categories with specialties */}
            <div className="space-y-6">
              {Object.entries(groupedByCategory).map(([category, specialties]) => (
                <div key={category} className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  {/* Category header */}
                  <button
                    className={`flex items-center justify-between w-full p-4 sm:p-5 ${CategoryColors[category] || 'bg-gray-100 dark:bg-gray-800'} text-left`}
                    onClick={() => toggleCategory(category)}
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      {CategoryIcons[category] || <CheckIcon className="h-5 w-5" />}
                      <h3 className="font-semibold capitalize text-gray-900 dark:text-gray-100">{category}</h3>
                      <span className="text-xs bg-white/80 dark:bg-gray-700 px-2 py-1 rounded-full text-gray-700 dark:text-gray-200">
                        {specialties.length} {specialties.length === 1 ? 'especialidade' : 'especialidades'}
                      </span>
                    </div>
                    <svg
                      className={`h-5 w-5 transform transition-transform ${openCategories[category] ? 'rotate-180' : ''} text-gray-700 dark:text-gray-300`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>


                  {/* Specialties list */}
                  <Transition
                    show={openCategories[category] ?? true}
                    enter="transition-opacity duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                      {specialties.map((specialty) => (
                        <div key={specialty.id} className="p-4 sm:p-5 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              {specialty.emblem ? (
                                <img
                                  src={specialty.emblem}
                                  alt={specialty.name}
                                  className="h-12 w-12 object-cover rounded-full border-2 border-gray-200 dark:border-gray-700"
                                />
                              ) : (
                                <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                  <span className="text-xs text-gray-500 dark:text-gray-400">Sem emblema</span>
                                </div>
                              )}
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-gray-100">{specialty.name}</h4>
                                <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-600 dark:text-gray-300">
                                  {specialty.codeSpe && specialty.numberSpe && (
                                    <span>{specialty.codeSpe}-{specialty.numberSpe}</span>
                                  )}
                                  {specialty.levelSpe && (
                                    <span>Nível {specialty.levelSpe}</span>
                                  )}
                                  {specialty.yearSpe && (
                                    <span>{specialty.yearSpe}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-2 mt-3 sm:mt-0 justify-end">
                              <button
                                onClick={() => showRequirements(specialty)}
                                className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                title="Ver requisitos"
                              >
                                <EyeIcon className="h-5 w-5" />
                              </button>
                              
                              {( userRole === "admin" || userRole === "director" ) && (
                                <>
                                    <button
                                    onClick={() => prepareEditForm(specialty)}
                                    className="p-2 text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300 transition-colors rounded-full hover:bg-yellow-50 dark:hover:bg-yellow-900/30"
                                    title="Editar"
                                  >
                                    <PencilIcon className="h-5 w-5" />
                                  </button>
                                  <button
                                    onClick={() => prepareDeleteForm(specialty)}
                                    className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors rounded-full hover:bg-red-50 dark:hover:bg-red-900/30"
                                    title="Excluir"
                                  >
                                    <TrashIcon className="h-5 w-5" />
                                  </button>
                                </>
                              )}
                              
                              {hasQuiz(specialty.id) && userLogger && (
                                hasCompletedQuiz(userLogger.id, specialty.id) ? (
                                  <div className="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 text-xs rounded-full flex items-center whitespace-nowrap">
                                    <CheckIcon className="h-3 w-3 mr-1" />
                                    Quiz concluído
                                  </div>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="primary"
                                    className="text-xs px-3 whitespace-nowrap"
                                    onClick={() => handleQuizMake(specialty.id)}
                                  >
                                    Fazer Quiz
                                  </Button>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Transition>
                </div>
              ))}
            </div>


            {Object.keys(groupedByCategory).length === 0 && (
              <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/30 rounded-xl">
                <div className="flex flex-col items-center justify-center">
                  <SearchIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-3" />
                  <p className="text-gray-600 dark:text-gray-300 font-medium">
                    Nenhuma especialidade encontrada
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    Tente usar outro termo de busca ou filtro
                  </p>
                </div>
              </div>
            )}
          </ComponentCard>
        </div>



      {/* Modal de Criação de Especialidade */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} className="max-w-[700px]">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white dark:bg-gray-900">
          <div className="sticky top-0 z-10 bg-white p-5 pb-2 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <h4 className="mb-2 text-xl md:text-2xl font-semibold text-gray-800 dark:text-white/90">
              Criar Especialidade
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Crie uma nova especialidade
            </p>
          </div>


          <div className="p-5 lg:p-8 pt-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-2">
              <Label>Nome da Especialidade</Label>
              <Input
                value={nameSpecialty}
                onChange={(e) => setNameSpecialty(e.target.value)}
                placeholder="Ex: Apicultura"
              />
            </div>


            <div className="p-2">
              <Label>Categoria</Label>
              <Select
                placeholder="Selecione a categoria"
                onChange={setCategory}
                options={categories.map((cat) => ({
                  value: cat,
                  label: cat.charAt(0).toUpperCase() + cat.slice(1),
                }))}
              />
            </div>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-2">
              <Label>Código</Label>
              <Input
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Ex: AP"
              />
            </div>


            <div className="p-2">
              <Label>Número</Label>
              <Input
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                placeholder="Ex: 004"
              />
            </div>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-2">
              <Label>Nível</Label>
              <Input
                type="number"
                value={level || ""}
                onChange={(e) => setLevel(e.target.value ? parseInt(e.target.value) : null)}
                placeholder="Ex: 1"
              />
            </div>
           
            <div className="p-2">
              <Label>Ano</Label>
              <Input
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Ex: 1929"
              />
            </div>
          </div>


          <div className="p-2">
            <Label>Emblema</Label>
            <div className="flex flex-wrap items-center gap-4">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="h-16 w-16 object-cover rounded-full"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Sem imagem</span>
                </div>
              )}
              <label className="cursor-pointer">
                <span className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                  Selecionar imagem
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>


          <div className="p-2 mt-4">
            <Label>Requisitos</Label>
            <TextArea
              value={requirements}
              onChange={setRequirements}
              rows={4}
              placeholder="Digite os requisitos, um por linha..."
            />
          </div>
         
          <div className="sticky bottom-0 z-10 bg-white p-5 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateSpecialty}
                disabled={isLoading}
              >
                {isLoading ? "Criando..." : "Criar Especialidade"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>


      {/* Modal de Edição de Especialidade */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} className="max-w-[700px]">
        {selectedSpecialty && (
          <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white dark:bg-gray-900">
            <div className="sticky top-0 z-10 bg-white p-5 pb-2 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <h4 className="mb-2 text-xl md:text-2xl font-semibold text-gray-800 dark:text-white/90">
                Editar Especialidade
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Edite essa especialidade
              </p>
            </div>
         
            <div className="p-5 lg:p-8 pt-4 max-h-[70vh] overflow-y-auto">
              <div className="p-2">
                <Label>Nome da especialidade</Label>
                <Input
                  value={nameSpecialty}
                  onChange={(e) => setNameSpecialty(e.target.value)}
                  placeholder="Ex: Apicultura"
                />
              </div>
             
              <div className="p-2">
                <Label>Categoria</Label>
                <Select
                  onChange={setCategory}
                  options={categories.map((cat) => ({
                    value: cat,
                    label: cat.charAt(0).toUpperCase() + cat.slice(1),
                  }))}
                  placeholder="Selecione a categoria"
                />
              </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-2">
                <Label>Código</Label>
                <Input
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  placeholder="Ex: AP"
                />
              </div>
              <div className="p-2">
                <Label>Número</Label>
                <Input
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  placeholder="Ex: 004"
                />
              </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-2">
                <Label>Nível</Label>
                <Input
                  type="number"
                  value={level || ""}
                  onChange={(e) => setLevel(e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="Ex: 1"
                />
              </div>


              <div className="p-2">
                <Label>Ano</Label>
                <Input
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="Ex: 1929"
                />
              </div>
            </div>


            <div className="p-2">
              <Label>Emblema</Label>
              <div className="flex flex-wrap items-center gap-4">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="h-16 w-16 object-cover rounded-full"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Sem imagem</span>
                  </div>
                )}
                <label className="cursor-pointer">
                  <span className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                    Alterar imagem
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>


            <div className="p-2 mt-4">
              <Label>Requisitos</Label>
              <TextArea
                value={requirements}
                onChange={setRequirements}
                rows={4}
                placeholder="Digite os requisitos, um por linha..."
              />
            </div>


            <div className="sticky bottom-0 z-10 bg-white p-5 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={handleEditSpecialty}
                  disabled={isLoading}
                >
                  {isLoading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>


      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} className="max-w-[700px] m-4" >
        {selectedSpecialty && (
          <div className="no-scrollbar relative w-full overflow-y-auto rounded-3xl bg-white p-5 dark:bg-gray-900 lg:p-11">
            <div className="px-2 pr-14">
              <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                Tem certeza que deseja excluir essa especialidade?
              </h4>
              <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                Esta ação não pode ser desfeita
              </p>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                //variant="danger"
                onClick={handleDeleteSpecialty}
                disabled={isLoading}
                //loading={isLoading}
              >
                Confirmar Exclusão
              </Button>
            </div>
          </div>
        )}
      </Modal>


      {/* Requirements Modal */}
      <Modal
        isOpen={isRequirementsModalOpen}
        onClose={() => setIsRequirementsModalOpen(false)}
        //title={`Requisitos - ${selectedSpecialty?.name || 'Especialidade'}`}
      >
        {selectedSpecialty && (
          <div className="space-y-4">
            {selectedSpecialty.requirements.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2">
                {selectedSpecialty.requirements.map((req, index) => (
                  <li key={index} className="text-gray-700 dark:text-gray-300">
                    {req}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                Esta especialidade não possui requisitos cadastrados.
              </p>
            )}
            
            <div className="flex justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => setIsRequirementsModalOpen(false)}
              >
                Fechar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}









































// import { useEffect, useState, useCallback } from "react";
// import PageBreadcrumb from "../../components/common/PageBreadCrumb";
// import ComponentCard from "../../components/common/ComponentCard";
// import PageMeta from "../../components/common/PageMeta";
// import Button from "../../components/ui/button/Button";
// import { PlusIcon, EditIcon, TrashIcon, EyeIcon, PlayIcon, FilterIcon, SearchIcon } from 'lucide-react'
// import toast from "react-hot-toast";
// import { motion, AnimatePresence } from "framer-motion";
// import { uploadImage } from "../../services/uploadService";
// import { useAuth } from "../../context/AuthContext";
// import CreateSpecialtyModal from "../../components/SpecialtyModais/createSpecialtyModal";
// import EditSpecialtyModal from "../../components/SpecialtyModais/editSpecialtyModal";
// import { specialtyService } from "../../services/specialtyService";
// import Input from "../../components/form/input/InputField";
// import Select from "../../components/form/Select";
// import { quizService } from "../../services/quizService";
// import CategoryIcon from './Components/CategoryIcon'
// import DeleteConfirmModal from './Components/DeleteConfirmModal'
// import RequirementsModal from './Components/RequirementsModal'
// import Spinner from './Components/Spinner'


// interface ISpecialty {
//   id: string;
//   category: string;
//   codeSpe?: string;
//   numberSpe?: string;
//   levelSpe?: number;
//   yearSpe?: string;
//   name: string;
//   emblem?: string;
//   requirements: string[];
//   createdAt: string;
//   updatedAt: string;
//   hasQuiz?: boolean;
// }


// interface IQuiz {
//   id: string;
//   specialtyId: string;
//   title: string;
//   createdAt: string;
//   updatedAt: string;
// }


// // Animation variants
// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.1
//     }
//   }
// };


// const itemVariants = {
//   hidden: { y: 20, opacity: 0 },
//   visible: {
//     y: 0,
//     opacity: 1,
//     transition: {
//       type: "spring",
//       stiffness: 200,
//       damping: 20
//     }
//   }
// };


// const categoryVariants = {
//   hidden: { opacity: 0, y: 10 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: {
//       type: "spring",
//       stiffness: 300,
//       damping: 25
//     }
//   }
// };


// export default function Specialty() {
//   const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
//   const [isOpenEditModal, setIsOpenEditModal] = useState(false);
//   const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
//   const [isOpenRequirementsModal, setIsOpenRequirementsModal] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [specialtiesData, setSpecialtiesData] = useState<ISpecialty[]>([]);
//   const [quizzes, setQuizzes] = useState<IQuiz[]>([]);
//   const [selectedSpecialty, setSelectedSpecialty] = useState<ISpecialty | null>(null);
//   const [openCategory, setOpenCategory] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterOption, setFilterOption] = useState("all");
//   const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);


//   const { findSpecialtys, specialtys } = useAuth();


//   const fetchData = useCallback(async () => {
//     setIsLoading(true);
//     try {
//       await findSpecialtys();
//       await fetchQuizzes();
//     } catch (err) {
//       toast.error("Erro ao carregar dados", { position: 'bottom-right' });
//     } finally {
//       setIsLoading(false);
//     }
//   }, [findSpecialtys]);


//   const fetchQuizzes = async () => {
//     try {
//       const data = await quizService.ListAllQuiz();
//       setQuizzes(data);
//     } catch (err) {
//       toast.error("Erro ao carregar Quizzes", { position: 'bottom-right' });
//     }
//   };


//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);


//   useEffect(() => {
//     if (specialtys && quizzes) {
//       const specialtiesWithQuizFlag = specialtys.map(specialty => ({
//         ...specialty,
//         hasQuiz: quizzes.some(quiz => quiz.specialtyId === specialty.id)
//       }));
//       setSpecialtiesData(specialtiesWithQuizFlag);
//     }
//   }, [specialtys, quizzes]);


//   const handleCreateSpecialty = async (data: any) => {
//     try {
//       if (!data.nameSpecialty || !data.category) {
//         toast.error("Todos os campos obrigatórios devem ser preenchidos.", { position: 'bottom-right' });
//         return;
//       }


//       setIsLoading(true);


//       let uploadedImageUrl;
//       if (data.compressedFile) {
//         uploadedImageUrl = await uploadImage(data.compressedFile);
//       }


//       const payload = {
//         name: data.nameSpecialty,
//         category: data.category,
//         emblem: uploadedImageUrl,
//         codeSpe: data.codigo,
//         numberSpe: data.numero,
//         levelSpe: data.level ? parseInt(data.level) : null,
//         yearSpe: data.year,
//         requirements: data.requirements || []
//       };


//       await specialtyService.createSpecialty(payload);
//       toast.success("Especialidade criada com sucesso!", { position: 'bottom-right' });
//       await fetchData();
//       setIsOpenCreateModal(false);
//     } catch (error) {
//       toast.error(`Erro ao criar especialidade: ${error}`, { position: 'bottom-right' });
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   const handleEditSpecialty = async (data: any) => {
//     if (!selectedSpecialty) return;
    
//     try {
//       setIsLoading(true);


//       let uploadedImageUrl = selectedSpecialty.emblem;
//       if (data.compressedFile) {
//         uploadedImageUrl = await uploadImage(data.compressedFile);
//       }


//       const payload = {
//         name: data.nameSpecialty,
//         category: data.category,
//         emblem: uploadedImageUrl,
//         codeSpe: data.codigo,
//         numberSpe: data.numero,
//         levelSpe: data.level ? parseInt(data.level) : null,
//         yearSpe: data.year,
//         requirements: data.requirements || selectedSpecialty.requirements
//       };


//       await specialtyService.updateSpecialty(selectedSpecialty.id, payload);
//       toast.success("Especialidade atualizada com sucesso!", { position: 'bottom-right' });
//       await fetchData();
//       setIsOpenEditModal(false);
//     } catch (error) {
//       toast.error(`Erro ao atualizar especialidade: ${error}`, { position: 'bottom-right' });
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   const handleDeleteSpecialty = async () => {
//     if (!selectedSpecialty) return;
    
//     try {
//       setIsLoading(true);
//       await specialtyService.deleteSpecialty(selectedSpecialty.id);
//       toast.success("Especialidade excluída com sucesso!", { position: 'bottom-right' });
//       await fetchData();
//       setIsOpenDeleteModal(false);
//     } catch (error) {
//       toast.error(`Erro ao excluir especialidade: ${error}`, { position: 'bottom-right' });
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   const handleStartQuiz = async (specialty: ISpecialty) => {
//     try {
//       const quizData = await quizService.listByQuizSpecialty(specialty.id);
//       // Aqui você pode implementar a navegação para a página do quiz
//       toast.success(`Iniciando quiz de ${specialty.name}`, { position: 'bottom-right' });
//       console.log("Quiz data:", quizData);
//     } catch (error) {
//       toast.error(`Erro ao iniciar quiz: ${error}`, { position: 'bottom-right' });
//     }
//   };


//   const handleShowRequirements = (specialty: ISpecialty) => {
//     setSelectedSpecialty(specialty);
//     if (!specialty.requirements || specialty.requirements.length === 0) {
//       toast.error(`A especialidade ${specialty.name} não possui requisitos definidos.`, { position: 'bottom-right' });
//     } else {
//       setIsOpenRequirementsModal(true);
//     }
//   };


//   const toggleMobileFilters = () => {
//     setIsMobileFilterOpen(!isMobileFilterOpen);
//   };


//   const filteredSpecialties = specialtiesData.filter((spec) => {
//     const matchesSearch = spec.name.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesFilter = filterOption === "all" || (filterOption === "quiz" && spec.hasQuiz);
//     return matchesSearch && matchesFilter;
//   });


//   const groupedByCategory = filteredSpecialties.reduce((acc, spec) => {
//     if (!acc[spec.category]) acc[spec.category] = [];
//     acc[spec.category].push(spec);
//     return acc;
//   }, {} as Record<string, ISpecialty[]>);


//   const filterOptions = [
//     { label: "Todas", value: "all" },
//     { label: "Com Quiz", value: "quiz" },
//   ];


//   const toggleCategory = (category: string) => {
//     setOpenCategory(openCategory === category ? null : category);
//   };


//   return (
//     <>
//       <PageMeta
//         title="Especialidades do clube de desbravadores"
//         description="Registro de todas as especialidades do clube de desbravadores"
//       />
//       <PageBreadcrumb pageTitle="Especialidades" />
      
//       <div className="space-y-6">
//         <ComponentCard title="Especialidades cadastradas">
//           {/* Header com busca e filtro - Desktop */}
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
//             <div className="hidden lg:flex lg:flex-row gap-4 w-full lg:w-auto">
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                   <SearchIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
//                 </div>
//                 <Input
//                   type="text"
//                   placeholder="Buscar especialidade..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10 min-w-[250px]"
//                 />
//               </div>
//               <Select
//                 options={filterOptions}
//                 placeholder="Filtrar"
//                 //value={filterOption}
//                 onChange={(value: string) => setFilterOption(value)}
//                 className="w-full sm:w-[150px] dark:bg-dark-900"
//               />
//             </div>
            
//             {/* Mobile Filter Button */}
//             <div className="flex lg:hidden justify-between w-full">
//               <Button
//                 size="sm"
//                 variant="outline"
//                 startIcon={<FilterIcon />}
//                 onClick={toggleMobileFilters}
//                 className="flex-1 mr-2"
//               >
//                 Filtros
//               </Button>
//               <Button
//                 size="sm"
//                 variant="primary"
//                 startIcon={<PlusIcon />}
//                 onClick={() => setIsOpenCreateModal(true)}
//                 disabled={isLoading}
//                 className="flex-1"
//               >
//                 {isLoading ? <Spinner size="sm" /> : "Criar"}
//               </Button>
//             </div>
            
//             {/* Desktop Create Button */}
//             <div className="hidden lg:block">
//               <Button
//                 size="sm"
//                 variant="primary"
//                 startIcon={<PlusIcon />}
//                 onClick={() => setIsOpenCreateModal(true)}
//                 disabled={isLoading}
//               >
//                 {isLoading ? <Spinner size="sm" /> : "Criar Especialidade"}
//               </Button>
//             </div>
//           </div>
          
//           {/* Mobile Filter Panel */}
//           <AnimatePresence>
//             {isMobileFilterOpen && (
//               <motion.div
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: "auto" }}
//                 exit={{ opacity: 0, height: 0 }}
//                 transition={{ duration: 0.3 }}
//                 className="lg:hidden mb-4 p-4 bg-gray-50 dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-gray-700"
//               >
//                 <div className="space-y-4">
//                   <div>
//                     <label htmlFor="mobile-search" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
//                       Buscar
//                     </label>
//                     <div className="relative">
//                       <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                         <SearchIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
//                       </div>
//                       <Input
//                         id="mobile-search"
//                         type="text"
//                         placeholder="Buscar especialidade..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         className="pl-10 w-full"
//                       />
//                     </div>
//                   </div>
//                   <div>
//                     <label htmlFor="mobile-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
//                       Filtrar por
//                     </label>
//                     <Select
//                       //id={}
//                       options={filterOptions}
//                       placeholder="Filtrar"
//                       //value={filterOption}
//                       onChange={(value: string) => setFilterOption(value)}
//                       className="w-full dark:bg-dark-900"
//                     />
//                   </div>
//                   <div className="pt-2">
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       onClick={toggleMobileFilters}
//                       className="w-full"
//                     >
//                       Aplicar
//                     </Button>
//                   </div>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>


//           {isLoading ? (
//             <div className="flex justify-center items-center h-40">
//               <Spinner size="lg" />
//             </div>
//           ) : specialtiesData.length === 0 ? (
//             <motion.div 
//               className="flex flex-col items-center justify-center h-40 text-gray-400 dark:text-gray-500"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.5 }}
//             >
//               <p className="text-lg">Nenhuma especialidade cadastrada</p>
//               <p className="text-sm">Clique em "Criar Especialidade" para adicionar</p>
//             </motion.div>
//           ) : filteredSpecialties.length === 0 ? (
//             <motion.div 
//               className="flex flex-col items-center justify-center h-40 text-gray-400 dark:text-gray-500"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.5 }}
//             >
//               <p className="text-lg">Nenhuma especialidade encontrada</p>
//               <p className="text-sm">Tente modificar seus filtros de busca</p>
//             </motion.div>
//           ) : (
//             <motion.div 
//               className="space-y-4"
//               variants={containerVariants}
//               initial="hidden"
//               animate="visible"
//             >
//               {Object.entries(groupedByCategory).map(([category, specialties], categoryIndex) => (
//                 <motion.div 
//                   key={category}
//                   className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-800"
//                   variants={categoryVariants}
//                   layout
//                   transition={{
//                     layout: { duration: 0.3 }
//                   }}
//                 >
//                   {/* Category Header */}
//                   <motion.button
//                     className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors"
//                     onClick={() => toggleCategory(category)}
//                     whileTap={{ scale: 0.98 }}
//                   >
//                     <div className="flex items-center gap-3">
//                       <CategoryIcon category={category} />
//                       <h3 className="text-lg font-medium capitalize">{category}</h3>
//                       <span className="bg-gray-200 dark:bg-dark-500 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full px-2.5 py-1 inline-flex items-center justify-center min-w-[24px]">
//                         {specialties.length}
//                       </span>
//                     </div>
//                     <motion.svg
//                       className="w-5 h-5"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                       xmlns="http://www.w3.org/2000/svg"
//                       animate={{ rotate: openCategory === category ? 180 : 0 }}
//                       transition={{ duration: 0.3 }}
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
//                     </motion.svg>
//                   </motion.button>


//                   {/* Specialties List */}
//                   <AnimatePresence>
//                     {openCategory === category && (
//                       <motion.div
//                         initial={{ height: 0, opacity: 0 }}
//                         animate={{ height: "auto", opacity: 1 }}
//                         exit={{ height: 0, opacity: 0 }}
//                         transition={{ duration: 0.3 }}
//                         className="overflow-hidden"
//                       >
//                         <motion.div 
//                           className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
//                           variants={containerVariants}
//                           initial="hidden"
//                           animate="visible"
//                         >
//                           {specialties.map((specialty, index) => (
//                             <motion.div
//                               key={specialty.id}
//                               className="relative flex flex-col overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-900 shadow-sm hover:shadow-md transition-shadow"
//                               variants={itemVariants}
//                               whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
//                               transition={{ type: "spring", stiffness: 300 }}
//                               layout
//                             >
//                               <div className="flex items-center p-4 bg-gray-50 dark:bg-dark-700 border-b border-gray-200 dark:border-gray-700">
//                                 {specialty.emblem ? (
//                                   <motion.img
//                                     src={specialty.emblem}
//                                     alt={specialty.name}
//                                     className="w-12 h-12 rounded-full object-cover mr-3 bg-white dark:bg-gray-800 p-1 border border-gray-200 dark:border-gray-600"
//                                     whileHover={{ scale: 1.1 }}
//                                     transition={{ type: "spring", stiffness: 300 }}
//                                   />
//                                 ) : (
//                                   <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 mr-3 flex items-center justify-center">
//                                     <span className="text-gray-500 dark:text-gray-400 font-medium text-lg">
//                                       {specialty.name.charAt(0).toUpperCase()}
//                                     </span>
//                                   </div>
//                                 )}
//                                 <div className="flex-1 overflow-hidden">
//                                   <h4 className="font-medium text-gray-900 dark:text-white truncate" title={specialty.name}>
//                                     {specialty.name}
//                                   </h4>
//                                   <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
//                                     {specialty.codeSpe && specialty.numberSpe && (
//                                       <span>{specialty.codeSpe}-{specialty.numberSpe}</span>
//                                     )}
//                                     {specialty.levelSpe && (
//                                       <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-1.5 py-0.5 rounded">
//                                         Nível {specialty.levelSpe}
//                                       </span>
//                                     )}
//                                     {specialty.yearSpe && (
//                                       <span>Ano: {specialty.yearSpe}</span>
//                                     )}
//                                   </div>
//                                 </div>
//                               </div>
//                               <div className="flex justify-between items-center p-4">
//                                 <span className="text-xs text-gray-500 dark:text-gray-400">
//                                   ID: {specialty.id.substring(0, 8)}...
//                                 </span>
//                                 <div className="flex gap-2">
//                                   <motion.button
//                                     className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-100 dark:bg-dark-700 rounded-full transition-colors"
//                                     onClick={() => handleShowRequirements(specialty)}
//                                     title="Ver requisitos"
//                                     whileHover={{ scale: 1.1 }}
//                                     whileTap={{ scale: 0.9 }}
//                                   >
//                                     <EyeIcon className="w-4 h-4" />
//                                   </motion.button>
//                                   <motion.button
//                                     className="p-1.5 text-yellow-500 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30 rounded-full transition-colors"
//                                     onClick={() => {
//                                       setSelectedSpecialty(specialty);
//                                       setIsOpenEditModal(true);
//                                     }}
//                                     title="Editar especialidade"
//                                     whileHover={{ scale: 1.1 }}
//                                     whileTap={{ scale: 0.9 }}
//                                   >
//                                     <EditIcon className="w-4 h-4" />
//                                   </motion.button>
//                                   <motion.button
//                                     className="p-1.5 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 bg-red-100 dark:bg-red-900/30 rounded-full transition-colors"
//                                     onClick={() => {
//                                       setSelectedSpecialty(specialty);
//                                       setIsOpenDeleteModal(true);
//                                     }}
//                                     title="Excluir especialidade"
//                                     whileHover={{ scale: 1.1 }}
//                                     whileTap={{ scale: 0.9 }}
//                                   >
//                                     <TrashIcon className="w-4 h-4" />
//                                   </motion.button>
//                                 </div>
//                               </div>
//                               {specialty.hasQuiz && (
//                                 <motion.button
//                                   className="absolute top-2 right-2 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white text-xs font-medium py-1 px-2 rounded-full flex items-center gap-1 transition-colors"
//                                   onClick={() => handleStartQuiz(specialty)}
//                                   title="Fazer quiz"
//                                   whileHover={{ scale: 1.05 }}
//                                   whileTap={{ scale: 0.95 }}
//                                   initial={{ opacity: 0, scale: 0.8 }}
//                                   animate={{ opacity: 1, scale: 1 }}
//                                   transition={{ delay: index * 0.05 }}
//                                 >
//                                   <PlayIcon className="w-3 h-3" />
//                                   <span>Fazer</span>
//                                 </motion.button>
//                               )}
//                             </motion.div>
//                           ))}
//                         </motion.div>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </motion.div>
//               ))}
//             </motion.div>
//           )}
//         </ComponentCard>
//       </div>


//       {/* Modais */}
//       <AnimatePresence>
//         {isOpenCreateModal && (
//           <CreateSpecialtyModal
//             isOpen={isOpenCreateModal}
//             loading={isLoading}
//             onClose={() => setIsOpenCreateModal(false)}
//             onSave={handleCreateSpecialty}
//           />
//         )}


//         {isOpenEditModal && selectedSpecialty && (
//           <EditSpecialtyModal
//             isOpen={isOpenEditModal}
//             loading={isLoading}
//             specialty={selectedSpecialty}
//             onClose={() => setIsOpenEditModal(false)}
//             onSave={handleEditSpecialty}
//           />
//         )}


//         {isOpenDeleteModal && selectedSpecialty && (
//           <DeleteConfirmModal
//             isOpen={isOpenDeleteModal}
//             loading={isLoading}
//             specialtyName={selectedSpecialty.name}
//             onClose={() => setIsOpenDeleteModal(false)}
//             onConfirm={handleDeleteSpecialty}
//           />
//         )}


//         {isOpenRequirementsModal && selectedSpecialty && (
//           <RequirementsModal
//             isOpen={isOpenRequirementsModal}
//             specialty={selectedSpecialty}
//             onClose={() => setIsOpenRequirementsModal(false)}
//           />
//         )}
//       </AnimatePresence>
//     </>
//   );
// }










































// import { useEffect, useState } from "react";
// import PageBreadcrumb from "../../components/common/PageBreadCrumb";
// import ComponentCard from "../../components/common/ComponentCard";
// import PageMeta from "../../components/common/PageMeta";
// import Button from "../../components/ui/button/Button";
// import { PlusIcon, EditIcon, TrashIcon, EyeIcon, PlayIcon } from "lucide-react";
// import toast from "react-hot-toast";
// import { motion, AnimatePresence } from "framer-motion";
// import { uploadImage } from "../../services/uploadService";
// import { useAuth } from "../../context/AuthContext";
// import CreateSpecialtyModal from "../../components/SpecialtyModais/createSpecialtyModal";
// import EditSpecialtyModal from "../../components/SpecialtyModais/editSpecialtyModal";
// import DeleteConfirmModal from "../../components/SpecialtyModais/deleteConfirmModal";
// import RequirementsModal from "../../components/SpecialtyModais/requirementsModal";
// import { specialtyService } from "../../services/specialtyService";
// import Input from "../../components/form/input/InputField";
// import Select from "../../components/form/Select";
// import { quizService } from "../../services/quizService";
// import CategoryIcon from "./Components/CategoryIcon";
// import { LoadingSpinner } from "../../components/ui/loading/loading";


// interface ISpecialty {
//   id: string;
//   category: string;
//   codeSpe?: string;
//   numberSpe?: string;
//   levelSpe?: number;
//   yearSpe?: string;
//   name: string;
//   emblem?: string;
//   requirements: string[];
//   createdAt: string;
//   updatedAt: string;
//   hasQuiz?: boolean;
// }


// interface IQuiz {
//   id: string;
//   specialtyId: string;
//   title: string;
//   createdAt: string;
//   updatedAt: string;
// }


// export default function Specialty() {
//   const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
//   const [isOpenEditModal, setIsOpenEditModal] = useState(false);
//   const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
//   const [isOpenRequirementsModal, setIsOpenRequirementsModal] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [specialtiesData, setSpecialtiesData] = useState<ISpecialty[]>([]);
//   const [quizzes, setQuizzes] = useState<IQuiz[]>([]);
//   const [selectedSpecialty, setSelectedSpecialty] = useState<ISpecialty | null>(null);
//   const [openCategory, setOpenCategory] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterOption, setFilterOption] = useState("all");


//   const { findSpecialtys, specialtys } = useAuth();


//   useEffect(() => {
//     fetchData();
//   }, []);


//   useEffect(() => {
//     if (specialtys && quizzes) {
//       const specialtiesWithQuizFlag = specialtys.map(specialty => ({
//         ...specialty,
//         hasQuiz: quizzes.some(quiz => quiz.specialtyId === specialty.id)
//       }));
//       setSpecialtiesData(specialtiesWithQuizFlag);
//     }
//   }, [specialtys, quizzes]);


//   const fetchData = async () => {
//     setIsLoading(true);
//     try {
//       await findSpecialtys();
//       await fetchQuizzes();
//     } catch (err) {
//       toast.error("Erro ao carregar dados", { position: 'bottom-right' });
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   const fetchQuizzes = async () => {
//     try {
//       const data = await quizService.ListAllQuiz();
//       setQuizzes(data);
//     } catch (err) {
//       toast.error("Erro ao carregar Quizzes", { position: 'bottom-right' });
//     }
//   };


//   const handleCreateSpecialty = async (data: any) => {
//     try {
//       if (!data.nameSpecialty || !data.category) {
//         toast.error("Todos os campos obrigatórios devem ser preenchidos.", { position: 'bottom-right' });
//         return;
//       }


//       setIsLoading(true);


//       let uploadedImageUrl;
//       if (data.compressedFile) {
//         uploadedImageUrl = await uploadImage(data.compressedFile);
//       }


//       const payload = {
//         name: data.nameSpecialty,
//         category: data.category,
//         emblem: uploadedImageUrl,
//         codeSpe: data.codigo,
//         numberSpe: data.numero,
//         levelSpe: data.level ? parseInt(data.level) : null,
//         yearSpe: data.year,
//         requirements: data.requirements || []
//       };


//       await specialtyService.createSpecialty(payload);
//       toast.success("Especialidade criada com sucesso!", { position: 'bottom-right' });
//       await fetchData();
//       setIsOpenCreateModal(false);
//     } catch (error) {
//       toast.error(`Erro ao criar especialidade: ${error}`, { position: 'bottom-right' });
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   const handleEditSpecialty = async (data: any) => {
//     if (!selectedSpecialty) return;
    
//     try {
//       setIsLoading(true);


//       let uploadedImageUrl = selectedSpecialty.emblem;
//       if (data.compressedFile) {
//         uploadedImageUrl = await uploadImage(data.compressedFile);
//       }


//       const payload = {
//         name: data.nameSpecialty,
//         category: data.category,
//         emblem: uploadedImageUrl,
//         codeSpe: data.codigo,
//         numberSpe: data.numero,
//         levelSpe: data.level ? parseInt(data.level) : null,
//         yearSpe: data.year,
//         requirements: data.requirements || selectedSpecialty.requirements
//       };


//       await specialtyService.updateSpecialty(selectedSpecialty.id, payload);
//       toast.success("Especialidade atualizada com sucesso!", { position: 'bottom-right' });
//       await fetchData();
//       setIsOpenEditModal(false);
//     } catch (error) {
//       toast.error(`Erro ao atualizar especialidade: ${error}`, { position: 'bottom-right' });
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   const handleDeleteSpecialty = async () => {
//     if (!selectedSpecialty) return;
    
//     try {
//       setIsLoading(true);
//       await specialtyService.deleteSpecialty(selectedSpecialty.id);
//       toast.success("Especialidade excluída com sucesso!", { position: 'bottom-right' });
//       await fetchData();
//       setIsOpenDeleteModal(false);
//     } catch (error) {
//       toast.error(`Erro ao excluir especialidade: ${error}`, { position: 'bottom-right' });
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   const handleStartQuiz = async (specialty: ISpecialty) => {
//     try {
//       const quizData = await quizService.listByQuizSpecialty(specialty.id);
//       // Aqui você pode implementar a navegação para a página do quiz
//       toast.success(`Iniciando quiz de ${specialty.name}`, { position: 'bottom-right' });
//       console.log("Quiz data:", quizData);
//     } catch (error) {
//       toast.error(`Erro ao iniciar quiz: ${error}`, { position: 'bottom-right' });
//     }
//   };


//   const handleShowRequirements = (specialty: ISpecialty) => {
//     setSelectedSpecialty(specialty);
//     if (!specialty.requirements || specialty.requirements.length === 0) {
//       toast.error(`A especialidade ${specialty.name} não possui requisitos definidos.`, { position: 'bottom-right' });
//     } else {
//       setIsOpenRequirementsModal(true);
//     }
//   };


//   const filteredSpecialties = specialtiesData.filter((spec) => {
//     const matchesSearch = spec.name.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesFilter = filterOption === "all" || (filterOption === "quiz" && spec.hasQuiz);
//     return matchesSearch && matchesFilter;
//   });


//   const groupedByCategory = filteredSpecialties.reduce((acc, spec) => {
//     if (!acc[spec.category]) acc[spec.category] = [];
//     acc[spec.category].push(spec);
//     return acc;
//   }, {} as Record<string, ISpecialty[]>);


//   const filterOptions = [
//     { label: "Todas", value: "all" },
//     { label: "Com Quiz", value: "quiz" },
//   ];


//   const toggleCategory = (category: string) => {
//     setOpenCategory(openCategory === category ? null : category);
//   };


//   return (
//     <>
//       <PageMeta
//         title="Especialidades do clube de desbravadores"
//         description="Registro de todas as especialidades do clube de desbravadores"
//       />
//       <PageBreadcrumb pageTitle="Especialidades" />
      
//       <div className="space-y-6">
//         <ComponentCard title="Especialidades cadastradas">
//           {/* Header com busca e filtro */}
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
//             <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
//               <Input
//                 type="text"
//                 placeholder="Buscar especialidade..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="min-w-[200px]"
//               />
//               <Select
//                 options={filterOptions}
//                 placeholder="Filtrar"
//                 value={filterOption}
//                 onChange={(value: string) => setFilterOption(value)}
//                 className="w-full sm:w-[150px] dark:bg-dark-900"
//               />
//             </div>
//             <Button
//               size="sm"
//               variant="primary"
//               startIcon={<PlusIcon />}
//               onClick={() => setIsOpenCreateModal(true)}
//               disabled={isLoading}
//             >
//               {isLoading ? 
//               <LoadingSpinner 
//                 //size="sm" 
//               /> 
//               : 
//                 "Criar Especialidade"
//               }
//             </Button>
//           </div>


//           {isLoading ? (
//             <div className="flex justify-center items-center h-40">
//               <LoadingSpinner 
//                 //size="lg" 
//               />
//             </div>
//           ) : specialtiesData.length === 0 ? (
//             <div className="flex flex-col items-center justify-center h-40 text-gray-400 dark:text-gray-500">
//               <p className="text-lg">Nenhuma especialidade cadastrada</p>
//               <p className="text-sm">Clique em "Criar Especialidade" para adicionar</p>
//             </div>
//           ) : filteredSpecialties.length === 0 ? (
//             <div className="flex flex-col items-center justify-center h-40 text-gray-400 dark:text-gray-500">
//               <p className="text-lg">Nenhuma especialidade encontrada</p>
//               <p className="text-sm">Tente modificar seus filtros de busca</p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {Object.entries(groupedByCategory).map(([category, specialties]) => (
//                 <div 
//                   key={category}
//                   className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-800"
//                 >
//                   {/* Category Header */}
//                   <motion.button
//                     className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors"
//                     onClick={() => toggleCategory(category)}
//                     whileTap={{ scale: 0.98 }}
//                   >
//                     <div className="flex items-center gap-3">
//                       <CategoryIcon category={category} />
//                       <h3 className="text-lg font-medium capitalize">{category}</h3>
//                       <span className="bg-gray-200 dark:bg-dark-500 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full px-2 py-1">
//                         {specialties.length}
//                       </span>
//                     </div>
//                     <svg
//                       className={`w-5 h-5 transition-transform ${openCategory === category ? 'rotate-180' : ''}`}
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
//                     </svg>
//                   </motion.button>


//                   {/* Specialties List */}
//                   <AnimatePresence>
//                     {openCategory === category && (
//                       <motion.div
//                         initial={{ height: 0, opacity: 0 }}
//                         animate={{ height: "auto", opacity: 1 }}
//                         exit={{ height: 0, opacity: 0 }}
//                         transition={{ duration: 0.3 }}
//                         className="overflow-hidden"
//                       >
//                         <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                           {specialties.map((specialty) => (
//                             <motion.div
//                               key={specialty.id}
//                               className="relative flex flex-col overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-900 shadow-sm hover:shadow-md transition-shadow"
//                               whileHover={{ y: -5 }}
//                               transition={{ type: "spring", stiffness: 300 }}
//                             >
//                               <div className="flex items-center p-4 bg-gray-50 dark:bg-dark-700 border-b border-gray-200 dark:border-gray-700">
//                                 {specialty.emblem && (
//                                   <img
//                                     src={specialty.emblem}
//                                     alt={specialty.name}
//                                     className="w-12 h-12 rounded-full object-cover mr-3 bg-white dark:bg-gray-800 p-1"
//                                   />
//                                 )}
//                                 <div className="flex-1">
//                                   <h4 className="font-medium text-gray-900 dark:text-white">{specialty.name}</h4>
//                                   <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
//                                     {specialty.codeSpe && specialty.numberSpe && (
//                                       <span>{specialty.codeSpe}-{specialty.numberSpe}</span>
//                                     )}
//                                     {specialty.levelSpe && (
//                                       <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-1.5 py-0.5 rounded">
//                                         Nível {specialty.levelSpe}
//                                       </span>
//                                     )}
//                                     {specialty.yearSpe && (
//                                       <span>Ano: {specialty.yearSpe}</span>
//                                     )}
//                                   </div>
//                                 </div>
//                               </div>
//                               <div className="flex justify-between items-center p-4">
//                                 <span className="text-xs text-gray-500 dark:text-gray-400">
//                                   ID: {specialty.id.substring(0, 8)}...
//                                 </span>
//                                 <div className="flex gap-2">
//                                   <button
//                                     className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-100 dark:bg-dark-700 rounded-full transition-colors"
//                                     onClick={() => handleShowRequirements(specialty)}
//                                     title="Ver requisitos"
//                                   >
//                                     <EyeIcon className="w-4 h-4" />
//                                   </button>
//                                   <button
//                                     className="p-1.5 text-yellow-500 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30 rounded-full transition-colors"
//                                     onClick={() => {
//                                       setSelectedSpecialty(specialty);
//                                       setIsOpenEditModal(true);
//                                     }}
//                                     title="Editar especialidade"
//                                   >
//                                     <EditIcon className="w-4 h-4" />
//                                   </button>
//                                   <button
//                                     className="p-1.5 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 bg-red-100 dark:bg-red-900/30 rounded-full transition-colors"
//                                     onClick={() => {
//                                       setSelectedSpecialty(specialty);
//                                       setIsOpenDeleteModal(true);
//                                     }}
//                                     title="Excluir especialidade"
//                                   >
//                                     <TrashIcon className="w-4 h-4" />
//                                   </button>
//                                 </div>
//                               </div>
//                               {specialty.hasQuiz && (
//                                 <button
//                                   className="absolute top-2 right-2 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white text-xs font-medium py-1 px-2 rounded-full flex items-center gap-1 transition-colors"
//                                   onClick={() => handleStartQuiz(specialty)}
//                                   title="Fazer quiz"
//                                 >
//                                   <PlayIcon className="w-3 h-3" />
//                                   <span>Fazer</span>
//                                 </button>
//                               )}
//                             </motion.div>
//                           ))}
//                         </div>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>
//               ))}
//             </div>
//           )}
//         </ComponentCard>
//       </div>


//       {/* Modais */}
//       {isOpenCreateModal && (
//         <CreateSpecialtyModal
//           isOpen={isOpenCreateModal}
//           loading={isLoading}
//           onClose={() => setIsOpenCreateModal(false)}
//           onSave={handleCreateSpecialty}
//         />
//       )}


//       {isOpenEditModal && selectedSpecialty && (
//         <EditSpecialtyModal
//           isOpen={isOpenEditModal}
//           loading={isLoading}
//           specialty={selectedSpecialty}
//           onClose={() => setIsOpenEditModal(false)}
//           onSave={handleEditSpecialty}
//         />
//       )}


//       {isOpenDeleteModal && selectedSpecialty && (
//         <DeleteConfirmModal
//           isOpen={isOpenDeleteModal}
//           loading={isLoading}
//           specialtyName={selectedSpecialty.name}
//           onClose={() => setIsOpenDeleteModal(false)}
//           onConfirm={handleDeleteSpecialty}
//         />
//       )}


//       {isOpenRequirementsModal && selectedSpecialty && (
//         <RequirementsModal
//           isOpen={isOpenRequirementsModal}
//           specialty={selectedSpecialty}
//           onClose={() => setIsOpenRequirementsModal(false)}
//         />
//       )}
//     </>
//   );
// }
































// import { useEffect, useState } from "react";
// import PageBreadcrumb from "../../components/common/PageBreadCrumb";
// import ComponentCard from "../../components/common/ComponentCard";
// import PageMeta from "../../components/common/PageMeta";
// import Button from "../../components/ui/button/Button";
// import { PlusIcon, FilterIcon, SearchIcon } from "lucide-react";
// import toast from "react-hot-toast";
// import { specialtyService } from "../../services/specialtyService";
// import { quizService } from "../../services/quizService";
// import { useAuth } from "../../context/AuthContext";
// import Input from "../../components/form/input/InputField";
// import Select from "../../components/form/Select";
// import SpecialtyCategoryList from "../../components/specialty/SpecialtyCategoryList";
// import CreateSpecialtyModal from "../../components/specialty/CreateSpecialtyModal";
// import EditSpecialtyModal from "../../components/specialty/EditSpecialtyModal";
// import DeleteConfirmModal from "../../components/specialty/DeleteConfirmModal";
// import RequirementsModal from "../../components/specialty/RequirementsModal";
// import { Transition } from "@headlessui/react";

// interface Quiz {
//   id: string;
//   specialtyId: string;
//   title: string;
//   createdAt: string
//   updatedAt: string
// }

// interface Specialty {
//   id: string;
//   category: string;
//   codeSpe: string
//   numberSpe: string
//   levelSpe: string
//   yearSpe: string
//   name: string
//   emblem: string
//   requirements: string
//   createdAt: string
//   updatedAt: string
// }

// export default function SpecialtyPage() {
//   const [specialties, setSpecialties] = useState<Specialty[]>([]);
//   const [quizzes, setQuizzes] = useState<Quiz[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterOption, setFilterOption] = useState("all");
  
//   // Modals state
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [isRequirementsModalOpen, setIsRequirementsModalOpen] = useState(false);
//   const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);


//   const { findSpecialtys, specialtys } = useAuth();


//   useEffect(() => {
//     fetchData();
//   }, []);


//   useEffect(() => {
//     if (specialtys?.length > 0) {
//       processSpecialties(specialtys);
//     }
//   }, [specialtys, quizzes]);


//   const fetchData = async () => {
//     setIsLoading(true);
//     try {
//       await Promise.all([
//         findSpecialtys(),
//         fetchQuizzes()
//       ]);
//     } catch (error) {
//       toast.error("Erro ao carregar dados", { position: 'bottom-right' });
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   const fetchQuizzes = async () => {
//     try {
//       const data = await quizService.ListAllQuiz();
//       setQuizzes(data);
//       return data;
//     } catch (error) {
//       toast.error("Erro ao carregar quizzes", { position: 'bottom-right' });
//       return [];
//     }
//   };


//   const processSpecialties = (specs: Specialty[], quizData = quizzes) => {
//     const processedSpecs = specs.map(spec => {
//       const hasQuiz = quizData.some(quiz => quiz.specialtyId === spec.id);
//       return { ...spec, hasQuiz };
//     });
//     setSpecialties(processedSpecs);
//   };


//   const handleCreateSpecialty = async (data: any) => {
//     setIsLoading(true);
//     try {
//       await specialtyService.createSpecialty(data);
//       toast.success("Especialidade criada com sucesso!", { position: 'bottom-right' });
//       setIsCreateModalOpen(false);
//       await fetchData();
//     } catch (error) {
//       toast.error("Erro ao criar especialidade", { position: 'bottom-right' });
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   const handleEditSpecialty = async (data: any) => {
//     if (!selectedSpecialty) return;
    
//     setIsLoading(true);
//     try {
//       await specialtyService.updateSpecialty(selectedSpecialty.id, data);
//       toast.success("Especialidade atualizada com sucesso!", { position: 'bottom-right' });
//       setIsEditModalOpen(false);
//       await fetchData();
//     } catch (error) {
//       toast.error("Erro ao atualizar especialidade", { position: 'bottom-right' });
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   const handleDeleteSpecialty = async () => {
//     if (!selectedSpecialty) return;
    
//     setIsLoading(true);
//     try {
//       await specialtyService.deleteSpecialty(selectedSpecialty.id);
//       toast.success("Especialidade excluída com sucesso!", { position: 'bottom-right' });
//       setIsDeleteModalOpen(false);
//       await fetchData();
//     } catch (error) {
//       toast.error("Erro ao excluir especialidade", { position: 'bottom-right' });
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   const openEditModal = (specialty: Specialty) => {
//     setSelectedSpecialty(specialty);
//     setIsEditModalOpen(true);
//   };


//   const openDeleteModal = (specialty: Specialty) => {
//     setSelectedSpecialty(specialty);
//     setIsDeleteModalOpen(true);
//   };


//   const openRequirementsModal = (specialty: Specialty) => {
//     setSelectedSpecialty(specialty);
//     if (specialty.requirements && specialty.requirements.length > 0) {
//       setIsRequirementsModalOpen(true);
//     } else {
//       toast.error("Esta especialidade não possui requisitos", { position: 'bottom-right' });
//     }
//   };


//   const filteredSpecialties = specialties.filter(specialty => {
//     const matchesSearch = specialty.name.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesFilter = filterOption === "all" || (filterOption === "withQuiz" && specialty.hasQuiz);
//     return matchesSearch && matchesFilter;
//   });


//   const filterOptions = [
//     { label: "Todas especialidades", value: "all" },
//     { label: "Apenas com Quiz", value: "withQuiz" },
//   ];


//   return (
//     <>
//       <PageMeta
//         title="Especialidades | Clube de Desbravadores"
//         description="Catálogo de especialidades do clube de desbravadores"
//       />
//       <PageBreadcrumb pageTitle="Especialidades" />
      
//       <Transition
//         appear={true}
//         show={true}
//         enter="transition-opacity duration-500"
//         enterFrom="opacity-0"
//         enterTo="opacity-100"
//       >
//         <div className="space-y-6">
//           <ComponentCard title="Catálogo de Especialidades">
//             {/* Header com pesquisa, filtro e botão de adicionar */}
//             <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
//               <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
//                 <div className="relative w-full sm:w-64">
//                   <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
//                   <Input
//                     type="text"
//                     placeholder="Buscar especialidade..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="pl-10"
//                   />
//                 </div>
//                 <div className="w-full sm:w-64 flex">
//                   <FilterIcon className="mr-2 h-5 w-5 text-gray-400 dark:text-gray-500 self-center" />
//                   <Select
//                     options={filterOptions}
//                     placeholder="Filtrar"
//                     defaultValue={filterOption}
//                     onChange={(value: string) => setFilterOption(value)}
//                     className="w-full dark:bg-dark-900"
//                   />
//                 </div>
//               </div>
//               <Button
//                 size="md"
//                 variant="primary"
//                 startIcon={<PlusIcon />}
//                 onClick={() => setIsCreateModalOpen(true)}
//                 disabled={isLoading}
//                 className="whitespace-nowrap"
//               >
//                 Nova Especialidade
//               </Button>
//             </div>


//             {/* Exibição das especialidades por categoria */}
//             <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/30">
//               {isLoading ? (
//                 <div className="flex justify-center items-center h-64">
//                   <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
//                 </div>
//               ) : filteredSpecialties.length > 0 ? (
//                 <SpecialtyCategoryList
//                   specialties={filteredSpecialties}
//                   onEditClick={openEditModal}
//                   onDeleteClick={openDeleteModal}
//                   onViewRequirements={openRequirementsModal}
//                 />
//               ) : (
//                 <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
//                   <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//                   </svg>
//                   <p className="text-lg">Nenhuma especialidade encontrada</p>
//                 </div>
//               )}
//             </div>
//           </ComponentCard>
//         </div>
//       </Transition>


//       {/* Modais */}
//       {isCreateModalOpen && (
//         <CreateSpecialtyModal
//           isOpen={isCreateModalOpen}
//           loading={isLoading}
//           onClose={() => setIsCreateModalOpen(false)}
//           onSave={handleCreateSpecialty}
//         />
//       )}
      
//       {isEditModalOpen && selectedSpecialty && (
//         <EditSpecialtyModal
//           isOpen={isEditModalOpen}
//           loading={isLoading}
//           specialty={selectedSpecialty}
//           onClose={() => setIsEditModalOpen(false)}
//           onSave={handleEditSpecialty}
//         />
//       )}
      
//       {isDeleteModalOpen && selectedSpecialty && (
//         <DeleteConfirmModal
//           isOpen={isDeleteModalOpen}
//           loading={isLoading}
//           specialty={selectedSpecialty}
//           onClose={() => setIsDeleteModalOpen(false)}
//           onConfirm={handleDeleteSpecialty}
//         />
//       )}
      
//       {isRequirementsModalOpen && selectedSpecialty && (
//         <RequirementsModal
//           isOpen={isRequirementsModalOpen}
//           specialty={selectedSpecialty}
//           onClose={() => setIsRequirementsModalOpen(false)}
//         />
//       )}
//     </>
//   );
// }


// import { useEffect, useState } from "react";
// import PageBreadcrumb from "../../components/common/PageBreadCrumb";
// import ComponentCard from "../../components/common/ComponentCard";
// import PageMeta from "../../components/common/PageMeta";
// import Button from "../../components/ui/button/Button";
// import { PlusIcon } from "../../icons";
// import toast from "react-hot-toast";
// import { uploadImage } from "../../services/uploadService";
// import { useAuth } from "../../context/AuthContext";
// import { specialtyService } from "../../services/specialtyService";
// import SpecialtyTable from "../../components/SpecialtyModais/specialtyTable";
// import Input from "../../components/form/input/InputField";
// import Select from "../../components/form/Select";
// import { quizService } from "../../services/quizService";
// import { Transition } from "@headlessui/react";

// interface ISpecialty {
//   id: string;
//   category: string;
//   codeSpe?: string;
//   numberSpe?: string;
//   levelSpe?: number;
//   yearSpe?: string;
//   name: string;
//   emblem?: string;
//   requirements: string[];
//   createdAt: string;
//   updatedAt: string;
// }

// interface IQuiz {
//   id: string;
//   specialtyId: string;
//   title: string;
//   createdAt: string;
//   updatedAt: string
// }

// export default function Specialty() {
//   const [isOpenModal, setIsOpenModal] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [specialtysData, setSpecialtysData] = useState<ISpecialty[]>([]);
//   const [openCategory, setOpenCategory] = useState<string | null>(null);
//   const [quizzes, setQuizzes] = useState<IQuiz[]>([]);
//   const [quiz, setQuiz] = useState(false);

//   const { findSpecialtys, specialtys } = useAuth();

//   useEffect(() => {
//     fetchQuizzes()
//     setSpecialtysData(specialtys);
//   }, [specialtys]);

//   const fetchQuizzes = async () => {
//     setIsLoading(true);
//     try {
//       const data = await quizService.ListAllQuiz();
//       setQuizzes(data);
//     } catch (err) {
//       toast.error("Erro ao carregar Quizzes", {position: 'bottom-right'});
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCreateSpecialty = async (data: any) => {
//     try {
//       if (!data.nameSpecialty || !data.category) {
//         toast.error("Todos os campos obrigatórios devem ser preenchidos.", {position: 'bottom-right'});
//         return;
//       }
//       setIsLoading(true);

//       let uploadedImageUrl;
//       if (data.compressedFile) {
//         uploadedImageUrl = await uploadImage(data.compressedFile);
//       }
//       const payload = {
//         name: data.nameSpecialty,
//         category: data.category,
//         emblem: uploadedImageUrl,
//         codeSpe: data.codigo,
//         numberSpe: data.numero,
//         levelSpe: data.level,
//         yearSpe: data.year,
//       };

//       await specialtyService.createSpecialty(payload);
//       toast.success("Especialidade criada com sucesso!", {position: 'bottom-right'});
//       await findSpecialtys();
//       setIsOpenModal(false);
//     } catch (error) {
//       toast.error(`Erro: ${error}`, {position: 'bottom-right'});
//     } finally {
//       setIsOpenModal(false);
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       <PageMeta
//         title="Especialidades do clube de desbravadores"
//         description="Registro de todas as especialidades do clube de desbravadores"
//       />
//       <PageBreadcrumb pageTitle="Especialidades" />
//       <div className="space-y-6">
//         <ComponentCard title="Especialidades cadastradas">
//           {/* Header com busca e filtro */}
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
//             <Button
//               size="sm"
//               variant="primary"
//               startIcon={<PlusIcon />}
//               onClick={() => setIsOpenModal(true)}
//             >
//               {isLoading ? "Criando..." : "Criar Especialidade"}
//             </Button>
//           </div>
//           <Transition
//             appear={true}
//             show={true}
//             enter="transition-opacity duration-500"
//             enterFrom="opacity-0"
//             enterTo="opacity-100"
//           >
//           {/* Agrupamento por categoria com dropdown */}
//           <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
//             <div className="max-w-full overflow-x-auto">
//               {specialtysData.length > 0 ? (
//                 <SpecialtyTable
//                   groupedByCategory={groupedByCategory}
//                   openCategory={openCategory}
//                   setOpenCategory={setOpenCategory}
//                   onEdit={(spec) => console.log("Editar", spec)}
//                   onDelete={(id) => console.log("Excluir", id)}
//                   onStartQuiz={(spec) => console.log("Iniciar quiz", spec)}
//                 />
//               ) : (
//                 <p className="text-center text-gray-500">Nenhuma Especialidade cadastrada.</p>
//               )}
//             </div>
//           </div>
//         </ComponentCard>
//        {/* Modais */}
//        {isCreateModalOpen && (
//          <CreateSpecialtyModal
//            isOpen={isCreateModalOpen}
//            loading={isLoading}
//            onClose={() => setIsCreateModalOpen(false)}
//            onSave={handleCreateSpecialty}
//          />
//        )}
      
//        {isEditModalOpen && selectedSpecialty && (
//          <EditSpecialtyModal
//            isOpen={isEditModalOpen}
//            loading={isLoading}
//            specialty={selectedSpecialty}
//            onClose={() => setIsEditModalOpen(false)}
//            onSave={handleEditSpecialty}
//          />
//        )}
      
//        {isDeleteModalOpen && selectedSpecialty && (
//          <DeleteConfirmModal
//            isOpen={isDeleteModalOpen}
//            loading={isLoading}
//            specialty={selectedSpecialty}
//            onClose={() => setIsDeleteModalOpen(false)}
//            onConfirm={handleDeleteSpecialty}
//          />
//        )}
      
//        {isRequirementsModalOpen && selectedSpecialty && (
//          <RequirementsModal
//            isOpen={isRequirementsModalOpen}
//            specialty={selectedSpecialty}
//            onClose={() => setIsRequirementsModalOpen(false)}
//          />
//        )}
//       </div>
//     </>
//   );
// }
