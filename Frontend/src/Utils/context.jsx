import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { decrypt } from "./utils";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const signedIn = Cookies.get("user");
    if (signedIn) {
      const decryptedUser = decrypt(); // you can pass token if needed
      setCurrentUser(decryptedUser);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
