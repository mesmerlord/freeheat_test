import {
  getApiUsersMeRetrieveQueryKey,
  useApiUsersMeRetrieve,
} from "@/api/api";
import { routes } from "@/utils/routes";
import {
  Avatar,
  Burger,
  Button,
  Col,
  Drawer,
  Grid,
  Group,
  Header,
  MediaQuery,
  Menu,
  Stack,
  Title,
  createStyles,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import nookies from "nookies";

const HEADER_HEIGHT = rem(60);

const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
    zIndex: 1,
  },

  dropdown: {
    position: "absolute",
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: "hidden",

    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },

  links: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color: theme.colorScheme === "dark" ? "white" : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[7],
    },

    [theme.fn.smallerThan("sm")]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.colors.orange[4],
      color: "black",
    },
  },
}));

const CustomNavbar = ({ children }: { children: React.ReactNode }) => {
  const theme = useMantineTheme();
  const { push, query } = useRouter();
  const [opened, { toggle, close }] = useDisclosure(false);

  const openBurger = () => {
    toggle();
  };

  const queryClient = useQueryClient();

  const { data: meData } = useApiUsersMeRetrieve({
    query: {
      retry: 1,
      onError: (err) => {
        nookies.destroy(null, "accessToken");
        queryClient.setQueryData(getApiUsersMeRetrieveQueryKey(), null);
      },
    },
  });

  const signOut = () => {
    nookies.destroy(null, "accessToken");
    push("/");
    queryClient.invalidateQueries(getApiUsersMeRetrieveQueryKey());
  };

  return (
    <Stack spacing={0} p={0} mb={40}>
      <Header
        height={{ base: 70, md: 90, lg: 70 }}
        p="sm"
        sx={{
          position: "sticky",
          background: "#382739",
          border: "none",
        }}
      >
        <Drawer
          opened={opened}
          onClose={close}
          title="Authentication"
          position="right"
          size="70%"
          sx={{
            section: {
              background: "#4a3f4b",
            },
          }}
        >
          <Stack spacing="md" mt={50}>
            {meData?.username && (
              <Group noWrap position="center" spacing={20} mb={20}>
                <Menu>
                  <Menu.Target>
                    <Avatar radius={"xl"} src={meData?.username} />
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      onClick={() => {
                        push(routes.dashboard);
                      }}
                    >
                      Dashboard
                    </Menu.Item>
                    <Menu.Label>Account</Menu.Label>

                    <Menu.Item onClick={signOut}>Logout</Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            )}
          </Stack>
        </Drawer>

        <Grid align="center" p={5}>
          <Col span={6}>
            <Link
              href={routes.home}
              style={{
                textDecoration: "none",
              }}
            >
              <Group
                noWrap
                spacing={5}
                sx={{
                  width: "100%",
                }}
              >
                <Title
                  order={3}
                  sx={(theme) => ({
                    [theme.fn.smallerThan("md")]: { fontSize: "22px" },
                    color: "white",
                  })}
                >
                  🚗 Musky Cars
                </Title>
              </Group>
            </Link>
          </Col>
          <Col span="auto" offset={0}>
            <Group noWrap position="right" spacing={20}>
              {!meData?.username && (
                <Group
                  noWrap
                  position="right"
                  spacing={20}
                  sx={(theme) => ({
                    [theme.fn.smallerThan("md")]: { display: "none" },
                  })}
                >
                  {" "}
                  <Button component={Link} href={routes.login} color="gray">
                    <Title
                      order={4}
                      sx={(theme) => ({
                        [theme.fn.smallerThan("sm")]: {
                          fontSize: "13px",
                        },
                      })}
                    >
                      Login
                    </Title>
                  </Button>
                  <Button component={Link} href={routes.register}>
                    {" "}
                    <Title
                      order={4}
                      sx={(theme) => ({
                        [theme.fn.smallerThan("sm")]: {
                          fontSize: "15px",
                        },
                      })}
                    >
                      Register
                    </Title>
                  </Button>
                </Group>
              )}
              {meData?.username && (
                <Group
                  noWrap
                  position="right"
                  spacing={20}
                  sx={(theme) => ({
                    [theme.fn.smallerThan("md")]: { display: "none" },
                  })}
                >
                  <Menu>
                    <Menu.Target>
                      <Avatar radius={"xl"} src={meData?.username} />
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        onClick={() => {
                          push(routes.dashboard);
                        }}
                      >
                        Dashboard
                      </Menu.Item>
                      <Menu.Label>Account</Menu.Label>

                      <Menu.Item onClick={signOut}>Logout</Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              )}
            </Group>
          </Col>
          <MediaQuery largerThan="sm" styles={{ display: "none" }}>
            <Col span={2}>
              <Burger
                opened={opened}
                onClick={openBurger}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </Col>
          </MediaQuery>
        </Grid>
      </Header>
      {children}
    </Stack>
  );
};

export default CustomNavbar;
