// Componentes de fundo animado para o pódio
import { motion } from 'framer-motion';


// Componente de fundo com gradiente animado
export const AnimatedBackground = () => {
  return (
    <motion.div
      className="absolute inset-0 z-0 bg-gradient-to-b from-blue-900 to-purple-900"
      animate={{
        background: [
          'linear-gradient(to bottom, #1e3a8a, #581c87)',
          'linear-gradient(to bottom, #172554, #4c1d95)',
          'linear-gradient(to bottom, #1e3a8a, #581c87)'
        ]
      }}
      transition={{ duration: 8, repeat: Infinity }}
    >
      {/* Luzes circulares de fundo */}
      <motion.div
        className="absolute left-1/4 top-1/3 w-32 h-32 rounded-full bg-blue-400 opacity-10 blur-xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <motion.div
        className="absolute right-1/4 bottom-1/4 w-48 h-48 rounded-full bg-purple-400 opacity-10 blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1]
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute left-1/3 bottom-1/3 w-40 h-40 rounded-full bg-cyan-400 opacity-10 blur-xl"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.05, 0.15, 0.05]
        }}
        transition={{ duration: 7, repeat: Infinity }}
      />
    </motion.div>
  );
};


// Componente de estrelas animadas
export const AnimatedBackgroundStars = () => {
  // Criar array de estrelas com posições aleatórias
  const stars = Array.from({ length: 50 }).map((_, index) => ({
    id: index,
    size: Math.random() * 2 + 1,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: Math.random() * 5
  }));


  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            width: star.size,
            height: star.size,
            left: star.left,
            top: star.top
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: star.delay
          }}
        />
      ))}
    </div>
  );
};


// Componente de confetes para o fundo
export const AnimatedConfetti = () => {
  // Criar array de confetes com cores aleatórias
  const confettiColors = ['#FFD700', '#C0C0C0', '#CD7F32', '#02FFAB', '#FFFFFF'];
  
  const confetti = Array.from({ length: 30 }).map((_, index) => ({
    id: index,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 10,
    duration: 2 + Math.random() * 3,
    size: Math.random() * 8 + 4
  }));


  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {confetti.map((item) => (
        <motion.div
          key={item.id}
          className="absolute w-2 h-2 rotate-45"
          style={{
            backgroundColor: item.color,
            left: item.left,
            top: '-20px',
            width: item.size,
            height: item.size
          }}
          animate={{
            y: ['0vh', '100vh'],
            rotate: [0, 360],
            opacity: [1, 1, 0]
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            delay: item.delay,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};
