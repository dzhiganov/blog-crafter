import { useQuery, useMutation } from '@tanstack/vue-query'
import axios from 'axios'
import { SERVER_URL } from './constants'
import type { ComputedRef } from 'vue'

type GetArticlesParams = {
  user: ComputedRef<string>
  path: ComputedRef<string>
  repo: string
  branch?: ComputedRef<string>
}

export function useGetArticlesQuery({
  user,
  path,
  repo,
  branch
}: GetArticlesParams): ReturnType<typeof useQuery> {
  return useQuery({
    queryKey: ['getArticles', user, path, repo, branch],
    queryFn: async ({ queryKey }) => {
      const contentResponse = await axios.get(
        `${SERVER_URL}/content?user=${queryKey[1]}&path=${queryKey[2]}&repo=${queryKey[3]}&branch=${queryKey[4]}`,
        {
          headers: {
            [`x-github-token`]: `${localStorage.getItem('github-access-token')}`
          }
        }
      )
      return contentResponse.data.items
    },
    enabled: false
  })
}

export function useUpdateArticle({
  onSuccess,
  onError
}: {
  onSuccess: (data: unknown) => unknown
  onError: (error: unknown) => unknown
}): ReturnType<typeof useMutation> {
  return useMutation<any, any, any>({
    mutationFn: async ({ path, meta, content, user, repo, branch }) => {
      const contentResponse = await axios.put(
        `${SERVER_URL}/publish`,
        {
          path,
          meta,
          content,
          user,
          repo,
          branch
        },
        {
          headers: {
            [`x-github-token`]: `${localStorage.getItem('github-access-token')}`
          }
        }
      )

      return contentResponse.data
    },
    onSuccess,
    onError
  })
}

export function useCreateNewArticle({
  onSuccess,
  onError
}: {
  onSuccess: (data: unknown) => unknown
  onError: (error: unknown) => unknown
}): ReturnType<typeof useMutation> {
  return useMutation<any, any, any, any>({
    mutationFn: async ({ name, path, meta, content, user, repo, branch }) => {
      const contentResponse = await axios.post(
        `${SERVER_URL}/publish`,
        {
          name,
          path,
          meta,
          content,
          user,
          repo,
          branch
        },
        {
          headers: {
            [`x-github-token`]: `${localStorage.getItem('github-access-token')}`
          }
        }
      )
      return contentResponse.data
    },
    onSuccess,
    onError
  })
}
