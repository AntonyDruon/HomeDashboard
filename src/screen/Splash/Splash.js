import React, { useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Splash = ({ navigation }) => {
  useEffect(() => {
    // Simuler un chargement de données ou une tâche asynchrone
    setTimeout(() => {
      // Naviguer vers l'écran principal après le chargement
      checkToken();
    }, 2000); // Splash screen visible pendant 2 secondes
  }, []);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        console.log(token);
        navigation.replace("Dashboard");
      } else {
        // Rediriger vers l'écran de connexion si aucun token n'est trouvé
        navigation.replace("SignIn");
      }
    } catch (error) {
      console.error("Error checking token:", error);
      // En cas d'erreur, rediriger vers l'écran de connexion par défaut
      navigation.replace("SignIn");
    }
  };
  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/logohomedashboard.png")}
        style={styles.logo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF3F3",
  },
  logo: {
    width: 400,
    height: 400,
    resizeMode: "contain",
  },
});

export default Splash;
