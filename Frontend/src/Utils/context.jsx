import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { decrypt } from "./utils";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to get current user data from cookies
  const fetchCurrentUser = () => {
    setLoading(true);
    const signedIn = Cookies.get("user");
    if (signedIn) {
      const decryptedUser = decrypt(); // you can pass token if needed
      setCurrentUser(decryptedUser);
    } else {
      setCurrentUser(null);
    }
    setLoading(false);
  };

  // Function to refresh user data (call this after login/signup)
  const refreshUser = () => {
    return new Promise((resolve) => {
      // Re-fetch user data from cookies
      const signedIn = Cookies.get("user");
      if (signedIn) {
        const decryptedUser = decrypt();
        setCurrentUser(decryptedUser);
        resolve(decryptedUser);
      } else {
        setCurrentUser(null);
        resolve(null);
      }
    });
  };

  // Initial user fetch
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const value = {
    currentUser,
    setCurrentUser,
    loading,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);