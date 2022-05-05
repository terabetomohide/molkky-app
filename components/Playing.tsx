import { Players, Player, Histories } from "types";

export default function Playing({
  players,
  currentPlayerIndex,
  histories,
}: {
  players: Players;
  currentPlayerIndex: number;
  histories: Histories;
}) {
  const playerHistory = (index: number) =>
    histories.filter(({ playerIndex }) => playerIndex === index);

  return (
    <div>
      <ul>
        {!!players.length &&
          players.map(({ name, id, point, fails }: Player, index) => (
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
              <div>
                <span>name:{name} </span>
                <span>point:{point}</span>
                <span>fails:{fails}</span>
              </div>
              <div>
                {playerHistory(index).map(({ add }, index) => (
                  <small key={`${index}-${add}`}>{!!add ? add : "x"} </small>
                ))}
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
