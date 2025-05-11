// hooks/useSmoothScroll.js
import { useCallback } from 'react';


/**
 * Hook personalizado para facilitar a navegação por rolagem suave
 * @returns {Function} Função para rolar suavemente até uma seção
 */
const useSmoothScroll = () => {
  /**
   * Rola suavemente até a seção especificada pelo ID
   * @param {string} sectionId - O ID da seção para a qual rolar
   * @param {Object} options - Opções adicionais para configurar o comportamento de rolagem
   * @param {number} options.offset - Deslocamento adicional do topo (px)
   * @param {string} options.behavior - Comportamento da rolagem ('smooth' ou 'auto')
   */
  interface ScrollOptions {
    offset?: number;
    behavior?: ScrollBehavior;
  }

  const scrollToSection = useCallback((sectionId: string, options: ScrollOptions = {}) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const { offset = 0, behavior = 'smooth' } = options;
      
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;


      window.scrollTo({
        top: offsetPosition,
        behavior: behavior
      });
    }
  }, []);


  return scrollToSection;
};


export default useSmoothScroll;
