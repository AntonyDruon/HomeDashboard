import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import logo from "../../../assets/logohomedashboarddarkmode.png";
import { useLoginMutation } from "../../slice/authApiSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login] = useLoginMutation();
  const [attempts, setAttempts] = useState(0); // Suivre le nombre de tentatives
  const [isBlocked, setIsBlocked] = useState(false); // Bloquer après plusieurs tentatives
  const [remainingTime, setRemainingTime] = useState(0); // Temps d'attente
  const [penaltyTime, setPenaltyTime] = useState(10); // Temps de blocage actuel

  // Fonction pour gérer la tentative de connexion
  const handleLogin = async () => {
    if (isBlocked) {
      Alert.alert(
        "Trop de tentatives",
        `Vous devez attendre ${remainingTime} secondes avant de réessayer.`
      );
      return;
    }

    try {
      const response = await login({ email, password });

      if (response && response.data && response.data.token) {
        const token = response.data.token;
        await AsyncStorage.setItem("authToken", token);
        navigation.navigate("Dashboard");
        // Réinitialiser le compteur de tentatives et le blocage après une réussite
        setAttempts(0);
        setPenaltyTime(10); // Réinitialise le temps d'attente
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      setAttempts((prev) => prev + 1); // Incrémenter le nombre de tentatives

      if ((attempts + 1) % 5 === 0) {
        blockLogin(); // Bloquer après chaque série de 5 tentatives
      } else {
        Alert.alert("Erreur de connexion", "Email ou mot de passe incorrect.");
      }
    }
  };

  // Fonction pour bloquer la connexion pendant un certain temps
  const blockLogin = () => {
    setIsBlocked(true);
    setRemainingTime(penaltyTime);

    // Décompte du temps d'attente
    const interval = setInterval(() => {
      setRemainingTime((time) => {
        if (time <= 5) {
          clearInterval(interval);
          setIsBlocked(false);
          setPenaltyTime((prevTime) => prevTime * 3); // Multiplie le temps de blocage par 3
        }
        return time - 1;
      });
    }, 1000);
  };

  const handlePassword = () => {
    // Logique de récupération de mot de passe oublié
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
      {isBlocked && (
        <Text style={styles.blockedText}>
          Vous devez attendre {remainingTime} secondes avant de réessayer.
        </Text>
      )}
      <TouchableOpacity
        style={styles.buttonPassword}
        onPress={handlePassword}
        disabled={isBlocked} // Désactiver si l'utilisateur est bloqué
      >
        <Text style={styles.buttonTextPassword}>Mot de passe oublié ?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={isBlocked} // Désactiver si l'utilisateur est bloqué
      >
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
    backgroundColor: "#FFF",
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
  blockedText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
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
    width: "90%",
    aspectRatio: 1.2,
    resizeMode: "contain",
  },
});

export default LoginScreen;
