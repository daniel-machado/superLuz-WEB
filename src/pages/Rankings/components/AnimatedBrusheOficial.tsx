
import { motion } from 'framer-motion';

const AnimatedBrushesOficial = () => {
  const brushPatterns = [
    "M15.5,5.5c0,0-9,0-16.5,0S-7.5,13-7.5,20s9,12,15,12s13-3,13-10S15.5,5.5,15.5,5.5z",
    "M37.5,25.3c0,0-17.3-4.4-20.8-6.8s-7.1-6.2-12.8-6.2S-9.5,18.7-9.5,26.5s9.9,13.4,16.9,13.4s14.9-3.4,16.4-12.1C25.3,18.7,37.5,25.3,37.5,25.3z",
    "M32.5,27.5c-3.8,1.2-12.5,1.1-19.5-0.9S1.5,13.5-5.5,13.5s-18,9-18,17s9,14,16,14s14-4,15.5-12.5C9.5,23.5,32.5,27.5,32.5,27.5z"
  ];
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {brushPatterns.map((path, i) => (
        <motion.svg
          key={i}
          className="absolute inset-0 w-full h-full opacity-10"
          viewBox="-20 -10 60 60"
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ 
            opacity: [0.05, 0.1, 0.05],
            scale: [0.9, 1, 0.9],
            rotate: i % 2 === 0 ? [0, 5, 0] : [0, -5, 0]
          }}
          transition={{ 
            duration: 8,
            delay: i * 0.7,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        >
          <path d={path} fill="rgb(52, 211, 153)" />
        </motion.svg>
      ))}
    </div>
  );
};

export default AnimatedBrushesOficial;
