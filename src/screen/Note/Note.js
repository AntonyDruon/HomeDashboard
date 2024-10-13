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
  useDeleteNoteMutation,
  useUpdateFieldNoteMutation,
  useUpdateNoteMutation, // Import de la mutation pour mise à jour
} from "../../slice/noteApiSlice";

const Note = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false); // Modale pour éditer
  const [name, setName] = useState("");
  const [note, setNote] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [editName, setEditName] = useState(""); // Nom de la note à éditer
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const { data: getDataNote, refetch } = useGetAllNotesQuery();
  const [createNote] = useCreateNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();
  const [updateNote] = useUpdateNoteMutation(); // Utilisation de la mutation pour mise à jour

  useEffect(() => {
    if (getDataNote) {
      setNote(getDataNote);
      refetch();
    }
  }, [getDataNote]);

  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const handleValidate = async () => {
    try {
      const noteData = { name };
      const response = await createNote(noteData);
      if (response?.data?.noteId) {
        refetch();
      }
      hideModal();
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };
  const navigateToNoteDetail = (note) => {
    navigation.navigate("NoteDetail", { note });
  };
  const showEditModal = (note) => {
    setSelectedNoteId(note.id_note);
    setEditName(note.name); // Pré-remplir la modale avec le nom de la note
    setEditModalVisible(true);
  };

  const hideEditModal = () => {
    setEditModalVisible(false);
  };

  const handleEditNote = async () => {
    try {
      if (selectedNoteId) {
        await updateNote({ id_note: selectedNoteId, name: editName });
        refetch();
        hideEditModal();
      }
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleDelete = async () => {
    try {
      if (selectedNoteId) {
        await deleteNote(selectedNoteId);
        refetch();
        hideDeleteModal();
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const showDeleteModal = (id_note) => {
    setSelectedNoteId(id_note);

    setDeleteModalVisible(true);
  };

  const hideDeleteModal = () => {
    setDeleteModalVisible(false);
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

              <TouchableOpacity onPress={() => showEditModal(note)}>
                <Icon name="edit" size={26} color="blue" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => showDeleteModal(note.id_note)}>
                <Icon name="delete" size={26} color="red" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noNotesText}>Aucune note disponible</Text>
        )}
      </ScrollView>

      {/* Modale pour ajouter une nouvelle note */}
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

      {/* Modale pour modifier une note */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Modifier le nom de la note</Text>
            <TextInput
              style={styles.input}
              placeholder="Nom"
              value={editName}
              onChangeText={setEditName}
            />
            <View style={styles.buttonContainerModal}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleEditNote}
              >
                <Text style={{ color: "white" }}>Modifier</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={hideEditModal}
              >
                <Text style={{ color: "white" }}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Modale pour supprimer une note */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Attention, voulez-vous vraiment supprimer cette note ?
            </Text>
            <View style={styles.buttonContainerModal}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleDelete}
              >
                <Text style={{ color: "white" }}>Oui</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={hideDeleteModal}
              >
                <Text style={{ color: "white" }}>Non</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Footer */}
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
    fontSize: 20,
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
    flexDirection: "row",
    justifyContent: "space-evenly",
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
  noNotesText: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
  },
});

export default Note;
