import { ReactNode } from "react";

const Card = ({ children, className = "", ...props }: { 
  children: ReactNode; 
  className?: string; 
  [key: string]: any 
}) => {
  return (
    <div
      className={`bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
