import React, { createContext, useContext, useState } from "react";
import { LocalStorage } from "../libraries/storage";

interface IContextProps {
  isAuthenticated: boolean;
  setToken: (value: string) => void;
  setLogout: () => void;
}

const AppContext = createContext<IContextProps>({
  isAuthenticated: false,
  setToken: () => {},
  setLogout: () => {},
});

interface IProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<IProviderProps> = ({ children }) => {
  const localToken: string | null = LocalStorage.getItem("user_token");
  const [token, setTokenState] = useState<string>(localToken || "");

  const setToken = (token: string) => {
    if (!token) {
      LocalStorage.removeItem("user_token");
    } else {
      LocalStorage.setItem("user_token", token);
    }

    setTokenState(token);
  };

  const setLogout = () => {
    setTokenState("");
    LocalStorage.clear();
  };

  const contextPayload = React.useMemo(
    () => ({
      isAuthenticated: !!token,
      setLogout,
      setToken,
    }),
    [token]
  );

  return (
    <AppContext.Provider value={contextPayload}>{children}</AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
