import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./apis/auth.api";
import { userApi } from "./apis/user.api";
import authSlice from "./slices/auth.slice"
import { visitorApi } from "./apis/visitor.api";


const reduxStore = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [visitorApi.reducerPath]: visitorApi.reducer,
        auth: authSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            userApi.middleware,
            visitorApi.middleware
        )
})

export default reduxStore