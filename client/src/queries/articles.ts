import { useQuery, useMutation } from '@tanstack/vue-query'
import axios from 'axios'
import { SERVER_URL } from './constants'

export function useGetArticlesQuery(): ReturnType<typeof useQuery> {
  return useQuery({
    queryKey: ['getArticles'],
    queryFn: async () => {
      const contentResponse = await axios.get(`${SERVER_URL}/content`)
      return contentResponse.data.items
    }
  })
}

export function useUpdateArticle(): ReturnType<typeof useMutation> {
  return useMutation<any, any, any>({
    mutationFn: async ({ path, meta, content }) => {
      const contentResponse = await axios.post(`${SERVER_URL}/publish`, {
        path,
        meta,
        content
      })
      return contentResponse.data.items
    }
  })
}
