
// Tipos de perfis de usuário
export type UserRole = 'pending' | 'admin' | 'dbv' | 'director' | 'lead' | 'counselor' | 'secretary';


// Interface para configurar permissões de rota
interface RoutePermission {
  path: string;
  allowedRoles: UserRole[];
}


// Interface para configurar permissões de menu
interface MenuPermission {
  key: string; // Identificador único do menu (correspondente ao nome em navItems)
  allowedRoles: UserRole[];
}


// Lista de rotas e suas permissões
export const routePermissions: RoutePermission[] = [
  // Dashboard - acessível para todos
  { path: '/home', allowedRoles: ['pending', 'admin', 'dbv', 'director', 'lead', 'counselor', 'secretary'] },
  
  // Gerenciamento de Unidades - somente admin e coordinator
  { path: '/units', allowedRoles: ['admin', 'dbv', 'director', 'lead', 'counselor', 'secretary'] },
  
  // Avaliações de Unidades
  { path: '/evaluation-units', allowedRoles: ['admin', 'dbv', 'director', 'lead', 'counselor', 'secretary'] },
  { path: '/questions-evaluation-unit', allowedRoles: ['admin', 'dbv', 'director', 'lead', 'counselor', 'secretary'] },
  { path: '/answer-evaluation-unit', allowedRoles: ['admin', 'dbv', 'director', 'lead', 'counselor', 'secretary'] },
  
  { path: '/unit-reports', allowedRoles: ['admin', 'director'] },
  
  // Avaliações Individuais
  { path: '/evaluation-individual', allowedRoles: ['admin', 'dbv', 'director', 'lead', 'counselor', 'secretary'] },
  { path: '/questions-evaluation-individual', allowedRoles: ['admin', 'dbv', 'director', 'lead', 'counselor', 'secretary'] },
  { path: '/answer-evaluation-individual', allowedRoles: ['admin', 'dbv', 'director', 'lead', 'counselor', 'secretary'] },
  
  { path: '/individual-reports', allowedRoles: ['admin', 'dbv', 'director', 'lead', 'counselor', 'secretary'] },
  
  // Rankings
  { path: '/ranking-individual', allowedRoles: ['admin', 'dbv', 'director', 'lead', 'counselor', 'secretary'] },
  { path: '/ranking-units', allowedRoles: ['admin', 'dbv', 'director', 'lead', 'counselor', 'secretary'] },
  
  // Especialidades
  { path: '/specialty', allowedRoles: ['admin', 'dbv', 'director', 'lead', 'counselor', 'secretary'] },
  { path: '/specialty-users', allowedRoles: ['admin', 'dbv', 'director', 'lead', 'counselor', 'secretary'] },
  
  // Classes
  { path: '/class', allowedRoles: ['admin', 'dbv', 'director', 'lead', 'counselor', 'secretary'] },
  { path: '/class-users', allowedRoles: ['admin', 'dbv', 'director', 'lead', 'counselor', 'secretary'] },
  
  // Quiz
  { path: '/quiz', allowedRoles: ['admin', 'dbv', 'director', 'lead', 'counselor', 'secretary'] },
  { path: '/quiz-attempt::quizId', allowedRoles: ['admin', 'dbv', 'director', 'lead', 'counselor', 'secretary'] },
  
  // Usuários
  { path: '/users', allowedRoles: ['admin', 'dbv', 'director', 'lead', 'counselor', 'secretary'] },
  { path: '/users-pending', allowedRoles: ['admin','director'] },
  
  // Páginas gerais
  // { path: '/calendar', allowedRoles: ['admin'] },
  { path: '/verification-code', allowedRoles: ['pending', 'admin', 'dbv', 'director', 'lead', 'counselor', 'secretary'] },
  { path: '/profile', allowedRoles: ['admin', 'dbv', 'director', 'lead', 'counselor', 'secretary'] },

  { path: '/profile-user', allowedRoles: ['admin', 'dbv', 'director', 'lead', 'counselor', 'secretary'] },
  
];


