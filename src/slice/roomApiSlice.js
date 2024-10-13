import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { REACT_APP_API_BASE_URL, REACT_APP_NANOLEAF_IP } from "@env";
const baseUrl = REACT_APP_API_BASE_URL;
console.log("baseurlroom", baseUrl);
export const roomApiSlice = createApi({
  reducerPath: "roomApi",
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
    addNewRoom: builder.mutation({
      query: ({ name }) => ({
        url: "/rooms/new",
        method: "POST",
        body: { name },
        credentials: "include",
      }),
    }),
    getAllRooms: builder.query({
      query: () => ({
        url: "/rooms",
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const { useAddNewRoomMutation, useGetAllRoomsQuery } = roomApiSlice;
