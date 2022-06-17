import React, { useEffect, useState } from "react";
import { useUserContext } from "../../contexts/userContext";
import io from "socket.io-client";
import { useRouter } from "next/router";

let socket: any;
const Room = () => {
  const router = useRouter();

  const { name } = useUserContext();
  const { roomId } = router.query;

  const [users, setUsers] = useState<any[]>([]);
  const [role, setRole] = useState<string>("normal");
  const [balls, setBalls] = useState<number[]>([]);
  useEffect(() => {
    socketInitializer();
    return () => socket && socket.disconnect();
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/socket");

    socket = io();
    socket.on("connect", () => {
      console.log("connected");
    });
    socket.on("users", (users: string[]) => {
      setUsers(users);
      console.log(users);
    });
    socket.on("balls", (balls: number[]) => {
      console.log(balls);
      setBalls(balls);
    });
    socket.emit("join", { roomId, name });
  };
  useEffect(() => {
    if (users[0]?.name == name) {
      setRole("master");
    }
  }, [users]);

  const startMatch = () => {
    socket.emit("startMatch");
  };

  return (
    <div>
      <p>Olá {name}</p>
      <p>Sala de ID {roomId}</p>
      <p>Usuários conectados</p>
      <div>
        {users.map((user: any) => (
          <p key={user.name}>{user.name}</p>
        ))}
      </div>
      {balls && (
        <>
          <p>Bolas</p>
          {balls?.map((numberOfBall) => (
            <img key={numberOfBall} src={`/images/${numberOfBall}.png`} />
          ))}
        </>
      )}

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
