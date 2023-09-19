import {
  ActionIcon,
  Box,
  Button,
  Center,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useState } from "react";

import { useApiDjRestAuthRegisterCreate } from "@/api/api";
import CheckmarkIcon from "@/components/CheckmarkIcon";
import { errorNotification } from "@/utils/error-notification";
import { useForm } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";

const RegisterTab = () => {
  const register = useApiDjRestAuthRegisterCreate();
  const [emailVerifyTab, setEmailVerifyTab] = useState(true);

  const form = useForm({
    initialValues: {
      email: "",
      first_name: "",
      last_name: "",
      username: "",
      password1: "",
      password2: "",
    },
  });
  const action = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    showNotification({
      id: "register",
      title: `Signing you up`,
      message: `Please wait while we register you`,
      loading: true,
    });
    register.mutate(
      {
        data: {
          ...form.values,
        },
      },
      {
        onSuccess: () => {
          updateNotification({
            id: "register",
            loading: false,
            title: `Register Successful`,
            message: `You have been registered, please check your email for the verification link`,
            icon: <ActionIcon>✓</ActionIcon>,
          });
          setEmailVerifyTab(false);
        },
        onError: (error) => {
          errorNotification(error);
        },
      }
    );
  };

  return (
    <Box px={20} py={5}>
      {emailVerifyTab ? (
        <form onSubmit={action}>
          <Group grow>
            <TextInput
              placeholder="Bob"
              label="First Name"
              {...form.getInputProps("first_name")}
              required
              sx={{ marginBottom: "20px" }}
            />
            <TextInput
              placeholder="Smith"
              {...form.getInputProps("last_name")}
              label="Last Name"
              sx={{ marginBottom: "20px" }}
            />
          </Group>

          <TextInput
            placeholder="bobsmith"
            {...form.getInputProps("username")}
            label="Username"
            required
            sx={{ marginBottom: "20px" }}
          />
          <TextInput
            placeholder="bobsmith@gmail.com"
            {...form.getInputProps("email")}
            label="Email"
            required
            sx={{ marginBottom: "20px" }}
          />
          <Group noWrap grow align="flex-end">
            <PasswordInput
              placeholder="Enter your password"
              description="At least 8 characters long"
              {...form.getInputProps("password1")}
              label="Password"
              required
              sx={{ marginBottom: "20px" }}
            />
            <PasswordInput
              description="Enter password again"
              placeholder="Confirm Password"
              {...form.getInputProps("password2")}
              label="Confirm Password"
              required
              sx={{ marginBottom: "20px" }}
            />
          </Group>

          <Button
            fullWidth
            type="submit"
            size="lg"
            sx={{ marginBottom: "15px" }}
          >
            Register
          </Button>
          <Stack spacing={10}>
            <Text color="gray" size="sm">
              By creating an account, you agree to our terms & conditions and
              privacy policy.
            </Text>
          </Stack>
        </form>
      ) : (
        <Stack spacing={10}>
          <Center>
            <CheckmarkIcon />
          </Center>
          <Text
            sx={(theme) => ({
              [theme.fn.smallerThan("sm")]: {
                fontSize: "20px",
              },
              fontSize: "32px",
              marginBottom: "10px",
              fontWeight: 900,
              zIndex: 100,
              color: "skyblue",
            })}
            align="center"
          >
            Thank you For Registering!
          </Text>
          <Text sx={{ fontSize: "17px", marginBottom: "5px" }}>
            You can now login.
          </Text>
        </Stack>
      )}
    </Box>
  );
};

export default RegisterTab;
