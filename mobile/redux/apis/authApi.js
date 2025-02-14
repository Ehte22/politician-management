import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({ baseUrl: `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/v1/auth` }),
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
