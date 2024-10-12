import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import MapView, { Polygon } from "react-native-maps";
import { createOutageAlert } from "../services/database";
import { AuthContext } from "../context/AuthContext";

const CreateOutageAlertScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [type, setType] = useState("electricity");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [affectedArea, setAffectedArea] = useState([]);

  const handleCreateAlert = async () => {
    try {
      await createOutageAlert(
        type,
        startDate.toISOString(),
        endDate.toISOString(),
        affectedArea,
        description
      );
      Alert.alert("Success", "Outage alert created successfully");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to create outage alert");
    }
  };

  const handleMapPress = (event) => {
    setAffectedArea([...affectedArea, event.nativeEvent.coordinate]);
  };

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={type}
        onValueChange={(itemValue) => setType(itemValue)}
      >
        <Picker.Item label="Electricity" value="electricity" />
        <Picker.Item label="Water" value="water" />
      </Picker>

      <Text>Start Date:</Text>
      <DateTimePicker
        value={startDate}
        mode="datetime"
        display="default"
        onChange={(event, selectedDate) =>
          setStartDate(selectedDate || startDate)
        }
      />

      <Text>End Date:</Text>
      <DateTimePicker
        value={endDate}
        mode="datetime"
        display="default"
        onChange={(event, selectedDate) => setEndDate(selectedDate || endDate)}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text>Tap on the map to define the affected area:</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -18.8792,
          longitude: 47.5079,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={handleMapPress}
      >
        {affectedArea.length > 2 && (
          <Polygon
            coordinates={affectedArea}
            fillColor="rgba(255,0,0,0.5)"
            strokeColor="red"
          />
        )}
      </MapView>

      <Button title="Create Alert" onPress={handleCreateAlert} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  map: {
    height: 300,
    marginVertical: 20,
  },
});

export default CreateOutageAlertScreen;
