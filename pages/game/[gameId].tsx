import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Game } from "types";
import { sortBy } from "lodash";
import Before from "components/Before";
import Playing from "components/Playing";
import Finished from "components/Finished";
import AddPoints from "components/AddPoints";

const maxPoint = 50;
const reducedPoint = 25;

export default function GameComponent() {
  const router = useRouter();
  const { gameId } = router.query;
  const [game, setGame] = useState<Game>();
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);

  useEffect(() => {
    //保存データになければ初期値をセット
    setGame({
      id: String(gameId),
      state: "before",
      players: [],
      history: [],
    });
  }, [gameId]);

  useEffect(() => {
    if (!game?.history) return;
    // 変わるたびに保存する
    // 0が3回続いた時
    // stateを変える
    console.log(game?.history);
  }, [game?.history]);

  useEffect(() => {
    if (!game?.players) return;
    if (game?.state === "playing") {
      const winner = game.players.find((player) => player.point === 50);
      if (winner) {
        setGame({ ...game, state: "finished" });
      }
    }
  }, [game?.players]);

  if (!game) {
    // 保存データ読み出し中
    return null;
  }

  const { players, state } = game;

  switch (state) {
    case "before":
      return (
        <div>
          <Before
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
          <Playing players={players} currentPlayerIndex={currentPlayerIndex} />
          <div>
            <AddPoints
              onAddPoints={(point) => {
                const currentPlayers = [...game.players];
                const currentHistory = [...game.history];
                let currentPlayer = { ...currentPlayers[currentPlayerIndex] };
                let newPoint = currentPlayer.point + point;
                if (newPoint > maxPoint) {
                  newPoint = reducedPoint;
                }
                currentHistory.push({ playerIndex: currentPlayerIndex, point });
                currentPlayer = {
                  ...currentPlayer,
                  point: newPoint,
                };
                currentPlayers.splice(currentPlayerIndex, 1, currentPlayer);
                setGame({
                  ...game,
                  players: currentPlayers,
                  history: currentHistory,
                });

                const length = players.length;
                setCurrentPlayerIndex((prev) =>
                  prev + 1 === length ? 0 : prev + 1
                );
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
              setGame({
                ...game,
                state: "before",
                players: sortBy([...game.players].reverse(), "points"),
                history: [],
              });
              // バックアップを取る
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
