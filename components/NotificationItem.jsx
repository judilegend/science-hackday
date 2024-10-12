import React from "react";
import { View, Text, StyleSheet } from "react-native";

const NotificationItem = ({ notification }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{notification.title}</Text>
      <Text style={styles.message}>{notification.message}</Text>
      <Text style={styles.date}>
        {new Date(notification.date).toLocaleString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  message: {
    fontSize: 14,
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: "#888",
  },
});

export default NotificationItem;
