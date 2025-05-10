import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, List, User, Loader2 } from "lucide-react";
import { AnimatedBackground, AnimatedBackgroundStars, AnimatedConfetti } from "../components/animatedBackgroungGroup";
import AnimatedBackgroundOficial from "../components/AnimatedBackgroundOficial";
import AnimatedBackgroundStarsOficial from "../components/AnimatedBackgroundStarsOficial";
import AnimatedBrushesOficial from "../components/AnimatedBrusheOficial";
import PodiumIndividual from "./ComponentsAux/PodiumIndividual";
import RankingList from "./ComponentsAux/RankingList";
import TableView from './ComponentsAux/TableView'
import { rankingIndividualService } from "../../../services/rankingIndividualService";
import toast from "react-hot-toast";


  // Handle opening unit details
  const handleOpenDetail = () => {
    console.log("CLica")
  };

interface User {
  rank: number;
  name: string;
  score: number;
  avatar: string | null;
}
interface Ranking {
  dbvId: string;  
  totalScore: string;
  individualRank:{
    name: string;
    photoUrl: string | null
  }
}

// Componente principal
const RankingIndividual = () => {
  const [activeTab, setActiveTab] = useState("podium");
  const [isLoading, setIsLoading] = useState(false);
  const rankingContainerRef = useRef(null);
  const [ranking, setRanking] = useState<Ranking[]>([]);
  
  // // Dados de exemplo - substitua por seus dados reais
  // const mockData = [
  //   { id: 1, rank: 1, name: "Ana Silva", score: 950, avatar: null },
  //   { id: 2, rank: 2, name: "Carlos Souza", score: 820, avatar: null },
  //   { id: 3, rank: 3, name: "Beatriz Gomes", score: 790, avatar: null },
  //   { id: 4, rank: 4, name: "Daniel Lima", score: 720, avatar: null },
  //   { id: 5, rank: 5, name: "Eduarda Santos", score: 650, avatar: null },
  //   { id: 6, rank: 6, name: "Felipe Costa", score: 610, avatar: null },
  //   { id: 7, rank: 7, name: "Gabriela Dias", score: 580, avatar: null },
  //   { id: 8, rank: 8, name: "Henrique Rocha", score: 540, avatar: null },
  // ];
    
  const fetchRanking = async () => {
    setIsLoading(true);
    try {
      const data = await rankingIndividualService.listRanking();
      setRanking(data);
    } catch (err) {
      toast.error("Erro ao carregar ranking", {position: 'bottom-right'});
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRanking();
  }, []);

  //Get top 3 and rest
  const topThree = ranking.slice(0, 3);
  const restOfRanking = ranking.slice(3);
  // const topThree = ranking.filter(user => user.rank <= 3);
  // const restOfRanking = ranking.filter(user => user.rank > 3);
  
  // Manipulador de swipe para dispositivos móveis
  const handleSwipe = (offsetX: number) => {
    if (offsetX > 0) {
      setActiveTab("table");
    } else {
      setActiveTab("podium");
    }
  };
  
  // Variantes para animação de tabs
  const tabVariants = {
    hidden: (direction: "left" | "right") => ({
      x: direction === "right" ? -20 : 20,
      opacity: 0,
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
    exit: (direction: "left" | "right") => ({
      x: direction === "right" ? 20 : -20,
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    }),
  };


  return (
    <motion.div
      className="w-full max-w-4xl mx-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >    
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-4 flex flex-col sm:flex-row justify-between items-center"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-0 flex items-center">
          <User className="w-8 h-8 mr-2 text-purple-400" />
          Ranking Individual
        </h1>
      </motion.div>


      {/* Tab Navigation */}
      <div className="flex justify-center mb-4">
        <div className="bg-gray-800 bg-opacity-70 rounded-full p-1 flex shadow-lg">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("podium")}
            className={`flex items-center px-4 py-2 rounded-full transition-all ${
              activeTab === "podium"
                ? "bg-gradient-to-r from-purple-600 to-indigo-700 text-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            <Award className="w-5 h-5 mr-2" />
            Pódio
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("table")}
            className={`flex items-center px-4 py-2 rounded-full transition-all ${
              activeTab === "table"
                ? "bg-gradient-to-r from-purple-600 to-indigo-700 text-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            <List className="w-5 h-5 mr-2" />
            Tabela
          </motion.button>
        </div>
      </div>


      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center w-full h-64"
        >
          <Loader2 className="w-10 h-10 text-purple-600 animate-spin dark:text-purple-400" />
          <p className="mt-4 text-gray-400">Carregando ranking...</p>
        </motion.div>
      ) : (
        <motion.div
          ref={rankingContainerRef}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (Math.abs(info.offset.x) > 100) {
              handleSwipe(info.offset.x);
            }
          }}
          className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl"
        >
          <AnimatePresence mode="wait" initial={false}>
            {activeTab === "podium" ? (
              <motion.div
                key="podium-view"
                custom="right"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={tabVariants}
                className="overflow-hidden rounded-lg shadow-xl bg-gray-800"
              >
                {/* Podium Section */}
                <motion.div className="relative px-4 pt-5 pb-5 sm:pb-5 overflow-hidden bg-gradient-to-b">
                  <AnimatedBackground />
                    <AnimatedBackgroundStars />
                    <AnimatedConfetti />
                    <AnimatedBackgroundOficial/>
                    <AnimatedBackgroundStarsOficial />
                    <AnimatedBrushesOficial />
                  
                  <PodiumIndividual topThree={topThree} handleOpenDetail={handleOpenDetail}/>
                </motion.div>
                
                {/* List of other rankings */}
                <RankingList rankings={restOfRanking} handleOpenDetail={handleOpenDetail}/>
                
              </motion.div>
            ) : (
              <motion.div
                key="table-view"
                custom="left"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={tabVariants}
                className="overflow-hidden rounded-lg shadow-xl bg-gray-800"
              >
                {/* Table View */}
                <div className="relative overflow-hidden">
                <AnimatedBackground />
                    <AnimatedBackgroundStars />
                    <AnimatedConfetti />
                    <AnimatedBackgroundOficial/>
                    <AnimatedBackgroundStarsOficial />
                    <AnimatedBrushesOficial />
                  
                  <div className="p-4 relative z-10">
                    <TableView ranking={ranking} handleOpenDetail={handleOpenDetail}/>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}


      {/* Swipe Indicator - only on mobile */}
      <div className="mt-4 text-center text-gray-400 text-sm md:hidden">
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Arraste para {activeTab === "podium" ? "ver tabela" : "ver pódio"}
        </motion.div>
      </div>
    </motion.div>
  );
};


export default RankingIndividual;























// Lista dos demais rankings
// interface Ranking {
//   id: number;
//   rank: number;
//   name: string;
//   score: number;
//   avatar: string | null;
// }


// // View de tabela
// const TableView = ({ ranking }: { ranking: Ranking[] }) => {
//   if (!ranking || ranking.length === 0) {
//     return <div className="p-10 text-center text-gray-400">Nenhum dado disponível</div>;
//   }

//   return (
//     <div className="relative z-10">
//       <table className="min-w-full divide-y divide-gray-700">
//         <thead>
//           <tr>
//             <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300">
//               Rank
//             </th>
//             <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300">
//               Usuário
//             </th>
//             <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300">
//               Pontos
//             </th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-gray-700">
//           {ranking.map((user, index) => (
//             <motion.tr 
//               key={user.id || index}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.1 + index * 0.05 }}
//               className={`${
//                 user.rank <= 3 
//                   ? "bg-gray-800 bg-opacity-70" 
//                   : index % 2 === 0 
//                     ? "bg-gray-900 bg-opacity-50" 
//                     : "bg-gray-800 bg-opacity-50"
//               } hover:bg-gray-700 hover:bg-opacity-70 transition-colors`}
//             >
//               <td className="whitespace-nowrap px-3 py-4 text-sm">
//                 <div className="flex items-center">
//                   {user.rank <= 3 ? (
//                     <span className={`
//                       flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold
//                       ${user.rank === 1 
//                         ? "bg-yellow-500 text-yellow-950" 
//                         : user.rank === 2 
//                           ? "bg-gray-400 text-gray-950" 
//                           : "bg-amber-700 text-amber-100"
//                       }
//                     `}>
//                       {user.rank}
//                     </span>
//                   ) : (
//                     <span className="text-gray-400 font-medium pl-1">
//                       {user.rank}
//                     </span>
//                   )}
//                 </div>
//               </td>
//               <td className="whitespace-nowrap px-3 py-4 text-sm">
//                 <div className="flex items-center">
//                   <div className="h-8 w-8 rounded-full mr-2 overflow-hidden bg-gray-700 flex-shrink-0 flex items-center justify-center">
//                     {user.avatar ? (
//                       <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
//                     ) : (
//                       <User className="h-4 w-4 text-gray-400" />
//                     )}
//                   </div>
//                   <span className="text-white">{user.name || "Anônimo"}</span>
//                 </div>
//               </td>
//               <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
//                 {user.score || 0}
//               </td>
//             </motion.tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };


// // Animações de fundo - igual ao ranking de units
// const AnimatedBackground = () => (
//   <motion.div
//     className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800 z-0"
//     initial={{ opacity: 0 }}
//     animate={{ opacity: 1 }}
//     transition={{ duration: 1 }}
//   />
// );


// // Animação de estrelas
// const AnimatedStars = () => {
//   const stars = Array.from({ length: 50 }, (_, i) => i);
  
//   return (
//     <>
//       {stars.map((star, index) => {
//         const size = Math.random() * 2 + 1;
//         const left = `${Math.random() * 100}%`;
//         const top = `${Math.random() * 100}%`;
//         const delay = Math.random() * 5;
        
//         return (
//           <motion.div
//             key={index}
//             className="absolute rounded-full bg-white z-0"
//             style={{
//               width: size,
//               height: size,
//               left,
//               top,
//               opacity: 0.6,
//             }}
//             animate={{
//               opacity: [0.2, 0.8, 0.2],
//               scale: [1, 1.2, 1],
//             }}
//             transition={{
//               duration: 3 + Math.random() * 2,
//               repeat: Infinity,
//               delay,
//             }}
//           />
//         );
//       })}
//     </>
//   );
// };


// // Animação de confete
// const AnimatedConfetti = () => {
//   const confetti = Array.from({ length: 40 }, (_, i) => i);
  
//   return (
//     <>
//       {confetti.map((conf, index) => {
//         const colors = ["#FF6B6B", "#4ECDC4", "#FFD166", "#8A2BE2", "#FF8C42"];
//         const size = Math.random() * 8 + 4;
//         const left = `${Math.random() * 100}%`;
//         const delay = Math.random() * 10;
//         const duration = 10 + Math.random() * 20;
//         const color = colors[Math.floor(Math.random() * colors.length)];
        
//         return (
//           <motion.div
//             key={index}
//             className="absolute rounded-full z-0"
//             style={{
//               width: size,
//               height: size,
//               left,
//               top: "-5%",
//               backgroundColor: color,
//               opacity: 0,
//             }}
//             animate={{
//               y: ["0%", "1000%"],
//               x: [
//                 "0%", 
//                 `${(Math.random() - 0.5) * 200}%`, 
//                 `${(Math.random() - 0.5) * 200}%`
//               ],
//               opacity: [0, 0.8, 0],
//               rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
//             }}
//             transition={{
//               duration,
//               repeat: Infinity,
//               delay,
//               ease: "easeInOut",
//             }}
//           />
//         );
//       })}
//     </>
//   );
// };


// // Animação de holofotes
// const AnimatedSpotlights = () => (
//   <>
//     <motion.div
//       className="absolute left-1/4 -top-10 w-32 h-80 bg-purple-400 opacity-10 blur-xl z-0"
//       initial={{ opacity: 0 }}
//       animate={{
//         opacity: [0, 0.1, 0.08],
//         rotate: [-10, -5]
//       }}
//       transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
//     />
    
//     <motion.div
//       className="absolute right-1/4 -top-10 w-32 h-80 bg-purple-400 opacity-10 blur-xl z-0"
//       initial={{ opacity: 0 }}
//       animate={{
//         opacity: [0, 0.1, 0.08],
//         rotate: [10, 5]
//       }}
//       transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
//     />
//   </>
// );


// // Animação de brushes - efeito visual estilizado
// const AnimatedBrushes = () => (
//   <>
//     <motion.div 
//       className="absolute -left-10 top-10 w-40 h-20 bg-purple-600 opacity-5 blur-3xl rounded-full z-0"
//       animate={{
//         rotate: [0, 10, 0],
//         scale: [1, 1.1, 1],
//       }}
//       transition={{ duration: 8, repeat: Infinity }}
//     />
//     <motion.div 
//       className="absolute -right-10 top-20 w-40 h-20 bg-indigo-600 opacity-5 blur-3xl rounded-full z-0"
//       animate={{
//         rotate: [0, -10, 0],
//         scale: [1, 1.2, 1],
//       }}
//       transition={{ duration: 10, repeat: Infinity, delay: 2 }}
//     />
//   </>
// );


// const IndividualPodium = ({ topThree }: { topThree: User[] }) => {
//   if (!topThree || topThree.length === 0) {
//     return <div className="flex justify-center p-10">Nenhum dado disponível</div>;
//   }


//   // Definindo alturas para o pódio - primeiro lugar é o mais alto
//   const heights = {
//     1: "h-40", // Primeiro lugar - mais alto
//     2: "h-32", // Segundo lugar 
//     3: "h-24", // Terceiro lugar
//   };


//   // Definindo as posições dos pódios - segundo, primeiro, terceiro
//   const positions = [
//     { rank: 2, index: 0 },
//     { rank: 1, index: 1 },  // Primeiro lugar no meio
//     { rank: 3, index: 2 },
//   ];


//   return (
//     <motion.div
//       className="flex justify-center items-end h-64 relative z-10"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5, delay: 0.2 }}
//     >
//       {positions.map(({ rank, index }) => {
//         const user = topThree.find(u => u.rank === rank);
//         if (!user) return null;
        
//         // Calculando atraso na animação com base na posição
//         const delay = 0.3 + index * 0.2;
        
//         return (
//           <div key={rank} className="relative px-2 flex flex-col items-center">
//             {/* Avatar do usuário com animação */}
//             <motion.div
//               initial={{ y: 30, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ duration: 0.5, delay }}
//               className="relative mb-2 z-20"
//             >
//               <div className="relative">
//                 {/* Efeito de brilho para avatar */}
//                 <motion.div
//                   className={`absolute inset-0 rounded-full blur-sm ${
//                     rank === 1 ? "bg-purple-500" : rank === 2 ? "bg-blue-500" : "bg-green-500"
//                   }`}
//                   animate={{ 
//                     opacity: [0.5, 0.8, 0.5],
//                     scale: [1, 1.1, 1],
//                   }}
//                   transition={{ duration: 2, repeat: Infinity }}
//                 />
                
//                 {/* Avatar do usuário */}
//                 <div className={`
//                   w-16 h-16 rounded-full flex items-center justify-center 
//                   bg-gradient-to-br overflow-hidden border-2 
//                   ${rank === 1 
//                     ? "from-purple-600 to-indigo-800 border-purple-300" 
//                     : rank === 2 
//                       ? "from-blue-600 to-blue-800 border-blue-300" 
//                       : "from-green-600 to-green-800 border-green-300"
//                   }
//                 `}>
//                   {user.avatar ? (
//                     <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
//                   ) : (
//                     <User className="w-8 h-8 text-white" />
//                   )}
//                 </div>
                
//                 {/* Badge de ranking */}
//                 <motion.div 
//                   className={`
//                     absolute -bottom-2 -right-2 w-7 h-7 rounded-full 
//                     flex items-center justify-center text-xs font-bold text-white
//                     ${rank === 1 
//                       ? "bg-gradient-to-r from-yellow-400 to-yellow-600 border-yellow-200" 
//                       : rank === 2 
//                         ? "bg-gradient-to-r from-gray-300 to-gray-500 border-gray-200" 
//                         : "bg-gradient-to-r from-amber-600 to-amber-800 border-amber-200"
//                     }
//                   `}
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1 }}
//                   transition={{ delay: delay + 0.2, type: "spring" }}
//                 >
//                   {rank}
//                 </motion.div>
//               </div>
              
