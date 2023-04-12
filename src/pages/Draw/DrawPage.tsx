import React from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { useParams } from 'react-router-dom'

import { 
  Box,
  Button,
  Divider, 
  Flex, 
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react'
import {
  Excalidraw,
} from '@excalidraw/excalidraw'
import {
  AppState,
  ExcalidrawImperativeAPI,
} from '@excalidraw/excalidraw/types/types'

import initialData from '@/constants/initial-data'
import useDebounceCallback from '@/hooks/useDebounceCallback'
import { useUpdateDrawMutation } from '@/mutations/drawMutations'
import { useGetDrawByIdQuery } from '@/queries/drawQueries'

const UPDATE_SCENE_DEBOUNCE = 1000

const DrawPage = () => {
  const params = useParams()
  const { data: draw } = useGetDrawByIdQuery(params.drawId as string)
  const { mutate: updateDraw } = useUpdateDrawMutation()

  const hasLoadedDrawRef = React.useRef<boolean>(false)

  const debounceUpdateScene = useDebounceCallback(UPDATE_SCENE_DEBOUNCE)

  const [viewModeEnabled] = React.useState(false)
  const [gridModeEnabled] = React.useState(false)
  const [theme] = React.useState('light')

  const [
    excalidrawAPI,
    setExcalidrawAPI
  ] = React.useState<ExcalidrawImperativeAPI | null>(null)

  const handleChange = (elements: any[], appState: AppState) => {
    if (!elements.length) {
      return
    }
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
        <Menu>
          <MenuButton as={Button} rightIcon={<FiChevronDown />}>
            Export
          </MenuButton>
          <MenuList zIndex={9999}>
            <MenuItem>SVG image</MenuItem>
            <MenuItem>PNG image</MenuItem>
            <MenuItem>Raw file</MenuItem>
          </MenuList>
        </Menu>
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