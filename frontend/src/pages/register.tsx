import Background from "@/components/Background";
import LoginBox from "@/components/LoginBox";
import Seo from "@/components/common/Seo";
import { routes } from "@/utils/routes";
import { Center, Col, Container, Grid, Image, Text } from "@mantine/core";
import { useRouter } from "next/router";
import nookies from "nookies";
import { useEffect } from "react";
//@ts-ignore

const LoginPage = () => {
  const accessToken = nookies.get(null)?.accessToken;

  const router = useRouter();

  useEffect(() => {
    if (accessToken) {
      router.push(`${routes.home}`);
    }
  });

  return (
    <Background>
      <Seo title={`Login - Musky Cars`} description="Register An Account" />

      <Container
        size="xl"
        sx={(theme) => ({
          padding: "20px",
          marginTop: "10px",
          [theme.fn.smallerThan("md")]: {
            marginTop: "10px",
            padding: "8px",
          },
        })}
      >
        <Grid>
          <Col span={12} md={5}>
            <LoginBox defaultTab="register" />
          </Col>

          <Col span={12} offset={0} md={7} offsetMd={0}>
            <Image
              src="https://www.hiesscheme.org.uk/wp-content/uploads/2018/08/comp-hies-covers-electric-vehicle-charge-points-768x512.jpg"
              height={500}
              alt="Electric Car"
            />
            <Center mt={-45}>
              <Text
                sx={(theme) => ({
                  color: "rgb(27, 20, 93)",
                  width: "70%",
                  fontSize: "22px",
                  fontWeight: 400,
                  [theme.fn.smallerThan("md")]: {
                    width: "100%",
                  },
                  zIndex: 1,
                })}
              >
                Join 1000+ climate conscious drivers. Start Saving On Your
                Electric Costs Today!
              </Text>
            </Center>
          </Col>
        </Grid>
      </Container>
    </Background>
  );
};

export default LoginPage;
