import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sendSMS } from "react-native-sms";
// import { NotificationContext } from "../context/NotificationContext";

const BACKEND_URL = "192.168.131.193:8080";
const CommunicationScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isOffline, setIsOffline] = useState(false);
  // const { notifications, addNotification, clearNotifications } =
  //   useNotifications();
  // const { notifications, clearNotifications } = useContext(NotificationContext);
  const BACKEND_URL = "192.168.131.193:8080";

  // useEffect(() => {
  //   const socket = io(BACKEND_URL);

  //   socket.on("connect", () => {
  //     console.log("Connected to server");
  //   });

  //   socket.on("message", (message) => {
  //     addMessage(message);
  //   });

  //   const unsubscribe = NetInfo.addEventListener((state) => {
  //     setIsOffline(!state.isConnected);
  //   });

  //   loadStoredMessages();

  //   return () => {
  //     socket.disconnect();
  //     unsubscribe();
  //   };
  // }, []);

  const loadStoredMessages = async () => {
    try {
      const storedMessages = await AsyncStorage.getItem("messages");
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const addMessage = async (message) => {
    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(updatedMessages));
    } catch (error) {
      console.error("Error storing message:", error);
    }
  };

  const sendMessage = () => {
    if (inputText.trim() === "") return;

    const message = {
      text: inputText,
      timestamp: new Date().toISOString(),
      sender: "user", // Replace with actual user ID
    };

    if (isOffline) {
      sendSMS({
        body: inputText,
        recipients: ["EMERGENCY_NUMBER"],
        successTypes: ["sent", "queued"],
      });
    } else {
      // Send to server
      io(BACKEND_URL).emit("message", message);
    }

    addMessage(message);
    setInputText("");
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.timestampText}>
              {new Date(item.timestamp).toLocaleString()}
            </Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.notificationContainer}>
        <Text style={styles.notificationTitle}></Text>
        <FlatList
          // data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Text>{item.message}</Text>}
        />
        <TouchableOpacity
          style={styles.clearButton}
          // onPress={clearNotifications}
        >
          <Text style={styles.clearButtonText}>Clear Notifications</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageContainer: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    marginVertical: 5,
    borderRadius: 5,
  },
  messageText: {
    fontSize: 16,
  },
  timestampText: {
    fontSize: 12,
    color: "#888",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  notificationContainer: {
    padding: 10,
    backgroundColor: "#e0e0e0",
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  notificationText: {
    fontSize: 14,
    marginBottom: 3,
  },
  clearButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  clearButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default CommunicationScreen;
