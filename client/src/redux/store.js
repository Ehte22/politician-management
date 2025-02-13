import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./apis/auth.api";
import { userApi } from "./apis/user.api";
import authSlice from "./slices/auth.slice"


const reduxStore = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        auth: authSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            userApi.middleware
        )
})

export default reduxStore