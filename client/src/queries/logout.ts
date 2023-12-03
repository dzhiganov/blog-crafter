import { useMutation } from '@tanstack/vue-query'
import axios from 'axios'
import { SERVER_URL } from './constants'

export function useLogout(): ReturnType<typeof useMutation> {
  return useMutation({
    mutationFn: async () => {
      const contentResponse = await axios.delete(`${SERVER_URL}/session`, {
        headers: {
          [`x-github-token`]: `${localStorage.getItem('github-access-token')}`
        },

        auth: {
          username: 'test1',
          password: 'test2'
        }
      })
      return contentResponse.data.items
    }
  })
}
