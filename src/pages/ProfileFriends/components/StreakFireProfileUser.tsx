import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { DailyReadingService } from '../../../services/dailyVerseBiblicalService';

// Propriedades do componente
interface StreakFireProps {
  className?: string;
  onStreakChange?: (streak: number) => void;
  refreshTrigger?: number; // Prop para forçar atualização do componente
  userId: string;
}


// Componente de exibição do fogo de streak
const StreakFireProfileUser: React.FC<StreakFireProps> = ({
  className = '',
  onStreakChange,
  refreshTrigger = 0,
  userId
}) => {

  // Estados para armazenar dados do streak
  const [streak, setStreak] = useState(0);
  const [_lives, setLives] = useState(0);
  const [hasReadToday, setHasReadToday] = useState(false);
  const [loading, setLoading] = useState(true);



  // Efeito para carregar os dados do streak quando o componente montar ou atualizar
  useEffect(() => {
    const fetchStreakInfo = async () => {
      if (userId) {
        try {
          setLoading(true);
          const response = await DailyReadingService.getStreakInfo(userId);


          if( response && response.streakInfo ){
            setStreak(response.streakInfo.currentStreak);
            setLives(response.streakInfo.lives);
            setHasReadToday(response.streakInfo.hasReadToday);
          }


          // Notificar componente pai sobre mudança no streak se necessário
          if (onStreakChange) {
            onStreakChange(response.streakInfo.currentStreak);
          }
        } catch (error: any) {
          console.error('Erro ao buscar informações do streak:', error.message);
          toast.error(`Error: ${error.message}`, {
            position: 'bottom-right',
            icon: '🚫',
            duration: 5000,
          });
        } finally {
          setLoading(false);
        }
      }
    };


    fetchStreakInfo();
  }, [userId, refreshTrigger]); // Adiciona refreshTrigger como dependência


  // Função para determinar a cor do fogo com base no streak
  const getFireColor = () => {
    if (streak === 0 || !hasReadToday) {
      return {
        primary: '#888888',
        secondary: '#AAAAAA',
        highlight: '#CCCCCC',
        glow: 'rgba(100,100,100,0.2)'
      }; // Fogo apagado (cinza)
    }
   
    if (streak >= 100) {
      return {
        primary: '#8A2BE2',
        secondary: '#9932CC',
        highlight: '#CE93D8',
        glow: 'rgba(138,43,226,0.4)'
      }; // Roxo (100+ dias)
    }
   
    if (streak >= 75) {
      return {
        primary: '#FF4500',
        secondary: '#FF5722',
        highlight: '#FFAB91',
        glow: 'rgba(255,69,0,0.4)'
      }; // Laranja avermelhado (75+ dias)
    }
   
    if (streak >= 50) {
      return {
        primary: '#FF8C00',
        secondary: '#FFA000',
        highlight: '#FFCC80',
        glow: 'rgba(255,140,0,0.4)'
      }; // Laranja (50+ dias)
    }
   
    if (streak >= 30) {
      return {
        primary: '#FFA500',
        secondary: '#FFB74D',
        highlight: '#FFE082',
        glow: 'rgba(255,165,0,0.4)'
      }; // Amarelo alaranjado (30+ dias)
    }
   
    if (streak >= 10) {
      return {
        primary: '#FF6347',
        secondary: '#FF7043',
        highlight: '#FFAB91',
        glow: 'rgba(255,99,71,0.3)'
      }; // Vermelho (10+ dias)
    }
   
    // Fogo padrão (< 10 dias)
    return {
      primary: '#FF6347',
      secondary: '#FF7043',
      highlight: '#FFECB3',
      glow: 'rgba(255,99,71,0.2)'
    };
  };


  // Obter cores do fogo
  const fireColor = getFireColor();


  // Preparar animação para o fogo
  const firePulse = hasReadToday ? 'animate-fire-pulse' : '';
  const fireGlow = hasReadToday ? 'animate-fire-glow' : '';
 
  // Adicionar classes CSS personalizadas para animações
  useEffect(() => {
    // Adiciona estilos para animação do fogo se ainda não existirem
    if (!document.getElementById('fire-animation-style')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'fire-animation-style';
      styleEl.innerHTML = `
        @keyframes firePulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .animate-fire-pulse {
          animation: firePulse 2s ease-in-out infinite;
        }
        @keyframes fireGlow {
          0% { opacity: 0.8; }
          50% { opacity: 1; }
          100% { opacity: 0.8; }
        }
        .animate-fire-glow {
          animation: fireGlow 3s ease-in-out infinite;
        }
      `;
      document.head.appendChild(styleEl);
    }
  }, []);


  return (
    <div className={`flex items-center ${className}`}>
      {loading ? (
        <div className="flex items-center">
          <div className="animate-pulse w-10 h-12 bg-gray-300 rounded-md"></div>
          <div className="animate-pulse ml-3 w-8 h-6 bg-gray-300 rounded-md"></div>
        </div>
      ) : (
        <>
          {/* Container do SVG com efeito de glow se o fogo estiver aceso */}
          <div className={`relative ${hasReadToday ? 'filter drop-shadow-lg' : ''}`}>
            {/* Círculo de glow por trás do fogo */}
            {hasReadToday && (
              <div
                className="absolute inset-0 rounded-full blur-md -z-10"
                style={{
                  backgroundColor: fireColor.glow,
                  transform: 'scale(1.5)',
                  opacity: streak > 30 ? 0.6 : 0.3
                }}
              />
            )}
           
            {/* SVG do Emoji de Fogo */}
            <svg
              viewBox="0 0 32 32"
              className={`w-12 h-16 ${firePulse}`}
              xmlns="http://www.w3.org/2000/svg"
              aria-label={hasReadToday ? "Fogo aceso" : "Fogo apagado"}
            >
              <defs>
                <radialGradient id="flameGradient" cx="50%" cy="40%" r="60%" fx="50%" fy="40%">
                  <stop offset="0%" stopColor={fireColor.highlight} />
                  <stop offset="100%" stopColor={fireColor.primary} />
                </radialGradient>
                <filter id="flameFilter" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              
              {/* Chama do lado direito */}
              <path 
                d="M22 4C22 4 24 9 24 14C24 19 20 21 20 21C20 21 22 19 22 14C22 9 20 4 14 8C14 8 16 9 16 14C16 19 14 21 14 21C14 21 18 20 18 14C18 8 12 4 12 4C12 4 14 8 14 12C14 16 12 18 12 18C12 18 14 16 14 12C14 8 12 4 8 12C8 12 10 16 10 20C10 24 8 26 8 26C8 26 16 24 16 16C16 12 14 8 14 8C14 8 16 12 16 16C16 20 14 24 14 24C14 24 24 20 24 14C24 8 22 4 22 4Z" 
                fill={fireColor.primary} 
                className={fireGlow} 
                filter={hasReadToday ? "url(#flameFilter)" : ""}
              />
              
              {/* Chama central */}
              <path 
                d="M16 8C16 8 18 12 18 16C18 20 16 22 16 22C16 22 18 20 18 16C18 12 16 8 12 12C12 12 14 14 14 18C14 22 12 24 12 24C12 24 16 22 16 16C16 10 12 8 12 8C12 8 14 12 14 16C14 20 12 22 12 22C12 22 16 18 16 14C16 10 14 8 14 8C14 8 16 12 16 16C16 20 14 24 14 24C14 24 20 20 20 16C20 12 16 8 16 8Z" 
                fill="url(#flameGradient)" 
                className={fireGlow} 
                filter={hasReadToday ? "url(#flameFilter)" : ""}
              />
            </svg>
          </div>
         
          {/* Contador de Dias */}
          <div className="ml-3 text-center">
            <div className={`text-xl font-bold ${hasReadToday ? 'text-orange-600' : 'text-gray-600'}`}>
              {streak}
            </div>
            <div className="text-xs uppercase text-gray-600">
              {streak === 1 ? 'dia' : 'dias'}
            </div>
          </div>
        </>
      )}
    </div>
  );
};


export default StreakFireProfileUser;
