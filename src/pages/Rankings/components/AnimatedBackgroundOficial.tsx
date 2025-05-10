import { motion } from "framer-motion";

const AnimatedBackgroundOficial = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradiente principal */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800"></div>
      
      {/* Brush strokes */}
      <motion.svg
        viewBox="0 0 1000 1000"
        className="absolute w-full h-full opacity-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1 }}
      >
        <motion.path
          d="M0,500 Q250,350 500,500 T1000,500"
          fill="none"
          stroke="currentColor"
          strokeWidth="60"
          strokeLinecap="round"
          initial={{ pathLength: 0, pathOffset: 1 }}
          animate={{ pathLength: 1, pathOffset: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      
        <motion.path
          d="M0,600 Q250,750 500,600 T1000,600"
          fill="none"
          stroke="currentColor"
          strokeWidth="40"
          strokeLinecap="round"
          initial={{ pathLength: 0, pathOffset: 1 }}
          animate={{ pathLength: 1, pathOffset: 0 }}
          transition={{ duration: 2.5, ease: "easeInOut", delay: 0.3 }}
        />
      
        <motion.path
          d="M0,400 Q250,250 500,400 T1000,400"
          fill="none"
          stroke="currentColor"
          strokeWidth="20"
          strokeLinecap="round"
          initial={{ pathLength: 0, pathOffset: 1 }}
          animate={{ pathLength: 1, pathOffset: 0 }}
          transition={{ duration: 3, ease: "easeInOut", delay: 0.6 }}
        />
      </motion.svg>

      {/* Light rays */}
      <div className="absolute top-0 left-1/2 w-full h-full -translate-x-1/2 opacity-20">
        <motion.div
          className="w-full h-full bg-gradient-radial from-white via-transparent to-transparent"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "loop",
          }}
        />
      </div>
    </div>
  );
};

export default AnimatedBackgroundOficial;
