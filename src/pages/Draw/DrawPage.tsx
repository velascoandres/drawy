import React from 'react'
import { FiDownload, FiGrid, FiMoon, FiSun } from 'react-icons/fi'
import { useParams } from 'react-router-dom'

import { 
  Box,
  Flex, 
  Heading,
  IconButton,
} from '@chakra-ui/react'
import { Excalidraw, MainMenu } from '@excalidraw/excalidraw'
import {
  AppState,
  BinaryFileData,
  BinaryFiles,
  ExcalidrawImperativeAPI,
} from '@excalidraw/excalidraw/types/types'

import initialData from '@/constants/initial-data'
import useDebounceCallback from '@/hooks/useDebounceCallback'
import useWindowSize from '@/hooks/useWindowSize'
import ExportFile from '@/modals/ExportFile/ExportFile'
import { useUpdateDrawMutation } from '@/mutations/drawMutations'
import { useGetDrawByIdQuery } from '@/queries/drawQueries'
import useModalStore from '@/store/modal/modalStore'

const UPDATE_SCENE_DEBOUNCE = 1000
const HEIGHT_DELTA = 21.5
const HEIGHT_DELTA_MOBILE = 101.5

const DrawPage = () => {
  const params = useParams()
  const { data: draw } = useGetDrawByIdQuery(params.drawId as string)
  const { mutate: updateDraw } = useUpdateDrawMutation()
  const { height, isMobile, isTablet } = useWindowSize()

  const { openModal } = useModalStore()

  const hasLoadedDrawRef = React.useRef<boolean>(false)

  const debounceUpdateScene = useDebounceCallback(UPDATE_SCENE_DEBOUNCE)

  const [darkMode, setDarkMode] = React.useState(false)
  const [enableGrid, setEnableGrid] = React.useState(false)

  const [
    excalidrawAPI,
    setExcalidrawAPI
  ] = React.useState<ExcalidrawImperativeAPI | null>(null)

  // eslint-disable-next-line max-params, @typescript-eslint/no-explicit-any
  const handleChange = (elements: any[], appState: AppState, files?: BinaryFiles) => {
    if (!elements.length) {
      return
    }
    if (!draw) {
      return
    }

    const filesToUpdate = files || {}
    const payload = {
      id: draw.id,
      name: draw.name,
      scene: { 
        elements, 
        appState: {
          viewBackgroundColor: appState.viewBackgroundColor,
          currentItemFontFamily: appState.currentItemFontFamily,
          currentItemFontSize: appState.currentItemFontSize,
          theme: appState.theme,
          exportWithDarkMode: appState.exportWithDarkMode,
          gridSize: appState.gridSize,
        }, 
        scrollToContent: true, 
        libraryItems: initialData.libraryItems,
        files: Object.values(filesToUpdate),
        rawFiles: filesToUpdate,
      },
    }

    updateDraw(payload)
  }

  const openExportModal = () => {
    if (!draw) {
      return
    }

    if (!excalidrawAPI) {
      return
    }

    openModal({
      component: ExportFile,
      config: {
        closeOnClickOutside: true,
        closeOnEscapeKeydown: true,
        size: 'xl',
      },
      props: {
        drawInfo: { id: draw.name, name: draw.name, description: draw.description },
        drawApi: excalidrawAPI
      },
    })
  }

  React.useEffect(() => {
    if (!excalidrawAPI) {
      return
    }

    if (hasLoadedDrawRef.current) {
      return
    }

    if (!draw?.scene) {
      return
    }

    const files = draw.scene?.files as BinaryFileData[] 

    if (files?.length) {
      excalidrawAPI.addFiles(draw.scene.files as BinaryFileData[])
    }

    excalidrawAPI.updateScene(draw.scene)
    excalidrawAPI.scrollToContent()
    hasLoadedDrawRef.current = true
  
  }, [draw?.scene, excalidrawAPI])

  const canvasWrapperHeight = React.useMemo(
    () => {
      if (isMobile || isTablet) {
        return height - HEIGHT_DELTA_MOBILE
      }

      return height - HEIGHT_DELTA
    }, 
    [height, isMobile, isTablet]
  )

  React.useEffect(() => {
    if (!draw?.scene) {
      return
    }

    const hasDarkMode = draw.scene?.appState?.theme === 'dark'
    const hasGrid = Boolean(draw.scene?.appState?.gridSize)

    setDarkMode(hasDarkMode)
    setEnableGrid(hasGrid)
  }, [draw?.scene])

  React.useLayoutEffect(() => {
    hasLoadedDrawRef.current = false
    excalidrawAPI?.resetScene()
  }, [params.drawId, excalidrawAPI])

  return (
    <Flex align="start" direction="column" gap={2} position="relative">
      <Flex direction="row" justifyContent="start" alignItems="center" gap={2} pl={4}>
        <IconButton background="white" icon={<FiDownload />} onClick={openExportModal} aria-label="export" />
        <Heading as="h3" size="lg" cursor="pointer" >
          {draw?.name}
        </Heading>
        <Flex direction="row" justifyContent="start" gap={2} position="absolute" right="1" top="1">
          <IconButton
            background="white" 
            icon={<FiGrid fill={`${enableGrid ? 'white' : 'black'}`} />} 
            aria-label="grid" 
            onClick={() => setEnableGrid(value => !value)} 
          />
          <IconButton
            background="white"
            icon={darkMode ? <FiSun /> : <FiMoon fill="black" />} 
            aria-label="dark-mode" 
            onClick={() => setDarkMode(value => !value)} 
          />
        </Flex>
      </Flex>
      <Box position="relative" width="100%">
        <Box height={canvasWrapperHeight} width="100%" position="absolute" paddingBottom={16}>
          <Excalidraw
            ref={(api: ExcalidrawImperativeAPI) => {
              setExcalidrawAPI(api)
            }}
            // eslint-disable-next-line max-params
            onChange={(elements, appState, files) => {
              debounceUpdateScene(() => handleChange([...elements], appState, files))
            }}
            viewModeEnabled={false}
            gridModeEnabled={enableGrid}
            theme={darkMode ? 'dark' : 'light'}
            name={draw?.name}
            UIOptions={{ canvasActions: { loadScene: false } }}
          >
            <div style={{ display: 'none' }}>

              <MainMenu>
                <MainMenu.DefaultItems.ClearCanvas />
              </MainMenu>
            </div>
          </Excalidraw>
        </Box>
      </Box>
    </Flex>
  )
}

export default DrawPage