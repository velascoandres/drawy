import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { FiDownload } from 'react-icons/fi'
import { useParams } from 'react-router-dom'

import { 
  Box,
  Button,
  Divider, 
  Flex, 
  Heading,
} from '@chakra-ui/react'
import { Excalidraw } from '@excalidraw/excalidraw'
import {
  AppState,
  BinaryFileData,
  BinaryFiles,
  ExcalidrawImperativeAPI,
} from '@excalidraw/excalidraw/types/types'

import SwitchHF from '@/components/SwitchHF/SwitchHF'
import initialData from '@/constants/initial-data'
import useDebounceCallback from '@/hooks/useDebounceCallback'
import ExportFile from '@/modals/ExportFile/ExportFile'
import { useUpdateDrawMutation } from '@/mutations/drawMutations'
import { useGetDrawByIdQuery } from '@/queries/drawQueries'
import useModalStore from '@/store/modal/modalStore'

const UPDATE_SCENE_DEBOUNCE = 1000

interface IDrawUIStatus {
  darkMode: boolean
  grid: boolean
}

const DrawPage = () => {
  const params = useParams()
  const { data: draw } = useGetDrawByIdQuery(params.drawId as string)
  const { mutate: updateDraw } = useUpdateDrawMutation()

  const { openModal } = useModalStore()

  const hasLoadedDrawRef = React.useRef<boolean>(false)

  const debounceUpdateScene = useDebounceCallback(UPDATE_SCENE_DEBOUNCE)

  const form = useForm<IDrawUIStatus>({
    defaultValues: {
      grid: false,
      darkMode: false,
    }
  })

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

  React.useEffect(() => {
    if (!draw?.scene) {
      return
    }

    const hasDarkMode = draw.scene?.appState?.theme === 'dark'
    const hasGrid = Boolean(draw.scene?.appState?.gridSize)

    form.setValue('darkMode', hasDarkMode)
    form.setValue('grid', hasGrid)
  }, [draw?.scene, form])

  React.useLayoutEffect(() => {
    hasLoadedDrawRef.current = false
    excalidrawAPI?.resetScene()
  }, [params.drawId, excalidrawAPI])

  return (
    <Flex align="start" direction="column" gap={2}>
      <Flex direction="row" justifyContent="start" alignItems="center" gap={1}>
        <Heading as="h3" size="lg" cursor="pointer" >
          {draw?.name}
        </Heading>
        
        <Button leftIcon={<FiDownload />} onClick={openExportModal}>
            Export
        </Button>
      </Flex>
      <Divider background="black" />
      <FormProvider {...form}>
        <Flex direction="column" justifyContent="start" gap={0}>
          <SwitchHF label="Dark mode:" name="darkMode" justifyContent="start" />
          <SwitchHF label="Enable grid:" name="grid" justifyContent="start" />
        </Flex> 
      </FormProvider>
      <Box position="relative" width="100%">
        <Box height="-webkit-fill-available" width="100%" position="absolute" paddingBottom={16}>
          <Excalidraw
            ref={(api: ExcalidrawImperativeAPI) => {
              setExcalidrawAPI(api)
            }}
            // eslint-disable-next-line max-params
            onChange={(elements, appState, files) => {
              debounceUpdateScene(() => handleChange([...elements], appState, files))
            }}
            viewModeEnabled={false}
            gridModeEnabled={form.watch('grid')}
            theme={form.watch('darkMode') ? 'dark' : 'light'}
            name="Custom name of drawing"
            UIOptions={{ canvasActions: { loadScene: false } }}
          />
        </Box>
      </Box>
    </Flex>
  )
}

export default DrawPage