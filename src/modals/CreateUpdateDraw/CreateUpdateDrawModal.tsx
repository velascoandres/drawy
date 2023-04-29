import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import {
  FiEdit,
  FiInfo
} from 'react-icons/fi'
import * as yup from 'yup'

import { 
  Button, 
  Flex, 
  IconButton, 
  ModalBody, 
  ModalCloseButton, 
  ModalContent, 
  ModalFooter, 
  ModalHeader,
  useToast, 
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'

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

const drawInfoSchema = yup.object().shape({
  name: yup.string().required('This field is required'),
  description: yup.string().nullable(),
})

const CreateUpdateDrawModal = ({ draw }: IProps) => {
  const toast = useToast()

  const form = useForm<IDrawForm>({
    defaultValues: draw,
    resolver: yupResolver(drawInfoSchema)
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

      toast({
        title: 'Draw created',
        position: 'bottom-right',
        status: 'success',
        isClosable: true,
      })
    }
  }, [closeModal, isSuccess, toast])

  React.useEffect(() => {
    if (isUpdateSuccess) {
      closeModal()

      toast({
        title: 'Draw info updated',
        position: 'bottom-right',
        status: 'success',
        isClosable: true,
      })
    }
  }, [closeModal, isUpdateSuccess, toast])
  
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
            </ModalBody>
            <ModalFooter gap={2}>
              <Button 
                variant="solid" 
                colorScheme="messenger" 
                type="submit"
              >
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