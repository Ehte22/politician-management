import { createApi } from "@reduxjs/toolkit/query/react"
import { createCustomBaseQuery } from "./customBaseQuery.api"

const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/v1/booth`
const customBaseQuery = createCustomBaseQuery(baseUrl)

export const boothApi = createApi({
    reducerPath: "boothApi",
    baseQuery: customBaseQuery,
    tagTypes: ["booth"],
    endpoints: (builder) => {
        return {
            getBooths: builder.query({
                query: (queryParams) => {
                    return {
                        url: "/",
                        method: "GET",
                        params: queryParams
                    }
                },
                transformResponse: (data) => {
                    return data
                },
                transformErrorResponse: (error) => {
                    return error.data.message
                },
                providesTags: ["booth"]
            }),

            getBoothById: builder.query({
                query: (id) => {
                    return {
                        url: `/${id}`,
                        method: "GET"
                    }
                },
                transformResponse: (data) => {
                    return data.result
                },
                transformErrorResponse: (error) => {
                    return error.data.message
                },
                providesTags: ["booth"]
            }),

            addBooth: builder.mutation({
                query: boothData => {
                    return {
                        url: "/add-booth",
                        method: "POST",
                        body: boothData
                    }
                },
                transformResponse: (data) => {
                    return data
                },
                transformErrorResponse: (error) => {
                    return error.data.message
                },
                invalidatesTags: ["booth"]
            }),

            updateBooth: builder.mutation({
                query: ({ id, boothData }) => {
                    return {
                        url: `/update-booth/${id}`,
                        method: "PUT",
                        body: boothData
                    }
                },
                transformResponse: (data) => {
                    return data.message
                },
                transformErrorResponse: (error) => {
                    return error.data.message
                },
                invalidatesTags: ["booth"]
            }),

            deleteBooth: builder.mutation({
                query: (id) => {
                    return {
                        url: `/delete-booth/${id}`,
                        method: "PUT",
                    }
                },
                transformResponse: (data) => {
                    return data.message
                },
                transformErrorResponse: (error) => {
                    return error.data.message
                },
                invalidatesTags: ["booth"]
            }),

        }
    }
})

export const {
    useGetBoothsQuery,
    useGetBoothByIdQuery,
    useAddBoothMutation,
    useUpdateBoothMutation,
    useDeleteBoothMutation
} = boothApi
