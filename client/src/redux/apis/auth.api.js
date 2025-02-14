import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { logoutUser, openSessionExpiredModal } from "../slices/auth.slice";

const baseQuery = fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth`,
    credentials: "include",
    prepareHeaders(headers, { getState }) {
        const state = getState()
        const token = state.auth.user?.token;
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

const customBaseQuery = async (args, api, extraOptions) => {
    const response = await baseQuery(args, api, extraOptions);

    if (response.error?.status === 401) {
        const errorData = response.error.data
        if (errorData?.message === "Session has expired. Please log in again.") {
            api.dispatch(logoutUser());
            api.dispatch(openSessionExpiredModal())
        }
    }

    return response;
};

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: customBaseQuery,
    tagTypes: ["user"],
    endpoints: (builder) => {
        return {
            signIn: builder.mutation({
                query: userData => {
                    return {
                        url: "/sign-in",
                        method: "POST",
                        body: userData
                    }
                },
                transformResponse: (data) => {
                    localStorage.setItem("user", JSON.stringify(data.result))
                    return data
                },
                transformErrorResponse: (error) => {
                    return error.data.message
                }
            }),

            signOut: builder.mutation({
                query: () => {
                    return {
                        url: "/sign-out",
                        method: "POST",
                    }
                },
                transformResponse: (data) => {
                    localStorage.removeItem("user")
                    return data.message
                },
                transformErrorResponse: (error) => {
                    return error.data.message
                }
            }),

            sendOTP: builder.mutation({
                query: (username) => {
                    return {
                        url: "/send-otp",
                        method: "POST",
                        body: username
                    }
                },
                transformResponse: (data) => {
                    return data.message
                },
                transformErrorResponse: (error) => {
                    return error.data.message
                }
            }),

            verifyOTP: builder.mutation({
                query: (userData) => {
                    return {
                        url: "/verify-otp",
                        method: "POST",
                        body: userData
                    }
                },
                transformResponse: (data) => {
                    return data.message
                },
                transformErrorResponse: (error) => {
                    return error.data.message
                }
            }),

            forgotPassword: builder.mutation({
                query: (email) => {
                    return {
                        url: "/forgot-password",
                        method: "POST",
                        body: { email }
                    }
                },
                transformResponse: (data) => {
                    return data.message
                },
                transformErrorResponse: (error) => {
                    return error.data.message
                }
            }),

            resetPassword: builder.mutation({
                query: (passwordData) => {
                    return {
                        url: "/reset-password",
                        method: "PUT",
                        body: passwordData
                    }
                },
                transformResponse: (data) => {
                    return data.message
                },
                transformErrorResponse: (error) => {
                    return error.data.message
                }
            }),


        }
    }
})

export const {
    useSignInMutation,
    useSignOutMutation,
    useSendOTPMutation,
    useVerifyOTPMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation

} = authApi
