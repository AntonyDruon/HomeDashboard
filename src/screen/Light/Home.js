import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  Platform,
  FlatList,
  Switch,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  useGetBridgeIPQuery,
  useInsertHueBridgeTokenMutation,
  useGetHueBridgeTokenQuery,
  useInsertDataHueMutation,
  useGetDataHueLightsQuery,
  useModifyStatusHueLightsMutation,
  useModifyBrightnessAllHueLightsMutation,
  useGetDevicesQuery,
} from "../../slice/lightApiSlice";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import ToggleSwitch from "../../component/toggleSwitch";
import BrightnessSlider from "../../component/brightnessSlider"; // Importer le composant BrightnessSlider

const Light = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [username, setUsername] = useState(null);
  const { data: bridgeIp } = useGetBridgeIPQuery();
  const [insertHueBridgeToken] = useInsertHueBridgeTokenMutation();
  const { data: hueBridgeToken } = useGetHueBridgeTokenQuery();
  const [dataHue, setDataHue] = useState([]);
  const [dataStateHue, setDataStateHue] = useState([]);
  const { data: getDataHueLights } = useGetDataHueLightsQuery();
  const [insertDataHue] = useInsertDataHueMutation();
  const globalToggleState = dataStateHue.every((item) => item.state === 1);
  const [modifyStatusHueLights] = useModifyStatusHueLightsMutation();
  const [brightness, setBrightness] = useState(200); // Valeur initiale de la luminosité

  useEffect(() => {
    // Effectuez ici toutes les actions nécessaires lorsque les données des lampes sont récupérées
    if (getDataHueLights) {
      // Mettre à jour l'état des données des lampes
      setDataStateHue(getDataHueLights);
    }
  }, [getDataHueLights]);
  const handleBrightnessChange = (value) => {
    console.log("Brightness value:", value);
    dataStateHue.forEach((item) => {
      setLightBrightness(item.id_light, value);
    });
    setBrightness(value); // Mise à jour de l'état local de la luminosité
  };
  const setLightBrightness = async (id_light, value) => {
    const bridgeIpAddress = bridgeIp?.[0]?.internalipaddress;
    const username = hueBridgeToken?.[0]?.username;

    if (!bridgeIpAddress) {
      console.error("Bridge IP not found");
      return;
    }
    if (!username) {
      console.error("Hue Bridge Token not found");
      return;
    }

    const url = `http://${bridgeIpAddress}/api/${username}/lights/${id_light}/state`;
    const brightness = Math.floor(value);

    const body = JSON.stringify({ bri: brightness });
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });
      const data = await response.json();
      console.log(`Set light brightness response for light ${id_light}:`, data);

      if (response.ok) {
        // Si la requête a réussi, mettre à jour l'état local
        setDataStateHue((prevState) =>
          prevState.map((light) =>
            light.id_light === id_light ? { ...light, bri: value } : light
          )
        );
      } else {
        throw new Error(`Failed to set brightness for light ${id_light}.`);
      }
    } catch (error) {
      console.error(
        `Error setting light brightness for light ${id_light}:`,
        error
      );
    }
  };

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem("token");
      navigation.navigate("SignIn");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const handleValidate = async () => {
    try {
      console.log("Starting validation process...");

      // Fetch the username and wait for it to complete
      const fetchedUsername = await fetchUsername();
      console.log("Fetched username handlevalidate:", fetchedUsername);

      // Insert light entry and wait for it to complete
      await insertLightEntry(fetchedUsername);
      console.log("Inserted light entry for username:", fetchedUsername);

      // Fetch Hue lights data and wait for it to complete
      let getDataHue = await fetchHueLights(fetchedUsername); // Pass the username if needed
      console.log("getDataHue ..............", getDataHue);

      const responseSendData = await sendDataHueLights(getDataHue);
      console.log("Sent Hue lights data successfully.", responseSendData);

      console.log("Validation process completed successfully.");
      hideModal();
    } catch (error) {
      console.error("Error during validation:", error);
    }
  };
  const fetchHueLights = async (fetchedUsername) => {
    try {
      const url = `http://${bridgeIp[0].internalipaddress}/api/${fetchedUsername}/lights`;
      const response = await fetch(url);

      if (response.ok) {
        const getDataHue = await response.json();
        setDataHue(getDataHue);
        console.log("Fetched Hue lights data:", getDataHue);
        return getDataHue;
      } else {
        throw new Error("Failed to fetch Hue lights.");
      }
    } catch (error) {
      console.error("Error fetching Hue lights:", error);
      throw error; // Re-throw the error to be caught in handleValidate
    }
  };
  const sendDataHueLights = async (getDataHue) => {
    console.log("Sending Hue lights data...");
    try {
      const response = await insertDataHue(getDataHue);
      console.log("await reponse", response);
      if (response.error) {
        throw new Error(
          "Error while sending Hue lights data: " + response.error
        );
      } else {
        console.log("Hue lights data sent successfully:", response.data);
        return response.data;
      }
    } catch (error) {
      console.error("Error while sending Hue lights data:", error);
      throw error; // Re-throw the error to be caught in handleValidate
    }
  };
  const fetchUsername = async () => {
    try {
      const response = await fetch(
        `http://${bridgeIp[0].internalipaddress}/api`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ devicetype: "Lumis" }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (
          Array.isArray(data) &&
          data.length > 0 &&
          data[0].success &&
          data[0].success.username
        ) {
          const fetchedUsername = data[0].success.username;
          console.log("Fetched username:", fetchedUsername);
          setUsername(fetchedUsername); // Optionnel : Mettre à jour l'état si nécessaire pour d'autres parties du composant
          return fetchedUsername;
        } else {
          throw new Error("Username not found in response.");
        }
      } else {
        throw new Error("Failed to fetch username.");
      }
    } catch (error) {
      console.error("Error fetching username:", error);
      throw error; // Re-jeter l'erreur pour être attrapée dans handleValidate
    }
  };

  const insertLightEntry = async (username) => {
    try {
      await insertHueBridgeToken(username).unwrap();
      console.log("Light entry inserted successfully for username:", username);
    } catch (error) {
      console.error("Error inserting light entry:", error);
      throw error; // Re-throw the error to be caught in handleValidate
    }
  };
  const handleGlobalToggle = (value) => {
    // Mettez à jour l'état des deux lampes en fonction de la valeur du ToggleSwitch global
    dataStateHue.forEach((item) => {
      handleToggle(item.id_light, value);
    });
  };
  const handleToggle = async (id_light, value) => {
    try {
      console.log("teeeee", hueBridgeToken[0].username);
      const url = `http://${bridgeIp[0].internalipaddress}/api/${hueBridgeToken[0].username}/lights/${id_light}/state`;

      // Construire le corps de la requête
      const body = JSON.stringify({ on: value });

      // Envoyer la requête à l'API Bridge pour changer l'état de la lumière
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });

      if (response.ok) {
        // Si la requête a réussi, mettre à jour l'état local
        setDataStateHue((prevState) =>
          prevState.map((light) =>
            light.id_light === id_light
              ? { ...light, state: value ? 1 : 0 }
              : light
          )
        );

        // Utiliser la fonction de rappel de setDataStateHue pour garantir que les données sont à jour
        setDataStateHue((updatedDataStateHue) => {
          // Appeler modifyStatusHueLights avec les données mises à jour
          modifyStatusHueLights(updatedDataStateHue);
          return updatedDataStateHue; // Retourner les données mises à jour pour s'assurer qu'elles sont correctement enregistrées dans le state
        });
      } else {
        throw new Error("Failed to toggle light state.");
      }
    } catch (error) {
      console.error("Error toggling light state:", error);
    }
  };

  useEffect(() => {
    // Appeler modifyStatusHueLights ici si nécessaire
  }, [dataStateHue]);

  return (
    <LinearGradient
      colors={["#421053", "#261B29"]}
      locations={[0.1, 0.25]}
      style={styles.container}
    >
      <View style={styles.navbarSync}>
        <TouchableOpacity style={styles.syncBtn} onPress={showModal}>
          <View>
            <Text style={styles.textBtnSync}>Sync Nanoleaf</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.syncBtn} onPress={showModal}>
          <View>
            <Text style={styles.textBtnSync}>Sync Bridge Phillips Hue</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.title}>Lumières</Text>
      </View>
      <TouchableOpacity style={styles.containerCard}>
        <View style={styles.row}>
          <Text style={styles.text}>Phillips Hue Lights</Text>
          <ToggleSwitch
            initialValue={globalToggleState}
            onToggle={handleGlobalToggle}
          />
        </View>
        <BrightnessSlider
          brightness={brightness}
          onBrightnessChange={handleBrightnessChange}
        />
      </TouchableOpacity>

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
        <Modal
          style={{ height: 50 }}
          animationType="slide"
          transparent={true}
          visible={modalVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Veuillez appuyer sur votre pont Bridge Hue connecté à votre
                réseau internet
              </Text>
              <View style={styles.buttonContainerModal}>
                <TouchableOpacity
                  style={{
                    width: "45%",
                    height: 50,
                    borderRadius: 5,
                    backgroundColor: "#4F4353",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={handleValidate}
                >
                  <Text style={{ color: "white" }}>Valider</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: "45%",
                    height: 50,
                    borderRadius: 5,
                    backgroundColor: "#4F4353",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={hideModal}
                >
                  <Text style={{ color: "white" }}>Annuler</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 150,
    marginBottom: Platform.OS === "android" ? 30 : 50,
    textAlign: "center",
    color: "white",
  },
  navbarSync: {
    borderRadius: 5,
    width: 250,
    height: 50,
    position: "absolute",
    top: 50,
    right: 20,

    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  syncBtn: {
    borderRadius: 5,
    width: 120,
    height: 50,

    backgroundColor: "#5E376B",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  containerCard: {
    backgroundColor: "#5E376B",
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  text: {
    color: "white",
  },
  slider: {
    width: "100%",
    marginTop: 10,
  },
  centeredView: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    height: "30%",
    width: "80%",
  },
  modalText: {
    height: "50%",
    textAlign: "center",
    fontSize: 20,
  },

  button: {
    borderRadius: 5,
    flex: 1, // Utilisez flex: 1 pour que le bouton occupe tout l'espace disponible dans le conteneur parent
    marginHorizontal: 5, // Ajoute une marge horizontale entre les boutons
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  textBtnSync: {
    color: "white",
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
  buttonContainerModal: {
    height: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
  },
});

export default Light;
