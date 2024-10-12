import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { getNotifications } from "../services/api";

const NotificationItem = ({ item }) => (
  <View style={styles.notificationItem}>
    <Text style={styles.notificationTitle}>{item.title}</Text>
    <Text style={styles.notificationBody}>{item.body}</Text>
    <Text style={styles.notificationDate}>
      {new Date(item.createdAt).toLocaleString()}
    </Text>
  </View>
);

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const fetchedNotifications = await getNotifications();
        setNotifications(fetchedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={notifications}
        renderItem={({ item }) => <NotificationItem item={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  notificationItem: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  notificationBody: {
    fontSize: 16,
    marginBottom: 5,
  },
  notificationDate: {
    fontSize: 12,
    color: "#666",
  },
});

export default NotificationsScreen;
