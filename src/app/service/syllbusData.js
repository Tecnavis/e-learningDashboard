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
        body: newSyllbus,
      }),
    }),

    // Update a syllabus

    updateSyllbus: builder.mutation({
      query: ({ id, updateSyllbus }) => ({
        url: `/syllabus/${id}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: updateSyllbus,
      }),
    }),

    // add a syllabus to new class

    addSyllbusClass: builder.mutation({
      query: ({ id, addSyllbusClass }) => ({
        url: `/syllabus/add-class/${id}`,
        method: "PUT",
        body: addSyllbusClass,
      }),
    }),

    //  add a syllabus class subject

    addSyllbusClassSubjects: builder.mutation({
      query: ({ id, no, addSyllbusClassSubjects }) => ({
        url: `/syllabus/add-class/${id}/subjects/${no}`,
        method: "PUT",
        body: addSyllbusClassSubjects,
      }),
    }),

    //  edit a syllabus class subject

    editSyllbusClassSubjects: builder.mutation({
      query: ({ id, no, subjectId, editSyllbusClassSubjects }) => ({
        url: `/syllabus/add-class/${id}/class/${no}/subjects/${subjectId}`,
        method: "PUT",
        body: editSyllbusClassSubjects,
      }),
    }),

    //  add a syllabus class subject chapter

    addSyllbusClassSubjectsChapters: builder.mutation({
      query: ({ id, no, subjectId, addSyllbusClassSubjectsChapters }) => ({
        url: `/syllabus/add-class/${id}/subjects/${no}/chapters/${subjectId}`,
        method: "PUT",
        body: addSyllbusClassSubjectsChapters,
      }),
    }),

    //  edit a syllabus class subject chapter

    editSyllbusClassSubjectsChapters: builder.mutation({
      query: ({
        id,
        no,
        subjectId,
        chapterId,
        editSyllbusClassSubjectsChapters,
      }) => ({
        url: `/syllabus/add-class/${id}/class/${no}/subjects/${subjectId}/chapters/${chapterId}`,
        method: "PUT",
        body: editSyllbusClassSubjectsChapters,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    // add a syllabus rating

    addSyllbusRating: builder.mutation({
      query: ({ id, classNo, subjectTitle, chapterTitle, rating, userId }) => ({
        url: `/syllabus/${id}/class/${classNo}/subject/${subjectTitle}/chapter/${chapterTitle}/rating`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: { rating, userId },
      }),
    }),

    // delete a syllabus  class

    deleteSyllbusAClass: builder.mutation({
      query: ({ id, no }) => ({
        url: `/syllabus/${id}/class/${no}`,
        method: "DELETE",
      }),
    }),

    //  delete a syllabus class subject

    deleteSyllbusAClassSubjects: builder.mutation({
      query: ({ id, no, subjectId }) => ({
        url: `/syllabus/${id}/class/${no}/subjects/${subjectId}`,
        method: "DELETE",
      }),
    }),

    //  delete a syllabus class subject chapter

    deleteSyllbusAClassSubjectsChapters: builder.mutation({
      query: ({ id, no, subjectId, chapterId }) => ({
        url: `/syllabus/${id}/class/${no}/subjects/${subjectId}/chapters/${chapterId}`,
        method: "DELETE",
      }),
    }),

    // Delete a syllabus

    deleteSyllbus: builder.mutation({
      query: (id) => ({
        url: `/syllabus/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllSyllbusQuery,
  useGetASyllbusByIdQuery,
  useAddNewSyllbusMutation,
  useUpdateSyllbusMutation,
  useDeleteSyllbusMutation,
  useAddSyllbusClassMutation,
  useAddSyllbusRatingMutation,
  useDeleteSyllbusAClassMutation,
  useAddSyllbusClassSubjectsMutation,
  useEditSyllbusClassSubjectsMutation,
  useDeleteSyllbusAClassSubjectsMutation,
  useAddSyllbusClassSubjectsChaptersMutation,
  useEditSyllbusClassSubjectsChaptersMutation,
  useDeleteSyllbusAClassSubjectsChaptersMutation,
} = syllabusApi;
