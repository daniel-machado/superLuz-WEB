// import { useState } from "react";
// import SpecialtyCard from "./SpecialtyCard";
// import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
// import { Transition } from "@headlessui/react";



// // Ícones para cada categoria
// const CategoryIcons = {
//   profissionais: (
//     <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//       <path d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//     </svg>
//   ),
//   manuais: (
//     <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <path d="M14 7H16M14 11H16M14 15H16M4 3H20C21.1046 3 22 3.89543 22 5V19C22 20.1046 21.1046 21 20 21H4C2.89543 21 2 20.1046 2 19V5C2 3.89543 2.89543 3 4 3ZM8 7H10V11H8V7ZM8 15H10V19H8V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//     </svg>
//   ),
//   agricolas: (
//     <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <path d="M3 9C3 10.5 4.5 13 9 13C13.5 13 15 10.5 15 9M3 9C3 7.5 4.5 5 9 5C13.5 5 15 7.5 15 9M3 9H15M12 19C10.5 14.5 13 13.5 15 13V5C19.5 5 21 7.5 21 9C21 10.5 19.5 13 15 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//       <path d="M8 13V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//     </svg>
//   ),
//   missionarias: (
//     <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//       <path d="M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//       <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//     </svg>
//   ),
//   recreativas: (
//     <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <path d="M17 6H7C4.79086 6 3 7.79086 3 10V17C3 19.2091 4.79086 21 7 21H17C19.2091 21 21 19.2091 21 17V10C21 7.79086 19.2091 6 17 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//       <path d="M15 3V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//       <path d="M9 3V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//       <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//       <path d="M10 14L8 16L10 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//       <path d="M14 14L16 16L14 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//     </svg>
//   ),
//   saude: (
//     <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <path d="M19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//       <path d="M9 3V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//       <path d="M15 3V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//       <path d="M10 13H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//       <path d="M12 11V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//     </svg>
//   ),
//   natureza: (
//     <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <path d="M8 16C8 19.3137 10.6863 22 14 22C17.3137 22 20 19.3137 20 16C20 12.6863 17.3137 10 14 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//       <path d="M4 9L2 14L7 17L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//       <path d="M14 10C15.654 10 17 8.65396 17 7C17 5.34604 15.654 4 14 4C12.346 4 11 5.34604 11 7C11 8.65396 12.346 10 14 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//     </svg>
//   ),
//   domesticas: (
//     <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//       <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//     </svg>
//   ),
//   adra: (
//     <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//       <path d="M19.5 19H4.5C4.5 15.134 7.81602 12 12 12C16.184 12 19.5 15.134 19.5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//     </svg>
//   ),
//   mestrado: (
//     <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <path d="M12 15L3 8L12 1L21 8L12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//       <path d="M3 8V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//       <path d="M15 19C15 17.3431 13.6569 16 12 16C10.3431 16 9 17.3431 9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//     </svg>
//   ),
// };


// // Cores para cada categoria
// const CategoryColors = {
//   profissionais: "bg-blue-500 text-white",
//   manuais: "bg-yellow-500 text-gray-800",
//   agricolas: "bg-green-500 text-white",
//   missionarias: "bg-purple-500 text-white",
//   recreativas: "bg-red-500 text-white",
//   saude: "bg-pink-500 text-white",
//   natureza: "bg-emerald-500 text-white",
//   domesticas: "bg-orange-500 text-white",
//   adra: "bg-indigo-500 text-white",
//   mestrado: "bg-gray-700 text-white",
// };


// // Traduções para as categorias
// const CategoryNames = {
//   profissionais: "Profissionais",
//   manuais: "Manuais",
//   agricolas: "Agrícolas",
//   missionarias: "Missionárias",
//   recreativas: "Recreativas",
//   saude: "Saúde",
//   natureza: "Natureza",
//   domesticas: "Domésticas",
//   adra: "ADRA",
//   mestrado: "Mestrado",
// };


// interface SpecialtyCategoryListProps {
//   id: string; // Added id property
//   specialties: SpecialtyCategoryListProps[];
//   onEditClick: (specialty: SpecialtyCategoryListProps) => void;
//   onDeleteClick: (specialty: SpecialtyCategoryListProps) => void;
//   onViewRequirements: (specialty: SpecialtyCategoryListProps) => void;
//   category: string; // Added category property
// }


// const SpecialtyCategoryList: React.FC<SpecialtyCategoryListProps> = ({
//   specialties,
//   onEditClick,
//   onDeleteClick,
//   onViewRequirements,
// }) => {
//   const [expandedCategories, setExpandedCategories] = useState<string[]>([]);


//   // Agrupar especialidades por categoria
//   const groupedSpecialties = specialties.reduce((acc, specialty) => {
//     const { category } = specialty;
//     if (!acc[category]) {
//       acc[category] = [];
//     }
//     acc[category].push(specialty);
//     return acc;
//   }, {} as Record<string, SpecialtyCategoryListProps[]>);


//   // Ordenar categorias
//   const sortedCategories = Object.keys(groupedSpecialties).sort();


//   const toggleCategory = (category: string) => {
//     setExpandedCategories(prev => 
//       prev.includes(category) 
//         ? prev.filter(c => c !== category) 
//         : [...prev, category]
//     );
//   };


//   return (
//     <div className="divide-y divide-gray-200 dark:divide-gray-700">
//       {sortedCategories.map((category) => {
//         const isExpanded = expandedCategories.includes(category);
//         const categoryColor = CategoryColors[category as keyof typeof CategoryColors] || "bg-gray-600 text-white";
//         const categoryIcon = CategoryIcons[category as keyof typeof CategoryIcons];
//         const categoryName = CategoryNames[category as keyof typeof CategoryNames] || category;
        
//         return (
//           <div key={category} className="overflow-hidden">
//             <button
//               className={`w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 focus:outline-none`}
//               onClick={() => toggleCategory(category)}
//             >
//               <div className="flex items-center space-x-3">
//                 <div className={`rounded-full p-2 ${categoryColor}`}>
//                   {categoryIcon}
//                 </div>
//                 <span className="font-medium text-gray-800 dark:text-white">
//                   {categoryName} 
//                   <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
//                     ({groupedSpecialties[category].length})
//                   </span>
//                 </span>
//               </div>
//               <div>
//                 {isExpanded ? (
//                   <ChevronUpIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
//                 ) : (
//                   <ChevronDownIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
//                 )}
//               </div>
//             </button>
            
//             <Transition
//               show={isExpanded}
//               enter="transition-all duration-300 ease-out"
//               enterFrom="transform scale-y-95 opacity-0 max-h-0"
//               enterTo="transform scale-y-100 opacity-100 max-h-full"
//               leave="transition-all duration-200 ease-in"
//               leaveFrom="transform scale-y-100 opacity-100 max-h-full"
//               leaveTo="transform scale-y-95 opacity-0 max-h-0"
//             >
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800/30">
//                 {groupedSpecialties[category].map((specialty) => (
//                   <SpecialtyCard
//                     key={specialty.id}
//                     specialty={specialty}
//                     categoryColor={categoryColor}
//                     onEdit={() => onEditClick(specialty)}
//                     onDelete={() => onDeleteClick(specialty)}
//                     onViewRequirements={() => onViewRequirements(specialty)}
//                   />
//                 ))}
//               </div>
//             </Transition>
//           </div>
//         );
//       })}


//       {sortedCategories.length === 0 && (
//         <div className="py-6 text-center text-gray-500 dark:text-gray-400">
//           Nenhuma especialidade encontrada
//         </div>
//       )}
//     </div>
//   );
// };


// export default SpecialtyCategoryList;
