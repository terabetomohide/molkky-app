import Head from "next/head";
import Footer from "components/Footer";
import Link from "next/link";
import { token } from "utils/token";
import { t } from "utils/text";
import { resetData } from "utils/storage";
import { wakeUpApi } from "utils/storage";
import {
  VStack,
  Box,
  Container,
  Heading,
  Button,
  Flex,
} from "@chakra-ui/react";
import { useEffect } from "react";

const MenuButton = ({
  label,
  path,
  disablePrefetch,
}: {
  label: string;
  path: string;
  disablePrefetch?: boolean;
}) => (
  <Link href={path} passHref prefetch={!disablePrefetch}>
    <Button
      as="a"
      w={"80vw"}
      p={10}
      bg={"green.400"}
      color={"white"}
      fontSize={20}
      borderRadius={"30px"}
    >
      {label}
    </Button>
  </Link>
);

export default function Home() {
  useEffect(() => {
    // herokuに先行してアクセスしてスリープ解除を早める
    wakeUpApi();
  }, []);

  return (
    <div className="container">
      <Head>
        <title>{t("appName")}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Container p={0}>
          <Flex
            direction={"column"}
            h={"100vh"}
            justifyContent={"space-between"}
          >
            <Heading
              as="h1"
              size="3xl"
              pt={20}
              width={"100%"}
              color={"green.400"}
            >
              <VStack letterSpacing={5}>
                <Box>{t("molkky")}</Box>
                <Box fontSize={18}>{t("scoreApp")} </Box>
              </VStack>
            </Heading>
            <Box>
              <VStack
                display="flex"
                height={"100%"}
                alignItems="center"
                justifyContent="center"
                spacing={5}
              >
                <MenuButton
                  label={t("addNewGame")}
                  path={`/game/${token()}`}
                  disablePrefetch
                />
                <MenuButton label={t("pastGames")} path={"/games"} />
              </VStack>
            </Box>
            <VStack>
              <Box p={10}>
                <Button
                  onClick={() => {
                    if (window.confirm(t("removeAllIfConfirm"))) {
                      resetData();
                    }
                  }}
                >
                  {t("removeData")}
                </Button>
              </Box>
            </VStack>
          </Flex>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
