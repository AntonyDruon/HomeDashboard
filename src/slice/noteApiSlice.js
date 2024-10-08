import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { REACT_APP_API_BASE_URL, REACT_APP_NANOLEAF_IP } from "@env";
const baseUrl = REACT_APP_API_BASE_URL;

export const noteApiSlice = createApi({
  reducerPath: "noteApi",
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
    getAllNotes: builder.query({
      query: () => ({
        url: "/notes/getNotes",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }),
    }),
    createNote: builder.mutation({
      query: (name) => ({
        url: "/notes/new",
        method: "POST",
        body: name,
        credentials: "include",
      }),
    }),
    createFieldNote: builder.mutation({
      query: ({ id_note, title }) => ({
        url: "/notes/new/field",
        method: "POST",
        body: { id_note, title },
        credentials: "include",
      }),
    }),
    getFieldNote: builder.query({
      query: (id) => ({
        url: `/notes/field/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useCreateNoteMutation,
  useGetAllNotesQuery,
  useCreateFieldNoteMutation,
  useGetFieldNoteQuery,
} = noteApiSlice;
