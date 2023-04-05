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
import { useUpdateDrawMutation } from '@/mutations/drawMutations'
import { useGetDrawByIdQuery } from '@/queries/drawQueries'

const DrawPage = () => {
  const params = useParams()
  const { data: draw } = useGetDrawByIdQuery(params.drawId as string)
  const { mutate: updateDraw, isSuccess } = useUpdateDrawMutation()
  const form = useForm<{name: string}>({
    values: {
      name: draw?.name || ''
    }
  })

  const { isOpen: isEditingName, onToggle } = useDisclosure()

  const [viewModeEnabled, setViewModeEnabled] = React.useState(false)
  const [gridModeEnabled, setGridModeEnabled] = React.useState(false)
  const [theme, setTheme] = React.useState('dark')

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
      scene: { elements, appState } 
    })
  }

  React.useEffect(() => {
    if (draw?.scene) {
      excalidrawAPI?.updateScene(draw.scene)
      excalidrawAPI?.scrollToContent()
    } else {
      excalidrawAPI?.resetScene()
    }
  }, [draw])


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
            onChange={(_elements, _state) => {
              // handleChange([...elements], state)
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