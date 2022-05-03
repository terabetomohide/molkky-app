export type GameState = "before" | "playing" | "finished";

export type Game = {
  id: string;
  state: GameState;
  players: Players;
  history: Histories;
};

export type Games = Game[];

export type History = { playerIndex: number; point: number; skipped?: boolean };

export type Histories = History[];

export type Player = {
  id: string;
  name: string;
  point: number;
};

export type Players = Player[];
