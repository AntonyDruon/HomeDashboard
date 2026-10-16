import AsyncStorage from "@react-native-async-storage/async-storage";
import { resetToSignIn } from "../navigation/navigationRef";

// Enveloppe un fetchBaseQuery : si NOTRE API répond 401 (jeton expiré ou
// invalide), on supprime le jeton et on renvoie vers l'écran de connexion.
// Les appels directs aux lampes (URL absolues http://…) ne sont pas concernés.
export const withAuthRedirect = (baseQuery) => async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  const url = typeof args === "string" ? args : args?.url || "";
  const isOwnApi = !/^https?:\/\//i.test(url);

  if (result.error?.status === 401 && isOwnApi) {
    await AsyncStorage.removeItem("authToken");
    resetToSignIn();
  }
  return result;
};
