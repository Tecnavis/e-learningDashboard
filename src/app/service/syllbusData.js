import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const syllabusApi = createApi({
  reducerPath: "syllabus",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  endpoints: (builder) => ({

    //  Get all syllabus (reading)

    getAllSyllbus: builder.query({
      query: () => "/syllabus",
    }),

    // Get syllabus by id

    getASyllbusById: builder.query({
      query: (id) => `/syllabus/${id}`,
    }),

    // Add new syllabus

    addNewSyllbus: builder.mutation({
      query: (newSyllbus) => ({
        url: `/syllabus`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: newSyllbus,
      }),
    }),

    // Update a syllabus

    updateSyllbus: builder.mutation({
        query: ({id, updateSyllbus}) => ({
            url: `/syllabus/${id}`,
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: updateSyllbus
        })
    }),

       // add a syllabus to new class

       addSyllbusClass: builder.mutation({
        query: ({id, addSyllbusClass}) => ({
            url: `/syllabus/add-class/${id}`,
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: addSyllbusClass
        })
    }),

           // add a syllabus rating

           addSyllbusRating: builder.mutation({
            query: ({id, classNo, subjectTitle, chapterTitle, rating,  userId}) => ({
                url: `/syllabus/${id}/class/${classNo}/subject/${subjectTitle}/chapter/${chapterTitle}/rating`,
                method: 'PUT',
                headers: { "Content-Type": "application/json" },
                body: { rating,  userId }
            })
        }),

    // Delete a syllabus

    deleteSyllbus: builder.mutation({
        query: (id) => ({
            url: `/syllabus/${id}`,
            method: 'DELETE'
        })
    })


  }),
});

export const {
    useGetAllSyllbusQuery, 
    useGetASyllbusByIdQuery,
    useAddNewSyllbusMutation, 
    useUpdateSyllbusMutation,
    useDeleteSyllbusMutation,
    useAddSyllbusClassMutation,
    useAddSyllbusRatingMutation
  } = syllabusApi; 
  