// import { useState } from "react";
// import { Modal } from '../../components/ui/modal'
// import Button from '../../components/ui/button/Button'
// import Input from '../../components/form/input/InputField'
// import Select from '../../components/form/Select'
// import ImageUploader from "../../ui/form/ImageUploader";
// import { ISpecialty } from "../../../types/specialty";

// type Props = {
//   isOpen: boolean;
//   onClose: () => void;
//   onSave: (data: any) => void;
//   specialty: ISpecialty;
//   loading: boolean;
// };

// export default function EditSpecialtyModal({
//   isOpen,
//   onClose,
//   onSave,
//   specialty,
//   loading,
// }: Props) {
//   const [formData, setFormData] = useState({
//     nameSpecialty: specialty.name,
//     category: specialty.category,
//     codigo: specialty.codeSpe || "",
//     numero: specialty.numberSpe || "",
//     level: specialty.levelSpe || 1,
//     year: specialty.yearSpe || "",
//     emblem: specialty.emblem || "",
//     compressedFile: null,
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleFileUpload = (file: File, compressedFile: File) => {
//     setFormData({ ...formData, compressedFile });
//   };

//   const handleSubmit = () => {
//     onSave(formData);
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} title="Editar Especialidade">
//       <div className="space-y-4">
//         <Input
//           label="Nome da Especialidade"
//           name="nameSpecialty"
//           value={formData.nameSpecialty}
//           onChange={handleChange}
//           required
//         />
//         <Input
//           label="Categoria"
//           name="category"
//           value={formData.category}
//           onChange={handleChange}
//           required
//         />
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <Input
//             label="Código"
//             name="codigo"
//             value={formData.codigo}
//             onChange={handleChange}
//           />
//           <Input
//             label="Número"
//             name="numero"
//             value={formData.numero}
//             onChange={handleChange}
//           />
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <Select
//             label="Nível"
//             name="level"
//             value={formData.level}
//             onChange={handleChange}
//             options={[
//               { label: "1", value: 1 },
//               { label: "2", value: 2 },
//               { label: "3", value: 3 },
//             ]}
//           />
//           <Input
//             label="Ano"
//             name="year"
//             value={formData.year}
//             onChange={handleChange}
//           />
//         </div>
//         <ImageUploader
//           label="Emblema da Especialidade"
//           onFileUpload={handleFileUpload}
//           defaultImage={formData.emblem}
//         />
//       </div>
//       <div className="mt-6 flex justify-end gap-2">
//         <Button variant="secondary" onClick={onClose}>
//           Cancelar
//         </Button>
//         <Button variant="primary" onClick={handleSubmit} loading={loading}>
//           Salvar
//         </Button>
//       </div>
//     </Modal>
//   );
// }
