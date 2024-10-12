import React, { useContext, useRef, useState, useEffect } from "react";
import { View, Button, StyleSheet, FlatList } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { mediaDevices, RTCPeerConnection, RTCView } from "react-native-webrtc";

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
    <View style={styles.container}>
      <Button title="Report Issue" onPress={() => navigation.navigate("ReportIssue")} />
      <Button title="View Issue Map" onPress={() => navigation.navigate("IssueMap")} />
      <Button title="Logout" onPress={logout} />

      <View style={styles.container}>
        {localStream && (
          <RTCView style={styles.video} streamURL={localStream.toURL()} />
        )}
        {remoteStream && (
          <RTCView style={styles.video} streamURL={remoteStream.toURL()} />
        )}
        <Button
          title={isCalling ? "End Call" : "Start Call"}
          onPress={startCall}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  video: {
    width: "100%",
    height: 200,
    backgroundColor: "#000",
  },
});

export default HomeScreen;
