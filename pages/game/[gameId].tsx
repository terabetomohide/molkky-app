import type { GetServerSideProps } from "next";
import React, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Game, Player, Players } from "types";
import { sortBy, isEqual } from "lodash";
import absoluteUrl from "next-absolute-url";
import { token } from "utils/token";
import { t } from "utils/text";
import { getCurrentGame, setArchive, setCurrentGame } from "utils/storage";
import Before from "components/Before";
import Playing from "components/Playing";
import Finished from "components/Finished";
import AddPoints from "components/AddPoints";
import Layout from "components/Layoout";
import Loading from "components/Loading";
import { Button, VStack, Box } from "@chakra-ui/react";
import SlideConfirm from "components/SlideComfirm";

import { io } from "socket.io-client";
import { api } from "config/socket";
import { Socket } from "socket.io-client";

export const maxPoint = 50;
const reducedPoint = 25;
const maxFails = 3;
const userId = token();

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
    currentPlayerIndex: playerIndex,
    players: currentPlayers,
    histories: currentHistory,
  };
}

function addPoint(game: Game, add: number): Game {
  const currentPlayers = [...game.players];
  const currentHistory = [...game.histories];
  let currentPlayer = { ...currentPlayers[game.currentPlayerIndex] };

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
    playerIndex: game.currentPlayerIndex,
    add,
    prevPoint: currentPlayer.point,
  });

  currentPlayer = {
    ...currentPlayer,
    point: newPoint,
    fails,
  };

  let nextPlayerIndex = game.currentPlayerIndex + 1;
  if (nextPlayerIndex === currentPlayers.length) {
    nextPlayerIndex = 0;
  }

  currentPlayers.splice(game.currentPlayerIndex, 1, currentPlayer);
  return {
    ...game,
    currentPlayerIndex: nextPlayerIndex,
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

type gameIdPageProps = { host?: string };

export default function GameComponent({ host }: gameIdPageProps) {
  const router = useRouter();
  const { gameId } = router.query;
  const [game, setGame] = useState<Game>();
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmIndex, setConfirmIndex] = useState<number | null>(null);

  const socketInitializer: () => void = async () => {
    const socket: Socket = io(api, {
      withCredentials: true,
      forceNew: true,
    });
    socket.on("connection", (message) => {
      console.log("SOCKET CONNECTED!", socket.id, message);
    });

    socket.on(String(gameId), (data: { game: Game; userId: string }) => {
      setLoading(true);
      console.log(userId, data.userId);
      if (
        userId !== data.userId &&
        ((!data && !game) || !isEqual(data, game))
      ) {
        console.log("set game");
        setGame(data.game);
      }
      setTimeout(() => setLoading(false), 100);
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
        currentPlayerIndex: 0,
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
    setLoading(true);
    setConfirmIndex(null);
    setCurrentGame(game.id, game, userId).finally(() => {
      setTimeout(() => setLoading(false), 100);
    });

    if (game?.state === "playing") {
      const winner = game.players.find((player) => player.point === maxPoint);
      const fail = game.players.find((player) => player.fails === maxFails);
      if (winner || fail) {
        let preIndex = game.currentPlayerIndex - 1;
        if (preIndex < 0) {
          preIndex = game.players.length - 1;
        }
        setConfirmIndex(preIndex);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game?.histories?.length, game?.players?.length]);

  useEffect(() => {
    if (!game?.state || !game?.players.length) return;
    setLoading(true);
    setCurrentGame(game.id, game, userId).finally(() => {
      setTimeout(() => setLoading(false), 100);
      if (gameId !== game.id) {
        router.push(`/game/${game.id}`);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game?.state]);

  useEffect(() => {
    if (!game?.nextGameId) return;
    if (gameId !== game.nextGameId) {
      setLoading(true);
      setCurrentGame(
        game.nextGameId,
        { ...game, nextGameId: undefined },
        userId
      ).finally(() => {
        setTimeout(() => {}, 100);
        router.push(`/game/${game?.nextGameId}`);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game?.nextGameId]);

  if (!game) {
    return (
      <Layout host={host}>
        <Loading />
      </Layout>
    );
  }

  const undoHandler = () => {
    setGame(undoHistory(game));
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
                currentPlayerIndex={game.currentPlayerIndex}
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
                const finishedGame: Game = {
                  ...game,
                  players: sortBy([...players], "point").reverse(),
                  state: "finished",
                };
                setArchive(token(), finishedGame);
                setGame(finishedGame);
                setConfirmIndex(null);
              }}
              onCancel={() => {
                undoHandler();
                setConfirmIndex(null);
              }}
            />
            <AddPoints
              onAddPoints={(add) => {
                if (loading) return;
                setGame(addPoint(game, add));
              }}
              histories={histories}
              onUndo={() => {
                if (loading) return;
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
                  setGame({
                    ...game,
                    nextGameId: newId,
                    state: "before",
                    currentPlayerIndex: 0,
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
  return <Layout host={host}>{content()}</Layout>;
}

export const getServerSideProps: GetServerSideProps<gameIdPageProps> = async (
  context
) => {
  const { origin } = absoluteUrl(context.req);
  return { props: { host: origin || undefined } };
};
