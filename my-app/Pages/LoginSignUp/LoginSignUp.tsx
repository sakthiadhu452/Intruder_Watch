import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
  ActivityIndicator
} from "react-native";
import { useFonts, Righteous_400Regular } from "@expo-google-fonts/righteous";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types'; // Import your types

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;


const { width, height } = Dimensions.get("window");

type Props = {
  onLoginSuccess: () => void;
};


const LoginScreen = ({ onLoginSuccess }: Props) => {
  const navigation = useNavigation<LoginScreenNavigationProp>(); // Initialize navigation
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPassFocused, setIsConfirmPassFocused] = useState(false);
  const [isMobileFocused, setIsMobileFocused] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginLoading, setloginLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setloginLoading(true);

    if (!email.trim() || !password.trim()) {
      setError("Both fields are required.");
      setloginLoading(false);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        try {
          await AsyncStorage.setItem('userToken', result.token);
          // Ensuring the token is stored before navigating
          console.log('Login successful, navigating to Dashboard...');
          onLoginSuccess()
          navigation.navigate('Dashboard');
        } catch (error) {
          console.error('Failed to set user token:', error);
          setError("An unexpected error occurred.");
        }
      } else {
        setError(result.error || "An error occurred.");
      }
      
    } catch (error) {
      setError("An unexpected error occurred.");
      console.error("Error:", error);
      setloginLoading(false);
    }
  };

  const handleSignUp = async () => {
    setError("");

    if (!email.trim() || !password.trim() || !confirmPassword.trim() || !mobile.trim()) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, mobile }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Sign-up successful:", result.message);
        Alert.alert(
          'Alert Title', // Title of the alert
          'This is the alert message.', // Message of the alert
          [
            {
              text: 'OK', // Button text
              onPress: () => console.log('OK Pressed') // Action on press
            }
          ],
          { cancelable: false } // Options
        );
        setIsSignUp(false); // Switch to login mode after successful sign-up
      } else {
        setError(result.error || "An error occurred.");
      }
    } catch (error) {
      setError("An unexpected error occurred.");
      console.error("Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerLeft}>
        <Text style={styles.title}>Intruder Watch</Text>
        <Text style={styles.subtitle}>
          {isSignUp
            ? "Welcome aboard! We're excited to have you with us and can't wait for you to start exploring!"
            : "Welcome back! Please login to your account."}
        </Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          style={[styles.input, isEmailFocused && styles.borderLeft]}
          onFocus={() => setIsEmailFocused(true)}
          onBlur={() => setIsEmailFocused(false)}
          placeholder="Email Address"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={[styles.input, isPasswordFocused && styles.borderLeft]}
          onFocus={() => setIsPasswordFocused(true)}
          onBlur={() => setIsPasswordFocused(false)}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          autoCapitalize="none"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        {isSignUp && (
          <>
            <TextInput
              style={[styles.input, isConfirmPassFocused && styles.borderLeft]}
              onFocus={() => setIsConfirmPassFocused(true)}
              onBlur={() => setIsConfirmPassFocused(false)}
              placeholder="Confirm Password"
              placeholderTextColor="#aaa"
              secureTextEntry
              autoCapitalize="none"
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
            />
            <TextInput
              style={[styles.input, isMobileFocused && styles.borderLeft]}
              onFocus={() => setIsMobileFocused(true)}
              onBlur={() => setIsMobileFocused(false)}
              placeholder="Mobile Number"
              placeholderTextColor="#aaa"
              keyboardType="phone-pad"
              value={mobile}
              onChangeText={(text) => setMobile(text)}
            />
          </>
        )}

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={!isSignUp ? styles.DarkThemeButton : styles.LightThemeButton}
            onPress={() => (!isSignUp ? handleLogin() : setIsSignUp(false))}
          >
            <Text
              style={!isSignUp ? styles.DarkThemeButtonText : styles.LightThemeButtonText}
            >
              {
                loginLoading ? <ActivityIndicator size="small" color="#0000ff" /> : "Login"
              }
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={isSignUp ? styles.DarkThemeButton : styles.LightThemeButton}
            onPress={() => (isSignUp ? handleSignUp() : setIsSignUp(true))}
          >
            <Text
              style={isSignUp ? styles.DarkThemeButtonText : styles.LightThemeButtonText}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.otherLoginContainer}>
          <Text style={styles.orLoginWithText}>Or login with</Text>
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialButtonText}>Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialButtonText}>LinkedIn</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.containerRight}>
        <Image
          source={require("../../Assets/camera.png")}
          style={styles.cameraImage}
        />
        <View>
          <View style={[styles.line]}></View>
          <View style={[styles.line, styles.line2]}></View>
          <View style={[styles.line, styles.line3]}></View>
        </View>
        <Image
          source={require("../../Assets/punch biz-Photoroom.png")}
          style={styles.punchbizImage}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width, // 100vw
    height: height, // 100vh
    flexDirection: "row", // Row direction to split left and right containers
    backgroundColor: "#fff",
  },
  containerLeft: {
    flex: 0.65, // 60% of the container
    padding: 60,
  },
  containerRight: {
    flex: 0.35, // 40% of the container
    backgroundColor: "#F4F4F4",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    color: "#000",
    marginBottom: 30,
    fontWeight: "bold",
    textShadowColor: "#15152F", // Shadow color
    textShadowOffset: { width: 1, height: 1 }, // Offset in x and y direction
    textShadowRadius: 1,
    fontFamily: "Righteous_400Regular", // Corrected fontFamily usage
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 75,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 2,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: "68%",
  },
  forgotPassword: {
    color: '#15152F',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#15152F",
  },
  buttonContainer: {
    flexDirection: 'row',  // Arrange buttons in a row
    marginBottom: 15,
  },
  DarkThemeButton: {
    backgroundColor: "#000",
    paddingVertical: 15,
    borderRadius: 1,
    alignItems: "center",
    marginBottom: 15,
    maxWidth: 130,
    marginRight: 30,
    maxHeight: 100,
    flex: 1,
  },
  DarkThemeButtonText: {
    color: "#fff",
  },
  LightThemeButton: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderRadius: 1,
    alignItems: "center",
    marginBottom: 15,
    maxWidth: 130,
    marginRight: 30,
    maxHeight: 100,
    flex: 1,
    borderColor: '#000',
    borderWidth: 1,
  },
  LightThemeButtonText: {
    color: "#000",
  },
  orLoginWithText: {
    textAlign: "center",
    color: "#666",
    marginVertical: 10,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
    fontWeight: 'bold',
  },
  socialButton: {
    padding: 10,
    borderRadius: 5,
    fontWeight: 'bold',
  },
  socialButtonText: {
    fontWeight: 'bold',
  },
  cameraImage: {
    width: "64%",
    height: "64%",
    resizeMode: "contain",
    marginTop: "-70%",
  },
  line: {
    width: 215,
    height: 3,
    backgroundColor: "black",
    margin: 4,
  },
  line2: {
    marginLeft: 45,
  },
  line3: {
    marginLeft: 90,
  },
  punchbizImage: {
    width: "24%",
    height: "24%",
    resizeMode: "contain",
    position: "absolute",
    marginTop: 299,
  },
  otherLoginContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '60%',
    justifyContent: 'space-around',
  },
  borderLeft: {
    borderLeftColor: '#15152F',
    borderWidth: 4,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  }
});

export default LoginScreen;
