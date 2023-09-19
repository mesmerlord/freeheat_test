import Background from "@/components/Background";
import Seo from "@/components/common/Seo";
import { useRouter } from "next/router";
import nookies from "nookies";

const DashboardPage = () => {
  const accessToken = nookies.get(null)?.accessToken;

  const router = useRouter();

  return (
    <Background>
      <Seo title={`Dashboard - Musky Cars`} description="Dashboard" />
    </Background>
  );
};

export default DashboardPage;