//               {/* Nome do usuário */}
//               <div className="text-center mt-2">
//                 <p className="text-white font-semibold text-sm truncate max-w-[80px]">
//                   {user.name || "Anônimo"}
//                 </p>
//                 <motion.p 
//                   className="text-xs text-gray-300"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: delay + 0.3 }}
//                 >
//                   {user.score || 0} pts
//                 </motion.p>
//               </div>
//             </motion.div>
            
//             {/* Bloco do pódio com animação */}
//             <motion.div
//               className={`
//                 w-24 ${heights[rank as 1 | 2 | 3]} rounded-t-lg z-10 flex items-center justify-center
//                 ${rank === 1 
//                   ? "bg-gradient-to-b from-purple-600 to-purple-800" 
//                   : rank === 2 
//                     ? "bg-gradient-to-b from-blue-600 to-blue-800" 
//                     : "bg-gradient-to-b from-green-600 to-green-800"
//                 }
//               `}
//               initial={{ scaleY: 0, opacity: 0.5 }}
//               animate={{ scaleY: 1, opacity: 1 }}
//               transition={{ duration: 0.7, delay, type: "spring" }}
//             >
//               {/* Número do ranking com efeito de brilho */}
//               <motion.div
//                 className={`
//                   text-2xl font-bold drop-shadow-glow
//                   ${rank === 1 ? "text-yellow-300" : rank === 2 ? "text-gray-200" : "text-amber-600"}
//                 `}
//                 animate={{
//                   textShadow: [
//                     "0 0 5px rgba(255,255,255,0.3)",
//                     "0 0 15px rgba(255,255,255,0.7)",
//                     "0 0 5px rgba(255,255,255,0.3)"
//                   ]
//                 }}
//                 transition={{ duration: 2, repeat: Infinity }}
//               >
//                 {rank === 1 ? "🏆" : rank === 2 ? "🥈" : "🥉"}
//               </motion.div>
//             </motion.div>
//           </div>
//         );
//       })}
//     </motion.div>
//   );
// };




