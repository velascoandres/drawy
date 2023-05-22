import React from 'react'
import { FiUpload } from 'react-icons/fi'

import {
  Button,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Flex,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text
} from '@chakra-ui/react'

import DrawPreview from '@/components/DrawPreview/DrawPreview'
import useModalStore from '@/store/modal/modalStore'
import getDrawFiles, { IEntryFile } from '@/utils/getDrawFiles'


const ImportFile = () => {
  const [selectedFile, setSelectedFile] = React.useState<IEntryFile>()

  const { closeModal } = useModalStore()

  const openFileExplorer = React.useCallback(() => {
    getDrawFiles({ multiple: false })
    .then((files) => {
      console.log(files)
      setSelectedFile(files as IEntryFile)
    })
  }, [])

  return (
    <DrawerContent>
      <DrawerHeader borderBottomWidth="1px">Import from file</DrawerHeader>
      <DrawerCloseButton />
      <DrawerBody>
        {
          selectedFile ? (<Tabs>
            <TabList>
              <Tab>Draw information</Tab>
              <Tab>Preview</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Heading as='h5' size="sm">
                  {selectedFile.drawName}
                </Heading>
                <Text fontSize='lg'>
                  {selectedFile.drawDescription}
                </Text>
              </TabPanel>
              <TabPanel>
                <DrawPreview
                  drawScene={{
                    appState: selectedFile.appState || {},
                    elements: selectedFile.elements || [],
                    files: selectedFile.files || null
                  }}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
          ) : (
            <Flex direction="column" justify="center" alignItems="center" height="100%">
              <Button 
                leftIcon={<FiUpload />} 
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
          background="black"
          color="white"
          type="button"
          disabled={!Boolean(selectedFile)}
        >
          Import
        </Button>
        <Button variant="ghost" onClick={closeModal}>Cancel</Button>
      </DrawerFooter>
    </DrawerContent>
  )
}

export default ImportFile