import { getApiUsersMeRetrieveQueryKey } from "@/api/api";
import nookies from "nookies";
import { routes } from "./routes";

export const onLogin = ({
  newToken,
  router,
  queryClient,
}: {
  newToken: string;
  router: any;
  queryClient: any;
  loginComponent: any;
}) => {
  const login = (newToken: string) => {
    nookies.set(null, "accessToken", newToken, {
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    queryClient.invalidateQueries(getApiUsersMeRetrieveQueryKey());
  };
  if (newToken) {
    login(newToken);
  }
  router.push(`${routes.dashboard}`);
};
