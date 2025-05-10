import React from "react";
import { motion } from "framer-motion";


type SpinnerSize = "sm" | "md" | "lg" | "xl";


interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
  color?: string;
}


const Spinner: React.FC<SpinnerProps> = ({ size = "md", className = "", color = "currentColor" }) => {
  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "w-4 h-4";
      case "md":
        return "w-6 h-6";
      case "lg":
        return "w-8 h-8";
      case "xl":
        return "w-12 h-12";
      default:
        return "w-6 h-6";
    }
  };


  const spinTransition = {
    repeat: Infinity,
    ease: "linear",
    duration: 0.8
  };


  return (
    <div className={`inline-flex ${className}`} role="status">
      <motion.svg
        className={`${getSizeClass()} text-${color}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        animate={{ rotate: 360 }}
        transition={spinTransition}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </motion.svg>
      <span className="sr-only">Carregando...</span>
    </div>
  );
};


export default Spinner;
