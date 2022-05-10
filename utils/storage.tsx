import { Game, Storage } from "../types";
import { api } from "../config/socket";

const rootStorageKey = "molkky-app";

export const resetData: () => void = () => {
  localStorage.clear();
};

export const getAllGames: () => Storage | null = () => {
  const data = localStorage.getItem(rootStorageKey);
  return !!data ? (JSON.parse(data) as Storage) : null;
};

export const getCurrentGame: (gameId: string) => Promise<Game> = (gameId) => {
  const storage: Storage = getAllGames() || {};
  return fetch(`${api}/game/${gameId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .catch(() => {
      return storage?.[gameId]?.game ?? null;
    });
};

export const setCurrentGame: (
  id: string,
  game: Game,
  userId: string
) => Promise<Response> = (id, game, userId) => {
  const storage = getAllGames();
  let newStorage: Storage;
  if (!storage) {
    newStorage = {} as Storage;
  } else {
    newStorage = storage;
  }
  newStorage[id] = {
    datetime: new Date().getTime(),
    game,
  };
  localStorage.setItem(rootStorageKey, JSON.stringify(newStorage));

  return fetch(`${api}/game/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      game,
    }),
  });
};
