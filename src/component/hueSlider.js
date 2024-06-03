import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import ColorPicker, {
  Panel1,
  Swatches,
  Preview,
  OpacitySlider,
  HueSlider,
} from "reanimated-color-picker";

const hueSlider = ({ onColorChange }) => {
  const [selectedColor, setSelectedColor] = useState("#ffffff");

  // Note: 👇 This can be a `worklet` function.
  const onSelectColor = (color) => {
    const hex = color.hex;
    setSelectedColor(hex);
    onColorChange(hex); // Appel de la fonction de rappel avec la nouvelle couleur
  };

  return (
    <View style={styles.container}>
      <ColorPicker
        style={{ width: "70%" }}
        value={selectedColor}
        onComplete={onSelectColor}
      >
        <HueSlider />
      </ColorPicker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    margin: 0,
  },
  hueSliderContainer: {
    width: "100%",
    alignItems: "center",
  },
  HueSlider: {
    width: "100%",
    backgroundColor: "#5E376B",
    borderRadius: 10,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 30,
  },
});
export default hueSlider;
