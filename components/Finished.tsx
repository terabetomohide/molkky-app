import { Players, Player } from "types";
import { t } from "utils/text";

export default function Finished({ players }: { players: Players }) {
  return (
    <div>
      <ul>
        {!!players.length &&
          players.map(({ name, id, point }: Player, index) => (
            <li key={id}>
              <div>{name}</div>
              <div>
                {t["point"]}:{point}
                {point === 50 && <span> {t["winner"]}</span>}
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
