import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import { SERVER_URL } from './constants'

export function useGetAccessToken(code: string): ReturnType<typeof useQuery> {
  console.log('CODE', code)
  return useQuery<any, any, any, any>({
    queryKey: ['getArticles'],
    queryFn: async () => {
      const { data } = await axios.get(`${SERVER_URL}/get-access-token?code=${code}`)
      return data.access_token
    },
    enabled: !!code
  })
}
