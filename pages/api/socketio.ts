import { NextApiRequest, NextApiResponse } from "next";
import { Server as NetServer, Socket } from "net";
import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";

// https://github.com/redbaron76/nextjs-socketio-chat

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    console.log("New Socket.io server...");
    // adapt Next's net Server to http Server
    const httpServer: HttpServer = res.socket.server as any;
    // append SocketIO server to Next.js socket server response
    res.socket.server.io = new SocketIOServer(httpServer, {
      path: "/api/socketio",
    });
  }
  res.end();
};
