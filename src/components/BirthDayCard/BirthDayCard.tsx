



import { useState, useEffect } from 'react';
import { Cake, Gift, PartyPopper, Stars } from 'lucide-react';

import LogoLuzeiros from '../../../public/images/logoLuzeiros.png'

// Componente de partículas de confete
type ConfettiParticleProps = {
  id: number;
  color: string;
  size: number;
  left: number;
  delay: number;
};


const ConfettiParticle = ({ color, size, left, delay }: ConfettiParticleProps) => {
  return (
    <div
      className={`absolute animate-confetti`}
      style={{
        backgroundColor: color,
        width: size,
        height: size * 1.5,
        left: `${left}%`,
        top: '-5%',
        animationDelay: `${delay}s`,
      }}
    />
  );
};


// Componente de card de aniversário
type User = {
  id: string;
  name: string;
  email: string;
  birthDate: string;
  role: string;
  photoUrl: string;
  status: string;
};


type BirthdayUser = User & { age: number };


// Adicione a propriedade logoUrl para passar a URL da logomarca
const BirthdayCard = ({ users }: { users: User[], logoUrl?: string }) => {
  const [birthdayUsers, setBirthdayUsers] = useState<BirthdayUser[]>([]);
  const [confetti, setConfetti] = useState<ConfettiParticleProps[]>([]);


  // Função para formatar e comparar datas de aniversário
  const formatBirthDate = (dateStr: string) => {
    // Formato esperado: DD/MM/YYYY
    const [day, month, year] = dateStr.split('/');
    return { day, month, year };
  };


  // Função para verificar se é aniversário hoje
  const isBirthday = (birthDateStr: string) => {
    const today = new Date();
    const { day, month } = formatBirthDate(birthDateStr);
   
    // Comparamos apenas dia e mês
    return parseInt(day) === today.getDate() && parseInt(month) === today.getMonth() + 1;
  };


  // Função para calcular idade
  const calculateAge = (birthDateStr: string) => {
    const today = new Date();
    const { day, month, year } = formatBirthDate(birthDateStr);
   
    let age = today.getFullYear() - parseInt(year);
   
    // Se ainda não chegou o aniversário este ano, subtrair 1
    if (today.getMonth() + 1 < parseInt(month) ||
        (today.getMonth() + 1 === parseInt(month) && today.getDate() < parseInt(day))) {
      age--;
    }
   
    return age;
  };


  // Função para traduzir o papel (role)
  const translateRole = (role: string) => {
    switch(role) {
      case 'admin': return 'Administrador';
      case 'director': return 'Diretor';
      case 'dbv': return 'Desbravador';
      case 'lead': return 'Líder';
      case 'secretary': return 'Liderança';
      case 'counselor': return 'Conselheiro';
      default: return role;
    }
  };
 
  // Gerar confetes aleatórios
  const generateConfetti = () => {
    const colors = ['#FF5252', '#FFAB40', '#7C4DFF', '#40C4FF', '#64FFDA', '#EEFF41'];
    const newConfetti = [];
   
    for (let i = 0; i < 30; i++) {
      newConfetti.push({
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.floor(Math.random() * 8) + 5,
        left: Math.floor(Math.random() * 100),
        delay: Math.random() * 5
      });
    }
   
    setConfetti(newConfetti);
  };


  // Efeito para filtrar aniversariantes
  useEffect(() => {
    // Filtramos apenas usuários aprovados
    const approvedUsers = users.filter(user => user.status === "approved");
   
    // Verificamos quem faz aniversário hoje
    const todayBirthdayUsers = approvedUsers.filter(user => isBirthday(user.birthDate));
   
    // Adiciona idade a cada usuário aniversariante
    const birthdayUsersWithAge = todayBirthdayUsers.map(user => ({
      ...user,
      age: calculateAge(user.birthDate)
    }));
   
    setBirthdayUsers(birthdayUsersWithAge);
   
    // Geramos os confetes para animar o card
    if (birthdayUsersWithAge.length > 0) {
      generateConfetti();
    }
  }, [users]);


  // Se não há aniversariantes, não renderiza nada
  if (birthdayUsers.length === 0) {
    return null;
  }


  return (
    <div className="w-full px-4 py-6">
      {birthdayUsers.map((user) => (
        <div
          key={user.id}
          className="w-full relative bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl overflow-hidden shadow-xl border border-purple-500 transform transition-all duration-300 hover:scale-[1.02]"
        >
          {/* Confetes animados */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {confetti.map((item) => (
              <ConfettiParticle
                key={item.id}
                id={item.id}
                color={item.color}
                size={item.size}
                left={item.left}
                delay={item.delay}
              />
            ))}
          </div>


          {/* Cabeçalho do card com logo */}
          <div className="relative z-10 px-6 pt-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PartyPopper className="text-yellow-300 h-6 w-6 animate-pulse" />
              <h2 className="text-xl font-bold text-white">Aniversário Hoje!</h2>
            </div>
            <Stars className="text-yellow-300 h-6 w-6 animate-spin-slow" />
          </div>


          {/* Conteúdo do card */}
          <div className="relative z-10 p-7">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Coluna da esquerda - Logo do clube + Foto do usuário */}
              <div className="flex flex-col items-center gap-4">
                {/* Logo do clube */}
                <div className="w-30 h-30 md:w-30 md:h-30 rounded-lg overflow-hidden p-1 shadow-lg">
                  <img
                    src={LogoLuzeiros}
                    alt="Logo do Clube de Desbravadores"
                    className="w-full h-full object-contain"
                  />
                </div>
                
                {/* Foto do usuário */}
                <div className="relative">
                  <div className="w-35 h-35 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-yellow-300 shadow-lg">
                    <img
                      src={user.photoUrl}
                      alt={`Foto de ${user.name}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-yellow-300 rounded-full p-2 shadow-lg">
                    <Gift className="h-6 w-6 text-purple-900" />
                  </div>
                </div>
              </div>


              {/* Informações do usuário */}
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <h3 className="text-2xl font-bold text-white mb-1">{user.name}</h3>
                <p className="text-lg text-purple-200 mb-2 flex items-center">
                  <Cake className="inline-block mr-2 h-5 w-5" />
                  <span>{user.birthDate} • {user.age} anos hoje!</span>
                </p>
                <div className="inline-block bg-purple-700 text-purple-100 px-3 py-1 rounded-full text-sm font-medium">
                  {translateRole(user.role)}
                </div>
               
                {/* Mensagem de felicitação */}
                <p className="mt-4 text-lg text-yellow-200 font-semibold italic">
                  "Feliz aniversário! Nós do clube Luzeiros do Norte desejamos um dia repleto de bênçãos e alegrias!"
                </p>
              </div>
            </div>
          </div>
         
          {/* Efeitos de decoração */}
          <div className="absolute top-0 right-0 bg-yellow-300 w-16 h-16 transform rotate-45 translate-x-8 translate-y-8 opacity-30"></div>
          <div className="absolute bottom-0 left-0 bg-purple-400 w-24 h-24 rounded-full transform -translate-x-12 -translate-y-12 opacity-20"></div>
        </div>
      ))}
     
      {/* Estilos para animações */}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
       
        .animate-confetti {
          animation: confetti-fall 5s linear forwards;
        }
       
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
       
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};


export default BirthdayCard;



















































// import { useState, useEffect } from 'react';
// import { Cake, Star, Gift } from 'lucide-react';


// type BirthdayUser = { id: number; name: string; birthDate: string };

// const BirthdayCard = () => {
//   const [birthdayUsers, setBirthdayUsers] = useState<BirthdayUser[]>([]);
//   const [showConfetti, setShowConfetti] = useState(false);
  
//   // Componente de confete individual
//   type ConfettiProps = {
//     id: number;
//     left: number;
//     delay: number;
//     color: string;
//     size: number;
//     duration: number;
//   };

//   const Confetti = ({ id, left, delay, color, size, duration }: ConfettiProps) => (
//     <div
//       key={id}
//       className={`absolute ${color} rounded-full animate-confetti pointer-events-none`}
//       style={{
//         left: `${left}%`,
//         width: `${size}px`,
//         height: `${size}px`,
//         animationDelay: `${delay}s`,
//         animationDuration: `${duration}s`
//       }}
//     />
//   );


//   // Componente para todos os confetes
//   const ConfettiContainer = () => {
//     const confettiItems = [];
//     const colors = ['bg-pink-500', 'bg-yellow-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400'];
    
//     for (let i = 0; i < 50; i++) {
//       confettiItems.push(
//         <Confetti
//           key={i}
//           id={i}
//           left={Math.random() * 100}
//           delay={Math.random() * 5}
//           color={colors[Math.floor(Math.random() * colors.length)]}
//           size={Math.random() * 8 + 4}
//           duration={Math.random() * 3 + 4}
//         />
//       );
//     }
    
//     return (
//       <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
//         {showConfetti && confettiItems}
//       </div>
//     );
//   };


//   // Efeito para simular partículas flutuantes
//   const FloatingParticles = () => {
//     return (
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         {[...Array(15)].map((_, i) => (
//           <div
//             key={i}
//             className={`absolute rounded-full opacity-60 animate-float`}
//             style={{
//               backgroundColor: ['#FF69B4', '#FFD700', '#00BFFF', '#9370DB'][Math.floor(Math.random() * 4)],
//               width: `${Math.random() * 10 + 5}px`,
//               height: `${Math.random() * 10 + 5}px`,
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               animationDuration: `${Math.random() * 5 + 5}s`,
//               animationDelay: `${Math.random() * 5}s`,
//             }}
//           />
//         ))}
//       </div>
//     );
//   };


//   useEffect(() => {
//     // Simular dados de usuários com as datas fornecidas
//     const mockUsers = [
//       { id: 1, name: 'Ana Silva', birthDate: '15/10/2011' },
//       { id: 2, name: 'Carlos Mendes', birthDate: '24/04/2014' },
//       { id: 3, name: 'Juliana Lima', birthDate: '16/09/2015' },
//       { id: 4, name: 'Pedro Santos', birthDate: '28/03/2012' },
//       { id: 5, name: 'Mariana Costa', birthDate: '07/09/2002' },
//       { id: 6, name: 'Rafael Oliveira', birthDate: '29/11/2012' },
//       { id: 7, name: 'Fernanda Souza', birthDate: '13/08/2002' },
//       { id: 8, name: 'Lucas Pereira', birthDate: '11/11/1997' },
//       { id: 9, name: 'Beatriz Almeida', birthDate: '27/09/2012' },
//       { id: 10, name: 'Gabriel Ferreira', birthDate: '16/09/1990' },
//       { id: 11, name: 'Isabela Martins', birthDate: '11/07/1994' },
//       { id: 12, name: 'Matheus Rodrigues', birthDate: '07/03/2012' },
//       { id: 13, name: 'Amanda Gomes', birthDate: '25/08/2011' },
//       { id: 14, name: 'Thiago Carvalho', birthDate: '25/01/2012' },
//       { id: 15, name: 'Letícia Barbosa', birthDate: '11/04/1998' },
//       { id: 16, name: 'Vinícius Castro', birthDate: '22/08/1996' },
//       { id: 17, name: 'Carolina Ribeiro', birthDate: '26/04/2011' },
//       { id: 18, name: 'Henrique Cardoso', birthDate: '25/06/2009' },
//       { id: 19, name: 'Natália Duarte', birthDate: '18/04/2006' },
//       { id: 20, name: 'Felipe Nunes', birthDate: '09/08/1996' },
//       { id: 21, name: 'Laura Teixeira', birthDate: '25/08/2014' },
//       { id: 22, name: 'Bruno Monteiro', birthDate: '21/01/2014' },
//       { id: 23, name: 'Camila Moreira', birthDate: '12/08/2025' },
//       { id: 24, name: 'Gustavo Rocha', birthDate: '04/04/2016' },
//       { id: 25, name: 'Daniela Campos', birthDate: '09/01/2013' },
//       { id: 26, name: 'Leonardo Vieira', birthDate: '23/04/2011' },
//       { id: 27, name: 'Vanessa Dias', birthDate: '13/01/2012' },
//       { id: 28, name: 'Eduardo Soares', birthDate: '08/12/2014' },
//       { id: 29, name: 'Renata Lopes', birthDate: '16/09/2013' },
//       // Para fins de demonstração, adicionar um usuário com aniversário hoje
//       { id: 30, name: 'João da Silva', birthDate: new Date().toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit', year: 'numeric'}) },
//       { id: 31, name: 'Daniel Machado', birthDate: new Date().toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit', year: 'numeric'}) }
//     ];
    
//     // Encontrar usuários que fazem aniversário hoje
//     const today = new Date();
//     const todayFormatted = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}`;
    
//     const birthdayPeople = mockUsers.filter(user => {
//       const [userDay, userMonth] = user.birthDate.split('/');
//       const userDayMonth = `${userDay}/${userMonth}`;
//       return userDayMonth === todayFormatted;
//     });
    
//     setBirthdayUsers(birthdayPeople);
    
//     // Ativar confetes se houver aniversariantes
//     if (birthdayPeople.length > 0) {
//       setShowConfetti(true);
//     }
//   }, []);


//   // Desenho SVG de bolo de aniversário
//   const CakeSVG = () => (
//     <svg className="absolute -bottom-6 -left-6 opacity-20 w-32 h-32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <path d="M50 20C53 15 58 15 60 20C62 15 67 15 70 20C73 15 78 15 80 20V30H40V20C42 15 47 15 50 20Z" fill="#FF6B81"/>
//       <rect x="30" y="30" width="60" height="20" fill="#FFD86C"/>
//       <rect x="25" y="50" width="70" height="20" fill="#FF8BD9"/>
//       <rect x="20" y="70" width="80" height="15" fill="#77D1F3"/>
//       <circle cx="50" cy="10" r="2" fill="#FFEB3B"/>
//       <circle cx="60" cy="10" r="2" fill="#FFEB3B"/>
//       <circle cx="70" cy="10" r="2" fill="#FFEB3B"/>
//       <rect x="48" y="10" width="2" height="10" fill="#8D6E63"/>
//       <rect x="58" y="10" width="2" height="10" fill="#8D6E63"/>
//       <rect x="68" y="10" width="2" height="10" fill="#8D6E63"/>
//     </svg>
//   );


//   // Desenho SVG de presente de aniversário
//   const GiftSVG = () => (
//     <svg className="absolute -top-6 -right-6 opacity-20 w-32 h-32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <rect x="25" y="40" width="50" height="50" fill="#FF4081"/>
//       <rect x="45" y="40" width="10" height="50" fill="#E91E63"/>
//       <rect x="25" y="60" width="50" height="5" fill="#E91E63"/>
//       <rect x="30" y="25" width="40" height="15" fill="#FF4081"/>
//       <rect x="45" y="25" width="10" height="15" fill="#E91E63"/>
//       <path d="M30 25C30 25 35 10 50 20C40 25 30 25 30 25Z" fill="#4CAF50"/>
//       <path d="M70 25C70 25 65 10 50 20C60 25 70 25 70 25Z" fill="#4CAF50"/>
//     </svg>
//   );


//   // Não renderizar nada se não houver aniversariantes
//   if (birthdayUsers.length === 0) {
//     return null;
//   }


//   return (
//     <div className="relative">
//       <ConfettiContainer />
      
//       {birthdayUsers.map((user) => (
//         <div 
//           key={user.id}
//           className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-1 rounded-2xl shadow-lg max-w-md w-full mx-auto transform transition-all duration-500 hover:scale-105 hover:shadow-xl"
//         >
//           <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNmZmZmZmYyMCIvPjxjaXJjbGUgY3g9IjEwIiBjeT0iMTAiIHI9IjEiIGZpbGw9IiNmZmZmZmYyMCIvPjxjaXJjbGUgY3g9IjE4IiBjeT0iMTgiIHI9IjEiIGZpbGw9IiNmZmZmZmYyMCIvPjwvc3ZnPg==')] opacity-20"></div>
          
//           <FloatingParticles />
//           <CakeSVG />
//           <GiftSVG />
          
//           <div className="relative bg-gray-800 bg-opacity-70 backdrop-blur-sm p-6 rounded-xl border border-purple-500/30 flex flex-col items-center z-10">
//             {/* Cabeçalho com ícones animados */}
//             <div className="flex items-center justify-center mb-4 space-x-3">
//               <Star className="text-yellow-300 animate-pulse" size={20} />
//               <Cake className="text-pink-400" size={28} />
//               <Star className="text-yellow-300 animate-pulse" size={20} />
//             </div>
            
//             {/* Título */}
//             <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mb-4 text-center">
//               Feliz Aniversário!
//             </h2>
            
//             {/* Nome do aniversariante com efeito especial */}
//             <div className="relative py-3 px-6 rounded-lg bg-gradient-to-r from-purple-800/40 to-indigo-800/40 mb-4 w-full text-center">
//               <div className="absolute inset-0 bg-gray-900/30 blur-sm rounded-lg"></div>
//               <h3 className="relative text-2xl font-bold text-white text-center">
//                 {user.name}
//               </h3>
//             </div>
            
//             {/* Texto de parabéns */}
//             <p className="text-gray-300 text-center mb-6">
//               Hoje é o seu dia especial! Toda equipe deseja muitas felicidades!
//             </p>
            
//             {/* Ícones de celebração no rodapé */}
//             <div className="flex justify-around w-full mt-2">
//               <Gift className="text-indigo-400 animate-bounce-slow" size={24} />
//               <Cake className="text-pink-400 animate-pulse-slow" size={24} />
//               <Gift className="text-indigo-400 animate-bounce-slow" size={24} />
//             </div>
//           </div>
//         </div>
//       ))}


//       {/* Estilos CSS personalizados para animações */}
//       <style>{`
//         @keyframes float {
//           0% { transform: translateY(0px) rotate(0deg); opacity: 0; }
//           50% { opacity: 0.8; }
//           100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
//         }
        
//         @keyframes confetti {
//           0% { transform: translateY(0) rotate(0deg); opacity: 1; }
//           100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
//         }
        
//         .animate-float {
//           animation: float 6s infinite linear;
//         }
        
//         .animate-confetti {
//           animation: confetti 6s infinite linear;
//         }
        
//         .animate-pulse-slow {
//           animation: pulse 3s infinite;
//         }
        
//         .animate-bounce-slow {
//           animation: bounce 2s infinite;
//         }
//       `}</style>
//     </div>
//   );
// };


// export default BirthdayCard;
