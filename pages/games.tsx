import { getArchive } from "utils/storage";
import Link from "next/link";
import { sortBy } from "lodash";
import { StorageGame } from "types";
import { useEffect, useState } from "react";
import { VStack, Box, Button, Stack, Text, HStack } from "@chakra-ui/react";
import Layout from "components/Layoout";
import Finished from "components/Finished";
import { t } from "utils/text";

export default function GamesComponent() {
  const [games, setGames] = useState<StorageGame[]>();

  useEffect(() => {
    const data = getArchive();
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
      {games.map(({ datetime, game: { players, state, id, histories } }) => (
        <Stack key={`${id}`} py={5} px={3} boxShadow={"0 8px 8px #ddd"}>
          <Box>
            {t("saveDatetime")}: {parseDate(datetime)}
          </Box>
          <Finished
            players={sortBy([...players], "point").reverse()}
            histories={histories}
          />
        </Stack>
      ))}
    </Layout>
  );
}
