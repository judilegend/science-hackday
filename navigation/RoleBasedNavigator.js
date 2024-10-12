import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { USER_ROLES } from "../utils/constants";
import HomeScreen from "../screens/HomeScreen";
import ReportScreen from "../screens/ReportScreen";
import MapScreen from "../screens/MapScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import ConsumptionScreen from "../screens/ConsumptionScreen";
import ProfileScreen from "../screens/ProfileScreen";
import JiramaInterventionScreen from "../screens/JiramaInterventionScreen";
import BusinessAnalyticsScreen from "../screens/BusinessAnalyticsScreen";
import WeatherForecastScreen from "../screens/WeatherForecastScreen";
import EnergyProviderScreen from "../screens/EnergyProviderScreen";

const Tab = createBottomTabNavigator();

const RoleBasedNavigator = ({ userRole }) => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Report" component={ReportScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Consumption" component={ConsumptionScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />

      {userRole === USER_ROLES.JIRAMA && (
        <Tab.Screen name="Interventions" component={JiramaInterventionScreen} />
      )}

      {userRole === USER_ROLES.BUSINESS && (
        <Tab.Screen name="Analytics" component={BusinessAnalyticsScreen} />
      )}

      {userRole === USER_ROLES.METEOROLOGIST && (
        <Tab.Screen name="Weather" component={WeatherForecastScreen} />
      )}

      {userRole === USER_ROLES.ENERGY_PROVIDER && (
        <Tab.Screen name="EnergyProvider" component={EnergyProviderScreen} />
      )}
    </Tab.Navigator>
  );
};

export default RoleBasedNavigator;
