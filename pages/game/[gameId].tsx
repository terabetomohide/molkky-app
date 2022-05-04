import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Game } from "types";
import { sortBy } from "lodash";
import Before from "components/Before";
import Playing from "components/Playing";
import Finished from "components/Finished";
import AddPoints from "components/AddPoints";
import { getCurrentGame, setCurrentGame } from "utils/storage";
import { token } from "utils/token";

const maxPoint = 50;
const reducedPoint = 25;
const maxFails = 3;

export default function GameComponent() {
  const router = useRouter();
  const { gameId } = router.query;
  const [game, setGame] = useState<Game>();
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);

  useEffect(() => {
    gameId &&
      setGame(
        getCurrentGame(String(gameId))?.game ?? {
          id: String(gameId),
          state: "before",
          players: [],
          histories: [],
        }
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);

  useEffect(() => {
    if (!game?.histories) return;
    setCurrentGame(String(gameId), game);

    if (game?.state === "playing") {
      const winner = game.players.find((player) => player.point === maxPoint);
      const fail = game.players.find((player) => player.fails === maxFails);
      if (winner || fail) {
        setGame({ ...game, state: "finished" });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game?.histories]);

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
    // 保存データ読み出し中
    return null;
  }

  const { players, state, histories } = game;

  switch (state) {
    case "before":
      return (
        <div>
          <Before
            onChange={(players) => {
              setGame({
                ...game,
                players,
              });
            }}
            onCreate={(player) => {
              setGame({
                ...game,
                players: [...game.players, player],
              });
            }}
            onRemove={(removeId) => {
              const currentPlayers = [...game.players];
              const index = currentPlayers.findIndex(
                ({ id }) => id === removeId
              );
              currentPlayers.splice(index, 1);
              setGame({
                ...game,
                players: currentPlayers,
              });
            }}
            players={players}
          />
          <button
            disabled={!game.players.length}
            onClick={() => {
              setGame({
                ...game,
                state: "playing",
              });
            }}
          >
            start game
          </button>
          <Link href={"/"}>
            <a>home</a>
          </Link>
        </div>
      );
    case "playing":
      return (
        <div>
          <Playing
            players={players}
            currentPlayerIndex={currentPlayerIndex}
            histories={histories}
          />
          <div>
            <AddPoints
              onAddPoints={(point) => {
                const currentPlayers = [...game.players];
                const currentHistory = [...game.histories];
                let currentPlayer = { ...currentPlayers[currentPlayerIndex] };

                // 0が続いてもpointが入ればfailsはリセットされる
                let fails = point ? 0 : Number(currentPlayer.fails) + 1;

                let newPoint = currentPlayer.point + point;

                if (newPoint > maxPoint) {
                  newPoint = reducedPoint;
                }
                if (fails === maxFails) {
                  newPoint = 0;
                }
                currentHistory.push({
                  playerIndex: currentPlayerIndex,
                  point,
                  total: newPoint,
                });

                currentPlayer = {
                  ...currentPlayer,
                  point: newPoint,
                  fails,
                };

                currentPlayers.splice(currentPlayerIndex, 1, currentPlayer);
                setGame({
                  ...game,
                  players: currentPlayers,
                  histories: currentHistory,
                });

                const length = players.length;
                setCurrentPlayerIndex((prev) =>
                  prev + 1 === length ? 0 : prev + 1
                );
              }}
              histories={histories}
              onUndo={() => {
                let currentPlayers = [...game.players];
                let currentHistory = [...game.histories];
                const { playerIndex, total } =
                  currentHistory[currentHistory.length - 1];
                let currentPlayer = currentPlayers[playerIndex];
                currentPlayers[playerIndex] = {
                  ...currentPlayer,
                  point: total,
                };
                currentHistory.pop();
                let index = currentPlayerIndex - 1;
                if (index < 0) {
                  index = currentPlayers.length - 1;
                }
                setCurrentPlayerIndex(index);
                setGame({
                  ...game,
                  players: currentPlayers,
                  histories: currentHistory,
                });
              }}
            />
          </div>
          <Link href={"/"}>
            <a>home</a>
          </Link>
        </div>
      );
    case "finished":
      return (
        <div>
          <Finished players={players} />
          <button
            onClick={() => {
              const newId = token();
              setGame({
                ...game,
                id: newId,
                state: "before",
                players: sortBy([...game.players].reverse(), "points").map(
                  (player) => ({
                    ...player,
                    point: 0,
                    fails: 0,
                  })
                ),
                histories: [],
              });
            }}
          >
            next game
          </button>
          <Link href={"/"}>
            <a>home</a>
          </Link>
        </div>
      );
  }
}