// const IndividualRankingList = ({ rankings }: { rankings: Ranking[] }) => {
//   if (!rankings || rankings.length === 0) {
//     return null;
//   }


//   return (
//     <div className="py-2 px-4 bg-gray-900 bg-opacity-60 backdrop-blur-sm">
//       <h3 className="text-lg font-semibold text-white mb-3">Outros colocados</h3>
//       <div className="space-y-2">
//         {rankings.map((user, index) => (
//           <motion.div
//             key={user.id || index}
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.5 + index * 0.1 }}
//             className="bg-gray-800 bg-opacity-60 hover:bg-gray-700 transition-all rounded-lg p-3 flex items-center"
//           >
//             <div className="flex-shrink-0 w-8 font-semibold text-gray-400">
//               #{user.rank}
//             </div>
            
//             <div className="flex-shrink-0 h-10 w-10 rounded-full mr-3 overflow-hidden bg-gray-700 flex items-center justify-center">
//               {user.avatar ? (
//                 <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
//               ) : (
//                 <User className="h-5 w-5 text-gray-400" />
//               )}
//             </div>
            
//             <div className="flex-grow">
//               <p className="font-medium text-white">{user.name || "Anônimo"}</p>
//               <p className="text-xs text-gray-400">{user.score || 0} pontos</p>
//             </div>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// };




































