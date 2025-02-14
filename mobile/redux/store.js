import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./apis/authApi";
import { visitorApi } from "./apis/visitorApi";
import authSlice from './slices/auth.slice'
const reduxStore = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [visitorApi.reducerPath]: visitorApi.reducer,
        auth: authSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware, visitorApi.middleware),
    devTools: process.env.NODE_ENV === "development",
});

export default reduxStore;
