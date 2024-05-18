import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import env from "../../env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseUrl = env.REACT_APP_API_BASE_URL;

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
