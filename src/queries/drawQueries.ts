import { useQuery } from 'react-query'

import drawService, { IDraw, IDrawInfo, IDrawInfoQuery, IPaginatedResponse } from '@/services/drawService'

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
    cacheTime: 1,
    select: (data): IDraw | null => {
      if (!data) {
        return null
      }

      return {
        id:  data.id,
        name: data.name,
        description: data.description,
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

export const useGetDrawsInfoQuery = (query: IDrawInfoQuery) => {
  return useQuery<IPaginatedResponse<IDrawInfo>>({
    queryKey: ['draws_info', query],
    cacheTime: 0,
    queryFn: async () => {
      const response = await drawService.findDrawsInfo(query)
      
      if (response.error) {
        throw new Error('Error on fetching draws info')
      }

      return {
        results: response.data || [],
        count: response.count,
        totalPages: response.total_pages,
      }
    },
  })
}

