import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logoutUser, openSessionExpiredModal } from "../slices/auth.slice";

export const createCustomBaseQuery = (baseUrl) => {
    const baseQuery = fetchBaseQuery({
        baseUrl,
        credentials: "include",
        prepareHeaders(headers, { getState }) {
            const state = getState();
            const token = state.auth.user?.token;
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    });

    return async (args, api, extraOptions) => {
        const response = await baseQuery(args, api, extraOptions);

        if (response.error?.status === 401) {
            const errorData = response.error.data
            if (errorData?.message === "Session has expired. Please log in again.") {
                api.dispatch(logoutUser());
                api.dispatch(openSessionExpiredModal());
            }
        }

        return response;
    };
};
