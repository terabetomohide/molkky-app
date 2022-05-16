import { Players, Player, Histories } from "types";
import { HStack, Stack, Box } from "@chakra-ui/react";
import { t } from "utils/text";
import { maxFails } from "pages/game/[gameId]";

export default function Playing({
  players,
  currentPlayerIndex,
  histories,
  confirmIndex,
}: {
  players: Players;
  currentPlayerIndex: number;
  histories: Histories;
  confirmIndex: number | null;
}) {
  const playerHistory = (index: number) =>
    histories.filter(({ playerIndex }) => playerIndex === index);

  const bgColor = (index: number) => {
    if (typeof confirmIndex !== "number" && currentPlayerIndex === index) {
      return "green.200";
    }
    if (confirmIndex === index) {
      return "red.200";
    }
    return "green.50";
  };

  const lastPlayerIndex = histories.length
    ? histories[histories.length - 1].playerIndex
    : undefined;

  return (
    <>
      <Stack spacing={0}>
        {!!players.length &&
          players.map(({ name, id, point, fails }: Player, playerIndex) => (
            <Box
              key={id}
              bg={bgColor(playerIndex)}
              opacity={fails === maxFails ? 0.5 : 1}
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
                  {playerHistory(playerIndex).map(({ add }, index) => {
                    const isLastHistory =
                      playerHistory(playerIndex).length - 1 === index;
                    const isLastPlayer = playerIndex === lastPlayerIndex;
                    return (
                      <Box
                        px={0.5}
                        display={"inline-block"}
                        key={`${index}-${add}`}
                        fontSize={isLastHistory && fails === 2 ? 18 : 14}
                        fontWeight={
                          isLastHistory && isLastPlayer ? "bold" : undefined
                        }
                        color={
                          isLastHistory && isLastPlayer
                            ? "blackAlpha.500"
                            : "blackAlpha.700"
                        }
                        borderBottom={
                          isLastHistory && fails === 2
                            ? "2px solid #f00"
                            : undefined
                        }
                      >
                        {!!add ? add : "x"}
                      </Box>
                    );
                  })}
                </Box>
              </Stack>
            </Box>
          ))}
      </Stack>
    </>
  );
}
