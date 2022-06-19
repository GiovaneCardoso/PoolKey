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
  Switch,
} from "@chakra-ui/react";
import styles from "./room.module.scss";
import NumericStepper from "../../components/molecules/numericStepper/NumericStepper";
import Head from "next/head";

let socket: any;

export interface User {
  name: string;
  id: string;
  roomId: string;
  score: number;
}

const Room = () => {
  const router = useRouter();

  const { name } = useUserContext();
  const { roomId } = router.query;

  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User>();
  const [winner, setWinner] = useState<User | "">();
  const [killedIndex, setKilledIndex] = useState<number[]>([]);
  const [hide, setHide] = useState(false);
  const [role, setRole] = useState<string>("normal");
  const [balls, setBalls] = useState<number[]>([]);
  const [ballsToSort, setBallsToSort] = useState(3);

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
    socket.on("users", (users: User[]) => {
      setUsers(users);
    });
    socket.on("balls", (balls: number[]) => {
      setBalls(balls);
    });
    socket.on("endMatch", (winner: any) => {
      setWinner(winner);
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
    setWinner("");
    socket.emit("startMatch", { roomId, ballsToSort });
  };
  const endMatch = () => {
    const confirm = window.confirm("Tem certeza que quer terminar a partida?");
    if (confirm) {
      socket.emit("endMatch", { roomId });
    }
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
  const changeBalls = () => {
    ballsToSort == 3 ? setBallsToSort(5) : setBallsToSort(3);
  };

  return (
    <div className={styles.roomContainer}>
      <Head>
        <title>PoolKey</title>
        <meta
          name="description"
          content="An app created to manage snook games"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.userData}>
        <h1>Olá {name}</h1>
        <p>Sala: {roomId}</p>
      </div>
      {!winner ? (
        <>
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
                  <Skeleton
                    width={[75, 150]}
                    height={[75, 150]}
                    isLoaded={!hide}
                    key={index}
                  >
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
              <button
                className={styles.hideBalls}
                onClick={() => setHide(!hide)}
              >
                {hide ? "Mostrar" : "Esconder"}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className={styles.winner}>
          <h2>
            Vencedor:{winner.name}, com o placar de:{winner.score}
          </h2>
        </div>
      )}

      <div className={styles.admin}>
        {role == "master" && (
          <div>
            <h2>Você é o administrador da sala</h2>

            <div className={styles.ballsSelect}>
              <p>Quantidade de bolas para sorteio</p>
              <div>
                <span>3</span>
                <Switch
                  onChange={() => changeBalls()}
                  isChecked={ballsToSort == 5}
                  margin="0 10px"
                  size={"lg"}
                />
                <span>5</span>
              </div>
            </div>
            <button className={styles.startMatch} onClick={startMatch}>
              Começar partida
            </button>
            {!winner && (
              <button className={styles.startMatch} onClick={endMatch}>
                Finalizar partida
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Room;
