import { useApiUserCarsRetrieve } from "@/api/api";
import { routes } from "@/utils/routes";
import {
  Accordion,
  Box,
  Center,
  Group,
  Image,
  Table,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";

const CarDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data } = useApiUserCarsRetrieve(Number(id));

  return (
    <Box
      sx={(theme) => ({
        padding: theme.spacing.xl,
        [theme.fn.smallerThan("md")]: {
          padding: theme.spacing.sm,
        },
      })}
    >
      <Group position="left" my={20} spacing={8}>
        <Link href={routes.carDashboard} style={{ textDecoration: "none" }}>
          <Title order={4} align="left" underline>
            My Cars
          </Title>
        </Link>
        <Title order={4}> {">"}</Title>
        <Title order={4} align="left">
          {data?.name}
        </Title>
      </Group>
      <Center>
        <Image
          width={300}
          radius={"sm"}
          // cover size
          fit="cover"
          alt="Placeholder"
          src="https://tesla-cdn.thron.com/delivery/public/image/tesla/03c34975-991c-45ee-a340-2b700bf7de01/bvlatuR/std/960x540/meet-your-tesla_model-s?20190221"
          sx={{ borderRadius: "md", overflow: "hidden" }} // Ensure image corners match card corners
        />
      </Center>
      <Title order={2} mt={20} align="center">
        {data?.name} ({data?.model})
      </Title>

      <Box
        sx={(theme) => ({
          padding: 30,
          [theme.fn.smallerThan("md")]: {
            padding: theme.spacing.sm,
          },
        })}
      >
        <Accordion>
          <Accordion.Item value="charging">
            <Accordion.Control>
              <Title order={4}>Charging History</Title>
            </Accordion.Control>
            <Accordion.Panel>
              <Table striped>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Energy</th>
                    <th>Charging Status </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.user_car_charge_logs?.map((log) => (
                    <tr key={log.id}>
                      <td>{new Date(log.created_at).toLocaleString()}</td>
                      <td>{log.energy}</td>
                      <td>{log.is_charging ? "Charging" : "Not Charging"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Box>
    </Box>
  );
};

export default CarDetailPage;
