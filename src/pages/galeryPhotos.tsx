import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Download, Heart, Share2, Search, Filter, Grid3X3, Table2, Maximize } from "lucide-react";
import { Link } from "react-router-dom";
import PageMeta from "../components/common/PageMeta";

interface IPhotos {
  id: number; 
  src: string; 
  title: string; 
  description: string; 
  category: string; 
  featured: boolean; 
  date: string
}

const PhotosData = [
  {
    id: 1,
    src: "images/atividades/IMG1.jpg",
    title: "Pernoite Luzeiros do Norte",
    description: "Pernoite, acampamento de uma noite, onde fizemos atividades para a conclusão dos cadernos de classe",
    category: "acampamento",
    featured: true,
    date: "15/03/2025"
  },
  {
    id: 2,
    src: "images/atividades/IMG2.jpg",
    title: "Reunião de Abertura",
    description: "Foi dado início as atividades de 2025 com uma reunião de abertura, onde foram apresentados os novos líderes e as atividades do ano.",
    category: "reuniao",
    featured: true,
    date: "02/01/2025"
  },
  {
    id: 3,
    src: "images/atividades/IMG3.jpg",
    title: "Caminhada Ecológica",
    description: "A caminhada ecológica foi uma atividade de conscientização ambiental, onde os desbravadores aprenderam sobre a flora e fauna local.",
    category: "atividades",
    featured: false,
    date: "15/03/2025"
  },
  {
    id: 4,
    src: "images/atividades/IMG4.jpg",
    title: "Dia de Aventuras",
    description: "Fogueira e cozinha ao ar livre",
    category: "aventura",
    featured: false,
    date: "05/02/2025"
  },
  {
    id: 5,
    src: "images/atividades/IMG5.jpg",
    title: "Especialidade de Primeiros Socorros",
    description: "Primeira reunião do clube, muita alegria e diversão",
    category: "atividades",
    featured: true,
    date: "18/02/2025"
  },
  {
    id: 6,
    src: "images/atividades/IMG6.jpg",
    title: "Investidura de Classes",
    description: "Lenço, é oque nos move",
    category: "cerimonia",
    featured: false,
    date: "10/03/2025"
  },
  {
    id: 7,
    src: "images/atividades/IMG7.jpg",
    title: "Projeto Comunitário",
    description: "Abertura do clube",
    category: "atividade",
    featured: true,
    date: "28/03/2025"
  },
  {
    id: 8,
    src: "images/atividades/IMG8.jpg",
    title: "Olimpíadas dos Desbravadores",
    description: "Campori, momento emocionante",
    category: "atividade",
    featured: false,
    date: "12/04/2025"
  },
  {
    id: 9,
    src: "images/atividades/IMG9.jpg",
    title: "Especialidade de Culinária",
    description: "Campori, momento emocionante",
    category: "atividade",
    featured: false,
    date: "03/05/2025"
  },
  {
    id: 10,
    src: "images/atividades/IMG10.jpg",
    title: "Acampamento de Inverno",
    description: "Campori, momento emocionante",
    category: "cerimonia",
    featured: true,
    date: "15/06/2025"
  },
  {
    id: 11,
    src: "images/atividades/IMG11.jpg",
    title: "Dia Mundial dos Desbravadores",
    description: "Recreação na reunião do clube",
    category: "treinamento",
    featured: true,
    date: "20/09/2025"
  },
  {
    id: 12,
    src: "images/atividades/IMG12.jpg",
    title: "Workshop de Nós e Amarras",
    description: "Aprendendo técnicas essenciais de amarração para diversas situações.",
    category: "treinamento",
    featured: false,
    date: "02/07/2025"
  },
  {
    id: 13,
    src: "images/atividades/IMG13.jpg",
    title: "Visita ao Museu de Ciências",
    description: "Recreação na reunião do clube",
    category: "treinamento",
    featured: false,
    date: "14/07/2025"
  },
  {
    id: 14,
    src: "images/atividades/IMG14.jpg",
    title: "Investidura de Líderes",
    description: "Recreação na reunião do clube",
    category: "treinamento",
    featured: true,
    date: "30/07/2025"
  },
  {
    id: 15,
    src: "images/atividades/IMG15.jpg",
    title: "Especialidade de Astronomia",
    description: "Campori, momento inesquecível",
    category: "acampamento",
    featured: false,
    date: "08/08/2025"
  },
  {
    id: 16,
    src: "images/atividades/IMG16.jpg",
    title: "Acampamento de Verão",
    description: "Maior evento do ano com uma semana de aventuras e aprendizado.",
    category: "acampamento",
    featured: true,
    date: "22/08/2025"
  },
  {
    id: 17,
    src: "images/atividades/IMG17.jpg",
    title: "Ação Social",
    description: "NOsso portal no campori ULB",
    category: "projeto",
    featured: false,
    date: "05/09/2025"
  },
  {
    id: 18,
    src: "images/atividades/IMG18.jpg",
    title: "Especialidade de Sobrevivência",
    description: "Momento de alegria, abertura do campori",
    category: "evento",
    featured: true,
    date: "19/09/2025"
  },
  {
    id: 19,
    src: "images/atividades/IMG19.jpg",
    title: "Desfile Cívico",
    description: "Evolução e ordem unida sendo apresentado para todo o campori",
    category: "evento",
    featured: false,
    date: "07/09/2025"
  },
  {
    id: 20,
    src: "images/atividades/IMG20.jpg",
    title: "Confraternização de Fim de Ano",
    description: "O cantor veio tirar foto com o Luzeiros do Norte",
    category: "evento",
    featured: true,
    date: "13/12/2025"
  },
]

