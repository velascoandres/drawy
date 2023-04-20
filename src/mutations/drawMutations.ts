/* eslint-disable no-magic-numbers */
/* eslint-disable max-params */
import { useMutation, useQueryClient } from 'react-query'

import PAGINATION from '@/constants/pagination'
import drawService, { IDraw, IDrawInfo, IPaginatedResponse, IUpdateDraw } from '@/services/drawService'

export const useCreateDrawMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (draw: Omit<IDraw, 'id'>) => {
      const response = await drawService.createDraw(draw)

      if (response.error) {
        throw new Error('Error on create a draw')
      }

      return response.data as string
    },
    onSuccess: async (newDrawId: string, drawPayload: Omit<IDraw, 'id'>) => {
      const newDrawInfo = {
        id: newDrawId,
        name: drawPayload.name,
      }

      queryClient.setQueryData<IPaginatedResponse<IDrawInfo>>('draws_info', (old) => {
        const prev = old || { results: [], count: 0, totalPages: 0 }

        const updatedResults = [newDrawInfo, ...prev.results]

        return {
          ...prev,
          results: updatedResults,
          count: prev.count + 1
        }
      })
    }
  })
}

export const useUpdateDrawMutation = () => {  
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (draw: IUpdateDraw) => {
      const response = await drawService.updateDraw(draw.id, draw)
  
      if (response.error) {
        throw new Error('Error on update a draw')
      }
  
      return response.data
    },
    onMutate: async (draw: IUpdateDraw) => {
      await queryClient.cancelQueries({ queryKey: ['draws_info'] })
    
      const previousDraws = queryClient.getQueryData(['draws_info'])
      const drawById = queryClient.getQueryData(['draw', draw.id])

      if (draw.scene) {
        return { previousDraws, drawById }
      }
    
      queryClient.setQueryData<IPaginatedResponse<IDrawInfo>>(['draws_info'], (old) => {
        const prev = old || { results: [], count: 0, totalPages: 0 }
        const index = prev.results.findIndex(prevDraw => prevDraw.id === draw.id)

        const oldDraw = prev.results[index]

        const updatedDraw = {
          ...draw,
          name: draw.name || oldDraw.name
        }
        const draws = [...prev.results]

        draws.splice(index, 1, updatedDraw)

        return {
          count: prev.count,
          results: draws,
          totalPages: prev.totalPages
        }
      })

      queryClient.setQueryData(['draw', draw.id], (old: unknown) => {
        const oldDraw = old as IDraw

        if (oldDraw) {
          return {
            ...draw,
            id: oldDraw.id,
            scene: oldDraw.scene
          }
        }

      })
    
      return { previousDraws, drawById }
    },
    onError: (_err, updatedDraw, context) => {
      queryClient.setQueryData(['draws_info'], context?.previousDraws)
      queryClient.setQueryData(['draw', updatedDraw.id], context?.drawById)
    },
  })
}

export const useDeleteDrawMutation = () => {
  const queryClient = useQueryClient()
    
  return useMutation({
    mutationFn: async (drawId: string) => {
      const response = await drawService.deleteDraw(drawId)
    
      if (response.error) {
        throw new Error('Error on delete a draw')
      }
    
      return response.data
    },
    onMutate: async (drawId: string) => {
      await queryClient.cancelQueries({ queryKey: ['draws_info'] })
    
      const previousDraws = queryClient.getQueryData(['draws_info'])
    
      queryClient.setQueryData<IPaginatedResponse<IDrawInfo>>(['draws_info'], (old) => {
        const prev = old || { results: [], count: 0 }
        const index = prev.results.findIndex(prevDraw => prevDraw.id === drawId)

        const draws = [...prev.results]

        draws.splice(index, 1)
        const newCount = prev.count - 1

        return {
          count: newCount,
          results: draws,
          totalPages: Math.ceil(newCount / PAGINATION.INFO_DRAW_PAGINATION)
        }
      })
    
      return { previousDraws }
    },
    onError: (_err, _newDraw, context) => {
      queryClient.setQueryData(['draws_info'], context?.previousDraws)
    },
  })
}