//import UserAddressCard from "../components/UserProfile/UserAddressCard";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from "lucide-react";
import { UserSpecialtyCardUser } from "./components/UserSpecialtyCardUser";
import { UserClassCardUser } from "./components/UserClassCardUser";
import UserMetaCardUser from "./components/UserMetaCardUser";



export default function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();

  return (
    <>
      <PageMeta
        title="Perfil | Luzeiros do Norte"
        description="Tela de perfil dos usuários"
      />
      <button
        onClick={() => navigate('/users')}
        className="flex items-center text-gray-400 hover:text-green-400 mb-4 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        Voltar para usuários
      </button>
      <PageBreadcrumb pageTitle="Perfil" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Perfil
        </h3>
        <div className="space-y-6">
          <UserMetaCardUser
            userId={userId}
          />
          <UserSpecialtyCardUser
            userId={userId}
          />
          <UserClassCardUser
            userId={userId}
          />
        </div>
      </div>
    </>
  );
}
