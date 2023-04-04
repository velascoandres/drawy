import { useQuery } from 'react-query'

import drawService from '@/services/drawService'

export const useGetDrawsQuery = () => {
  return useQuery({
    queryKey: 'draws',
    queryFn: async () => {
      const response = await drawService.findDraws()

      if (response.error) {
        throw new Error('Error on fetching draws')
      }

      return response.data  
    }
  })
}

export const useGetDrawByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ['draw', id],
    enabled: Boolean(id),
    queryFn: async () => {
      const response = await drawService.findOneDraw(id)

      if (response.error) {
        throw new Error('Error on fetching draw')
      }

      return response.data  
    }
  })
}