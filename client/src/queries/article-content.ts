import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import { SERVER_URL } from './constants'
import Cookie from 'js-cookie'
import { marked } from 'marked'
import type { MaybeRefOrGetter } from 'vue'

type Response = {
  meta: Record<string, string>
  md: string
}

export function useGetArticleContentQuery(
  { user, repo, branch, path }: any,
  enabled: MaybeRefOrGetter<boolean>
): ReturnType<typeof useQuery<Response>> {
  return useQuery({
    queryKey: ['getArticleContent', user],
    queryFn: async ({ queryKey }) => {
      const { data } = await axios.get(
        `${SERVER_URL}/content/${path}?user=${queryKey[1]}&repo=${repo}&branch=${branch}`,
        {
          headers: {
            [`x-github-token`]: `${Cookie.get('github-access-token')}`
          }
        }
      )

      const md = marked.parse(data.content)

      return {
        md,
        meta: data.meta
      }
    },
    enabled
  })
}
