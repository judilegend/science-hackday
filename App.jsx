import React, { useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthProvider } from "./context/AuthContext";
import LoginScreen from "./screens/LoginScreen";
import { IssueProvider } from "./context/IssueContext";
import HomeScreen from "./screens/HomeScreen";
import ReportIssueScreen from "./screens/ReportIssueScreen";
import IssueMapScreen from "./screens/IssueMapScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { initDatabase } from "./services/database";
// ... other imports

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    initDatabase()
      .then(() => console.log("Database initialized"))
      .catch((error) =>
        console.error("Database initialization failed:", error)
      );
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
    </AuthProvider>
  );
}
