import React from 'react'
import { FiMinus, FiPlus } from 'react-icons/fi'

import { Box, Flex, IconButton } from '@chakra-ui/react'
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

type IContainerDimms = {
  width: number
  height: number
}

const MAX_HEIGHT = 600
const MAX_WIDTH = 600

const SCALE_FACTOR = 0.25
const INITIAL_SCALE = 1

const MAX_SCALE = 5
const MIN_SCALE = SCALE_FACTOR
const DEFAULT_DIMM = 100

const INITIAL_DIMMS: IContainerDimms = {
  width: 0,
  height: 0
}

const DrawPreview = (props: IProps) => {
  const { darkMode, includeBackground, embebScene, drawScene } = props

  const [exportPreview, setExportPreview] = React.useState<SVGSVGElement>()
  const [containerDimms, setContainerDimms] = React.useState<IContainerDimms>(INITIAL_DIMMS)
  const [containerScale, setContainerScale] = React.useState(INITIAL_SCALE)
  
  const hasReachMinValue = React.useMemo(() => {
    return containerScale <= MIN_SCALE
  }, [containerScale])

  const hasReachMaxValue = React.useMemo(() => {
    
    return containerScale >= MAX_SCALE
  }, [containerScale])


  const zoomIn = () => {
    if (hasReachMaxValue) {
      return
    }

    setContainerScale((currentScale) => currentScale + SCALE_FACTOR)
  }

  const zoomOut = () => {
    if (hasReachMinValue) {
      return
    }

    setContainerScale((currentScale) => currentScale - SCALE_FACTOR)
  }

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
    })
    .then((file) => {
      const { width, height } = file

      setContainerDimms({
        width: width?.animVal?.value || DEFAULT_DIMM,
        height: height?.animVal?.value || DEFAULT_DIMM,
      })

      setExportPreview(file)
    })
  }, [darkMode, drawScene, embebScene, includeBackground])

  if (!exportPreview) {
    return null
  }


  return (
    <Flex direction="column" gap={1}>
      <Flex 
        direction="row" 
        justify="center"
        position="relative"
        maxHeight={MAX_HEIGHT}
        maxWidth={MAX_WIDTH}
        overflow="hidden"
      >
        <Box
          id="preview-container"
          background={darkMode ? 'black' : 'transparent'} 
          role="img"
          style={{
            transform: `scale(${containerScale}, ${containerScale})`
          }}
          height={containerDimms.height}
          width={containerDimms.width}
          dangerouslySetInnerHTML={{ __html: exportPreview.outerHTML }}
        />
      </Flex>
      <Flex direction="row" gap={1}>
        <IconButton
          type="button"
          background="white"
          aria-label="zoom-in" 
          icon={<FiPlus />} 
          onClick={zoomIn} 
        />
        <IconButton 
          type="button"
          background="white"
          aria-label="zoom-out" 
          icon={<FiMinus />} 
          onClick={zoomOut} 
        />
      </Flex>
    </Flex>
  )
}


export default DrawPreview