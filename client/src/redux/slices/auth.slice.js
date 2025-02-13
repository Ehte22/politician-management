import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "../apis/auth.api";

const initialState = {
    user: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null,
    sessionExpiredOpen: false
}

const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {
        logoutUser: (state) => {
            state.user = null
            localStorage.removeItem("user")
        },
        openSessionExpiredModal: (state) => {
            state.sessionExpiredOpen = true
        },
        closeSessionExpiredModal: (state) => {
            state.sessionExpiredOpen = false
        }
    },
    extraReducers: builder => builder

        .addMatcher(authApi.endpoints.signIn.matchFulfilled, (state, { payload }) => {
            state.user = payload.result
        })
        .addMatcher(authApi.endpoints.signOut.matchFulfilled, (state) => {
            state.user = null
        })
})

export const {
    logoutUser,
    openSessionExpiredModal,
    closeSessionExpiredModal
} = authSlice.actions

export default authSlice.reducer
