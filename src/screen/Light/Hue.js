import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tinycolor from "tinycolor2";
import ColorPicker from "../../component/colorPicker";
import Checkbox from "expo-checkbox";
const Hue = ({ navigation, route }) => {
  const [color, setColor] = useState("#ffffff");
  const [selectedLights, setSelectedLights] = useState({});

  const { dataStateHue, bridgeIp, hueBridgeToken } = route.params;

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem("token");
      navigation.navigate("SignIn");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleColorChange = (selectedColor) => {
    setColor(selectedColor);
    const hsvColor = hexToXY(selectedColor);
    console.log("hsvColor", hsvColor);
    updateLights(hsvColor);
  };
  function hexToXY(hex) {
    // Convertir le code hexadécimal en valeurs RVB
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    // Convertir les valeurs RVB en valeurs XYZ
    const x = r * 0.649926 + g * 0.103455 + b * 0.197109;
    const y = r * 0.234327 + g * 0.743075 + b * 0.022598;
    const z = r * 0.0 + g * 0.053077 + b * 1.035763;

    // Convertir les valeurs XYZ en coordonnées XY
    const sum = x + y + z;
    const xy = [x / sum, y / sum];

    return xy;
  }

  // Exemple d'utilisation

  // Utilisation de la fonction

  const updateLights = async (hsvColor) => {
    // Remplacez par l'adresse IP de votre bridge
    // Remplacez par le nom d'utilisateur de votre bridge Hue

    Object.keys(selectedLights).forEach(async (lightId) => {
      // Vérifiez si la lumière est sélectionnée avant d'envoyer la requête
      if (selectedLights[lightId]) {
        const url = `http://${bridgeIp}/api/${hueBridgeToken}/lights/${lightId}/state`;
        console.log("url", url);
        const body = JSON.stringify({
          xy: hsvColor,
        });
        try {
          const response = await fetch(url, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: body,
          });

          if (!response.ok) {
            console.error(`Failed to update light ${lightId}`);
          }
        } catch (error) {
          console.error(`Error updating light ${lightId}:`, error);
        }
      }
    });
  };

  const toggleLightSelection = (lightId) => {
    console.log("lightId", lightId);
    setSelectedLights((prevSelectedLights) => ({
      ...prevSelectedLights,
      [lightId]: !prevSelectedLights[lightId],
    }));
    console.log("selectedLights", selectedLights);
  };
  useEffect(() => {
    console.log("selectedLights", selectedLights);
  }, [selectedLights]);

  return (
    <LinearGradient
      colors={["#421053", "#261B29"]}
      locations={[0.1, 0.25]}
      style={styles.container}
    >
      <View style={styles.containerHue}>
        <View style={{ width: "100%" }}>
          <ColorPicker color={color} onColorChange={handleColorChange} />
        </View>
        <View style={styles.cardsContainer}>
          {dataStateHue.map((light) => (
            <View
              key={light.id_light} // Utilisation de light.id_light comme clé unique
              style={styles.card}
              onPress={() => toggleLightSelection(light.id_light)} // Utilisation de light.id_light comme identifiant de lumière
            >
              <Checkbox
                value={selectedLights[light.id_light]}
                onValueChange={() => toggleLightSelection(light.id_light)}
              />
              <Text style={styles.lightName}>{light.name}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.navbarbottom}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => navigation.navigate("Lights")}
        >
          <View style={[styles.button, { backgroundColor: "#4F4353" }]}>
            <Icon name="arrow-back" size={40} color="white" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => navigation.navigate("Dashboard")}
        >
          <View style={[styles.button, { backgroundColor: "#4F4353" }]}>
            <Icon name="home" size={40} color="white" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={handleSignOut}
        >
          <View style={[styles.button, { backgroundColor: "#4F4353" }]}>
            <Icon name="exit-to-app" size={40} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  containerHue: {
    marginTop: 200,
    alignItems: "center",
    width: "100%",
  },
  navbarbottom: {
    position: "absolute",
    height: 80,
    bottom: 20,
    left: 0,
    right: 0,
    backgroundColor: "#241A26",
    display: "flex",
    flexDirection: "row",
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
  },
  button: {
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  cardsContainer: {
    marginTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  card: {
    width: "48%",
    height: 100,
    backgroundColor: "white",
    borderRadius: 10,
    margin: "1%",
    justifyContent: "center",
    alignItems: "center",

    flexDirection: "row",
  },
  lightName: {
    marginLeft: 10,
    fontSize: 16,
    color: "black",
  },
});

export default Hue;
