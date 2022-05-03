import { useRouter } from "next/router";
import { Game } from "types";
import { useEffect, useState } from "react";
import PlayerList from "components/PlayerList";

export default function GameComponent() {
  const router = useRouter();
  const { gameId } = router.query;
  const [game, setGame] = useState<Game>();

  useEffect(() => {
    //保存データになければ
    setGame({
      id: String(gameId),
      state: "before",
      players: [],
      history: [],
    });
  }, [gameId]);

  if (!game) {
    // 保存データ読み出し中
    return null;
  }

  const { players, state } = game;

  switch (state) {
    case "before":
      return (
        <div>
          <PlayerList
            onCreate={(player) => {
              setGame({
                ...game,
                players: [...game.players, player],
              });
            }}
            onRemove={(removeId) => {
              const players = game.players;
              const index = players.findIndex(({ id }) => id === removeId);
              players.splice(index, 1);
              setGame({
                ...game,
                players,
              });
            }}
            players={players}
            gameState={state}
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
      return <PlayerList players={players} gameState={state} />;
    case "finished":
      return <PlayerList players={players} gameState={state} />;
  }
}
