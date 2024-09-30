import React, { useContext, useState, useEffect, useRef } from "react";
import { Text, View, TouchableOpacity, StyleSheet, Image, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import { VideoContext } from "@/Context/videoProvider";
import { useNavigation } from "@react-navigation/native";

const LocalVideo = () => {
  const [agree, setAgree] = useState(false);
  const [localVideoUri, setLocalVideoUri] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [isVideoUploaded, setIsVideoUploaded] = useState(false);
  const fileInputRef = useRef(null);
  const navigation = useNavigation();
  const context = useContext(VideoContext);

  if (!context) {
    throw new Error("useContext must be used within a VideoProvider");
  }

  const { videoUri, setVideoUri } = context;

  useEffect(() => {
    if (videoUri) {
      setLocalVideoUri(videoUri);
      setIsVideoUploaded(true);
    }
  }, [videoUri]);

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoUri(reader.result); // Update videoUri in context
        setFileName(file.name);
        setIsVideoUploaded(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault(); // Prevent the default behavior (open in new tab)
    event.stopPropagation(); // Stop event from bubbling

    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoUri(reader.result);
        setFileName(file.name);
        setIsVideoUploaded(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault(); // Prevent default behavior
    event.stopPropagation(); // Stop event from bubbling
  };

  const handleCancel = () => {
    setVideoUri(null);
    setLocalVideoUri(null);
    setFileName(null);
    setIsVideoUploaded(false);
  };

  return (
    <View
      style={styles.container}
      onDrop={Platform.OS === "web" ? handleDrop : undefined}
      onDragOver={Platform.OS === "web" ? handleDragOver : undefined}
    >
      <TouchableOpacity
        style={styles.input}
        onPress={() => fileInputRef.current.click()} // Use ref to trigger input click
      >
        {isVideoUploaded && (
          <TouchableOpacity style={styles.cancelIcon} onPress={handleCancel}>
            <Icon name="times" size={20} color="#fff" />
          </TouchableOpacity>
        )}
        <View style={styles.dropbox}>
          <Image
            source={require("../../Assets/Vector.png")}
            style={styles.uploadImage}
          />
          <Text style={styles.uploadBoxText}>
            {fileName ? <>{fileName}</> : "Upload video"}
          </Text>
        </View>
        <Text style={styles.dropFileText}>or drop a file</Text>
      </TouchableOpacity>

      {Platform.OS === "web" && (
        <input
          type="file"
          accept="video/*"
          onChange={handleUpload}
          style={{ display: "none" }}
          ref={fileInputRef} // Attach the ref
        />
      )}

      <View style={styles.checkboxContainer}>
        <input
          type="checkbox"
          checked={agree}
          onChange={() => setAgree(!agree)}
          style={{ marginRight: 8 }}
        />
        <Text style={styles.checkboxLabel}>
          By clicking, you are agreeing to our{" "}
          <Text style={styles.link}>terms & conditions</Text>
        </Text>
      </View>

      <LinearGradient
        colors={["#23ADCB", "#3378B0", "#7033CF"]}
        locations={[0, 0.5, 1]}
        style={styles.button}
      >
        <TouchableOpacity
          style={styles.buttonFlex}
          onPress={() => {
            navigation.navigate("videoProcess");
          }}
        >
          <Text style={styles.buttonText}>Continue</Text>
          <Icon name="arrow-right" size={20} color="#fff" style={styles.icon} />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 40,
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    height: "100%",
    borderRadius: 9,
    marginTop: 80,
    textAlign: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkboxLabel: {
    color: "#aaa",
  },
  link: {
    textDecorationLine: "underline",
  },
  button: {
    marginLeft: 130,
    backgroundColor: "#3a7bd5",
    paddingHorizontal: 22,
    paddingVertical: 8,
    cursor: "pointer",
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 22,
  },
  buttonFlex: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    paddingHorizontal: 10,
  },
  dropbox: {
    backgroundColor: "black",
    borderRadius: 9,
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  uploadImage: {
    transform: [{ scale: 0.5 }],
  },
  uploadBoxText: {
    color: "white",
    padding: 4,
  },
  dropFileText: {
    marginLeft: 10,
    textAlign: "center",
  },
  input: {
    borderWidth: 2,
    backgroundColor: "#F1F0F0",
    opacity: 80,
    borderColor: "grey",
    borderStyle: "dashed",
    padding: 18,
    borderRadius: 5,
    marginBottom: 12,
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
  },
  cancelIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "grey",
    color: "black",
    padding: 0,
    borderRadius: "50%",
    paddingHorizontal: 2,
    zIndex: 1,
  },
});

export default LocalVideo;
