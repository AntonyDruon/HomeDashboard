import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Platform,
  Modal,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import logo from "../../../assets/logohomedashboarddarkmode.png";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

import {
  useAddNewRoomMutation,
  useGetAllRoomsQuery,
} from "../../slice/roomApiSlice";

const Rooms = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [roomList, setRoomList] = useState([]);
  const [addNewRoom, { isLoading }] = useAddNewRoomMutation();
  const {
    data,
    error,
    isLoading: roomsLoading,
    refetch,
  } = useGetAllRoomsQuery();

  useEffect(() => {
    console.log("roomsdata", data);
    if (data) {
      setRoomList(data);
    }
  }, [data]);

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [])
  );
  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      navigation.navigate("SignIn");
    } catch (error) {
      console.error("Error during logout:", error);
      // Handle logout errors
    }
  };
  //   const reloadList = async () => {
  //     fetch(`${baseUrl}/rooms`);
  //   };
  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const handleSaveRoom = async () => {
    try {
      console.log("roomName", roomName);
      await addNewRoom({ name: roomName }).unwrap();
      setRoomName(""); // Clear input after successful save
      refetch();
      hideModal(); // Close modal
    } catch (error) {
      console.error("Failed to add room:", error);
    }
  };
  if (roomsLoading) {
    return (
      <ActivityIndicator style={styles.loading} size="large" color="#5E376B" />
    );
  }
  return (
    <LinearGradient
      colors={["#421053", "#261B29"]}
      locations={[0.1, 0.25]}
      style={styles.container}
    >
      <View style={styles.navbarSync}>
        <TouchableOpacity style={styles.syncBtn} onPress={showModal}>
          <View>
            <Text style={styles.textBtnSync}>Ajouter une pièce</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.title}>Pièces de la maison</Text>
      </View>

      <View style={{ width: "100%", height: "60%" }}>
        <ScrollView style={styles.dropdown}>
          {roomList.map((item) => (
            <TouchableOpacity key={item.id_room} style={styles.roomCard}>
              <Text style={styles.cardTitle}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
      <Modal
        style={{ height: 50 }}
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Veuillez rentrer le nom de la pièce
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nom de la pièce"
              value={roomName}
              onChangeText={setRoomName}
            />
            <View style={styles.buttonContainerModal}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleSaveRoom}
              >
                <Text style={{ color: "white" }}>Valider</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={hideModal}>
                <Text style={{ color: "white" }}>Annuler</Text>
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
  button: {
    borderRadius: 5,
    flex: 1, // Use flex: 1 for the button to take all available space in the parent container
    marginHorizontal: 5, // Add horizontal margin between buttons
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
    justifyContent: "flex-end",
    alignItems: "center",
  },
  syncBtn: {
    borderRadius: 5,
    padding: 10,
    height: 50,
    backgroundColor: "#5E376B",
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
  dropdown: {
    width: "100%",
  },
  buttonContainer: {
    flex: 1, // Use flex: 1 for TouchableOpacity to take all available space in the parent container
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
  input: {
    width: "100%",
    height: 60,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  roomCard: {
    width: "100%",
    height: 70,
    borderRadius: 5,
    backgroundColor: "#53315F",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonContainerModal: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cardTitle: {
    color: "white",
    fontSize: 17,
    textAlign: "center",
    fontWeight: "bold",
  },
  modalButton: {
    width: "45%",
    height: 50,
    borderRadius: 5,
    backgroundColor: "#4F4353",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Rooms;
