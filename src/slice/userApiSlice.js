import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { REACT_APP_API_BASE_URL } from "@env";

const baseUrl = REACT_APP_API_BASE_URL;

export const userApiSlice = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: async (headers) => {
      const token = await AsyncStorage.getItem("authToken");

      // N'ajoute le token que s'il est présent (après login ou signup)
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: ({ username, email, password }) => ({
        url: "/users/new", // Cette requête n'a pas besoin de token
        method: "POST",
        body: { username, email, password },
        credentials: "include",
      }),
    }),
    getUserRole: builder.query({
      query: (id) => ({
        url: `/users/role/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    getAllUsers: builder.query({
      query: () => ({
        url: "/users",
        method: "GET",
        credentials: "include",
      }),
    }),
    updateUser: builder.mutation({
      query: ({ id, role, email, username }) => ({
        url: `/users/update/${id}`,
        method: "PUT",
        body: { role, email, username },
        credentials: "include",
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useSignUpMutation,
  useGetUserRoleQuery,
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApiSlice;
