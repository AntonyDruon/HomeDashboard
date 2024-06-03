import React from "react";
import { View, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";

const BrightnessSlider = ({ brightness, onBrightnessChange, min, max }) => {
  return (
    <View style={styles.sliderContainer}>
      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        value={brightness}
        onValueChange={onBrightnessChange}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
        thumbTintColor="#FFFFFF"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    marginTop: 5,
    width: "100%",
  },
  slider: {
    width: "100%",
    height: 40,
  },
});

export default BrightnessSlider;
