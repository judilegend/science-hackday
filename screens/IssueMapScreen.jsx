import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  TextInput,
} from "react-native";
import MapView, { Marker, Circle, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { MAP_INITIAL_REGION } from "../utils/constants";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getDistance } from "geolib";

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

const HOSPITALS = [
  { id: 1, name: "Hôpital Central", latitude: -18.8792, longitude: 47.5079 },
  { id: 2, name: "Clinique St. Paul", latitude: -18.88, longitude: 47.51 },
];

const IssueMapScreen = ({ navigation }) => {
  const [issues, setIssues] = useState(MOCK_ISSUES);
  const [userLocation, setUserLocation] = useState(null);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [issueTitle, setIssueTitle] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const mapRef = useRef(null);
  const [nearestHospital, setNearestHospital] = useState(null);
  const [route, setRoute] = useState(null);
  const { initialLocation, confirmEmergency } = route.params || {};

  useEffect(() => {
    if (confirmEmergency && userLocation) {
      handleEmergencyConfirmation();
    }
  }, []);

  const handleEmergencyConfirmation = async () => {
    const nearest = findNearestHospital(userLocation);
    const distance = await getRealisticRoute(userLocation, nearest);
    const distanceInKm = (distance / 1000).toFixed(2);
    Alert.alert(
      "Urgence signalée",
      `L'hôpital ${nearest.name} a été informé. Les secours sont en route. Distance estimée: ${distanceInKm} km.`
    );
  };
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

  const getRealisticRoute = async (start, end) => {
    try {
      console.log("Start point:", start);
      console.log("End point:", end);
      const response = await simulateRouteAPI(start, end);
      setRoute(response.routes[0].geometry.coordinates);
      const distance = response.routes[0].distance;
      return distance || 0; // Retourne 0 si la distance est undefined
    } catch (error) {
      console.error("Erreur lors de l'obtention de l'itinéraire:", error);
      Alert.alert("Erreur", "Impossible d'obtenir l'itinéraire.");
      return 0; // Retourne 0 en cas d'erreur
    }
  };

  const simulateRouteAPI = (start, end) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const numPoints = 20;
        const route = [];
        let totalDistance = 0;

        for (let i = 0; i <= numPoints; i++) {
          const ratio = i / numPoints;
          const lat = start.latitude + (end.latitude - start.latitude) * ratio;
          const lng =
            start.longitude + (end.longitude - start.longitude) * ratio;

          const latVariation = (Math.random() - 0.5) * 0.001;
          const lngVariation = (Math.random() - 0.5) * 0.001;

          const point = {
            latitude: lat + latVariation,
            longitude: lng + lngVariation,
          };
          route.push([point.longitude, point.latitude]);

          if (i > 0) {
            const prevPoint = route[i - 1];
            totalDistance += getDistance(
              { latitude: prevPoint[1], longitude: prevPoint[0] },
              point
            );
          }
        }
        resolve({
          routes: [
            {
              geometry: {
                coordinates: route,
              },
              distance: totalDistance,
            },
          ],
        });
      }, 1000);
    });
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
          onPress: async () => {
            const nearest = findNearestHospital(userLocation);
            console.log(nearest);
            const distance = await getRealisticRoute(userLocation, nearest);
            console.log(userLocation);

            console.log(distance);

            const distanceInKm = (distance / 1000).toFixed(2);
            Alert.alert(
              "Urgence signalée",
              `L'hôpital ${nearest.name} a été informé. Les secours sont en route. Distance estimée: ${distanceInKm} km.`
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
        {issues.map((issue) => (
          <Marker
            key={issue.id}
            coordinate={{
              latitude: issue.latitude,
              longitude: issue.longitude,
            }}
            title={issue.title}
            description={issue.description}
          />
        ))}
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
          <Polyline
            coordinates={route.map(([longitude, latitude]) => ({
              latitude,
              longitude,
            }))}
            strokeColor="#0000FF" // Changed to blue
            strokeWidth={4}
            lineDashPattern={[1]}
          />
        )}
      </MapView>
      <TouchableOpacity
        style={styles.communicationButton}
        onPress={() => navigation.navigate("Communication")}
      >
        <Text style={styles.buttonText}>Open Communication</Text>
      </TouchableOpacity>
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
  communicationButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 10,
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

export default IssueMapScreen;
