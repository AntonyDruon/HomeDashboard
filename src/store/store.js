import { configureStore } from "@reduxjs/toolkit";
import { userApiSlice } from "../slice/userApiSlice";
import { authApiSlice } from "../slice/authApiSlice";
import { lightApiSlice } from "../slice/lightApiSlice";
import { roomApiSlice } from "../slice/roomApiSlice";

export default configureStore({
  reducer: {
    createUserApi: userApiSlice.reducer,
    authApi: authApiSlice.reducer,
    lightApi: lightApiSlice.reducer,
    roomApi: roomApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(
      userApiSlice.middleware,
      authApiSlice.middleware,
      lightApiSlice.middleware,
      roomApiSlice.middleware
    );
  },
});
