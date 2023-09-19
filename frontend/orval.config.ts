require("dotenv").config();

module.exports = {
  backoffice: {
    input: {
      target: `${process.env.NEXT_PUBLIC_API_URL}/api/schema/`,
    },
    output: {
      mode: "tags-split",
      target: "src/output.ts",
      schemas: "src/model",
      client: "react-query",
      mock: true,

      override: {
        mutator: {
          path: "src/api/custom-instance.ts",
          name: "axiosInstance",
        },
        query: {
          useQuery: true,
          useInfinite: true,
          options: {
            staleTime: Infinity,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
        mutation: {
          options: {
            // @ts-ignore
            retry: (failureCount, error) => {
              if (failureCount <= 3 && error?.response?.status === 401) {
                return true;
              }
              return false;
            },
          },
        },
      },
    },
  },
};
