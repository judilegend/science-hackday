import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  Image, // Add this line
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, Circle, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { MAP_INITIAL_REGION } from "../utils/constants";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getDistance } from "geolib";
import * as ImagePicker from "expo-image-picker";
import { reportIssue } from "../services/api";
import { useAuth } from "../context/AuthContext";

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
  {
    id: 1,
    name: "Hôpital Saint Joseph",
    latitude: -18.9102,
    longitude: 47.5235,
  },
  { id: 2, name: "CSB2 de Mahamasina", latitude: -18.9147, longitude: 47.5284 },
  { id: 3, name: "Hôpital Central", latitude: -18.8792, longitude: 47.5079 },
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
  const { user, token } = useAuth();

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

  const [photos, setPhotos] = useState([]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission refusée",
        "Désolé, nous avons besoin des permissions pour accéder à votre galerie."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission refusée",
        "Désolé, nous avons besoin des permissions pour accéder à votre caméra."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const removePhoto = (index) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);

  const toggleEmergencyMode = () => {
    setIsEmergencyMode(!isEmergencyMode);
  };

  const submitIssueReport = async () => {
    if (!issueTitle.trim() || !issueDescription.trim()) {
      Alert.alert("Champs incomplets", "Veuillez remplir tous les champs.");
      return;
    }

    try {
      const signalData = {
        typeId: 1, // Adjust this based on your issue types
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        description: issueDescription,
        state: "PENDING",
        userId: user.id, // Make sure you have access to the user object
      };
      let assetsPath = [];
      const formData = new FormData();
      formData.append("signal", JSON.stringify(signalData));
      assetsPath = [...photos];
      // console.log(assetsPath);

      const response = await reportIssue(signalData, assetsPath , token); // Make sure you have access to the token
      console.log("Signal data sent:", response);
      setIsReportModalVisible(false);
      setIssueTitle("");
      setIssueDescription("");
      setPhotos([]);
      Alert.alert(
        "Problème signalé",
        "Votre signalement a été enregistré avec succès."
      );

      // Add the new issue to the map
      const newIssue = {
        id: issues.length + 1,
        title: issueTitle,
        description: issueDescription,
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      };
      setIssues([...issues, newIssue]);
    } catch (error) {
      console.error("Error submitting issue report:", error);
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de l'envoi du signalement."
      );
    }
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

      <TouchableOpacity style={styles.locationButton} onPress={getUserLocation}>
        <Icon name="my-location" size={24} color="#007AFF" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.emergencyButton}
        onPress={handleIssueReport}
      >
        <Icon
          name="report-problem"
          size={24}
          color={isEmergencyMode ? "#FFFFFF" : "#FF0000"}
        />
        <Text
          style={[
            styles.emergencyButtonText,
            isEmergencyMode && styles.emergencyButtonTextActive,
          ]}
        >
          Signaler un problème
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.nearestHospitalButton}
        onPress={handleEmergencyReport}
      >
        <Ionicons size={24} color="#FFFFFF" />
        <Text style={styles.nearestHospitalButtonText}>
          Trouver l'hôpital le plus proche
        </Text>
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
            <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
              <Text style={styles.photoButtonText}>Prendre une photo</Text>
            </TouchableOpacity>
            <View style={styles.photoContainer}>
              {photos.map((photo, index) => (
                <View key={index} style={styles.photoWrapper}>
                  <Image source={{ uri: photo }} style={styles.photo} />
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={() => removePhoto(index)}
                  >
                    <Text style={styles.removePhotoButtonText}>X</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={submitIssueReport}
            >
              <Text style={styles.submitButtonText}>Envoyer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setIsReportModalVisible(false);
                setPhotos([]);
              }}
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

  emergencyButton: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
  },
  emergencyButtonActive: {
    backgroundColor: "#FF0000",
  },
  emergencyButtonText: {
    color: "#FF0000",
    fontWeight: "bold",
    marginLeft: 10,
  },
  emergencyButtonTextActive: {
    color: "#FFFFFF",
  },
  nearestHospitalButton: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: "#4CAF50",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  nearestHospitalButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginLeft: 10,
    fontSize: 16,
  },
  blurContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#F2F2F7",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 34,
    maxHeight: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  modalContent: {
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1C1C1E",
    letterSpacing: 0.35,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(60, 60, 67, 0.1)",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 17,
    color: "#1C1C1E",
    fontWeight: "400",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
    paddingTop: 14,
  },
  photoSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: "#1C1C1E",
    letterSpacing: 0.38,
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
  photoButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    marginTop: 10,
  },
  photoButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  photoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  photoWrapper: {
    position: "relative",
    margin: 5,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  removePhotoButton: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  removePhotoButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
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
