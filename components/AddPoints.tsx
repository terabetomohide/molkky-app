import React from "react";
import { VStack, HStack, Stack, Box, Button, Grid } from "@chakra-ui/react";
import { Histories } from "types";
import { t } from "utils/text";

const points = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const ButtonItem = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <Button
    fontSize={30}
    onClick={() => onClick()}
    w={"60px"}
    h={"60px"}
    borderRadius={"50%"}
  >
    {children}
  </Button>
);

export default function AddPoints({
  onAddPoints,
  onUndo,
  histories,
}: {
  onAddPoints: (add: number) => void;
  onUndo: () => void;
  histories: Histories;
}) {
  return (
    <Box
      position={"fixed"}
      display={"flex"}
      flexWrap={"wrap"}
      bottom={2}
      width={"100%"}
      maxWidth={"400px"}
      justifyContent="center"
      alignItems="center"
    >
      {points.map((p) => (
        <Box
          p={2}
          width={"20%"}
          display={"flex"}
          justifyContent="center"
          alignItems="center"
        >
          <ButtonItem
            key={`button-${String(p)}`}
            onClick={() => onAddPoints(p)}
          >
            {String(p)}
          </ButtonItem>
        </Box>
      ))}
      <Box
        width={"40%"}
        p={1}
        display={"flex"}
        justifyContent="center"
        alignItems="center"
      >
        <Button
          onClick={onUndo}
          disabled={!histories.length}
          width={"100%"}
          h={"60px"}
          borderRadius={"30px"}
        >
          {t("undo")}
        </Button>
      </Box>
    </Box>
  );
}
