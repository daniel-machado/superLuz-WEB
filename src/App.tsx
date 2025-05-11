import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";

import ProtectedRoute from "./components/common/ProtectedRoute"; 
import InitialPage from "./pages/InitialPage";
import { useAuth } from "./context/AuthContext";
import LoadingScreen from "./components/LoadingScreen";
import Units from "./pages/Units/Units";
import Specialty from "./pages/Specialty/Specialty";
import Class from "./pages/Class/Class";
import Users from "./pages/Users/Users";
import UsersPending from "./pages/Users/UsersPending";
import ClassUsers from "./pages/Class/ClassUsers";
import SpecialtyUsers from "./pages/Specialty/SpecialtyUsers";
import Quiz from "./pages/Quiz/Quiz";
import QuizQuestions from "./pages/Quiz/QuizQuestions";
import ManageQuestions from "./pages/QuestionsEvaluationsUnit/ManageQuestions";
import EvaluationUnits from '../src/pages/EvaluationsUnit/evaluationUnits';
import RankingUnits from "./pages/Rankings/RankingUnits";
import RankingIndividual from "./pages/Rankings/RankingIndividual/RankingIndividual";
import ManageAnswerUnit from "./pages/AnswersEvaluationUnit/ManageAnswerUnit";
import UnitReportAnswer from "./pages/AnswersEvaluationUnit/reportAnswerUnit";
import IndividualEvaluations from "./pages/EvaluationsIndividual/IndividualEvaluation";
import ManageQuestionsIndividualEvaluation from "./pages/QuestionsIndividualEvaluation/ManageQuestionsIndividualEvaluation";
import ManageAnswerIndividual from "./pages/AnswerIndividualEvaluation/ManageAnswerIndividual";
import ReportAnswerIndividual from './pages/AnswerIndividualEvaluation/ReportAnswerIndividual'
import QuizScreen from "./pages/QuizAttempt/QuizScreen";
//import { hasRoutePermission } from "./services/permissions/permissionsService";
import AccessDenied from "./pages/AccessDenied/accessDenied";
import GalleryPhotos from "./pages/galeryPhotos";

export default function App() {
  const { loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />; // 🔹 Exibe a animação enquanto verifica a autenticação
  }
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
        
          {/* ROTAS PRIVADAS - SOMENTE SE TIVER AUTENTICADO */}
          {/* Dashboard Layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              
              <Route index path="/home" element={<Home />} />

              {/* 
              Exemplo de como usar a função hasRoutePermission para verificar permissões de rota  
              <Route 
                path="/units" 
                element={
                  hasRoutePermission("/units", userRole)
                  ?
                    <Units />
                  :
                  <Navigate to="/" replace />
                } 
              /> */}

              <Route path="/units" element={<Units/>} />

              {/* Avaliações de Unidades */}
              <Route path="/evaluation-units" element={<EvaluationUnits />} />
              <Route path="/questions-evaluation-unit" element={<ManageQuestions />} />
              <Route path="/answer-evaluation-unit" element={<ManageAnswerUnit />} />
              
              <Route path="/unit-reports/:unitId" element={<UnitReportAnswer />} />

              {/* Avaliações de Individuais */}
              <Route path="/evaluation-individual" element={<IndividualEvaluations />} />
              <Route path="/questions-evaluation-individual" element={<ManageQuestionsIndividualEvaluation />} />

              <Route path="/answer-evaluation-individual" element={<ManageAnswerIndividual />} />
              {/* <Route path="/dbv-evaluations/:unitId" element={<ManageAnswerIndividual />} /> */}
              <Route path="/individual-reports/:unitId/:dbvId" element={<ReportAnswerIndividual />} />

              {/* Rankings */}
              <Route path="/ranking-units" element={<RankingUnits />} />
              <Route path="/ranking-individual" element={<RankingIndividual />} />


              <Route path="/quiz" element={<Quiz />} />
              <Route path="/quiz/:id/questions" element={<QuizQuestions />} />

              <Route path="/specialty" element={<Specialty />} />
              <Route path="/specialty-users" element={<SpecialtyUsers />} />

              <Route path="/quiz-attempt/:quizId" element={<QuizScreen />} />

              <Route path="/class" element={<Class />} />
              <Route path="/class-users" element={<ClassUsers />} />
              
              <Route path="/users" element={<Users />} />
              <Route path="/users-pending" element={<UsersPending />} />

              {/* Others Page */}
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/blank" element={<Blank />} />

              {/* Forms */}
              <Route path="/form-elements" element={<FormElements />} />

              {/* Tables */}
              <Route path="/basic-tables" element={<BasicTables />} />

              {/* Ui Elements */}
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/avatars" element={<Avatars />} />
              <Route path="/badge" element={<Badges />} />
              <Route path="/buttons" element={<Buttons />} />
              <Route path="/images" element={<Images />} />
              <Route path="/videos" element={<Videos />} />

              {/* Charts */}
              <Route path="/line-chart" element={<LineChart />} />
              <Route path="/bar-chart" element={<BarChart />} />
            </Route>

            {/* ROTA PRIVADA - SOMENTE SE TIVER AUTENTICADO E ACESSAR UMA ROTA ERRADA*/}
            <Route path="/access-denied" element={<AccessDenied />} />
          
          </Route>

          {/* ROTAS PÚBLICAS - QUALQUER UM PODE ACESSAR */}
          {/* Auth Layout */}
          <Route index path="/" element={<InitialPage />} />
          <Route path="/gallery" element={<GalleryPhotos />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />

          
          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </Router>
    </>
  );
}