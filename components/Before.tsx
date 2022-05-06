import { useState } from "react";
import { List as MovableList } from "react-movable";
import { HStack, Box, Button, Input, VStack } from "@chakra-ui/react";
import { CloseIcon, DragHandleIcon } from "@chakra-ui/icons";
import { token } from "utils/token";
import { t } from "utils/text";

import { Players, Player } from "types";

export default function Before({
  players,
  onCreate,
  onRemove,
  onChange,
}: {
  players: Players;
  onCreate: (player: Player) => void;
  onChange: (players: Players) => void;
  onRemove: (id: string) => void;
}) {
  const [player, setPlayer] = useState<Player | undefined>();
  return (
    <>
      <MovableList
        values={players}
        onChange={({ oldIndex, newIndex }) => {
          let newPlayers: Players = [...players];
          newPlayers.splice(oldIndex, 1);
          newPlayers.splice(newIndex, 0, players[oldIndex]);
          onChange(newPlayers);
        }}
        renderList={({ children, props }) => <Box {...props}>{children}</Box>}
        renderItem={({ value, props, isDragged }) => {
          const { id, name } = value;
          return (
            <HStack {...props} p={2} bg={isDragged ? "gray.100" : undefined}>
              <Box
                px={2}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <DragHandleIcon />
              </Box>
              <Box flex={1}>{name}</Box>
              <Button onClick={() => onRemove(id)} disabled={isDragged}>
                <CloseIcon />
              </Button>
            </HStack>
          );
        }}
      />
      {player ? (
        <HStack p={2}>
          <Input
            autoFocus
            onChange={(e) => {
              setPlayer({
                ...player,
                name: e.target.value,
              });
            }}
            value={player.name}
          />
          <Button
            onClick={() => {
              setPlayer(undefined);
            }}
          >
            <CloseIcon />
          </Button>
          <Button
            disabled={
              !player.name || !!players.find(({ name }) => name === player.name)
            }
            onClick={() => {
              onCreate(player);
              setPlayer(undefined);
            }}
          >
            {t("add")}
          </Button>
        </HStack>
      ) : (
        <Box my={4} mx={2}>
          <Button
            isFullWidth
            onClick={() =>
              setPlayer({
                id: token(),
                name: "",
                point: 0,
                fails: 0,
              })
            }
          >
            {t("addNewPlayer")}
          </Button>
        </Box>
      )}
      <Box p={3}>{t("youCanMoveOrder")}</Box>
    </>
  );
}
