// Interfaces
interface IndividualEvaluation {
  id: string;
  userId: string;
  counselorId: string | null;
  evaluationDate: string | null;
  totalScore: number | string;
  status: string;
  week: number;
  createdAt: string;
  updatedAt: string;
  usersEvaluation: {
    id: string;
    name: string;
    photoUrl: string | null;
  };
}


interface EvaluationResponse {
  success: boolean;
  evaluation: IndividualEvaluation[];
}


/**
 * Normaliza os dados de avaliações para um formato único de array de IndividualEvaluation
 * Compatível com os dois formatos retornados pela API
 */
export const normalizeEvaluationData = (data: any): IndividualEvaluation[] => {
  // Caso 1: Se já for um array simples de IndividualEvaluation (retorno para admin/director)
  if (Array.isArray(data) && data.length > 0 && 'id' in (data[0] || {})) {
    return data as IndividualEvaluation[];
  }
  
  // Caso 2: Se for o resultado da busca por DBVs (array de responses aninhadas)
  if (Array.isArray(data) && data.length > 0 && 'success' in (data[0] || {})) {
    // Extrair as avaliações de cada response e concatenar em um único array
    return data.flatMap((response: EvaluationResponse) => {
      if (response.success && Array.isArray(response.evaluation)) {
        return response.evaluation;
      }
      return [];
    });
  }
  
  // Caso 3: Se data for um objeto com um campo 'evaluations' (possível formato adicional)
  if (data && typeof data === 'object' && 'evaluations' in data) {
    return Array.isArray(data.evaluations) ? data.evaluations : [];
  }
  
  // Se não for nenhum dos formatos esperados, retorna array vazio
  console.error('Formato de dados de avaliação desconhecido:', data);
  return [];
};
