import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, Crown } from 'lucide-react';
import superUnidadeBiblica from '../../../assets/superUnidadeBiblica.png'
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

interface UnitRank {
  unitId: string;
  totalScore: string;
  correctAnswers: string;
  wrongAnswers: string;
  unitRank: {
    name: string;
    photo: string;
  };
}

interface PodiumProps {
  topThree: UnitRank[];
  handleOpenDetail: (unitRank: any) => void;
}

const Podium = ({ topThree, handleOpenDetail }: PodiumProps) => {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);

  // // Define podium colors and animations
  // const podiumColors = [
  //   "bg-gradient-to-t from-yellow-500 to-yellow-300 h-24 sm:h-28", // 1st place
  //   "bg-gradient-to-t from-gray-400 to-gray-300 h-16 sm:h-20",     // 2nd place
  //   "bg-gradient-to-t from-amber-700 to-amber-500 h-12 sm:h-16"    // 3rd place
  // ];
    // Cores para os pódios
    const podiumColors = [
      'bg-gradient-to-t from-yellow-500 to-yellow-300 h-40', // Primeiro lugar
      'bg-gradient-to-t from-gray-400 to-gray-300 h-32',     // Segundo lugar
      'bg-gradient-to-t from-amber-700 to-amber-500 h-24'    // Terceiro lugar
    ];
  

  // Animação constante para o primeiro lugar
  // const pulseAnimation = {
  //   scale: [1, 1.05, 1],
  //   boxShadow: [
  //     "0 10px 15px -3px rgba(2, 255, 171, 0.3)", // Verde com opacidade 0.3
  //     "0 20px 25px -5px rgba(2, 255, 171, 0.4)", // Verde com opacidade 0.4
  //     "0 10px 15px -3px rgba(2, 255, 171, 0.3)", // Verde com opacidade 0.3
  //   ],
  //   transition: {
  //     duration: 2,
  //     ease: "easeInOut",
  //     repeat: Infinity,
  //     repeatType: "loop" as const,
  //   },
  // };
  
     // Animações para os pódios
  const podiumAnimations = [
    {
      initial: { height: 0, opacity: 0 },
      animate: { height: 160, opacity: 1 },
      transition: { duration: 0.8, delay: 0.5, ease: "easeOut" }
    },
    {
      initial: { height: 0, opacity: 0 },
      animate: { height: 128, opacity: 1 },
      transition: { duration: 0.8, delay: 0.7, ease: "easeOut" }
    },
    {
      initial: { height: 0, opacity: 0 },
      animate: { height: 96, opacity: 1 },
      transition: { duration: 0.8, delay: 0.9, ease: "easeOut" }
    }
  ];


     // Animação do "pulsar" para o primeiro lugar
  const pulseAnimation = {
    scale: [1, 1.05, 1],
    boxShadow: [
      "0px 0px 0px rgba(255,215,0,0.3)",
      "0px 0px 15px rgba(255,215,0,0.7)",
      "0px 0px 0px rgba(255,215,0,0.3)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse" as const
    }
  };


    // Efeito para mostrar confete quando o componente montar
  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 6000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <>
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={300}
          gravity={0.15}
          colors={['#FFD700', '#C0C0C0', '#CD7F32', '#02FFAB', '#FFFFFF']}
          confettiSource={{
            x: width / 2,
            y: height / 4,
            w: 0,
            h: 0
          }}
        />
      )}
      
      <motion.h2
        className="relative z-10 mb-6 text-xl sm:text-2xl font-bold text-center text-white mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Pódio das unidades
      </motion.h2>
    
      <motion.div 
        className="relative z-10 flex items-end justify-center gap-2 sm:gap-4 h-90  mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Segundo Lugar */}
        {topThree[1] ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.03 }}
            className="flex flex-col items-center"
            onClick={() => handleOpenDetail(topThree[1])}
          >
            <motion.div 
              className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 text-xs font-bold text-white rounded-full bg-gray-700"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            >
              2
            </motion.div>
            <motion.div
              animate={{
                y: [0, -2, 0],
                transition: { duration: 1.5, repeat: Infinity }
              }}
            >
              <ChevronUp className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={1.5} fill="rgb(2, 255, 171)" color="rgb(2, 255, 171)"/>
            </motion.div>
            <motion.div 
              className="relative w-12 h-12 sm:w-16 sm:h-16 mb-2 overflow-hidden rounded-full ring-2 ring-green-300"
              whileHover={{ scale: 1.08 }}
              animate={{ 
                boxShadow: [
                  "0 0 0 rgba(52, 211, 153, 0.4)",
                  "0 0 10px rgba(52, 211, 153, 0.7)",
                  "0 0 0 rgba(52, 211, 153, 0.4)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {topThree[1].unitRank.photo ? (
                <img
                  src={topThree[1].unitRank.photo}
                  alt={topThree[1].unitRank.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <motion.div className="flex items-center justify-center w-full h-full text-lg sm:text-xl font-bold text-white bg-blue-500">
                  {topThree[1].unitRank.name.charAt(0)}
                </motion.div>
              )}
            </motion.div>
            <p className="text-xs font-medium text-center text-white truncate w-16 sm:w-20">{topThree[1].unitRank.name}</p>
            <motion.div 
              className="flex items-center px-2 sm:px-3 py-1 mt-1 mb-3 text-xs font-bold text-blue-800 bg-white rounded-full"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {/* {topThree[1].totalScore} */}
              {Math.floor(Number(topThree[1].totalScore)).toLocaleString('pt-BR')}
            </motion.div>


            {/* Pódio */}
            <motion.div
              className={`w-16 sm:w-24 rounded-t-lg ${podiumColors[1]} shadow-lg`}
              {...podiumAnimations[1]}
            ></motion.div>
          </motion.div>
        ) : null}
      
        {/* Primeiro Lugar */}
        {topThree[0] ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center z-20"
            onClick={() => handleOpenDetail(topThree[0])}
          >
            <motion.div 
              className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2 text-xs sm:text-sm font-bold text-white bg-yellow-500 rounded-full"
              animate={{ 
                scale: [1, 1.2, 1],
                backgroundColor: ["#f59e0b", "#fbbf24", "#f59e0b"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              1
            </motion.div>
            <motion.div
              animate={{
                y: [0, -4, 0],
                rotate: [0, -5, 5, 0],
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop"
                }
              }}
            >
              <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" strokeWidth={1.5} fill="rgba(250, 204, 21, 0.5)" />
            </motion.div>
          
            <motion.div
              className="relative w-16 h-16 sm:w-20 sm:h-20 mb-2 overflow-hidden rounded-full ring-2 ring-yellow-400"
              whileHover={{ scale: 1.05 }}
              animate={pulseAnimation}
            >
              {topThree[0].unitRank.photo ? (
                <img
                  src={topThree[0].unitRank.photo}
                  alt={topThree[0].unitRank.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <motion.div className="flex items-center justify-center w-full h-full text-2xl font-bold text-white bg-blue-600">
                  {topThree[0].unitRank.name.charAt(0)}
                </motion.div>
              )}
            
              {/* Efeito de brilho e logo */}
              <motion.div
                className="absolute inset-0 rounded-full bg-yellow-400/30 blur-md"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              />
              
              {/* Efeito extra de brilho */}
              <motion.div
                className="absolute -inset-1 rounded-full opacity-30"
                animate={{
                  boxShadow: [
                    "0 0 5px 2px rgba(250, 204, 21, 0.5)",
                    "0 0 15px 5px rgba(250, 204, 21, 0.8)",
                    "0 0 5px 2px rgba(250, 204, 21, 0.5)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              />
            </motion.div>
            
            <p className="text-sm font-medium text-center text-white truncate w-20 sm:w-24">
              {topThree[0].unitRank.name}
            </p>
            
            <motion.div 
              className="flex items-center px-3 py-1 mt-1 mb-3 text-sm font-bold text-blue-800 bg-white rounded-full"
              animate={{ 
                scale: [1, 1.1, 1],
                boxShadow: [
                  "0 0 0 rgba(255, 255, 255, 0.4)",
                  "0 0 10px rgba(255, 255, 255, 0.7)",
                  "0 0 0 rgba(255, 255, 255, 0.4)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {/* {topThree[0].totalScore} */}
              {Math.floor(Number(topThree[0].totalScore)).toLocaleString('pt-BR')}
            </motion.div>


            {/* Pódio */}
            <motion.div
              className={`w-20 sm:w-28 rounded-t-lg ${podiumColors[0]} shadow-lg relative overflow-hidden`}
              {...podiumAnimations[0]}
            >
              {/* Decoração do pódio */}
              <motion.div 
                className="absolute inset-x-0 top-0 h-3 bg-yellow-300"
                animate={{ 
                  backgroundImage: [
                    "linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b)",
                    "linear-gradient(90deg, #fbbf24, #f59e0b, #fbbf24)",
                    "linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              {/* Estrelas no pódio */}
              {/* <motion.div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-4 h-4 text-yellow-200"
                  animate={{ 
                    opacity: [0.5, 1, 0.5],
                    scale: [0.8, 1, 0.8]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ★
                </motion.div>
              </motion.div> */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center mt-5"
                animate={{
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              >
                <img
                  src={superUnidadeBiblica}
                  alt="Unidade Bíblica"
                  className="absolute inset-0 object-cover z-0 w-30 h-30 opacity-70 flex items-center justify-center"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        ) : null}
      
        {/* Terceiro Lugar */}
        {topThree[2] ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.03 }}
            className="flex flex-col items-center"
            onClick={() => handleOpenDetail(topThree[2])}
          >
            <motion.div 
              className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 text-xs font-bold text-white rounded-full bg-amber-700"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            >
              3
            </motion.div>
            <motion.div
              animate={{
                y: [0, 2, 0],
                transition: { duration: 1.5, repeat: Infinity }
              }}
            >
              <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={1.5} fill="rgb(255, 255, 255)" color="rgb(255, 255, 255)" />
            </motion.div>
            <motion.div 
              className="relative w-12 h-12 sm:w-16 sm:h-16 mb-2 overflow-hidden rounded-full ring-2 ring-amber-500"
              whileHover={{ scale: 1.08 }}
              animate={{ 
                boxShadow: [
                  "0 0 0 rgba(180, 83, 9, 0.4)",
                  "0 0 10px rgba(180, 83, 9, 0.7)",
                  "0 0 0 rgba(180, 83, 9, 0.4)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {topThree[2].unitRank.photo ? (
                <img
                  src={topThree[2].unitRank.photo}
                  alt={topThree[2].unitRank.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <motion.div className="flex items-center justify-center w-full h-full text-lg sm:text-xl font-bold text-white bg-blue-500">
                  {topThree[2].unitRank.name.charAt(0)}
                </motion.div>
              )}
            </motion.div>
            <p className="text-xs font-medium text-center text-white truncate w-16 sm:w-20">{topThree[2].unitRank.name}</p>
            <motion.div 
              className="flex items-center px-2 sm:px-3 py-1 mt-1 mb-3 text-xs font-bold text-blue-800 bg-white rounded-full"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {/* {topThree[2].totalScore} */}
              {Math.floor(Number(topThree[2].totalScore)).toLocaleString('pt-BR')}
            </motion.div>
        
            {/* Pódio */}
            <motion.div
              className={`w-16 sm:w-22 rounded-t-lg ${podiumColors[2]} shadow-lg`}
              {...podiumAnimations[2]}
            ></motion.div>
          </motion.div>
        ) : null}
      </motion.div>
    </>
  );
};

export default Podium;
