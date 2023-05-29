import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { FiFolder } from 'react-icons/fi'
import * as yup from 'yup'

import {
  Button,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
} from '@chakra-ui/react'
import { BinaryFileData, BinaryFiles } from '@excalidraw/excalidraw/types/types'
import { yupResolver } from '@hookform/resolvers/yup'

import DrawPreview from '@/components/DrawPreview/DrawPreview'
import InputHF from '@/components/InputHF/InputHF'
import TextareaHF from '@/components/TextareaHF/TextareaHF'
import { useCreateDrawMutation } from '@/mutations/drawMutations'
import { IDraw } from '@/services/drawService'
import useModalStore from '@/store/modal/modalStore'
import getDrawFiles, { type IEntryFile } from '@/utils/getDrawFiles'


type IDrawForm = Omit<IDraw, 'id'> & {
  scene: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    elements: readonly any[],
    files?: BinaryFileData[]
  }
}

const drawSchema = yup.object().shape({
  name: yup.string().required('This field is required'),
  description: yup.string().nullable(),
  scene: yup.object().nullable(),
})

const ImportFile = () => {
  const { closeModal } = useModalStore()
  const { mutate: createDraw } = useCreateDrawMutation()
  const [loadedFile, setLoadedFile] = React.useState(false)
  const [binaryFiles, setBinaryFiles] = React.useState<BinaryFiles>()
  const toast = useToast()

  const form = useForm<IDrawForm>({
    defaultValues: {
      name: '',
      description: '',
      scene: {
        elements: [],
        files: []
      }
    },
    resolver: yupResolver(drawSchema)
  })

  const handleSuccess = () => {
    toast({
      status: 'success',
      title: 'Draw was imported',
      position: 'bottom-right',
    })
    closeModal()
  }

  const handleError = () => {
    toast({
      status: 'error',
      title: 'Error on importing draw',
      position: 'bottom-right',
    })
  }

  const onSubmit = (formValues: IDrawForm) => {
    createDraw(formValues, { 
      onSuccess: handleSuccess, 
      onError: handleError 
    })
  }


  const openFileExplorer = React.useCallback(() => {
    getDrawFiles({ multiple: false })
    .then((files) => {
      const drawFile = files as IEntryFile 

      setLoadedFile(true)
      setBinaryFiles(drawFile.files || {})

      form.setValue('name', drawFile.drawName)
      form.setValue('description', drawFile.drawDescription)
      form.setValue('scene', {
        appState: {},
        elements: drawFile.elements || [],
        files: Object.values(drawFile.files || {}) as BinaryFileData[]
      })
    }).catch(() => {
      toast({
        status: 'error',
        title: 'Error on loading file',
        position: 'bottom-right',
      })
    })
  }, [form, toast])

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px">Import from file</DrawerHeader>
        <DrawerCloseButton />
        <DrawerBody>
          {
            loadedFile ? (<Tabs>
              <TabList>
                <Tab>Draw information</Tab>
                <Tab>Preview</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <FormProvider {...form}>
                    <Flex direction="column" gap={2}>
                      <InputHF
                        name="name"
                        label="Name"
                        inputProps={{ placeholder: 'Write a name for your draw' }}
                        helperText="Type a draw name"
                      />
                      <TextareaHF
                        name="description"
                        label="Description"
                        textareaProps={{ placeholder: 'Write a full description for your draw' }}
                        helperText="Provide a complete description for the draw"
                      />
                    </Flex>

                  </FormProvider>
                </TabPanel>
                <TabPanel>
                  <DrawPreview
                    drawScene={{
                      ...form.watch('scene') || {},
                      appState: {},
                      files: binaryFiles,
                    }}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
            ) : (
              <Flex direction="column" justify="center" alignItems="center" height="100%">
                <Button
                  leftIcon={<FiFolder />}
                  variant="outline"
                  mx={4}
                  onClick={openFileExplorer}
                >
                  Open explorer
                </Button>
              </Flex>
            )
          }
        </DrawerBody>
        <DrawerFooter gap={2}>
          <Button
            variant="solid"
            colorScheme="blue"
            type="submit"
            disabled={!form.formState.isValid}
          >
            Import
          </Button>
          <Button variant="ghost" onClick={closeModal}>Cancel</Button>
        </DrawerFooter>
      </DrawerContent>
    </form>
  )
}

export default ImportFile