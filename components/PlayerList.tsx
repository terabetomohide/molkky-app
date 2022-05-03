import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Players, Player, GameState } from "types";

export default function PlayerList({
  players,
  gameState,
  onCreate,
  onRemove,
}: {
  players: Players;
  onCreate?: (player: Player) => void;
  onRemove?: (id: string) => void;
  gameState: GameState;
}) {
  const [player, setPlayer] = useState<Player | undefined>();

  return (
    <div>
      <ul>
        {!!players.length &&
          players.map(({ name, id, point }: Player) => (
            <li key={id}>
              {gameState === "before" && (
                <button onClick={onRemove ? () => onRemove(id) : undefined}>
                  x
                </button>
              )}
              <span>{name}</span>
              {gameState !== "before" && <span>{point}</span>}
            </li>
          ))}
        {gameState === "before" && (
          <li>
            {player ? (
              <>
                <input
                  onChange={(e) => {
                    setPlayer({
                      ...player,
                      name: e.target.value,
                    });
                  }}
                  value={player.name}
                />
                <button
                  onClick={() => {
                    setPlayer(undefined);
                  }}
                >
                  x
                </button>
                <button
                  disabled={
                    !player.name ||
                    !!players.find(({ name }) => name === player.name)
                  }
                  onClick={
                    onCreate
                      ? () => {
                          onCreate(player);
                          setPlayer(undefined);
                        }
                      : undefined
                  }
                >
                  追加
                </button>
              </>
            ) : (
              <button
                onClick={() =>
                  setPlayer({
                    id: uuidv4(),
                    name: "",
                    point: 0,
                  })
                }
              >
                add new player
              </button>
            )}
          </li>
        )}
      </ul>
    </div>
  );
}
