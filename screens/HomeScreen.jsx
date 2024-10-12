import React, { useContext } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import Icon from "react-native-vector-icons/MaterialIcons";

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Bienvenue, {user.username}!</Text>
        {/* Add your main content here */}
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.barButton}
          onPress={() => navigation.navigate("ReportIssue")}
        >
          <Icon name="report-problem" size={24} color="#007AFF" />
          <Text style={styles.barButtonText}>Signaler</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.barButton}
          onPress={() => navigation.navigate("IssueMap")}
        >
          <Icon name="map" size={24} color="#007AFF" />
   <Text style={styles.barButtonText}>Carte</Text>
        </TouchableOpacity>
{/* 
        <TouchableOpacity
          style={styles.barButton}
          onPress={() => navigation.navigate("Profile")}
        >
          <Icon name="person" size={24} color="#007AFF" />
          <Text style={styles.barButtonText}>Profil</Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.barButton} onPress={logout}>
          <Icon name="exit-to-app" size={24} color="#007AFF" />
          <Text style={styles.barButtonText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  barButton: {
    alignItems: "center",
  },
  barButtonText: {
    marginTop: 5,
    fontSize: 12,
    color: "#007AFF",
  },
});

export default HomeScreen;
