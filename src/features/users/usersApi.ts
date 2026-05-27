import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { UserSchema, UsersSchema } from './types'
import type { User } from './types'

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com' }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => '/users',
      transformResponse: (raw) => UsersSchema.parse(raw),
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'User' as const, id })), { type: 'User', id: 'LIST' }]
          : [{ type: 'User', id: 'LIST' }],
    }),
    getUserById: builder.query<User, number>({
      query: (id) => `/users/${id}`,
      transformResponse: (raw) => UserSchema.parse(raw),
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),
    createUser: builder.mutation<User, Omit<User, 'id'>>({
      query: (body) => ({ url: '/users', method: 'POST', body }),
      transformResponse: (raw) => UserSchema.parse(raw),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
    updateUser: builder.mutation<User, User>({
      query: ({ id, ...body }) => ({ url: `/users/${id}`, method: 'PUT', body }),
      transformResponse: (raw) => UserSchema.parse(raw),
      async onQueryStarted(user, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          usersApi.util.updateQueryData('getUsers', undefined, (draft) => {
            const idx = draft.findIndex((u) => u.id === user.id)
            if (idx !== -1) Object.assign(draft[idx], user)
          }),
        )
        try {
          await queryFulfilled
        } catch {
          patch.undo()
        }
      },
    }),
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({ url: `/users/${id}`, method: 'DELETE' }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          usersApi.util.updateQueryData('getUsers', undefined, (draft) => {
            const idx = draft.findIndex((u) => u.id === id)
            if (idx !== -1) draft.splice(idx, 1)
          }),
        )
        try {
          await queryFulfilled
        } catch {
          patch.undo()
        }
      },
    }),
  }),
})

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi
