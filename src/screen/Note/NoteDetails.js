import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  Modal,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useRoute } from "@react-navigation/native";
import {
  useCreateNoteMutation,
  useGetAllNotesQuery,
  useCreateFieldNoteMutation,
  useGetFieldNoteQuery,
} from "../../slice/noteApiSlice";

const NoteDetail = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [field, setField] = useState([]);
  const route = useRoute();
  const { note } = route.params;
  const [createNoteField, { isLoading, isSuccess, isError, error }] =
    useCreateFieldNoteMutation();
  const { data: getFieldNote, refetch } = useGetFieldNoteQuery(note.id_note);

  useEffect(() => {
    console.log("Fetching fields for note ID:", note.id_note);
    if (getFieldNote) {
      console.log("getFieldNote", getFieldNote); // Log des données reçues de l'API
      setField(getFieldNote); // Mise à jour de l'état avec les champs récupérés
    }
  }, [getFieldNote, note.id_note]);

  useEffect(() => {
    console.log("field", field);
  }, [field]);

  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };
  //   const navigateToNoteDetail = (note) => {
  //     navigation.navigate("NoteDetail", { note });
  //   };

  const handleValidate = async () => {
    try {
      // Créer un objet contenant le nom de la note
      const data = { id_note: note.id_note, title: name };
      const response = await createNoteField(data).unwrap();
      console.log("Field created successfully", response);

      hideModal();
      refetch();
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

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
      <TouchableOpacity style={styles.addButton} onPress={showModal}>
        <Icon name="add" size={24} color="white" />
        <Text style={styles.addButtonText}>Ajouter un élément à la liste</Text>
      </TouchableOpacity>
      <View>
        <Text style={styles.title}>{note.name}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.containerCard}>
        {field.length > 0 ? (
          field.map((item) => (
            <View key={item.id_field} style={styles.itemContainer}>
              <Text style={styles.field}>{item.titre}</Text>
              {/* Affichez d'autres informations de item si nécessaire */}
            </View>
          ))
        ) : (
          <Text style={styles.loadingText}>Il n'y a pas de note</Text>
        )}
      </ScrollView>

      <View style={styles.navbarbottom}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => navigation.navigate("Note")}
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
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Veuillez choisir l'élement à ajouter à {note.name}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="titre de votre champ"
              value={name}
              onChangeText={setName}
            />
            <View style={styles.buttonContainerModal}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleValidate}
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
    alignItems: "center",
    paddingHorizontal: 10,
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: Platform.OS === "android" ? 30 : 50,
    marginTop: 150,
    textAlign: "center",
    color: "white",
  },
  containerCard: {
    display: "flex",
    flexDirection: "row",

    justifyContent: "space-between",
    marginTop: Platform.OS === "android" ? 1 : 20,

    width: "100%",
    backgroundColor: "#fff",
  },

  containerCard: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: Platform.OS === "android" ? 10 : 20,
    alignItems: "flex-start",
    width: "100%",
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
  input: {
    width: "85%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
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
  itemContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#5E376B",
    width: "100%",
  },
  field: {
    width: "60%",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
  },
});

export default NoteDetail;
