import React, { useState, useEffect } from "react";
import env from "../../../env";
const { NANOLEAF_IP } = env;
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  Platform,
  FlatList,
  Switch,
  Pressable,
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

import {
  useGetTokenNanoleafMutation,
  useToggleNanoleafMutation,
  useSetBrightnessNanoleafMutation,
  useInsertTokenToBDDMutation,
  useGetTokenFromBDDQuery,
  useInsertDataNanoleafMutation,
  useGetDataNanoleafBDDQuery,
} from "../../slice/nanoleafApiSlice";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import ToggleSwitch from "../../component/toggleSwitch";
import BrightnessSlider from "../../component/brightnessSlider"; // Importer le composant BrightnessSlider
import HueSlider from "../../component/hueSlider";

const Light = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [ModalNanoleafVisible, setModalNanoleafVisible] = useState(false);
  const [username, setUsername] = useState(null);
  const { data: bridgeIp } = useGetBridgeIPQuery();
  const [insertHueBridgeToken] = useInsertHueBridgeTokenMutation();
  const { data: hueBridgeToken } = useGetHueBridgeTokenQuery();
  const [dataHue, setDataHue] = useState([]);
  const [dataStateHue, setDataStateHue] = useState([]);
  const { data: getDataHueLights } = useGetDataHueLightsQuery();
  const [insertDataHue] = useInsertDataHueMutation();
  const [insertDataNanoleaf] = useInsertDataNanoleafMutation();
  const globalToggleState = dataStateHue.every((item) => item.state === 1);
  const globalToggleStateNanoleaf =
    getDataNanoleafBDD && getDataNanoleafBDD.some((item) => item.state === 1);

  const [dataStateNanoleaf, setDataStateNanoleaf] = useState([]);
  const [modifyStatusHueLights] = useModifyStatusHueLightsMutation();
  const [brightness, setBrightness] = useState(200);
  const [brightnessNanoleaf, setBrightnessNanoleaf] = useState(50); // Valeur initiale de la luminosité
  const [getTokenNanoleaf] = useGetTokenNanoleafMutation();
  const [insertTokenToBDD] = useInsertTokenToBDDMutation();
  const { data: getDataNanoleafBDD } = useGetDataNanoleafBDDQuery();
  const { data: tokenNanoleaf } = useGetTokenFromBDDQuery();
  const [nanoleafBgColor, setNanoleafBgColor] = useState("#000");
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    // Effectuez ici toutes les actions nécessaires lorsque les données des lampes sont récupérées
    if (getDataHueLights) {
      // Mettre à jour l'état des données des lampes
      setDataStateHue(getDataHueLights);
    }
  }, [getDataHueLights]);

  useEffect(() => {
    if (getDataNanoleafBDD) {
      console.log("getDataNanoleafBDD", getDataNanoleafBDD) *
        setDataStateNanoleaf(getDataNanoleafBDD);
    }
  }, [getDataNanoleafBDD]);
  const handleBrightnessChange = (value) => {
    console.log("Brightness value:", value);
    dataStateHue.forEach((item) => {
      setLightBrightness(item.id_light, value);
    });
    setBrightness(value); // Mise à jour de l'état local de la luminosité
  };

  useEffect(() => {
    const fetchData = async () => {
      const hueData = await getHueState();
      if (hueData) {
        // Convertir la valeur de teinte en couleur HEX
        const hue = hueData.value;
        const hexColor = hueToHex(hue);
        setNanoleafBgColor(hexColor); // Mettre à jour la couleur de fond de la carte Nanoleaf
      }
    };
  }, []);
  const handleBrightnessChangeNanoleaf = (value) => {
    setLightBrightnessNanoleaf(value);
    setBrightnessNanoleaf(value);
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
  const setLightBrightnessNanoleaf = async (value) => {
    try {
      const tokenString = tokenNanoleaf[0].token.toString();
      const url = `http://${NANOLEAF_IP}/api/v1/${tokenString}/state`;
      const brightness = Math.floor(value);
      const body = JSON.stringify({ brightness: { value: brightness } });
      const response = await fetch(url, { method: "PUT", body });
      if (response.ok) {
        setBrightnessNanoleaf(value);
      } else {
        throw new Error("Failed to set brightness for Nanoleaf");
      }
    } catch (error) {
      console.error("Error setting brightness for Nanoleaf:", error);
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
  const showModalNanoleaf = () => {
    setModalNanoleafVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const hideModalNanoleaf = () => {
    setModalNanoleafVisible(false);
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
  const handleValidateNanoleaf = async () => {
    try {
      console.log("Starting validation process...");

      const response = await getTokenNanoleaf();
      const token = response.data.auth_token;

      console.log("token: ", token);
      await insertTokenToBDD({ token }).unwrap();
      console.log("étape before get all data from nanoleaf");
      setNanoleafToken(token);
      let getDatananoleaf = await getAlldataNanoleaf(token);
      console.log("getDataHue ..............", getDatananoleaf);

      const responseSendDataNanoleaf = await sendDataNanoleafLights(
        getDatananoleaf
      );
      console.log(
        "Sent Hue lights data successfully.",
        responseSendDataNanoleaf
      );

      hideModalNanoleaf();
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
  const sendDataNanoleafLights = async (getDataNanoleaf) => {
    console.log("Sending Hue lights data...");
    try {
      console.log("getDataNanoleaf", getDataNanoleaf);
      const response = await insertDataNanoleaf(getDataNanoleaf);
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
      console.log("tuuuuuuuuuuuuuu", bridgeIp[0].internalipaddress);
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

  const handleToggleNanoleaf = async (value) => {
    try {
      if (!tokenNanoleaf || !tokenNanoleaf[0] || !tokenNanoleaf[0].token) {
        throw new Error("TokenNanoleaf or its token property is undefined.");
      }

      const tokenString = tokenNanoleaf[0].token.toString();
      console.log("token: ", tokenString);
      const url = `http://${NANOLEAF_IP}/api/v1/${tokenString}/state`;
      console.log("url", url);
      const body = JSON.stringify({ on: { value } });
      console.log("value: ", value);
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });

      if (response.ok) {
        console.log("Nanoleaf state toggled successfully!");
      } else {
        throw new Error("Failed to toggle Nanoleaf state.");
      }
    } catch (error) {
      console.error("Error toggling Nanoleaf state:", error);
    }
  };

  const getAlldataNanoleaf = async (token) => {
    console.log("token: get all data nanoleaf ", token);
    const url = `http://${NANOLEAF_IP}:16021/api/v1/${token}`;
    console.log(" url ", url);
    try {
      const response = await fetch(
        `http://${NANOLEAF_IP}:16021/api/v1/${token}`
      );

      console.log("response all data", response);
      const data = await response.json();
      console.log("data all ", data);
      return data;
    } catch (error) {
      console.error("Error fetching Nanoleaf data:", error);
    }
  };
  const getHueState = async () => {
    try {
      const token = tokenNanoleaf[0].token.toString();
      const url = `http://${NANOLEAF_IP}/api/v1/${token}/state/hue`;
      console.log();
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Handle the response data as needed
        return data;
      } else {
        throw new Error(`Failed to get hue state: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error getting hue state:", error);
    }
  };

  const handleColorChange = (selectedColor) => {
    setColor(selectedColor);
    console.log("selectedColorrrrrrrrrrrr", color);
    let hueColor = hexToXY(color);
    let hsvColor = hexToRgb(color);
    let colorHue = rgbToHsv(hsvColor);
    console.log("hsssssssvColor", hsvColor);
    console.log("eeeeeeeeeeeeeeeeeee", hueColor);
    console.log("colorHue", colorHue);
    console.log("getDataHueLights", getDataHueLights);
    updateNanoleafLights(colorHue);
    updateLights(hueColor);
  };
  const updateNanoleafLights = async (hsvColor) => {
    const token = tokenNanoleaf[0].token.toString();
    const url = `http://${NANOLEAF_IP}/api/v1/${token}/state`;
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
  const updateLights = async (hsvColor) => {
    // Extraire les IDs des lumières à partir de getDataHueLights
    const lightIds = getDataHueLights.map((light) => light.id_light);
    console.log("Updating lights with IDs:", lightIds);

    // Boucle à travers les lumières spécifiques
    lightIds.forEach(async (lightId) => {
      const url = `http://${bridgeIp[0].internalipaddress}/api/${hueBridgeToken[0].username}/lights/${lightId}/state`;
      console.log("Updating light with URL:", url);

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
          console.error(
            `Failed to update light ${lightId}:`,
            await response.json()
          );
        } else {
          console.log(`Light ${lightId} updated successfully.`);
        }
      } catch (error) {
        console.error(`Error updating light ${lightId}:`, error);
      }
    });
  };

  const hueToHex = (hue) => {
    const h = hue / 60;
    const c = 1;
    const x = c * (1 - Math.abs((h % 2) - 1));
    let r, g, b;

    if (h >= 0 && h < 1) {
      [r, g, b] = [c, x, 0];
    } else if (h >= 1 && h < 2) {
      [r, g, b] = [x, c, 0];
    } else if (h >= 2 && h < 3) {
      [r, g, b] = [0, c, x];
    } else if (h >= 3 && h < 4) {
      [r, g, b] = [0, x, c];
    } else if (h >= 4 && h < 5) {
      [r, g, b] = [x, 0, c];
    } else if (h >= 5 && h < 6) {
      [r, g, b] = [c, 0, x];
    }

    const m = 0;
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
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

  useEffect(() => {}, [dataStateHue]);

  return (
    <LinearGradient
      colors={["#421053", "#261B29"]}
      locations={[0.1, 0.25]}
      style={styles.container}
    >
      <View style={styles.navbarSync}>
        <TouchableOpacity style={styles.syncBtn} onPress={showModalNanoleaf}>
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
      <View
        style={{
          alignItems: "center",
          width: "100%",
          backgroundColor: "#421053",
        }}
      >
        <HueSlider color={color} onColorChange={handleColorChange} />
      </View>
      <TouchableOpacity
        style={styles.containerCard}
        onPress={() =>
          navigation.navigate("Hue", {
            dataStateHue,
            bridgeIp: bridgeIp[0].internalipaddress,
            hueBridgeToken: hueBridgeToken[0].username,
          })
        }
      >
        <View style={styles.row}>
          <Text style={styles.text}>Phillips Hue Lights</Text>
          <ToggleSwitch
            initialValue={globalToggleState}
            onToggle={handleGlobalToggle}
          />
        </View>
        <BrightnessSlider
          brightness={127}
          onBrightnessChange={handleBrightnessChange}
          min={0}
          max={254}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.containerCard, { backgroundColor: nanoleafBgColor }]}
        onPress={() =>
          navigation.navigate("Nanoleaf", {
            dataStateNanoleaf,
            token: tokenNanoleaf[0].token.toString(),
            ip: NANOLEAF_IP,
          })
        }
      >
        <View style={styles.row}>
          <Text style={styles.text}>Nanoleaf Light</Text>
          <ToggleSwitch
            initialValue={globalToggleStateNanoleaf}
            onToggle={handleToggleNanoleaf}
          />
        </View>
        <BrightnessSlider
          brightness={50}
          onBrightnessChange={handleBrightnessChangeNanoleaf}
          min={0}
          max={100}
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
        <Modal
          style={{ height: 50 }}
          animationType="slide"
          transparent={true}
          visible={ModalNanoleafVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Veuilez appuyer sur le bouton on-off de votre Nanoleaf pendant 5
                secondes avant de valider.
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
                  onPress={handleValidateNanoleaf}
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
                  onPress={hideModalNanoleaf}
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
  containerCardNanoleaf: {
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
    fontWeight: "bold",
    fontSize: 16,
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
