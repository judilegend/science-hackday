import React, { useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthProvider } from "./context/AuthContext";
import LoginScreen from "./screens/LoginScreen";
import { IssueProvider } from "./context/IssueContext";
import HomeScreen from "./screens/HomeScreen";
import ReportIssueScreen from "./screens/ReportIssueScreen";
import IssueMapScreen from "./screens/IssueMapScreen";
import ConsumptionScreen from "./screens/ConsumptionScreen";
import * as Notifications from "expo-notifications";
import RegisterScreen from "./screens/RegisterScreen";
import { initDatabase } from "./services/database";
import JiramaInterventionScreen from "./screens/JiramaInterventionScreen";
import { setupNotifications } from "./services/notifications";
import CreateOutageAlertScreen from "./screens/CreateOutageAlert";
import { NotificationProvider } from "./context/NotificationContext";
import {
  registerForPushNotificationsAsync,
  sendPushNotification,
} from "./services/pushNotification";
import { getOutageAlerts } from "./services/database";
// ... other imports

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Stack = createStackNavigator();

export default function App() {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    initDatabase()
      .then(() => console.log("Database initialized"))
      .catch((error) =>
        console.error("Database initialization failed:", error)
      );
    setupNotifications();
    registerForPushNotificationsAsync().then((token) => console.log(token));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        // Handle received notification
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // Handle notification response
      });

    const checkForNewAlerts = async () => {
      const alerts = await getOutageAlerts();
      // In a real app, you'd compare this with previously fetched alerts
      // and only send notifications for new ones
      alerts.forEach((alert) => {
        sendPushNotification(
          "YOUR_EXPO_PUSH_TOKEN", // You'd store and use individual user tokens in a real app
          `${
            alert.type.charAt(0).toUpperCase() + alert.type.slice(1)
          } Outage Alert`,
          `Outage scheduled from ${new Date(
            alert.start_date
          ).toLocaleString()} to ${new Date(alert.end_date).toLocaleString()}`
        );
      });
    };

    // Check for new alerts every 5 minutes
    const intervalId = setInterval(checkForNewAlerts, 5 * 60 * 1000);

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <AuthProvider>
      <NotificationProvider>
        <IssueProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen name="Register" component={RegisterScreen} />

              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: "EnerWatt Madagascar" }}
              />
              <Stack.Screen
                name="ReportIssue"
                component={ReportIssueScreen}
                options={{ title: "Report an Issue" }}
              />
              <Stack.Screen
                name="IssueMap"
                component={IssueMapScreen}
                options={{ title: "Issue Map" }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </IssueProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
