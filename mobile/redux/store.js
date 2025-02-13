import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./authApi";

const reduxStore = configureStore({
    reducer: {
        [authApi.reducer]: authApi.reducerPath,
    },
    middleware: def => [...def(), authApi.middleware]
})

export default reduxStore