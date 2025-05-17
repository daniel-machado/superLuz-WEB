import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';

export const exportToImage = async () => {
  try {
    const element = document.getElementById('ranking-container');
    if (!element) {
      throw new Error('Container não encontrado');
    }
    
    // Salvar as dimensões originais
    const originalStyles = {
      width: element.style.width,
      height: element.style.height,
      position: element.style.position,
      overflow: element.style.overflow
    };
    
    // Aplicar estilos para captura
    element.style.width = '1920px';
    element.style.height = 'auto';
    element.style.position = 'fixed';
    element.style.top = '-9999px';
    element.style.left = '-9999px';
    element.style.overflow = 'visible';
    document.body.appendChild(element.cloneNode(true));
    
    // Adicionar elementos de estilo
    const styleContainer = document.createElement('div');
    styleContainer.style.width = '100%';
    styleContainer.style.height = '100%';
    styleContainer.style.position = 'absolute';
    styleContainer.style.background = 'linear-gradient(to right bottom, #1d4ed8, #4338ca, #6d28d9)';
    styleContainer.style.zIndex = '-1';
    element.prepend(styleContainer);
    
    // Adicionar título
    const title = document.createElement('div');
    title.style.textAlign = 'center';
    title.style.color = 'white';
    title.style.fontSize = '48px';
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '30px';
    title.style.paddingTop = '30px';
    title.textContent = 'Ranking de Unidades';
    element.prepend(title);
    
    // Adicionar marca d'água
    const watermark = document.createElement('div');
    watermark.style.position = 'absolute';
    watermark.style.bottom = '20px';
    watermark.style.right = '20px';
    watermark.style.color = 'rgba(255,255,255,0.7)';
    watermark.style.fontSize = '24px';
    watermark.textContent = 'Gerado em ' + new Date().toLocaleDateString();
    element.appendChild(watermark);
    
    // Realizar a captura da imagem
    const canvas = await html2canvas(element, {
      scale: 1,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false
    });
    
    // Converter para imagem
    const imageData = canvas.toDataURL('image/png');
    
    // Criar um link para baixar a imagem
    const link = document.createElement('a');
    link.href = imageData;
    link.download = `ranking-unidades-${new Date().toLocaleDateString().replace(/\//g, '-')}.png`;
    document.body.appendChild(link);
    
    // Baixar a imagem
    link.click();
    
    // Limpar
    document.body.removeChild(link);
    
    // Restaurar estilos originais
    element.style.width = originalStyles.width;
    element.style.height = originalStyles.height;
    element.style.position = originalStyles.position;
    element.style.overflow = originalStyles.overflow;
    element.style.top = 'auto';
    element.style.left = 'auto';
    
    // Remover elementos adicionados
    if (styleContainer.parentNode) styleContainer.parentNode.removeChild(styleContainer);
    if (title.parentNode) title.parentNode.removeChild(title);
    if (watermark.parentNode) watermark.parentNode.removeChild(watermark);
    
    toast.success('Imagem baixada com sucesso!');
  } catch (error: any) {
    console.error('Erro ao exportar para imagem:', error);
    toast.error(`Error: ${error.message}`, {
          position: 'bottom-right',
          icon: '🚫',
          className: 'dark:bg-gray-800 dark:text-white',
          duration: 5000,
        });
  }
};
