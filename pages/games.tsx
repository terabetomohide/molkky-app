import { getAllGames } from "utils/storage";
import Link from "next/link";
import { sortBy } from "lodash";
import { StorageGame } from "../types";
import { useEffect, useState } from "react";
import Layout from "components/Layoout";

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
    return <Layout>no data</Layout>;
  }

  const parseDate = (dateNumber: number) => {
    const date = new Date(dateNumber);
    return `${date.getFullYear()} ${
      date.getMonth() + 1
    }/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
  };

  return (
    <Layout>
      {games.map(({ datetime, game: { players, state, id } }) => (
        <div key={`${datetime}`}>
          <p>last update: {parseDate(datetime)}</p>
          <p>{state}</p>
          <p>players</p>
          <ul>
            {players.map(({ name, id }) => (
              <li key={`${datetime}-${id}`}>{name}</li>
            ))}
          </ul>
          {state !== "finished" && (
            <Link href={`/game/${id}`}>
              <a>resume</a>
            </Link>
          )}
        </div>
      ))}
    </Layout>
  );
}
