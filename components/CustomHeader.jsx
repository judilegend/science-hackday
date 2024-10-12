import React from "react";
import { View, Text, StyleSheet } from "react-native";

const CustomHeader = ({ title }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#007AFF",
    padding: 15,
    alignItems: "center",
  },
  headerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CustomHeader;
