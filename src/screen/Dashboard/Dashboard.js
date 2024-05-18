import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Icon from "react-native-vector-icons/MaterialIcons";

const Dashboard = ({ navigation }) => {
  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem("authToken");

      navigation.navigate("SignIn");
    } catch (error) {
      console.error("Error during logout:", error);
      // Gérer les erreurs de déconnexion
    }
  };
  return (
    <LinearGradient
      colors={["#421053", "#261B29"]}
      locations={[0.1, 0.25]}
      style={styles.container}
    >
      <View>
        <Text style={styles.title}>Dashboard</Text>
      </View>
      <View style={styles.containerCard}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Lights")}
        >
          <View style={styles.circle}>
            <Icon name="lightbulb-outline" size={50} color="white" />
          </View>
          <Text style={styles.cardTitle}>Lumières</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <View style={styles.circle}>
            <Icon name="desktop-windows" size={50} color="white" />
          </View>
          <Text style={styles.cardTitle}>Equipements</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <View style={styles.circle}>
            <Icon name="check" size={50} color="white" />
          </View>
          <Text style={styles.cardTitle}>To-do list</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <View style={styles.circle}>
            <Icon name="description" size={50} color="white" />
          </View>
          <Text style={styles.cardTitle}>Notes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <View style={styles.circle}>
            <Icon name="date-range" size={50} color="white" />
          </View>
          <Text style={styles.cardTitle}>Calendrier</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Rooms")}
        >
          <View style={styles.circle}>
            <Icon name="weekend" size={50} color="white" />
          </View>
          <Text style={styles.cardTitle}>Pièces</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.navbarbottom}>
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: Platform.OS === "android" ? 30 : 50,
    textAlign: "center",
    color: "white",
  },

  containerCard: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between", // Utilise space-between pour répartir les cartes uniformément avec de l'espace supplémentaire sur les côtés
    marginTop: Platform.OS === "android" ? 1 : 20,
    // Ajoute un padding horizontal pour créer un espacement supplémentaire sur les côtés
    alignItems: "flex-start",
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#53315F",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 10,
  },
  cardTitle: {
    color: "white",
    fontSize: 17,
    textAlign: "center",
    fontWeight: "bold",
  },
  card: {
    width: "49%", // Utilise 48% pour laisser un petit espace entre les cartes
    height: Platform.OS === "android" ? 150 : 180,
    borderRadius: 10,
    backgroundColor: "#5E376B",
    marginBottom: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    borderRadius: 5,
    flex: 1, // Utilisez flex: 1 pour que le bouton occupe tout l'espace disponible dans le conteneur parent
    marginHorizontal: 5, // Ajoute une marge horizontale entre les boutons
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
    flex: 1, // Utilisez flex: 1 pour que le TouchableOpacity occupe tout l'espace disponible dans le conteneur parent
  },
});

export default Dashboard;
