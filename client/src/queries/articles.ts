import { useQuery, useMutation } from '@tanstack/vue-query'
import axios from 'axios'
import { SERVER_URL } from './constants'
import Cookie from 'js-cookie'

export function useGetArticlesQuery({ user, path, repo, branch }): ReturnType<typeof useQuery> {
  return useQuery({
    queryKey: ['getArticles', user, path, repo, branch],
    queryFn: async ({ queryKey }) => {
      const contentResponse = await axios.get(
        `${SERVER_URL}/content?user=${queryKey[1]}&path=${queryKey[2]}&repo=${queryKey[3]}&branch=${queryKey[4]}`,
        {
          headers: {
            [`x-github-token`]: `${Cookie.get('github-access-token')}`
          }
        }
      )
      return contentResponse.data.items
    },
    enabled: false
  })
}

export function useUpdateArticle(): ReturnType<typeof useMutation> {
  return useMutation<any, any, any>({
    mutationFn: async ({ path, meta, content }) => {
      const contentResponse = await axios.put(
        `${SERVER_URL}/publish`,
        {
          path,
          meta,
          content
        },
        {
          headers: {
            [`x-github-token`]: `${Cookie.get('github-access-token')}`
          }
        }
      )
      return contentResponse.data
    }
  })
}

export function useCreateNewArticle(): ReturnType<typeof useMutation> {
  return useMutation<any, any, any, any>({
    mutationFn: async ({ name, path, meta, content }) => {
      const contentResponse = await axios.post(
        `${SERVER_URL}/publish`,
        {
          name,
          path,
          meta,
          content
        },
        {
          headers: {
            [`x-github-token`]: `${Cookie.get('github-access-token')}`
          }
        }
      )
      return contentResponse.data
    }
  })
}
