import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import logo from "../../../assets/logohomedashboarddarkmode.png";
import { useSignUpMutation } from "../../slice/userApiSlice";

const SignUpScreen = ({ navigation }) => {
  const [username, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUp] = useSignUpMutation();

  const handleSignUp = async () => {
    const response = await signUp({ username, email, password });
    signUp({ username, email, password });
    console.log(response);
    navigation.navigate("SignIn");
  };
  const goToSignIn = () => {
    navigation.navigate("SignIn");
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
        <Text style={styles.title}>Inscription</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Pseudo"
        onChangeText={setFullName}
        value={username}
        autoCapitalize="words"
      />
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
      <TouchableOpacity style={styles.buttonSignUp} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Inscription</Text>
      </TouchableOpacity>
      <View style={styles.navbarbottom}>
        <TouchableOpacity onPress={goToSignIn} style={styles.buttonContainer}>
          <View style={[styles.button, { backgroundColor: "#4F4353" }]}>
            <Text style={styles.buttonText}>Connexion</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToSignIn} style={styles.buttonContainer}>
          <View style={[styles.button, { backgroundColor: "#38253E" }]}></View>
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
    backgroundColor: "#FFF3F3",
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
    borderRadius: 5,
    flex: 1, // Utilisez flex: 1 pour que le bouton occupe tout l'espace disponible dans le conteneur parent
    marginHorizontal: 5, // Ajoute une marge horizontale entre les boutons
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  buttonContainer: {
    flex: 1, // Utilisez flex: 1 pour que le TouchableOpacity occupe tout l'espace disponible dans le conteneur parent
  },
  buttonSignUp: {
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
  navbarbottom: {
    position: "absolute",
    height: 120,
    bottom: 20,
    left: 0,
    right: 0,
    backgroundColor: "#241A26",
    display: "flex",
    flexDirection: "row",
    flex: 1,
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

export default SignUpScreen;
