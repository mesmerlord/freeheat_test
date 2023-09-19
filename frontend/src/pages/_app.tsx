import Background from "@/components/Background";
import Loading from "@/components/Loading";
import { Notifications } from "@mantine/notifications";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { NextComponentType } from "next";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const App = (props: AppProps) => {
  const {
    Component,
    pageProps,
  }: {
    Component: NextComponentType;
    pageProps: any;
  } = props;

  //@ts-ignore

  const [queryClient] = React.useState(() => new QueryClient());
  const router = useRouter();

  const [state, setState] = useState({
    isRouteChanging: false,
    loadingKey: 0,
  });

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setState((prevState) => ({
        ...prevState,
        isRouteChanging: true,
        loadingKey: prevState.loadingKey === 0 ? 1 : 0,
      }));
    };

    const handleRouteChangeEnd = () => {
      setState((prevState) => ({
        ...prevState,
        isRouteChanging: false,
      }));
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeEnd);
    router.events.on("routeChangeError", handleRouteChangeEnd);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeEnd);
      router.events.off("routeChangeError", handleRouteChangeEnd);
    };
  }, [router.events, router.pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <Background>
          <Loading
            isRouteChanging={state.isRouteChanging}
            key={state.loadingKey}
          />
          <Component {...pageProps} />
        </Background>

        <Notifications />
      </Hydrate>
    </QueryClientProvider>
  );
};
export default App;
