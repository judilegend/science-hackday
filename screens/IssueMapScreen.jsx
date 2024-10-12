// import React, { useEffect, useState } from "react";
// import { View, StyleSheet } from "react-native";
// import MapView, { Marker } from "react-native-maps";
// import { getIssues } from "../services/database";

// const IssueMapScreen = () => {
//   const [issues, setIssues] = useState([]);

//   useEffect(() => {
//     loadIssues();
//   }, []);

//   const loadIssues = async () => {
//     try {
//       const loadedIssues = await getIssues();
//       setIssues(loadedIssues);
//     } catch (error) {
//       console.error("Failed to load issues", error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <MapView
//         style={styles.map}
//         initialRegion={{
//           latitude: -18.8792,
//           longitude: 47.5079,
//           latitudeDelta: 0.0922,
//           longitudeDelta: 0.0421,
//         }}
//       >
//         {issues.map((issue) => (
//           <Marker
//             key={issue.id}
//             coordinate={{
//               latitude: issue.latitude,
//               longitude: issue.longitude,
//             }}
//             title={issue.title}
//             description={issue.description}
//           />
//         ))}
//       </MapView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     width: "100%",
//     height: "100%",
//   },
// });

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  Modal,
  TextInput,
} from "react-native";

import MapView, { Marker, Circle, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { MAP_INITIAL_REGION } from "../utils/constants";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getDistance } from "geolib";

// Simulated data
const MOCK_ISSUES = [
  {
    id: 1,
    title: "Panne électrique",
    description: "Coupure de courant dans le quartier",
    latitude: -18.8792,
    longitude: 47.5079,
  },
  {
    id: 2,
    title: "Fuite d'eau",
    description: "Fuite importante sur la rue principale",
    latitude: -18.88,
    longitude: 47.51,
  },
];

// Simulons une liste d'hôpitaux
const HOSPITALS = [
  { id: 1, name: "Hôpital Central", latitude: -18.8792, longitude: 47.5079 },
  { id: 2, name: "Clinique St. Paul", latitude: -18.88, longitude: 47.51 },
  // Ajoutez d'autres hôpitaux ici
];

