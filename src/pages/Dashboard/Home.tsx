// import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
// import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
// import StatisticsChart from "../../components/ecommerce/StatisticsChart";
// import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
// import RecentOrders from "../../components/ecommerce/RecentOrders";
// import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";
import { useAuth } from "../../context/AuthContext";
import Card from "../../components/ui/Card/Card";
import Button from "../../components/ui/button/Button";
import { authService } from "../../services/authService";
import { useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import BibleVerseOfTheDay from "../../components/BibleVerseOfTheDay/BibleVerdeDay";

export default function Home() {
  const [_loading, setLoading] = useState(false);
  const { user } = useAuth()

  const navigate = useNavigate()

  if (!user || !user.user) {
    return <p className="text-lg font-semibold text-gray-800 dark:text-white/90">
        Carregando...
      </p>; 
  }

  const userName = user?.user.user.name || '';
  //const firstName = userName.split(' ')[0];  // Pegando o primeiro nome
  const firstTwoNames = userName.split(' ').slice(0, 2).join(' '); // Pega os dois primeiros nomes

  const handleLink = async () => {
    setLoading(true);
      try {
        await authService.sendVerificationCode(user?.user.user.email)
        navigate("/verification-code")
        toast.success("Código Enviado com sucesso para o email", {position: 'bottom-right'});
      } catch (error) {
        console.error("Erro ao enviar codigo", error);
        toast.error("Error ao enviar código", {position: 'bottom-right'});
      } finally {
        setLoading(false);
      }
  };

  return (
    <>
      <PageMeta
        title="Página Inicial - SuperLuzeiros"
        description="Página inicial do sistema do Luzeiros"
      />
      <div className="">
         <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Olá, {firstTwoNames}
        </h3>
        <div className="mt-10">
        { user.user.user.isVerified !== true &&
          <>
          <Card variant="light" size="md" color="warning">
            <div>
              <p>
                <strong>Olá {firstTwoNames}</strong>,<br/>
                Notamos que você ainda não verificou sua conta. <br/>
                A verificação é importante para garantir a segurança e o acesso completo aos nossos serviços.
              </p>
              <div className="text-right mt-5">
                <Button size="sm" onClick={handleLink} className="bg-orange-500 hover:bg-orange-400">
                  Enviar Código
                </Button>
              </div>
            </div>
          </Card>
          </>
        }
        {user.user.user.role !== "pending" &&
          <div className="mt-10">
            <BibleVerseOfTheDay />
          </div>
        }
        
        

          {/* <EcommerceMetrics /> */}

          {/* <MonthlySalesChart /> */}
        </div>

        {/* <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div> */}

        {/* <div className="col-span-12">
          <StatisticsChart />
        </div> */}
{/* 
        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div> */}

        {/* <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div> */}
      </div>
    </>
  );
}
