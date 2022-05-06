import Head from "next/head";
import Footer from "components/Footer";
import Link from "next/link";
import { token } from "utils/token";
import { t } from "utils/text";
import { resetData } from "utils/storage";
import { VStack, Box, Container, Heading, Button } from "@chakra-ui/react";

const MenuButton = ({ label, path }: { label: string; path: string }) => (
  <Link href={path}>
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
  return (
    <div className="container">
      <Head>
        <title>{t("appName")}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Container p={0}>
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
          <Box height={"calc(100vh - 250px)"}>
            <VStack
              display="flex"
              height={"100%"}
              alignItems="center"
              justifyContent="center"
              spacing={5}
            >
              <MenuButton label={t("addNewGame")} path={`/game/${token()}`} />
              <MenuButton label={t("pastGames")} path={"/games"} />
            </VStack>
          </Box>
          <VStack>
            <Box>
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
        </Container>
      </main>
      <Footer />
    </div>
  );
}
