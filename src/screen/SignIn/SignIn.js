import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import logo from "../../../assets/logohomedashboarddarkmode.png";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Logique de connexion
  };
  const handlePassword = () => {
    // Logique de connexion
  };

  const navigateToSignUp = () => {
    navigation.navigate("SignUp");
  };

  return (
    <LinearGradient
      colors={["#421053", "#261B29"]}
      locations={[0.1, 0.25]}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} />
      </View>
      <View>
        <Text style={styles.title}>Connexion</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <TouchableOpacity style={styles.buttonPassword} onPress={handlePassword}>
        <Text style={styles.buttonTextPassword}>Mot de passe oublié ?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Connexion</Text>
      </TouchableOpacity>
      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Pas encore inscrit ?</Text>
        <TouchableOpacity
          style={styles.signUpButton}
          onPress={navigateToSignUp}
        >
          <Text style={styles.buttonText}>Inscription</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 50,
    textAlign: "center",
    color: "white",
  },
  input: {
    width: "100%",
    height: 60,
    borderWidth: 1,
    borderColor: "#EDBBFF",
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#FFF", // Ajout d'un fond blanc pour TextInput
  },
  button: {
    backgroundColor: "#9124B6",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 10,
    height: 60,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonPassword: {
    marginTop: 10,
    alignSelf: "flex-end",
  },
  buttonTextPassword: {
    color: "#EDBBFF",
    textAlign: "right",
  },
  signUpContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
  },
  signUpText: {
    marginRight: 10,
    color: "#EDBBFF",
  },
  signUpButton: {
    borderRadius: 5,
  },
  logoContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  logo: {
    width: "90%", // Prend 70% de la largeur de l'écran
    aspectRatio: 1.2, // Garde le ratio d'aspect de l'image pour une hauteur proportionnelle
    resizeMode: "contain",
  },
});

export default LoginScreen;
