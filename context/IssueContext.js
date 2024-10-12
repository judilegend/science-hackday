import React, { createContext, useState, useContext } from "react";
import { addIssue as addIssueToDb } from "../services/database";
import { AuthContext } from "./AuthContext";

export const IssueContext = createContext();

export const IssueProvider = ({ children }) => {
  const [issues, setIssues] = useState([]);
  const { user } = useContext(AuthContext);

  const addIssue = async (title, description, type, latitude, longitude) => {
    try {
      const newIssueId = await addIssueToDb(
        title,
        description,
        type,
        latitude,
        longitude,
        user.id
      );
      const newIssue = {
        id: newIssueId,
        title,
        description,
        type,
        latitude,
        longitude,
        user_id: user.id,
      };
      setIssues((prevIssues) => [...prevIssues, newIssue]);
      return newIssue;
    } catch (error) {
      console.error("Error adding issue:", error);
      throw error;
    }
  };

  return (
    <IssueContext.Provider value={{ issues, addIssue }}>
      {children}
    </IssueContext.Provider>
  );
};
