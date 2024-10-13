import axios from "axios";

const API_BASE_URL = "http://192.168.117.193:8080/api";

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
    const response = await api.post("/user/create", userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};
export const reportEmergency = async (latitude, longitude) => {
  try {
    const response = await api.post("/emergency/report", {
      latitude,
      longitude,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to report emergency"
    );
  }
};
export const reportIssue = async (title, description, latitude, longitude) => {
  try {
    const response = await api.post("/issues/report", {
      title,
      description,
      latitude,
      longitude,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to report issue");
  }
};
