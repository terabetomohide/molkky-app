import { Players, Player, Histories } from "types";
import { HStack, Stack, Box } from "@chakra-ui/react";
import { t } from "utils/text";

export default function Playing({
  players,
  currentPlayerIndex,
  histories,
}: {
  players: Players;
  currentPlayerIndex: number;
  histories: Histories;
}) {
  const playerHistory = (index: number) =>
    histories.filter(({ playerIndex }) => playerIndex === index);

  return (
    <>
      <Stack spacing={0}>
        {!!players.length &&
          players.map(({ name, id, point, fails }: Player, index) => (
            <Box
              key={id}
              bg={currentPlayerIndex === index ? "green.200" : "green.50"}
              p={3}
            >
              <Stack>
                <HStack justifyContent={"space-between"}>
                  <Box fontWeight={600} fontSize={22}>
                    {name}
                  </Box>
                  <Box fontSize={20}>
                    <small>{t("point")} </small>
                    {point}
                  </Box>
                </HStack>
                <Box>
                  {playerHistory(index).map(({ add }, index) => (
                    <small key={`${index}-${add}`}>{!!add ? add : "x"} </small>
                  ))}
                </Box>
              </Stack>
            </Box>
          ))}
      </Stack>
    </>
  );
}
