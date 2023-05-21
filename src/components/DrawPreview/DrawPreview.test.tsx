import { describe, it } from 'vitest'

import initialData from '@/constants/initial-data'
import { act, customRender, waitFor } from '@/test-utils/custom-render'

import DrawPreview from './DrawPreview'

const testDraw = {
  scene: initialData
}

describe('<DrawPreview /> tests', () => {
  it('should show not the preview content initially', async () => {
    const { queryByRole } = customRender(
      <DrawPreview 
        drawScene={{
          elements: testDraw.scene.elements,
          appState: testDraw.scene.appState,
          files: undefined
        }} 
      />)

    await act(async () => {
      expect(queryByRole('img')).not.toBeInTheDocument()
    })
  })

  it('should show preview content', async () => {
    const { getByRole } = customRender(
      <DrawPreview 
        drawScene={{
          elements: testDraw.scene.elements,
          appState: testDraw.scene.appState,
          files: undefined
        }} 
      />)

    await waitFor(() => {
      expect(getByRole('img')).toBeInTheDocument()
    })
  })
})