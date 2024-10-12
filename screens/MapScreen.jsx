import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { MAP_INITIAL_REGION } from "../utils/constants";
import { getReportedIssues } from "../services/api";

const MapScreen = () => {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const fetchedIssues = await getReportedIssues();
        setIssues(fetchedIssues);
      } catch (error) {
        console.error("Error fetching issues:", error);
      }
    };

    fetchIssues();
  }, []);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={MAP_INITIAL_REGION}>
        {issues.map((issue) => (
          <Marker
            key={issue.id}
            coordinate={{
              latitude: issue.latitude,
              longitude: issue.longitude,
            }}
            title={issue.type}
            description={issue.description}
          />
        ))}
      </MapView>
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
});

export default MapScreen;
