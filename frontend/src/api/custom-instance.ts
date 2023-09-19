import Axios, { AxiosRequestConfig } from "axios";
import { parseCookies } from "nookies";

export const AXIOS_INSTANCE = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 50000, // Time in milliseconds
});

export const axiosInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const source = Axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);
  // @ts-ignore
  promise.cancel = () => {
    source.cancel("Query was cancelled");
  };

  return promise;
};

AXIOS_INSTANCE.interceptors.request.use((config) => {
  if (
    typeof window !== "undefined" &&
    (!config?.headers?.Authorization ||
      !config?.headers?.Authorization.includes("Token"))
  ) {
    const accessToken = parseCookies().accessToken;
    if (accessToken) {
      //@ts-ignore
      config.headers.Authorization = `Token ${accessToken}`;
    }
  }
  return config;
});
