import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import { SERVER_URL } from './constants'

export function useGetRepos(
  { user }: any,
  enabled: any
): ReturnType<typeof useQuery<{ name: string; html_url: string }[]>> {
  return useQuery<any, any, any, any>({
    queryKey: ['getRepos', user],
    queryFn: async ({ queryKey }) => {
      const { data } = await axios.get(`${SERVER_URL}/repos?user=${queryKey[1]}`, {
        headers: {
          [`x-github-token`]: `${localStorage.getItem('github-access-token')}`
        }
      })
      return data.items
    },
    enabled,
    staleTime: 60 * 60 * 24
  })
}
