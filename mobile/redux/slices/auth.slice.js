import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "../apis/authApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
    user: null,
    sessionExpiredOpen: false
}
AsyncStorage.getItem("user")
    .then((user) => {
        if (user) {
            initialState.user = JSON.parse(user)
        }
    })
    .catch((error) => console.error("Error loading user:", error));

const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        logoutUser: (state) => {
            state.user = null;
            AsyncStorage.removeItem("user");
        },
        openSessionExpiredModal: (state) => {
            state.sessionExpiredOpen = true;
        },
        closeSessionExpiredModal: (state) => {
            state.sessionExpiredOpen = false;
        }
    },
    extraReducers: (builder) =>
        builder
            .addMatcher(authApi.endpoints.signIn.matchFulfilled, (state, { payload }) => {
                state.user = payload.result;
                AsyncStorage.setItem("user", JSON.stringify(payload.result));
            })
            .addMatcher(authApi.endpoints.signOut.matchFulfilled, (state) => {
                state.user = null;
                AsyncStorage.removeItem("user");
            })
});

export const {
    setUser,
    logoutUser,
    openSessionExpiredModal,
    closeSessionExpiredModal
} = authSlice.actions;

export default authSlice.reducer;
