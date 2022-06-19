import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { useUserContext } from "../contexts/userContext";
import styles from "./home.module.scss";

export default function Home() {
  const router = useRouter();
  const { name, setName } = useUserContext();
  const [room, setRoom] = useState("");
  const handleSubmitForm = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !room) {
      return;
    }
    setTimeout(() => {
      router.push(`/room/${room}`);
    }, 1000);
  };

  return (
    <div className={styles.homeContainer}>
      <Head>
        <title>PoolKey</title>
        <meta
          name="description"
          content="An app created to manage snook games"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Poolkey</h1>

      <div>
        <form onSubmit={(e) => handleSubmitForm(e)}>
          <label className={styles.inputLabel} htmlFor="name">
            Digite seu nome
          </label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Seu nome"
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
          />
          <label className={styles.inputLabel} htmlFor="room">
            Digite o ID da sala
          </label>
          <input
            placeholder="ID da sala"
            type="text"
            name="room"
            id="room"
            onChange={(e) => setRoom(e.target.value)}
            className={styles.input}
          />
          <input
            className={styles.submitButton}
            type="submit"
            value="Entrar na sala"
          />
        </form>
      </div>
    </div>
  );
}
