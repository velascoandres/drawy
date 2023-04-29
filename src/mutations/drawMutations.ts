/* eslint-disable no-magic-numbers */
/* eslint-disable max-params */
import { useMutation, useQueryClient } from 'react-query'

import drawService, { IDraw, IUpdateDraw } from '@/services/drawService'

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
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['draws_info'] })
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
    
      return { drawById, previousDraws }
    },
    onError: (_err, updatedDraw, context) => {
      queryClient.setQueryData(['draw', updatedDraw.id], context?.drawById)
    },

    onSuccess: async (_data, variables) => {
      if (variables?.scene) {
        return
      }
      await queryClient.invalidateQueries({ queryKey: ['draws_info'] })
    }
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
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['draws_info'] })
    }
  })
}