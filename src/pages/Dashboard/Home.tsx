import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";
import { useAuth } from "../../context/AuthContext";

export default function Home() {
  const { user } = useAuth()

  if (!user || !user.user) {
    return <p className="text-lg font-semibold text-gray-800 dark:text-white/90">
        Carregando...
      </p>; 
  }

  const userName = user?.user.user.name || '';
  //const firstName = userName.split(' ')[0];  // Pegando o primeiro nome
  const firstTwoNames = userName.split(' ').slice(0, 2).join(' '); // Pega os dois primeiros nomes

  return (
    <>
      <PageMeta
        title="Página Inicial - SuperLuzeiros"
        description="Página inicial do sistema do Luzeiros"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
        
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Olá, {firstTwoNames}
        </h3>
          <EcommerceMetrics />

          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div>
      </div>
    </>
  );
}
