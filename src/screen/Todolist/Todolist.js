import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  useCreateTodoMutation,
  useGetAllTodosQuery,
  useDeleteTodoMutation,
  useUpdateTodoMutation,
} from "../../slice/todoApiSlice";

const Todolist = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [priorityModalVisible, setPriorityModalVisible] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [activeButton, setActiveButton] = useState("incomplete");
  const [selectedTodo, setSelectedTodo] = useState(null); // Pour changer le todo sélectionné
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("a faire");
  const [priorite, setPriorite] = useState("bas");
  const [date, setDate] = useState(new Date());
  const [todos, setTodos] = useState([]);
  const { data: getAllTodos, refetch } = useGetAllTodosQuery();
  const [createTodo] = useCreateTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();
  const [updateTodo] = useUpdateTodoMutation();

  useEffect(() => {
    if (getAllTodos) {
      setTodos(getAllTodos);
    }
  }, [getAllTodos]);

  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const handleValidate = async () => {
    try {
      const newTodo = {
        title,
        date: new Date().toISOString().split("T")[0],
        status,
        priorite,
      };
      await createTodo(newTodo);
      hideModal();
      refetch();
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  const handleDelete = async (id_todo) => {
    try {
      await deleteTodo(id_todo);
      refetch();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleUpdate = async (todoId, updatedData) => {
    try {
      const currentDate = new Date().toISOString().split("T")[0];
      const updated_at = new Date().toISOString();
      const updatedTodo = {
        ...updatedData,
        date: currentDate,
        updated_at,
      };
      await updateTodo({ id_todo: todoId, ...updatedTodo });
      refetch();
    } catch (error) {
      console.error("Error updating todo:", error);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const statusOptions = ["a faire", "en cours", "terminé"];
  const priorityOptions = ["haut", "moyen", "bas"];

  const getPriorityBorderColor = (priorite) => {
    switch (priorite) {
      case "haut":
        return "#FF6347";
      case "moyen":
        return "#FFD700";
      case "bas":
        return "#32CD32";
      default:
        return "#E4E4E4";
    }
  };

  const getButtonStyle = (type, value) => ({
    backgroundColor: type === value ? "#5E376B" : "#4F4353",
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: "center",
  });

  const showStatusModal = (todo) => {
    setSelectedTodo(todo); // Sélectionner le todo pour lequel on souhaite changer le statut
    setStatusModalVisible(true);
  };

  const showPriorityModal = (todo) => {
    setSelectedTodo(todo); // Sélectionner le todo pour lequel on souhaite changer la priorité
    setPriorityModalVisible(true);
  };

  const handleStatusChange = (newStatus) => {
    const updatedData = {
      title: selectedTodo.titre,
      date: selectedTodo.date,
      priorite: selectedTodo.priorite,
      status: newStatus,
    };
    handleUpdate(selectedTodo.id_todo, updatedData);
    setStatusModalVisible(false);
  };

  const handlePriorityChange = (newPriority) => {
    const updatedData = {
      title: selectedTodo.titre,
      date: selectedTodo.date,
      priorite: newPriority,
      status: selectedTodo.status,
    };
    handleUpdate(selectedTodo.id_todo, updatedData);
    setPriorityModalVisible(false);
  };

  const filteredTodos = todos.filter((todo) =>
    showCompleted ? todo.status === "terminé" : todo.status !== "terminé"
  );

  const handleButtonPress = (buttonType) => {
    setActiveButton(buttonType);
    setShowCompleted(buttonType === "completed");
  };

  return (
    <LinearGradient
      colors={["#421053", "#261B29"]}
      locations={[0.1, 0.25]}
      style={styles.container}
    >
      <TouchableOpacity style={styles.addButton} onPress={showModal}>
        <Icon name="add" size={24} color="white" />
        <Text style={styles.addButtonText}>Ajouter une tâche</Text>
      </TouchableOpacity>

      <View>
        <Text style={styles.title}>To do list</Text>
      </View>

      <View style={styles.statusToggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            activeButton === "incomplete" && styles.activeButton,
          ]}
          onPress={() => handleButtonPress("incomplete")}
        >
          <Text style={styles.toggleButtonText}>Tâches en cours</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            activeButton === "completed" && styles.activeButton,
          ]}
          onPress={() => handleButtonPress("completed")}
        >
          <Text style={styles.toggleButtonText}>Tâches terminées</Text>
        </TouchableOpacity>
      </View>

      {/* Liste des tâches avec ScrollView ajustée */}
      <ScrollView
        contentContainerStyle={styles.containerCard}
        style={styles.scrollView}
      >
        {Array.isArray(filteredTodos) && filteredTodos.length > 0 ? (
          filteredTodos.map((todo) => (
            <View key={todo.id_todo} style={styles.cardContainer}>
              <LinearGradient
                colors={["#4F4353", "#261B29"]}
                style={styles.card}
              >
                <TouchableOpacity
                  style={styles.deleteIcon}
                  onPress={() => handleDelete(todo.id_todo)}
                >
                  <Icon name="close" size={25} color="white" />
                </TouchableOpacity>

                <Text style={styles.cardTitle}>{todo.titre}</Text>
                <Text style={styles.cardTime}>{formatDate(todo.date)}</Text>

                <View style={styles.statusPriorityContainer}>
                  <TouchableOpacity onPress={() => showStatusModal(todo)}>
                    <Text style={styles.statusText}>{todo.status}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => showPriorityModal(todo)}>
                    <Text
                      style={[
                        styles.priorityText,
                        { borderColor: getPriorityBorderColor(todo.priorite) },
                      ]}
                    >
                      {todo.priorite}
                    </Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          ))
        ) : (
          <Text style={styles.noTodosText}>Aucune tâche disponible</Text>
        )}
      </ScrollView>

      {/* Barre de navigation en bas */}
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

      {/* Modal pour ajouter une tâche */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Ajouter une nouvelle tâche</Text>
            <TextInput
              style={styles.input}
              placeholder="Titre de la tâche"
              value={title}
              onChangeText={setTitle}
            />

            <View style={styles.row}>
              {statusOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={getButtonStyle(status, option)}
                  onPress={() => setStatus(option)}
                >
                  <Text style={styles.buttonText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.row}>
              {priorityOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={getButtonStyle(priorite, option)}
                  onPress={() => setPriorite(option)}
                >
                  <Text style={styles.buttonText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                const currentDate = selectedDate || date;
                setDate(currentDate);
              }}
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

      {/* Modal pour changer le statut */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={statusModalVisible}
        onRequestClose={() => setStatusModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Changer le statut</Text>
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.modalOption}
                onPress={() => handleStatusChange(option)}
              >
                <Text style={styles.modalOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setStatusModalVisible(false)}>
              <Text style={styles.modalCloseText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal pour changer la priorité */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={priorityModalVisible} // Cette fois-ci, on montre bien la modal de priorité
        onRequestClose={() => setPriorityModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Changer la priorité</Text>
            {priorityOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.modalOption}
                onPress={() => handlePriorityChange(option)}
              >
                <Text style={styles.modalOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setPriorityModalVisible(false)}>
              <Text style={styles.modalCloseText}>Fermer</Text>
            </TouchableOpacity>
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
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 30,
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
  scrollView: {
    flex: 1,
    marginBottom: 80,
  },
  toggleButton: {
    backgroundColor: "#4F4353",
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: "#8B5E83",
  },
  toggleButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: Platform.OS === "android" ? 30 : 50,
    marginTop: 150,
    textAlign: "center",
    color: "white",
    fontFamily: "Poppins-Bold",
  },
  containerCard: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  cardContainer: {
    width: "100%",
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
  },
  card: {
    borderRadius: 10,
    padding: 15,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    fontFamily: "Poppins-Bold",
  },
  cardTime: {
    marginTop: 5,
    fontSize: 14,
    color: "white",
    fontFamily: "Poppins-Regular",
  },
  statusPriorityContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  statusText: {
    color: "white",
    marginRight: 20,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    padding: 5,
    borderRadius: 5,
  },
  priorityText: {
    color: "white",
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
  },
  noTodosText: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  modalOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  modalOptionText: {
    fontSize: 16,
  },
  modalCloseText: {
    color: "blue",
    marginTop: 20,
    fontSize: 16,
  },
  deleteIcon: {
    position: "absolute",
    right: 10,
    top: 10,
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
    marginTop: 20,
  },
  modalButton: {
    width: "45%",
    height: 50,
    borderRadius: 5,
    backgroundColor: "#4F4353",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flex: 1,
  },
  button: {
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  statusToggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
    marginVertical: 0,
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
});

export default Todolist;
