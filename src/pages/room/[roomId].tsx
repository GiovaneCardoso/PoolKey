import React, { useEffect, useState } from "react";
import { useUserContext } from "../../contexts/userContext";
import io from "socket.io-client";
import { useRouter } from "next/router";

let socket: any;
const Room = () => {
  const router = useRouter();

  const { name } = useUserContext();
  const { roomId } = router.query;

  const [users, setUsers] = useState<string[]>([]);
  const [role, setRole] = useState<string>("normal");

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket = io("pool-key.vercel.app");
    socket.on("connect", () => {
      console.log("connected");
    });
    socket.on("users", (users: string[]) => {
      setUsers(users);
      console.log(users);
    });
    socket.emit("join", { roomId, name });
  };

  useEffect(() => {
    socketInitializer();
  }, []);
  useEffect(() => {
    if (name) {
      localStorage.setItem("user", name);
    }
  }, [name]);
  useEffect(() => {
    if (users[0] == name) {
      setRole("master");
    }
  }, [users]);

  const startMatch = () => {
    socket.to(roomId).emit("startMatch");
  };

  return (
    <div>
      <p>Olá {name}</p>
      <p>Sala de ID {roomId}</p>
      <p>Usuários conectados</p>
      <div>
        {users.map((user) => (
          <p key={user}>{user}</p>
        ))}
      </div>
      <div>
        {role == "master" && (
          <div>
            <p>Você é o administrador da sala</p>
            <button onClick={startMatch}>Começar partida</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Room;
