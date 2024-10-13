import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { REACT_APP_API_BASE_URL, REACT_APP_NANOLEAF_IP } from "@env";
const baseUrl = REACT_APP_API_BASE_URL;
console.log("baseurlnanoleaf", baseUrl);
const nanoleafIP = REACT_APP_NANOLEAF_IP;

export const nanoleafApiSlice = createApi({
  reducerPath: "nanoleafApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: async (headers) => {
      // Récupérer le token JWT depuis AsyncStorage
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getTokenNanoleaf: builder.mutation({
      query: () => ({
        url: `http://${nanoleafIP}/api/v1/new`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    getAllPanelInfo: builder.query({
      query: () => ({
        url: `http://${nanoleafIP}/api/v1`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    insertTokenToBDD: builder.mutation({
      query: ({ token }) => ({
        url: "/lights/insertNanoleafToken",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: { token }, // Envoyez le token comme une chaîne JSON
      }),
    }),
    getTokenFromBDD: builder.query({
      query: () => ({
        url: "/lights/getNanoleafToken",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }),
    }),
    insertDataNanoleaf: builder.mutation({
      query: (data) => ({
        url: "/lights/insertDataNanoleaf", // Assurez-vous que cette URL est correcte
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: { data },
      }),
    }),
    getDataNanoleafBDD: builder.query({
      query: () => ({
        url: "/lights/getDataNanoleafBDD", // Assurez-vous que cette URL est correcte
        method: "GET",
        credentials: "include", // Utilisez la méthode appropriée pour votre endpoint
      }),
    }),
    modifyStatusNanoleafLights: builder.mutation({
      query: (data) => ({
        url: "/lights/modifyStatusNanoleafLights/all", // Assurez-vous que cette URL est correcte
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: { data },
      }),
    }),
  }),
});

export const {
  useGetTokenNanoleafMutation,

  useInsertTokenToBDDMutation,
  useGetTokenFromBDDQuery,
  useInsertDataNanoleafMutation,
  useGetDataNanoleafBDDQuery,
} = nanoleafApiSlice;
