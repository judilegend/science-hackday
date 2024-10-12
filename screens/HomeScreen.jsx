// // import React, { useContext, useEffect, useState } from "react";
// // import { View, Button, StyleSheet } from "react-native";
// // import { getIssues } from "../services/database";
// // import { AuthContext } from "../context/AuthContext";

// // const HomeScreen = ({ navigation }) => {
// //   const [issues, setIssues] = useState([]);
// //   const { logout } = useContext(AuthContext);

// //   useEffect(() => {
// //     loadIssues();
// //   }, []);

// //   const loadIssues = async () => {
// //     try {
// //       const loadedIssues = await getIssues();
// //       setIssues(loadedIssues);
// //     } catch (error) {
// //       console.error("Failed to load issues", error);
// //     }
// //   };
// //   const handleViewConsumption = () => {
// //     console.log("Attempting to navigate to Consumption screen");
// //     try {
// //       navigation.navigate("Consumption");
// //     } catch (error) {
// //       console.error("Navigation error:", error);
// //     }
// //   };
// //   return (
// //     <View style={styles.container}>
// //       <Button
// //         title="Report Issue"
// //         onPress={() => navigation.navigate("ReportIssue")}
// //       />
// //       <Button
// //         title="View Issue Map"
// //         onPress={() => navigation.navigate("IssueMap")}
// //       />
// //       {/* <Button
// //         title="View Consumption"
// //         onPress={() => navigation.navigate("Consumption")}
// //       /> */}
// //       <Button title="View Consumption" onPress={handleViewConsumption} />
// //       <Button title="Logout" onPress={logout} />
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     justifyContent: "center",
// //     padding: 20,
// //   },
// // });

// // export default HomeScreen;
// import React, { useContext } from "react";
// import { View, Button, StyleSheet } from "react-native";
// import { AuthContext } from "../context/AuthContext";

// const HomeScreen = ({ navigation }) => {
//   const { user, logout } = useContext(AuthContext);

//   const handleViewConsumption = () => {
//     navigation.navigate("Consumption");
//   };

//   return (
//     <View style={styles.container}>
//       <Button
//         title="Report Issue"
//         onPress={() => navigation.navigate("ReportIssue")}
//       />
//       <Button
//         title="View Issue Map"
//         onPress={() => navigation.navigate("IssueMap")}
//       />
//       <Button title="View Consumption" onPress={handleViewConsumption} />
//         <Button
//           title="JIRAMA Intervention Dashboard"
//           onPress={() => navigation.navigate("JiramaIntervention")}
//         />

//       <Button title="Logout" onPress={logout} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     padding: 20,
//   },
// });

// export default HomeScreen;
import React, { useContext } from "react";
import { View, Button, StyleSheet, FlatList, Text } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { NotificationContext } from "../context/NotificationContext";

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const { notifications } = useContext(NotificationContext);

  const renderNotification = ({ item }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationTitle}>{item.type} Outage Planned</Text>
      <Text>{item.date}</Text>
    </View>
  );

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
