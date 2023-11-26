import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import { SERVER_URL } from './constants'
import Cookie from 'js-cookie'

type GetUserResponse = {
  login: string
  avatar_url: string
  name: string
}

export function useGetUser(): ReturnType<typeof useQuery<GetUserResponse>> {
  return useQuery({
    queryKey: ['getUser'],
    queryFn: async () => {
      const { data } = await axios.get(`${SERVER_URL}/user`, {
        headers: {
          [`x-github-token`]: `${Cookie.get('github-access-token')}`
        }
      })
      return data
    },
    staleTime: 60 * 60 * 24
  })
}
