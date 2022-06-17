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
  useNumberInput,
  HStack,
  Input,
  Button,
} from "@chakra-ui/react";
import styles from "./room.module.scss";

let socket: any;
const Room = () => {
  const router = useRouter();

  const { name } = useUserContext();
  const { roomId } = router.query;

  const [users, setUsers] = useState<any[]>([]);
  const [user, setUser] = useState<any>();
  const [role, setRole] = useState<string>("normal");
  const [balls, setBalls] = useState<number[]>([]);

  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      defaultValue: user?.score || 0,
      min: 0,
    });
  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();
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
    const user = users.find((user) => user.name == name);
    if (user) {
      setUser(user);
    }
  }, [users]);

  const startMatch = () => {
    socket.emit("startMatch");
  };
  const sendScore = (e: string, name: string) => {
    socket.emit("score", { name, score: parseInt(e), roomId });
  };

  return (
    <div className={styles.roomContainer}>
      <div className={styles.userData}>
        <h1>Olá {name}</h1>
        <p>Sala: {roomId}</p>
      </div>
      <div>
        <Accordion allowToggle bg="#737380" color="#fff">
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
              {users.map((user: any) => (
                <Box
                  display={"flex"}
                  alignItems="center"
                  justifyContent={"space-between"}
                  p="8"
                >
                  <Text m="0">{user.name}</Text>
                  <HStack maxW="320px">
                    <Button {...dec} border="none" py="8" px="12">
                      -
                    </Button>
                    <Input
                      {...input}
                      maxWidth="50px"
                      textAlign={"center"}
                      p="7"
                      onChange={(e) => {
                        sendScore(e.target.value, user.name);
                      }}
                    />
                    <Button {...inc} border="none" py="8" px="12">
                      +
                    </Button>
                  </HStack>
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
            {balls?.map((numberOfBall) => (
              <img key={numberOfBall} src={`/images/${numberOfBall}.png`} />
            ))}
          </div>
        </div>
      )}

      <div>
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
