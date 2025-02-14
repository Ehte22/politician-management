import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./apis/auth.api";
import { userApi } from "./apis/user.api";
import authSlice from "./slices/auth.slice"
import { eventApi } from "./apis/event.api";
import { boothApi } from "./apis/booth.api";
import { visitorApi } from "./apis/visitor.api";
import { wishApi } from "./apis/wish.api";


const reduxStore = configureStore({
        reducer: {
                [authApi.reducerPath]: authApi.reducer,
                [userApi.reducerPath]: userApi.reducer,
                [boothApi.reducerPath]: boothApi.reducer,
                [visitorApi.reducerPath]: visitorApi.reducer,
                [wishApi.reducerPath]: wishApi.reducer,
                [eventApi.reducerPath]: eventApi.reducer,

                auth: authSlice
        },
        middleware: (getDefaultMiddleware) =>
                getDefaultMiddleware().concat(
                        authApi.middleware,
                        userApi.middleware,
                        boothApi.middleware,
                        visitorApi.middleware,
                        wishApi.middleware,
                        eventApi.middleware

                )
})

export default reduxStore