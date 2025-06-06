import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bannerApi = createApi({
  reducerPath: "banner",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  endpoints: (builder) => ({
    //  Get all banner (reading)

    getAllBanner: builder.query({
      query: () => "/banner",
    }),

    // Get banner by id

    getABannerById: builder.query({
      query: (id) => `/banner/${id}`,
    }),

    // Add new banner

    addNewBanner: builder.mutation({
      query: (newBanner) => ({
        url: `/banner`,
        method: "POST",
        body: newBanner,
      }),
    }),

    // Update a banner

    updateBanner: builder.mutation({
      query: ({ id, index, updateBanner }) => ({
        url: `/banner/${id}/no/${index}`,
        method: "PUT",
        body: updateBanner,
      }),
    }),

    // Delete a banner

    deleteBanner: builder.mutation({
      query: (id) => ({
        url: `/banner/${id}`,
        method: "DELETE",
      }),
    }),

    // Delete a banner

    deleteABanner: builder.mutation({
      query: ({ id, index }) => ({
        url: `/banner/${id}/no/${index}`,
        method: "DELETE",
      }),
    }),
    // Delete all banner

    deleteAllBanner: builder.mutation({
      query: () => ({
        url: `/banner`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllBannerQuery,
  useGetABannerByIdQuery,
  useAddNewBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
  useDeleteAllBannerMutation,
  useDeleteABannerMutation,
} = bannerApi;
