import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGetBus118Query } from "../../slice/transportApiSlice";

const REFRESH_MS = 30 * 1000;

const hhmm = (iso) => {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const hhmmss = (iso) => {
  const d = new Date(iso);
  return `${hhmm(iso)}:${String(d.getSeconds()).padStart(2, "0")}`;
};

// Un passage : temps d'attente en gros, heure et état en petit
const Departure = ({ p }) => {
  const cancelled = p.status === "cancelled";
  const delayed = p.status === "delayed";
  const soon = p.atStop || p.minutes <= 1;
  const label = cancelled
    ? "Supprimé"
    : p.atStop
    ? "À l'arrêt"
    : soon
    ? "Proche"
    : `${p.minutes} min`;

  return (
    <View style={[styles.chip, soon && !cancelled && styles.chipSoon, cancelled && styles.chipCancelled]}>
      <Text style={[styles.chipMain, cancelled && styles.textCancelled]}>{label}</Text>
      <Text style={styles.chipSub}>
        {hhmm(p.time)}
        {delayed ? " · retard" : ""}
      </Text>
    </View>
  );
};

const Direction = ({ d }) => (
  <View style={styles.direction}>
    <View style={styles.directionHeader}>
      <Icon name="arrow-forward" size={16} color="#C9A7D6" />
      <Text style={styles.directionName} numberOfLines={1}>
        {d.destination}
      </Text>
    </View>
    {d.departures.length > 0 ? (
      <View style={styles.chips}>
        {d.departures.map((p) => (
          <Departure key={p.time} p={p} />
        ))}
      </View>
    ) : (
      <Text style={styles.empty}>Aucun passage annoncé</Text>
    )}
  </View>
);

const StopCard = ({ stop }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Icon name="directions-bus" size={22} color="white" />
      <Text style={styles.cardTitle}>{stop.name}</Text>
    </View>
    {stop.error ? (
      <Text style={styles.empty}>{stop.error}</Text>
    ) : (
      stop.directions.map((d) => <Direction key={d.destination} d={d} />)
    )}
  </View>
);

const Transport = ({ navigation }) => {
  const { data, error, isLoading, isFetching, refetch } = useGetBus118Query(undefined, {
    pollingInterval: REFRESH_MS,
  });

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      navigation.navigate("SignIn");
    } catch (e) {
      console.error("Error during logout:", e);
    }
  };

  return (
    <LinearGradient
      colors={["#421053", "#261B29"]}
      locations={[0.1, 0.25]}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.lineBadge}>
          <Text style={styles.lineBadgeText}>118</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Bus 118</Text>
          <Text style={styles.subtitle}>
            {data ? `Temps réel · mis à jour à ${hhmmss(data.updatedAt)}` : "Temps réel IDFM"}
          </Text>
        </View>
        <TouchableOpacity onPress={refetch} style={styles.refreshButton} disabled={isFetching}>
          <Icon name="refresh" size={26} color={isFetching ? "#8A7A8F" : "white"} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isFetching && !isLoading} onRefresh={refetch} tintColor="white" />
        }
      >
        {isLoading ? (
          <Text style={styles.message}>Chargement des prochains passages…</Text>
        ) : error && !data ? (
          <Text style={styles.message}>
            Impossible de récupérer les horaires.{"\n"}Tire vers le bas pour réessayer.
          </Text>
        ) : (
          data?.stops.map((stop) => <StopCard key={stop.id} stop={stop} />)
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
        <TouchableOpacity style={styles.buttonContainer} onPress={handleSignOut}>
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
    paddingHorizontal: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Platform.OS === "android" ? 50 : 70,
    marginBottom: 16,
  },
  lineBadge: {
    backgroundColor: "#C9A7D6",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 12,
  },
  lineBadgeText: {
    color: "#261B29",
    fontSize: 18,
    fontWeight: "bold",
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#C9B8CE",
    fontSize: 12,
    marginTop: 2,
  },
  refreshButton: {
    padding: 8,
  },
  list: {
    paddingBottom: 130,
  },
  card: {
    backgroundColor: "#5E376B",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  direction: {
    marginTop: 6,
  },
  directionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  directionName: {
    color: "#E6D9EA",
    fontSize: 14,
    marginLeft: 4,
    flex: 1,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chip: {
    backgroundColor: "#4A2A55",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 6,
    minWidth: 76,
    alignItems: "center",
  },
  chipSoon: {
    backgroundColor: "#2E7D4F",
  },
  chipCancelled: {
    backgroundColor: "#7A2E3A",
  },
  chipMain: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },
  chipSub: {
    color: "#D8CBDD",
    fontSize: 12,
    marginTop: 1,
  },
  textCancelled: {
    textDecorationLine: "line-through",
  },
  empty: {
    color: "#BBA9C1",
    fontSize: 13,
    fontStyle: "italic",
    marginBottom: 4,
  },
  message: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
    lineHeight: 24,
  },
  navbarbottom: {
    position: "absolute",
    height: 80,
    bottom: 20,
    left: 0,
    right: 0,
    backgroundColor: "#241A26",
    flexDirection: "row",
  },
  buttonContainer: {
    flex: 1,
  },
  button: {
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Transport;
