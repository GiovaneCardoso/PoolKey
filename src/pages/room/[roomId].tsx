import React, { useEffect, useState } from "react";
import { useUserContext } from "../../contexts/userContext";
import io from "socket.io-client";
import { useRouter } from "next/router";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Text,
  Box,
  Skeleton,
} from "@chakra-ui/react";
import styles from "./room.module.scss";
import NumericStepper from "../../components/molecules/numericStepper/NumericStepper";

let socket: any;
const Room = () => {
  const router = useRouter();

  const { name } = useUserContext();
  const { roomId } = router.query;

  const [users, setUsers] = useState<any[]>([]);
  const [user, setUser] = useState<any>();
  const [killedIndex, setKilledIndex] = useState<number[]>([]);
  const [hide, setHide] = useState(false);
  const [role, setRole] = useState<string>("normal");
  const [balls, setBalls] = useState<number[]>([]);

  useEffect(() => {
    socketInitializer();
    return () => {
      if (socket) {
        socket.disconnect();
        socket.on("disconnect");
      }
    };
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/socket");

    socket = io();
    socket.on("connect", () => {});
    socket.on("users", (users: string[]) => {
      setUsers(users);
    });
    socket.on("balls", (balls: number[]) => {
      setBalls(balls);
    });
    socket.emit("join", { roomId, name });
  };
  useEffect(() => {
    if (users[0]?.name == name) {
      setRole("master");
    }
    const user = users.find((user) => user.name == name);
    if (user) {
      setUser(user);
    }
  }, [users]);

  const startMatch = () => {
    socket.emit("startMatch", { roomId });
  };
  const sendScore = (e: number, name: string) => {
    socket.emit("score", { name, score: e, roomId });
  };
  const killBall = (index: number) => {
    killedIndex.includes(index)
      ? setKilledIndex((oldState) =>
          oldState.filter((ballIndex) => ballIndex != index)
        )
      : setKilledIndex((oldState) => [...oldState, index]);
  };

  return (
    <div className={styles.roomContainer}>
      <div className={styles.userData}>
        <h1>Olá {name}</h1>
        <p>Sala: {roomId}</p>
      </div>
      <div>
        <Accordion allowToggle bg="#737380" color="#fff" mb={8} mt={4}>
          <AccordionItem bg="#737380" color="#fff">
            <AccordionButton
              bg="#737380"
              color="#fff"
              border={0}
              display="flex"
              justifyContent={"space-between"}
            >
              <Box>
                <p>Placar</p>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb="4" color="#fff" p="4">
              {users.map((user: any, index) => (
                <Box
                  key={index}
                  display={"flex"}
                  alignItems="center"
                  justifyContent={"space-between"}
                  p="0"
                >
                  <Text m="0">{user.name}</Text>
                  <NumericStepper
                    sendScore={sendScore}
                    user={user}
                    disabled={role != "master"}
                  />
                </Box>
              ))}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </div>
      {!!balls.length && (
        <div className={styles.balls}>
          <p>Bolas</p>
          <div className={styles.ballsImg}>
            {balls?.map((numberOfBall, index) => (
              <Skeleton width={150} height={150} isLoaded={!hide} key={index}>
                <div className={styles.ballItem}>
                  {killedIndex.includes(index) && (
                    <span
                      onClick={() => killBall(index)}
                      className={styles.killedBall}
                    >
                      X
                    </span>
                  )}
                  <img
                    key={numberOfBall}
                    src={`/images/${numberOfBall}.png`}
                    onClick={() => killBall(index)}
                  />
                </div>
              </Skeleton>
            ))}
          </div>
          <button className={styles.hideBalls} onClick={() => setHide(!hide)}>
            {hide ? "Mostrar" : "Esconder"}
          </button>
        </div>
      )}

      <div className={styles.admin}>
        {role == "master" && (
          <div>
            <p>Você é o administrador da sala</p>

            <button className={styles.startMatch} onClick={startMatch}>
              Começar partida
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Room;
