import { motion } from "framer-motion";
import { useMemo } from "react";

const AnimatedBackgroundStarsOficial = () => {
  // Create stars with memoized positions
  const stars = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: `star-${i}`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: 1 + Math.random() * 3,
      delay: Math.random() * 2,
    }));
  }, []);

  // Create confetti with memoized positions
  const confetti = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: `confetti-${i}`,
      left: `${Math.random() * 100}%`,
      color: [
        "#FFD700", // gold
        "#FF6347", // tomato
        "#4169E1", // royal blue
        "#32CD32", // lime green
        "#FF69B4", // hot pink
        "#00FFFF", // cyan
      ][Math.floor(Math.random() * 6)],
      x: [
        `${Math.random() * 10 - 5}px`,
        `${Math.random() * 50 - 25}px`,
        `${Math.random() * 100 - 50}px`,
      ],
      rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
      duration: 4 + Math.random() * 8,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: star.left,
            top: star.top,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            repeatType: "loop",
            delay: star.delay,
          }}
        />
      ))}
      
      {/* Confetti - only visible on larger screens */}
      <div className=" sm:block">
        {confetti.map((item) => (
          <motion.div
            key={item.id}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: item.left,
              top: "-10px",
              backgroundColor: item.color,
              opacity: 0.8,
            }}
            animate={{
              y: ["0vh", "100vh"],
              x: item.x,
              rotate: [0, item.rotate],
            }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              ease: "linear",
              delay: item.delay,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimatedBackgroundStarsOficial;
