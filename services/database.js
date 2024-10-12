// import * as SQLite from "expo-sqlite";

// const db = SQLite.openDatabase("EnerWattMadagascar.db");

// export const initDatabase = () => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT, role TEXT)",
//         []
//       );
//       tx.executeSql(
//         "CREATE TABLE IF NOT EXISTS issues (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, type TEXT, status TEXT, latitude REAL, longitude REAL, user_id INTEGER, FOREIGN KEY(user_id) REFERENCES users(id))",
//         []
//       );
//       tx.executeSql(
//         "CREATE TABLE IF NOT EXISTS consumption (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, type TEXT, value REAL, date TEXT, FOREIGN KEY(user_id) REFERENCES users(id))",
//         []
//       );
//       tx.executeSql(
//         "INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)",
//         ["admin", "admin123", "admin"]
//       );
//       tx.executeSql(
//         "INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)",
//         ["user", "user123", "user"],
//         () => resolve(),
//         (_, error) => reject(error)
//       );
//     });
//   });
// };

// export const loginUser = (username, password) => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "SELECT * FROM users WHERE username = ? AND password = ?",
//         [username, password],
//         (_, { rows }) => {
//           if (rows.length > 0) {
//             resolve(rows._array[0]);
//           } else {
//             reject(new Error("Invalid credentials"));
//           }
//         },
//         (_, error) => reject(error)
//       );
//     });
//   });
// };

// export const registerUser = (username, password, role = "user") => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
//         [username, password, role],
//         (_, { insertId }) => {
//           resolve({ id: insertId, username, role });
//         },
//         (_, error) => {
//           if (error.message.includes("UNIQUE constraint failed")) {
//             reject(new Error("Username already exists"));
//           } else {
//             reject(error);
//           }
//         }
//       );
//     });
//   });
// };
// export const getIssues = () => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "SELECT * FROM issues",
//         [],
//         (_, { rows }) => resolve(rows._array),
//         (_, error) => reject(error)
//       );
//     });
//   });
// };
// export const addIssue = (
//   title,
//   description,
//   type,
//   latitude,
//   longitude,
//   userId
// ) => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "INSERT INTO issues (title, description, type, status, latitude, longitude, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
//         [title, description, type, "pending", latitude, longitude, userId],
//         (_, { insertId }) => resolve(insertId),
//         (_, error) => reject(error)
//       );
//     });
//   });
// };

// export const addConsumptionData = (userId, type, value, date) => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "INSERT INTO consumption (user_id, type, value, date) VALUES (?, ?, ?, ?)",
//         [userId, type, value, date],
//         (_, { insertId }) => resolve(insertId),
//         (_, error) => reject(error)
//       );
//     });
//   });
// };
// export const getConsumptionData = (userId) => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "SELECT * FROM consumption WHERE user_id = ?",
//         [userId],
//         (_, { rows }) => {
//           const data = rows._array;
//           const water = data.filter((item) => item.type === "water");
//           const electricity = data.filter(
//             (item) => item.type === "electricity"
//           );
//           resolve({ water, electricity });
//         },
//         (_, error) => reject(error)
//       );
//     });
//   });
// };
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("EnerWattMadagascar.db");

export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT, role TEXT)",
        []
      );
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS issues (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, type TEXT, status TEXT, latitude REAL, longitude REAL, user_id INTEGER, FOREIGN KEY(user_id) REFERENCES users(id))",
        []
      );
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS consumption (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, type TEXT, value REAL, date TEXT, FOREIGN KEY(user_id) REFERENCES users(id))",
        []
      );
      tx.executeSql(
        "INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)",
        ["admin", "admin123", "admin"]
      );
      tx.executeSql(
        "INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)",
        ["user", "user123", "user"]
      );
      tx.executeSql(
        "INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)",
        ["jirama", "jirama123", "jirama"],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};

export const loginUser = (username, password) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM users WHERE username = ? AND password = ?",
        [username, password],
        (_, { rows }) => {
          if (rows.length > 0) {
            resolve(rows._array[0]);
          } else {
            reject(new Error("Invalid credentials"));
          }
        },
        (_, error) => reject(error)
      );
    });
  });
};

export const registerUser = (username, password, role = "user") => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
        [username, password, role],
        (_, { insertId }) => {
          resolve({ id: insertId, username, role });
        },
        (_, error) => {
          if (error.message.includes("UNIQUE constraint failed")) {
            reject(new Error("Username already exists"));
          } else {
            reject(error);
          }
        }
      );
    });
  });
};

export const getIssues = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM issues",
        [],
        (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error)
      );
    });
  });
};

export const addIssue = (
  title,
  description,
  type,
  latitude,
  longitude,
  userId
) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO issues (title, description, type, status, latitude, longitude, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [title, description, type, "pending", latitude, longitude, userId],
        (_, { insertId }) => resolve(insertId),
        (_, error) => reject(error)
      );
    });
  });
};

export const updateIssueStatus = (issueId, newStatus) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE issues SET status = ? WHERE id = ?",
        [newStatus, issueId],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            resolve();
          } else {
            reject(new Error("No issue found with the given ID"));
          }
        },
        (_, error) => reject(error)
      );
    });
  });
};

export const getConsumptionData = (userId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM consumption WHERE user_id = ?",
        [userId],
        (_, { rows }) => {
          const data = rows._array;
          const water = data.filter((item) => item.type === "water");
          const electricity = data.filter(
            (item) => item.type === "electricity"
          );
          resolve({ water, electricity });
        },
        (_, error) => reject(error)
      );
    });
  });
};

export const addConsumptionData = (userId, type, value, date) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO consumption (user_id, type, value, date) VALUES (?, ?, ?, ?)",
        [userId, type, value, date],
        (_, { insertId }) => resolve(insertId),
        (_, error) => reject(error)
      );
    });
  });
};
export const getPlannedOutages = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM planned_outages",
        [],
        (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error)
      );
    });
  });
};
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
            {user && user.role === "jirama" && (
              <Button
                title="JIRAMA Intervention Dashboard"
                onPress={() => navigation.navigate("JiramaIntervention")}
              />
            )}
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
