import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { REACT_APP_API_BASE_URL } from "@env";

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
    // Endpoint pour récupérer toutes les notes
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

    // Endpoint pour créer une nouvelle note
    createNote: builder.mutation({
      query: (name) => ({
        url: "/notes/new",
        method: "POST",
        body: name,
        credentials: "include",
      }),
    }),

    // Endpoint pour créer un champ dans une note
    createFieldNote: builder.mutation({
      query: ({ id_note, title }) => ({
        url: "/notes/new/field",
        method: "POST",
        body: { id_note, title },
        credentials: "include",
      }),
    }),

    // Endpoint pour obtenir tous les champs d'une note
    getFieldNote: builder.query({
      query: (id) => ({
        url: `/notes/field/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    // Endpoint pour mettre à jour un champ d'une note
    updateFieldNote: builder.mutation({
      query: ({ id_field, title }) => ({
        url: `/notes/field/update/${id_field}`,
        method: "PUT",
        body: { title },
        credentials: "include",
      }),
    }),
    updateNote: builder.mutation({
      query: ({ id_note, name }) => ({
        url: `/notes/update/${id_note}`,
        method: "PUT",
        body: { name },
        credentials: "include",
      }),
    }),

    // Endpoint pour supprimer un champ d'une note
    deleteFieldNote: builder.mutation({
      query: ({ id_field }) => ({
        url: `/notes/field/delete/${id_field}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),

    // Endpoint pour supprimer une note entière
    deleteNote: builder.mutation({
      query: (id_note) => ({
        url: `/notes/delete/${id_note}`,
        method: "DELETE",
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
  useUpdateFieldNoteMutation,
  useUpdateNoteMutation,
  useDeleteFieldNoteMutation,
  useDeleteNoteMutation,
} = noteApiSlice;
