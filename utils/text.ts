export type TextKeys =
  | "ok"
  | "cancel"
  | "appName"
  | "molkky"
  | "app"
  | "scoreApp"
  | "home"
  | "add"
  | "name"
  | "point"
  | "undo"
  | "addNew"
  | "addNewGame"
  | "startGame"
  | "removeGame"
  | "nextGame"
  | "noHistory"
  | "pastGames"
  | "addNewPlayer"
  | "players"
  | "youCanMoveOrder"
  | "winner"
  | "playing"
  | "before"
  | "finished"
  | "finishOnThisResult"
  | "mayIFinished"
  | "state"
  | "resume"
  | "lastUpdate"
  | "removeData"
  | "removeAllIfConfirm";

export const text: { [key in TextKeys]: string } = {
  ok: "OK",
  cancel: "キャンセル",
  appName: "モルック スコアリングアプリ",
  molkky: "モルック",
  app: "アプリ",
  scoreApp: "スコアリングアプリ",
  home: "トップページ",
  add: "追加",
  name: "名前",
  point: "ポイント",
  undo: "やり直す",
  addNew: "新規追加",
  addNewGame: "新規ゲーム作成",
  startGame: "この順番でゲーム開始",
  removeGame: "ゲーム削除",
  nextGame: "次のゲームをする",
  noHistory: "保存された履歴はありません",
  pastGames: "ゲーム履歴",
  addNewPlayer: "新規プレイヤー追加",
  players: "参加プレイヤー",
  youCanMoveOrder: "順番は並び替えられます",
  winner: "勝利!",
  playing: "プレイ中",
  before: "開始前",
  finished: "終了",
  mayIFinished: "終了してよろしいですか？",
  finishOnThisResult: "この結果で終了する",
  state: "ステータス",
  resume: "このゲームを再開する",
  lastUpdate: "最終更新日時",
  removeData: "データ削除",
  removeAllIfConfirm: "保存されたデータを全て削除します。",
} as const;

export function t(key: TextKeys): string {
  try {
    return text[key];
  } catch {
    return "undefined text";
  }
}
