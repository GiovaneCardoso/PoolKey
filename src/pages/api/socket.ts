import { Socket } from "net";
import { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";

interface SocketResponse extends NextApiResponse {
  socket: Socket & {
    server: any;
  };
}

export default function socket(_: NextApiRequest, response: SocketResponse) {
  let users: string[] = [];

  if (response?.socket?.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(response?.socket?.server);
    io.on("connection", (socket: any) => {
      socket.on("join", ({ roomId, name }: any) => {
        socket.join(roomId);
        if (!users.includes(name) && name) {
          users.push(name);
        }
        io.to(roomId).emit("users", users);
      });

      socket.on("test", (msg: any) => {
        socket.broadcast.emit("testUpdated", msg);
      });
    });

    response.socket.server.io = io;
  }
  response.end();
}
