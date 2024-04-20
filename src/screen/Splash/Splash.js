import React, { useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Button,
} from "react-native";

const Splash = ({ navigation }) => {
  useEffect(() => {
    // Simuler un chargement de données ou une tâche asynchrone
    setTimeout(() => {
      // Naviguer vers l'écran principal après le chargement
      navigation.replace("SignIn");
    }, 2000); // Splash screen visible pendant 2 secondes
  }, []);

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