// import { useEffect, useState, useRef } from "react";
// import { toast } from "react-hot-toast";
// import { Loader2, Award, List, User } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { rankingIndividualService } from '../../../services/rankingIndividualService'
// import AnimatedBackground from "../components/AnimatedBackgroundOficial";
// import { AnimatedStars } from "./Components/AnimatedStars";
// import IndividualPodium from "./Components/PodiumIndividual";
// import IndividualRankingList from "./Components/IndividualRankingList";
// import TableView from "./Components/TableView";

// // Main Component
// export default function RankingIndividual() {
//   const [ranking, setRanking] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState("podium"); // "podium" or "table"
//   const rankingContainerRef = useRef(null);

//   const fetchRanking = async () => {
//     setIsLoading(true);
//     try {
//       const data = await rankingIndividualService.listRanking();
//       setRanking(data);
//     } catch (err) {
//       toast.error("Erro ao carregar ranking", {position: 'bottom-right'});
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRanking();
//   }, []);

//   // Get top 3 and rest
//   const topThree = ranking.slice(0, 3);
//   const restOfRanking = ranking.slice(3);

//   // Tab swipe handler
//   const handleSwipe = (direction: number) => {
//     if (direction > 0 && activeTab === "podium") {
//       setActiveTab("table");
//     } else if (direction < 0 && activeTab === "table") {
//       setActiveTab("podium");
//     }
//   };

