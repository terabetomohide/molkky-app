import { Players, Player, Histories } from "types";
import { t } from "utils/text";
import { Box, HStack, Stack } from "@chakra-ui/react";

export default function Finished({
  players,
  histories,
}: {
  players: Players;
  histories: Histories;
}) {
  const playerHistory = (index: number) =>
    histories.filter(({ playerIndex }) => playerIndex === index);
  return (
    <>
      <Stack>
        {!!players.length &&
          players.map(({ name, id, point }: Player, index) => {
            return (
              <Box
                key={id}
                p={3}
                bg={!index ? "green.400" : undefined}
                color={!index ? "white" : undefined}
              >
                <Stack>
                  <HStack justifyContent={"space-between"}>
                    <HStack>
                      <Box
                        w={"40px"}
                        h={"40px"}
                        fontSize={26}
                        fontWeight={600}
                        borderRadius={"50%"}
                        background={!index ? "white" : "green.200"}
                        color={!index ? "red" : undefined}
                        textAlign="center"
                      >
                        {index + 1}
                      </Box>
                      <Box fontWeight={600} fontSize={22}>
                        {name}
                      </Box>
                    </HStack>
                    <Box fontSize={20}>
                      <small>{t("point")} </small>
                      {point}
                    </Box>
                  </HStack>
                  <Box>
                    {playerHistory(index).map(({ add }, index) => (
                      <small key={`${index}-${add}`}>
                        {!!add ? add : "x"}{" "}
                      </small>
                    ))}
                  </Box>
                </Stack>
              </Box>
            );
          })}
      </Stack>
    </>
  );
}
