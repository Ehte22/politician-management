import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: `https://politician-management-server.vercel.app/api/v1/auth`,
        prepareHeaders(headers, { getState }) {
            const state = getState();
            const token = state?.auth?.user?.token
            if (token) {
                headers.set("Authorization", `Bearer ${token}`)
            }
            return headers
        },
    }),
    tagTypes: ["auth"],
    endpoints: (builder) => ({
        signIn: builder.mutation({
            query: (userData) => ({
                url: "/sign-in",
                method: "POST",
                body: userData,
            }),
            invalidatesTags: ["auth"],
        }),
        signOut: builder.mutation({
            query: () => ({
                url: "/sign-out",
                method: "POST",
            }),
            invalidatesTags: ["auth"],
        }),
        sendOTP: builder.mutation({
            query: (data) => ({
                url: "/send-otp",
                method: "POST",
                body: data,
            }),
        }),
        verifyOTP: builder.mutation({
            query: (data) => ({
                url: "/verify-otp",
                method: "POST",
                body: data,
            }),
        }),
        forgotPassword: builder.mutation({
            query: (data) => ({
                url: "/forgot-password",
                method: "POST",
                body: data,
            }),
        }),
        resetPassword: builder.mutation({
            query: (data) => ({
                url: "/reset-password",
                method: "PUT",
                body: data,
            }),
        }),
    }),
});

export const {
    useSignInMutation,
    useSignOutMutation,
    useSendOTPMutation,
    useVerifyOTPMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
} = authApi;
