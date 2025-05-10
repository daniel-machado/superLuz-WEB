import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Calendar, Search, Star, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { unitsService } from '../../services/unitsService';
import { individualEvaluationService } from '../../services/individualEvaluationService';
//import { useAuth } from '../../context/AuthContext';


const IndividualEvaluation = () => {
  const { unitId } = useParams();
  const navigate = useNavigate();
  //const { user } = useAuth();
  
  interface Unit {
    name: string;
    photo?: string;
    dbvs: { dbv: { id: string; name: string; photoUrl?: string } }[];
  }

  interface DBV {
    id: string;
    name: string;
    photoUrl?: string | null;
    evaluationStatus: string; // 'pending', 'active', 'completed'
  }

  const [unit, setUnit] = useState<Unit | null>(null);
  const [dbvs, setDbvs] = useState([]);
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDbvs, setFilteredDbvs] = useState<DBV[]>([]);

console.log(evaluations, "evaluations")
  useEffect(() => {
    fetchData();
  }, [unitId]);


  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredDbvs(dbvs);
    } else {
      const filtered = dbvs.filter((dbv: { name: string }) =>
        dbv.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDbvs(filtered);
    }
  }, [searchTerm, dbvs]);


  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Get unit details
      if (!unitId) {
        throw new Error('Unit ID is undefined');
      }
      const unitResponse = await unitsService.getUnitById(unitId);
      if (!unitResponse.success || !unitResponse.unit || !unitResponse.unit.unit) {
        toast.error('Falha ao carregar dados da unidade', {
          position: 'bottom-right',
          className: 'dark:bg-gray-800 dark:text-white',
        });
        setIsLoading(false);
        return;
      }

      const unitData = unitResponse.unit.unit;
      setUnit(unitData);

      // Format DBV users with evaluation status
      const dbvArray = unitData.dbvs.map((dbvItem: { dbv: { id: string; name: string; photoUrl?: string } }) => ({
        id: dbvItem.dbv.id,
        name: dbvItem.dbv.name,
        photoUrl: dbvItem.dbv.photoUrl || null,
        evaluationStatus: 'pending' // Default status, will be updated after fetching evaluations
      }));
      setDbvs(dbvArray);
      setFilteredDbvs(dbvArray);


      // Get evaluations for this unit
      const evalResponse = await individualEvaluationService.ListAllEvaluation();
      if (evalResponse && Array.isArray(evalResponse)) {
        setEvaluations(evalResponse);
        
        // Update DBVs with evaluation status
        const updatedDbvs = dbvArray.map((dbv: { id: string; name: string; photoUrl: string | null; evaluationStatus: string }) => {
          const dbvEvals = evalResponse.filter(evaluation => evaluation.dbvId === dbv.id);
          const hasActiveEval = dbvEvals.some(evaluation => evaluation.status === 'open');
          const hasCompletedEval = dbvEvals.some(evaluation => evaluation.status === 'completed');
          
          let status = 'pending';
          if (hasActiveEval) status = 'active';
          if (hasCompletedEval) status = 'completed';
          
          return { ...dbv, evaluationStatus: status };
        });
        
        setDbvs(updatedDbvs);
        setFilteredDbvs(updatedDbvs);
      }


      toast.success(`${dbvArray.length} desbravadores carregados`, {
        position: 'bottom-right',
        className: 'dark:bg-gray-800 dark:text-white',
        duration: 3000,
      });
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error('Erro ao carregar os dados dos desbravadores', {
        position: 'bottom-right',
        className: 'dark:bg-gray-800 dark:text-white',
      });
    } finally {
      setIsLoading(false);
    }
  };


  const handleDbvClick = (dbvId: string) => {
    navigate(`/dbv-report/${dbvId}`);
    toast.success('Carregando avaliações do desbravador', {
      position: 'bottom-right',
      className: 'dark:bg-gray-800 dark:text-white',
    });
  };


  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'pending':
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };


  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Avaliação em andamento';
      case 'completed':
        return 'Avaliação completa';
      case 'pending':
      default:
        return 'Aguardando avaliação';
    }
  };


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };


  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-t-4 border-purple-500 border-solid rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-medium">Carregando desbravadores...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/dbv-evaluations')}
            className="flex items-center text-gray-400 hover:text-purple-400 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Voltar para unidades
          </button>


          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="flex items-center">
              <div className="h-14 w-14 rounded-full bg-purple-900 flex items-center justify-center mr-4">
                {unit?.photo ? (
                  <img
                    src={unit.photo}
                    alt={unit.name}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                ) : (
                  <Star className="h-6 w-6 text-purple-300" />
                )}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  {unit?.name || 'Unidade'}
                </h1>
                <p className="text-gray-400 mt-1">
                  {filteredDbvs.length} {filteredDbvs.length === 1 ? 'desbravador' : 'desbravadores'}
                </p>
              </div>
            </div>


            <div className="relative mt-4 md:mt-0 w-full md:w-64">
              <input
                type="text"
                placeholder="Buscar desbravadores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </motion.div>


        {filteredDbvs.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredDbvs.map((dbv) => (
              <motion.div
                key={dbv.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, boxShadow: '0 8px 20px -4px rgba(0, 0, 0, 0.3)' }}
                className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 transition-all duration-300 hover:border-purple-500/50"
              >
                <div className="p-5 flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="h-24 w-24 rounded-full bg-gray-700 flex items-center justify-center">
                      {dbv.photoUrl ? (
                        <img
                          src={dbv.photoUrl}
                          alt={dbv.name}
                          className="h-24 w-24 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-12 w-12 text-gray-500" />
                      )}
                    </div>
                    <div className="absolute bottom-0 right-0 h-8 w-8 bg-gray-900 rounded-full flex items-center justify-center border-2 border-gray-800">
                      {getStatusIcon(dbv.evaluationStatus)}
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-semibold text-white text-center mb-1">{dbv.name}</h2>
                  <div className="flex items-center text-sm text-gray-400 mb-4">
                    {getStatusText(dbv.evaluationStatus)}
                  </div>


                  <button
                    onClick={() => handleDbvClick(dbv.id)}
                    className="mt-2 flex items-center justify-center text-sm bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-all w-full"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Ver Avaliações
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 bg-gray-800 rounded-xl border border-gray-700 p-6">
            <User className="h-16 w-16 text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg">Nenhum desbravador encontrado</p>
            <p className="text-gray-500 mt-2">Tente ajustar o termo de busca ou atualize a página</p>
          </div>
        )}
      </div>
    </div>
  );
};


export default IndividualEvaluation;
