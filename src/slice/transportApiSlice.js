import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { withAuthRedirect } from "./withAuthRedirect";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { REACT_APP_API_BASE_URL } from "@env";

// Prochains passages du bus 118 (l'API du serveur interroge PRIM IDFM)
export const transportApiSlice = createApi({
  reducerPath: "transportApi",
  baseQuery: withAuthRedirect(fetchBaseQuery({
    baseUrl: REACT_APP_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  })),
  endpoints: (builder) => ({
    getBus118: builder.query({
      query: () => "/transport/118",
    }),
  }),
});

export const { useGetBus118Query } = transportApiSlice;
