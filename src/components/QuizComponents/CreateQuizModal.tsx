






// import React, { useState, useEffect } from "react";
// import { Dialog, Transition } from "@headlessui/react";
// import { Fragment } from "react";
// import Button from "../ui/button/Button";
// import { MarsIcon } from 'lucide-react'
// import Select from "../form/Select";
// import Switch from "../form/switch/Switch";
// import Input from "../form/input/InputField";


// interface ISpecialty {
//   id: string;
//   name: string;
// }


// interface IQuiz {
//   id: string;
//   title: string;
//   specialtyId: string;
//   is_active: boolean;
// }


// interface CreateQuizModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (data: string | IQuiz) => void;
//   isLoading: boolean;
//   specialties: ISpecialty[];
//   quiz?: IQuiz | null;
// }


// export default function CreateQuizModal({
//   isOpen,
//   onClose,
//   onSubmit,
//   isLoading,
//   specialties,
//   quiz
// }: CreateQuizModalProps) {
//   const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string>("");
//   const [title, setTitle] = useState<string>("");
//   const [isActive, setIsActive] = useState<boolean>(false);


//   useEffect(() => {
//     if (quiz) {
//       setSelectedSpecialtyId(quiz.specialtyId);
//       setTitle(quiz.title);
//       setIsActive(quiz.is_active);
//     }
//   }, [quiz]);


//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (quiz) {
//       onSubmit({
//         ...quiz,
//         title,
//         specialtyId: selectedSpecialtyId,
//         is_active: isActive
//       } as IQuiz);
//     } else {
//       onSubmit(selectedSpecialtyId);
//     }
//   };


//   const isEditMode = !!quiz;


//   return (
//     <Transition appear show={isOpen} as={Fragment}>
//       <Dialog as="div" className="relative z-50" onClose={onClose}>
//         <Transition.Child
//           as={Fragment}
//           enter="ease-out duration-300"
//           enterFrom="opacity-0"
//           enterTo="opacity-100"
//           leave="ease-in duration-200"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//         >
//           <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70" />
//         </Transition.Child>


//         <div className="fixed inset-0 overflow-y-auto">
//           <div className="flex min-h-full items-center justify-center p-4 text-center">
//             <Transition.Child
//               as={Fragment}
//               enter="ease-out duration-300"
//               enterFrom="opacity-0 scale-95"
//               enterTo="opacity-100 scale-100"
//               leave="ease-in duration-200"
//               leaveFrom="opacity-100 scale-100"
//               leaveTo="opacity-0 scale-95"
//             >
//               <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
//                 <div className="flex items-center justify-between mb-4">
//                   <Dialog.Title
//                     as="h3"
//                     className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
//                   >
//                     {isEditMode ? "Editar Quiz" : "Criar Novo Quiz"}
//                   </Dialog.Title>
//                   <button
//                     type="button"
//                     className="inline-flex items-center justify-center rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
//                     onClick={onClose}
//                   >
//                     <MarsIcon className="h-5 w-5" />
//                   </button>
//                 </div>
                
//                 <form onSubmit={handleSubmit}>
//                   <div className="mt-4 space-y-4">
//                     {isEditMode && (
//                       <div className="space-y-2">
//                         <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                           Título
//                         </label>
//                         <Input
//                           type="text"
//                           id="title"
//                           value={title}
//                           onChange={(e) => setTitle(e.target.value)}
//                           aria-required="true"
//                           placeholder="Título do Quiz"
//                         />
//                       </div>
//                     )}
                    
//                     <div className="space-y-2">
//                       <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                         Especialidade
//                       </label>
//                       <Select
//                         options={specialties.map((spec) => ({
//                           label: spec.name,
//                           value: spec.id,
//                         }))}
//                         placeholder="Selecione a especialidade"
//                         className="dark:bg-dark-900"
//                         defaultValue={selectedSpecialtyId}
//                         onChange={(value) => setSelectedSpecialtyId(value)} 
//                       />
//                     </div>
                    
//                     {isEditMode && (
//                       <div className="flex items-center justify-between pt-2">
//                         <label htmlFor="is-active" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                           Status do Quiz
//                         </label>
//                         <div className="flex items-center space-x-2">
//                           <span className="text-sm text-gray-500 dark:text-gray-400">
//                             {isActive ? "Ativo" : "Inativo"}
//                           </span>
//                           <Switch
//                             label="is-active"
//                             defaultChecked={isActive}
//                             onChange={setIsActive}
//                           />
//                         </div>
//                       </div>
//                     )}
//                   </div>


//                   <div className="mt-6 flex justify-end space-x-3">
//                     <Button
//                       //type="button"
//                       //variant="secondary"
//                       size="sm"
//                       onClick={onClose}
//                       disabled={isLoading}
//                     >
//                       Cancelar
//                     </Button>
//                     <Button
//                       //type="submit"
//                       variant="primary"
//                       size="sm"
//                       //isLoading={isLoading}
//                       disabled={isLoading || !selectedSpecialtyId || (isEditMode && !title)}
//                     >
//                       {isEditMode ? "Atualizar" : "Criar"}
//                     </Button>
//                   </div>
//                 </form>
//               </Dialog.Panel>
//             </Transition.Child>
//           </div>
//         </div>
//       </Dialog>
//     </Transition>
//   );
// }












// CreateQuizModal.tsx
import { useState } from "react";
import { Modal } from "../ui/modal";
import Select from "../form/Select";
import Button from "../ui/button/Button";
import Label from "../form/Label";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (specialtyId: string) => void;
  isLoading: boolean;
  specialties: { id: string; name: string }[];
}

export default function CreateQuizModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  specialties,
}: Props) {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!selectedSpecialty) return;
    onSubmit(selectedSpecialty);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="p-5 space-y-4">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-green-500">
            Criar Quiz
          </h4>
          <p className="mb-5 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Para criar o quiz, selecione a especialidade que deseja associar ele
          </p>
        </div>
        <div className="space-y-4 mt-4">
          <Label>Selecione a especialidade</Label>
          <Select
            options={specialties.map((spec) => ({
              label: spec.name,
              value: spec.id,
            }))}
            placeholder="Selecione uma especialidade"
            onChange={(value) => setSelectedSpecialty(value)}
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading || !selectedSpecialty}>
              {isLoading ? "Criando..." : "Criar Quiz"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
