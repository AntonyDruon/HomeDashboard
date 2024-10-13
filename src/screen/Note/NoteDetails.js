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
  useDeleteFieldNoteMutation,
  useUpdateFieldNoteMutation,
} from "../../slice/noteApiSlice";

const NoteDetail = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [name, setName] = useState("");
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [field, setField] = useState([]);
  const route = useRoute();
  const { note } = route.params;

  const [createNoteField] = useCreateFieldNoteMutation();
  const [deleteFieldNote] = useDeleteFieldNoteMutation();
  const [updateFieldNote] = useUpdateFieldNoteMutation();
  const { data: getFieldNote, refetch } = useGetFieldNoteQuery(note.id_note);

  useEffect(() => {
    if (getFieldNote) {
      setField(getFieldNote);
    }
  }, [getFieldNote]);

  const showModal = () => {
    setIsEditMode(false); // Nouveau champ
    setName("");
    setModalVisible(true);
  };

  const showEditModal = (item) => {
    setIsEditMode(true); // Modifier un champ existant
    setSelectedFieldId(item.id_field);
    setName(item.titre);
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
    setSelectedFieldId(null);
  };

  const handleValidate = async () => {
    if (isEditMode && selectedFieldId) {
      // Modifier un champ existant
      try {
        const data = { id_field: selectedFieldId, title: name };
        const response = await updateFieldNote(data).unwrap();
        console.log("Field updated successfully", response);
        hideModal();
        refetch();
      } catch (error) {
        console.error("Error updating field:", error);
      }
    } else {
      // Ajouter un nouveau champ
      try {
        const data = { id_note: note.id_note, title: name };
        const response = await createNoteField(data).unwrap();
        console.log("Field created successfully", response);
        hideModal();
        refetch();
      } catch (error) {
        console.error("Error creating note:", error);
      }
    }
  };

  const handleDelete = async (id_field) => {
    try {
      await deleteFieldNote({ id_field });
      console.log("Field deleted successfullyyyyyyyyyyyyyyyyyyyy");
      refetch();
    } catch (error) {
      console.error("Error deleting field:", error);
    }
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
              <View style={styles.iconContainer}>
                <TouchableOpacity onPress={() => showEditModal(item)}>
                  <Icon name="edit" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id_field)}>
                  <Icon name="delete" size={24} color="red" />
                </TouchableOpacity>
              </View>
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

      {/* Modale pour ajouter/modifier un champ */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              {isEditMode
                ? "Modifier l'élément"
                : `Ajouter un élément à ${note.name}`}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Titre de votre champ"
              value={name}
              onChangeText={setName}
            />
            <View style={styles.buttonContainerModal}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleValidate}
              >
                <Text style={{ color: "white" }}>
                  {isEditMode ? "Modifier" : "Valider"}
                </Text>
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
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 60,
  },
});

export default NoteDetail;
