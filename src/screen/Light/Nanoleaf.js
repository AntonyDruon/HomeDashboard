import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ColorPicker from "../../component/colorPicker";
import tinycolor from "tinycolor2";

const Nanoleaf = ({ navigation, route }) => {
  const [color, setColor] = useState("#ffffff");
  const [selectedLights, setSelectedLights] = useState({});
  const { token, ip } = route.params;

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem("token");
      navigation.navigate("SignIn");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const hexToRgb = (hex) => {
    hex = hex.replace("#", "");
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    return { r, g, b };
  };

  const rgbToHsv = ({ r, g, b }) => {
    r /= 255;
    g /= 255;
    b /= 255;
    let max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h,
      s,
      v = max;

    let d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
      h = 0; // achromatic
    } else {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      v: Math.round(v * 100),
    };
  };

  const hexToHue = (hex) => {
    const rgb = hexToRgb(hex);
    const hsv = rgbToHsv(rgb);
    return hsv;
  };

  const updateNanoleafLights = async (hsvColor) => {
    console.log();
    const url = `http://${ip}/api/v1/${token}/state`;
    console.log("url test", url);
    const body = JSON.stringify({
      hue: { value: hsvColor.h },
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
        console.error("Failed to update Nanoleaf lights");
      } else {
        console.log("Nanoleaf lights updated successfully!");
      }
    } catch (error) {
      console.error("Error updating Nanoleaf lights:", error);
    }
  };

  const handleColorChange = (selectedColor) => {
    setColor(selectedColor);
    const hsvColor = hexToHue(selectedColor);
    console.log("hsvColor", hsvColor);
    updateNanoleafLights(hsvColor);
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
        <View style={styles.cardsContainer}></View>
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

export default Nanoleaf;
