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
import {
  useCreateNoteMutation,
  useGetAllNotesQuery,
} from "../../slice/noteApiSlice";

const Note = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [note, setNote] = useState([]);
  const { data: getDataNote, refetch } = useGetAllNotesQuery();
  const [createNote, { isLoading, isSuccess, isError, error }] =
    useCreateNoteMutation();

  useEffect(() => {
    if (getDataNote) {
      console.log("getDataNote", getDataNote);
      setNote(getDataNote);
      refetch();
      console.log("note", note);
    }
  }, [getDataNote]);

  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };
  const navigateToNoteDetail = (note) => {
    navigation.navigate("NoteDetail", { note });
  };

  const handleValidate = async () => {
    try {
      // Créer un objet contenant le nom de la note
      const noteData = { name: name };

      // Appeler la fonction de mutation en passant les données
      const response = await createNote(noteData);

      // Gérer la réponse
      if (response && response.data && response.data.noteId) {
        console.log("Note created successfully");
        refetch();
      } else {
        console.error("Error creating note: Response or noteId is undefined.");
      }

      hideModal();
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
        <Text style={styles.addButtonText}>Ajouter une liste</Text>
      </TouchableOpacity>
      <View>
        <Text style={styles.title}>Notes</Text>
      </View>
      <ScrollView contentContainerStyle={styles.containerCard}>
        {Array.isArray(note) && note.length > 0 ? (
          note.map((note) => (
            <TouchableOpacity
              key={note.id_note}
              style={styles.card}
              onPress={() => navigateToNoteDetail(note)}
            >
              <Text style={styles.cardTitle}>{note.name}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noNotesText}>Aucune note disponible</Text>
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
            <Text style={styles.modalText}>
              Veuillez choisir un nom à votre liste
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nom"
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
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: Platform.OS === "android" ? 1 : 20,
    alignItems: "flex-start",
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
});

export default Note;
