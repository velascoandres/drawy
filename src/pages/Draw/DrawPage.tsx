import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import {
  FiCheck,
  FiX,
} from 'react-icons/fi'
import { useParams } from 'react-router-dom'

import { 
  Box,
  Divider, 
  Flex, 
  Heading,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react'
import {
  Excalidraw,
} from '@excalidraw/excalidraw'
import {
  AppState,
  ExcalidrawImperativeAPI,
} from '@excalidraw/excalidraw/types/types'

import InputHF from '@/components/InputHF/InputHF'
import initialData from '@/constants/initial-data'
import useDebounceCallback from '@/hooks/useDebounceCallback'
import { useUpdateDrawMutation } from '@/mutations/drawMutations'
import { useGetDrawByIdQuery } from '@/queries/drawQueries'

const UPDATE_SCENE_DEBOUNCE = 1000

const DrawPage = () => {
  const params = useParams()
  const { data: draw } = useGetDrawByIdQuery(params.drawId as string)
  const { mutate: updateDraw } = useUpdateDrawMutation()
  const form = useForm<{name: string}>({
    values: {
      name: draw?.name || ''
    }
  })

  const hasLoadedDrawRef = React.useRef<boolean>(false)
  const { isOpen: isEditingName, onToggle } = useDisclosure()


  const debounceUpdateScene = useDebounceCallback(UPDATE_SCENE_DEBOUNCE)

  const [viewModeEnabled] = React.useState(false)
  const [gridModeEnabled] = React.useState(false)
  const [theme] = React.useState('light')

  const [
    excalidrawAPI,
    setExcalidrawAPI
  ] = React.useState<ExcalidrawImperativeAPI | null>(null)


  const handleUpdateName = ({ name }:{name: string}) => {
    updateDraw({ id: params.drawId as string, name, scene: draw?.scene })
    onToggle()
  }

  const resetForm = () => {
    form.setValue('name', draw?.name as string)
    onToggle()
  }

  const handleChange = (elements: any[], appState: AppState) => {
    if (!draw) {
      return
    }
    updateDraw({
      id: draw.id,
      name: draw.name,
      scene: { 
        elements, 
        appState: {
          viewBackgroundColor: appState.viewBackgroundColor,
          currentItemFontFamily: appState.currentItemFontFamily,
          currentItemFontSize: appState.currentItemFontSize
        }, 
        scrollToContent: true, 
        libraryItems: initialData.libraryItems
      } 
    })
  }

  React.useEffect(() => {
    if (draw?.scene && !hasLoadedDrawRef.current && excalidrawAPI) {
      excalidrawAPI.updateScene(draw.scene)
      excalidrawAPI.scrollToContent()
      hasLoadedDrawRef.current = true
    }
  }, [draw?.scene])

  React.useEffect(() => {
    excalidrawAPI?.resetScene()
    hasLoadedDrawRef.current = false
  }, [params.drawId])

  return (
    <Flex align="start" direction="column">
      <Flex direction="row" justifyContent="start">
        {
          isEditingName ? (
            <form onSubmit={form.handleSubmit(handleUpdateName)}>
              <FormProvider {...form}>
                <Flex direction="row" justifyContent="start">
                  <InputHF 
                    name="name" 
                    inputProps={{ placeholder: 'Write a name for your draw' }} 
                  />
                  <IconButton aria-label="confirm-update" icon={<FiCheck />} type="submit" />
                  <IconButton aria-label="cancel-update" icon={<FiX />} onClick={resetForm} />
                </Flex>
              </FormProvider>
            </form>
          ) : (
            <Heading as="h3" size="lg" onClick={onToggle} cursor="pointer" >
              {draw?.name}
            </Heading>
          )
        }
      </Flex>
      <Divider orientation="horizontal" />
      <Box position="relative" width="100%">
        <Box height="-webkit-fill-available" width="100%" position="absolute" paddingY={4}>
          <Excalidraw
            ref={(api: ExcalidrawImperativeAPI) => setExcalidrawAPI(api)}
            onChange={(elements, appState) => {
              debounceUpdateScene(() => handleChange([...elements], appState))
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