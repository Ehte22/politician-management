import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./apis/auth.api";
import { userApi } from "./apis/user.api";
import authSlice from "./slices/auth.slice"
import { boothApi } from "./apis/booth.api";
import { visitorApi } from "./apis/visitor.api";


const reduxStore = configureStore({
        reducer: {
                [authApi.reducerPath]: authApi.reducer,
                [userApi.reducerPath]: userApi.reducer,
                [boothApi.reducerPath]: boothApi.reducer,
                [visitorApi.reducerPath]: visitorApi.reducer,
                auth: authSlice
        },
        middleware: (getDefaultMiddleware) =>
                getDefaultMiddleware().concat(
                        authApi.middleware,
                        userApi.middleware,
                        boothApi.middleware,
                        visitorApi.middleware
                )
})

export default reduxStore