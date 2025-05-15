import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import { Link } from "react-router";
import { motion } from "framer-motion";
import PageMeta from "../components/common/PageMeta";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import useSmoothScroll from './useScrool'

//import PageBreadcrumb from "../components/common/PageBreadCrumb";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");
  const { token } = useAuth();
  const scrollToSection = useSmoothScroll();


  // Efeito para detectar o scroll e mudar o fundo do header
  useEffect(() => {
    const handleScroll = () => {
      // Lógica para o fundo do header
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }


      // Determinar qual seção está visível
      const sections = ["inicio", "sobre", "atividades", "galeria", "contato"];
      
      // Encontrar a seção mais próxima do topo da tela
      let currentSection = "inicio";
      let minDistance = Infinity;
      
      sections.forEach((sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
          const rect = section.getBoundingClientRect();
          // Considera um elemento visível quando o topo está entre -100px e metade da altura da janela
          if (rect.top < window.innerHeight / 2 && rect.top > -100) {
            const distance = Math.abs(rect.top);
            
            if (distance < minDistance) {
              minDistance = distance;
              currentSection = sectionId;
            }
          }
        }
      });
      
      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };


    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection]);


  // Função para navegar e fechar o menu mobile
  const handleNavigation = (sectionId: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    scrollToSection(sectionId, { offset: 80 });
    setActiveSection(sectionId);
  };


  const navItems = [
    { id: "inicio", label: "Início" },
    { id: "sobre", label: "Sobre" },
    { id: "atividades", label: "Atividades" },
    { id: "galeria", label: "Galeria" },
    { id: "contato", label: "Contato" }
  ];


  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-gray-900/95 shadow-lg backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="images/logo/logo-icon.svg"
              alt="Logo Clube de Desbravadores"
              className="h-12 w-auto"
            />
            <span className="ml-3 text-xl font-bold text-white">Luzeiros do Norte</span>
          </div>

          {/* Links de navegação - Desktop */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavigation(item.id, e)}
                className={`${
                  activeSection === item.id
                    ? "text-white font-medium border-b-2 border-green-500"
                    : "text-gray-300 hover:text-white"
                } transition-colors pb-1`}
              >
                {item.label}
              </a>
            ))}
          </nav>


          {/* Botão de Login */}
          <div className="hidden md:block">
            {!token ? (
              <Link
                to="/sign-in"
                className="px-6 py-2 bg-green-500 hover:bg-green-400 text-gray-900 font-medium rounded-lg transition-colors duration-300 transform hover:scale-105"
              >
                Login
              </Link>
            ) : (
              <Link
                to="/home"
                className="px-6 py-2 bg-green-500 hover:bg-green-400 text-gray-900 font-medium rounded-lg transition-colors duration-300 transform hover:scale-105"
              >
                Ir para o sistema
              </Link>
            )}
          </div>


          {/* Menu Hambúrguer - Mobile */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>


        {/* Menu Mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800 shadow-lg rounded-lg mt-2 py-3 px-4">
            <nav className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavigation(item.id, e)}
                  className={`${
                    activeSection === item.id
                      ? "text-white font-medium border-l-2 pl-2 border-green-500"
                      : "text-gray-300 hover:text-white pl-2"
                  } transition-colors`}
                >
                  {item.label}
                </a>
              ))}
              
              {!token ? (
                <Link
                  to="/sign-in"
                  className="px-6 py-2 bg-green-500 hover:bg-green-400 text-gray-900 font-medium rounded-lg transition-colors inline-block text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              ) : (
                <Link
                  to="/home"
                  className="px-6 py-2 bg-green-500 hover:bg-green-400 text-gray-900 font-medium rounded-lg transition-colors inline-block text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Ir para o sistema
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};


// Componente Hero
const Hero = () => {
  const scrollToSection = useSmoothScroll();
  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
      {/* Background com efeito de paralaxe */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('images/clube_background.jpg')",
          filter: "brightness(40%)",
        }}
      ></div>




      {/* Padrão de sobreposição */}
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "url(images/clube_background.jpg')" }}></div>




      {/* Conteúdo */}
      <div className="container mx-auto px-6 z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="images/logoLuzeiros.png" // Substitua pela sua logo em maior tamanho
            alt="Logo Clube de Desbravadores"
            className="mx-auto w-32 sm:w-40 md:w-48 mb-8"
          />
        </motion.div>




        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
        >
          <span className="text-green-600">Desbravadores Luzeiros do Norte</span>
          <br />
          <span className="text-3xl sm:text-4xl md:text-5xl">Aventura, Amizade e Crescimento</span>
        </motion.h1>




        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
        >
          Formando líderes através de aventuras, aprendizado e serviço à comunidade
        </motion.p>

        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6"
        >
          <a
            href="/sobre"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("sobre", { offset: 80 }); // offset para compensar o header fixo
            }}
            className="px-8 py-3 bg-green-500 hover:bg-green-400 text-gray-900 font-medium rounded-lg transition-colors duration-300 transform hover:scale-105 text-lg"
          >
            Conheça Mais
          </a>
          <a
            href="/atividades"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("atividades", { offset: 80 });
            }}
            className="px-8 py-3 border-2 border-white text-white hover:bg-white/10 font-medium rounded-lg transition-colors duration-300 transform hover:scale-105 text-lg"
          >
            Nossas Atividades
          </a>
        </motion.div>

      </div>




      {/* Seta para baixo */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center animate-bounce">
          <a
            href="/sobre"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("sobre", { offset: 80 }); // offset para compensar o header fixo
            }}
            className="text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
      </div>
    </section>
  );
};