const GalleryPhotos = () => {
  // Estado para fotos completas incluindo as comentadas no código original
  const [photos, setPhotos] = useState<IPhotos[]>(PhotosData);

  // Estados para controlar a interface e filtros
  const [selectedPhoto, setSelectedPhoto] = useState<IPhotos | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // grid ou masonry
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favoritePhotos, setFavoritePhotos] = useState<number[]>([]);

  // Extrair categorias únicas das fotos
  useEffect(() => {
    setPhotos(PhotosData)
  }, []);

  // Extrair categorias únicas das fotos
  useEffect(() => {
    const uniqueCategories = [...new Set(photos.map(photo => photo.category))];
    setCategories(uniqueCategories);
    
    // Simular carregamento
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    // Carregar favoritos do localStorage
    const storedFavorites = localStorage.getItem("galleryFavorites");
    if (storedFavorites) {
      setFavoritePhotos(JSON.parse(storedFavorites));
    }
  }, []);

  // Salvar favoritos no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem("galleryFavorites", JSON.stringify(favoritePhotos));
  }, [favoritePhotos]);


  // Filtrar fotos com base na pesquisa e categoria
  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = photo.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        photo.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || photo.category === categoryFilter;
    const matchesFavorites = categoryFilter === "favorites" ? favoritePhotos.includes(photo.id) : true;
    
    return matchesSearch && matchesCategory && matchesFavorites;
  });


  // Alternar foto como favorita
  const toggleFavorite = (id: number) => {
    if (favoritePhotos.includes(id)) {
      setFavoritePhotos(favoritePhotos.filter(photoId => photoId !== id));
    } else {
      setFavoritePhotos([...favoritePhotos, id]);
    }
  };

  // Abrir modal com foto selecionada
  const openPhotoModal = (photo: IPhotos) => {
    setSelectedPhoto(photo);
    document.body.style.overflow = "hidden";
  };


  // Fechar modal
  const closePhotoModal = () => {
    setSelectedPhoto(null);
    document.body.style.overflow = "auto";
  };


  // Navegar para a próxima ou anterior foto no modo de visualização
  const navigatePhoto = (direction: "next" | "prev") => {
    const currentIndex = selectedPhoto ? filteredPhotos.findIndex(photo => photo.id === selectedPhoto.id) : -1;
    if (direction === "next" && currentIndex < filteredPhotos.length - 1) {
      setSelectedPhoto(filteredPhotos[currentIndex + 1]);
    } else if (direction === "prev" && currentIndex > 0) {
      setSelectedPhoto(filteredPhotos[currentIndex - 1]);
    }
  };


  // Animações para os itens da galeria
  const galleryItemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };


  // SVG decorativos
  const BackgroundSVG = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-5">
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <pattern id="dot-pattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="currentColor" className="text-green-500" />
        </pattern>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#dot-pattern)" />
        
        <g className="text-green-600">
          <path d="M0,0 L100,0 L100,20 C60,40 40,10 0,30 Z" fill="currentColor" opacity="0.2" />
          <path d="M0,100 L100,100 L100,80 C60,70 40,90 0,75 Z" fill="currentColor" opacity="0.2" />
        </g>
      </svg>
    </div>
  );

  // Download da foto
