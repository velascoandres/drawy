import { describe, it, Mock, vi } from 'vitest'

import initialData from '@/constants/initial-data'
import { useGetDrawByIdQuery } from '@/queries/drawQueries'
import { IDraw } from '@/services/drawService'
import { customRenderModal } from '@/test-utils/custom-render'

import ExportFile from './ExportFile'

const testDraw: IDraw = {
  id: '1',
  name: 'test draw',
  scene: initialData
}

vi.mock('@/queries/drawQueries')

const getDrawByIdQueryMock = useGetDrawByIdQuery as Mock


describe('<ExportFile /> tests', () => { 
  beforeAll(() => {
    getDrawByIdQueryMock.mockReturnValue({ data: testDraw })
  })

  it('should render', () => {
    const { getByText } = customRenderModal(<ExportFile drawId={testDraw.id} />)
  
    expect(getByText('Export draw')).toBeInTheDocument()
    expect(getByText('Select the target:')).toBeInTheDocument()
    expect(getByText('Export with dark mode:')).toBeInTheDocument()
    expect(getByText('SVG')).toBeInTheDocument()
    expect(getByText('PNG')).toBeInTheDocument()
    expect(getByText('JSON')).toBeInTheDocument()
  })
})