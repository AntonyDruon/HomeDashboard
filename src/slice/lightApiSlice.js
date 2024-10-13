import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { REACT_APP_API_BASE_URL, REACT_APP_NANOLEAF_IP } from "@env";
const baseUrl = REACT_APP_API_BASE_URL;
console.log("baseurllight", baseUrl);
const nanoleafIP = REACT_APP_NANOLEAF_IP;

export const lightApiSlice = createApi({
  reducerPath: "lightApi",
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
    getBridgeIP: builder.query({
      query: () => ({
        url: "https://discovery.meethue.com/",
        method: "GET",
        credentials: "include",
      }),
    }),
    insertHueBridgeToken: builder.mutation({
      query: (username) => ({
        url: "/lights/insertHueBridgeToken", // Assurez-vous que cette URL est correcte
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: { username },
      }),
    }),
    getHueBridgeToken: builder.query({
      query: () => ({
        url: "/lights/getHueBridgeToken", // Assurez-vous que cette URL est correcte
        method: "GET",
        credentials: "include", // Utilisez la méthode appropriée pour votre endpoint
      }),
    }),
    insertDataHue: builder.mutation({
      query: (data) => ({
        url: "/lights/insertDataHueLights", // Assurez-vous que cette URL est correcte
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: { data },
      }),
    }),
    getDataHueLights: builder.query({
      query: () => ({
        url: "/lights/getDataHueLights", // Assurez-vous que cette URL est correcte
        method: "GET",
        credentials: "include", // Utilisez la méthode appropriée pour votre endpoint
      }),
    }),
    modifyStatusHueLights: builder.mutation({
      query: (data) => ({
        url: "/lights/modifyStatusHueLights/all", // Assurez-vous que cette URL est correcte
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: { data },
      }),
    }),
  }),
});

export const {
  useGetBridgeIPQuery,
  useInsertHueBridgeTokenMutation,
  useGetHueBridgeTokenQuery,
  useInsertDataHueMutation,
  useGetDataHueLightsQuery,
  useModifyStatusHueLightsMutation,
} = lightApiSlice;
