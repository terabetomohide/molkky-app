import React, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Game, Player, Players } from "types";
import { sortBy, isEqual } from "lodash";
import { token } from "utils/token";
import { t } from "utils/text";
import { getCurrentGame, setCurrentGame } from "utils/storage";
import Before from "components/Before";
import Playing from "components/Playing";
import Finished from "components/Finished";
import AddPoints from "components/AddPoints";
import Layout from "components/Layoout";
import Loading from "components/Loading";
import { Button, VStack, Box } from "@chakra-ui/react";
import SlideConfirm from "components/SlideComfirm";

import { io } from "socket.io-client";

export const maxPoint = 50;
const reducedPoint = 25;
const maxFails = 3;

function undoHistory(game: Game): Game | undefined {
  let currentPlayers = [...game.players];
  let currentHistory = [...game.histories];
  const removeHistory = currentHistory.pop();
  if (!removeHistory) return;

  const { playerIndex, add, prevPoint } = removeHistory;
  let currentPlayer = currentPlayers[playerIndex];
  currentPlayers[playerIndex] = {
    ...currentPlayer,
    point: prevPoint,
    fails: currentPlayer.fails && add === 0 ? currentPlayer.fails - 1 : 0,
  };
  return {
    ...game,
    players: currentPlayers,
    histories: currentHistory,
  };
}

function addPoint(game: Game, currentPlayerIndex: number, add: number): Game {
  const currentPlayers = [...game.players];
  const currentHistory = [...game.histories];
  let currentPlayer = { ...currentPlayers[currentPlayerIndex] };

  // 0が続いてもpointが入ればfailsはリセットされる
  let fails = !!add ? 0 : Number(currentPlayer.fails) + 1;

  let newPoint = currentPlayer.point + add;

  if (newPoint > maxPoint) {
    newPoint = reducedPoint;
  }
  if (fails === maxFails) {
    newPoint = 0;
  }
  currentHistory.push({
    playerIndex: currentPlayerIndex,
    add,
    prevPoint: currentPlayer.point,
  });

  currentPlayer = {
    ...currentPlayer,
    point: newPoint,
    fails,
  };

  currentPlayers.splice(currentPlayerIndex, 1, currentPlayer);
  return {
    ...game,
    players: currentPlayers,
    histories: currentHistory,
  };
}

function initPlayers(players: Players): Players {
  return sortBy([...players], "point").map((player) => ({
    ...player,
    point: 0,
    fails: 0,
  }));
}

function removePlayer(players: Players, removeId: Player["id"]): Players {
  const arr = [...players];
  const index = arr.findIndex(({ id }) => id === removeId);
  arr.splice(index, 1);
  return arr;
}

export default function GameComponent() {
  const router = useRouter();
  const { gameId } = router.query;
  const [game, setGame] = useState<Game>();
  const [confirmIndex, setConfirmIndex] = useState<number | null>(null);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);

  const socketInitializer: () => void = async () => {
    const socket = io("", {
      path: "/api/socketio",
    });
    socket.on("connect", () => {
      console.log("SOCKET CONNECTED!", socket.id);
    });

    socket.on(String(gameId), (data: Game) => {
      console.log(1);
      console.log(isEqual(data, game));
      console.log(data, game);
      if (!isEqual(data, game)) {
        setGame(data);
      }
    });
    if (socket) return () => socket.disconnect();
  };

  useEffect(() => {
    if (!gameId) return;
    socketInitializer();
    const currentGame = getCurrentGame(String(gameId));
    const newGame = () =>
      setGame({
        id: String(gameId),
        state: "before",
        players: [],
        histories: [],
      });
    currentGame
      .then((data) => {
        if (data) {
          setGame(data);
        } else {
          newGame();
        }
      })
      .catch(() => {
        newGame();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);

  useEffect(() => {
    if (!game?.histories || !game?.players?.length) return;
    setCurrentGame(String(gameId), game);

    if (game?.state === "playing") {
      const winner = game.players.find((player) => player.point === maxPoint);
      const fail = game.players.find((player) => player.fails === maxFails);
      if (winner || fail) {
        let index = currentPlayerIndex - 1;
        if (index < 0) {
          index = game.players.length - 1;
        }
        setConfirmIndex(index);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game?.histories?.length, game?.players?.length]);

  useEffect(() => {
    if (!game?.state || !game?.players.length) return;
    setCurrentGame(String(game.id), game);
    if (gameId !== game.id) {
      router.push(`/game/${game.id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game?.state]);

  useEffect(() => {}, [game?.players]);

  if (!game) {
    return <Loading />;
  }

  const undoHandler = () => {
    setGame(undoHistory(game));
    let index = currentPlayerIndex - 1;
    if (index < 0) {
      index = game.players.length - 1;
    }
    setCurrentPlayerIndex(index);
  };

  const { players, state, histories } = game;

  const content = () => {
    switch (state) {
      case "before":
        return (
          <div>
            <Before
              onChange={(newPlayers) => {
                setGame({
                  ...game,
                  players: newPlayers,
                });
              }}
              onCreate={(player) => {
                setGame({
                  ...game,
                  players: [...players, player],
                });
              }}
              onRemove={(removeId) => {
                setGame({
                  ...game,
                  players: removePlayer(players, removeId),
                });
              }}
              players={players}
            />
            <VStack m={3}>
              <Button
                size={"lg"}
                bg={"green.100"}
                disabled={!game.players.length}
                onClick={() => {
                  setGame({
                    ...game,
                    state: "playing",
                  });
                }}
              >
                {t("startGame")}
              </Button>
            </VStack>
          </div>
        );
      case "playing":
        return (
          <div>
            <Box mb={"250px"}>
              <Playing
                players={players}
                currentPlayerIndex={currentPlayerIndex}
                histories={histories}
                confirmIndex={confirmIndex}
              />
            </Box>
            <SlideConfirm
              open={typeof confirmIndex === "number"}
              title={t("mayIFinished")}
              cancelLabel={t("undo")}
              submitLabel={t("finishOnThisResult")}
              onSubmit={() => {
                setGame({ ...game, state: "finished" });
                setConfirmIndex(null);
              }}
              onCancel={() => {
                undoHandler();
                setConfirmIndex(null);
              }}
            />
            <AddPoints
              onAddPoints={(add) => {
                setGame(addPoint(game, currentPlayerIndex, add));
                setCurrentPlayerIndex((prev) =>
                  prev + 1 === players.length ? 0 : prev + 1
                );
              }}
              histories={histories}
              onUndo={() => {
                undoHandler();
              }}
            />
          </div>
        );
      case "finished":
        return (
          <div>
            <Finished
              players={sortBy([...players], "point").reverse()}
              histories={histories}
            />
            <VStack m={3}>
              <Button
                onClick={() => {
                  const newId = token();
                  setCurrentPlayerIndex(0);
                  setGame({
                    ...game,
                    id: newId,
                    state: "before",
                    players: initPlayers(players),
                    histories: [],
                  });
                }}
              >
                {t("nextGame")}
              </Button>
            </VStack>
          </div>
        );
    }
  };
  return <Layout>{content()}</Layout>;
}
