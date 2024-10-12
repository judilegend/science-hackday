// import React, { createContext, useState, useEffect, useContext } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import PushNotification from "react-native-push-notification";

// const NotificationContext = createContext();

// export const useNotifications = () => {
//   const context = useContext(NotificationContext);
//   if (!context) {
//     throw new Error(
//       "useNotifications must be used within a NotificationProvider"
//     );
//   }
//   return context;
// };

// export const NotificationProvider = ({ children }) => {
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     configureNotifications();
//     loadStoredNotifications();
//   }, []);

//   const configureNotifications = () => {
//     PushNotification.configure({
//       onNotification: function (notification) {
//         const newNotification = {
//           id: notification.id || Date.now().toString(),
//           message: notification.message,
//           data: notification.data,
//           timestamp: new Date().toISOString(),
//         };
//         addNotification(newNotification);
//       },
//       permissions: {
//         alert: true,
//         badge: true,
//         sound: true,
//       },
//       popInitialNotification: true,
//       requestPermissions: true,
//     });
//   };

//   const loadStoredNotifications = async () => {
//     try {
//       const storedNotifications = await AsyncStorage.getItem("notifications");
//       if (storedNotifications) {
//         setNotifications(JSON.parse(storedNotifications));
//       }
//     } catch (error) {
//       console.error("Error loading notifications:", error);
//     }
//   };

//   const addNotification = async (notification) => {
//     const updatedNotifications = [...notifications, notification];
//     setNotifications(updatedNotifications);
//     try {
//       await AsyncStorage.setItem(
//         "notifications",
//         JSON.stringify(updatedNotifications)
//       );
//     } catch (error) {
//       console.error("Error storing notification:", error);
//     }
//   };

//   const clearNotifications = async () => {
//     setNotifications([]);
//     try {
//       await AsyncStorage.removeItem("notifications");
//     } catch (error) {
//       console.error("Error clearing notifications:", error);
//     }
//   };

//   return (
//     <NotificationContext.Provider
//       value={{ notifications, addNotification, clearNotifications }}
//     >
//       {children}
//     </NotificationContext.Provider>
//   );
// };
// NotificationContext.js
