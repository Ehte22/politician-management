import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./apis/authApi";
import { visitorApi } from "./apis/visitorApi";

const reduxStore = configureStore({
    reducer: {
        [authApi.reducer]: authApi.reducerPath,
        [visitorApi.reducer]: visitorApi.reducerPath,
        // auth: authSlice
    },
    middleware: def => [...def(), authApi.middleware, visitorApi.middleware,]
})

export default reduxStore