import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { REACT_APP_API_BASE_URL, REACT_APP_NANOLEAF_IP } from "@env";
const baseUrl = REACT_APP_API_BASE_URL;

export const todoApiSlice = createApi({
  reducerPath: "todoApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: async (headers) => {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAllTodos: builder.query({
      query: () => ({
        url: "/todos", // Tu n'as plus besoin de passer l'ID utilisateur ici
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }),
    }),
    createTodo: builder.mutation({
      query: (newTodo) => ({
        url: "/todos/new",
        method: "POST",
        body: newTodo,
        credentials: "include",
      }),
    }),
    updateTodo: builder.mutation({
      query: ({ id_todo, ...updatedData }) => ({
        url: `/todos/update/${id_todo}`,
        method: "PUT",
        body: updatedData,
        credentials: "include",
      }),
    }),
    deleteTodo: builder.mutation({
      query: (id_todo) => ({
        url: `/todos/delete/${id_todo}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useGetAllTodosQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = todoApiSlice;
