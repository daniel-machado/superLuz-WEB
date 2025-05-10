import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
//import UserAddressCard from "../components/UserProfile/UserAddressCard";
import PageMeta from "../components/common/PageMeta";
import { UserSpecialtyCard } from "../components/UserProfile/UserSpecialtyCard";
import { UserClassCard } from "../components/UserProfile/UserClassCard";

export default function UserProfiles() {
  return (
    <>
      <PageMeta
        title="Página de perfil do usuário"
        description="Esta é a página de perfil do usuário do sistema de gerenciamento do clube de desbravadores Luzeiros do Norte"
      />
      <PageBreadcrumb pageTitle="Perfil" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Perfil
        </h3>
        <div className="space-y-6">
          <UserMetaCard />
          <UserInfoCard />
          <UserSpecialtyCard/>
          <UserClassCard/>
          {/* <UserAddressCard /> */}
        </div>
      </div>
    </>
  );
}
