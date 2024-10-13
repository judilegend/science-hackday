// screens/EmergencyScreen.js
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Animated, Platform, SafeAreaView, StyleSheet, Text, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

    if (Platform.OS === 'android') {
        return (
            <TouchableNativeFeedback
                onPress={() => {
                    onPress();
                    animateScale();
                }}
                background={TouchableNativeFeedback.Ripple('#7E57C2', true)}
            >
                <Animated.View style={[style, { transform: [{ scale }] }]}>
                    {children}
                </Animated.View>
            </TouchableNativeFeedback>
        );
    }

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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between', // Ensures space is distributed
    },
    emergencyCard: {
        backgroundColor: 'white',
        padding: 20,
        margin: 0,
        alignItems: 'center',
        flex: 1,
    },
    locationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    locationText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    alarmButton: {
        backgroundColor: '#f23846',
        borderRadius: 50,
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 50,
        overflow: 'hidden', // This is important for the Android ripple effect
    },
    emergencyText: {
        fontSize: 16,
        color: '#888',
        marginBottom: 5,
    },
    drillText: {
        fontSize: 14,
        color: '#f23846',
        marginBottom: 20,
    },
    servicesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
    },
    serviceButton: {
        alignItems: 'center',
        width: '48%',
        backgroundColor: '#FFF0F0',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    serviceText: {
        marginTop: 5,
        color: '#f23846',
    },
    bottomIconsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around', // Space out the icons evenly
        paddingVertical: 10, // Add some padding to the bottom
    },
    profileIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#f23846',
    },
});
