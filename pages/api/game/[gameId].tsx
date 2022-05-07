import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../socketio";
import cacheData from "memory-cache";

export default (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (req.method === "GET") {
    const param = req.query;
    const key: string | string[] | undefined = param?.gameId;

    if (typeof key !== "string") return;
    const data = cacheData.get(key);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404);
      res.end();
    }
    return;
  }

  if (req.method === "POST") {
    const data = req.body;
    const param = req.query;
    const gameId: string | string[] | undefined = param?.gameId;

    if (typeof gameId !== "string") return;

    cacheData.put(gameId, data, 1000 * 60 * 60 * 24);
    console.log("updated gameId:", gameId);

    // dispatch to channel "message"
    res?.socket?.server.io.emit(gameId, data);

    // return message
    res.status(201).json(data);
    return;
  }
};
