import React from 'react'

import { Box, useColorModeValue } from '@chakra-ui/react'
import { exportToSvg } from '@excalidraw/excalidraw'
import { AppState, BinaryFiles } from '@excalidraw/excalidraw/types/types'

interface IProps {
    drawScene: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        elements: readonly any[],
        appState: Partial<AppState>
        files?: BinaryFiles
    },
    darkMode?: boolean
    embebScene?: boolean
    includeBackground?: boolean
}

const DrawPreview = (props: IProps) => {
  const { darkMode, includeBackground, embebScene, drawScene } = props

  const [exportPreview, setExportPreview] = React.useState<SVGSVGElement>()
  const color = useColorModeValue('gray.200', 'gray.700')

  React.useEffect(() => {
    exportToSvg({
      elements: drawScene.elements || [],
      appState: {
        ...drawScene.appState || {},
        exportWithDarkMode: darkMode,
        exportBackground: includeBackground,
        exportEmbedScene: embebScene,
        theme: darkMode ? 'dark' : 'light',
        exportScale: 0.3,
      },
      files: drawScene?.files || null
    }).then((file) => {
      setExportPreview(file)
    })
  }, [darkMode, drawScene, embebScene, includeBackground])

  if (!exportPreview) {
    return null
  }


  return (
    <Box 
      background={darkMode ? 'black' : 'transparent'} 
      role="img"
      border={color}
      overflowY="auto"
      overflowX="auto"
      height="500px"
      width="600px"
      dangerouslySetInnerHTML={{ __html: exportPreview.outerHTML }} 
    />
  )
}


export default DrawPreview