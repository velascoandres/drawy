import { useIsFetching, useIsMutating } from 'react-query'
import { describe, it, Mock, vi } from 'vitest'

import { customRender } from '@/test-utils/custom-render'

import StatusBar from './StatusBar'


vi.mock('react-query')

const isFetchingMock = useIsFetching as Mock
const isMutatingMock = useIsMutating as Mock

describe('<StatusBar />', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    isFetchingMock.mockReturnValue(0)
    isMutatingMock.mockReturnValue(0)
  })
  
  describe('When renders', () => {
    it('should show default message', () => {
      const { getByText } = customRender(<StatusBar />)
    
      expect(getByText('All ok ✅')).toBeInTheDocument()
    })
  })

  describe('When isFetching', () => {
    beforeEach(() => {
      isFetchingMock.mockReturnValue(1)
    })

    it('should show message for "isFetching"', () => {
      const { getByText } = customRender(<StatusBar />)
    
      expect(getByText('Some info is fetching...')).toBeInTheDocument()
    })
  })

  describe('When isMutating', () => {
    beforeEach(() => {
      isMutatingMock.mockReturnValue(1)
    })

    it('should show message for "isMutating"', () => {
      const { getByText } = customRender(<StatusBar />)
    
      expect(getByText('Some info is updating...')).toBeInTheDocument()
    })
  })
})