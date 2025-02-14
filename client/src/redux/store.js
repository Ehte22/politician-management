import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./apis/auth.api";
import { userApi } from "./apis/user.api";
import authSlice from "./slices/auth.slice"
import { eventApi } from "./apis/event.api";


const reduxStore = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [eventApi.reducerPath]: eventApi.reducer,
        auth: authSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            userApi.middleware,
            eventApi.middleware
        )
})

export default reduxStore