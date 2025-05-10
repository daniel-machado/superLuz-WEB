import React from "react";
import Lottie from "lottie-react";
import loadingAnimation from  '../../assets/lottie/animationD1.json' // 🔹 Adicione um JSON do LottieFiles

const LoadingScreen: React.FC = () => {
  return (
    <div className="absolute top-0 left-0 w-screen h-screen flex justify-center items-center">
      <Lottie 
        animationData={loadingAnimation} 
        loop 
        autoPlay
        style={{ width: 250, height: 250 }}  
      />
    </div>
  );
};

export default LoadingScreen;
