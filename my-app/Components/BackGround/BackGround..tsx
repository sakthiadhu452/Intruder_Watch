import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const BackGround = () => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#23ADCB", "#3378B0", "#7033CF"]}
        locations={[0, 0.5, 1]}
        style={styles.round1}
      >
        <View> </View>
      </LinearGradient>
      <LinearGradient
        colors={["#23ADCB", "#3378B0", "#7033CF"]}
        locations={[0, 0.5, 1]}
        style={styles.round2}
      >
        <View> </View>
      </LinearGradient>
      <LinearGradient
        colors={["#23ADCB", "#3378B0", "#7033CF"]}
        locations={[0, 0.5, 1]}
        style={styles.round3}
      >
        <View> </View>
      </LinearGradient>
      <LinearGradient
        colors={["#23ADCB", "#3378B0", "#7033CF"]}
        locations={[0, 0.5, 1]}
        style={styles.round4}
      >
        <View> </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: '#fff',
    position: "absolute",
    zIndex: -2,
  },
  text: {
    fontSize: 20,
    color: "#333",
  },
  round1: {
    width: 200,
    height: 200,
    borderRadius: 500,
    marginTop: 570,
    marginLeft: -70,
  },
  round2: {
    width: 250,
    height: 250,
    position: "absolute",
    borderRadius: 500,
    marginLeft: 1900,
    marginTop: 50,
  },
  round3: {
    width: 250,
    height: 250,
    position: "absolute",
    borderRadius:500,
    marginLeft:200,
    marginTop:-850
  },
  round4:{
    width: 150,
    height: 150,
    position: "absolute",
    borderRadius:500,
    marginLeft:3000,
    marginTop:-500
    
  }
});

export default BackGround;
