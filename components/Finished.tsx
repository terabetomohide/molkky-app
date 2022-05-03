import { Players, Player } from "types";

export default function Finished({ players }: { players: Players }) {
  return (
    <div>
      <ul>
        {!!players.length &&
          players.map(({ name, id, point }: Player, index) => (
            <li key={id}>
              <span>{name}</span>
              <span>{point}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}
