import React from "react";
import { View, Text, StyleSheet } from "react-native";

const IssueItem = ({ issue }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{issue.title}</Text>
      <Text style={styles.description}>{issue.description}</Text>
      <Text style={styles.type}>{issue.type}</Text>
      <Text style={styles.status}>{issue.status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    marginTop: 5,
  },
  type: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  status: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
});

export default IssueItem;
