import React, { useState } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";

const ToggleSwitch = ({ label, initialValue, onToggle }) => {
  const [isEnabled, setIsEnabled] = useState(initialValue);

  const toggleSwitch = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    onToggle(newValue);
  };

  return (
    <View style={styles.container}>
      <Text>{label}</Text>
      <Switch
        style={{ transform: [{ scaleX: 1.4 }, { scaleY: 1.4 }] }}
        trackColor={{ false: "#767577", true: "#9124B6" }}
        thumbColor={isEnabled ? "#f4f3f4" : "#767577"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

export default ToggleSwitch;
