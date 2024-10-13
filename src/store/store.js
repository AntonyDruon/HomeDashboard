import { configureStore } from "@reduxjs/toolkit";
import { userApiSlice } from "../slice/userApiSlice";
import { authApiSlice } from "../slice/authApiSlice";
import { lightApiSlice } from "../slice/lightApiSlice";
import { roomApiSlice } from "../slice/roomApiSlice";
import { nanoleafApiSlice } from "../slice/nanoleafApiSlice";
import { noteApiSlice } from "../slice/noteApiSlice";
import { todoApiSlice } from "../slice/todoApiSlice";

export default configureStore({
  reducer: {
    [userApiSlice.reducerPath]: userApiSlice.reducer, // Utilisez le reducerPath
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [lightApiSlice.reducerPath]: lightApiSlice.reducer,
    [roomApiSlice.reducerPath]: roomApiSlice.reducer,
    [nanoleafApiSlice.reducerPath]: nanoleafApiSlice.reducer,
    [noteApiSlice.reducerPath]: noteApiSlice.reducer,
    [todoApiSlice.reducerPath]: todoApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApiSlice.middleware,
      authApiSlice.middleware,
      lightApiSlice.middleware,
      roomApiSlice.middleware,
      nanoleafApiSlice.middleware,
      noteApiSlice.middleware,
      todoApiSlice.middleware
    ),
});
