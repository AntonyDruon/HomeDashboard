import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import ColorPicker, {
  Panel3,
  Swatches,
  Preview,
  OpacitySlider,
  HueSlider,
} from "reanimated-color-picker";

const colorPicker = ({ onColorChange }) => {
  const [selectedColor, setSelectedColor] = useState("#ffffff");

  // Note: 👇 This can be a `worklet` function.
  const onSelectColor = ({ hex }) => {
    setSelectedColor(hex);
    onColorChange(hex); // Appel de la fonction de rappel avec la nouvelle couleur
  };

  return (
    <View style={styles.container}>
      <ColorPicker
        style={styles.colorPicker}
        value={selectedColor}
        onComplete={onSelectColor}
      >
        <Panel3 style={styles.panel3} />
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
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
  colorPicker: {
    width: "100%",
    backgroundColor: "#5E376B",
    borderRadius: 10,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 300,
  },
  panel3: {
    width: 200,
    height: 200,
  },
  slider: {
    marginVertical: 10,
    width: 200,
    height: 20,
  },
});
export default colorPicker;