const IssueMapScreen = () => {
  const [issues, setIssues] = useState(MOCK_ISSUES);
  const [userLocation, setUserLocation] = useState(null);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [issueTitle, setIssueTitle] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const mapRef = useRef(null);
  const [nearestHospital, setNearestHospital] = useState(null);
  const [route, setRoute] = useState(null);

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission refusée",
          "L'accès à la localisation est nécessaire pour cette fonctionnalité."
        );
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);
      mapRef.current?.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    } catch (error) {
      console.error("Error getting user location:", error);
      Alert.alert("Erreur", "Impossible de récupérer votre position.");
    }
  };
  // Fonction heuristique (distance euclidienne)
  const heuristic = (a, b) => {
    return Math.sqrt(
      Math.pow(a.latitude - b.latitude, 2) +
        Math.pow(a.longitude - b.longitude, 2)
    );
  };

  const findShortestPath = (start, goal, graph) => {
    const frontier = new PriorityQueue({
      comparator: (a, b) => a.priority - b.priority,
    });
    frontier.queue({ node: start, priority: 0 });

    const cameFrom = new Map();
    const costSoFar = new Map();
    cameFrom.set(start, null);
    costSoFar.set(start, 0);

    while (frontier.length > 0) {
      const current = frontier.dequeue().node;

      if (current === goal) {
        break;
      }

      for (let next of graph.neighbors(current)) {
        const newCost = costSoFar.get(current) + graph.cost(current, next);
        if (!costSoFar.has(next) || newCost < costSoFar.get(next)) {
          costSoFar.set(next, newCost);
          const priority = newCost + heuristic(next, goal);
          frontier.queue({ node: next, priority: priority });
          cameFrom.set(next, current);
        }
      }
    }

    // Reconstruire le chemin
    let current = goal;
    const path = [];
    while (current !== start) {
      path.push(current);
      current = cameFrom.get(current);
    }
    path.push(start);
    path.reverse();

    return path;
  };
  const findNearestHospital = (userLocation) => {
    let nearest = HOSPITALS[0];
    let shortestDistance = getDistance(
      { latitude: userLocation.latitude, longitude: userLocation.longitude },
      { latitude: nearest.latitude, longitude: nearest.longitude }
    );

    HOSPITALS.forEach((hospital) => {
      const distance = getDistance(
        { latitude: userLocation.latitude, longitude: userLocation.longitude },
        { latitude: hospital.latitude, longitude: hospital.longitude }
      );
      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearest = hospital;
      }
    });

    setNearestHospital(nearest);
    return nearest;
  };

  const getRoute = async (start, end) => {
    // Ici, nous simulons l'obtention d'une route
    // Dans une vraie application, vous feriez un appel à l'API Google Maps Directions
    const simulatedRoute = [
      { latitude: start.latitude, longitude: start.longitude },
      {
        latitude: (start.latitude + end.latitude) / 2,
        longitude: (start.longitude + end.longitude) / 2,
      },
      { latitude: end.latitude, longitude: end.longitude },
    ];
    setRoute(simulatedRoute);
  };

  const handleEmergencyReport = () => {
    if (!userLocation) {
      Alert.alert(
        "Localisation non disponible",
        "Veuillez attendre que votre position soit détectée."
      );
      return;
    }
    Alert.alert(
      "Signaler une urgence",
      "Êtes-vous sûr de vouloir signaler une urgence médicale ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Confirmer",
          onPress: () => {
            const nearest = findNearestHospital(userLocation);
            getRoute(userLocation, nearest);
            Alert.alert(
              "Urgence signalée",
              `L'hôpital ${nearest.name} a été informé. Les secours sont en route.`
            );
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleIssueReport = () => {
    if (!userLocation) {
      Alert.alert(
        "Localisation non disponible",
        "Veuillez attendre que votre position soit détectée."
      );
      return;
    }
    setIsReportModalVisible(true);
  };

  const submitIssueReport = () => {
    if (!issueTitle.trim() || !issueDescription.trim()) {
      Alert.alert("Champs incomplets", "Veuillez remplir tous les champs.");
      return;
    }

    // Simulate API call
    setTimeout(() => {
      const newIssue = {
        id: issues.length + 1,
        title: issueTitle,
        description: issueDescription,
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      };
      setIssues([...issues, newIssue]);
      setIsReportModalVisible(false);
      setIssueTitle("");
      setIssueDescription("");
      Alert.alert(
        "Problème signalé",
        "Votre signalement a été enregistré avec succès."
      );
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={MAP_INITIAL_REGION}
      >
        {issues.map((issue) =>
          issue.urgency === "high" ? (
            <AnimatedUrgencyMarker
              key={issue.id}
              coordinate={{
                latitude: issue.latitude,
                longitude: issue.longitude,
              }}
            />
          ) : (
            <Marker
              key={issue.id}
              coordinate={{
                latitude: issue.latitude,
                longitude: issue.longitude,
              }}
              title={issue.title}
              description={issue.description}
            />
          )
        )}
        {userLocation && (
          <>
            <Marker
              coordinate={userLocation}
              title="Votre position"
              pinColor="blue"
            />
            <Circle
              center={userLocation}
              radius={100}
              fillColor="rgba(0, 122, 255, 0.1)"
              strokeColor="rgba(0, 122, 255, 0.3)"
            />
          </>
        )}
        {nearestHospital && (
          <Marker
            coordinate={{
              latitude: nearestHospital.latitude,
              longitude: nearestHospital.longitude,
            }}
            title={nearestHospital.name}
            pinColor="green"
          />
        )}
        {route && (
          <Polyline coordinates={route} strokeColor="#000" strokeWidth={3} />
        )}
      </MapView>

      <TouchableOpacity
        style={styles.emergencyButton}
        onPress={handleEmergencyReport}
      >
        <Icon name="warning" size={32} color="#FFFFFF" />
        <Text style={styles.emergencyButtonText}>URGENCE</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.reportButton} onPress={handleIssueReport}>
        <Icon name="report-problem" size={24} color="#FFFFFF" />
        <Text style={styles.reportButtonText}>Signaler un problème</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.locationButton} onPress={getUserLocation}>
        <Icon name="my-location" size={24} color="#007AFF" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isReportModalVisible}
        onRequestClose={() => setIsReportModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Signaler un problème</Text>
            <TextInput
              style={styles.input}
              placeholder="Titre du problème"
              value={issueTitle}
              onChangeText={setIssueTitle}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description du problème"
              value={issueDescription}
              onChangeText={setIssueDescription}
              multiline
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={submitIssueReport}
            >
              <Text style={styles.submitButtonText}>Envoyer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsReportModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  emergencyButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "red",
    borderRadius: 50,
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  emergencyButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginTop: 5,
  },
  reportButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "#007AFF",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
  },
  reportButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginLeft: 10,
  },
  locationButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#CCCCCC",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default IssueMapScreen; // export default IssueMapScreen;
