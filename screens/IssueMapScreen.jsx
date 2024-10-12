import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { getIssues } from "../services/database";

const IssueMapScreen = () => {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = async () => {
    try {
      const loadedIssues = await getIssues();
      setIssues(loadedIssues);
    } catch (error) {
      console.error("Failed to load issues", error);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -18.8792,
          longitude: 47.5079,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
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

export default IssueMapScreen;
