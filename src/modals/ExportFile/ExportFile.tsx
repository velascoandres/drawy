import { FormProvider, useForm } from 'react-hook-form'

import { 
  Button,
  DrawerBody, 
  DrawerCloseButton, 
  DrawerContent, 
  DrawerFooter, 
  DrawerHeader, 
  Flex, 
  Heading,
  Radio, 
  useToast, 
  VStack 
} from '@chakra-ui/react'
import { exportToBlob, exportToSvg } from '@excalidraw/excalidraw'
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types'
import { save } from '@tauri-apps/api/dialog'
import { writeBinaryFile } from '@tauri-apps/api/fs'
import { downloadDir } from '@tauri-apps/api/path'

import DrawPreview from '@/components/DrawPreview/DrawPreview'
import RadioGroupHF from '@/components/RadioGroupHF/RadioGroupHF'
import SwitchHF from '@/components/SwitchHF/SwitchHF'
import { IDrawInfo } from '@/services/drawService'
import useModalStore from '@/store/modal/modalStore'


type ExportTarget = 'png' | 'svg' | 'json'
interface IProps {
    drawInfo: IDrawInfo
    drawApi: ExcalidrawImperativeAPI
}

interface IExportForm {
    withDarkTheme: boolean
    withEmbebScene: boolean,
    withBackground: boolean,
    target: ExportTarget
}


const ExportFile = (props: IProps) => {
  const { closeModal } = useModalStore()
  const toast = useToast()
  const form = useForm<IExportForm>()

  const { drawApi, drawInfo } = props

  const getSvgFile = (config: IExportForm) => {
    return exportToSvg({
      elements: drawApi.getSceneElements(),
      appState: {
        ...(drawApi.getAppState() || {}),
        theme: config.withDarkTheme ? 'dark' : 'light',
        exportWithDarkMode: config.withDarkTheme,
        exportBackground: config.withBackground,
        exportEmbedScene: config.withEmbebScene,
        exportScale: 1
      },
      files: drawApi.getFiles()
    })
  }

  const getPngFile = (config: IExportForm) => {
    return exportToBlob({
      elements: drawApi.getSceneElements(),
      mimeType: 'image/png',
      appState: {
        ...(drawApi.getAppState() || {}),
        theme: config.withDarkTheme ? 'dark' : 'light',
        exportWithDarkMode: config.withDarkTheme,
        exportBackground: config.withBackground,
        exportEmbedScene: config.withEmbebScene,
        exportScale: 1
      },
      files: drawApi.getFiles()
    })
  }

  const getJSONBlobFile = (config: IExportForm) => {
    const str = JSON.stringify({
      drawName: drawInfo.name,
      drawDescription: drawInfo.description,
      elements: drawApi.getSceneElements(),
      mimeType: 'image/png',
      appState: {
        ...(drawApi.getAppState() || {}),
        theme: config.withDarkTheme ? 'dark' : 'light',
      },
      files: drawApi.getFiles()
    })
    const bytes = new TextEncoder().encode(str)

    const blob = new Blob([bytes], {
      type: 'application/json;charset=utf-8'
    })
    
    return Promise.resolve(blob)
  }

  const handleExport = async (config: IExportForm) => {
    try {
      const saveHandlers: Record<ExportTarget, (config: IExportForm) => Promise<SVGElement | Blob>> = {
        svg: getSvgFile,
        png: getPngFile,
        json: getJSONBlobFile,
      }

      const getFileHandler = saveHandlers[config.target]

      const file = await getFileHandler(config)
      const downloadsPath = await downloadDir()

      const path = await save({
        defaultPath: `${downloadsPath}/${drawInfo.name.replace(' ', '-')}.${config.target}`,
      })


      if (!path) {
        return
      }

      let fileBlob

      if (config.target === 'svg') {
        const svgFile = file as SVGElement

        fileBlob = new Blob([svgFile.outerHTML], { type: 'image/svg+xml' })
      } else {
        fileBlob = file as Blob
      }

      const buffer = await fileBlob.arrayBuffer()

      await writeBinaryFile(path, buffer)

      toast({
        status: 'success',
        title: 'Draw exported',
        position: 'bottom-right',
      })

      closeModal()
    } catch (e) {
      toast({
        status: 'error',
        title: 'Export to file error',
        position: 'bottom-right',
      })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleExport)}>
      <DrawerContent>
        <FormProvider {...form}>
          <DrawerHeader borderBottomWidth="1px">Export draw</DrawerHeader>
          <DrawerCloseButton />
          <DrawerBody>
            <VStack direction="column" alignItems="start" gap={2}>        
              <Flex direction="row" gap={8} width="100%">
                <Flex direction="column" gap={2}>
                  <Heading as='h5' size="sm">
                    Target:
                  </Heading>
                  <RadioGroupHF name="target" value="svg">
                    <Radio value="svg">SVG</Radio>
                    <Radio value="png">PNG</Radio>
                    <Radio value="json">JSON</Radio>
                  </RadioGroupHF>
                </Flex>

                <Flex direction="column" gap={2}>
                  <Heading as='h5' size="sm">
                    Options:
                  </Heading>
                  <SwitchHF label="Export with dark mode:" name="withDarkTheme" value={false} />
                  <SwitchHF label="Export with embed scene:" name="withEmbebScene" value={false} />
                  <SwitchHF label="Mantain background:" name="withBackground" value={false} />  
                </Flex>
              </Flex>
              <Heading as='h4' size='md'>
                Preview:
              </Heading>
              <Flex direction="column" justifyContent="center" alignItems="center">
                {
                  drawApi && 
                <DrawPreview 
                  darkMode={form.watch('withDarkTheme')}
                  includeBackground={form.watch('withBackground')}
                  embebScene={form.watch('withEmbebScene')}
                  drawScene={{
                    elements: drawApi.getSceneElements(),
                    appState: drawApi.getAppState(),
                    files: drawApi.getFiles()
                  }} 
                />
                }
              </Flex>   
            </VStack>

          </DrawerBody>
          <DrawerFooter>
            <Button colorScheme="blue" mr={3} type="submit">
              Export
            </Button>
            <Button variant='ghost' onClick={closeModal}>
            Cancel
            </Button>
          </DrawerFooter>
        </FormProvider>
      </DrawerContent>
    </form>
  )
}

export default ExportFile