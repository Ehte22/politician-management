import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { createCustomBaseQuery } from "./customBaseQuery.api"

const customBaseQuery = createCustomBaseQuery(`https://politician-management-server.vercel.app/api/v1/visitor`)

export const visitorApi = createApi({
    reducerPath: "visitorApi",
    baseQuery: customBaseQuery,
    tagTypes: ["user"],
    endpoints: (builder) => {
        return {
            getAllVisitors: builder.query({
                query: () => {
                    return {
                        url: "/",
                        method: "GET",
                    }
                },
                transformResponse: (data) => {
                    return data.result
                },
                transformErrorResponse: (error) => {
                    return error.data?.message
                },
                providesTags: ["user"]
            }),

            getVisitorById: builder.query({
                query: (id) => {
                    return {
                        url: `/${id}`,
                        method: "GET"
                    }
                },
                transformResponse: (data) => {
                    return data
                },
                transformErrorResponse: (error) => {
                    return error.data.message
                },
                providesTags: ["user"]
            }),

            createVisitor: builder.mutation({
                query: visitorData => {
                    return {
                        url: "/create",
                        method: "POST",
                        body: visitorData
                    }
                },
                transformResponse: (data) => {
                    return data
                },
                transformErrorResponse: (error) => {
                    return error.data.message
                },
                invalidatesTags: ["user"]
            }),

            updateVisitor: builder.mutation({
                query: ({ visitorData, id }) => {
                    return {
                        url: `/update/${id}`,
                        method: "PUT",
                        body: visitorData
                    }
                },
                transformResponse: (data) => {
                    return data.message
                },
                transformErrorResponse: (error) => {
                    return error.data.message
                },
                invalidatesTags: ["user"]
            }),

            deleteVisitor: builder.mutation({
                query: (id) => {
                    return {
                        url: `/${id}`,
                        method: "DELETE",
                    }
                },
                transformResponse: (data) => {
                    return data.message
                },
                transformErrorResponse: (error) => {
                    return error.data.message
                },
                invalidatesTags: ["user"]
            }),

        }
    }
})

export const {
    useGetAllVisitorsQuery,
    useLazyGetAllVisitorsQuery,
    useGetVisitorByIdQuery,
    useLazyGetVisitorByIdQuery,
    useCreateVisitorMutation,
    useUpdateVisitorMutation,
    useDeleteVisitorMutation
} = visitorApi