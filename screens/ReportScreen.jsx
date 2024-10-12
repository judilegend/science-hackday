import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ISSUE_TYPES } from "../utils/constants";
import { reportIssue } from "../services/api";

const ReportScreen = () => {
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    if (!issueType || !description) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    try {
      await reportIssue(issueType, description);
      Alert.alert("Succès", "Votre signalement a été enregistré");
      setIssueType("");
      setDescription("");
    } catch (error) {
      Alert.alert("Erreur", "Une erreur est survenue lors du signalement");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signaler une panne</Text>
      <Picker
        selectedValue={issueType}
        onValueChange={(itemValue) => setIssueType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Sélectionnez le type de panne" value="" />
        {Object.entries(ISSUE_TYPES).map(([key, value]) => (
          <Picker.Item key={key} label={value} value={key} />
        ))}
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Description de la panne"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Envoyer le signalement</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  picker: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ReportScreen;
