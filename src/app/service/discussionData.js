import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const discussionApi = createApi({
  reducerPath: "discussion",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  endpoints: (builder) => ({

    //  Get all discussion (reading)

    getAllDiscussion: builder.query({
      query: () => "/discussion",
    }),

    // Get spcific document discussion

    getAllDocDiscussion: builder.query({
        query: (id) => `/discussion/documen/${id}`,
      }),

    // Get discussion by id

    getADiscussionById: builder.query({
      query: (id) => `/discussion/${id}`,
    }),

    // Add new specialDays

    addNewDiscussion: builder.mutation({
      query: (newDiscussion) => ({
        url: `/discussion`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: newDiscussion,
      }),
    }),

    // Update a discussion

    updateDiscussion: builder.mutation({
        query: ({id, updateSpecialDays}) => ({
            url: `/discussion/${id}`,
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: updateSpecialDays
        })
    }),

    // Delete a discussion

    deleteDiscussion: builder.mutation({
        query: (id) => ({
            url: `/discussion/${id}`,
            method: 'DELETE'
        })
    })


  }),
});

export const {
    useGetAllDiscussionQuery, 
    useGetAllDocDiscussionQuery,
    useGetADiscussionByIdQuery,
    useAddNewDiscussionMutation, 
    useUpdateDiscussionMutation,
    useDeleteDiscussionMutation,
  } =  discussionApi; 
  