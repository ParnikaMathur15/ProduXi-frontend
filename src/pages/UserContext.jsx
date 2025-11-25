import { createContext, useState, useEffect, useContext } from "react";
import { listenForAuth } from "../authService";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = listenForAuth(setUser); 
    return () => unsubscribe(); 
  }, []);

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
