import React from 'react'
import { beforeEach, describe, expect, it, Mock } from 'vitest'

import { useUpdateDrawMutation } from '@/mutations/drawMutations'
import { useGetDrawByIdQuery } from '@/queries/drawQueries'
import { customRender } from '@/test-utils/custom-render'

import DrawPage from './DrawPage'

vi.mock('zustand')
vi.mock('react-router-dom', () => ({
  useParams: vi.fn().mockReturnValue({ drawId: '1' }),
}))

vi.mock('@/queries/drawQueries')
vi.mock('@/mutations/drawMutations')

vi.mock('@excalidraw/excalidraw', () => ({
  // eslint-disable-next-line react/display-name
  Excalidraw: React.forwardRef(({ children }: { children: React.ReactNode }) => <div>{children}</div>),
}))

const updateDrawMock = vi.fn()

const useGetDrawByIdQueryMock = useGetDrawByIdQuery as Mock
const useUpdateDrawMutationMock = useUpdateDrawMutation as Mock

describe('<DrawPage /> tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useGetDrawByIdQueryMock.mockReturnValue({ data: { id: '1', name: 'Draw name test' } })
    useUpdateDrawMutationMock.mockReturnValue({ mutate: updateDrawMock })
  })

  describe('When renders', () => { 
    it('should show export button', () => {
      const { getByText } = customRender(<DrawPage />)
    
      expect(getByText('Export')).toBeInTheDocument()
    })

    it('should show draw name', () => {
      const { getByText } = customRender(<DrawPage />)
    
      expect(getByText('Draw name test')).toBeInTheDocument()
    })
  })
})