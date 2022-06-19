import { Socket } from "net";
import { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";

interface SocketResponse extends NextApiResponse {
  socket: Socket & {
    server: any;
  };
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function socket(_: NextApiRequest, response: SocketResponse) {
  if (response?.socket?.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(response?.socket?.server);
    let users: any[] = [];

    io.on("connection", (socket: any) => {
      socket.on("join", ({ roomId, name }: any) => {
        const user = {
          name,
          score: 0,
          id: socket.id,
          roomId,
        };
        socket.join(roomId);
        if (name) {
          users.push(user);
        }

        io.to(roomId).emit(
          "users",
          users.filter((user) => user.roomId == roomId)
        );
      });
      socket.on("startMatch", ({ roomId }: any) => {
        let balls = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        users.forEach((user) => {
          if (user.roomId != roomId) {
            return;
          }
          let randomBall = [];
          for (let i = 0; i < 3; i++) {
            const max = balls.length;
            const min = 1;
            const random = Math.floor(Math.random() * (max - min + 1)) + min;
            randomBall.push(balls[random - 1]);
            randomBall.forEach((ball) => {
              balls = balls.filter((item) => item !== ball);
            });
          }
          io.to(user.id).emit("balls", randomBall);
        });
      });
      socket.on("score", ({ name, score, roomId }) => {
        users.forEach((user) => {
          if (user.name == name) {
            user.score = score;
          }
        });
        io.to(roomId).emit(
          "users",
          users.filter((user) => user.roomId == roomId)
        );
      });
      socket.on("disconnect", () => {
        users = users.filter((user) => user.id !== socket.id);
        io.emit("users", users);
      });
    });

    response.socket.server.io = io;
  }
  response.end();
}
