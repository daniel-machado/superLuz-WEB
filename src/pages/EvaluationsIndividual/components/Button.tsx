import { ReactNode } from "react";

const Button = ({ children, variant = "primary", className = "", ...props }: { 
  children: ReactNode; 
  variant?: "primary" | "secondary" | "outline" | "danger"; 
  className?: string; 
  [key: string]: any 
}) => {
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
    secondary: "bg-gray-700 hover:bg-gray-800 text-white",
    outline: "bg-transparent border border-gray-600 hover:bg-gray-800 text-gray-300",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };

  return (
    <button
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
