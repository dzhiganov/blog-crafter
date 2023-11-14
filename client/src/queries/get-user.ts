import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import { SERVER_URL } from './constants'
import Cookie from 'js-cookie'

export function useGetUser(): ReturnType<typeof useQuery> {
  return useQuery<any, any, any, any>({
    queryKey: ['getUser'],
    queryFn: async () => {
      const { data } = await axios.get(`${SERVER_URL}/user`, {
        headers: {
          [`x-github-token`]: `${Cookie.get('github-access-token')}`
        }
      })
      return data
    }
  })
}
