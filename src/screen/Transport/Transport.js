import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Transport = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [busRoutes, setBusRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour appeler l'API et récupérer les données des lignes de bus
  const fetchBusRoutes = async () => {
    try {
      const response = await fetch(
        "https://prim.iledefrance-mobilites.fr/marketplace/general-info/v1/trafic-lignes",
        {
          headers: {
            Authorization: "Bearer {your_api_key}",
          },
        }
      );
      const data = await response.json();
      setBusRoutes(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching bus routes:", error);
      setError(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBusRoutes();
  }, []);

  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      navigation.navigate("SignIn");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <LinearGradient
      colors={["#421053", "#261B29"]}
      locations={[0.1, 0.25]}
      style={styles.container}
    >
      <TouchableOpacity style={styles.addButton} onPress={showModal}>
        <Icon name="add" size={24} color="white" />
        <Text style={styles.addButtonText}>Ajouter un trajet</Text>
      </TouchableOpacity>

      <View>
        <Text style={styles.title}>Transport - Ligne de Bus</Text>
      </View>

      <ScrollView contentContainerStyle={styles.containerCard}>
        {isLoading ? (
          <Text style={styles.noRoutesText}>Chargement en cours...</Text>
        ) : error ? (
          <Text style={styles.noRoutesText}>
            Erreur de chargement des données
          </Text>
        ) : busRoutes.length > 0 ? (
          busRoutes.map((route) => (
            <TouchableOpacity key={route.id} style={styles.card}>
              <Text style={styles.cardTitle}>{route.name}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noRoutesText}>Aucun trajet disponible</Text>
        )}
      </ScrollView>

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

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Ajoutez un nouveau trajet</Text>
            <View style={styles.buttonContainerModal}>
              <TouchableOpacity style={styles.modalButton} onPress={hideModal}>
                <Text style={{ color: "white" }}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: Platform.OS === "android" ? 30 : 50,
    marginTop: 150,
    textAlign: "center",
    color: "white",
  },
  containerCard: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: Platform.OS === "android" ? 10 : 20,
    alignItems: "flex-start",
    width: "100%",
  },
  cardTitle: {
    color: "white",
    fontSize: 17,
    textAlign: "center",
    fontWeight: "bold",
  },
  card: {
    width: "49%",
    height: Platform.OS === "android" ? 70 : 100,
    borderRadius: 10,
    backgroundColor: "#5E376B",
    marginBottom: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
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
    flex: 1,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: Platform.OS === "android" ? 30 : 40,
    right: 20,
    backgroundColor: "#4F4353",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  addButtonText: {
    color: "white",
    marginLeft: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  buttonContainerModal: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  modalButton: {
    width: "45%",
    height: 50,
    borderRadius: 5,
    backgroundColor: "#4F4353",
    justifyContent: "center",
    alignItems: "center",
  },
  noRoutesText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});

export default Transport;
