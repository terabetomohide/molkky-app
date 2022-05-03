import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Players, Player } from "types";

export default function Before({
  players,
  onCreate,
  onRemove,
}: {
  players: Players;
  onCreate: (player: Player) => void;
  onRemove: (id: string) => void;
}) {
  const [player, setPlayer] = useState<Player | undefined>();

  return (
    <div>
      <ul>
        {!!players.length &&
          players.map(({ name, id, point }: Player, index) => (
            <li key={id}>
              <button onClick={() => onRemove(id)}>x</button>
              <span>{name}</span>
            </li>
          ))}
        {
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
                  onClick={() => {
                    onCreate(player);
                    setPlayer(undefined);
                  }}
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
        }
      </ul>
    </div>
  );
}
