import React, { useState, useContext } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { IssueContext } from "../context/IssueContext";
import * as Location from "expo-location";

const ReportIssueScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [issueType, setIssueType] = useState("water");
  const { addIssue } = useContext(IssueContext);

  const handleSubmit = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      await addIssue(title, description, issueType, latitude, longitude);
      Alert.alert("Success", "Issue reported successfully");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to report issue");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Issue Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Picker
        selectedValue={issueType}
        onValueChange={(itemValue) => setIssueType(itemValue)}
      >
        <Picker.Item label="Water" value="water" />
        <Picker.Item label="Electricity" value="electricity" />
      </Picker>
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default ReportIssueScreen;
