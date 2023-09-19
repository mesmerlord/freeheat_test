import { useStore } from "@/store";
import { MantineProvider, Paper } from "@mantine/core";

import { parseCookies } from "nookies";
import { useEffect, useState } from "react";

const Background = ({
  themeDefault,
  ...props
}: {
  themeDefault?: any;
  children: any;
  [key: string]: any;
}) => {
  const [defaultDarkMode, setDefaultDarkMode] = useState("light");

  return (
    <MantineProvider
      theme={{
        colorScheme: defaultDarkMode ?? "light",

        components: {
          Image: {
            defaultProps: {
              radius: "md",
            },
          },
          Text: {
            styles: (theme) => ({
              default: {
                fontSize: "18px",
                [theme.fn.smallerThan("sm")]: {
                  fontSize: "14px",
                },
              },
            }),
          },
          Container: {
            styles: (theme) => ({
              root: {
                [theme.fn.smallerThan("sm")]: {
                  // margin: "5px",
                  maxWidth: "98%",
                },
              },
            }),
          },

          Badge: {
            styles: (theme) => ({
              root: {
                color: "white",
                backgroundColor: theme.colors.blue[9],
              },
            }),
          },
        },
      }}
      // withGlobalStyles
      withNormalizeCSS
    >
      <Paper
        radius={0}
        style={{ minHeight: "90vh" }}
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === "light"
              ? theme.colors.gray[1]
              : theme.colors.dark[4],
        })}
      >
        {props.children}
      </Paper>
    </MantineProvider>
  );
};

export default Background;
