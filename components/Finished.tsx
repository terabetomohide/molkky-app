import { Players, Player } from "types";

export default function Finished({ players }: { players: Players }) {
  return (
    <div>
      <ul>
        {!!players.length &&
          players.map(({ name, id, point }: Player, index) => (
            <li key={id}>
              <span>name:{name}</span>
              <span>point:{point}</span>
              {point === 50 && <span>[winner]</span>}
            </li>
          ))}
      </ul>
    </div>
  );
}
