// screens/EmergencyScreen.js
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Alert, Animated, Platform, SafeAreaView, StyleSheet, Text, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import * as Location from 'expo-location';

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

export default function EmergencyScreen({ navigation }) {
    const { user, logout, token } = useContext(AuthContext);
    const [location, setLocation] = useState(null);
    const ws = useRef(null);

    useEffect(() => {
        getCurrentLocation();

        // Initialize WebSocket connection
        ws.current = new WebSocket('http://192.168.117.193:8080/ws/websocket');

        ws.current.onopen = () => {
            console.log('WebSocket connection established');

            // Listen to messages sent to `/reply/{userId}`
            const subscriptionMessage = JSON.stringify({
                action: 'subscribe',
                topic: `/reply/${user.id}`, // Subscribe to specific topic
            });
            ws.current.send(subscriptionMessage);
            console.log(`Subscribed to /reply/${user.id}`);
        };

        ws.current.onmessage = (event) => {
            console.log('Message received:', event.data);
            setMessage(event.data); // Store the message in state
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.current.onclose = (event) => {
            console.log('WebSocket connection closed:', event.code, event.reason);
        };

        // Clean up the WebSocket connection on component unmount
        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, []);

    const getCurrentLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.error('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation({ latitude: location.latitude, longitude: location.longitude });
        return location;
    };

    const handleEmergencyPress = async () => {
        console.log('Emergency button pressed');
        try {
            const formData = new FormData();

            formData.append("signal", JSON.stringify({
                "typeId": 1,
                "latitude": location.latitude,
                "longitude": location.longitude,
                "description": "Ceci est une urgence maximale",
                "state": "PENDING",
                "userId": user.id
            }));

            formData.append("assets", []);

            const res = await axios.post("http://192.168.117.193:8080/api/signal", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + token,
                },
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleNotificationPress = () => {
        console.log('Notification button pressed');
        // Add your notification action here
    };

    const handleHomePress = () => {
        console.log('Home button pressed');
        // Add your home action here
    };

    const handleProfilePress = () => {
        navigation.navigate('IssueMap');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.emergencyCard}>
                <View style={styles.locationHeader}>
                    <MaterialIcons name="location-on" size={24} color="#f23846" />
                    <Text style={styles.locationText}>{user.username}</Text>
                    <TouchableOpacity>
                        <MaterialIcons name="info" size={24} color="#f23846" />
                    </TouchableOpacity>
                </View>
                <RippleButton onPress={handleEmergencyPress} style={styles.alarmButton}>
                    <MaterialIcons name="alarm" size={48} color="white" />
                </RippleButton>
                <Text style={styles.emergencyText}>Tap in case of emergency</Text>
                <Text style={styles.drillText}>Emergency Drill</Text>
                <View style={styles.servicesContainer}>
                    <TouchableOpacity style={styles.serviceButton}>
                        <FontAwesome5 name="briefcase-medical" size={24} color="#f23846" />
                        <Text style={styles.serviceText}>Medical</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.serviceButton}>
                        <FontAwesome5 name="fire" size={24} color="#f23846" />
                        <Text style={styles.serviceText}>Fire Force</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.serviceButton}>
                        <FontAwesome5 name="ambulance" size={24} color="#f23846" />
                        <Text style={styles.serviceText}>Medical</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.serviceButton}>
                        <FontAwesome5 name="shield-alt" size={24} color="#f23846" />
                        <Text style={styles.serviceText}>Cops</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.bottomIconsContainer}>
                <TouchableOpacity onPress={handleNotificationPress}>
                    <MaterialIcons name="notifications" size={24} color="#f23846" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleHomePress}>
                    <MaterialIcons name="home" size={24} color="#f23846" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleProfilePress}>
                    <MaterialIcons name="map" size={24} color="#f23846" />
                </TouchableOpacity>
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