const handleDownload = (photoSrc: string, photoTitle: string) => {
  // Criar um link temporário para download
  const link = document.createElement('a');
  link.href = photoSrc;
  link.download = `${photoTitle.replace(/[^a-z0-9]/gi, '_')}.jpg`; // Normaliza o nome do arquivo
  
  // Configurações para download
  link.setAttribute('target', '_blank');
  link.style.display = 'none';
  document.body.appendChild(link);
  
  // Disparar o download
  link.click();
  
  // Limpar o link após o download
  document.body.removeChild(link);
};

// Compartilhar foto
const handleShare = async (photo: IPhotos) => {
  // Verificar se a API de compartilhamento está disponível
  if (navigator.share) {
    try {
      await navigator.share({
        title: photo.title,
        text: photo.description,
        url: photo.src // Pode ser substituído por uma URL definitiva se necessário
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      // Fallback para copiar link
      fallbackShare(photo);
    }
  } else {
    // Fallback para navegadores que não suportam Web Share API
    fallbackShare(photo);
  }
};

// Função de compartilhamento de fallback (copia link ou detalhes para área de transferência)
const fallbackShare = (photo: IPhotos) => {
  // Tentar copiar URL da imagem para área de transferência
  navigator.clipboard.writeText(photo.src)
    .then(() => {
      alert('Link da imagem copiado para a área de transferência!');
    })
    .catch(err => {
      console.error('Erro ao copiar:', err);
      alert('Não foi possível copiar o link. Tente novamente.');
    });
};



  return (
    <>
    <PageMeta
        title="Página de galeria de fotos do Clube de Desbravadores | Luzeiros do Norte"
        description="Clube de Desbravadores - Fotos das atividades do clube, incluindo acampamentos, reuniões e eventos especiais."
      />
      {/* Header da Galeria */}
      <section className="relative bg-gray-900 text-white py-16 overflow-hidden">
        <BackgroundSVG />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Galeria de Fotos</h1>
              <div className="w-24 h-1 bg-green-500 mx-auto mb-6"></div>
              <p className="text-lg text-gray-300 mb-8">
                Explore os momentos mais marcantes da nossa jornada como Desbravadores
              </p>
            </motion.div>


            {/* Barra de Pesquisa e Filtros */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex flex-col md:flex-row gap-4 justify-center mb-8"
            >
              <div className="relative flex-grow md:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Pesquisar fotos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-3 pl-10 pr-4 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                />
              </div>
              <div className="flex gap-2">
                <div className="relative inline-block w-full md:w-auto">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="appearance-none w-full bg-gray-800 border border-gray-700 py-3 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">Todas Categorias</option>
                    <option value="favorites">Favoritos</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                  <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>
                <div className="flex bg-gray-800 rounded-lg border border-gray-700">
                  <button 
                    onClick={() => setViewMode("grid")}
                    className={`p-3 ${viewMode === "grid" ? "bg-gray-700 text-green-500" : "text-gray-400"} rounded-l-lg transition-colors`}
                    aria-label="Visualização em grade"
                  >
                    <Grid3X3 size={20} />
                  </button>
                  <button 
                    onClick={() => setViewMode("masonry")}
                    className={`p-3 ${viewMode === "masonry" ? "bg-gray-700 text-green-500" : "text-gray-400"} rounded-r-lg transition-colors`}
                    aria-label="Visualização em mosaico"
                  >
                    <Table2 size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Conteúdo Principal da Galeria */}
      <section className="bg-gray-800 min-h-screen pb-20">
        <div className="container mx-auto px-4 py-8">
          {/* Estado de carregamento */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <svg className="animate-spin h-12 w-12 text-green-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-300 text-lg">Carregando galeria...</p>
            </div>
          ) : (
            <>
              {/* Contador de resultados */}
              <div className="text-gray-300 mb-6">
                <p>{filteredPhotos.length} {filteredPhotos.length === 1 ? "foto encontrada" : "fotos encontradas"}</p>
              </div>


              {filteredPhotos.length === 0 ? (
                <div className="bg-gray-700 rounded-lg p-8 text-center">
                  <Search className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-xl font-medium text-white mb-2">Nenhuma foto encontrada</h3>
                  <p className="text-gray-300">Tente ajustar seus filtros ou termos de pesquisa</p>
                </div>
              ) : (
                <>
                  {/* Grade de fotos */}
                  <div className={viewMode === "grid" 
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" 
                    : "columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6"
                  }>
                    {filteredPhotos.map((photo, index) => (
                      <motion.div
                        key={photo.id}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        variants={galleryItemVariants}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        className={`${viewMode === "masonry" ? "break-inside-avoid mb-6" : ""}`}
                      >
                        <div 
                          className="bg-gray-700 rounded-xl overflow-hidden shadow-lg group cursor-pointer relative"
                          onClick={() => openPhotoModal(photo)}
                        >
                          <div className="aspect-w-4 aspect-h-3 relative overflow-hidden">
                            <img
                              src={photo.src}
                              alt={photo.title}
                              className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                          
                          <div className="p-4">
                            <h3 className="font-bold text-white text-lg mb-1">{photo.title}</h3>
                            <p className="text-gray-300 text-sm mb-2">{photo.date}</p>
                            <p className="text-gray-400 text-sm line-clamp-2">{photo.description}</p>
                          </div>
                          
                          {/* Botões de ação */}
                          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(photo.id);
                              }} 
                              className={`p-2 rounded-full ${favoritePhotos.includes(photo.id) ? 'bg-red-500 text-white' : 'bg-gray-800/80 text-white hover:bg-red-500/80'} transition-colors`}
                              aria-label="Favoritar"
                            >
                              <Heart size={18} fill={favoritePhotos.includes(photo.id) ? "white" : "none"} />
                            </button>
                          </div>
                          
                          {/* Overlay para visualização */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full">
                              <Maximize size={24} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>


      {/* Modal de Visualização da Foto */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          >
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              {/* <button 
                onClick={() => toggleFavorite(selectedPhoto.id)}
                className={`p-3 rounded-full ${favoritePhotos.includes(selectedPhoto.id) ? 'bg-red-500 text-white' : 'bg-gray-800 text-white hover:bg-red-500/80'} transition-colors`}
                aria-label="Favoritar"
              >
                <Heart size={20} fill={favoritePhotos.includes(selectedPhoto.id) ? "white" : "none"} />
              </button> */}
              <button 
                onClick={() => handleShare(selectedPhoto)}
                className="p-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors"
                aria-label="Compartilhar"
              >
                <Share2 size={20} />
              </button>
              <button 
              onClick={() => handleDownload(selectedPhoto.src, selectedPhoto.title)}
                className="p-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors"
                aria-label="Download"
              >
                <Download size={20} />
              </button>
              <button 
                onClick={closePhotoModal}
                className="p-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors"
                aria-label="Fechar"
              >
                <X size={20} />
              </button>
            </div>
            
            <button 
              onClick={() => navigatePhoto("prev")}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-gray-800/50 hover:bg-gray-700 text-white rounded-full transition-colors"
              disabled={filteredPhotos.findIndex(photo => photo.id === selectedPhoto.id) === 0}
              aria-label="Foto anterior"
            >
              <ChevronLeft size={24} />
            </button>
            
            <button 
              onClick={() => navigatePhoto("next")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-gray-800/50 hover:bg-gray-700 text-white rounded-full transition-colors"
              disabled={filteredPhotos.findIndex(photo => photo.id === selectedPhoto.id) === filteredPhotos.length - 1}
              aria-label="Próxima foto"
            >
              <ChevronRight size={24} />
            </button>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full mx-auto"
            >
              <div className="flex flex-col md:flex-row gap-4 bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
                <div className="flex-grow md:w-3/4 relative">
                  <img 
                    src={selectedPhoto.src} 
                    alt={selectedPhoto.title}
                    className="w-full h-full object-contain max-h-[70vh]"
                  />
                </div>
                <div className="p-6 md:w-1/4 bg-gray-900 flex flex-col">
                  <h3 className="text-2xl font-bold text-white mb-2">{selectedPhoto.title}</h3>
                  <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm inline-block mb-4 w-fit">
                    {selectedPhoto.category.charAt(0).toUpperCase() + selectedPhoto.category.slice(1)}
                  </div>
                  <p className="text-gray-300 mb-2 text-sm">{selectedPhoto.date}</p>
                  <p className="text-gray-400 mb-auto">{selectedPhoto.description}</p>
                  
                  {/* <div className="border-t border-gray-700 mt-6 pt-4">
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <Heart size={16} className="text-red-500" />
                      <span>{Math.floor(Math.random() * 50) + 5} curtidas</span>
                    </div>
                  </div> */}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Botão de voltar */}
      <div className="fixed bottom-6 left-6 z-30">
        <Link
          to="/#galeria"
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
        >
          <ChevronLeft size={20} />
          <span className="hidden sm:inline">Voltar ao Site</span>
        </Link>
      </div>
    </>
  );
};


export default GalleryPhotos;
