import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { getReportedIssues } from "../services/api";

const InteractiveMap = () => {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const fetchIssues = async () => {
      const fetchedIssues = await getReportedIssues();
      setIssues(fetchedIssues);
    };
    fetchIssues();
  }, []);

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

export default InteractiveMap;
