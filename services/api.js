import axios from "axios";

const API_BASE_URL = "http://192.168.131.193:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authenticateUser = async (username, password) => {
  try {
    const response = await api.post("/user/authenticate", {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Authentication failed");
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post("/user/authenticate", userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};
