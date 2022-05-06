import { useState } from "react";
import { List as MovableList } from "react-movable";
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
        renderList={({ children, props }) => <ul {...props}>{children}</ul>}
        renderItem={({ value, props }) => {
          const { id, name } = value;
          return (
            <li {...props}>
              <div>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                >
                  =
                </span>
                <span>{name}</span>
                <button onClick={() => onRemove(id)}>x</button>
              </div>
            </li>
          );
        }}
      />
      <ul>
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
                {t("add")}
              </button>
            </>
          ) : (
            <button
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
            </button>
          )}
        </li>
      </ul>
      <div>{t("youCanMoveOrder")}</div>
    </>
  );
}
