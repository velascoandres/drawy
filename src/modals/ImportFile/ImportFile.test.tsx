import { QueryClient, QueryClientProvider } from 'react-query'
import { describe, expect, it, Mock, vi } from 'vitest'

import { fireEvent, waitFor } from '@testing-library/react'

import drawService from '@/services/drawService'
import useModalStore from '@/store/modal/modalStore'
import { customRenderModal } from '@/test-utils/custom-render'
import getDrawFiles from '@/utils/getDrawFiles'

import ImportFile from './ImportFile'

vi.mock('@/utils/getDrawFiles')
vi.mock('@/services/drawService')
vi.mock('zustand')

const createDrawMock = drawService.createDraw as Mock


const getDrawFilesMocked = getDrawFiles as Mock
const queryClient = new QueryClient()

const renderWithProvider = (ui: JSX.Element) => customRenderModal(
  <QueryClientProvider client={queryClient}>
    {ui}
  </QueryClientProvider>
)

describe('<ImportFile /> tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    getDrawFilesMocked.mockResolvedValue({ 
      drawName: 'Draw from PC', 
      drawDescription: 'description 1', 
      scene: {} 
    })

    createDrawMock.mockResolvedValue({ 
      data: {
        id: 'some-id', 
        name: 'Draw from PC', 
        description: 'description 1', 
        scene: {}
      } 
    })

    useModalStore.setState({
      isOpen: true
    })
  })
    
  describe('when renders without loading a file', () => {
    it('should show the empty state message', () => {
      const { getByText } = renderWithProvider(<ImportFile />)
    
      expect(getByText('Open explorer')).toBeInTheDocument()
    })
  })
  describe('when renders after loading a file', () => {
    it('should show the file information  (loading was success)', async () => {
      const { getByText, queryByText, getByDisplayValue } = renderWithProvider(<ImportFile />)


      fireEvent.click(getByText('Open explorer'))

      await waitFor(() => {
        expect(queryByText('Open explorer')).not.toBeInTheDocument()
      })


      expect(getByText('Draw information')).toBeInTheDocument()
      expect(getByText('Preview')).toBeInTheDocument()

      expect(getByDisplayValue('Draw from PC')).toBeInTheDocument()
      expect(getByDisplayValue('description 1')).toBeInTheDocument()
    })

    it('should not show the file information (loading was fail)', async () => {
      getDrawFilesMocked.mockRejectedValue({ error: 'some error' })

      const { getByText, queryByDisplayValue, queryByText } = renderWithProvider(<ImportFile />)
  
  
      fireEvent.click(getByText('Open explorer'))
  
      await waitFor(() => {
        expect(getByText('Open explorer')).toBeInTheDocument()
      })

      expect(queryByText('Draw information')).not.toBeInTheDocument()
      expect(queryByText('Preview')).not.toBeInTheDocument()
  
      expect(queryByDisplayValue('Draw from PC')).not.toBeInTheDocument()
      expect(queryByDisplayValue('description 1')).not.toBeInTheDocument()

      expect(getByText('Error on loading file')).toBeInTheDocument()
    })
  })

  describe('When importing a file', () => {
    it('should show a success alert and close the modal (importing was success)', async () => {
      const { getByText, queryByText } = renderWithProvider(<ImportFile />)


      fireEvent.click(getByText('Open explorer'))

      await waitFor(() => {
        expect(queryByText('Open explorer')).not.toBeInTheDocument()
      })

      fireEvent.click(getByText('Import'))

      await waitFor(() => {
        expect(getByText('Draw was imported')).toBeInTheDocument()
      })

      expect(useModalStore.getState().isOpen).toBeFalsy()
    })

    it('should show an error alert (importing was fail)', async () => {
      createDrawMock.mockRejectedValue({ 
        data: {},
        error: 'some error'
      })

      const { getByText, queryByText } = renderWithProvider(<ImportFile />)


      fireEvent.click(getByText('Open explorer'))

      await waitFor(() => {
        expect(queryByText('Open explorer')).not.toBeInTheDocument()
      })

      fireEvent.click(getByText('Import'))

      await waitFor(() => {
        expect(getByText('Error on importing draw')).toBeInTheDocument()
      })

      expect(useModalStore.getState().isOpen).toBeTruthy()
    })
  })
})