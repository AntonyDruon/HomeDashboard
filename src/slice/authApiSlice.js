import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { REACT_APP_API_BASE_URL, REACT_APP_NANOLEAF_IP } from "@env";
const baseUrl = REACT_APP_API_BASE_URL;
console.log("baseurl", baseUrl);

export const authApiSlice = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "/users/login",
        method: "POST",
        body: { email, password },
        credentials: "include",
      }),
    }),
  }),
});

export const { useLoginMutation } = authApiSlice;
