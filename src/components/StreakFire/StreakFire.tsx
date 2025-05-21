import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DailyReadingService } from '../../services/dailyVerseBiblicalService';
import toast from 'react-hot-toast';

// Propriedades do componente
interface StreakFireProps {
  className?: string;
  onStreakChange?: (streak: number) => void;
  refreshTrigger?: number; // Prop para forçar atualização do componente
}


// Componente de exibição do fogo de streak
const StreakFire: React.FC<StreakFireProps> = ({ 
  className = '', 
  onStreakChange, 
  refreshTrigger = 0 
}) => {
  // Obtém dados do usuário do contexto de autenticação
  const { user } = useAuth();
  
  // Estados para armazenar dados do streak
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(0);
  const [hasReadToday, setHasReadToday] = useState(false);
  const [loading, setLoading] = useState(true);


  // Efeito para carregar os dados do streak quando o componente montar ou atualizar
  useEffect(() => {
    const fetchStreakInfo = async () => {
      if (user && user.user.user.id) {
        try {
          setLoading(true);
          const response = await DailyReadingService.getStreakInfo(user.user.user.id);
          
          if( response && response.streakInfo ){
            setStreak(response.streakInfo.currentStreak);
            setLives(response.streakInfo.lives);
            setHasReadToday(response.streakInfo.hasReadToday);
          }

          console.log(response.streakInfo)
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
  }, [user, refreshTrigger]); // Adiciona refreshTrigger como dependência


  // Função para determinar a cor do fogo com base no streak
  const getFireColor = () => {
    if (streak === 0 || !hasReadToday) {
      return { 
        primary: '#888888', 
        secondary: '#666666', 
        innerFlame: '#AAAAAA',
        highlight: '#CCCCCC',
        glow: 'rgba(100,100,100,0.2)'
      }; // Fogo apagado (cinza)
    }
    
    if (streak >= 100) {
      return { 
        primary: '#8A2BE2', 
        secondary: '#6A1B9A', 
        innerFlame: '#9C27B0',
        highlight: '#CE93D8',
        glow: 'rgba(138,43,226,0.4)'
      }; // Roxo (100+ dias)
    }
    
    if (streak >= 75) {
      return { 
        primary: '#FF4500', 
        secondary: '#BF360C', 
        innerFlame: '#FF7043',
        highlight: '#FFAB91',
        glow: 'rgba(255,69,0,0.4)'
      }; // Laranja avermelhado (75+ dias)
    }
    
    if (streak >= 50) {
      return { 
        primary: '#FF8C00', 
        secondary: '#EF6C00', 
        innerFlame: '#FFA726',
        highlight: '#FFCC80',
        glow: 'rgba(255,140,0,0.4)'
      }; // Laranja (50+ dias)
    }
    
    if (streak >= 30) {
      return { 
        primary: '#FFA500', 
        secondary: '#FF9100', 
        innerFlame: '#FFB74D',
        highlight: '#FFE082',
        glow: 'rgba(255,165,0,0.4)'
      }; // Amarelo alaranjado (30+ dias)
    }
    
    if (streak >= 10) {
      return { 
        primary: '#FF6347', 
        secondary: '#E64A19', 
        innerFlame: '#FF7043',
        highlight: '#FFAB91',
        glow: 'rgba(255,99,71,0.3)'
      }; // Vermelho (10+ dias)
    }
    
    // Fogo padrão (< 10 dias)
    return { 
      primary: '#FF6347', 
      secondary: '#E64A19', 
      innerFlame: '#FFCC80',
      highlight: '#FFECB3',
      glow: 'rgba(255,99,71,0.2)'
    };
  };


  // Obter cores do fogo
  const fireColor = getFireColor();


  // Preparar animação para o fogo
  const flamePulse = hasReadToday ? 'animate-flame-pulse' : '';
  
  // Adicionar classes CSS personalizadas para animações
  useEffect(() => {
    // Adiciona estilos para animação do fogo se ainda não existirem
    if (!document.getElementById('flame-animation-style')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'flame-animation-style';
      styleEl.innerHTML = `
        @keyframes flamePulse {
          0% { transform: scale(0.98); opacity: 0.9; }
          50% { transform: scale(1.02); opacity: 1; }
          100% { transform: scale(0.98); opacity: 0.9; }
        }
        .animate-flame-pulse {
          animation: flamePulse 2s ease-in-out infinite;
          transform-origin: center bottom;
        }
        @keyframes flameFlicker {
          0% { opacity: 0.85; }
          25% { opacity: 0.95; }
          50% { opacity: 0.8; }
          75% { opacity: 1; }
          100% { opacity: 0.85; }
        }
        .animate-flame-flicker {
          animation: flameFlicker 3s ease-in-out infinite;
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
                  transform: 'scale(1.2)',
                  opacity: streak > 30 ? 0.7 : 0.4
                }}
              />
            )}
            
            {/* SVG do Fogo */}
            <svg 
              viewBox="0 0 24 32" 
              className={`w-12 h-16 ${flamePulse}`}
              xmlns="http://www.w3.org/2000/svg"
              aria-label={hasReadToday ? "Fogo aceso" : "Fogo apagado"}
            >
              {/* Filtro para efeito de brilho */}
              <defs>
                <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              
              {/* Chama Base */}
              <g className={hasReadToday ? 'animate-flame-flicker' : ''}>
                <path
                  d="M12 0C12 0 13.5 4 13.5 8C13.5 12 10 14 10 18C10 22 14 24 14 24C14 24 16 22 16 20C16 18 19 16 19 12C19 6 12 0 12 0Z"
                  fill={fireColor.primary}
                  strokeWidth="1"
                  stroke={fireColor.secondary}
                  filter={hasReadToday ? "url(#glow)" : ""}
                />
                
                {/* Chama Interna */}
                <path
                  d="M12 4C12 4 13 6 13 9C13 12 11 14 11 16C11 18 12 20 12 20C12 20 14 18 14 16C14 14 15 12 15 10C15 6 12 4 12 4Z"
                  fill={fireColor.innerFlame}
                  opacity="0.8"
                />
                
                {/* Detalhes da chama (pontos de destaque) */}
                {hasReadToday && (
                  <>
                    <path
                      d="M12 6C12 6 12.5 7 12.5 8C12.5 9 12 10 12 10"
                      stroke={fireColor.highlight}
                      strokeWidth="0.5"
                      fill="none"
                      opacity="0.7"
                    />
                    <circle cx="13.5" cy="14" r="0.5" fill={fireColor.highlight} opacity="0.8" />
                    <circle cx="11.5" cy="12" r="0.3" fill={fireColor.highlight} opacity="0.7" />
                  </>
                )}
                
                {/* Base da Chama */}
                <path
                  d="M6 24C6 18 13 16 13 16C13 16 18 18 18 24C18 28 15 32 12 32C9 32 6 28 6 24Z"
                  fill={fireColor.secondary}
                  strokeWidth="1"
                  stroke={fireColor.secondary}
                />
                
                {/* Detalhes da base */}
                {hasReadToday && (
                  <path
                    d="M10 25C10 25 12 27 14 25"
                    stroke={fireColor.highlight}
                    strokeWidth="0.5"
                    fill="none"
                    opacity="0.5"
                  />
                )}
              </g>
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
          
          {/* Contador de Vidas (se tiver) */}
          {lives > 0 && (
            <div className="ml-3 bg-red-100 px-2 py-1 rounded-full flex items-center">
              <span className="text-red-600 text-xs font-bold">❤️ {lives}</span>
            </div>
          )}
          
          {/* Status do dia atual */}
          <div className="ml-3 text-xs">
            {hasReadToday ? (
              <span className="text-green-600 font-medium flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Leitura de hoje
              </span>
            ) : (
              <span className="text-gray-500 font-medium flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Pendente hoje
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
};


export default StreakFire;
