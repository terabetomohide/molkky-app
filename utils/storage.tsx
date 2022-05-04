import { Game, Storage, StorageGame } from "../types";

const rootStorageKey = "molkky-app";

export const resetData: () => void = () => {
  localStorage.clear();
};

export const getAllGames: () => Storage | null = () => {
  const data = localStorage.getItem(rootStorageKey);
  return !!data ? (JSON.parse(data) as Storage) : null;
};

export const getCurrentGame: (id: string) => StorageGame | null = (id) => {
  const storage = getAllGames();
  return !!storage?.[id] ? storage[id] : null;
};

export const setCurrentGame: (id: string, game: Game) => void = (id, game) => {
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
};
