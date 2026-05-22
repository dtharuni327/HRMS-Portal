import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { useAuthStore } from "../../store/authStore";
import { config } from "../../config/env";

export const employeeApi = createApi({
  reducerPath: "employeeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: config.API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = useAuthStore.getState().token;

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getEmployees: builder.query({
      query: () => "/employees",
    }),

    getEmployee: builder.query({
      query: (id: string) => `/employees/${id}`,
    }),

    createEmployee: builder.mutation({
      query: (employee) => ({
        url: "/employees",
        method: "POST",
        body: employee,
      }),
    }),

    updateEmployee: builder.mutation({
      query: ({ id, ...employee }) => ({
        url: `/employees/${id}`,
        method: "PUT",
        body: employee,
      }),
    }),

    deleteEmployee: builder.mutation({
      query: (id: string) => ({
        url: `/employees/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeeApi;