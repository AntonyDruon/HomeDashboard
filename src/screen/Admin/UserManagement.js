import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  // Import Picker for role selection
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation, // Import the mutation for updating the role
} from "../../slice/userApiSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker"; // Import Picker from the correct package
import { useFocusEffect } from "@react-navigation/native"; // Importez useFocusEffect

const UserManagement = ({ navigation }) => {
  // Fetch all users
  const { data: users, refetch } = useGetAllUsersQuery();
  console.log("Fetched Users:", users);

  const [deleteUser] = useDeleteUserMutation(); // Mutation to delete user
  const [updateUser] = useUpdateUserMutation(); // Mutation to update user role
  const [editingUser, setEditingUser] = useState(null); // User currently being edited
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState(""); // State for role

  useFocusEffect(
    React.useCallback(() => {
      console.log("userManagement is focused");
      refetch(); // Re-fetch data every time the screen is focused
    }, [])
  );
  // Function to handle user deletion
  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId); // Call the delete mutation
      refetch(); // Refetch users after deletion
      console.log(`Utilisateur avec ID: ${userId} supprimé`);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
    }
  };

  // Function to handle editing the user's info
  const handleEditUser = (user) => {
    setEditingUser(user.id);
    setNewUsername(user.username);
    setNewEmail(user.email);
    setNewRole(user.role); // Set the current role
  };

  // Function to handle save after editing
  const handleSaveUser = async (userId) => {
    try {
      await updateUser({
        id: userId,
        role: newRole,
        email: newEmail,
        username: newUsername,
      }); // Call mutation to update the role
      console.log(`Modification de l'utilisateur avec ID: ${userId}`);
      refetch(); // Refetch users after update
      setEditingUser(null); // Stop editing
    } catch (error) {
      console.error("Erreur lors de la modification de l'utilisateur:", error);
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
      <View>
        <Text style={styles.title}>Gestion des Utilisateurs</Text>
      </View>

      <ScrollView contentContainerStyle={styles.userContainer}>
        {Array.isArray(users) && users.length > 0 ? (
          users.map((user) => (
            <View key={user.id} style={styles.userCard}>
              <View style={styles.userInfo}>
                {editingUser === user.id ? (
                  <>
                    <TextInput
                      style={styles.input}
                      value={newUsername}
                      onChangeText={setNewUsername}
                    />
                    <TextInput
                      style={styles.input}
                      value={newEmail}
                      onChangeText={setNewEmail}
                    />
                    <Picker
                      selectedValue={newRole}
                      style={styles.picker} // Apply some styling to the Picker
                      onValueChange={(itemValue) => setNewRole(itemValue)}
                      itemStyle={styles.pickerItem}
                    >
                      <Picker.Item label="Admin" value="admin" />
                      <Picker.Item label="User" value="user" />
                    </Picker>
                  </>
                ) : (
                  <>
                    <Text style={styles.userText}>Pseudo: {user.username}</Text>
                    <Text style={styles.userText}>Email: {user.email}</Text>
                    <Text style={styles.userRole}>Rôle: {user.role}</Text>
                  </>
                )}
              </View>
              <View style={styles.actionButtons}>
                {editingUser === user.id ? (
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => handleSaveUser(user.id)}
                  >
                    <Icon name="save" size={25} color="white" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditUser(user)}
                  >
                    <Icon name="edit" size={25} color="white" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteUser(user.id)}
                >
                  <Icon name="delete" size={25} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noUsersText}>Aucun utilisateur trouvé</Text>
        )}
      </ScrollView>

      <View style={styles.navbarbottom}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => navigation.navigate("Admin")}
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
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
  userContainer: {
    paddingVertical: 20,
  },
  userCard: {
    backgroundColor: "#5E376B",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flex: 1,
    paddingRight: 10,
  },
  userText: {
    color: "white",
    fontSize: 16,
    marginBottom: 5,
  },
  userRole: {
    color: "#FFD700",
    fontSize: 16,
  },
  input: {
    backgroundColor: "white",
    padding: 5,
    borderRadius: 5,
    marginBottom: 5,
  },
  picker: {
    // Height inside the container
    width: "100%",
    backgroundColor: "white",
    margin: 0, // Make sure it uses the full container width
  },
  pickerItem: {
    fontSize: 14, // Reduce the font size for compactness
  },
  actionButtons: {
    flexDirection: "row",
  },
  editButton: {
    backgroundColor: "#53315F",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: "#24A647",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: "#FF5555",
    padding: 10,
    borderRadius: 5,
  },
  noUsersText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    marginTop: 20,
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
});

export default UserManagement;
