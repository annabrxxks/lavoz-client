import { createContext, useEffect, useState } from "react";
import { makeRequest } from "../axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  
  const login = async (inputs) => {
    
    const res = await makeRequest.post("/auth/login", inputs, {
      withCredentials: true,
    });

    setCurrentUser(res.data)
  };

  const updateUser = (userData) => {
    setCurrentUser(userData);
  };

  const clearUser = () => {
    localStorage.removeItem("user");
  }

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, updateUser, clearUser, login }}>
      {children}
    </AuthContext.Provider>
  );
};