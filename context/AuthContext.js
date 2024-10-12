import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authenticateUser, registerUser } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkStoredUser();
  }, []);

  const checkStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error checking stored user:", error);
    }
  };

  const login = async (username, password) => {
    try {
      const loggedInUser = await authenticateUser(username, password);
      setUser(loggedInUser);
      await AsyncStorage.setItem("user", JSON.stringify(loggedInUser));
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const registeredUser = await registerUser(userData);
      setUser(registeredUser);
      await AsyncStorage.setItem("user", JSON.stringify(registeredUser));
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
