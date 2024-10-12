import * as Notifications from "expo-notifications";

export const setupNotifications = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    console.log("Notification permissions not granted");
    return;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
};

export const scheduleNotification = async (title, body, trigger) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger,
  });
};
