import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as SplashScreen from "expo-splash-screen"; // Import SplashScreen API
import React, { useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import { IssueProvider } from "./context/IssueContext";
import HomeScreen from "./screens/HomeScreen";
import IssueMapScreen from "./screens/IssueMapScreen";
import LoginScreen from "./screens/LoginScreen";
import EmergencyScreen from "./screens/MyHome";
import RegisterScreen from "./screens/RegisterScreen";
import ReportIssueScreen from "./screens/ReportIssueScreen";
import CommunicationScreen from "./screens/CommunicationScreen";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    const socket = new SockJS('http://192.168.117.193:8080/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
      connectHeaders: {
        username: "guest",
        password: "guest",
      },
      onConnect: () => {
        stompClient.subscribe('/reply/1', (response) => {
          setMessage(JSON.parse(response.body).content);
        });
      },
      onStompError: (frame) => console.error('Broker reported error: ' + frame.body),
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, []);

  return (
    <AuthProvider>
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
              name="Emergency"
              component={EmergencyScreen}
              options={{ title: "Salama alert" ,headerTitleAlign: 'center'}}
            />
            <Stack.Screen
              name="ReportIssue"
              component={ReportIssueScreen}
              options={{ title: "Report an Issue" }}
            />
            <Stack.Screen
              name="Communication"
              component={CommunicationScreen}
            />
            <Stack.Screen
              name="IssueMap"
              component={IssueMapScreen}
              options={{ title: "Issue Map" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        {/* </NotificationProvider> */}
      </IssueProvider>
    </AuthProvider>
  );
}
