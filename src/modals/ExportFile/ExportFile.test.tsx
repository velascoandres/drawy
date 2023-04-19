import { describe, it, Mock, vi } from 'vitest'

import { exportToBlob } from '@excalidraw/excalidraw'

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
vi.mock('@excalidraw/excalidraw')
vi.mock('@excalidraw/excalidraw/types/element/types')
vi.mock('@excalidraw/excalidraw/types/types')

const getDrawByIdQueryMock = useGetDrawByIdQuery as Mock


const exportToBlobMock = exportToBlob as Mock

describe('<ExportFile /> tests', () => { 
  beforeEach(() => {
    getDrawByIdQueryMock.mockReturnValue({ data: testDraw })
    exportToBlobMock.mockResolvedValue(new File([], 'test'))
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