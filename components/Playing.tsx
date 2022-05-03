import { Players, Player } from "types";

export default function Playing({
  players,
  currentPlayerIndex,
}: {
  players: Players;
  currentPlayerIndex: number;
}) {
  return (
    <div>
      <ul>
        {!!players.length &&
          players.map(({ name, id, point }: Player, index) => (
            <li
              key={id}
              style={
                currentPlayerIndex === index
                  ? {
                      border: "1px solid #aaa",
                    }
                  : undefined
              }
            >
              <span>name:{name} </span>
              <span>point:{point}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}
