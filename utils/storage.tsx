import { Game, Storage, StorageGame } from "../types";

export const resetData: () => void = () => {
  localStorage.clear();
};

const rootStorageKey = "molkky-app";

export const getCurrentGame: (id: string) => StorageGame | null = (id) => {
  const data = localStorage.getItem(rootStorageKey);
  const storage = !!data ? (JSON.parse(data) as Storage) : null;
  return !!storage?.[id] ? storage[id] : null;
};

export const setCurrentGame: (id: string, data: Game) => void = (id, data) => {
  const storage = localStorage.getItem(rootStorageKey);
  let newStorage: Storage;
  if (!storage) {
    newStorage = {} as Storage;
  } else {
    newStorage = JSON.parse(storage) as Storage;
  }
  newStorage[id] = {
    datetime: new Date().getTime(),
    game: data,
  };
  localStorage.setItem(rootStorageKey, JSON.stringify(newStorage));
};
