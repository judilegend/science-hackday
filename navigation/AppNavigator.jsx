import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AuthContext } from "../context/AuthContext";
import AuthNavigator from "./AuthNavigator";
import HomeScreen from "../screens/HomeScreen";
import ReportScreen from "../screens/ReportScreen";
import MapScreen from "../screens/MapScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import ConsumptionScreen from "../screens/ConsumptionScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Report" component={ReportScreen} />
    <Tab.Screen name="Map" component={MapScreen} />
    <Tab.Screen name="Notifications" component={NotificationsScreen} />
    <Tab.Screen name="Consumption" component={ConsumptionScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return null; // or a loading screen
  }

  return (
    <Stack.Navigator>
      {user ? (
        <Stack.Screen
          name="Main"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
      ) : (
        <Stack.Screen
          name="Auth"
          component={AuthNavigator}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
