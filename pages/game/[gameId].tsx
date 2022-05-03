import { useRouter } from "next/router";
import { Game } from "types";
import { useEffect, useState } from "react";
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
    //保存データになければ
    setGame({
      id: String(gameId),
      state: "before",
      players: [],
      history: [],
    });
  }, [gameId]);

  useEffect(() => {
    // 変わるたびに保存する
    // 50を超えた時
    // 0が3回続いた時
    // stateを変える
    console.log(game?.history);
  }, [game]);

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
        </div>
      );
    case "finished":
      return <Finished players={players} />;
  }
}
