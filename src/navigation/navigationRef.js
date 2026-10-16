import { createNavigationContainerRef } from "@react-navigation/native";

// Permet de naviguer hors d'un composant (ex. déconnexion sur jeton expiré)
export const navigationRef = createNavigationContainerRef();

export const resetToSignIn = () => {
  if (navigationRef.isReady()) {
    navigationRef.reset({ index: 0, routes: [{ name: "SignIn" }] });
  }
};
