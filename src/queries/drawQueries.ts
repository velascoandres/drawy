import { useQuery } from 'react-query'

import PAGINATION from '@/constants/pagination'
import drawService, { IDraw, IDrawInfo } from '@/services/drawService'

export interface IDrawInfoQueryResponse {
  results: IDrawInfo[], 
  count: number
}

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
    cacheTime: 0,
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

export const useGetDrawsInfoQuery = (limit = PAGINATION.INFO_DRAW_PAGINATION) => {
  return useQuery({
    queryKey: 'draws_info',
    enabled: Boolean(limit),
    queryFn: async () => {
      const response = await drawService.findDrawsInfo(limit)

      if (response.error) {
        throw new Error('Error on fetching draws info')
      }

      return {
        results: response.data,
        count: response.count
      }  
    },
  })
}
