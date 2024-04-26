import { apiSlice } from "../api/apiSlice";
import { userLoggedIn } from "./authSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // endpoints here
    register: builder.mutation({
      query: ({ firstName, lastName, email, password }) => ({
        url: "/auth/register",
        method: "POST",
        body: { firstName, lastName, email, password },
      }),
    }),

    activation: builder.mutation({
      query: ({ email, otp }) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: { email , otp },
      }),
    }),
    
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "/auth/login",
        method: "POST",
        body: { email, password },
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          // console.log("result -->", result)
          if(result.data?.status === 1) {
            dispatch(
              userLoggedIn({
                token: result?.data?.data?.token,
                user: result?.data?.data,
              })
            );
          }
        } catch (error) {
          console.log("login user error -->", error);
        }
      },
    }),

  }),
});

export const {
  useRegisterMutation,
  useActivationMutation,
  useLoginMutation,
} = authApi;