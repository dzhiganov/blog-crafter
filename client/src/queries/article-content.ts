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
          [`x-github-token`]: `${Cookie.get('github-access-token')}`
        }
      })
      return data
    },
    enabled: !!path
  })
}
