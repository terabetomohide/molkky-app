export type GameState = "before" | "playing" | "finished";

export type Game = {
  id: string;
  currentPlayerIndex: number;
  state: GameState;
  players: Players;
  histories: Histories;
};

export type Games = Game[];

export type History = {
  playerIndex: number;
  add: number;
  prevPoint: number;
};

export type Histories = History[];

export type Player = {
  id: string;
  name: string;
  point: number;
  fails: number;
};

export type Players = Player[];

export type StorageGame = {
  datetime: number;
  game: Game;
};

export type Storage = {
  [id: string]: StorageGame;
};
