import React from 'react'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'

import { 
  Button, 
  Flex, 
  Heading,
  Image,
  ModalBody, 
  ModalCloseButton, 
  ModalContent, 
  ModalFooter, 
  ModalHeader, 
  Radio, 
  useToast, 
  VStack 
} from '@chakra-ui/react'
import { exportToBlob, exportToSvg } from '@excalidraw/excalidraw'
import type { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types'
import type { BinaryFiles } from '@excalidraw/excalidraw/types/types'
import { save } from '@tauri-apps/api/dialog'
import { writeBinaryFile } from '@tauri-apps/api/fs'
import { downloadDir } from '@tauri-apps/api/path'

import RadioGroupHF from '@/components/RadioGroupHF/RadioGroupHF'
import SwitchHF from '@/components/SwitchHF/SwitchHF'
import { useGetDrawByIdQuery } from '@/queries/drawQueries'
import { IDraw } from '@/services/drawService'
import useModalStore from '@/store/modal/modalStore'


type ExportTarget = 'png' | 'svg' | 'json'

interface IProps {
    drawId: string
}

interface IExportForm {
    withDarkTheme: boolean
    withEmbebScene: boolean,
    withBackground: boolean,
    target: ExportTarget
}


const ExportFile = (props: IProps) => {
  const { drawId } = props   

  const { data: draw } = useGetDrawByIdQuery(drawId)  
  const { closeModal } = useModalStore()
  const toast = useToast()

  const form = useForm<IExportForm>()

  const getSvgFile = (config: IExportForm) => {
    const elements = draw?.scene?.elements as ExcalidrawElement[] | null
    const files = draw?.scene?.rawFiles as BinaryFiles | null

    return exportToSvg({
      elements: elements || [],
      appState: {
        ...(draw?.scene?.appState || {}),
        theme: config.withDarkTheme ? 'dark' : 'light',
        exportWithDarkMode: config.withDarkTheme,
        exportBackground: config.withBackground,
        exportEmbedScene: config.withEmbebScene,
        exportScale: 1
      },
      files
    })
  }

  const getPngFile = (config: IExportForm) => {
    const elements = draw?.scene?.elements as ExcalidrawElement[] | null
    const files = draw?.scene?.rawFiles as BinaryFiles | null

    return exportToBlob({
      elements: elements || [],
      mimeType: 'image/png',
      appState: {
        ...(draw?.scene?.appState || {}),
        theme: config.withDarkTheme ? 'dark' : 'light',
        exportWithDarkMode: config.withDarkTheme,
        exportBackground: config.withBackground,
        exportEmbedScene: config.withEmbebScene,
        exportScale: 1
      },
      files
    })
  }

  const getJSONBlobFile = (config: IExportForm) => {
    const elements = draw?.scene?.elements as ExcalidrawElement[] | null
    const files = draw?.scene?.rawFiles as BinaryFiles | null


    const str = JSON.stringify({
      elements: elements || [],
      mimeType: 'image/png',
      appState: {
        ...(draw?.scene?.appState || {}),
        theme: config.withDarkTheme ? 'dark' : 'light',
      },
      files
    })
    const bytes = new TextEncoder().encode(str)

    const blob = new Blob([bytes], {
      type: 'application/json;charset=utf-8'
    })
    
    return Promise.resolve(blob)
  }

  const handleExport = async (config: IExportForm) => {
    if (!draw) {
      return
    }

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
        defaultPath: `${downloadsPath}/${draw.name.replace(' ', '-')}.${config.target}`,
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
    <ModalContent>
      <form onSubmit={form.handleSubmit(handleExport)}>
        <FormProvider {...form}>
          <ModalHeader>Export draw</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack direction="column" alignItems="start" gap={2}>
              <Heading as='h4' size='md'>
                Preview:
              </Heading>
              {
                draw && (<ExportPreview draw={draw} />)
              }        
              <Flex direction="row" gap={8} width="100%">
                <Flex direction="column">
                  <Heading as='h5' size="md">
                    Select the target:
                  </Heading>
                  <RadioGroupHF name="target" value="svg">
                    <Radio value="svg">SVG</Radio>
                    <Radio value="png">PNG</Radio>
                    <Radio value="json">JSON</Radio>
                  </RadioGroupHF>
                </Flex>

                <Flex direction="column" gap={2}>
                  <Heading as='h5' size="md">
                    Options:
                  </Heading>
                  {/* <SwitchHF label="Export with dark mode:" name="withDarkTheme" value={false} /> */}
                  <SwitchHF label="Export with embed scene:" name="withEmbebScene" value={false} />
                  <SwitchHF label="Mantain background:" name="withBackground" value={false} />  
                </Flex>
              </Flex>   
            </VStack>

          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} type="submit">
              Export
            </Button>
            <Button variant='ghost' onClick={closeModal}>
            Cancel
            </Button>
          </ModalFooter>
        </FormProvider>
      </form>
    </ModalContent>
  )
}

interface IPreviewProps {
  draw: IDraw 
}

const ExportPreview = (props: IPreviewProps) => {
  const { draw } = props
  const [exportPreview, setExportPreview] = React.useState<string>('')

  const { watch } = useFormContext<IExportForm>()

  const watchWithDarkTheme = watch('withDarkTheme')
  const watchWithBackground = watch('withBackground')
  const watchWithEmbebScene = watch('withEmbebScene')

  React.useEffect(() => {
    const elements = draw?.scene?.elements as ExcalidrawElement[] | null
    const files = draw?.scene?.rawFiles as BinaryFiles | null

    exportToBlob({
      elements: elements || [],
      mimeType: 'image/png',
      appState: {
        ...(draw?.scene?.appState || {}),
        exportWithDarkMode: watchWithDarkTheme,
        exportBackground: watchWithBackground,
        exportEmbedScene: watchWithEmbebScene,
        theme: watchWithDarkTheme ? 'dark' : 'light',
        exportScale: 0.1,
      },
      files
    }).then((file) => {
      const reader = new FileReader()

      reader.readAsDataURL(file) 
      reader.onloadend = () => {
        const base64data = reader.result as string          

        setExportPreview(base64data)
      }
    })
  }, [watchWithEmbebScene, watchWithDarkTheme, watchWithBackground, draw])

  return (
    <Flex direction="row" justifyContent="center" width="100%">
      <Image width="300px" src={exportPreview} alt={draw?.name} />
    </Flex>
  )
}

export default ExportFile