//   // Animation variants for tab switch
//   const tabVariants = {
//     hidden: (direction: "left" | "right") => ({
//       x: direction === "right" ? 500 : -500,
//       opacity: 0
//     }),
//     visible: {
//       x: 0,
//       opacity: 1,
//       transition: {
//         type: "spring",
//         damping: 25,
//         stiffness: 300
//       }
//     },
//     exit: (direction: "left" | "right") => ({
//       x: direction === "right" ? -500 : 500,
//       opacity: 0,
//       transition: {
//         type: "spring",
//         damping: 25,
//         stiffness: 300
//       }
//     })
//   };

//   return (
//     <motion.div
//       className="w-full max-w-4xl mx-auto p-4"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//     >    
//       <motion.div
//         initial={{ y: -20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         className="mb-4 flex flex-col sm:flex-row justify-between items-center"
//       >
//         <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-0 flex items-center">
//           <User className="w-8 h-8 mr-2 text-purple-400" />
//           Ranking Individual
//         </h1>
//       </motion.div>

//       {/* Tab Navigation */}
//       <div className="flex justify-center mb-4">
//         <div className="bg-gray-800 bg-opacity-70 rounded-full p-1 flex shadow-lg">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => setActiveTab("podium")}
//             className={`flex items-center px-4 py-2 rounded-full transition-all ${
//               activeTab === "podium"
//                 ? "bg-gradient-to-r from-purple-600 to-indigo-700 text-white"
//                 : "text-gray-300 hover:text-white"
//             }`}
//           >
//             <Award className="w-5 h-5 mr-2" />
//             Pódio
//           </motion.button>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => setActiveTab("table")}
//             className={`flex items-center px-4 py-2 rounded-full transition-all ${
//               activeTab === "table"
//                 ? "bg-gradient-to-r from-purple-600 to-indigo-700 text-white"
//                 : "text-gray-300 hover:text-white"
//             }`}
//           >
//             <List className="w-5 h-5 mr-2" />
//             Tabela
//           </motion.button>
//         </div>
//       </div>

