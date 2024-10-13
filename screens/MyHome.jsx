import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import NetInfo from '@react-native-community/netinfo';

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
      activeOpacity={0.8}
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

  const handleLogout = () => {
    logout();
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Salama Alert</Text>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <MaterialIcons name="logout" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.emergencyCard}>
            <Text style={styles.emergencyTitle}>Services d'urgence</Text>
            <RippleButton onPress={handleEmergencyPress} style={styles.alarmButton}>
              <FontAwesome5 name="exclamation-triangle" size={50} color="#fff" />
            </RippleButton>
            <Text style={styles.emergencyText}>Appuyez en cas d'urgence</Text>
          </View>

          <View style={styles.servicesContainer}>
            {[
              { icon: 'briefcase-medical', text: 'Médical' },
              { icon: 'fire', text: 'Pompiers' },
              { icon: 'ambulance', text: 'Ambulance' },
              { icon: 'shield-alt', text: 'Police' },
            ].map((service, index) => (
              <TouchableOpacity key={index} style={styles.serviceButton}>
                <FontAwesome5 name={service.icon} size={24} color="#3b5998" />
                <Text style={styles.serviceText}>{service.text}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <RippleButton onPress={handleEmergencyPress} style={styles.emergencySMSButton}>
            <MaterialIcons name="sms" size={24} color="white" />
            <Text style={styles.emergencySMSText}>SMS d'urgence</Text>
          </RippleButton>

          {isOffline && (
            <View style={styles.offlineBar}>
              <Text style={styles.offlineText}>Vous êtes hors ligne</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    padding: 10,
  },
  emergencyCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  emergencyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3b5998',
    marginBottom: 20,
  },
  alarmButton: {
    backgroundColor: '#f23846',
    borderRadius: 50,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  emergencyText: {
    fontSize: 16,
    color: '#3b5998',
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  serviceButton: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  serviceText: {
    color: '#3b5998',
    marginTop: 10,
    fontWeight: '600',
  },
  emergencySMSButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  emergencySMSText: {
    color: 'white',
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
  offlineBar: {
    backgroundColor: '#ff9800',
    padding: 10,
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  offlineText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
