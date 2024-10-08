import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Font from "expo-font"; // Importer expo-font pour charger les polices

const Splash = ({ navigation }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Charger les polices et vérifier le token
  useEffect(() => {
    const loadAssets = async () => {
      await loadFonts(); // Charger les polices
      checkToken(); // Vérifier le token après chargement des polices
    };

    loadAssets();
  }, []);

  // Charger les polices
  const loadFonts = async () => {
    await Font.loadAsync({
      "Poppins-Regular": require("../../../assets/fonts/Poppins-Regular.ttf"),
      "Poppins-Bold": require("../../../assets/fonts/Poppins-Bold.ttf"),
    });
    setFontsLoaded(true);
  };

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        navigation.replace("Dashboard");
      } else {
        navigation.replace("SignIn");
      }
    } catch (error) {
      console.error("Error checking token:", error);
      navigation.replace("SignIn");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/logohomedashboard.png")}
        style={styles.logo}
      />
      {!fontsLoaded && (
        <ActivityIndicator size="large" color="#000000" style={styles.loader} />
      )}
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
  loader: {
    marginTop: 20,
  },
});

export default Splash;
