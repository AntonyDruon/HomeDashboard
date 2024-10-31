import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Alert,
  Modal,
  ScrollView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import logo from "../../../assets/logohomedashboarddarkmode.png";
import { useSignUpMutation } from "../../slice/userApiSlice";

const SignUp = ({ navigation }) => {
  const [username, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signUp] = useSignUpMutation();

  const [modalVisible, setModalVisible] = useState(false);
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const { height: screenHeight } = Dimensions.get("window");
  // Fonction de validation du mot de passe
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{12,})/; // Minimum 12 caractères
    return regex.test(password);
  };

  // Fonction de validation de l'email
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSignUp = async () => {
    // Vérifier que tous les champs sont remplis
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert("Erreur", "Tous les champs doivent être remplis.");
      return;
    }

    // Valider l'email
    if (!validateEmail(email)) {
      Alert.alert("Erreur", "Veuillez entrer une adresse email valide.");
      return;
    }

    // Vérifier si les mots de passe correspondent
    if (password !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
      return;
    }

    // Valider le mot de passe
    if (!validatePassword(password)) {
      Alert.alert(
        "Erreur de validation",
        "Le mot de passe doit comporter au moins 12 caractères, inclure une majuscule et un caractère spécial."
      );
      return;
    }

    // Afficher la modale avant l'inscription
    setModalVisible(true);
  };

  const confirmSignUp = async () => {
    try {
      const response = await signUp({ username, email, password }).unwrap(); // unwrap pour accéder directement aux données
      console.log("Response from signUp:", response);

      // Vérifier la réponse du serveur
      if (response && !response.error) {
        if (response.message === "Cet email est déjà utilisé.") {
          Alert.alert("Erreur", "Cet email est déjà utilisé.");
        } else {
          // Redirection vers l'écran de connexion en cas de succès
          navigation.navigate("SignIn");
        }
      } else {
        Alert.alert("Erreur", "Un problème est survenu lors de l'inscription.");
      }
    } catch (error) {
      console.error("Erreur d'inscription:", error);

      // Vérifier si l'erreur contient une réponse spécifique du serveur
      if (error?.data?.error) {
        Alert.alert("Erreur", error.data.error); // Affiche l'erreur spécifique retournée par le serveur
      } else {
        Alert.alert("Erreur", "Un problème est survenu lors de l'inscription.");
      }
    } finally {
      setModalVisible(false);
    }
  };

  return (
    <LinearGradient
      colors={["#421053", "#261B29"]}
      locations={[0.1, 0.25]}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} />
      </View>
      <View>
        <Text style={styles.title}>Inscription</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Pseudo"
        onChangeText={setFullName}
        value={username}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmez le mot de passe"
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.buttonSignUp} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Inscription</Text>
      </TouchableOpacity>
      <View style={styles.navbarbottom}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => navigation.navigate("SignIn")}
        >
          <View style={[styles.button, { backgroundColor: "#4F4353" }]}>
            <Text style={styles.buttonText}>Connexion</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => setPrivacyModalVisible(true)}
        >
          <View style={[styles.button, { backgroundColor: "#4F4353" }]}>
            <Text style={styles.buttonText}>Politique de confidentialité</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Modal for Privacy Policy */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={privacyModalVisible}
        onRequestClose={() => {
          setPrivacyModalVisible(!privacyModalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>
                Politique de confidentialité
              </Text>

              <Text style={styles.modalSectionTitle}>
                Dernière mise à jour : 11/10/2024
              </Text>
              <Text style={styles.modalText}>
                Nous, à HomeDashboard smarthouse, respectons votre vie privée et
                nous engageons à protéger les informations personnelles que vous
                partagez avec nous. Cette politique de confidentialité explique
                comment nous collectons, utilisons et partageons vos données
                lorsque vous utilisez notre application.
              </Text>

              <Text style={styles.modalSectionTitle}>
                1. Collecte des Informations
              </Text>
              <Text style={styles.modalText}>
                Lorsque vous vous inscrivez à notre application, nous pouvons
                collecter les informations suivantes :
              </Text>
              <Text style={styles.modalText}>
                - <Text style={styles.boldText}>Nom d'utilisateur :</Text> pour
                identifier votre compte.
              </Text>
              <Text style={styles.modalText}>
                - <Text style={styles.boldText}>Adresse e-mail :</Text> pour
                vous contacter et gérer votre compte.
              </Text>
              <Text style={styles.modalText}>
                - <Text style={styles.boldText}>Mot de passe :</Text> pour
                protéger votre compte et sécuriser vos informations.
              </Text>

              <Text style={styles.modalSectionTitle}>
                2. Utilisation des Informations
              </Text>
              <Text style={styles.modalText}>
                Les informations que nous collectons sont utilisées dans le but
                de :
              </Text>
              <Text style={styles.modalText}>
                - Créer et gérer votre compte utilisateur.
              </Text>
              <Text style={styles.modalText}>
                - Vous fournir un accès à nos services et fonctionnalités.
              </Text>
              <Text style={styles.modalText}>
                - Vous envoyer des mises à jour importantes concernant
                l'application.
              </Text>
              <Text style={styles.modalText}>
                - Améliorer notre application et nos services en fonction de vos
                retours.
              </Text>

              <Text style={styles.modalSectionTitle}>
                3. Partage des Informations
              </Text>
              <Text style={styles.modalText}>
                Nous ne partageons vos informations personnelles avec aucune
                tierce partie, sauf dans les cas suivants :
              </Text>
              <Text style={styles.modalText}>- Si la loi nous y oblige.</Text>
              <Text style={styles.modalText}>
                - Si c'est nécessaire pour protéger les droits ou la sécurité de
                notre entreprise, de nos utilisateurs ou du public.
              </Text>

              <Text style={styles.modalSectionTitle}>
                4. Sécurité des Données
              </Text>
              <Text style={styles.modalText}>
                Nous mettons en œuvre des mesures de sécurité appropriées pour
                protéger vos informations contre tout accès non autorisé,
                modification, divulgation ou destruction.
              </Text>

              <Text style={styles.modalSectionTitle}>5. Vos Droits</Text>
              <Text style={styles.modalText}>
                Vous avez le droit de consulter, corriger ou supprimer les
                informations personnelles que vous nous avez fournies. Pour
                exercer ces droits, vous pouvez nous contacter à tout moment.
              </Text>

              <Text style={styles.modalSectionTitle}>
                6. Modifications de la Politique de Confidentialité
              </Text>
              <Text style={styles.modalText}>
                Nous nous réservons le droit de modifier cette politique de
                confidentialité à tout moment. Les modifications seront publiées
                sur cette page, et la date de la dernière mise à jour sera
                indiquée en haut.
              </Text>

              <Text style={styles.modalSectionTitle}>7. Contact</Text>
              <Text style={styles.modalText}>
                Si vous avez des questions ou des préoccupations concernant
                notre politique de confidentialité, veuillez nous contacter à
                hdsh@gmail.com.
              </Text>

              <Text style={styles.modalText}>
                En utilisant notre application, vous consentez à notre politique
                de confidentialité.
              </Text>
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setPrivacyModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Existing Modal for Signup Confirmation */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              En souscrivant au formulaire, j'autorise mes données à être
              utilisées conformément à la politique de confidentialité.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalConfirmButton]}
                onPress={confirmSignUp}
              >
                <Text style={styles.modalButtonText}>Valider</Text>
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
    backgroundColor: "#FFF3F3",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 50,
    textAlign: "center",
    color: "white",
  },
  input: {
    width: "100%",
    height: 60,
    borderWidth: 1,
    borderColor: "#EDBBFF",
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#FFF",
  },
  buttonSignUp: {
    backgroundColor: "#9124B6",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 10,
    height: 60,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
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
  logoContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  logo: {
    width: "90%",
    aspectRatio: 1.2,
    resizeMode: "contain",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    height: "70%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    textAlign: "justify", // Justifier le texte
    marginBottom: 10,
    lineHeight: 20, // Espace entre les lignes pour améliorer la lisibilité
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#9124B6",
    padding: 10,
    borderRadius: 5,
    width: 100,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  modalCancelButton: {
    backgroundColor: "#FF5555",
  },
  modalConfirmButton: {
    backgroundColor: "#24A647",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
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

export default SignUp;
