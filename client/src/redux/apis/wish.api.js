import { createApi } from "@reduxjs/toolkit/query/react";
import { createCustomBaseQuery } from "./customBaseQuery.api";

const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/v1/wish`
const customBaseQuery = createCustomBaseQuery(baseUrl);

export const wishApi = createApi({
    reducerPath: "wishApi",
    baseQuery: customBaseQuery,
    tagTypes: ["wish"],
    endpoints: (builder) => {
        return {
            getAllWishes: builder.query({
                query: ({ search, page, limit }) => ({
                    url: "/getWishes",
                    method: "GET",
                    params: { search, page, limit },
                }),
                transformResponse: (data) => data.result,
                transformErrorResponse: (error) => error.data.message,
                providesTags: ["wish"],
            }),

            getWishById: builder.query({
                query: (id) => ({
                    url: `/wishes/${id}`,
                    method: "GET",
                }),
                transformResponse: (data) => data.result,
                transformErrorResponse: (error) => error.data.message,
                providesTags: ["wish"],
            }),

            createWish: builder.mutation({
                query: (wishData) => ({
                    url: "/wishes",
                    method: "POST",
                    body: wishData,
                }),
                transformResponse: (data) => data.result,
                transformErrorResponse: (error) => error.data.message,
                invalidatesTags: ["wish"],
            }),

            updateWish: builder.mutation({
                query: ({ updateId, ...wishesData }) => ({
                    url: `/wishes/${updateId}`,
                    method: "PUT",
                    body: wishesData,
                }),
                transformResponse: (data) => data.result,
                transformErrorResponse: (error) => error.data.message,
                invalidatesTags: ["wish"],
            }),

            deleteWish: builder.mutation({
                query: (id) => ({
                    url: `/wishes-delete/${id}`,
                    method: "DELETE",
                }),
                transformResponse: (data) => data.result,
                transformErrorResponse: (error) => error.data.message,
                invalidatesTags: ["wish"],
            }),

            scheduleWish: builder.mutation({
                query: (wishId) => ({
                    url: `/wishes/schedule/${wishId}`,
                    method: "POST",
                }),
                transformResponse: (data) => data.message,
                transformErrorResponse: (error) => error.data.message,
                invalidatesTags: ["wish"],
            }),
        };
    },
});

export const {
    useGetAllWishesQuery,
    useGetWishByIdQuery,
    useCreateWishMutation,
    useUpdateWishMutation,
    useDeleteWishMutation,
    useScheduleWishMutation
} = wishApi;
