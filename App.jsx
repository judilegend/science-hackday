import React, { useEffect, useState, useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { IssueProvider } from "./context/IssueContext";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import ReportIssueScreen from "./screens/ReportIssueScreen";
import IssueMapScreen from "./screens/IssueMapScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { initDatabase } from "./services/database";
import * as Font from "expo-font"; // Import font loader
import * as SplashScreen from "expo-splash-screen"; // Import SplashScreen API
import { StyleSheet } from "react-native";
import EmergencyScreen from "./screens/MyHome";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();
import CommunicationScreen from "./screens/CommunicationScreen";

const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    
    const initializeApp = async () => {
      try {
        // Initialize the database
        await initDatabase();
        console.log("Database initialized");

        // Load fonts asynchronously
        await Font.loadAsync({
          Poppins_Regular: require("./fonts/Poppins/Poppins-Regular.ttf"),
          Poppins_Bold: require("./fonts/Poppins/Poppins-Bold.ttf"),
        });

        setFontsLoaded(true); // Fonts loaded successfully
      } catch (error) {
        console.error("Initialization failed:", error);
        setFontsLoaded(true); // Ensure the app continues even on error
      }
    };

    initializeApp();
  }, []);

  // Hide the splash screen after the fonts are loaded
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    // Keep the splash screen visible until fonts are loaded
    return null;
  }

  return (
    <AuthProvider>
      <IssueProvider>
        <NavigationContainer onReady={onLayoutRootView}>
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
