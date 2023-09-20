import {
  getApiEnergyLogsListQueryKey,
  useApiEnergyLogsList,
  useApiEnergyLogsUploadCsvCreate,
  useApiUserCarChargeLogsList
} from "@/api/api";
import { errorNotification } from "@/utils/error-notification";
import {
  Box,
  Button,
  Center,
  Group,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { UploadIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const processChargeData = (
  logs: { created_at: string; is_charging: boolean }[]
): { charging: boolean; start: string; end: string }[] => {
  const hourBlocks: Record<
    string,
    { charging: boolean; start: string; end: string }
  > = {};

  logs.forEach((log) => {
    const date = new Date(log.created_at);
    const hourKey = `${date.toLocaleDateString()} ${date.getHours()}:00`;

    if (!hourBlocks[hourKey]) {
      hourBlocks[hourKey] = {
        charging: false,
        start: `${date.toLocaleDateString()} ${date.getHours()}:00`,
        end: `${date.toLocaleDateString()} ${date.getHours() + 1}:00`,
      };
    }

    if (log.is_charging) {
      hourBlocks[hourKey].charging = true;
    }
  });

  return Object.values(hourBlocks).filter((block) => block.charging);
};

const ElectricityPage = () => {
  const { data } = useApiEnergyLogsList({
    itemsPerPage: 1000,
    page: 1,
  });
  const { data: chargeData } = useApiUserCarChargeLogsList({
    itemsPerPage: 100,
    page: 1,
  });

  const queryClient = useQueryClient();

  // Transform data for the graph
  const graphData = data?.results?.map((item) => ({
    date: `${new Date(item.created_at).toLocaleDateString()} ${new Date(
      item.created_at
    ).getHours()}:00`,
    datetime: new Date(item.created_at).toLocaleString(),
    price: parseFloat(item.price),
  }));

  // Extract periods when car was charged
  const chargingHours = processChargeData(chargeData?.results || []);

  const { mutate } = useApiEnergyLogsUploadCsvCreate();
  const fileInputRef = useRef(null);

  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      // @ts-ignore
      fileInputRef.current.click();
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.target.files && e.target.files[0]) {
      mutate(
        { data: { file: e.target.files[0] } },
        {
          onSuccess: () => {
            showNotification({
              title: "File uploaded",
              message: "File uploaded successfully",
            });
            queryClient.invalidateQueries(getApiEnergyLogsListQueryKey({
              itemsPerPage: 1000,
              page: 1,
            }));
          },
          onError: (error) => {
            errorNotification(error);
          },
        }
      );
    }
  };
  return (
    <Box
      sx={(theme) => ({
        padding: theme.spacing.xl,
        [theme.fn.smallerThan("md")]: {
          padding: 5,
        },
      })}
    >
      <Title order={2} align="center">
        Electricity Prices
      </Title>
      <form onSubmit={(e) => e.preventDefault()} encType="multipart/form-data">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          style={{ display: "none" }}
          onChange={handleUpload}
        />
      </form>

      {data?.results && data?.results?.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={graphData}>
              <Line type="monotone" dataKey="price" stroke="#8884d8" />
              {chargingHours.map((hourBlock, index) => (
                <ReferenceArea
                  key={index}
                  x1={hourBlock.start}
                  x2={hourBlock.end}
                  strokeOpacity={0.4}
                  fill="#FFD700"
                />
              ))}
              <CartesianGrid stroke="#ccc" />
              <XAxis
                dataKey="date"
                tickFormatter={(tickItem) => tickItem.split(" ")[0]}
              />
              <YAxis />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div
                        style={{
                          backgroundColor: "white",
                          padding: "10px",
                          border: "1px solid #ccc",
                        }}
                      >
                        <p>{`Time: ${payload[0].payload.datetime}`}</p>
                        <p>{`Price: ${payload[0].value}`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />{" "}
            </LineChart>
          </ResponsiveContainer>
          <Group position="right" my={20} spacing={8}>
            <Text>
              Yellow areas represent periods when your car was charging
            </Text>
          </Group>
          <Table striped>
            <thead>
              <tr>
                <th>Time</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {data?.results?.map((item) => (
                <tr key={item.id}>
                  <td>{new Date(item.created_at).toLocaleString()}</td>
                  <td>{item.price} EUR</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      ) : (
        <Stack>
          <Title order={3} align="center" mt={20}>
            No data available
          </Title>
          <Center>
            <Button
              variant="filled"
              size="lg"
              leftIcon={<UploadIcon />}
              onClick={handleFileUploadClick}
            >
              Upload Electricity Prices
            </Button>
          </Center>
        </Stack>
      )}
    </Box>
  );
};

export default ElectricityPage;
