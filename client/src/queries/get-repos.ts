import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import { SERVER_URL } from './constants'
import Cookie from 'js-cookie'

export function useGetRepos({ user }: any, enabled: any): ReturnType<typeof useQuery> {
  return useQuery<any, any, any, any>({
    queryKey: ['getRepos', user],
    queryFn: async ({ queryKey }) => {
      const { data } = await axios.get(`${SERVER_URL}/repos?user=${queryKey[1]}`, {
        headers: {
          [`x-github-token`]: `${Cookie.get('github-access-token')}`
        }
      })
      return data.items
    },
    enabled,
    staleTime: 60 * 60 * 24
  })
}
