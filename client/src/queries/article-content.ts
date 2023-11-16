import { useMutation, useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import { SERVER_URL } from './constants'
import Cookie from 'js-cookie'

type Response = {
  meta: Record<string, string>
  content: string
}

export function useGetArticleContentQuery({
  user,
  repo,
  branch,
  path
}: any): ReturnType<typeof useQuery<Response>> {
  return useQuery({
    queryKey: ['getArticleContent', path],
    queryFn: async ({ queryKey }) => {
      // const { user = "", repo = "", branch = "main" } = req.query;
      const { data } = await axios.get(
        `${SERVER_URL}/content/${queryKey[1]}?user=${user}&repo=${repo}&branch=${branch}`,
        {
          headers: {
            [`x-github-token`]: `${Cookie.get('github-access-token')}`
          }
        }
      )
      return data
    },
    enabled: !!path
  })
}
