/* eslint-disable no-magic-numbers */
/* eslint-disable max-params */
import { useMutation, useQueryClient } from 'react-query'

import drawService, { IDraw } from '@/services/drawService'

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
      const newDraw = {
        id: newDrawId,
        ...drawPayload
      }

      queryClient.setQueryData('draws', (old: IDraw[] | undefined) => [...old || [], newDraw])
    }
  })
}

export const useUpdateDrawMutation = () => {
  // const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (draw: IDraw) => {
      const response = await drawService.updateDraw(draw.id, draw)
  
      if (response.error) {
        throw new Error('Error on update a draw')
      }
  
      return response.data
    },
    // onMutate: async (updatedDraw: IDraw) => {
    //   await queryClient.cancelQueries({ queryKey: ['draws'] })
    //   // await queryClient.cancelQueries({ queryKey: ['draw', updatedDraw.id] })
  
    //   const previousDraws = queryClient.getQueryData(['draws'])
    //   // const previousDraw = queryClient.getQueryData(['draw', updatedDraw.id]) as IDraw
  
    //   queryClient.setQueryData(['draws'], (old: IDraw[] | undefined) => {
    //     const prev = old || []
    //     const index = prev.findIndex(prevDraw => prevDraw.id === updatedDraw.id)

    //     return prev.splice(index, 1, updatedDraw)
    //   })

    //   // queryClient.setQueryData(['draw', updatedDraw.id], { ...updatedDraw })
  
    //   return { previousDraws }
    // },
    // onError: (_err, _newDraw, context) => {
    //   queryClient.setQueryData(['draws'], context?.previousDraws)
    //   // queryClient.setQueryData(['draw', context?.previousDraw?.id || ''], context?.previousDraw)
    // },
    // onSettled: () => {
    //   queryClient.invalidateQueries({ queryKey: ['draws'] })
    //   // queryClient.invalidateQueries({ queryKey: ['draw', variables.id] })
    // },
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
      await queryClient.cancelQueries({ queryKey: ['draws'] })
    
      const previousDraws = queryClient.getQueryData(['draws'])
    
      queryClient.setQueryData(['draws'], (old: IDraw[] | undefined) => {
        const prev = old || []
        const index = prev.findIndex(prevDraw => prevDraw.id === drawId)

        return prev.splice(index, 1)
      })
    
      return { previousDraws }
    },
    onError: (_err, _newDraw, context) => {
      queryClient.setQueryData(['draws'], context?.previousDraws)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['draws'] })
    },
  })
}