// Lista de menus e suas permissões
export const menuPermissions: MenuPermission[] = [
  { key: 'Início', allowedRoles: ['pending', 'admin', 'dbv', 'director', 'lead', 'counselor', 'secretary'] },
  { key: 'Unidades', allowedRoles: ['admin', 'dbv', 'director', 'lead', 'counselor', 'secretary'] },
  { key: 'Avaliação De Unidades', allowedRoles: ['admin', 'dbv', 'director', 'lead', 'counselor', 'secretary'] },
  { key: 'Avaliação De Individual', allowedRoles: ['admin', 'dbv', 'director', 'lead', 'counselor', 'secretary'] },
  { key: 'Rankings', allowedRoles: ['admin', 'dbv', 'director', 'lead', 'counselor', 'secretary'] },
  { key: 'Especialidades', allowedRoles: ['admin', 'dbv', 'director', 'lead', 'counselor', 'secretary'] },
  { key: 'Classes', allowedRoles: ['admin', 'dbv', 'director', 'lead', 'counselor', 'secretary'] },
  { key: 'Quiz', allowedRoles: ['admin', 'director'] },
  { key: 'Usuários', allowedRoles: ['admin', 'dbv', 'director', 'lead', 'counselor', 'secretary'] },
  { key: 'Usuários Pendentes', allowedRoles: ['admin', 'director'] },
  { key: 'User Profile', allowedRoles: ['admin', 'dbv', 'director', 'lead', 'counselor', 'secretary'] },
  // { key: 'Calendar', allowedRoles: ['admin'] },
  // { key: 'Forms', allowedRoles: ['admin'] },
  // { key: 'Tables', allowedRoles: ['admin'] },
  // { key: 'Pages', allowedRoles: ['admin'] },
  // { key: 'Charts', allowedRoles: ['admin'] },
  // { key: 'UI Elements', allowedRoles: ['admin'] },
  // { key: 'Authentication', allowedRoles: ['admin'] },
];


// Função para verificar se um usuário tem permissão para acessar uma rota
export const hasRoutePermission = (path: string, role?: UserRole): boolean => {
  if (!role) return false;
  
  // Se o caminho corresponde exatamente a uma rota definida
  const exactMatch = routePermissions.find(route => route.path === path);
  if (exactMatch) {
    return exactMatch.allowedRoles.includes(role);
  }
  
  // Para caminhos dinâmicos (com parâmetros como :id)
  const dynamicMatch = routePermissions.find(route => {
    // Remove os parâmetros e verifica se o caminho base corresponde
    const basePath = route.path.split('/').filter(segment => !segment.startsWith(':')).join('/');
    return path.startsWith(basePath) && basePath !== '';
  });
  
  if (dynamicMatch) {
    return dynamicMatch.allowedRoles.includes(role);
  }
  
  // Se não encontrou nenhuma correspondência, nega o acesso por padrão
  return false;
};


// Função para verificar se um usuário tem permissão para ver um item de menu
export const hasMenuPermission = (menuKey: string, role?: UserRole): boolean => {
  if (!role) return false;
  
  const menu = menuPermissions.find(item => item.key === menuKey);
  return menu ? menu.allowedRoles.includes(role) : false;
};



// // Função melhorada para verificar se um usuário tem permissão para acessar uma rota
// export const hasRoutePermission = (path: string, role?: UserRole): boolean => {
//   if (!role) return false;


//   // Extrair o caminho base (para rotas dinâmicas como /unit-reports/:unitId)
//   // Exemplo: /unit-reports/123 -> /unit-reports
//   const basePath = path.split('/').slice(0, 3).join('/');
  
//   // Verificar correspondência exata primeiro
//   const exactMatch = routePermissions.find(route => route.path === path);
//   if (exactMatch) {
//     return exactMatch.allowedRoles.includes(role);
//   }
  
//   // Para rotas dinâmicas com parâmetros como :id
//   const dynamicMatch = routePermissions.find(route => {
//     // Se a rota definida termina com um parâmetro (ex: /unit-reports/:unitId)
//     if (route.path.includes(':')) {
//       const routeBasePath = route.path.split('/:')[0];
//       return path.startsWith(routeBasePath);
//     }
//     // Se a rota atual (path) começa com a rota definida (útil para rotas aninhadas)
//     return path.startsWith(route.path) && route.path !== '/';
//   });
  
//   if (dynamicMatch) {
//     return dynamicMatch.allowedRoles.includes(role);
//   }
  
//   // Se não encontrou nenhuma correspondência, nega o acesso por padrão
//   return false;
// };



