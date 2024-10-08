import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import translationCalendar from "../../utils/translationCalendar"; // Assure-toi que le chemin est correct

const CalendarView = ({ onDateSelect, navigation }) => {
  const [markedDates, setMarkedDates] = useState({});

  //   useEffect(() => {
  //     // Fetch tasks and mark the dates
  //     const fetchTasks = async () => {
  //       const response = await fetch("https://your-api-endpoint/calendar");
  //       const data = await response.json();
  //       const dates = {};
  //       data.forEach((task) => {
  //         dates[task.dueDate] = { marked: true };
  //       });
  //       setMarkedDates(dates);
  //     };

  //     fetchTasks();
  //   }, []);
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
      <View>
        <Text style={styles.title}>Planning</Text>
      </View>
      <Calendar
        style={styles.calendar}
        theme={{
          calendarBackground: "transparent",
          textSectionTitleColor: "#b6c1cd",
          dayTextColor: "#d9e1e8",
          todayTextColor: "#00adf5",
          selectedDayTextColor: "#ffffff",
          monthTextColor: "white",
          indicatorColor: "white",
          selectedDayBackgroundColor: "#00adf5",
          arrowColor: "white",
          "stylesheet.calendar.header": {
            week: {
              marginTop: 5,
              flexDirection: "row",
              justifyContent: "space-between",
              color: "white",
            },
          },
        }}
        markedDates={markedDates}
        onDayPress={(day) => {
          navigation.navigate("DailyTasks", { date: day.dateString });
        }}
        monthFormat={"MMMM yyyy"}
        hideArrows={false}
        hideExtraDays={true}
        disableMonthChange={false}
        firstDay={1}
        hideDayNames={false}
        showWeekNumbers={false}
        // Pass the translations to the locale prop
        locale={translationCalendar}
      />
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
    // justifyContent: "center",
    // alignItems: "center",
    paddingHorizontal: 10,
  },
  title: {
    marginTop: 150, // Ajustez cette valeur selon vos besoins0,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: Platform.OS === "android" ? 30 : 50,
    textAlign: "center",
    color: "white",
  },
  calendar: {
    backgroundColor: "transparent",
    borderRadius: 10,
    paddingBottom: 10,
  },
  button: {
    borderRadius: 5,
    flex: 1, // Utilisez flex: 1 pour que le bouton occupe tout l'espace disponible dans le conteneur parent
    marginHorizontal: 5, // Ajoute une marge horizontale entre les boutons
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
    flex: 1, // Utilisez flex: 1 pour que le TouchableOpacity occupe tout l'espace disponible dans le conteneur parent
  },
});

export default CalendarView;
