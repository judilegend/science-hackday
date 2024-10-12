import React, { createContext, useState, useEffect } from "react";
import { scheduleLocalNotification } from "../services/notifications";
import { getPlannedOutages } from "../services/database";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchPlannedOutages = async () => {
      const outages = await getPlannedOutages();
      outages.forEach((outage) => {
        scheduleLocalNotification(
          "Planned Outage",
          `A ${outage.type} outage is planned for ${outage.date}`,
          { seconds: 5 } // For testing, replace with actual scheduling logic
        );
        setNotifications((prev) => [...prev, outage]);
      });
    };

    fetchPlannedOutages();
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
