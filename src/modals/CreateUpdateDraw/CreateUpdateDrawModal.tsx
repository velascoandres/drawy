import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import {
  FiEdit,
  FiInfo
} from 'react-icons/fi'

import { 
  Button, 
  Flex, 
  IconButton, 
  ModalBody, 
  ModalCloseButton, 
  ModalContent, 
  ModalFooter, 
  ModalHeader, 
} from '@chakra-ui/react'

import DrawInfo from '@/components/DrawInfo/DrawInfo'
import InputHF from '@/components/InputHF/InputHF'
import TextareaHF from '@/components/TextareaHF/TextareaHF'
import { useCreateDrawMutation, useUpdateDrawMutation } from '@/mutations/drawMutations'
import { IDrawInfo } from '@/services/drawService'
import useModalStore from '@/store/modal/modalStore'

interface IDrawForm {
  name: string
  description?: string
}

interface IProps {
  draw?: IDrawInfo
}

const CreateUpdateDrawModal = ({ draw }: IProps) => {
  const form = useForm<IDrawForm>({
    defaultValues: draw
  })

  const { mutate: createDraw, isSuccess } = useCreateDrawMutation()
  const { mutate: updateDraw, isSuccess: isUpdateSuccess } = useUpdateDrawMutation()

  const { closeModal } = useModalStore()


  const [showDrawInfo, setShowDrawInfo] = React.useState(Boolean(draw))

  const toggleShow = () => {
    setShowDrawInfo(oldState => !oldState)
  }

  const onSubmit = (formValues: IDrawForm) => {
    if (draw) {
      updateDraw({
        id: draw.id,
        name: formValues.name,
        description: formValues.description
      })
    } else {
      createDraw(formValues)
    }
  }

  React.useEffect(() => {
    if (isSuccess) {
      closeModal()
    }
  }, [isSuccess])

  React.useEffect(() => {
    if (isUpdateSuccess) {
      closeModal()
    }
  }, [isUpdateSuccess])
  
  return (
    <ModalContent>
      {
        showDrawInfo ? (
          <>
            <ModalHeader>
                Draw information
              <IconButton 
                aria-label="toogle-edit" 
                onClick={toggleShow} 
                icon={<FiEdit />}
                background="white" 
                _hover={{
                  bg: 'white',
                }} 
              />
            </ModalHeader>
            <ModalBody>
              <ModalCloseButton />
              <DrawInfo draw={draw as IDrawInfo} />
            </ModalBody>
            <ModalFooter gap={2}>
              <Button variant="ghost" onClick={closeModal}>Close</Button>
            </ModalFooter>
          </>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ModalHeader>
              {draw ? 'Edit Draw' : 'Create a new Draw'}
              {draw && (
                <IconButton
                  background="white" 
                  _hover={{
                    bg: 'white',
                  }}
                  aria-label="toogle-info" 
                  onClick={toggleShow} 
                  icon={<FiInfo />} 
                />
              )}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormProvider {...form}>
                <Flex direction="column" gap={2}>
                  <InputHF 
                    name="name" 
                    label="Name"
                    inputProps={{ placeholder: 'Write a name for your draw' }} 
                  />
                  <TextareaHF
                    name="description" 
                    label="Description"
                    textareaProps={{ placeholder: 'Write a full description for your draw' }}
                  />
                </Flex>
            
              </FormProvider>
            </ModalBody>
            <ModalFooter gap={2}>
              <Button variant="solid" colorScheme="messenger" type="submit">
                {draw ? 'Update' : 'Create'}
              </Button>
              <Button variant="ghost" onClick={closeModal}>Cancel</Button>
            </ModalFooter>
          </form>
        )
      }
    </ModalContent>
  )
}

export default CreateUpdateDrawModal