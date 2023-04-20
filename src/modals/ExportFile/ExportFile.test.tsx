import { describe, it, Mock, vi } from 'vitest'

import { save } from '@tauri-apps/api/dialog'
import { downloadDir } from '@tauri-apps/api/path'
import userEvent from '@testing-library/user-event'

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
vi.mock('@tauri-apps/api/dialog')
vi.mock('@tauri-apps/api/path')

const getDrawByIdQueryMock = useGetDrawByIdQuery as Mock
const saveMock = save as Mock
const downloadDirMock = downloadDir as Mock

describe('<ExportFile /> tests', () => { 
  beforeEach(() => {
    getDrawByIdQueryMock.mockReturnValue({ data: testDraw })
    saveMock.mockResolvedValue('/some-file-path/file')
    downloadDirMock.mockResolvedValue('/download-path')
  })

  describe('When render', () => { 
    it('should render', () => {
      const { getByText } = customRenderModal(<ExportFile drawId={testDraw.id} />)
    
      expect(getByText('Export draw')).toBeInTheDocument()
      expect(getByText('Select the target:')).toBeInTheDocument()
      expect(getByText('SVG')).toBeInTheDocument()
      expect(getByText('PNG')).toBeInTheDocument()
      expect(getByText('JSON')).toBeInTheDocument()
    })
  
    it('should show image preview', () => {
      const { getByAltText } = customRenderModal(<ExportFile drawId={testDraw.id} />)
    
      expect(getByAltText('test draw')).toBeInTheDocument()
    })
  })

  describe('When export file', () => { 
    it('should export to svg file', async () => {
      const { getByText } = customRenderModal(<ExportFile drawId={testDraw.id} />)

      await userEvent.click(getByText('SVG'))

      await userEvent.click(getByText('Export'))


      expect(saveMock).toHaveBeenCalledWith({
        defaultPath: '/download-path/test-draw.svg'
      })
    })

    it('should export to png file', async () => {
      const { getByText } = customRenderModal(<ExportFile drawId={testDraw.id} />)

      await userEvent.click(getByText('PNG'))

      await userEvent.click(getByText('Export'))

      expect(saveMock).toHaveBeenCalledWith({
        defaultPath: '/download-path/test-draw.png'
      })
    })

    it('should export to png file', async () => {
      const { getByText } = customRenderModal(<ExportFile drawId={testDraw.id} />)

      await userEvent.click(getByText('JSON'))

      await userEvent.click(getByText('Export'))

      expect(saveMock).toHaveBeenCalledWith({
        defaultPath: '/download-path/test-draw.json'
      })
    })
  })
})