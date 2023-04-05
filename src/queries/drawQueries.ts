import { useQuery } from 'react-query'

import drawService, { IDraw } from '@/services/drawService'

export const useGetDrawsQuery = () => {
  return useQuery({
    queryKey: 'draws',
    queryFn: async () => {
      const response = await drawService.findDraws()

      if (response.error) {
        throw new Error('Error on fetching draws')
      }

      return response.data  
    },
  })
}

export const useGetDrawByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ['draw', id],
    enabled: Boolean(id),
    select: (data): IDraw | null => {
      if (!data) {
        return null
      }

      return {
        id:  data.id,
        name: data.name,
        scene: data?.raw_elements ? JSON.parse(data?.raw_elements) : undefined
      } 
    },
    queryFn: async () => {
      const response = await drawService.findOneDraw(id)

      if (response.error) {
        throw new Error('Error on fetching draw')
      }


      return response.data
    }
  })
}