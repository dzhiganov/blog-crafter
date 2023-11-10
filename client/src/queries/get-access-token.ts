import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import { SERVER_URL } from './constants'

export function useGetArticlesQuery(): ReturnType<typeof useQuery> {
  return useQuery({
    queryKey: ['getArticles'],
    queryFn: async () => {
      const contentResponse = await axios.get(`${SERVER_URL}/get-access-token`, {
        params: 
      })
      return contentResponse.data.items
    }
  })
}
