import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const specialDaysApi = createApi({
  reducerPath: "specialDays",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  endpoints: (builder) => ({

    //  Get all specialDays (reading)

    getAllSpecialDays: builder.query({
      query: () => "/specialdays",
    }),

    // Get  specialDays by id

    getASpecialDaysById: builder.query({
      query: (id) => `/specialdays/${id}`,
    }),

    // Add new specialDays

    addNewSpecialDays: builder.mutation({
      query: (newSpecialDays) => ({
        url: `/specialdays`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: newSpecialDays,
      }),
    }),

    // Update a specialDays

    updateSpecialDays: builder.mutation({
        query: ({id, updateSpecialDays}) => ({
            url: `/specialdays/${id}`,
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: updateSpecialDays
        })
    }),

    // Delete a specialDays

    deleteSpecialDays: builder.mutation({
        query: (id) => ({
            url: `/specialdays/${id}`,
            method: 'DELETE'
        })
    })


  }),
});

export const {
    useGetAllSpecialDaysQuery, 
    useGetASpecialDaysByIdQuery,
    useAddNewSpecialDaysMutation, 
    useUpdateSpecialDaysMutation,
    useDeleteSpecialDaysMutation,
  } = specialDaysApi; 
  