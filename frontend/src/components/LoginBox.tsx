import { useApiDjRestAuthLoginCreate } from "@/api/api";
import { errorNotification } from "@/utils/error-notification";
import { onLogin } from "@/utils/login";
import { routes } from "@/utils/routes";
import {
  ActionIcon,
  Button,
  Card,
  PasswordInput,
  Stack,
  Tabs,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import router from "next/router";
import { useState } from "react";
import RegisterTab from "./pageSpecific/Login/RegisterTab";

const LoginBoxUnwrapped = ({ defaultTab = "login" }) => {
  const loginForm = useForm({
    initialValues: {
      username: "",
      password: "",
    },
  });

  const [activeTab, setActiveTab] = useState<string | null>(defaultTab);

  const authLogin = useApiDjRestAuthLoginCreate();
  const queryClient = useQueryClient();

  const normalLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    showNotification({
      id: "Logging In",
      title: `Logging you In`,
      message: `Checking your credential, please wait`,
      loading: true,
      autoClose: false,
    });
    authLogin.mutate(
      {
        data: {
          ...loginForm.values,
        },
      },
      {
        onSuccess: (token) => {
          updateNotification({
            id: "Logging In",
            loading: false,
            autoClose: 2000,
            title: `Login Successful`,
            message: `Your Login is successful, redirecting..`,
            icon: <ActionIcon>✓</ActionIcon>,
          });
          onLogin({
            newToken: token.key,
            router,
            queryClient,
            loginComponent: "Normal",
          });
        },
        onError: (error) => {
          updateNotification({
            id: "Logging In",
            loading: false,
            autoClose: 2000,
            title: `Login Failed`,
            message: `Your Login failed, please try again`,
          });
          errorNotification(error);
        },
      }
    );
  };

  const setTab = (tab: string) => {
    if (router.pathname !== routes.register && tab === "register") {
      router.push(routes.register);
    }
    if (router.pathname === routes.register && tab === "login") {
      router.push(routes.login);
    }
    setActiveTab(tab);
  };

  return (
    <Tabs
      orientation="horizontal"
      variant="default"
      value={activeTab}
      defaultValue={defaultTab}
      onTabChange={setTab}
    >
      <Card p={5} shadow="xl">
        <Tabs.List grow>
          <Tabs.Tab value="login">
            <Title
              order={4}
              sx={(theme) => ({
                [theme.fn.smallerThan("sm")]: {
                  fontSize: "15px",
                },
              })}
            >
              Login
            </Title>
          </Tabs.Tab>
          <Tabs.Tab value="register">
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
          </Tabs.Tab>
        </Tabs.List>
        <br />
        <Tabs.Panel value="login">
          <Stack
            p={20}
            spacing={40}
            sx={{
              backgroundColor: "white",
              borderRadius: "10px",
            }}
          >
            <form onSubmit={normalLogin}>
              <Stack spacing={20}>
                <Stack spacing={20}>
                  <TextInput
                    placeholder="Enter your username"
                    label="Username"
                    {...loginForm.getInputProps("username")}
                    required
                  />

                  <PasswordInput
                    placeholder="Enter your password"
                    {...loginForm.getInputProps("password")}
                    label="Password"
                    required
                  />
                  <Button variant="filled" size="lg" type="submit">
                    Login
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Stack>
        </Tabs.Panel>
        <Tabs.Panel value="register">
          <RegisterTab />
        </Tabs.Panel>
      </Card>
    </Tabs>
  );
};

const LoginBox = ({
  defaultTab = "login",
}: {
  defaultTab?: "login" | "register";
}) => {
  return <LoginBoxUnwrapped defaultTab={defaultTab} />;
};

export default LoginBox;
