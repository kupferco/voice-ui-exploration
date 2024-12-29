import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import GoogleSTTHandler from "../../components/voice/GoogleSTTHandler";

const VoiceScreen1 = () => {
  const [transcript, setTranscript] = useState("");
  const [isTTSPlaying, setIsTTSPlaying] = useState(false);

  const handleSpeechResult = (text: string) => {
    console.log("Speech Recognition Transcript:", text);
    setTranscript(text);
  };

  const handleError = (error: string) => {
    console.error("STT Error:", error);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice Input</Text>
      <Text style={styles.transcript}>{transcript || "Say something..."}</Text>

      <GoogleSTTHandler
        onSpeechResult={handleSpeechResult}
        isTTSPlaying={isTTSPlaying}
        onError={handleError}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsTTSPlaying((prev) => !prev)}
      >
        <Text style={styles.buttonText}>
          {isTTSPlaying ? "Stop Listening" : "Start Listening"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, marginBottom: 20 },
  transcript: { fontSize: 18, marginBottom: 20, color: "gray" },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontSize: 18 },
});

export default VoiceScreen1;
