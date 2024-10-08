import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useGetAllTodosQuery } from "../../slice/todoApiSlice";

const DailyTasks = ({ route, navigation }) => {
  const { date } = route.params; // Date sélectionnée dans le calendrier au format 'YYYY-MM-DD'
  const { data: todos, error, isLoading, refetch } = useGetAllTodosQuery();

  // Log la date que tu reçois du calendrier
  console.log("Date reçue du calendrier:", date);

  // Helper function to format date to 'JJ/MM/YYYY'
  const formatDate = (dateString) => {
    if (!dateString) return null;
    // Convert to local date string in 'DD/MM/YYYY' format
    return new Date(dateString).toLocaleDateString("fr-FR"); // 'fr-FR' returns 'DD/MM/YYYY'
  };

  // Filtrer les tâches en fonction de la date sélectionnée ET du statut (à faire ou en cours)
  const tasksForDate = todos?.filter((task) => {
    if (!task.date) {
      console.warn("Tâche sans date:", task);
      return false;
    }

    // Log la date des tâches reçues de l'API
    console.log("Date de la tâche avant conversion:", task.date);

    const taskDate = new Date(task.date).toLocaleDateString("fr-FR"); // Conversion de la date en locale

    console.log("Date de la tâche après conversion:", taskDate);

    return (
      taskDate === formatDate(date) &&
      (task.status === "a faire" || task.status === "en cours")
    );
  });

  useEffect(() => {
    refetch(); // Re-fetch les données quand la page est visitée
  }, []);

  if (isLoading) return <Text style={styles.loadingText}>Chargement...</Text>;
  if (error)
    return (
      <Text style={styles.errorText}>Erreur lors du chargement des tâches</Text>
    );

  return (
    <LinearGradient
      colors={["#421053", "#261B29"]}
      locations={[0.1, 0.25]}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Tâches du {formatDate(date)}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.containerCard}>
        {tasksForDate?.length > 0 ? (
          tasksForDate.map((task) => (
            <View key={task.id_todo} style={styles.cardContainer}>
              <LinearGradient
                colors={["#4F4353", "#261B29"]}
                style={styles.card}
              >
                <Text style={styles.cardTitle}>{task.titre}</Text>
                <Text style={styles.cardTime}>
                  Date: {formatDate(task.date)}
                </Text>
                <Text style={styles.cardStatus}>
                  Statut: {task.status === "a faire" ? "À faire" : "En cours"}
                </Text>
                <Text style={styles.cardPriority}>
                  Priorité: {task.priorite}
                </Text>
              </LinearGradient>
            </View>
          ))
        ) : (
          <Text style={styles.noTasksText}>
            Aucune tâche en cours ou à faire pour cette date
          </Text>
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
          onPress={() => navigation.goBack()}
        >
          <View style={[styles.button, { backgroundColor: "#4F4353" }]}>
            <Icon name="arrow-back" size={40} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  header: {
    marginTop: 150,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 30,
    textAlign: "center",
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
    borderRadius: 10,
  },
  card: {
    borderRadius: 10,
    padding: 15,
    backgroundColor: "#4F4353",
  },
  cardTitle: {
    fontSize: 22,
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
  cardStatus: {
    marginTop: 5,
    fontSize: 14,
    color: "white",
    fontFamily: "Poppins-Regular",
  },
  cardPriority: {
    marginTop: 5,
    fontSize: 14,
    color: "white",
    fontFamily: "Poppins-Regular",
  },
  noTasksText: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
    marginTop: 20,
  },
  loadingText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    marginTop: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: 18,
    marginTop: 20,
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
});

export default DailyTasks;
