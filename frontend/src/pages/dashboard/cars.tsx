import {
  getApiUserCarsListQueryKey,
  useApiUserCarsCreate,
  useApiUserCarsDestroy,
  useApiUserCarsList,
  useApiUserCarsPartialUpdate,
} from "@/api/api";
import { UserCarModel } from "@/model";
import { errorNotification } from "@/utils/error-notification";
import {
  Box,
  Button,
  Card,
  Center,
  Col,
  Grid,
  Group,
  Modal,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const CarsPage = () => {
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
      }
    );
    setNewCarModalOpened(false);
    newCarForm.reset();
    queryClient.invalidateQueries(getApiUserCarsListQueryKey());
  };

  const handleDelete = (id: number) => {
    deleteCar({ id });
    queryClient.invalidateQueries(getApiUserCarsListQueryKey());
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
      <Grid p={20}>
        {data?.results?.map((car) => (
          <Col span={4} key={car.id}>
            <Card shadow="sm" padding="md" radius="md" mb="md">
              <Title order={2} my={30}>
                {car.name}
              </Title>
              <Stack>
                <Group position="right">
                  <Switch
                    disabled={isPatchingCar || isFetchingCars}
                    label="Charging"
                    checked={car?.is_charging}
                    onChange={(event) =>
                      changeCharging({
                        id: car?.id,
                        charging: event.currentTarget.checked,
                      })
                    }
                  />
                </Group>
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
                <Group position="right">
                  <Button color="red" onClick={() => handleDelete(car.id)}>
                    Delete
                  </Button>
                </Group>
              </Stack>
            </Card>
          </Col>
        ))}
      </Grid>
    </Box>
  );
};

export default CarsPage;
