import { getAllGames } from "utils/storage";
import Link from "next/link";
import { sortBy } from "lodash";
import { StorageGame } from "../types";
import { useEffect, useState } from "react";

export default function GamesComponent() {
  const [games, setGames] = useState<StorageGame[]>();

  useEffect(() => {
    const data = getAllGames();
    if (!data) return;
    const arr: any[] = Object.entries(data).map(([key, value]) => value);
    const storageGames = sortBy(arr, "datetime") as StorageGame[];
    setGames(storageGames);
  }, []);

  if (!games) {
    return (
      <div>
        empty
        <Link href={"/"}>
          <a>home</a>
        </Link>
      </div>
    );
  }

  const parseDate = (dateNumber: number) => {
    const date = new Date(dateNumber);
    return `${date.getFullYear()} ${
      date.getMonth() + 1
    }/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
  };

  return (
    <div>
      {games.map(({ datetime, game }) => (
        <div key={`${datetime}`}>
          <p>last update: {parseDate(datetime)}</p>
          <p>players</p>
          <ul>
            {game.players.map(({ name, id }) => (
              <li key={`${datetime}-${id}`}>{name}</li>
            ))}
          </ul>
        </div>
      ))}
      <Link href={"/"}>
        <a>home</a>
      </Link>
    </div>
  );
}
