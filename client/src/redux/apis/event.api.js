import { createApi } from "@reduxjs/toolkit/query/react"
import { createCustomBaseQuery } from "./customBaseQuery.api";

const baseUrl = "http://localhost:5000/api/v1/event"
const customBaseQuery = createCustomBaseQuery(baseUrl)

export const eventApi = createApi({
    reducerPath: "eventApi",
    baseQuery: customBaseQuery,
    tagTypes: ["event"],
    endpoints: (builder) => {
        return {
            getAllEvents: builder.query({
                query: () => {
                    return {
                        url: "/",
                        method: "GET",

                    }
                },
                transformResponse: (data) => {
                    return data.result
                },
   
                providesTags: ["event"]
            }),


            AddEvent: builder.mutation({
                query: eventData => {
                    return {
                        url: "/add-event",
                        method: "POST",
                        body: eventData
                    }
                },
                invalidatesTags: ["event"]
            }),

            updateEvent: builder.mutation({
                query: ({ eventData, id }) => {
                    return {
                        url: `/update-event/${id}`,
                        method: "PUT",
                        body: eventData
                    }
                },
                invalidatesTags: ["event"]
            }),


            deleteEvent: builder.mutation({
                query: (id) => {
                    console.log("ooooo", id);
                    
                    return {
                        url: `/delete-event/${id}`,
                        method: "DELETE",
                    }
                },

                invalidatesTags: ["event"]
            }),

        }
    }
})

export const {
 useGetAllEventsQuery,
 useAddEventMutation,
 useUpdateEventMutation,
 useDeleteEventMutation
} = eventApi
