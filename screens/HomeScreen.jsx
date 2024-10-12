import React, { useContext } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { AuthContext } from "../context/AuthContext";

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const peerConnection = useRef(null);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://192.168.131.193:8080/signal");
    ws.current.onmessage = handleSignalingData;

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const startCall = async () => {
    try {
      const stream = await mediaDevices.getUserMedia({ audio: true, video: true });
      setLocalStream(stream);

      peerConnection.current = new RTCPeerConnection();
      stream.getTracks().forEach((track) => {
        peerConnection.current.addTrack(track, stream);
      });

      peerConnection.current.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
      };

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          sendSignalingData({ type: "ice-candidate", candidate: event.candidate });
        }
      };

      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      sendSignalingData({ type: "offer", offer });

      setIsCalling(true);
    } catch (error) {
      console.error("Error starting call:", error);
    }
  };

  const handleSignalingData = async (event) => {
    const data = JSON.parse(event.data);
    switch (data.type) {
      case "offer":
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(data.offer)
        );
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        sendSignalingData({ type: "answer", answer });
        break;
      case "answer":
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(data.answer)
        );
        break;
      case "ice-candidate":
        await peerConnection.current.addIceCandidate(
          new RTCIceCandidate(data.candidate)
        );
        break;
    }
  };

  const sendSignalingData = (data) => {
    ws.current.send(JSON.stringify(data));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Bienvenue, {user.username}!</Text>
        {/* Add your main content here */}
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.barButton}
          onPress={() => navigation.navigate("ReportIssue")}
        >
          <Icon name="report-problem" size={24} color="#007AFF" />
          <Text style={styles.barButtonText}>Signaler</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.barButton}
          onPress={() => navigation.navigate("IssueMap")}
        >
          <Icon name="map" size={24} color="#007AFF" />
          <Text style={styles.barButtonText}>Carte</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.barButton} onPress={()=>navigation.navigate("Login")}>
          <Icon name="exit-to-app" size={24} color="#007AFF" />
          <Text style={styles.barButtonText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    fontFamily: "Poppins_Regular",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  barButton: {
    alignItems: "center",
  },
  barButtonText: {
    marginTop: 5,
    fontSize: 12,
    color: "#007AFF",
  },
});

export default HomeScreen;