//       {isLoading ? (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="flex flex-col items-center justify-center w-full h-64"
//         >
//           <Loader2 className="w-10 h-10 text-purple-600 animate-spin dark:text-purple-400" />
//           <p className="mt-4 text-gray-400">Carregando ranking...</p>
//         </motion.div>
//       ) : (
//         <motion.div
//           ref={rankingContainerRef}
//           drag="x"
//           dragConstraints={{ left: 0, right: 0 }}
//           dragElastic={0.2}
//           onDragEnd={(_, info) => {
//             if (Math.abs(info.offset.x) > 100) {
//               handleSwipe(info.offset.x);
//             }
//           }}
//           className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl"
//         >
//           <AnimatePresence mode="wait" initial={false}>
//             {activeTab === "podium" ? (
//               <motion.div
//                 key="podium-view"
//                 custom="right"
//                 initial="hidden"
//                 animate="visible"
//                 exit="exit"
//                 variants={tabVariants}
//                 className="overflow-hidden rounded-lg shadow-xl bg-gray-800"
//               >
//                 {/* Podium Section */}
//                 <motion.div className="relative px-4 pt-5 pb-5 sm:pb-5 overflow-hidden bg-gradient-to-b">
//                   <AnimatedBackground />
//                   <AnimatedStars />
              
//                   <IndividualPodium topThree={topThree} />
//                 </motion.div>
            
//                 {/* List of other rankings */}
//                 <IndividualRankingList rankings={restOfRanking} />
//               </motion.div>
//             ) : (
//               <motion.div
//                 key="table-view"
//                 custom="left"
//                 initial="hidden"
//                 animate="visible"
//                 exit="exit"
//                 variants={tabVariants}
//                 className="overflow-hidden rounded-lg shadow-xl bg-gray-800"
//               >
//                 {/* Table View */}
//                 <div className="relative overflow-hidden">
//                   <AnimatedBackground />
//                   <AnimatedStars />
                
//                   <div className="p-4 relative z-10">
//                     <TableView ranking={ranking} />
//                   </div>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </motion.div>
//       )}

//       {/* Swipe Indicator - only on mobile */}
//       <div className="mt-4 text-center text-gray-400 text-sm md:hidden">
//         <motion.div
//           initial={{ opacity: 0.5 }}
//           animate={{ opacity: [0.5, 1, 0.5] }}
//           transition={{ duration: 2, repeat: Infinity }}
//         >
//           Arraste para {activeTab === "podium" ? "ver tabela" : "ver pódio"}
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// }
