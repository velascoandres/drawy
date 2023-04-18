import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { 
  Button, 
  Flex, 
  Heading,
  ModalBody, 
  ModalCloseButton, 
  ModalContent, 
  ModalFooter, 
  ModalHeader, 
  Radio, 
  VStack
} from '@chakra-ui/react'

import RadioGroupHF from '@/components/RadioGroupHF/RadioGroupHF'
import SwitchHF from '@/components/SwitchHF/SwitchHF'
import { useGetDrawByIdQuery } from '@/queries/drawQueries'
import useModalStore from '@/store/modal/modalStore'

enum DrawTheme {
    DARK = 'dark',
    LIGHT = 'light'
}

enum ExportTarget {
    PNG = 'png',
    SVG = 'svg',
    JSON = 'json'
}

interface IProps {
    drawId: string
}

interface IExportForm {
    theme: DrawTheme
    target: ExportTarget
}


const ExportFile = (props: IProps) => {
  const { drawId } = props   

  const { data: draw } = useGetDrawByIdQuery(drawId)  
  const { closeModal } = useModalStore() 

  const form = useForm<IExportForm>()

  const handleExport = (config: IExportForm) => console.log(config)

  return (
    <ModalContent>
      <form onSubmit={form.handleSubmit(handleExport)}>
        <FormProvider {...form}>
          <ModalHeader>Export draw</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack direction="column" alignItems="start">
              <Heading as='h4' size='md'>
                Select the target:
              </Heading>        
              <Flex direction="column" gap={2}>
                <SwitchHF label="Export with dark mode:" name="theme" value={false} />
                <RadioGroupHF name="target" value={ExportTarget.SVG}>
                  <Radio value={ExportTarget.SVG}>SVG</Radio>
                  <Radio value={ExportTarget.PNG}>PNG</Radio>
                  <Radio value={ExportTarget.JSON}>JSON</Radio>
                </RadioGroupHF>  
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


export default ExportFile