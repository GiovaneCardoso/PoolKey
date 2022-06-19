import "../../styles/globals.css";
import type { AppProps } from "next/app";
import { UserContextProvider } from "../contexts/userContext";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../../styles/theme";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <UserContextProvider>
        <Component {...pageProps} />
      </UserContextProvider>
    </ChakraProvider>
  );
}

export default MyApp;
