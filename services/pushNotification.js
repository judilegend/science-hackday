// // import * as Notifications from "expo-notifications";
// // import * as Device from "expo-device";
// // import { Platform } from "react-native";

// // export async function registerForPushNotificationsAsync() {
// //   let token;

// //   if (Constants.isDevice) {
// //     const { status: existingStatus } =
// //       await Notifications.getPermissionsAsync();
// //     let finalStatus = existingStatus;
// //     if (existingStatus !== "granted") {
// //       const { status } = await Notifications.requestPermissionsAsync();
// //       finalStatus = status;
// //     }
// //     if (finalStatus !== "granted") {
// //       alert("Failed to get push token for push notification!");
// //       return;
// //     }
// //     token = (
// //       await Notifications.getExpoPushTokenAsync({
// //         projectId: Constants.manifest.extra.eas.projectId,
// //       })
// //     ).data;
// //   } else {
// //     alert("Must use physical device for Push Notifications");
// //   }

// //   return token;
// // }

// // export async function sendPushNotification(expoPushToken, title, body) {
// //   const message = {
// //     to: expoPushToken,
// //     sound: "default",
// //     title: title,
// //     body: body,
// //     data: { someData: "goes here" },
// //   };

// //   await fetch("https://exp.host/--/api/v2/push/send", {
// //     method: "POST",
// //     headers: {
// //       Accept: "application/json",
// //       "Accept-encoding": "gzip, deflate",
// //       "Content-Type": "application/json",
// //     },
// //     body: JSON.stringify(message),
// //   });
// // }
// // pushNotification.js
// import PushNotification from "react-native-push-notification";
// import { Platform } from "react-native";

// export const configurePushNotifications = () => {
//   PushNotification.configure({
//     onRegister: function (token) {
//       console.log("TOKEN:", token);
//     },
//     onNotification: function (notification) {
//       console.log("NOTIFICATION:", notification);
//     },
//     permissions: {
//       alert: true,
//       badge: true,
//       sound: true,
//     },
//     popInitialNotification: true,
//     requestPermissions: Platform.OS === "ios",
//   });
// };

// export const localNotification = (title, message) => {
//   PushNotification.localNotification({
//     title: title,
//     message: message,
//   });
// };
import PushNotification from "react-native-push-notification";
import { Platform } from "react-native";

export const configurePushNotifications = () => {
  PushNotification.configure({
    onRegister: function (token) {
      console.log("TOKEN:", token);
    },
    onNotification: function (notification) {
      console.log("NOTIFICATION:", notification);
      // Vérifiez ici si l'objet notification et la méthode sont définis
      if (notification && notification.getInitialNotification) {
        notification.getInitialNotification().then((initialNotification) => {
          // Vous pouvez traiter la notification initiale ici
          console.log("Initial Notification:", initialNotification);
        });
      }
    },
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: Platform.OS === "ios",
  });
};

export const localNotification = (title, message) => {
  PushNotification.localNotification({
    title: title,
    message: message,
  });
};
