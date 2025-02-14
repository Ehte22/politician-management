import { createApi } from "@reduxjs/toolkit/query/react"
import { createCustomBaseQuery } from "./customBaseQuery.api";

const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/v1/user`
const customBaseQuery = createCustomBaseQuery(baseUrl)

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: customBaseQuery,
    tagTypes: ["user"],
    endpoints: (builder) => {
        return {
            getUsers: builder.query({
                query: (queryParams = {}) => {
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
                providesTags: ["user"]
            }),

            getUserById: builder.query({
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
                providesTags: ["user"]
            }),

            createUser: builder.mutation({
                query: userData => {
                    return {
                        url: "/add-user",
                        method: "POST",
                        body: userData
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

            updateUser: builder.mutation({
                query: ({ userData, id }) => {
                    return {
                        url: `/update-user/${id}`,
                        method: "PUT",
                        body: userData
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

            updateUserStatus: builder.mutation({
                query: (statusData) => {
                    return {
                        url: `/update-status/${statusData.id}`,
                        method: "PUT",
                        body: statusData
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

            deleteUser: builder.mutation({
                query: (id) => {
                    return {
                        url: `/delete-user/${id}`,
                        method: "PUT",
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
    useGetUsersQuery,
    useGetUserByIdQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useUpdateUserStatusMutation,
    useDeleteUserMutation
} = userApi
