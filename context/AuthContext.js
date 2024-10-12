import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authenticateUser, registerUser } from "../services/api";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

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
      const res = await axios.post(
        "http://192.168.131.193:8080/api/user/authenticate",
        { username, password }, // Automatically converted to JSON
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.data.success) {
        setUser(res.data.user);
        setToken(res.data.token);
        console.log(res.data.token);
        await AsyncStorage.setItem("user", JSON.stringify(res.data.user));
      }
      return res.data
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const res = await axios.post(
        "http://192.168.131.193:8080/api/user/create",
        userData, // Automatically converted to JSON
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.data.success) {
        setUser(res.data.data);
        await AsyncStorage.setItem("user", JSON.stringify(res.data.data));
      }
      return res.data
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register , token }}>
      {children}
    </AuthContext.Provider>
  );
};
