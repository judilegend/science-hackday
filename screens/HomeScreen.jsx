import React, { useContext } from "react";
import { View, Button, StyleSheet, FlatList, Text } from "react-native";
import { AuthContext } from "../context/AuthContext";
const HomeScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <>
            <Button
              title="Report Issue"
              onPress={() => navigation.navigate("ReportIssue")}
            />
            <Button
              title="View Issue Map"
              onPress={() => navigation.navigate("IssueMap")}
            />
            <Button
              title="View Consumption"
              onPress={() => navigation.navigate("Consumption")}
            />
            {/* {user && user.role === "jirama" && ( */}
            <Button
              title="JIRAMA Intervention Dashboard"
              onPress={() => navigation.navigate("JiramaIntervention")}
            />
            {/* )} */}
            <Button title="Logout" onPress={logout} />
          </>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  notificationItem: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  notificationTitle: {
    fontWeight: "bold",
  },
});

export default HomeScreen;
