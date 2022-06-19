import React, { createContext, useContext, useEffect, useState } from "react";

interface SidebarDrawerProviderProps {
  children: React.ReactNode;
}
interface UserContext {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
}

const UserContext = createContext({} as UserContext);

export function UserContextProvider({ children }: SidebarDrawerProviderProps) {
  const [name, setName] = useState("");
  return (
    <UserContext.Provider value={{ name, setName }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);
