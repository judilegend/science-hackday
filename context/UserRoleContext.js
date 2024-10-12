import React, { createContext, useState, useEffect } from "react";
import { auth } from "../config/firebase";
import { getUserRole } from "../services/api";

export const UserRoleContext = createContext();

export const UserRoleProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const role = await getUserRole(user.uid);
        setUserRole(role);
      } else {
        setUserRole(null);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <UserRoleContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </UserRoleContext.Provider>
  );
};
