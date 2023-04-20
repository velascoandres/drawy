import React from 'react'
import { FiDownload } from 'react-icons/fi'
import { useParams } from 'react-router-dom'

import { 
  Box,
  Button,
  Divider, 
  Flex, 
  Heading,
} from '@chakra-ui/react'
import {
  Excalidraw,
} from '@excalidraw/excalidraw'
import {
  AppState,
  BinaryFileData,
  BinaryFiles,
  ExcalidrawImperativeAPI,
} from '@excalidraw/excalidraw/types/types'

import initialData from '@/constants/initial-data'
import useDebounceCallback from '@/hooks/useDebounceCallback'
import ExportFile from '@/modals/ExportFile/ExportFile'
import { useUpdateDrawMutation } from '@/mutations/drawMutations'
import { useGetDrawByIdQuery } from '@/queries/drawQueries'
import useModalStore from '@/store/modal/modalStore'

const UPDATE_SCENE_DEBOUNCE = 1000

const DrawPage = () => {
  const params = useParams()
  const { data: draw } = useGetDrawByIdQuery(params.drawId as string)
  const { mutate: updateDraw } = useUpdateDrawMutation()

  const { openModal } = useModalStore()

  const hasLoadedDrawRef = React.useRef<boolean>(false)

  const debounceUpdateScene = useDebounceCallback(UPDATE_SCENE_DEBOUNCE)

  const [viewModeEnabled] = React.useState(false)
  const [gridModeEnabled] = React.useState(false)
  const [theme] = React.useState('light')

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

    const payload = {
      id: draw.id,
      name: draw.name,
      scene: { 
        elements, 
        appState: {
          viewBackgroundColor: appState.viewBackgroundColor,
          currentItemFontFamily: appState.currentItemFontFamily,
          currentItemFontSize: appState.currentItemFontSize,
        }, 
        scrollToContent: true, 
        libraryItems: initialData.libraryItems,
        files: Object.values(files || {}),
        rawFiles: files,
      },
    }

    updateDraw(payload)
  }

  const openExportModal = () => {
    if (!draw) {
      return
    }

    openModal({
      component: ExportFile,
      props: {
        drawId: draw.id,
      },
    })
  }

  React.useEffect(() => {
    if (!(draw?.scene && !hasLoadedDrawRef.current && excalidrawAPI)) {
      return
    }

    const files = draw.scene.files as BinaryFileData[] 

    if (files.length) {
      excalidrawAPI.addFiles(draw.scene.files as BinaryFileData[])
    }

    excalidrawAPI.updateScene(draw.scene)
    excalidrawAPI.scrollToContent()
    hasLoadedDrawRef.current = true
  
  }, [draw?.scene, excalidrawAPI])

  React.useEffect(() => {
    hasLoadedDrawRef.current = false
    // excalidrawAPI?.resetScene()
  }, [params.drawId])

  return (
    <Flex align="start" direction="column">
      <Flex direction="row" justifyContent="start" alignItems="center" gap={2}>
        <Heading as="h3" size="lg" cursor="pointer" >
          {draw?.name}
        </Heading>
        
        <Button leftIcon={<FiDownload />} onClick={openExportModal}>
            Export
        </Button>
      </Flex>
      <Divider orientation="horizontal" />
      <Box position="relative" width="100%">
        <Box height="-webkit-fill-available" width="100%" position="absolute" paddingY={4}>
          <Excalidraw
            ref={(api: ExcalidrawImperativeAPI) => setExcalidrawAPI(api)}
            // eslint-disable-next-line max-params
            onChange={(elements, appState, files) => {
              debounceUpdateScene(() => handleChange([...elements], appState, files))
            }}
            viewModeEnabled={viewModeEnabled}
            gridModeEnabled={gridModeEnabled}
            theme={theme}
            name="Custom name of drawing"
            UIOptions={{ canvasActions: { loadScene: false } }}
          />
        </Box>
      </Box>
    </Flex>
  )
}

export default DrawPage