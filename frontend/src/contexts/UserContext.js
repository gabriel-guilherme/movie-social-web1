// src/contexts/UserContext.jsx
import { createContext, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ value, children }) => {
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUserContext = () => useContext(UserContext);
