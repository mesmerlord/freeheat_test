import {
  getApiUserCarsListQueryKey,
  getApiUserCarsRetrieveQueryKey,
  useApiUserCarsCreate,
  useApiUserCarsDestroy,
  useApiUserCarsList,
  useApiUserCarsPartialUpdate,
} from "@/api/api";
import { UserCarModel } from "@/model";
import { errorNotification } from "@/utils/error-notification";
import { routes } from "@/utils/routes";
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Center,
  Col,
  Grid,
  Group,
  Image,
  Modal,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { LightningBoltIcon, TrashIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";

const CarsPage = () => {
  const router = useRouter();
  const { data, isLoading: isFetchingCars } = useApiUserCarsList();
  const { mutate } = useApiUserCarsCreate();
  const { mutate: deleteCar } = useApiUserCarsDestroy();
  const { mutate: patchCar, isLoading: isPatchingCar } =
    useApiUserCarsPartialUpdate();

  const queryClient = useQueryClient();

  const [newCarModalOpened, setNewCarModalOpened] = useState(false);

  const newCarForm = useForm<Omit<UserCarModel, "owner" | "id">>({
    initialValues: {
      name: "",
      model: "",
      year: new Date().getFullYear(),
      current_energy: "100",
      max_energy: "100",
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(
      {
        data: {
          ...newCarForm.values,
        },
      },
      {
        onError: (error) => {
          errorNotification(error);
        },
        onSettled: () => {
          queryClient.invalidateQueries(getApiUserCarsListQueryKey());
        },
      }
    );
    setNewCarModalOpened(false);
    newCarForm.reset();
  };

  const handleDelete = (id: number) => {
    deleteCar(
      { id },
      {
        onError: (error) => {
          errorNotification(error);
        },
        onSuccess: () => {
          queryClient.invalidateQueries(getApiUserCarsListQueryKey());
        },
      }
    );
  };

  const changeCharging = ({
    id,
    charging,
  }: {
    id: number;
    charging: Boolean;
  }) => {
    patchCar(
      {
        id,
        data: {
          is_charging: !!charging,
        },
      },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries(getApiUserCarsListQueryKey());
          queryClient.invalidateQueries(
            getApiUserCarsRetrieveQueryKey(data.id)
          );
        },
      }
    );
  };

  return (
    <Box>
      <Title order={1} align="center">
        Your Cars
      </Title>
      <Group position="right">
        <Button onClick={() => setNewCarModalOpened(true)}>+ Add Car</Button>
      </Group>
      <Modal
        opened={newCarModalOpened}
        onClose={() => setNewCarModalOpened(false)}
        size="md"
      >
        <Modal.Title>Add Car</Modal.Title>
        <Card shadow="sm" padding="md" radius="md" mb="md">
          <form onSubmit={handleSubmit}>
            <Group spacing="md">
              <TextInput
                {...newCarForm.getInputProps("name")}
                label="Name"
                required
              />
              <TextInput
                {...newCarForm.getInputProps("model")}
                label="Car Model"
              />
              <TextInput {...newCarForm.getInputProps("year")} label="Year" />
              <TextInput
                {...newCarForm.getInputProps("current_energy")}
                label="Current Energy(in %)"
              />
              <TextInput
                {...newCarForm.getInputProps("max_energy")}
                label="Max Energy(in kWh)"
              />
            </Group>
            <Center mt={20}>
              <Button type="submit">Save Car</Button>
            </Center>
          </form>
        </Card>
      </Modal>
      <Grid
        sx={(theme) => ({
          padding: theme.spacing.md,
          [theme.fn.smallerThan("md")]: {
            padding: "2px",
          },
        })}
      >
        {data?.results?.map((car) => (
          <Col span={6} md={4} key={car.id}>
            <Card
              shadow="sm"
              padding="md"
              radius="md"
              mb="md"
              sx={{
                position: "relative",
              }}
            >
              <Box
                onClick={(event) => {
                  event.stopPropagation();
                  router.push(`${routes.carDashboard}/${car.id}`);
                }}
                sx={{
                  cursor: "pointer",
                }}
              >
                <Image
                  mt={30}
                  alt="Placeholder"
                  src="https://tesla-cdn.thron.com/delivery/public/image/tesla/03c34975-991c-45ee-a340-2b700bf7de01/bvlatuR/std/960x540/meet-your-tesla_model-s?20190221"
                  sx={{ borderRadius: "md", overflow: "hidden" }} // Ensure image corners match card corners
                />
                <Box mt={3}>
                  <Title order={2} my={2}>
                    {car.name}
                  </Title>
                  <Group
                    sx={{ position: "absolute", top: 10, left: 10 }}
                    spacing={3}
                  >
                    <ActionIcon
                      color={car?.is_charging ? "green" : "red"}
                      variant="filled"
                    >
                      <LightningBoltIcon />
                    </ActionIcon>
                    <Text>
                      {car?.is_charging ? "Charging" : "Not Charging"}
                    </Text>
                  </Group>
                  <Stack spacing={2}>
                    <Group>
                      <Group spacing={5}>
                        <Text weight={500}>Energy Level: </Text>
                        <Text>{car.current_energy}%</Text>
                      </Group>
                      <Group spacing={5}>
                        <Text weight={500}>Max Energy: </Text>
                        <Text>{car.max_energy} kWh</Text>
                      </Group>
                    </Group>
                    <Group
                      position="right"
                      sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        transition: "transform 0.3s ease",
                        ":hover": { transform: "scale(1.1)" },
                      }}
                    >
                      <ActionIcon
                        color="red"
                        variant="filled"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDelete(car.id);
                        }}
                      >
                        <TrashIcon />
                      </ActionIcon>
                    </Group>
                  </Stack>
                </Box>
              </Box>
              <Group position="right" mt={20}>
                <Switch
                  disabled={isPatchingCar || isFetchingCars}
                  label={<LightningBoltIcon />}
                  labelPosition="left"
                  checked={car?.is_charging}
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                  onChange={(event) => {
                    event.stopPropagation();
                    changeCharging({
                      id: car?.id,
                      charging: event.currentTarget.checked,
                    });
                  }}
                />
              </Group>
            </Card>
          </Col>
        ))}
      </Grid>
    </Box>
  );
};

export default CarsPage;
