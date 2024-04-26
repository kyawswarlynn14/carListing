import { apiSlice } from "../api/apiSlice";

const dataForm = ({valuesData, files}) => {
  let formData = new FormData();

  Object.keys(valuesData).forEach((key) => {
    formData.append(key, valuesData[key]);
  });

  if (files) {
    Array.from(files).forEach((file) => {
      formData.append("photos", file);
    });
  } else {
    formData.append("photos", JSON.stringify([]))
  }

  return formData;
}

export const carListingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    createCarListing: builder.mutation({
      query: (formData) => ({
        url: "/carlisting",
        method: "POST",
        body: formData,
      }),
    }),

    updateCarListing: builder.mutation({
      query: ({valuesData, files, id}) => {
        return {
          url: `/carlisting/${id}`,
          method: "PUT",
          body: dataForm({ valuesData, files}),
        };
      },
    }),

    deleteCarListing: builder.mutation({
        query: (id) => ({
          url: `/carlisting/${id}`,
          method: "DELETE",
        }),
    }),

    // getAllCarListing: builder.query({
    //     query: ({ page = 1, limit = 10}) => ({
    //         url: `/carlisting?page=${page}&limit=${limit}`,
    //         method: "GET",
    //     }),
    // }),

    getAllCarListing: builder.mutation({
      query: ({ page = 1, limit = 10}) => ({
          url: `/carlisting?page=${page}&pageSize=${limit}`,
          method: "GET",
      }),
    }),

    getOneCarListing: builder.query({
        query: (id) => ({
            url: `/carlisting/${id}`,
            method: "GET",
        }),
    }),

  }),
});

export const {
    useCreateCarListingMutation,
    useUpdateCarListingMutation,
    useDeleteCarListingMutation,
    // useGetAllCarListingQuery,
    useGetAllCarListingMutation,
    useGetOneCarListingQuery,
} = carListingApi;