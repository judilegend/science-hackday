import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Platform,
  StatusBar,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useAuth } from "../hooks/useAuth";
import NetInfo from "@react-native-community/netinfo";
import { Linking } from "react-native";

const RippleButton = ({ onPress, style, children }) => {
  const [scale] = useState(new Animated.Value(1));

  const animateScale = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <TouchableOpacity
      onPress={() => {
        onPress();
        animateScale();
      }}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function MyHome({ navigation }) {
  const [isOffline, setIsOffline] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  const handleEmergencyPress = () => {
    navigation.navigate("IssueMap");
  };

  const handleEmergencySMS = async () => {
    const emergencyNumber = "0388282657";
    const message = "Emergency: Need immediate assistance";

    const url = Platform.select({
      ios: `sms:${emergencyNumber}&body=${encodeURIComponent(message)}`,
      android: `sms:${emergencyNumber}?body=${encodeURIComponent(message)}`,
    });

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "Unable to open SMS app");
      }
    } catch (error) {
      console.error("Error opening SMS app:", error);
      Alert.alert("Error", "Failed to send SMS");
    }
  };

  const handleLogout = () => {
    logout();
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["#4c669f", "#3b5998", "#192f6a"]}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Salama Alert</Text>
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.logoutButton}
            >
              <MaterialIcons name="logout" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.emergencyCard}>
            <Text style={styles.emergencyTitle}>Emergency Services</Text>
            <RippleButton
              onPress={handleEmergencyPress}
              style={styles.alarmButton}
            >
              <RippleButton
                onPress={handleEmergencyPress}
                style={styles.alarmButton}
              >
                <FontAwesome5
                  name="exclamation-triangle"
                  size={50}
                  color="#fff"
                />
              </RippleButton>
            </RippleButton>
            <Text style={styles.emergencyText}>Tap in case of emergency</Text>
          </View>

          <View style={styles.servicesContainer}>
            <TouchableOpacity style={styles.serviceButton}>
              <FontAwesome5 name="briefcase-medical" size={24} color="#fff" />
              <Text style={styles.serviceText}>Medical</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.serviceButton}>
              <FontAwesome5 name="fire" size={24} color="#fff" />
              <Text style={styles.serviceText}>Fire Force</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.serviceButton}>
              <FontAwesome5 name="ambulance" size={24} color="#fff" />
              <Text style={styles.serviceText}>Ambulance</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.serviceButton}>
              <FontAwesome5 name="shield-alt" size={24} color="#fff" />
              <Text style={styles.serviceText}>Police</Text>
            </TouchableOpacity>
          </View>

          <RippleButton
            onPress={handleEmergencySMS}
            style={styles.emergencySMSButton}
          >
            <MaterialIcons name="sms" size={24} color="white" />
            <Text style={styles.emergencySMSText}>Emergency SMS</Text>
          </RippleButton>

          {isOffline && (
            <View style={styles.offlineBar}>
              <Text style={styles.offlineText}>You are offline</Text>
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  logoutButton: {
    padding: 10,
  },
  emergencyCard: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    marginBottom: 30,
  },
  emergencyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  alarmButton: {
    backgroundColor: "#f23846",
    borderRadius: 50,
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emergencyText: {
    fontSize: 16,
    color: "#fff",
  },
  servicesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  serviceButton: {
    width: "48%",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginBottom: 15,
  },
  serviceText: {
    color: "#fff",
    marginTop: 10,
  },
  emergencySMSButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  emergencySMSText: {
    color: "white",
    marginLeft: 10,
    fontWeight: "bold",
  },
  offlineBar: {
    backgroundColor: "#ff9800",
    padding: 10,
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  offlineText: {
    color: "#fff",
  },
});
