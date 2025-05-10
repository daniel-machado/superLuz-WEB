import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

export const getEvaluationStatusIcon = (status: any) => {
  switch (status) {
    case 'open':
      return <Clock className="w-5 h-5 text-yellow-500" />;
    case 'closed':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    default:
      return <AlertCircle className="w-5 h-5 text-gray-400" />;
  }
};

export const getEvaluationStatusClass = (status: any) => {
  switch (status) {
    case 'open':
      return 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700';
    case 'closed':
      return 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700';
    default:
      return 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-700';
  }
};
