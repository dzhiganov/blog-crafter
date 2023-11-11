import { useMutation, useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import { SERVER_URL } from './constants'
import Cookie from 'js-cookie'

type Response = {
  meta: Record<string, string>
  content: string
}

export function useGetArticleContentQuery(path: string): ReturnType<typeof useQuery<Response>> {
  return useQuery({
    queryKey: ['getArticleContent', path],
    queryFn: async ({ queryKey }) => {
      const { data } = await axios.get(`${SERVER_URL}/content/${queryKey[1]}`, {
        headers: {
          [`x-github-token`]: `${Cookie.get('github-api-code')}`
        }
      })
      return data
    },
    enabled: !!path
  })
}

export type ArticlePayload = {
  path: string
  meta: Record<string, string>
  content: string
}

export function useUpdateArticle(): ReturnType<typeof useMutation> {
  return useMutation<unknown, unknown, any>({
    mutationFn: async ({ path, meta, content }) => {
      await axios.post(`${SERVER_URL}/publish`, {
        path,
        meta,
        content
      })
    }
  })
}
