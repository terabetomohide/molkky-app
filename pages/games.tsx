import { getAllGames } from "utils/storage";
import Link from "next/link";
import { sortBy } from "lodash";
import { StorageGame } from "types";
import { useEffect, useState } from "react";
import { VStack, Box, Button, Stack, Text, HStack } from "@chakra-ui/react";
import Layout from "components/Layoout";
import { t } from "utils/text";

export default function GamesComponent() {
  const [games, setGames] = useState<StorageGame[]>();

  useEffect(() => {
    const data = getAllGames();
    if (!data) return;
    const arr: any[] = Object.entries(data).map(([key, value]) => value);
    const storageGames = sortBy(arr, "datetime").reverse() as StorageGame[];
    setGames(storageGames);
  }, []);

  if (!games) {
    return <Layout>{t("noHistory")}</Layout>;
  }

  const parseDate = (dateNumber: number) => {
    const date = new Date(dateNumber);
    return `${date.getFullYear()} ${
      date.getMonth() + 1
    }/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
  };

  return (
    <Layout>
      {games.map(({ datetime, game: { players, state, id } }) => (
        <Stack key={`${id}`} py={5} px={3}>
          <Box>
            {id}
            {t("lastUpdate")}: {parseDate(datetime)}
          </Box>
          <Box>
            {t("state")}: {t(state)}
          </Box>
          <Box>{t("players")}:</Box>
          <VStack>
            {players.map(({ name, id, point }) => (
              <Box key={`${datetime}-${id}`}>
                <HStack>
                  <Box>{name}</Box>
                  <Box>{point}</Box>
                </HStack>
              </Box>
            ))}
          </VStack>
          {state !== "finished" && (
            <VStack>
              <Link href={`/game/${id}`} passHref>
                <Button as={"a"}>{t("resume")}</Button>
              </Link>
            </VStack>
          )}
        </Stack>
      ))}
    </Layout>
  );
}
