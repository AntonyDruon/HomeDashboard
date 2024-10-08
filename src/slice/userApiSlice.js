import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { REACT_APP_API_BASE_URL, REACT_APP_NANOLEAF_IP } from "@env";
const baseUrl = REACT_APP_API_BASE_URL;

export const userApiSlice = createApi({
  reducerPath: "createUserApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: ({ username, email, password }) => ({
        url: "/users/new",
        method: "POST",
        body: { username, email, password },
        credentials: "include",
      }),
    }),
  }),
});

export const { useSignUpMutation } = userApiSlice;