// Componente Sobre
const Sobre = () => {
  return (
    <section id="sobre" className="py-24 bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
          >
            Quem Somos
          </motion.h2>
          <div className="w-24 h-1 bg-green-500 mx-auto mb-8"></div>
        </div>




        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="images/clube_background2.jpg" // Substitua pela sua imagem
              alt="Equipe de Desbravadores"
              className="rounded-xl shadow-2xl w-full h-auto"
            />
          </motion.div>




          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-green-400">Nossa Missão</h3>
            <p className="text-gray-300 text-lg">
              O Clube de Desbravadores é uma organização mundial que trabalha especificamente com o desenvolvimento físico, mental e espiritual de crianças e adolescentes.
            </p>
            
            <p className="text-gray-300 text-lg">
              Nossas atividades têm como objetivo educar crianças e adolescentes para uma vida útil, incentivando o estudo da natureza, desenvolvendo suas habilidades e talentos, despertando o gosto pelo campismo e aventuras ao ar livre.
            </p>

            <p className="text-gray-300 text-lg">
              O clube é um espaço seguro e acolhedor, onde os jovens podem fazer amigos, aprender novas habilidades e crescer como indivíduos. Acreditamos que cada membro é especial e tem um papel importante na nossa comunidade.
            </p>

            <p className="text-gray-300 text-lg">
              Junte-se a nós e faça parte dessa incrível jornada de aprendizado, amizade e crescimento! Estamos sempre abertos a novos membros e interessados em fazer a diferença na vida dos jovens.
            </p>




            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="flex flex-col items-center bg-gray-800 p-6 rounded-lg">
                <span className="text-green-400 text-4xl font-bold mb-2">45+</span>
                <span className="text-white">Membros ativos</span>
              </div>
              <div className="flex flex-col items-center bg-gray-800 p-6 rounded-lg">
                <span className="text-green-400 text-4xl font-bold mb-2">19+</span>
                <span className="text-white">Anos de história</span>
              </div>
              <div className="flex flex-col items-center bg-gray-800 p-6 rounded-lg">
                <span className="text-green-400 text-4xl font-bold mb-2">100+</span>
                <span className="text-white">Especialidades realizadas</span>
              </div>
              <div className="flex flex-col items-center bg-gray-800 p-6 rounded-lg">
                <span className="text-green-400 text-4xl font-bold mb-2">100+</span>
                <span className="text-white">Aventuras realizadas</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};




// Componente de Atividades
const Atividades = () => {
  const atividades = [
    {
      icon: "🏕️",
      title: "Acampamentos",
      description: "Aventuras ao ar livre com acampamentos e atividades na natureza."
    },
    {
      icon: "📚",
      title: "Especialidades",
      description: "Aprendizado de habilidades específicas em diversas áreas de conhecimento."
    },
    {
      icon: "🧠",
      title: "Desenvolvimento Pessoal",
      description: "Atividades que promovem crescimento físico, mental e espiritual."
    },
    {
      icon: "🤝",
      title: "Serviço Comunitário",
      description: "Projetos de ajuda e impacto positivo na comunidade local."
    },
    {
      icon: "🧭",
      title: "Técnicas de Sobrevivência",
      description: "Aprendizado de técnicas de orientação, primeiros socorros, sobrevivência, fogueiras, plantas comestíveis e diversas outras atividades relacionadas."
    },
    {
      icon: "🎯",
      title: "Liderança",
      description: "Formação de líderes através de desafios e responsabilidades progressivas."
    }
  ];




  return (
    <section id="atividades" className="py-24 bg-gray-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
          >
            Nossas Atividades
          </motion.h2>
          <div className="w-24 h-1 bg-green-500 mx-auto mb-8"></div>
          <p className="text-gray-300 max-w-3xl mx-auto text-lg">
            Desenvolvemos diversas atividades que promovem o crescimento integral, a amizade e o desenvolvimento de habilidades para a vida.
          </p>
        </div>




        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {atividades.map((atividade, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-2"
            >
              <div className="text-4xl mb-4">{atividade.icon}</div>
              <h3 className="text-xl font-bold text-green-400 mb-3">{atividade.title}</h3>
              <p className="text-gray-300">{atividade.description}</p>
            </motion.div>
          ))}
        </div>




        <div className="mt-16 text-center">
          <Link
            to="/gallery"
            className="px-8 py-3 bg-green-500 hover:bg-green-400 text-gray-900 font-medium rounded-lg transition-colors duration-300 transform hover:scale-105 inline-block"
          >
            Ver Nossa Galeria
          </Link>
        </div>
      </div>
    </section>
  );
};




// Componente de Vídeo
const VideoSection = () => {
  return (
    <section className="py-24 bg-gray-900 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-50 bg-cover bg-center"
        style={{
          backgroundImage: "url('images/clube_igreja.jpg')",
          //backgroundSize: "1500px",
          filter: "brightness(40%)",
        }}
      ></div>
      
      

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
          >
            Conheça Nossa História
          </motion.h2>
          <div className="w-24 h-1 bg-green-500 mx-auto mb-8"></div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="aspect-w-16 aspect-h-9 max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl"
        >
        <div className="aspect-18/9 overflow-hidden rounded-lg">
          <iframe
            src="https://www.youtube.com/embed/_fLssPA2jCw"
            title="YouTube video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
        </motion.div>
        <div className="mt-12 text-center">
          {/* <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Assista ao nosso vídeo e descubra a incrível jornada do nosso clube, desde sua fundação até os dias atuais, 
            com depoimentos inspiradores e momentos inesquecíveis.
          </p> */}
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Assista ao nosso vídeo e veja uma das atividades que realizamos, que os desbravadores mais adoraram! 
            A ordem unida e evolução é uma atividade que envolve disciplina, trabalho em equipe e muita diversão!
          </p>
        </div>
      </div>
    </section>
  );
};




// Componente de Galeria
const Galeria = () => {
  const imagens = [
    {
    src: "images/atividades/IMG1.jpg",
    title: "Pernoite Luzeiros do Norte",
    description: "Pernoite, acampamento de uma noite, onde fizemos atividades para a conclusão dos cadernos de classe"
    },
    {
      src: "images/atividades/IMG2.jpg", 
      title: "Reunião de Abertura",
      description: "Foi dado início as atividades de 2025 com uma reunião de abertura, onde foram apresentados os novos líderes e as atividades do ano."
    },
    {
      src: "images/atividades/IMG3.jpg",
      title: "Caminhada Ecológica",
      description: "A caminhada ecológica foi uma atividade de conscientização ambiental, onde os desbravadores aprenderam sobre a flora e fauna local."
    }
    // "images/atividades/IMG4.jpg", 
    // "images/atividades/IMG5.jpg", 
    // "images/atividades/IMG6.jpg", 
    // "images/atividades/IMG7.jpg", 
    // "images/atividades/IMG8.jpg", 
    // "images/atividades/IMG9.jpg", 
    // "images/atividades/IMG10.jpg", 
    // "images/atividades/IMG11.jpg", 
    // "images/atividades/IMG12.jpg", 
    // "images/atividades/IMG13.jpg", 
    // "images/atividades/IMG14.jpg", 
    // "images/atividades/IMG15.jpg", 
    // "images/atividades/IMG16.jpg", 
    // "images/atividades/IMG17.jpg", 
    // "images/atividades/IMG18.jpg", 
    // "images/atividades/IMG19.jpg", 
    // "images/atividades/IMG20.jpg", 
  ];




  return (
    <section id="galeria" className="py-24 bg-gray-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
          >
            Nossa Galeria
          </motion.h2>
          <div className="w-24 h-1 bg-green-500 mx-auto mb-8"></div>
          <p className="text-gray-300 max-w-3xl mx-auto text-lg">
            Confira alguns momentos especiais das nossas aventuras e atividades realizadas
          </p>
        </div>




        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {imagens.map((imagem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="overflow-hidden rounded-xl shadow-lg group relative"
            >
              <img
                src={imagem.src}
                alt={`Foto da galeria ${index + 1}`}
                className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div className="text-white">
                  <h3 className="font-bold text-xl">{imagem.title}</h3>
                  <p className="text-gray-200">{imagem.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>




        <div className="mt-12 text-center">
          <Link
            to="/gallery"
            className="px-8 py-3 border-2 border-green-500 text-green-500 hover:bg-green-500/10 font-medium rounded-lg transition-colors duration-300 transform hover:scale-105 inline-block"
          >
            Ver Mais Fotos
          </Link>
        </div>
      </div>
    </section>
  );
};

// Componente de Testemunhos
const Testemunhos = () => {
  const testemunhos = [
    {
      nome: "Deísa Maria",
      foto: "images/testemunhos/deisa.png", 
      cargo: "Desbravadora há 2 anos",
      texto: "O Clube de Desbravadores mudou minha vida. Aprendi valores importantes e fiz amizades que levarei para sempre. As aventuras e desafios me ajudaram a crescer como pessoa."
    },
    {
      nome: "Fabrício Gonçalves",
      foto: "images/testemunhos/fabricio.png",
      cargo: "Conselheiro",
      texto: "Ver o desenvolvimento dos jovens é incrível. O clube proporciona experiências transformadoras que ajudam a formar o caráter e preparar para a vida."
    },
    {
      nome: "Andreza Almeida",
      foto: "images/testemunhos/Andreza.png",
      cargo: "Mãe de desbravador",
      texto: "Meu filho se tornou mais responsável e confiante desde que entrou no clube. As atividades promovem valores que fazem toda a diferença na formação dele."
    }
  ];




  return (
    <section className="py-24 bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
          >
            Depoimentos
          </motion.h2>
          <div className="w-24 h-1 bg-green-500 mx-auto mb-8"></div>
        </div>




        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testemunhos.map((testemunho, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testemunho.foto}
                  alt={testemunho.nome}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-white">{testemunho.nome}</h3>
                  <p className="text-green-400">{testemunho.cargo}</p>
                </div>
              </div>
              <p className="text-gray-300 italic">"{testemunho.texto}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Componente de Contato e Mapa
const Contato = () => {  
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const telefoneRef = useRef<HTMLInputElement | null>(null);
  const assuntoRef = useRef<HTMLInputElement | null>(null);
  const messageRef = useRef<HTMLTextAreaElement | null>(null);

  const [loading, setLoading] = useState(false);

  const serviceId = "service_u8ma6lk";
  const templateId = "template_uqx1as4";

  useEffect(() => emailjs.init("AC_VcC2DVIywfHjeV"), []);

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await emailjs.send(serviceId, templateId, {
        name: nameRef.current?.value,
        email: emailRef.current?.value,
        telefone: telefoneRef.current?.value,
        assunto: assuntoRef.current?.value,
        message: messageRef.current?.value,
      });
      toast.success("Mensagem enviada com sucesso!", { position: "bottom-right" });
      
      
      if (nameRef.current) nameRef.current.value = "";
      if (emailRef.current) emailRef.current.value = "";
      if (telefoneRef.current) telefoneRef.current.value = "";
      if (assuntoRef.current) assuntoRef.current.value = "";
      if (messageRef.current) messageRef.current.value = "";

    } catch (error) {
      console.log(error);
      toast.error("Erro ao enviar mensagem.", { position: "bottom-right" });
    } finally {
      setLoading(false);
    }  
  };
  
  return (
    <section id="contato" className="py-24 bg-gray-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
          >
            Entre em Contato
          </motion.h2>
          <div className="w-24 h-1 bg-green-500 mx-auto mb-8"></div>
          <p className="text-gray-300 max-w-3xl mx-auto text-lg">
            Quer participar ou saber mais sobre o nosso clube? Entre em contato conosco!
          </p>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gray-900 p-8 rounded-xl shadow-lg"
          >
            <h3 className="text-2xl font-bold text-green-400 mb-6">Informações de Contato</h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-green-500 rounded-full p-3 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-medium">Endereço</h4>
                  <p className="text-gray-300">Colégio Guiomar Barreto - Juazeiro/BA</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-500 rounded-full p-3 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-medium">Telefone</h4>
                  <p className="text-gray-300">(74) 9 9915-9977</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-500 rounded-full p-3 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-medium">Email</h4>
                  <p className="text-gray-300">clubeluzeirosdonorte@gmail.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-500 rounded-full p-3 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-medium">Horário de Reuniões</h4>
                  <p className="text-gray-300">Domingo: 8:30 às 12h</p>
                </div>
              </div>
            </div>

            {/* Redes sociais */}
            <div className="mt-8">
              <h4 className="text-white font-medium mb-4">Siga-nos nas redes sociais</h4>
              <div className="flex space-x-4">
                <a href="https://www.facebook.com/luzeirosdonortedbv?locale=pt_BR" className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
                <a href="https://www.instagram.com/luzeirosdonortedbv/" className="bg-pink-600 hover:bg-pink-700 text-white p-3 rounded-full transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="https://www.youtube.com/@FabricioGoncalves1950" className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                </a>
                {/* <a href="#" className="bg-blue-400 hover:bg-blue-500 text-white p-3 rounded-full transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a> */}
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-900 p-8 rounded-xl shadow-lg"
          >
            <h3 className="text-2xl font-bold text-green-400 mb-6">Envie uma Mensagem</h3>
            
            <form 
              className="space-y-6"
              onSubmit={sendEmail}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="nome" className="block text-white mb-2">Nome</label>
                  <input
                    ref={nameRef}
                    type="text"
                    id="nome"
                    name="nome"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                    placeholder="Seu nome"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-white mb-2">Email</label>
                  <input
                    type="email"
                    ref={emailRef}
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                    placeholder="Seu email"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="telefone" className="block text-white mb-2">telefone</label>
                  <input
                    type="tel"
                    ref={telefoneRef}
                    id="telefone"
                    name="telefone"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                    placeholder="Seu whatsapp"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="assunto" className="block text-white mb-2">Assunto</label>
                <input
                  type="text"
                  ref={assuntoRef}
                  id="assunto"
                  name="assunto"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                  placeholder="Assunto da mensagem"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="mensagem" className="block text-white mb-2">Mensagem</label>
                <textarea
                  id="mensagem"
                  ref={messageRef}
                  name="mensagem"
                  rows={5}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white resize-none"
                  placeholder="Sua mensagem"
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                value="Send"
                disabled={loading}
                className="w-full px-6 py-3 bg-green-500 hover:bg-green-400 text-gray-900 font-medium rounded-lg transition-colors duration-300 transform hover:scale-105"
              >
                Enviar Mensagem
              </button>
            </form>
          </motion.div>
        </div>
        
        {/* Mapa */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 rounded-xl overflow-hidden shadow-lg"
        >
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3561.30049828014!2d-40.496062425417435!3d-9.47693309938926!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7737242b68b7f13%3A0x40535d01ecaa9098!2sIgreja%20Adventista%20do%207%C2%BA%20Dia%20-%20Parque%20Residencial!5e1!3m2!1spt-BR!2sbr!4v1746811099736!5m2!1spt-BR!2sbr" 
            width="100%" 
            height="300" 
            style={{ border: 0 }}
            allowFullScreen={true} 
            loading="lazy" 
            //referrerpolicy="no-referrer-when-downgrade"
            title="Localização do Clube de Desbravadores Luzeiros do Norte"
          ></iframe>
        </motion.div>
      </div>
    </section>
  );
};

// Componente Footer
const Footer = () => {
  const scrollToSection = useSmoothScroll();

    const navItems = [
      { id: "inicio", label: "Início" },
      { id: "sobre", label: "Sobre" },
      { id: "atividades", label: "Atividades" },
      { id: "galeria", label: "Galeria" },
      { id: "contato", label: "Contato" }
    ];

  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e informações */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img
                src="images/logoLuzeiros.png"
                alt="Logo Clube de Desbravadores Luzeiros do Norte"
                className="h-12 w-auto"
              />
              <span className="ml-3 text-xl font-bold text-white">Luzeiros do Norte</span>
            </div>
            <p className="text-sm">
              Um ministério de desenvolvimento e serviço para crianças e adolescentes.
            </p>
            
            <div className="flex space-x-4 pt-2">
              <a
                href="https://www.facebook.com/luzeirosdonortedbv?locale=pt_BR"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/luzeirosdonortedbv/"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@FabricioGoncalves1950"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              {navItems.map((link) => (
                <li key={link.id}>
                  <a 
                    href={`#${link.id}`} 
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.id, { offset: 80 });
                    }} 
                    className="hover:text-green-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Horários */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Horários</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Domingos:</span>
                <span>08:30 - 12:00</span>
              </li>
              <li className="flex justify-between">
                <span>Quintas-feiras:</span>
                <span>19:00 - 21:00</span>
              </li>
              {/* <li className="flex justify-between">
                <span>Sábados:</span>
                <span>15:00 - 18:00</span>
              </li> */}
            </ul>
          </div>


          {/* Newsletter */}
          {/* <div>
            <h3 className="text-lg font-bold text-white mb-4">Newsletter</h3>
            <p className="text-sm mb-4">
              Inscreva-se para receber novidades e informações sobre nossas atividades
            </p>
            <form className="space-y-3">
              <div>
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-medium rounded-lg transition-colors"
              >
                Inscrever
              </button>
            </form>
          </div>*/}        
        </div> 


        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} Clube de Desbravadores. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};


// Estrutura principal da página
export default function Home() {
  return (
    <>
      <PageMeta
        title="Página Inicial do Sistema de Gerenciamento do Clube de Desbravadores | Luzeiros do Norte"
        description="Clube de Desbravadores - Formando líderes através de aventuras, aprendizado e serviço à comunidade"
      />
      <Header />

      <main className="max-w-full overflow-x-auto custom-scrollbar">
        <section id="inicio">
        <Hero />
        </section>

        <section id="sobre">
        <Sobre />
        </section>

        <section id="atividades">
        <Atividades />
        </section>

        <section><VideoSection /></section>
        
        <section id="galeria">
        <Galeria />
        </section>

        <section><Testemunhos /></section>
        
        <section id="contato">
        <Contato />
        </section>
      </main>
      <Footer />
    </>
  );
}
